#!/usr/bin/env node
// Deterministic contract checks for the plugin's subagent reports (red-team-critic, evidence-scout).
//
// Two uses:
//   1. SubagentStop hook (observe mode): reads the hook payload on stdin, validates the subagent's
//      final message if it is one of ours, appends {time, agent, ok, errors} to
//      <plugin-data-dir>/report-checks.jsonl. Never blocks, never logs report content.
//   2. CLI for tests/CI:  node check-report.mjs --check <critic|scout> <file.json>
import { readFileSync, appendFileSync, mkdirSync } from 'node:fs';
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

const AGENTS = { 'red-team-critic': 'critic', 'evidence-scout': 'scout' };

async function hookMain() {
  let raw = '';
  for await (const chunk of process.stdin) raw += chunk;
  let payload;
  try { payload = JSON.parse(raw); } catch { return; }
  const type = String(payload.agent_type ?? '').split(':').pop();
  const kind = AGENTS[type];
  if (!kind) return;
  const errors = checkText(kind, payload.last_assistant_message);
  const dataDir = process.argv[2];
  if (!dataDir) return;
  try {
    mkdirSync(dataDir, { recursive: true });
    appendFileSync(join(dataDir, 'report-checks.jsonl'), JSON.stringify({ time: new Date().toISOString(), agent: type, ok: errors.length === 0, errors: errors.slice(0, 20) }) + '\n');
  } catch { /* observe mode: never fail the session */ }
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
