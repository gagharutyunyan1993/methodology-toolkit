# methodology-toolkit

> Structured decision-making for Claude Code — methods applied **explicitly**, not just named.

[![Validate manifests](https://github.com/gagharutyunyan1993/methodology-toolkit/actions/workflows/validate-manifests.yml/badge.svg)](https://github.com/gagharutyunyan1993/methodology-toolkit/actions/workflows/validate-manifests.yml)
[![Claude Code plugin](https://img.shields.io/badge/Claude%20Code-plugin-00b3b3)](#install)
[![License: MIT](https://img.shields.io/badge/License-MIT-success)](LICENSE)

A Claude Code plugin that makes Claude reason through real analytical frameworks instead of intuition. It bundles three interlocking pieces over one shared index of **29 methodologies** (Cynefin, First Principles, OODA, ACH, Pre-mortem, Red Team, BATNA, JTBD, Theory of Constraints, Minto, SWOT/TOWS, and more).

**Created by [Gagik Harutyunyan](mailto:gagik.harutyunyan17@gmail.com).** If the ideas here are useful to you, keep the attribution — that's the whole deal (MIT). See [`CITATION.cff`](CITATION.cff).

For the longer rationale, read: [Claude Does Not Need More Prompts. It Needs Reasoning Discipline.](docs/why-methodology-toolkit.md)

---

## What's inside

| Component | Type | What it does |
| --- | --- | --- |
| `methodology-driven-thinking` | **skill** | Auto-triggers on non-trivial tasks. Classifies the problem (Cynefin), selects 1–3 fitting methods, applies each by its steps, synthesizes an actionable answer. |
| `/methodology-toolkit:method` | **command** | Manual trigger. `/...:method <task>` runs the full protocol; `/...:method ACH+pre-mortem <task>` forces specific methods. |
| `red-team-critic` | **subagent** | Independent adversarial pass. Returns critique only — load-bearing assumptions, failure modes, exploits, disconfirming evidence — verified against primary sources. |
| `methodology.md` | shared index | The authoritative library of all 29 methods (`use_when` / `avoid_when` / `steps` / `output`). All three read from it. |

### How they fit together

```
Non-trivial task
   ├─ auto  → methodology-driven-thinking skill ─┐
   └─ manual → /methodology-toolkit:method ───────┤──→ read methodology.md
                                                  │
   double-pass (stress-test the first answer):
      /methodology-toolkit:method recheck   (inline, by yourself)
                 or
      red-team-critic                       (subagent, independent context)
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
```

Or just ask a hard question — the skill triggers itself. For an independent teardown of a plan, invoke the `red-team-critic` subagent.

## Design philosophy

Two failure modes this plugin is built to prevent:

1. **Methodology theater** — naming a method without walking through its steps. Every component refuses to do this: the output is the *reasoning the method produces*, never its label.
2. **Confident wrongness** — asserting load-bearing claims from memory. The rule is *verify before you assert*: read the file, run the grep, check the test — primary sources outrank docs and comments.

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

## The 29 methods

Cynefin · OODA · PDCA · First Principles · 5 Whys · 5 Forces (Porter) · ADKAR · Kotter · Eisenhower · GTD · SMEAC · Schwerpunkt · Mental Models · System 1/2 · JTBD · Double Diamond · Theory of Constraints · OKR · Minto Pyramid · SCQA · BATNA · Thomas-Kilmann · ACH · Red Team · Pre-mortem · PMESII · SWOT/TOWS · SAT · Quality of Information Check.

Full definitions in [`plugins/methodology-toolkit/skills/methodology-driven-thinking/methodology.md`](plugins/methodology-toolkit/skills/methodology-driven-thinking/methodology.md).

## License

[MIT](LICENSE) © 2026 Gagik Harutyunyan. Use it, fork it, build on it — just keep the attribution.
