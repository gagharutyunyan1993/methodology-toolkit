#!/usr/bin/env node
// Deterministic contract checks for the plugin's subagent reports (red-team-critic, evidence-scout).
//
// Two uses:
//   1. Hook (PreToolUse on the subagent hand-back tool, and SubagentStop for runtimes that return the
//      report as the final message): validates the report of red-team-critic / evidence-scout. On a
//      contract violation the subagent is sent back once to fix it (MAX_RETRIES); after that the report
//      passes as is. Every check is logged as {time, event, agent, attempt, ok, retry, errors} to
//      <plugin-data-dir>/report-checks.jsonl — never the report content.
//   2. CLI for tests/CI:  node check-report.mjs --check <critic|scout> <file.json>
import { readFileSync, appendFileSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const LEVELS = new Set(['high', 'medium', 'low']);
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isStr = (v) => typeof v === 'string' && v.length > 0;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

function exactKeys(o, keys, where, errs) {
  if (!isObj(o)) return errs.push(`${where}: not an object`);
  for (const k of keys) if (!(k in o)) errs.push(`${where}: missing "${k}"`);
  for (const k of Object.keys(o)) if (!keys.includes(k)) errs.push(`${where}: unexpected key "${k}"`);
}
function confidence(c, where, errs) {
  exactKeys(c, ['level', 'reason'], where, errs);
  if (isObj(c) && !LEVELS.has(c.level)) errs.push(`${where}.level: "${c.level}" not high|medium|low`);
}
function uniqueIds(list, where, errs) {
  const ids = new Set();
  for (const x of list ?? []) {
    if (!isStr(x?.id)) errs.push(`${where}: item without id`);
    else if (ids.has(x.id)) errs.push(`${where}: duplicate id "${x.id}"`);
    else ids.add(x.id);
  }
  return ids;
}

export function checkCritic(r) {
  const errs = [];
  exactKeys(r, ['schema_version', 'review_id', 'target', 'verdict', 'verdict_confidence', 'methods', 'evidence', 'defects', 'hypotheses', 'checks', 'limits'], 'report', errs);
  if (!isObj(r)) return errs;
  if (r.schema_version !== 1) errs.push('schema_version must be 1');
  const verdicts = ['material_defects_found', 'no_confirmed_material_defects', 'insufficient_evidence'];
  if (!verdicts.includes(r.verdict)) errs.push(`verdict "${r.verdict}" invalid`);
  const notArrays = ['methods', 'evidence', 'defects', 'hypotheses', 'checks'].filter((k) => !Array.isArray(r[k]));
  if (notArrays.length) return [...errs, ...notArrays.map((k) => `${k} must be an array`)];
  if ((r.verdict === 'material_defects_found') !== (r.defects.length > 0)) errs.push('verdict material_defects_found iff defects non-empty');
  confidence(r.verdict_confidence, 'verdict_confidence', errs);
  const methodIds = new Set();
  for (const m of r.methods) {
    exactKeys(m, ['id', 'steps'], 'methods[]', errs);
    if (!['red-team', 'ach', 'pre-mortem', 'sat'].includes(m?.id)) errs.push(`methods[].id "${m?.id}" invalid`);
    if (methodIds.has(m?.id)) errs.push(`methods: duplicate "${m.id}"`);
    methodIds.add(m?.id);
    if (!Array.isArray(m?.steps) || m.steps.length === 0) errs.push(`methods[${m?.id}].steps empty`);
  }
  const ev = uniqueIds(r.evidence, 'evidence', errs);
  const ch = uniqueIds(r.checks, 'checks', errs);
  uniqueIds(r.defects, 'defects', errs);
  uniqueIds(r.hypotheses, 'hypotheses', errs);
  for (const e of r.evidence) {
    exactKeys(e, ['id', 'source', 'scope', 'observation', 'origin', 'observation_id', 'observation_confidence'], `evidence[${e?.id}]`, errs);
    if (!['read', 'brief'].includes(e?.origin)) errs.push(`evidence[${e?.id}].origin invalid`);
    confidence(e?.observation_confidence, `evidence[${e?.id}].observation_confidence`, errs);
  }
  for (const d of r.defects) {
    exactKeys(d, ['id', 'claim', 'basis', 'evidence_ids', 'argument', 'decision_effect', 'conclusion_confidence'], `defects[${d?.id}]`, errs);
    if (!['observed', 'deduced'].includes(d?.basis)) errs.push(`defects[${d?.id}].basis invalid`);
    if (d?.basis === 'deduced' && !isStr(d?.argument)) errs.push(`defects[${d?.id}]: deduced without argument`);
    for (const id of d?.evidence_ids ?? []) if (!ev.has(id)) errs.push(`defects[${d.id}]: unknown evidence "${id}"`);
    confidence(d?.conclusion_confidence, `defects[${d?.id}].conclusion_confidence`, errs);
  }
  for (const h of r.hypotheses) {
    exactKeys(h, ['id', 'claim', 'evidence_ids', 'check_ids'], `hypotheses[${h?.id}]`, errs);
    for (const id of h?.evidence_ids ?? []) if (!ev.has(id)) errs.push(`hypotheses[${h.id}]: unknown evidence "${id}"`);
    for (const id of h?.check_ids ?? []) if (!ch.has(id)) errs.push(`hypotheses[${h.id}]: unknown check "${id}"`);
  }
  for (const c of r.checks) {
    exactKeys(c, ['id', 'requirement', 'command', 'preconditions', 'effects', 'fail_if', 'status'], `checks[${c?.id}]`, errs);
    if (!['not_run', 'blocked'].includes(c?.status)) errs.push(`checks[${c?.id}].status invalid`);
    if (!['none', 'local_artifacts', 'external', 'unknown'].includes(c?.effects)) errs.push(`checks[${c?.id}].effects invalid`);
  }
  exactKeys(r.limits, ['checked', 'not_checked'], 'limits', errs);
  return errs;
}

export function checkScout(r) {
  const errs = [];
  exactKeys(r, ['schema_version', 'scope', 'accessed', 'web_access', 'facts', 'conflicts', 'not_found', 'gaps'], 'report', errs);
  if (!isObj(r)) return errs;
  if (r.schema_version !== 1) errs.push('schema_version must be 1');
  const notArrays = ['facts', 'conflicts', 'not_found', 'gaps'].filter((k) => !Array.isArray(r[k]));
  if (notArrays.length) return [...errs, ...notArrays.map((k) => `${k} must be an array`)];
  if (r.facts.length > 10) errs.push(`facts: ${r.facts.length} > 10`);
  const ids = uniqueIds(r.facts, 'facts', errs);
  for (const f of r.facts) {
    exactKeys(f, ['id', 'claim', 'finding', 'source_ref', 'source_type', 'tier', 'self_reported', 'page_date', 'accessed', 'quote', 'evidence_kind'], `facts[${f?.id}]`, errs);
    if (!['primary', 'secondary', 'inferred'].includes(f?.tier)) errs.push(`facts[${f?.id}].tier invalid`);
    if (!isStr(f?.source_ref)) errs.push(`facts[${f?.id}]: empty source_ref`);
    if (!isStr(f?.quote)) errs.push(`facts[${f?.id}]: empty quote`);
    else if (f.quote.length > 200) errs.push(`facts[${f?.id}]: quote > 200 chars`);
    if (!DATE.test(f?.accessed ?? '')) errs.push(`facts[${f?.id}]: accessed not YYYY-MM-DD`);
    if (f?.page_date !== null && !DATE.test(f?.page_date ?? '')) errs.push(`facts[${f?.id}]: page_date not YYYY-MM-DD or null`);
    if (![null, 'behaviour', 'opinion'].includes(f?.evidence_kind)) errs.push(`facts[${f?.id}].evidence_kind invalid`);
  }
  for (const c of r.conflicts) for (const id of c?.fact_ids ?? []) if (!ids.has(id)) errs.push(`conflicts: unknown fact "${id}"`);
  return errs;
}

export function parseReport(text) {
  const t = String(text ?? '').trim();
  try { return { report: JSON.parse(t) }; } catch (e) { return { error: `not a single JSON object: ${e.message.slice(0, 80)}` }; }
}

export function checkText(kind, text) {
  const { report, error } = parseReport(text);
  if (error) return [error];
  return kind === 'critic' ? checkCritic(report) : checkScout(report);
}

// Error texts quote values from the report (key names, verdicts, ids, the start of non-JSON text).
// The subagent needs them to correct its report; the log must not keep them.
export const redactForLog = (errors) =>
  errors.map((e) => String(e).replace(/"[^"]*(?:"|$)|'[^']*(?:'|$)/g, '"…"').replace(/\[[^\]]*\]/g, '[]'));

const AGENTS = { 'red-team-critic': 'critic', 'evidence-scout': 'scout' };

// The subagent's final report: `last_assistant_message` when the payload carries it; otherwise the
// last hand-back tool call (its `message` input) or, failing that, the last assistant text in the
// subagent transcript.
export function reportFromTranscript(jsonl) {
  const entries = String(jsonl ?? '').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } });
  const assistant = entries.filter((e) => e?.type === 'assistant' && Array.isArray(e.message?.content)).reverse();
  for (const e of assistant) {
    const handback = e.message.content.find((b) => b.type === 'tool_use' && /handback/i.test(b.name ?? '') && typeof b.input?.message === 'string');
    if (handback) return handback.input.message;
  }
  for (const e of assistant) {
    const text = e.message.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
    if (text.trim()) return text;
  }
  return null;
}

