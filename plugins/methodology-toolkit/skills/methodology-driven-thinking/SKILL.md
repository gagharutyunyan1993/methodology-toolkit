---
name: methodology-driven-thinking
description: Structured analysis for non-trivial diagnoses, decisions and research — checks the facts the answer rests on first, then picks 1-3 methods from a curated index (Cynefin, First Principles, 5 Whys, ACH, OODA, Pre-mortem, JTBD, Opportunity Solution Tree, Theory of Constraints, BATNA, ...) and walks each one step by step. Use it to diagnose a bug, regression or failure whose cause is unclear or disputed (competing explanations, intermittent or "sometimes" failures, "find the root cause", "which version is right"); for architecture and technology choices with trade-offs; strategy, prioritization, planning under uncertainty, "how should I approach X"; and product or market research (competitors, pricing, demand, market size, customer discovery, what to build next). Not for syntax or API questions, translating, quoting or summarizing text, or a routine fix whose location is already known.
when_to_use: Typical requests — EN "why does X keep failing", "which explanation holds", "should we use A or B", "how do we decide", "research the competitors", "is there demand for"; RU «почему иногда теряется / падает», «разберись, какая версия подтверждается», «найди корневую причину», «что выбрать», «как подступиться», «исследуй конкурентов / рынок», «есть ли спрос», «что делать первым». Trigger on the operation the user asks for — words that only appear inside material being translated, quoted or summarized are not a trigger.
---

# Methodology-Driven Thinking

This skill activates structured analytical methods when a task is non-trivial. The output of the skill is **the reasoning produced by the methods**, not the names of the methods.

## Operating Protocol

Method cards live one per file in `${CLAUDE_PLUGIN_ROOT}/skills/methodology-driven-thinking/references/<slug>.md`; `references/methods.json` lists every slug, its display name and aliases. Nothing is read before Step 3 picks the methods — routing happens from this file.

### Step 1 — Classify the problem (Cynefin as dispatcher)

Before selecting any method, place the problem in a Cynefin domain:

- **Clear / Simple** — known cause-effect, best practice exists. → **Exit the skill.** Answer directly; read no cards. Methodologies are tax, not insurance, on trivial tasks. The exit cancels the methodology, not honesty about facts: a simple lookup of an external product fact ("what does X charge?", "does Y have SSO?") is still fetched from the owner's page and given with its source and date — never answered from memory.
- **Complicated** — knowable through analysis/expertise. → Analytical methods fit (First Principles, ACH, 5 Whys, ToC, Porter, PMESII).
- **Complex** — cause-effect only visible in hindsight; requires probes. → Iteration methods fit (OODA, PDCA, Double Diamond, JTBD).
- **Chaotic** — no clear cause-effect. → Stabilize first, then re-classify. Stabilizing actions are taken only within what the user has authorized; otherwise they are `[planned]` recommendations.

State the classification in one line. If you can't classify, that itself is a signal — say so.

### Step 2 — Evidence gate (load-bearing checkable claims)

This step runs **after** the Clear/Simple exit and **before** method selection — trivial tasks never reach it. If the task survived Step 1 **and** rests on a load-bearing claim that a source could confirm or refute, gate the claim before any method consumes it. Two kinds of claim qualify:

- **Code claims** — what a function returns, where a defect lives, what a command does, what the backend sends.
- **Product / market claims** — what a competitor charges or ships, how many buyers exist, what users actually do, what a regulation or platform policy says.

1. Name the claim explicitly: "This conclusion depends on X being true."
2. Tag its provenance — **Primary**, **Secondary**, or **Inferred** — using the column for its domain in the **Quality of Information Check** card. In short: for code, Primary is code you read, command output, git, tests; for product/market, Primary is the entity's own page opened this session or the user's own data, **with a date**. Anything recalled from training data is Inferred, however confident it feels. Provenance is not proof: check that the evidence supports _this exact claim_ (a green test proves only what it asserts; a doc page proves what the page says, not what applies today).
3. Promote every load-bearing claim before it is used as a fact: run the read-only check, read the file, check git — or open the pricing page, the changelog, the filing, the analytics export. A claim that cannot be promoted stays a labelled `[hypothesis]`: methods may reason from it (that is how you decide what to check next), but no unconditional conclusion may rest on it. Without web access only public external facts become unverified — files and data the user supplied keep their provenance.

