#!/usr/bin/env node
// Tests for plugins/methodology-toolkit/hooks/check-report.mjs. Run: node scripts/test-check-report.mjs
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkText } from '../plugins/methodology-toolkit/hooks/check-report.mjs';

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
if (failed) process.exit(1);
console.log(`✓ check-report: ${cases.length + 1} cases`);
