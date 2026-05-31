---
name: methodology-driven-thinking
description: Apply structured decision-making and analytical frameworks to non-trivial problems. Use when the user asks for research, strategy, diagnosis, architecture decisions, prioritization, tradeoff analysis, root cause analysis, planning under uncertainty, problem-solving approach, "how should I approach X", or for engineering tasks that rest on load-bearing claims about code (bug, regression, code review, refactor, failing test, architecture claim). Selects 1-3 relevant methodologies from a curated index (Cynefin, First Principles, OODA, ACH, BATNA, JTBD, Theory of Constraints, etc.), applies them explicitly, and synthesizes a concrete answer.
---

# Methodology-Driven Thinking

This skill activates structured analytical methods when a task is non-trivial. The output of the skill is **the reasoning produced by the methods**, not the names of the methods.

## Operating Protocol

### Step 1 — Read the methodology index

Open `${CLAUDE_PLUGIN_ROOT}/skills/methodology-driven-thinking/methodology.md`. This is the authoritative library with `use_when`, `avoid_when`, `steps`, and `output` for each method. Do not rely on memory — the index may have been updated.

### Step 2 — Classify the problem (Cynefin as dispatcher)

Before selecting any other methodology, place the problem in a Cynefin domain:

- **Clear / Simple** — known cause-effect, best practice exists. → **Exit the skill.** Answer directly. Methodologies are tax, not insurance, on trivial tasks.
- **Complicated** — knowable through analysis/expertise. → Analytical methods fit (First Principles, ACH, 5 Whys, ToC, Porter, PMESII).
- **Complex** — cause-effect only visible in hindsight; requires probes. → Iteration methods fit (OODA, PDCA, Double Diamond, JTBD).
- **Chaotic** — no clear cause-effect. → Act first to stabilize, then re-classify.

State the classification in one line. If you can't classify, that itself is a signal — say so.

### Step 2.5 — Evidence gate (load-bearing code claims)

This step runs **after** the Clear/Simple exit and **before** method selection — trivial tasks never reach it. If the task survived Step 2 **and** rests on a load-bearing claim about code — what a function returns, where a defect lives, what a command does, what the backend sends — gate the claim before any method consumes it:

1. Name the claim explicitly: "This conclusion depends on X being true."
2. Tag its current source tier — **Primary** (code you read, command output, git, test results), **Secondary** (`.d.ts`, prose docs, comments — subject to drift), or **Inferred** (memory, assumption, analogy).
3. Promote every load-bearing claim to **Primary** before it enters a method: run the command, read the file, check git. A claim that stays Secondary/Inferred is a hypothesis, not an input.

This is **Quality of Information Check** applied at the door (see its card in the index). The gate validates the *inputs* only — it does **not** produce the conclusion. "Claim verified" is not an answer; deciding _why_ the fact holds, _where_ the defect is, and _what_ the fix should be is still the methods' job (5 Whys, ACH, First Principles). If the task carries no code claim (pure strategy, planning, communication), skip the gate and go to Step 3.

<example>
Gate fires (code claim): "The page crashes because `profile` can be null." Tier: **Inferred** — assumed from the stack-trace shape. Promote: read the API client and run the failing test → the endpoint returns 204 with an empty body, so `profile` really is null at runtime. Now **Primary**. → Hand off to 5 Whys / ACH to find _why_ the body is empty and _where_ the fix belongs. The gate proved the fact is real; it did not choose the fix.
</example>

<example>
Gate skipped (no code claim): "Should we enter the EU market before or after the Series A?" Nothing here rests on a verifiable fact about code — the inputs are strategic judgements, not file contents or command output. Do **not** run the evidence gate; go straight to Step 3 and select methods (e.g. BATNA, Pre-mortem, Porter). Forcing a code-evidence gate onto a pure-strategy task is exactly the theater the Clear/Simple off-ramp exists to prevent.
</example>

### Step 3 — Select 1–3 methodologies

Match to (Cynefin domain) × (task type). Common pairings:

| Task type                    | Default candidates                  |
| ---------------------------- | ----------------------------------- |
| Decision under time pressure | OODA, First Principles, Schwerpunkt |
| Decision under uncertainty   | OODA, ACH, Pre-mortem               |
| Prioritization               | Eisenhower, Schwerpunkt, ToC, OKR   |
| Root cause                   | 5 Whys, ToC, ACH                    |
| Competitive analysis         | Porter, SWOT/TOWS, JTBD             |
| Environment assessment       | PMESII, SWOT, Cynefin               |
| User/customer discovery      | JTBD, Double Diamond                |
| Communication                | Minto, SCQA, SMEAC                  |
| Negotiation                  | BATNA, Thomas-Kilmann               |
| Org change                   | ADKAR, Kotter, PDCA                 |
| Plan stress test             | Red Team, ACH, Pre-mortem           |
| System improvement           | PDCA, ToC, OKR                      |
| Bias check                   | System 1/2, ACH, Red Team           |