This is **Quality of Information Check** applied at the door (card: `references/quality-of-information-check.md` — open it when a conflict, a freshness question or a confidence call is not settled by the summary above). The gate validates the _inputs_ only — it does **not** produce the conclusion. "Claim verified" is not an answer; deciding _why_ the fact holds, _where_ the defect is, _which_ opportunity to pursue, and _what_ to do is still the methods' job (5 Whys, ACH, First Principles, JTBD, Assumption Mapping). If the task carries no checkable claim — the inputs are judgements about people, timing, or preference — skip the gate and go to Step 3.

When the task is product or market research, the gate is not a one-off check: run the **Research mode** below, which wraps the gate and Steps 3–5.

<example>
Gate fires (code claim): "The page crashes because `profile` can be null." Tier: **Inferred** — assumed from the stack-trace shape. Promote: read the API client and run the failing test → the endpoint returns 204 with an empty body, so `profile` really is null at runtime. Now **Primary**. → Hand off to 5 Whys / ACH to find _why_ the body is empty and _where_ the fix belongs. The gate proved the fact is real; it did not choose the fix.
</example>

<example>
Gate fires (market claim): "Competitor X has no free tier, so a freemium plan wins the low end." Tier: **Inferred** — recalled, no source. Promote: open X's pricing page → a free plan for up to 3 users exists (page checked 2026-09-14). The premise is false, so the strategy is rebuilt before any method runs on it. Had the page confirmed it, the gate would still not decide the strategy — that is JTBD / Assumption Mapping's job.
</example>

<example>
Gate skipped (no checkable claim): "How should I sequence telling the team, the board, and our customers about the reorg?" The inputs are judgements about people and timing, not facts a file, a command, or a public source could settle. Do **not** run the evidence gate; go straight to Step 3 (e.g. SCQA, SMEAC, ADKAR). Forcing an evidence gate onto a pure-judgement task is exactly the theater the Clear/Simple off-ramp exists to prevent.
</example>

### Step 3 — Select 1–3 methodologies

Match (Cynefin domain) × (task type) on this map. The slug is the card file you will open in Step 4.

| Task type                       | Default candidates (slug)                                                        |
| ------------------------------- | -------------------------------------------------------------------------------- |
| Decide under time pressure      | OODA `ooda` · First Principles `first-principles` · Schwerpunkt `schwerpunkt`     |
| Decide under uncertainty        | OODA `ooda` · ACH `ach` · Pre-mortem `pre-mortem`                                 |
| Prioritize                      | Eisenhower `eisenhower` · Schwerpunkt `schwerpunkt` · ToC `theory-of-constraints` · OKR `okr` |
| Diagnose root cause             | 5 Whys `5-whys` · ACH `ach` · ToC `theory-of-constraints`                         |
| Analyze competition             | Porter `porter-5-forces` · SWOT/TOWS `swot-tows` · JTBD `jtbd`                    |
| Map environment                 | PMESII `pmesii` · SWOT/TOWS `swot-tows`                                           |
| Discover user needs             | JTBD `jtbd` · Mom Test `mom-test` · Double Diamond `double-diamond`               |
| Find product opportunities      | Opportunity Solution Tree `opportunity-solution-tree` · JTBD `jtbd`               |
| De-risk a product bet           | Assumption Mapping `assumption-mapping` · Pre-mortem `pre-mortem`                 |
| Size a market                   | Market Sizing `market-sizing` · Porter `porter-5-forces`                          |
| Communicate to an audience      | Minto `minto` · SCQA `scqa` · SMEAC `smeac`                                       |
| Negotiate                       | BATNA `batna` · Thomas-Kilmann `thomas-kilmann`                                   |
| Drive org change                | ADKAR `adkar` · Kotter `kotter` · PDCA `pdca`                                     |
| Stress-test a plan              | Red Team `red-team` · ACH `ach` · Pre-mortem `pre-mortem` · Devil's Advocacy `sat` |
| Improve a system                | PDCA `pdca` · ToC `theory-of-constraints` · OKR `okr`                             |
| Multi-lens analysis             | Mental Models `mental-models` · First Principles `first-principles`               |
| Catch your own bias             | System 1/2 `system-1-2` · ACH `ach` · Red Team `red-team`                         |
| Personal task triage            | GTD `gtd` · Eisenhower `eisenhower`                                               |
| Verify a claim / weigh evidence | Quality of Information Check `quality-of-information-check` · ACH `ach`           |

