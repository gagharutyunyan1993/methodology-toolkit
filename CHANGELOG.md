# Changelog

All notable changes to methodology-toolkit are documented here.

This project signals intent with [Semantic Versioning](https://semver.org/), with the
caveat that Claude Code plugins have no install-time version pinning — a `/plugin update`
silently pulls the latest. Version numbers here are a declarative boundary, not an
enforced one. The `v1.0.0` git tag marks the frozen pre-evidence-gate state.

## [2.0.0] — 2026-11-04

**Results at release** (3 runs per case): main suite 41/42 on the default model and 42/42
trigger-correct; on a smaller model the main suite's trigger cases went from 3/9 to 8/9 and the
trigger dev set from 1/30 to 25/30, with 0/20 false triggers across both sets. On the untouched
holdout set the smaller model with the plugin solves the correlation-vs-causation case 3/3 vs 1/3
without it (it opens the data the user points to instead of answering from the summary); the
other holdout cases score the same with and without the plugin.

Driven by a baseline eval of 1.2.0 (14 cases × 3 runs, with / without plugin / one-line
"check your grounds" control). Two findings led this first batch: the skill was
**under-triggering** (Russian diagnosis 0/3, English research 1/3, false triggers 0/9), and on a
forced `5-whys+PDCA` case the plugin did **worse** than the one-line control (0/3 vs 3/3) —
the method's shape pushed the model to assert a root cause for a different question.

### Added
- **Eval suite** (`plugins/methodology-toolkit/evals/`, 14 cases) for the built-in plugin eval
  runner: triggers and non-triggers (RU/EN), early exit, forced-method gate, conflicting sources,
  causal theater, critic allowed to find nothing, action boundary with an injected instruction,
  degradation with local data, a green test that does not prove the claim.
- `when_to_use` with EN/RU request phrasing; "words inside translated/quoted material are not a
  trigger".
- **Holdout eval set** (`evals-holdout/`, 8 cases with new conditions and fixtures — misleading
  changelog, spec vs code vs README, pricing region mismatch, correlation vs causation, forced
  method that does not fit, refactor non-trigger, critic that must find a real risk, config
  precedence). Never tuned against.
- **Trigger dev set** (`evals-triggers/`, 15 cases: 10 judgement calls resting on files, logs, data
  exports, docs or vendor terms the user points to; 5 non-triggers — rename, summary, adding a
  test, a CLI flag, a translation). Tuned against, unlike the holdout set.
- **`references/methods.json`** — one registry of method slugs, names and aliases used by the
  command and checked in CI.
- **`scripts/validate-skill.mjs`** (in CI): registry ↔ card files ↔ selection map ↔ card
  references in agents and command; no model-version notes in runtime text; listing-text and
  SKILL.md size budgets.
- **`hooks/check-report.mjs` + `hooks/hooks.json`** — a `SubagentStop` hook in **observe mode**:
  validates the critic's and scout's JSON reports against their contracts and appends
  `{time, agent, ok, errors}` to `report-checks.jsonl` in the plugin data directory. Never blocks,
  never logs report content. Blocking comes later, only for rules with a measured low false-positive
  rate. Tested in CI (`scripts/test-check-report.mjs`).

### Changed (breaking)
- **`red-team-critic` returns one strict JSON object** (`schema_version` 1): `verdict`
  (`material_defects_found` | `no_confirmed_material_defects` | `insufficient_evidence`),
  methods with their steps, evidence with origin (`read` | `brief`), defects with basis
  (`observed` | `deduced`), hypotheses, checks the caller must run (command may be `null`;
  proposing a check grants no permission), limits. It may find nothing material; out-of-contract
  inputs are not defects; the author's reasoning arrives separately as a position to challenge.
  Its description no longer claims single-fact rechecks. `maxTurns: 20`.
- **`evidence-scout` returns one strict JSON object** — at most 10 facts, each with `source_ref`
  (URL or file + location), tier, `self_reported`, page and access dates, a verbatim quote of at
  most 200 characters, `evidence_kind` (behaviour / opinion) for user evidence; conflicts,
  not-found claims and gaps. `maxTurns: 25`.
- Research mode R4 now accepts scout reports deliberately: decision-relevant facts first (does
  the quote support the exact claim for the right plan, region and period), re-open a source only
  when it does not or sources conflict, then a small spot-check as QA.

### Removed
- **`methodology.md`** (836 lines, read in full on every invocation, before the early exit).
  Its 33 cards are now `references/<slug>.md`; its cheat sheet and disambiguation block moved
  into `SKILL.md` as the single selection map — the duplicate, already diverged table is gone.

### Changed
- **Skill description** rewritten for recall. It now leads with the case the skill missed most:
  a verdict, decision or recommendation that rests on evidence the user points to ("see the
  export — should we roll out?", "does the code match the docs", "which number to trust"), even
  when reading the files looks like enough. On a smaller model the trigger dev set went from 1/30
  to 25/30 with 0/15 false triggers, and the main suite's trigger cases from 3/9 to 8/9. Explicit negative boundary kept (syntax, translation,
  summaries, renames, adding tests, routine fixes).
- **Quality of Information Check rewritten.** Provenance is not a truth ranking; support is
  checked for the exact claim (a green test proves only what it asserts); hypotheses are allowed
  but never laundered into facts; conditional conclusions are allowed; conflicts resolved by
  domain with **no automatic "Primary wins"** (actual vs intended behaviour for code; entity /
  plan / region / period for market facts); freshness separate from provenance (page date
  > 12 months → currency check); observation vs conclusion confidence rated separately.
- **5 Whys, OODA, PDCA cards and Step 4:** every link carries evidence; the established chain
  stops at the last supported link N; unexecuted Act/Do/Check are `[planned]`; "root cause
  undetermined" is a valid output; never answer a swapped, easier question. The 5 Whys example
  is replaced by one that stops at N = 2 with competing hypotheses and a discriminating check.
- **Forced methods keep the Evidence gate** (`/methodology-toolkit:method <name>` skips only
  Cynefin and auto-selection).
- **Protocol order:** classify and early-exit first with no file reads → evidence gate → select
  from the map in `SKILL.md` → open only the 1–3 chosen cards. Steps renumbered 1–5 (the gate is
  Step 2, formerly 2.5).
- **`/methodology-toolkit:method` routes** are explicit: forced (`a+b+c`, max 3, resolved via
  `methods.json`), `research [method]`, `recheck` (sends a decision, plan or conclusion to
  `red-team-critic`; not for re-checking a single fact), auto. Unknown or ambiguous method tokens
  get a list of the closest slugs instead of a guess. **Breaking:** `recheck` no longer means an
  inline self-recheck.
- **Second pass** has two independent triggers: unverified inputs → back to the gate yourself;
  high cost of error → `red-team-critic` even with verified inputs (briefed with the author's
  reasoning kept separate). The critic may find nothing material.
- `red-team-critic` and `evidence-scout` read only their own cards instead of the whole library.
- No-web degradation: only public external facts become unverified; user-supplied files keep
  their provenance.
- Research confidence (High/Medium/Low) is defined for the conclusion, not by provenance alone.
- Removed model-version-specific notes from runtime text; "Empirically the second pass
  catches…" no longer claims measurements that did not exist.

## [1.2.0] — 2026-11-03

Product research, done on evidence. The evidence gate from 1.1 covered code claims only, so
product and market questions — competitor prices, feature sets, market size, what users
want — were answered from training-data memory, undated and unsourced. 1.2 extends the same
gate to external claims and gives research its own loop, without adding a second skill.

### Added
- **Research mode (`SKILL.md`).** R1 frame the decision → R2 list questions and load-bearing
  claims → R3 gather from the source that owns each fact → R4 gate → R5 methods → R6 report.
  Wraps Steps 2.5–5; Cynefin still runs first.
- **`evidence-scout` subagent.** Gathers facts for one narrow scope with WebSearch/WebFetch
  and returns an evidence table only: exact value, URL, tier, page/access date, quote,
  conflicts, `NOT FOUND`. No conclusions, never filled from memory. Research mode spawns one
  per competitor or per question, in parallel.
- **Four product-discovery methods** (29 → 33): Opportunity Solution Tree, Assumption
  Mapping, Mom Test, Market Sizing (bottom-up). New "Product discovery" disambiguation block
  and cheat-sheet rows.
- **`/methodology-toolkit:method research <question>`** forces Research mode; a method
  token may follow (`research OST …`).
- **Research report shape:** bottom line first, findings with High/Medium/Low confidence and
  dated sources, what we don't know, the cheapest next step with a pre-stated pass/fail.
- **Hard rules:** "No product or market fact from memory" and "Stated preference is not
  demand".

### Changed
- **Evidence gate (Step 2.5)** now covers product/market claims as well as code claims.
  Quality of Information Check gains a product/market tier column: Primary = the entity's
  own page opened this session or the user's own data; vendor marketing numbers are tagged
  self-reported (performance/adoption claims, Secondary); every external fact must carry a date, and an undated one is Inferred.
- The "gate skipped" example moved from an EU-market decision (which now has checkable
  market claims) to a pure-judgement communication task.
- Skill description gains product-research trigger phrases.

### Unchanged (deliberately)
- Still one skill. Research mode is a branch of the existing protocol, not a separate
  `product-research` skill, to avoid the trigger collision 1.1 already ruled out.
- `red-team-critic` keeps its pure-critic role; `evidence-scout` is its mirror image —
  facts only, no critique and no conclusions.

## [1.1.0] — 2026-05-31

Evidence-First, shipped as an evolution — not a new plugin, not a core swap, not a rebrand.
The 29-method index stays the core; Quality of Information Check (QoIC) is promoted from
one method among 29 to a **mandatory input gate** for engineering tasks. The gate validates
inputs; the methods still produce the conclusion.

### Added
- **Evidence gate (`SKILL.md` Step 2.5).** For tasks that rest on a load-bearing code
  claim, QoIC now runs *before* method selection: name the claim, tag its source tier
  (Primary / Secondary / Inferred), promote it to Primary before any method consumes it.
  The gate sits **under** the Clear/Simple off-ramp, so trivial tasks never reach it.
- **Hard rule: "No code claim without primary evidence."** A short slogan rule pointing at
  the gate; the verification mechanics remain in the existing verify-before-assert rule.
- **Engineering trigger keywords** in the skill description: `bug, regression, code review,
  refactor, failing test, architecture claim` — closing the engineering front door inside
  the existing skill rather than adding a second skill.
- **QoIC ↔ gate cross-link** in `methodology.md`: the card documents that it *is* the gate's
  mechanics, while staying one method in the index (not a separate subsystem).

### Unchanged (deliberately)
- No second skill — the engineering door is sharpened in place to avoid trigger collision.
- `red-team-critic` keeps its pure-critic role (it already runs QoIC on its findings).
- Positioning is untouched: `intelligence-analysis + decision-methodologies + AI-agents`.
  The "29 frameworks" headline is not demoted.

### Rationale
The decisive test — "delete all 29 methods, can you still solve the task?" — resolves to
**no** on the repo's own `examples/codebase-diagnosis.md`: QoIC confirms "profile can be
null", but only 5 Whys / ACH determine *where* the defect is and *what* the fix should be.
Methods are the core; evidence is an amplifier. A separate `evidence-engineering-toolkit`
will be reconsidered only when real cases appear where QoIC alone yields a useful decision
without other methods.

## [1.0.0]

Initial release: `/method` command, auto-triggering methodology-driven-thinking skill, and
red-team-critic subagent over a shared 29-method index.
