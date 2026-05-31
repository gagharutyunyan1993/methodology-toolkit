# Changelog

All notable changes to methodology-toolkit are documented here.

This project signals intent with [Semantic Versioning](https://semver.org/), with the
caveat that Claude Code plugins have no install-time version pinning — a `/plugin update`
silently pulls the latest. Version numbers here are a declarative boundary, not an
enforced one. The `v1.0.0` git tag marks the frozen pre-evidence-gate state.

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
