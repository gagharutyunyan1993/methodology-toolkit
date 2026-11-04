#!/usr/bin/env node
// Tests for plugins/methodology-toolkit/hooks/check-report.mjs. Run: node scripts/test-check-report.mjs
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkText, reportFromTranscript, decide, redactForLog } from '../plugins/methodology-toolkit/hooks/check-report.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const fx = (f) => readFileSync(join(here, 'fixtures', f), 'utf8');
const cases = [
  ['critic', 'critic-valid.json', []],
  ['scout', 'scout-valid.json', []],
  ['critic', 'critic-invalid.json', ['unexpected key "extra"', 'verdict material_defects_found iff defects non-empty', 'unknown evidence "E9"']],
  ['scout', 'scout-invalid.json', ['tier invalid', 'quote > 200 chars', 'unknown fact "F7"']],
];
let failed = 0;
for (const [kind, file, expected] of cases) {
  const errs = checkText(kind, fx(file));
  const ok = expected.length === 0 ? errs.length === 0 : expected.every((e) => errs.some((x) => x.includes(e)));
  if (!ok) { failed++; console.error(`✗ ${file}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(errs)}`); }
}
if (checkText('critic', 'Here is my review').length === 0) { failed++; console.error('✗ prose accepted as a critic report'); }

// Final report extraction from a subagent transcript: hand-back tool call wins over later text.
const line = (content) => JSON.stringify({ type: 'assistant', message: { content } });
const transcript = [
  line([{ type: 'text', text: 'reading the cards' }]),
  line([{ type: 'thinking', thinking: '' }, { type: 'tool_use', name: 'SubagentHandback', input: { message: '{"a":1}' } }]),
  JSON.stringify({ type: 'user', message: { content: [{ type: 'tool_result', content: 'delivered' }] } }),
  line([{ type: 'text', text: 'done' }]),
].join('\n');
const extraction = [
  [transcript, '{"a":1}'],
  [[line([{ type: 'text', text: 'first' }]), line([{ type: 'text', text: '{"b":2}' }])].join('\n'), '{"b":2}'],
  ['not json\n', null],
];
for (const [input, expected] of extraction) {
  const got = reportFromTranscript(input);
  if (got !== expected) { failed++; console.error(`✗ reportFromTranscript: expected ${expected}, got ${got}`); }
}
// Hook decisions: a bad hand-back is sent back once, then passes; other agents and tools are ignored.
const valid = fx('critic-valid.json');
const pre = (message, agent = 'methodology-toolkit:red-team-critic', tool = 'SubagentHandback') =>
  ({ hook_event_name: 'PreToolUse', agent_type: agent, tool_name: tool, tool_input: { message } });
const decisions = [
  ['valid report passes', decide(pre(valid), 0), (r) => r.retry === false && r.output === null && r.errors.length === 0],
  ['bad report denied on first attempt', decide(pre('not json'), 0), (r) => r.retry && r.output.hookSpecificOutput.permissionDecision === 'deny'],
  ['bad report passes after one retry', decide(pre('not json'), 1), (r) => !r.retry && r.output === null && r.errors.length > 0],
  ['other agent ignored', decide(pre('not json', 'general-purpose'), 0), (r) => r === null],
  ['other tool ignored', decide(pre('not json', undefined, 'Read'), 0), (r) => r === null],
  ['stop: bad final message blocked once', decide({ hook_event_name: 'SubagentStop', agent_type: 'red-team-critic', last_assistant_message: 'prose', stop_hook_active: false }, 0), (r) => r.retry && r.output.decision === 'block'],
  ['stop: no second block', decide({ hook_event_name: 'SubagentStop', agent_type: 'red-team-critic', last_assistant_message: 'prose', stop_hook_active: true }, 0), (r) => !r.retry && r.output === null],
];
for (const [name, result, ok] of decisions) if (!ok(result)) { failed++; console.error(`✗ decide: ${name} — got ${JSON.stringify(result)}`); }

// The log keeps the shape of each error, never strings copied from the report.
const logged = JSON.stringify(redactForLog([
  ...checkText('critic', 'Here is my report, long enough for the parser message to cut it off mid-quote'),
  ...checkText('critic', fx('critic-invalid.json')),
  ...checkText('scout', fx('scout-invalid.json')),
]));
const leaks = ['Here is', 'extra', 'E9', 'F7'].filter((x) => logged.includes(x));
if (leaks.length) { failed++; console.error(`✗ redactForLog leaks ${JSON.stringify(leaks)}: ${logged}`); }

if (failed) process.exit(1);
console.log(`✓ check-report: ${cases.length + 2 + extraction.length + decisions.length} cases`);