Justify each choice in one line: "Using X because [specific problem trait]." If you can't justify it, drop it. When two candidates both look plausible, decide with the distinctions below — do not open both cards to compare.

#### Telling neighbouring methods apart

**Decomposition / "what's actually going on"**

- **Cynefin** — classify the problem domain _first_, before picking any decomposition method.
- **First Principles** — strip assumptions and rebuild from base facts. Use when conventional wisdom dominates and you suspect path-dependency.
- **5 Whys** — find the proximate cause in a mechanical/operational chain. Use for incidents and defects. Weakens past 2–3 levels on human/political problems.
- **Theory of Constraints** — find the single bottleneck in a throughput system. Use when there's flow (manufacturing, pipeline, funnel).

**Stress-testing a plan or hypothesis**

- **Red Team Analysis** — adversarial position; find exploits. Use when there's an actual opponent (competitor, attacker, hostile reviewer).
- **Pre-mortem** — imagine the plan already failed; work backwards to causes. Use against your own optimism bias on a plan you authored.
- **ACH** — list competing hypotheses; eliminate by disconfirming evidence. Use when multiple plausible explanations exist and you suspect motivated reasoning.
- **Devil's Advocacy (SAT)** — steelman the strongest counter-position. Use against groupthink in a team setting.

**Communication**

- **Minto Pyramid** — document structure (conclusion → arguments → evidence). Use for written memos and recommendations.
- **SCQA** — narrative opening (situation → complication → question → answer). Use to _open_ a doc or presentation; Minto follows.
- **SMEAC** — mission briefing under uncertainty. Use when handing off _action_, not delivering analysis.

**Prioritization**

- **Eisenhower Matrix** — personal triage by urgency × importance. Use for backlogs.
- **Schwerpunkt** — concentrate force on one point, starve the rest. Use when resources are insufficient for everything and you need a breakthrough.
- **Theory of Constraints** — optimize the bottleneck of a throughput system. Use when the constraint is the priority.
- **OKR** — align teams on outcomes. Use for quarterly/team-level goal setting, not individual task triage.

**Change**

- **ADKAR** — diagnose the individual stage of resistance ("why isn't person X adopting?"). Per-person tool.
- **Kotter's 8 Steps** — drive large org transformation across multiple teams. Heavyweight, multi-quarter.
- **PDCA** — validate a change at small scale before scaling. Use for process improvement, not strategic direction.

**Environment / competitive analysis**

- **Porter's 5 Forces** — industry attractiveness and where power sits in the value chain.
- **SWOT + TOWS** — strategy synthesis from internal+external inventory. _Never standalone_ — pair with Porter, JTBD, or PMESII as the data source.
- **PMESII** — full multi-domain environment scan (political, military, economic, social, infrastructure, information). Use for unfamiliar contexts.
- **JTBD** — why customers actually buy; what job your product is hired for. Use for product/segmentation, not industry structure.
- **Market Sizing (bottom-up)** — how big the reachable revenue is, built from countable units. Use when a number will drive a go/no-go or an investment case; never quote a top-down "1% of a $XB market".

**Product discovery**

- **JTBD** — _what_ progress the customer is trying to make. The lens for reading demand; it produces the job, not a plan.
- **Mom Test** — _how_ to collect evidence about that job from people without being lied to. Use whenever the input is interviews, survey answers, sales calls, or "users told us".
- **Opportunity Solution Tree** — _where_ to act: ties one outcome to the customer opportunities and the candidate solutions and experiments under it. Use when the backlog is a feature list with no visible link to an outcome.
- **Assumption Mapping** — _what to test first_: ranks the beliefs a bet rests on by importance × evidence. Use once a solution or strategy is on the table and you need the riskiest unknown, not more ideas.
- **Double Diamond** — the end-to-end process frame (discover → define → develop → deliver). Use when the problem itself is still undefined; the four above slot into its phases.

