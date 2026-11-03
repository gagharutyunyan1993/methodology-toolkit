# Changelog

All notable changes to methodology-toolkit are documented here.

This project signals intent with [Semantic Versioning](https://semver.org/), with the
caveat that Claude Code plugins have no install-time version pinning — a `/plugin update`
silently pulls the latest. Version numbers here are a declarative boundary, not an
enforced one. The `v1.0.0` git tag marks the frozen pre-evidence-gate state.

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
