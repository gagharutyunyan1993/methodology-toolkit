#!/usr/bin/env node
// Integrity checks for the methodology-driven-thinking skill package.
// Pure Node, no dependencies. Run: node scripts/validate-skill.mjs
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const plugin = join(repoRoot, 'plugins', 'methodology-toolkit');
const skillDir = join(plugin, 'skills', 'methodology-driven-thinking');
const refDir = join(skillDir, 'references');
const errors = [];
const read = (p) => readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

// 1. Registry <-> card files
const registry = JSON.parse(read(join(refDir, 'methods.json')));
const methods = registry.methods ?? [];
const slugs = new Set();
const aliasOwner = new Map();
for (const m of methods) {
  if (!m.slug || !m.name || !m.file) errors.push(`methods.json: entry missing slug/name/file: ${JSON.stringify(m)}`);
  if (slugs.has(m.slug)) errors.push(`methods.json: duplicate slug "${m.slug}"`);
  slugs.add(m.slug);
  if (!existsSync(join(skillDir, m.file))) errors.push(`methods.json: "${m.slug}" points to missing ${m.file}`);
  for (const a of new Set([m.slug, ...(m.aliases ?? [])])) {
    const key = a.toLowerCase().replace(/[\s_]+/g, '-');
    if (aliasOwner.has(key) && aliasOwner.get(key) !== m.slug) errors.push(`methods.json: alias "${a}" used by both "${aliasOwner.get(key)}" and "${m.slug}"`);
    aliasOwner.set(key, m.slug);
  }
}
for (const f of readdirSync(refDir).filter((f) => f.endsWith('.md'))) {
  const slug = f.replace(/\.md$/, '');
  if (!slugs.has(slug)) errors.push(`references/${f}: card not listed in methods.json`);
}

// 2. Selection map in SKILL.md uses only registered slugs, and covers every method except the dispatcher
const skill = read(join(skillDir, 'SKILL.md'));
const mapStart = skill.indexOf('| Task type');
const mapEnd = skill.indexOf('\n\n', mapStart);
const mapSlugs = new Set([...skill.slice(mapStart, mapEnd).matchAll(/`([a-z0-9-]+)`/g)].map((x) => x[1]));
if (mapStart < 0) errors.push('SKILL.md: selection map ("| Task type" table) not found');
for (const s of mapSlugs) if (!slugs.has(s)) errors.push(`SKILL.md selection map: unknown slug "${s}"`);
const notRouted = [...slugs].filter((s) => !mapSlugs.has(s) && s !== 'cynefin');
if (notRouted.length) errors.push(`SKILL.md selection map: methods with no route: ${notRouted.join(', ')}`);

// 3. Card references in runtime files resolve
const runtimeFiles = [
  join(skillDir, 'SKILL.md'),
  join(plugin, 'commands', 'method.md'),
  ...readdirSync(join(plugin, 'agents')).map((f) => join(plugin, 'agents', f)),
];
for (const f of runtimeFiles) {
  const text = read(f);
  for (const [, slug] of text.matchAll(/references\/([a-z0-9-]+)\.md/g)) {
    if (!slugs.has(slug)) errors.push(`${f.slice(repoRoot.length + 1)}: references/${slug}.md does not exist`);
  }
  if (/methodology\.md/.test(text)) errors.push(`${f.slice(repoRoot.length + 1)}: still references the removed methodology.md`);
}

// 4. No model-version-specific notes in runtime text (they go stale with the model)
const versionRe = /\b(Opus|Sonnet|Haiku|Fable)\s*\d/;
for (const f of [...runtimeFiles, ...readdirSync(refDir).filter((f) => f.endsWith('.md')).map((f) => join(refDir, f))]) {
  const m = read(f).match(versionRe);
  if (m) errors.push(`${f.slice(repoRoot.length + 1)}: model-version note "${m[0]}" in runtime text`);
}

// 5. Size budgets
const fm = skill.split('---')[1] ?? '';
const desc = (fm.match(/^description: (.*)$/m) ?? [])[1] ?? '';
const when = (fm.match(/^when_to_use: (.*)$/m) ?? [])[1] ?? '';
if (desc.length + when.length > 1536) errors.push(`SKILL.md: description + when_to_use = ${desc.length + when.length} chars (> 1536, gets truncated in the listing)`);
const lines = skill.split('\n').length;
if (lines > 500) errors.push(`SKILL.md: ${lines} lines (> 500)`);

if (errors.length) {
  console.error(errors.map((e) => '✗ ' + e).join('\n'));
  process.exit(1);
}
console.log(`✓ ${methods.length} methods, ${mapSlugs.size} routed in SKILL.md, SKILL.md ${lines} lines, listing text ${desc.length + when.length} chars`);