**Bias control / meta-cognition**

- **System 1/2 (Kahneman)** — notice which mode is driving the conclusion. Use as a first-pass meta-check.
- **ACH** — structural defense against confirmation bias when reasoning over evidence.
- **Mental Models (Munger)** — multi-lens check for blind spots from a single discipline.
- **Quality of Information Check** — before a conclusion relies on a fact, check it against evidence that supports that exact claim (code/git/command output; for product and market facts, the entity's own dated page or the user's own data), not docs or memory; weigh conflicting sources instead of crowning one. Defense against asserting from partial evidence.

### Step 4 — Open the chosen cards and apply them explicitly, not nominally

Open only the 1–3 cards you selected (`references/<slug>.md`) — never the whole library — and take each method's steps from its card, not from memory: the cards carry rules the generic versions of these methods lack. Walk through each card's **Steps** visibly. The reader must see the structure: "OODA — Observe: [content]. Orient: [content with biases named]. Decide: [content]. Act: [content]." If you only name the method, you have failed. When you pick more than one method, this applies to _each_ of them — don't apply the steps to the first and merely name the rest.

Walking a step is not the same as completing it with invented content. Three rules keep the walk honest:

- **Every causal or factual link carries its evidence** (file:line, log line, command output, quote). A link without evidence is a `[hypothesis]` — keep going only by listing competing hypotheses and the check that would separate them.
- **Mark external steps by what actually happened:** `[performed]` (you did it this turn, with the result), `[planned]` (proposed — Act, Do, Check, a fix you were not asked or not able to make), `[blocked]` (with why). An analysis request never turns into execution because a method has an Act step.
- **Answer the question that was asked.** If the data cannot answer it, say so and name the evidence that would — do not swap in an easier question and present its answer as the result. "Root cause undetermined from this data" is a complete, correct output.