function finalReport(payload) {
  if (typeof payload.last_assistant_message === 'string' && payload.last_assistant_message.trim()) return { report: payload.last_assistant_message, via: 'message' };
  if (!payload.agent_transcript_path) return { report: null, via: 'none' };
  try {
    const jsonl = readFileSync(payload.agent_transcript_path, 'utf8');
    return { report: reportFromTranscript(jsonl), via: /"name":"[^"]*[Hh]andback"/.test(jsonl) ? 'handback' : 'transcript' };
  } catch { return { report: null, via: 'none' }; }
}

const MAX_RETRIES = 1;
const retryReason = (errors) => `Your report does not match the output contract in your instructions: ${errors.slice(0, 10).join('; ')}. Send the complete corrected report as one JSON object, nothing else.`;

// Pure decision for one hook event. `priorRetries` = how many times this agent run was already sent
// back. Returns { kind, errors, retry, output } or null when the event is not ours / nothing to do.
export function decide(payload, priorRetries = 0) {
  const kind = AGENTS[String(payload.agent_type ?? '').split(':').pop()];
  if (!kind) return null;
  if (payload.hook_event_name === 'PreToolUse') {
    // The report is checked before it is handed back, so a contract violation can still be fixed.
    if (!/handback/i.test(payload.tool_name ?? '') || typeof payload.tool_input?.message !== 'string') return null;
    const errors = checkText(kind, payload.tool_input.message);
    const retry = errors.length > 0 && priorRetries < MAX_RETRIES;
    return { kind, errors, retry, output: retry ? { hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny', permissionDecisionReason: retryReason(errors) } } : null };
  }
  if (payload.hook_event_name === 'SubagentStop') {
    const { report, via } = finalReport(payload);
    if (via === 'handback') return null; // already checked at PreToolUse
    const errors = report === null ? ['final report not found in hook payload or agent transcript'] : checkText(kind, report);
    const retry = errors.length > 0 && report !== null && !payload.stop_hook_active && priorRetries < MAX_RETRIES;
    return { kind, errors, retry, output: retry ? { decision: 'block', reason: retryReason(errors) } : null };
  }
  return null;
}

async function hookMain() {
  let raw = '';
  for await (const chunk of process.stdin) raw += chunk;
  let payload;
  try { payload = JSON.parse(raw); } catch { return; }
  const dataDir = process.argv[2];
  const counter = dataDir && payload.agent_id ? join(dataDir, 'retries', `${String(payload.agent_id).replace(/[^\w-]/g, '')}.count`) : null;
  let prior = 0;
  try { if (counter) prior = Number(readFileSync(counter, 'utf8')) || 0; } catch { /* first attempt */ }
  // Without a place to count retries, never send a report back: a loop is worse than a bad report.
  const result = decide(payload, counter ? prior : MAX_RETRIES);
  if (!result) return;
  if (dataDir) {
    try {
      mkdirSync(join(dataDir, 'retries'), { recursive: true });
      if (result.retry) writeFileSync(counter, String(prior + 1));
      else if (counter) rmSync(counter, { force: true }); // the report goes through: this run is done
      appendFileSync(join(dataDir, 'report-checks.jsonl'), JSON.stringify({ time: new Date().toISOString(), event: payload.hook_event_name, agent: payload.agent_type, attempt: prior + 1, ok: result.errors.length === 0, retry: result.retry, errors: redactForLog(result.errors.slice(0, 20)) }) + '\n');
    } catch { /* never fail the session over logging */ }
  }
  if (result.output) process.stdout.write(JSON.stringify(result.output));
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (!isMain) {
  // imported as a module (tests): no side effects
} else if (process.argv[2] === '--check') {
  const [kind, file] = process.argv.slice(3);
  const errors = checkText(kind, readFileSync(file, 'utf8'));
  if (errors.length) { console.error(errors.map((e) => '✗ ' + e).join('\n')); process.exit(1); }
  console.log(`✓ ${kind} report valid`);
} else {
  hookMain().catch(() => {}).finally(() => process.exit(0));
}
