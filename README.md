# methodology-toolkit

> Structured decision-making for Claude Code — methods applied **explicitly**, not just named.

[![Validate manifests](https://github.com/gagharutyunyan1993/methodology-toolkit/actions/workflows/validate-manifests.yml/badge.svg)](https://github.com/gagharutyunyan1993/methodology-toolkit/actions/workflows/validate-manifests.yml)
[![Claude Code plugin](https://img.shields.io/badge/Claude%20Code-plugin-00b3b3)](#install)
[![License: MIT](https://img.shields.io/badge/License-MIT-success)](LICENSE)

A Claude Code plugin that makes Claude reason through real analytical frameworks instead of intuition. It bundles four interlocking pieces over one shared index of **33 methodologies** (Cynefin, First Principles, OODA, ACH, Pre-mortem, Red Team, BATNA, JTBD, Opportunity Solution Tree, Theory of Constraints, Minto, SWOT/TOWS, and more), plus an evidence-gated **research mode** for product and market questions.

**Created by [Gagik Harutyunyan](mailto:gagik.harutyunyan17@gmail.com).** If the ideas here are useful to you, keep the attribution — that's the whole deal (MIT). See [`CITATION.cff`](CITATION.cff).

For the longer rationale, read: [Claude Does Not Need More Prompts. It Needs Reasoning Discipline.](docs/why-methodology-toolkit.md)

---

## What's inside

| Component | Type | What it does |
| --- | --- | --- |
| `methodology-driven-thinking` | **skill** | Auto-triggers on non-trivial tasks. Classifies the problem (Cynefin), gates load-bearing claims on evidence, selects 1–3 fitting methods, applies each by its steps, synthesizes an actionable answer. For product and market questions it switches to **Research mode**: frame the decision → gather sourced, dated facts → gate → methods → BLUF report with confidence and next experiment. |
| `/methodology-toolkit:method` | **command** | Manual trigger. `/...:method <task>` runs the full protocol; `/...:method ACH+pre-mortem <task>` forces specific methods (the evidence gate still runs); `/...:method research <question>` forces Research mode; `/...:method recheck` sends the previous answer to `red-team-critic`. |
| `red-team-critic` | **subagent** | Independent adversarial pass. Returns critique only, as one strict JSON object: verdict (it may find nothing material), defects with their evidence and basis (observed / deduced), open hypotheses, and checks for the caller to run. Read-only tools. |
| `evidence-scout` | **subagent** | Research legwork for one narrow scope (a competitor, a question, a segment). Returns facts only, as one strict JSON object — exact value, source reference, tier, page and access dates, verbatim quote — with conflicts and not-found claims reported, never filled from memory. Spawned in parallel by Research mode. |
| `hooks/` | hook | Report contract gate: checks the critic's and scout's JSON before it reaches the caller and sends a non-conforming report back once for correction. Logs pass/fail (never report content) to the plugin data directory. |
| `references/` | method cards | One card per method (33 files: `use_when` / `avoid_when` / `steps` / `output`) plus `methods.json`, the registry of slugs and aliases. The skill routes from a selection map in `SKILL.md` and opens only the 1–3 cards it uses. |
| `evals/` | eval suite | Cases for the built-in plugin eval runner: triggers and non-triggers, early exit, evidence gate, causal theater, critic, action boundary, degradation. `evals-triggers/` is the trigger-recall dev set; `evals-holdout/` is never tuned against. |

### How they fit together

```
Non-trivial task
   ├─ auto  → methodology-driven-thinking skill ─┐
   └─ manual → /methodology-toolkit:method ───────┤──→ classify → gate → pick 1–3 → open only those cards
                                                  │
   product / market question → Research mode:
      frame decision → evidence-scout × N (parallel, sourced + dated)
                     → evidence gate → methods → BLUF report

   double-pass (stress-test the first answer):
      unverified inputs  → back to the evidence gate (check them yourself)
      high cost of error → red-team-critic (subagent, independent context)
```

## Install

```text
/plugin marketplace add gagharutyunyan1993/methodology-toolkit
/plugin install methodology-toolkit@methodology-toolkit
```

To try it locally before publishing, point `--plugin-dir` at the **plugin subdirectory** (not the marketplace root):

```bash
claude --plugin-dir /path/to/methodology-toolkit/plugins/methodology-toolkit
```

## Usage

```text
/methodology-toolkit:method how should we prioritize the Q3 backlog?
/methodology-toolkit:method ACH+pre-mortem should we migrate polling to WebSocket?
/methodology-toolkit:method red-team <the plan you just wrote>
/methodology-toolkit:method research who are our competitors for small HR teams, and what do they charge?
/methodology-toolkit:method research OST what should we build next for retention?
```

Or just ask a hard question — the skill triggers itself. For an independent teardown of a plan, invoke the `red-team-critic` subagent.

## Examples

- [Polling vs SSE vs WebSocket](examples/websocket-decision.md) — architecture decision under uncertainty.
- [Codebase diagnosis without guessing](examples/codebase-diagnosis.md) — bug-fix workflow grounded in primary evidence.
- [Pricing research without memory](examples/product-research.md) — competitor pricing and demand research through Research mode.

## Design philosophy

Two failure modes this plugin is built to prevent:

1. **Methodology theater** — naming a method without walking through its steps. Every component refuses to do this: the output is the *reasoning the method produces*, never its label.
2. **Confident wrongness** — asserting load-bearing claims from memory. The rule is *verify before you assert*: read the file, run the grep, check the test — primary sources outrank docs and comments. In product research the same rule reads: open the competitor's own pricing page, date the fact, and treat "users said they'd pay" as opinion, not demand.

Prompts are tuned for **Claude Opus 4.8** specifics: instruction scope is stated per-method (4.8 reads literally and won't generalize across methods), subagent spawning is deliberate (4.8 spawns fewer by default), and the costly independent red-team pass is *offered*, not run silently, when the user is in the loop.

## Why this is not just a prompt collection

The goal is not to make Claude _sound_ more strategic. The goal is to make it harder for Claude to skip the parts of analysis where mistakes usually hide:

- **Method selection is gated by problem type.** Cynefin runs first so a simple syntax question does not get buried under frameworks, while uncertain or adversarial decisions get methods that match the situation.
- **Every invoked method must be applied step by step.** If the answer says "using ACH" or "using OODA", the output must show the ACH matrix or the Observe/Orient/Decide/Act pass. Labels alone are treated as failure.
- **Load-bearing facts must be verified before conclusion.** The toolkit pushes Claude toward primary evidence: code read, commands run, tests checked, git history inspected.
- **The critique path is separate.** `red-team-critic` runs as an adversarial reviewer with its own context, so the stress test is less likely to rationalize the first answer.

### Example: architecture decision

**Without the toolkit:** Claude may recommend "migrate polling to WebSocket" because it sounds technically cleaner, then list generic pros and cons.

**With the toolkit:** Claude classifies the decision as complicated/complex, applies First Principles to identify what actually needs real-time delivery, uses ACH to compare polling, SSE, and WebSocket against disconfirming evidence, then runs a pre-mortem. The likely outcome is a narrower recommendation: WebSocket only if bidirectional low-latency updates are required; otherwise SSE or tuned polling may be cheaper and safer.

### Example: codebase diagnosis

**Without the toolkit:** Claude may infer the root cause from one symptom and patch the nearest visible file.

**With the toolkit:** Claude uses 5 Whys only while the causal chain stays mechanical, promotes assumptions through the Quality of Information Check, reads the relevant files, greps for callers, and runs the targeted test. If the evidence contradicts the first theory, the conclusion changes before a patch is made.

### Example: product research

**Without the toolkit:** Claude lists competitors and their prices from memory, calls the market "large and growing", and recommends "AI features" after naming SWOT.

**With the toolkit:** Claude frames the decision the research serves, sends `evidence-scout` subagents to each competitor's own pricing page and changelog, dates every fact, and discounts "users said they'd pay" as opinion. JTBD and Assumption Mapping then run on that evidence only, and the report leads with the bottom line, gives each finding a confidence level, lists what is still unknown, and ends with the cheapest next experiment.

## The 33 methods

Cynefin · OODA · PDCA · First Principles · 5 Whys · 5 Forces (Porter) · ADKAR · Kotter · Eisenhower · GTD · SMEAC · Schwerpunkt · Mental Models · System 1/2 · JTBD · Double Diamond · Opportunity Solution Tree · Assumption Mapping · Mom Test · Market Sizing (bottom-up) · Theory of Constraints · OKR · Minto Pyramid · SCQA · BATNA · Thomas-Kilmann · ACH · Red Team · Pre-mortem · PMESII · SWOT/TOWS · SAT · Quality of Information Check.

Full definitions in [`plugins/methodology-toolkit/skills/methodology-driven-thinking/references/`](plugins/methodology-toolkit/skills/methodology-driven-thinking/references/).

**Scope note:** the evidence rules live in the skill. If the skill is not invoked (a plain question it does not match), its gate does not run — the plugin does not change the agent's behaviour outside its own activation.

## License

[MIT](LICENSE) © 2026 Gagik Harutyunyan. Use it, fork it, build on it — just keep the attribution.