<example>
Nominal (fails — theater): "Five Whys shows broken token rotation caused the crash." — or the subtler failure: "The cause of the failure can't be known from one log line, but the real root cause is that we have no logging standard" (a different question's answer, asserted without evidence).
Applied (passes): "5 Whys — E1: trace shows `profile.name` throwing with `profile = null`. E2: same-request trace shows the client mapping an HTTP 204 to `null` and passing it unchanged to render. Why 1 did render fail? It dereferenced a null profile (E1). Why 2 was profile null? The client maps the observed 204 to null (E2). Why 3 did the server return 204? `[hypothesis]` H1 expired session; H2 profile row missing. Established chain stops at N = 2. `[planned]` check: replay the request with a valid vs expired session and with/without a profile row; the server-side cause stays open until that check separates H1 from H2."
</example>

### Step 5 — Synthesize

Where do the chosen methods agree? Where do they diverge? Give the user an actionable conclusion. If methods conflict, name the conflict — don't paper over it.

## Research mode (product and market questions)

Runs when the user asks for product, market, competitor, pricing, or customer research — "research the competitors of X", "is there demand for Y", "how big is the market for Z", "what should we build next". Product facts live outside the codebase and decay fast, so this mode gathers and gates evidence _before_ any method consumes it. It wraps Steps 2–5; Cynefin (Step 1) still runs first.

**R1 — Frame the decision.** One line: which decision does this research inform, and what finding would change it? If nothing depends on the answer, say so and narrow to a question the user can act on. State scope assumptions (segment, geography, time frame) and proceed; ask only when the ambiguity changes which sources to read (e.g. two companies share the name).

**R2 — List questions and load-bearing claims.** 3–7 key questions. Under each, the specific facts the answer will rest on — prices, counts, feature presence, user behaviour, policy text. These are the gate's inputs, written down before searching so the search can't quietly redefine the question.

**R3 — Gather from the source that owns each fact.** Pricing → the vendor's pricing page; features → its docs and changelog; scale → filings, official statistics, app-store listings; behaviour → the user's own analytics, tickets, interview notes. Search to find, then open the page — a search snippet is Secondary until the page is read. Every fact gets its URL and a date. When the facts span several entities or more than ~5 independent lookups, delegate the gathering to `evidence-scout` subagents in parallel (one per competitor or per question); they return sourced, tiered, dated facts and no conclusions. Without web tools, say so up front: public external facts you could not open stay unverified (never filled from memory) and become a checklist the user can run, while documents and data the user supplied keep their provenance within their own dates.

**R4 — Gate.** Run Step 2 over everything gathered: tier, date, conflicts between sources. Label whatever didn't promote. For every claim about what users want, tag it as behaviour (did, paid, built a workaround) or opinion (likes, would, wants) — only behaviour counts as evidence of demand (Hard Rule "Stated preference is not demand"). This tag is part of the gate, not a method, and does not count toward the 3-method limit; run the full Mom Test only when interviews are the main evidence and you are planning or interpreting them.

**R5 — Apply methods (Steps 3–5) to the gated facts only.** Typical sets: competitor research → JTBD (what job each rival is hired for) + Porter or SWOT/TOWS; demand → JTBD + Mom Test; what to build → Opportunity Solution Tree + Assumption Mapping; sizing → Market Sizing (bottom-up). Same rules as everywhere: at most 3 methods, every step walked.

**R6 — Report in research shape** (see Output shape).

<example>
Theater (fails): "Using Porter and SWOT: the market is competitive, rivals have strong brands, our opportunity is AI features." No sources, no dates, prices from memory, methods named but not walked.
Applied (passes): R1 — the decision is whether to launch a $8/seat tier. R2 — claims: rival A's and rival B's entry price and seat limits; how many target teams already pay for a tool. R3 — pricing pages opened (A: $12/seat, checked 2026-10-02; B: free ≤3 seats, then $10, checked 2026-10-02); 9 of 14 interview notes show a paid workaround. R4 — all Primary and dated; two interview "would pay" quotes discounted as opinion. R5 — JTBD: situation — a lead of 3–8 people preparing a monthly review; job — show progress without hand-built reports; competing solutions — B's free tier, a spreadsheet, a part-time analyst; friction — B's free tier stops at 3 seats, spreadsheets break at month-end → teams of 4–10 sit in a price gap. Assumption Mapping: bet — an $8/seat tier lifts 4–10 seat trial-to-paid from 6% to 10%; beliefs — teams of 4–10 hit B's cap (desirability, Primary), price rather than onboarding blocks conversion (viability, no evidence), we can enforce a seat cap (feasibility, Primary); important × no-evidence → the price belief; kill test — an $8 checkout arm that must reach 10%. Bottom line: test an $8/seat price on 4–10 seat trials before launching the tier.
</example>

## Hard Rules

- **Max 3 methods per response.** Cognitive overhead exceeds value past that.
- **Never name a method without walking through its steps.** Methodology theater is the failure mode.
- **If Cynefin = Clear, exit the skill.** Don't force frameworks onto trivial tasks. A user asking "what's the syntax for X" doesn't need OODA.
- **If the user named a method (via `/methodology-toolkit:method <name>`), use that one.** Don't override their choice; if you judge it wrong, flag explicitly and apply anyway.
- **The Orient step of OODA is the entire point** — surface biases and assumptions, don't skip past it.
- **5 Whys weakens past 2–3 levels on human/political problems.** Switch to ACH or Cynefin if you find yourself inventing motives.
- **A method's shape never licenses its conclusion.** 5 Whys does not have to reach five links, PDCA does not have to report a Check result, a forced method does not have to produce a verdict. Stop the established chain where the evidence stops, mark unexecuted steps `[planned]`, and say what is undetermined — a confident answer to a different question is the worst failure this skill can produce.
- **ADKAR is an org-change tool**, not a self-coaching tool. Don't apply to single personal decisions.
- **"Not a regression" is not an acceptance criterion.** When Pre-mortem or Red Team surfaces a real defect, the default is to fix it — not to rationalize it. Comparing to prior broken behavior ("the original also had this", "no worse than before", "same as legacy") legitimizes shipping a known bug under methodological cover. The valid question is "what does correct look like?" — answered via First Principles — not "is this worse than current?". A defect inherited from the old code is still a defect.
- **No product or market fact from memory.** Prices, plans, feature sets, user counts, and market sizes recalled from training data are Inferred and probably stale. Open the source, or label the fact unverified — never state it as current.
- **Stated preference is not demand.** "Users said they want X" or "would pay" is opinion; what they did, paid for, or built as a workaround is evidence. Weight them differently and say which is which.
- **No code claim without primary evidence.** On engineering tasks the Evidence gate (Step 2) is not optional — promote every load-bearing code claim before a conclusion rests on it, or carry it as a labelled `[hypothesis]`. The gate rejects unverified inputs as facts; it does not replace the methods that turn a verified fact into a decision. (Mechanics in the next rule.)
- **Verify load-bearing claims before asserting them, not after.** When a conclusion rests on a specific fact — file content, a grep result, what a doc says, what a command will do — run the check _first_. Partial evidence (one file, one grep, prose in a `.md` doc or a `.d.ts`) is a hypothesis, not a conclusion: state it as "I need to verify X", verify, then conclude. A claim baked into an ACH evidence row or a First Principles base fact must be a _checked_ fact, or the method is corrupted. For what the code actually does, a relevant execution observation (code you read on the executed path, command output, a test that asserts that property) outweighs docs and comments for the observed case; for what the code is _supposed_ to do, a spec or contract is evidence in its own right — see `references/quality-of-information-check.md`.

## Double-pass pattern

A second pass has two independent triggers — check both:

- **Unverified inputs.** The first pass rests on claims you did not check. Go back to Step 2 and check them yourself (read the file, run the read-only check, open the page); a critic is not a substitute for evidence you can get directly.
- **High cost of error.** The decision is hard to reverse or touches money, auth, data integrity or a public contract. This calls for the independent `red-team-critic` subagent **even when every input is verified** — an independent context catches what self-review rationalizes away. Brief it with the target, the acceptance criteria, constraints, the facts you checked and open questions; pass your own reasoning separately, labelled as the author's position to challenge.

Decide on the task's traits, not on habit. When the user is in the loop (including via the `method` command), **offer** the critic pass on a hard-to-reverse recommendation and let them decide; spawn it on your own judgement only in autonomous flows. The critic is allowed to find nothing material — treat that as a result, not as a failed pass.

The pattern: first pass is fast and speculative (good for surfacing direction); second pass via **Red Team + Pre-mortem + ACH** stress-tests the first pass against reality. The second pass is there to catch concrete failures the first pass missed — wrong file guess, missed edge case (pluralization, breakpoint, null state), assumption that wasn't verified, regression introduced by the fix.

The second pass must use real verification, not just renaming methods: grep the codebase, run tests, open the browser, read the file you assumed about. Methodology without verification is the same theater the anti-pattern guard forbids.

For research, point the second pass at the bottom line and the High-confidence findings: "what source would make this wrong, and did we look for it?" A finding that only has confirming sources has not been tested.

Skip the double-pass when: the first pass already grounded itself in verified evidence (read the file, ran the test, checked the breakpoint), or the task is genuinely Clear/Simple.

## Output shape

End with a concrete actionable conclusion. The user should be able to _act_ on the response, not just understand a framework. The methodology is the scaffolding, not the building.

For **Research mode**, use this shape, scaled to the size of the question:

1. **Bottom line** — the answer to the R1 decision in 2–3 sentences, first, not last.
2. **Key findings** — numbered, most decision-relevant first. Each carries its sources (link or file + date) and a confidence for the _conclusion_, with one reason. **High**: the facts it rests on are checked, current for the question asked (an owner page observed now supports "the page shows X now"), unconflicted, and the inference from them is direct. **Medium**: part of it rests on Secondary sources, on one source type where independent ones exist (e.g. interviews only), or on a fact whose current applicability is unresolved (e.g. a price page dated >12 months ago). **Low**: Inferred, conflicting, self-reported only, or a long inference chain. Provenance or source count alone never makes a finding High.
3. **Analysis** — the chosen methods, each walked step by step.
4. **What we don't know** — unverified claims and gaps, marking the ones that would flip the bottom line if they turned out differently.
5. **Next step** — the cheapest action that shrinks the biggest unknown (a pricing-page test, five interviews, a data pull), with its pass/fail criterion stated in advance.