Justify each choice in one line: "Using X because [specific problem trait]." If you can't justify it, drop it.

### Step 4 — Apply explicitly, not nominally

For each chosen method, walk through its `steps` field from the index visibly. The reader must see the structure: "OODA — Observe: [content]. Orient: [content with biases named]. Decide: [content]. Act: [content]." If you only name the method, you have failed. When you pick more than one method, this applies to _each_ of them — don't apply the steps to the first and merely name the rest.

<example>
Nominal (fails — theater): "I'll use 5 Whys to find the root cause. The root cause is a missing null check."
Applied (passes): "5 Whys — Why did the page crash? The render threw. Why? `user.profile` was undefined. Why? The API returned 204 with no body. Why? The session expired mid-request. Why? The refresh token wasn't rotated. Root cause: a token-rotation gap in the auth layer, not the null check — so the fix belongs there, not in the component."
</example>

### Step 5 — Synthesize

Where do the chosen methods agree? Where do they diverge? Give the user an actionable conclusion. If methods conflict, name the conflict — don't paper over it.

## Hard Rules

- **Max 3 methods per response.** Cognitive overhead exceeds value past that.
- **Never name a method without walking through its steps.** Methodology theater is the failure mode.
- **If Cynefin = Clear, exit the skill.** Don't force frameworks onto trivial tasks. A user asking "what's the syntax for X" doesn't need OODA.
- **If the user named a method (via `/methodology-toolkit:method <name>`), use that one.** Don't override their choice; if you judge it wrong, flag explicitly and apply anyway.
- **The Orient step of OODA is the entire point** — surface biases and assumptions, don't skip past it.
- **5 Whys weakens past 2–3 levels on human/political problems.** Switch to ACH or Cynefin if you find yourself inventing motives.
- **ADKAR is an org-change tool**, not a self-coaching tool. Don't apply to single personal decisions.
- **"Not a regression" is not an acceptance criterion.** When Pre-mortem or Red Team surfaces a real defect, the default is to fix it — not to rationalize it. Comparing to prior broken behavior ("the original also had this", "no worse than before", "same as legacy") legitimizes shipping a known bug under methodological cover. The valid question is "what does correct look like?" — answered via First Principles — not "is this worse than current?". A defect inherited from the old code is still a defect.
- **No code claim without primary evidence.** On engineering tasks the Evidence gate (Step 2.5) is not optional — promote every load-bearing code claim to Primary before a method consumes it. The gate rejects unverified inputs; it does not replace the methods that turn a verified fact into a decision. (Mechanics in the next rule.)
- **Verify load-bearing claims before asserting them, not after.** When a conclusion rests on a specific fact — file content, a grep result, what a doc says, what a command will do — run the check _first_. Partial evidence (one file, one grep, prose in a `.md` doc or a `.d.ts`) is a hypothesis, not a conclusion: state it as "I need to verify X", verify, then conclude. A claim baked into an ACH evidence row or a First Principles base fact must be a _checked_ fact, or the method is corrupted. Primary sources (code you read, command output, git history, test results) outrank secondary ones (docs, comments, generated `.d.ts`) — see **Quality of Information Check** in the index.

## Double-pass pattern

For non-trivial first-pass outputs — architecture decisions, fixes that touch multiple files, plans with unverified assumptions, recommendations made without reading the relevant code — consider explicitly re-invoking `/methodology-toolkit:method recheck` (or `/methodology-toolkit:method red-team <topic>`) on your own answer, or spawning the `red-team-critic` subagent for an independent adversarial pass.

Opus 4.8 spawns fewer subagents by default, so make this call deliberately rather than waiting for the urge to arise. Spawn `red-team-critic` when the decision is hard to reverse, touches money/auth/data integrity, or the first pass went unverified — an independent context catches what self-review rationalizes away. Stay inline (a `/methodology-toolkit:method recheck` on your own answer) when you can re-verify the claims yourself in a single pass. When the user drove this via the `method` command and the synthesis recommends a hard-to-reverse action, **offer** the red-team pass and let them decide rather than spawning silently (see the edge case in the `method` command); spawn on your own judgement only in autonomous flows where the user isn't in the loop turn-by-turn.

The pattern: first pass is fast and speculative (good for surfacing direction); second pass via **Red Team + Pre-mortem + ACH** stress-tests the first pass against reality. Empirically the second pass catches concrete failures the first pass missed — wrong file guess, missed edge case (pluralization, breakpoint, null state), assumption that wasn't verified, regression introduced by the fix.

The second pass must use real verification, not just renaming methods: grep the codebase, run tests, open the browser, read the file you assumed about. Methodology without verification is the same theater the anti-pattern guard forbids.

Skip the double-pass when: the first pass already grounded itself in verified evidence (read the file, ran the test, checked the breakpoint), or the task is genuinely Clear/Simple.

## Output shape

End with a concrete actionable conclusion. The user should be able to _act_ on the response, not just understand a framework. The methodology is the scaffolding, not the building.
