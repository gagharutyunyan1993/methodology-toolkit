#!/usr/bin/env node
// Dangling-reference check for the whole repo. Fails CI when a tracked file points at something
// that does not exist:
//   1. Markdown links and images ([..](path), <img src="path">) — the file, and the #anchor if any.
//   2. Links to this repo on GitHub (github.com/<owner>/methodology-toolkit/blob|tree/<ref>/<path>).
//   3. Backticked repo paths in docs and runtime text (`docs/x.md`, `references/<slug>.md`,
//      `${CLAUDE_PLUGIN_ROOT}/...`) — resolved against the file's folder, the repo root, the plugin
//      root and the skill folder.
//   4. Retired names that must not appear outside CHANGELOG (removed files, old step numbers).
// Eval cases are skipped: their prompts and fixtures talk about files in a scaffolded user project.
import { readFileSync, existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = normalize(join(dirname(fileURLToPath(import.meta.url)), '..'));
const PLUGIN = 'plugins/methodology-toolkit';
const SKILL = `${PLUGIN}/skills/methodology-driven-thinking`;
const REPO_URL = /https?:\/\/github\.com\/[\w.-]+\/methodology-toolkit\/(?:blob|tree)\/[\w.-]+\/([^\s)#"'>]+)(?:#([\w-]+))?/g;

// Names that existed before and must not be referenced as current anywhere but the changelog.
const RETIRED = [
  [/\bmethodology\.md\b/, 'methodology.md was split into references/<slug>.md in 2.0.0'],
  [/\bStep 2\.5\b/, 'the evidence gate is Step 2 since 2.0.0'],
];

const files = execFileSync('git', ['ls-files'], { cwd: ROOT, encoding: 'utf8' }).split('\n').filter(Boolean)
  .filter((f) => !f.startsWith(`${PLUGIN}/evals`) && /\.(md|json|ya?ml|cff|mjs)$/.test(f) && !f.startsWith('scripts/fixtures/'));

const exists = (p) => existsSync(join(ROOT, p));
const slug = (h) => h.trim().toLowerCase().replace(/<[^>]+>/g, '').replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-');
const anchorsCache = new Map();
function anchors(file) {
  if (!anchorsCache.has(file)) {
    const text = readFileSync(join(ROOT, file), 'utf8').replace(/```[\s\S]*?```/g, '');
    const seen = new Map();
    const set = new Set();
    for (const [, h] of text.matchAll(/^#{1,6}\s+(.+?)\s*#*\s*$/gm)) {
      const s = slug(h);
      const n = seen.get(s) ?? 0;
      set.add(n ? `${s}-${n}` : s);
      seen.set(s, n + 1);
    }
    for (const [, id] of text.matchAll(/<a\s+(?:name|id)="([^"]+)"/g)) set.add(id);
    anchorsCache.set(file, set);
  }
  return anchorsCache.get(file);
}

const problems = [];
const lineOf = (text, index) => text.slice(0, index).split('\n').length;
const report = (file, text, index, msg) => problems.push(`${file}:${lineOf(text, index)}: ${msg}`);

function checkTarget(file, text, index, target, anchor, label) {
  const p = normalize(target).replace(/\\/g, '/');
  if (!exists(p)) return report(file, text, index, `${label} → ${p} (missing)`);
  if (anchor && p.endsWith('.md') && statSync(join(ROOT, p)).isFile() && !anchors(p).has(anchor.toLowerCase()))
    report(file, text, index, `${label} → ${p}#${anchor} (no such heading)`);
}

for (const file of files) {
  const text = readFileSync(join(ROOT, file), 'utf8');
  const dir = dirname(file);
  const isMd = file.endsWith('.md');
  const prose = isMd ? text.replace(/```[\s\S]*?```/g, (m) => m.replace(/[^\n]/g, ' ')) : text;

  if (isMd) {
    // 1. markdown links / images and html img
    const links = [...prose.matchAll(/!?\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g), ...prose.matchAll(/<img[^>]+src="([^"]+)"/g)];
    for (const m of links) {
      const raw = m[1];
      if (/^(https?:|mailto:|data:)/.test(raw)) continue;
      const [path, anchor] = raw.split('#');
      if (!path) { if (anchor && !anchors(file).has(anchor.toLowerCase())) report(file, text, m.index, `link → #${anchor} (no such heading)`); continue; }
      checkTarget(file, text, m.index, join(dir, decodeURIComponent(path)), anchor, 'link');
    }
  }

  // 2. links to this repo on GitHub
  for (const m of text.matchAll(REPO_URL)) checkTarget(file, text, m.index, decodeURIComponent(m[1]), m[2], 'repo URL');

  if (isMd && file !== 'CHANGELOG.md') {
    // 3. backticked repo paths
    for (const m of prose.matchAll(/`([^`\s]+)`/g)) {
      let p = m[1].replace(/[.,;:]+$/, '');
      if (!/\.(md|json|mjs|js|ya?ml|png|cff)$/.test(p) || /[*<>{}|]|\[|\]/.test(p.replace(/\$\{[A-Z_]+\}/g, ''))) continue;
      if (/^(https?:|~|\/)/.test(p)) continue;
      const vars = { CLAUDE_PLUGIN_ROOT: PLUGIN, CLAUDE_SKILL_DIR: SKILL };
      if (/\$\{(?!CLAUDE_PLUGIN_ROOT|CLAUDE_SKILL_DIR)[A-Z_]+\}/.test(p)) continue; // runtime-only dirs
      p = p.replace(/\$\{(CLAUDE_PLUGIN_ROOT|CLAUDE_SKILL_DIR)\}/g, (_, v) => vars[v]);
      const candidates = [join(dir, p), p, join(PLUGIN, p), join(SKILL, p)].map((c) => normalize(c).replace(/\\/g, '/'));
      if (!candidates.some(exists) && /\//.test(m[1])) report(file, text, m.index, `path \`${m[1]}\` (missing)`);
    }
    // 4. retired names
    for (const [re, why] of RETIRED) {
      const g = new RegExp(re.source, 'g');
      for (const m of text.matchAll(g)) report(file, text, m.index, `"${m[0]}" — ${why}`);
    }
  }
}

if (problems.length) {
  console.error(problems.map((p) => `✗ ${p}`).join('\n'));
  console.error(`\n${problems.length} dangling reference(s) in ${files.length} files`);
  process.exit(1);
}
console.log(`✓ references: ${files.length} files, no dangling links or paths`);
