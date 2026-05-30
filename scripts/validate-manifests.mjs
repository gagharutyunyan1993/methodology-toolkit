#!/usr/bin/env node
// Validates the marketplace catalog and every plugin manifest it lists.
// Pure Node, no dependencies — safe to run in CI without auth or network.
// Run: node scripts/validate-manifests.mjs
import { readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const ok = [];

function readJson(path, label) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (e) {
    errors.push(`${label}: invalid JSON — ${e.message}`);
    return null;
  }
}

const marketplacePath = join(repoRoot, '.claude-plugin', 'marketplace.json');
if (!existsSync(marketplacePath)) {
  errors.push('.claude-plugin/marketplace.json: missing');
} else {
  const mk = readJson(marketplacePath, 'marketplace.json');
  if (mk) {
    if (!mk.name) errors.push('marketplace.json: missing "name"');
    if (!mk.owner?.name) errors.push('marketplace.json: missing "owner.name"');
    if (!Array.isArray(mk.plugins) || mk.plugins.length === 0) {
      errors.push('marketplace.json: "plugins" must be a non-empty array');
    } else {
      for (const [i, p] of mk.plugins.entries()) {
        const tag = `marketplace.json plugins[${i}]`;
        if (!p.name) errors.push(`${tag}: missing "name"`);
        if (!p.source) {
          errors.push(`${tag}: missing "source"`);
          continue;
        }
        if (typeof p.source !== 'string') {
          ok.push(`${tag}: non-path source (${p.source.source ?? 'object'}) — skipped`);
          continue;
        }
        const manifest = join(resolve(repoRoot, p.source), '.claude-plugin', 'plugin.json');
        if (!existsSync(manifest)) {
          errors.push(`${tag}: source "${p.source}" has no .claude-plugin/plugin.json`);
          continue;
        }
        const pj = readJson(manifest, `${p.source}/plugin.json`);
        if (pj) {
          if (!pj.name) errors.push(`${p.source}/plugin.json: missing "name"`);
          if (!pj.description) errors.push(`${p.source}/plugin.json: missing "description"`);
          if (pj.name && p.name && pj.name !== p.name) {
            errors.push(`${tag}: name "${p.name}" != plugin.json name "${pj.name}"`);
          }
          ok.push(`plugin "${pj.name ?? '?'}" @ ${p.source} — manifest OK`);
        }
      }
    }
    if (mk.name && Array.isArray(mk.plugins)) {
      ok.unshift(`marketplace "${mk.name}" — ${mk.plugins.length} plugin(s)`);
    }
  }
}

for (const line of ok) console.log('✓', line);
if (errors.length) {
  console.error('\n✗ Manifest validation failed:');
  for (const e of errors) console.error('  -', e);
  process.exit(1);
}
console.log('\n✔ All manifests valid');
