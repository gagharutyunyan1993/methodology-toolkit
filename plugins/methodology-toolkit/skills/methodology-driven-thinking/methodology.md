# Methodology Index

Curated library of decision-making, analytical, and communication frameworks. Used by the `methodology-driven-thinking` skill and the `/methodology-toolkit:method` command.

Each card has a consistent shape: origin, category, Cynefin fit, when to use, when NOT to use, explicit steps, and the kind of output it produces.

## Quick selection cheat sheet

| Task                            | Default candidates                    |
| ------------------------------- | ------------------------------------- |
| Decide under time pressure      | OODA · First Principles · Schwerpunkt |
| Decide under uncertainty        | OODA · ACH · Pre-mortem               |
| Prioritize                      | Eisenhower · Schwerpunkt · ToC · OKR  |
| Diagnose root cause             | 5 Whys · ToC · ACH                    |
| Classify the problem            | Cynefin                               |
| Analyze competition             | Porter · SWOT/TOWS · JTBD             |
| Discover user needs             | JTBD · Double Diamond · Mom Test      |
| Find product opportunities      | Opportunity Solution Tree · JTBD      |
| De-risk a product bet           | Assumption Mapping · Pre-mortem       |
| Size a market                   | Market Sizing (bottom-up) · Porter    |
| Map environment                 | PMESII · SWOT · Cynefin               |
| Communicate to audience         | Minto · SCQA · SMEAC                  |
| Negotiate                       | BATNA · Thomas-Kilmann                |
| Drive org change                | ADKAR · Kotter · PDCA                 |
| Stress-test a plan              | Red Team · ACH · Pre-mortem           |
| Improve a system                | PDCA · ToC · OKR                      |
| Multi-lens analysis             | Mental Models · First Principles      |
| Catch your own bias             | System 1/2 · ACH · Red Team           |
| Verify a claim / weigh evidence | Quality of Information Check · ACH    |

## Disambiguation — when methods overlap

When multiple candidates appear plausible, use these distinctions to pick the right one. Each block lists methods that compete for the same task type and the specific trait that selects between them.

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
- **Quality of Information Check** — before a conclusion relies on a fact, verify it at primary-source level (code/git/command output; for product and market facts, the entity's own dated page or the user's own data), not docs/memory. Defense against asserting from partial evidence.

---

## OODA Loop

**Origin:** John Boyd, US Air Force
**Category:** Decision under time pressure / adversarial
**Cynefin fit:** Complex, Chaotic

**Use when:** Adversarial or fast-moving situation where cycle speed matters more than initial precision — incident response, live negotiation, competitor moves.

**Avoid when:** Slow deterministic processes; problems with one correct answer that needs careful derivation.

**Steps:**

1. **Observe** — gather raw situation data without interpreting.
2. **Orient** — interpret through experience, context, and biases. _The load-bearing step._ Surface what assumptions you're carrying in. Most failures live here.
3. **Decide** — choose a course of action.
4. **Act** — execute, then return to Observe with new data.

**Output:** Iteration cycles that compound faster than the adversary's, forcing them to react to a stale model of reality.

---

## PDCA (Plan-Do-Check-Act)

**Origin:** W. Edwards Deming
**Category:** Continuous improvement
**Cynefin fit:** Complicated, Complex

**Use when:** Improving a repeatable process; rolling out a change you want to validate before scaling.

**Avoid when:** One-shot decisions; time-pressured situations where OODA fits better.

**Steps:**

1. **Plan** — design the change and define explicit success criteria.
2. **Do** — execute at small scale.
3. **Check** — compare results to the criteria honestly.
4. **Act** — adopt, adapt, or abandon. Then loop.

**Output:** A sustained improvement curve, not a one-time fix.

---

## Cynefin

**Origin:** Dave Snowden
**Category:** Problem classification / meta-dispatcher
**Cynefin fit:** All — this _is_ the classifier

**Use when:** Before applying any other framework. To prevent applying simple solutions to complex problems.

**Avoid when:** Almost never. Even a 30-second classification beats none.

**Steps:**

1. Identify the problem in front of you.
2. Place it in one domain:
   - **Clear/Simple** — known cause-effect; apply best practice.
   - **Complicated** — knowable cause-effect via expertise; apply good practice.
   - **Complex** — cause-effect only visible retrospectively; experiment via safe-to-fail probes.
   - **Chaotic** — no clear cause-effect; act first to stabilize, then sense.
3. Choose your method by domain. Do not pull a Complicated-domain method into a Complex problem (most common error).
4. If the problem shifts domains (chaos becomes complex once stabilized), reclassify.

**Output:** A correct _category_ of response, which prevents the most common strategic error.

---

## 5 Forces (Porter)

**Origin:** Michael Porter, HBS
**Category:** Competitive / industry analysis
**Cynefin fit:** Complicated

**Use when:** Assessing the attractiveness of an industry, market entry decision, or mapping where real power sits in your value chain.

**Avoid when:** Fast-moving tech markets where forces change quarterly; analyzing a single product (use JTBD instead).

**Steps:**

1. **Rivalry** — intensity of direct competition. Many small or few large? Differentiated or commodity?
2. **New entrants** — barriers to entry. Capital? Network effects? Regulation?
3. **Substitutes** — alternative ways to solve the customer's job (overlaps with JTBD).
4. **Supplier power** — concentrated suppliers? Switching costs?
5. **Buyer power** — concentrated buyers? Price sensitivity? Information transparency?

**Output:** A map of where real power sits. Strategy follows: position where forces are weakest, or work to weaken them.

---

## ADKAR

**Origin:** Prosci
**Category:** Individual change diagnosis
**Cynefin fit:** Complicated, Complex

**Use when:** Diagnosing why a person or team isn't adopting a change; sequencing communication during rollout.

**Avoid when:** Designing the strategic _direction_ of change (use Kotter or First Principles); analyzing your own personal decisions.

**Steps:**

1. **Awareness** — does the person know change is needed?
2. **Desire** — do they want to participate?
3. **Knowledge** — do they know HOW to change?
4. **Ability** — can they actually do it in practice?
5. **Reinforcement** — is the new behavior sustained?

**Output:** Identification of the specific stage someone is stuck at, which dictates the intervention (awareness gap ≠ ability gap).

---

## Kotter's 8 Steps

**Origin:** John Kotter, HBS
**Category:** Organizational transformation
**Cynefin fit:** Complicated

**Use when:** Large-scale corporate change initiatives; building momentum across a multi-team org.

**Avoid when:** Small teams; tactical change; agile environments where this feels heavyweight.

**Steps:**

1. Create urgency.
2. Build a guiding coalition.
3. Form a strategic vision and initiatives.
4. Enlist a volunteer army.
5. Enable action by removing barriers.
6. Generate short-term wins.
7. Sustain acceleration.
8. Institute change in culture.

**Output:** A sequenced campaign that turns a one-time push into a durable cultural shift.

---

## First Principles

**Origin:** Aristotle; popularized by Musk
**Category:** Decomposition / decision
**Cynefin fit:** Complicated, Complex

**Use when:** Conventional wisdom dominates; cost structures seem fixed by assumption; you need to escape "this is how it's done".

**Avoid when:** Time-pressured decisions; problems where received wisdom is actually right and you'd be reinventing wheels.

**Steps:**

1. State the problem.
2. Decompose to undeniable base facts. Strip analogies, conventions, and "everyone knows".
3. For each base fact, verify it independently (data, physics, primary sources).
4. Rebuild a solution from the bottom up, ignoring how the current solution looks.
5. Compare to status quo — the gap is your opportunity.

**Output:** A reasoning chain rooted in verifiable facts, often revealing the status quo is path-dependent rather than necessary.

---

## 5 Whys

**Origin:** Toyota Production System
**Category:** Root cause analysis
**Cynefin fit:** Complicated

**Use when:** Operational incidents, manufacturing defects, simple causal chains where the chain is mechanical.

**Avoid when:** Human/political/systemic problems — past 2–3 "whys" the method drifts into pop-psychology. Switch to ACH or Cynefin.

**Steps:**

1. State the problem concretely.
2. Ask "why did this happen?" — answer with a concrete cause, not a feeling.
3. Take that cause as the new problem. Ask why again.
4. Repeat ~5 times until you hit a cause you can actually act on.
5. Validate: if you fixed the root cause, would the symptom go away?

**Output:** A causal chain that distinguishes proximate from root cause, with an actionable intervention point.

---

## Eisenhower Matrix

**Origin:** Dwight D. Eisenhower (popularized by Covey)
**Category:** Prioritization
**Cynefin fit:** Clear, Complicated

**Use when:** Backlog triage; "I have too many things and don't know what to do first".

**Avoid when:** Strategic prioritization where every item appears important AND urgent (use Schwerpunkt or ToC).

**Steps:**

1. List every candidate task.
2. Score urgency (high/low) and importance (high/low).
3. Place into quadrant:
   - **Urgent + Important** → do now
   - **Important + Not urgent** → schedule (this is where leverage lives)
   - **Urgent + Not important** → delegate
   - **Neither** → delete
4. Notice the trap: most time leaks into "urgent + not important".

**Output:** Re-allocation of attention from urgent-but-shallow to important-but-deferred.

---

## GTD (Getting Things Done)

**Origin:** David Allen
**Category:** Personal productivity / cognitive offload
**Cynefin fit:** Clear, Complicated

**Use when:** Mental RAM is full; you keep forgetting commitments; context-switching is destroying focus.

**Avoid when:** Strategic question of WHAT to do — GTD is process, not selection. Pair with Eisenhower or OKR.

**Steps:**

1. **Capture** everything in your head into an external system.
2. **Clarify** each item: actionable? one action or project? what's the next physical step?
3. **Organize** by context (calls, computer, home) and project.
4. **Reflect** weekly — review all open loops.
5. **Engage** — pick from your lists based on context, time, energy, priority.

**Output:** A trusted external system that lets you stop using your brain as a sticky note.

---

## SMEAC

**Origin:** US military
**Category:** Briefing / communication under uncertainty
**Cynefin fit:** Complex, Chaotic

**Use when:** Delegating a mission with imperfect information; handing off work where you won't be available; crisis briefings.

**Avoid when:** Routine task handoffs where this feels bureaucratic.

**Steps:**

1. **Situation** — current context, actors, threat or opportunity.
2. **Mission** — the specific objective in one sentence. Why we are doing this.
3. **Execution** — how we'll do it, sequence, individual responsibilities.
4. **Administration / Logistics** — resources, supply, support.
5. **Command / Communications** — who decides what, how we stay in touch, fallback channels.

**Output:** A briefing where the receiving party can act independently without losing context, intent, or resources.

---

## Schwerpunkt

**Origin:** German military doctrine
**Category:** Focus / strategic concentration
**Cynefin fit:** Complicated, Complex

**Use when:** Resources insufficient for everything; you need a decisive breakthrough rather than incremental progress on all fronts.

**Avoid when:** Defensive/maintenance posture; portfolio diversification contexts.

**Steps:**

1. List everything competing for resources/attention.
2. Identify the _one_ point where concentrated effort produces disproportionate outcome.
3. Explicitly _de-prioritize_ the rest. Not "we'll get to it later" — actively starve them.
4. Concentrate force on the chosen point until breakthrough.
5. Reassess and pick the next Schwerpunkt.

**Output:** A concentrated attack producing a breakthrough, vs. a thinly-spread effort producing nothing.

---

## Mental Models (Munger)

**Origin:** Charlie Munger
**Category:** Multi-lens analysis
**Cynefin fit:** Complicated, Complex

**Use when:** Important decision where being wrong is costly; analysis where you suspect blinders; cross-disciplinary problems.

**Avoid when:** Simple, time-pressured decisions where one good lens beats many mediocre ones.

**Steps:**

1. Identify the decision or analysis.
2. Run it through at least 3 lenses from different disciplines (economics → incentives; psychology → biases; physics → scale/leverage; biology → competition/ecosystem; military → game theory).
3. Note where lenses agree → high-confidence finding.
4. Note where lenses disagree → that's your most interesting question.
5. Apply inversion: instead of "how to succeed", ask "how would this fail?"

**Output:** A multi-dimensional view that catches blind spots invisible to any single discipline.

---

## System 1 / System 2 (Kahneman)

**Origin:** Daniel Kahneman, _Thinking Fast and Slow_
**Category:** Meta-cognition
**Cynefin fit:** All — this is a meta-tool

**Use when:** High-stakes decisions where intuition is leading; emotionally charged context; decisions you keep flipping on.

**Avoid when:** Trivial decisions where System 1 is fine (most of life).

**Steps:**

1. Notice which system is driving. Fast, effortless, certain = System 1. Effortful, slow, uncertain = System 2.
2. State the System 1 verdict explicitly. Naming it weakens its grip.
3. Identify which biases might be active (anchoring, availability, loss aversion, confirmation, halo).
4. Run the decision through System 2: write the argument, check the math, seek disconfirming evidence.
5. Compare System 1 and System 2 verdicts. Mismatch = pause and dig.

**Output:** Awareness of _which_ cognitive mode produced the conclusion, which dictates how much to trust it.

---

## Jobs To Be Done (JTBD)

**Origin:** Clayton Christensen
**Category:** User/customer discovery
**Cynefin fit:** Complex

**Use when:** Building a product, prioritizing features, segmenting a market, or asking "why do people actually buy this?"

**Avoid when:** Pure technical decisions; B2B where buyer ≠ user and the "job" is political.

**Steps:**

1. Forget demographics and personas. Ask: in what _situation_ does someone reach for this product?
2. Identify the **job** — the progress they're trying to make. Functional, emotional, social.
3. Identify competing solutions for the _same job_ (often unexpected — milkshakes compete with bagels, not other milkshakes).
4. Map the friction in current solutions.
5. Design for the job, not for the demographic.

**Output:** A clearer product target — the job the user is hiring you for — which often differs from what they say they want.

---

## Double Diamond

**Origin:** British Design Council
**Category:** Design / discovery process
**Cynefin fit:** Complex

**Use when:** Open-ended product or service design; problem space is fuzzy; risk of solving the wrong problem.

**Avoid when:** Problem is well-defined; tight timeline that doesn't allow divergent exploration.

**Steps:**

1. **Discover** (diverge) — explore the problem space broadly. Interviews, observation, data.
2. **Define** (converge) — synthesize findings into a single problem statement.
3. **Develop** (diverge) — generate many possible solutions without filtering.
4. **Deliver** (converge) — prototype, test, and commit to one.

**Output:** A solution to the _right_ problem, not just a well-executed solution to the wrong problem.

---

## Opportunity Solution Tree

**Origin:** Teresa Torres, _Continuous Discovery Habits_
**Category:** Product discovery / prioritization
**Cynefin fit:** Complex

**Use when:** Deciding what to build next; a roadmap or backlog is a list of features with no stated outcome; several stakeholders push competing solutions.

**Avoid when:** The outcome is undefined and nobody owns one (set the outcome first — OKR); pure delivery work where the solution is already decided and validated.

**Steps:**

1. **Outcome** — write the single measurable outcome at the root (a metric the team can move, e.g. "week-4 retention of new accounts"), not a business goal ("grow revenue") and not an output ("ship reports v2").
2. **Opportunities** — under it, list customer needs, pains, and desires phrased from the customer's side ("I can't tell which of my campaigns actually brought customers"), each traced to evidence (an interview, a support ticket, behavioural data). Opportunities with no evidence are marked as assumed.
3. **Structure** — break large opportunities into smaller child opportunities until each one is concrete enough to solve in one go.
4. **Choose a target** — pick one opportunity by size (how many customers, how often), evidence strength, and fit with strategy. Say why the others lose.
5. **Solutions** — generate at least three candidate solutions for the target opportunity, so you compare rather than confirm.
6. **Experiments** — under each solution, name the assumption test that would kill or keep it (see Assumption Mapping), cheapest first.

**Output:** A visible chain outcome → opportunity → solution → experiment, so every proposed feature can answer "which opportunity, and what evidence says it matters?"

---

## Assumption Mapping

**Origin:** David J. Bland (_Testing Business Ideas_, with Alexander Osterwalder), building on IDEO's desirability / viability / feasibility lens
**Category:** Product risk / experiment design
**Cynefin fit:** Complex

**Use when:** A product bet, feature, pricing change, or new-market entry is on the table and you must decide what to validate before committing; the team is arguing opinions instead of tests.

**Avoid when:** The bet is cheap and reversible (just ship and measure); the beliefs are already backed by strong primary evidence.

**Steps:**

1. Write the bet in one sentence (who, what, expected result).
2. List every belief the bet needs to be true, under three headings: **Desirability** (they want it), **Viability** (it pays — pricing, CAC, margin, channel), **Feasibility** (we can build and run it). Phrase each as a falsifiable statement: "Team leads will pay $X/seat for Y."
3. Place each belief on two axes: **importance** (if wrong, does the bet die?) × **evidence** (do we have primary evidence, or is it opinion?). Evidence is rated with Quality of Information Check tiers.
4. The **important × no-evidence** quadrant is the test list. Order it by importance.
5. For the top 1–3, design the cheapest test that could _disprove_ the belief: what you will do, what result counts as a pass, decided _before_ running it.

**Output:** A short, ordered list of the riskiest assumptions, each with a pre-registered kill criterion — so the next week of work reduces the biggest unknown instead of polishing a feature.

---

## Mom Test

**Origin:** Rob Fitzpatrick, _The Mom Test_
**Category:** Customer evidence / interviewing
**Cynefin fit:** Complex

**Use when:** Planning or interpreting customer interviews, sales calls, surveys, or user feedback; any claim of the form "users want X" or "customers said they would pay".

**Avoid when:** You have behavioural data that already answers the question (analytics, payments, usage logs) — read that first; usability testing of a built UI (use task-based tests instead).

**Steps:**

1. Talk about **their life, not your idea.** Drop the pitch; ask about the problem in their world.
2. Ask about **specific past behaviour, not hypotheticals.** "When did this last happen? What did you do? What did it cost you?" — never "Would you use…?" or "Would you pay…?".
3. **Discard bad data:** compliments ("sounds great"), fluff (generic or future-tense claims: "I usually", "I would", "I might"), and wish lists. Record them as noise, not signal.
4. **Look for commitment and currency:** time, reputation, or money they already spend on the problem (workarounds, paid tools, hours) or will put down now (a pilot, an intro, a pre-order).
5. When reading existing feedback, re-tag each statement as **behaviour** (did / paid / built a workaround) vs **opinion** (likes / would / wants). Only behaviour counts as evidence for demand.

**Output:** A demand assessment built on what people did and committed, with stated opinions explicitly discounted.

---

## Market Sizing (bottom-up)

**Origin:** Venture and corporate-strategy practice (TAM / SAM / SOM)
**Category:** Market analysis / quantification
**Cynefin fit:** Complicated

**Use when:** A go/no-go, a pricing decision, a pitch, or an investment case depends on how big the opportunity is.

**Avoid when:** The market does not exist yet and no proxy behaviour can be counted (switch to JTBD + Assumption Mapping and treat size as an assumption to test); the number would not change the decision.

**Steps:**

1. **Define the unit** — the countable buyer (companies with 50–500 employees using Google Workspace, HR teams of N+, etc.) and the price point per unit per year.
2. **TAM** — count all units that have the job × annual price. Every count and price carries a source and its date (Quality of Information Check); a top-down analyst figure may be quoted only as a cross-check, never as the base.
3. **SAM** — narrow to the units you can actually serve now (geography, language, integrations, segment, compliance) and show each filter with its number.
4. **SOM** — the share of SAM you can realistically win in 1–3 years, derived from capacity (sales/marketing throughput, conversion rates you have observed or benchmarked), not from a chosen percentage.
5. **Sanity-check** against one independent anchor (a competitor's disclosed revenue or user count, a public dataset). If bottom-up and anchor differ by more than ~3×, find out why before using either.

**Output:** A defensible size estimate built from counts × price with every input sourced and dated, plus the assumption that moves it the most.

---

## Theory of Constraints (Goldratt)

**Origin:** Eliyahu Goldratt, _The Goal_
**Category:** System optimization
**Cynefin fit:** Complicated

**Use when:** Throughput-limited systems (manufacturing, software pipelines, sales funnels); diagnosing where optimization will pay off.

**Avoid when:** Bottleneck unclear or shifts constantly; the system isn't really about throughput.

**Steps:**

1. **Identify** the system's constraint (the slowest step, the bottleneck).
2. **Exploit** the constraint — make sure it's never idle, never wastes capacity.
3. **Subordinate** everything else to the constraint — other resources run at its pace.
4. **Elevate** the constraint — add capacity to it.
5. **Repeat** — once relieved, a new constraint emerges. Don't keep optimizing the old one.

**Output:** Investment focused on the single point that actually moves throughput, instead of locally optimizing non-bottlenecks.

---

## OKR

**Origin:** Andy Grove (Intel), popularized by Google
**Category:** Goal setting / alignment
**Cynefin fit:** Complicated, Complex

**Use when:** Aligning multiple teams on outcomes; quarterly planning; making "what matters" explicit.

**Avoid when:** Stable operational work (use KPIs); very small teams where alignment is happening informally.

**Steps:**

1. Define the **Objective** — qualitative, inspirational, directional ("Become the default choice for X").
2. Define 3–5 **Key Results** — quantitative, measurable, time-bound ("Increase Y from N to M by Q3").
3. Verify: if all KRs are hit, is the Objective achieved? If not, KRs are wrong.
4. Stretch: KRs should feel uncomfortable. 100% hit means you set them too low.
5. Score at end of cycle. Discuss what was learned, not what was missed.

**Output:** Shared clarity on what "winning" looks like this quarter, decoupled from how individuals get there.

---

## Minto Pyramid

**Origin:** Barbara Minto, McKinsey
**Category:** Written communication structure
**Cynefin fit:** All

**Use when:** Business documents, executive memos, recommendations — anywhere the reader is time-pressured and wants the point first.

**Avoid when:** Suspense-driven narrative (a story, an investigation reveal); pedagogical material where the journey matters.

**Steps:**

1. State the conclusion / recommendation first.
2. Below it, list 2–4 supporting arguments.
3. Below each argument, list the evidence/data.
4. Each level supports the level above. Test by removing a level — does the parent still stand?
5. Reverse-test: a reader who stops after the first sentence still gets the point.

**Output:** A document where the busy reader gets the answer immediately and the curious reader can drill down.

---

## SCQA

**Origin:** Barbara Minto / McKinsey
**Category:** Narrative opening / framing
**Cynefin fit:** All

**Use when:** Opening a presentation, document, or pitch where you need to create attention and shared context before delivering the answer.

**Avoid when:** Internal status updates where everyone has full context — Minto's bare conclusion-first is enough.

**Steps:**

1. **Situation** — establish neutral, shared context. The world as it currently is.
2. **Complication** — introduce the tension. Something has changed, broken, or is closing.
3. **Question** — surface the question the audience naturally now asks.
4. **Answer** — your recommendation. From here you're in Minto territory.

**Output:** An opening that pulls the audience in by making them feel the question before you give the answer.

---

## BATNA

**Origin:** Fisher & Ury, _Getting to Yes_ (Harvard)
**Category:** Negotiation
**Cynefin fit:** Complicated

**Use when:** Any negotiation — salary, contract, partnership, dispute. Before the conversation, not during.

**Avoid when:** Cooperative problem-solving with collaborative framing; situations where you don't actually have power.

**Steps:**

1. List your alternatives if no deal is reached.
2. Pick the **best** of those alternatives. That's your BATNA.
3. Quantify your BATNA — what's it actually worth?
4. Estimate the other side's BATNA. This is the harder, more valuable step.
5. The party with the better BATNA has the leverage. Walk-away = your BATNA; ZOPA sits between both BATNAs.

**Output:** A clear walk-away point and an accurate map of who actually has leverage — often differs from who appears to.

---

## Thomas-Kilmann

**Origin:** Kenneth Thomas & Ralph Kilmann
**Category:** Conflict management
**Cynefin fit:** Complicated, Complex

**Use when:** Recurring conflict with a person or team; choosing how to handle disagreement deliberately rather than by reflex.

**Avoid when:** One-shot transactional conflicts where overthinking is overkill.

**Steps:**

1. Recognize the conflict on two axes: assertiveness (push your concerns) and cooperativeness (accommodate theirs).
2. Identify your default mode:
   - **Competing** — high assertiveness, low cooperation.
   - **Collaborating** — high both.
   - **Compromising** — medium both.
   - **Avoiding** — low both.
   - **Accommodating** — low assertiveness, high cooperation.
3. Match mode to context: competing for emergencies; collaborating for long-term relationships; avoiding for trivial; accommodating to preserve relationship; compromising for fast partial solutions.
4. Deliberately choose a different mode than your default if the situation calls for it.

**Output:** Conscious choice of conflict mode instead of reflexive reaction — different modes are optimal in different contexts.

---

## ACH (Analysis of Competing Hypotheses)

**Origin:** Richards Heuer, CIA
**Category:** Intelligence analysis / hypothesis testing
**Cynefin fit:** Complicated, Complex

**Use when:** Multiple plausible explanations; high-stakes decision; risk of motivated reasoning toward your favored theory.

**Avoid when:** Time pressure with a clearly dominant hypothesis; trivial decisions.

**Steps:**

1. List all plausible hypotheses — at least 3, ideally including ones you find uncomfortable.
2. List all available evidence and assumptions.
3. Build a matrix: rows = hypotheses, columns = evidence. Mark each cell C (consistent), I (inconsistent), or N/A.
4. **Crucial step:** focus on evidence that DISCONFIRMS hypotheses, not evidence that confirms your favorite. Confirming evidence is cheap; disconfirming is decisive.
5. The hypothesis with the _fewest inconsistencies_ survives — not the one with the most confirmations.

**Output:** A surviving hypothesis chosen by elimination rather than confirmation, which protects against confirmation bias.

---

## Red Team Analysis

**Origin:** US military / intelligence
**Category:** Adversarial review
**Cynefin fit:** Complicated, Complex

**Use when:** Before committing to a non-trivial plan, architecture, strategy, or hypothesis; when you suspect groupthink; when stakes are high.

**Avoid when:** Trivial decisions where the cost of critique exceeds the cost of being wrong.

**Steps:**

1. Define what the "blue team" (the plan/proposal) is trying to achieve.
2. Adopt the position of the adversary — competitor, attacker, hostile reviewer, or future self looking back at failure.
3. Ask: how do I make this plan fail? What would I exploit? Which assumption is weakest?
4. Surface unstated assumptions and load-bearing dependencies.
5. Generate concrete failure modes, not vague concerns. Order by probability × impact.

**Output:** A list of specific weaknesses and attack vectors the original planner missed due to their own perspective.

---

## Pre-mortem

**Origin:** Gary Klein
**Category:** Decision risk assessment
**Cynefin fit:** Complicated, Complex

**Use when:** Before committing to a plan, as a complement to optimistic planning.

**Avoid when:** Trivial decisions; chronically anxious planners (overuse causes paralysis).

**Steps:**

1. Imagine vividly that 6 or 12 months have passed and the plan has failed catastrophically.
2. Each person, independently, writes down the reasons it failed.
3. Pool and categorize reasons. Identify which can be mitigated now.
4. Adjust the plan or build counter-measures for high-impact failure modes.

**Output:** Failure modes surfaced by treating failure as already real, which bypasses optimism bias.

---

## PMESII

**Origin:** US military doctrine
**Category:** Environmental / situational assessment
**Cynefin fit:** Complicated, Complex

**Use when:** Entering an unfamiliar context (new market, geography, domain) and you need a full-picture survey before acting.

**Avoid when:** Narrow technical decisions; well-understood environments.

**Steps:**

1. **Political** — formal and informal power structures, key actors.
2. **Military** (or competitive/security) — forces, threats, alliances.
3. **Economic** — markets, currencies, dependencies, trade flows.
4. **Social** — demographics, culture, norms, networks.
5. **Infrastructure** — physical and digital systems the situation depends on.
6. **Information** — narratives, media, signals, what's being said and by whom.

**Output:** A multi-dimensional environmental map that prevents narrow-frame decisions.

---

## SWOT + TOWS

**Origin:** Albert Humphrey (SWOT); Heinz Weihrich (TOWS extension)
**Category:** Strategy synthesis
**Cynefin fit:** Complicated

**Use when:** As one component of broader strategic analysis (paired with Porter, JTBD, or PMESII). Not standalone.

**Avoid when:** Used alone or as a final answer — SWOT is an inventory step, not a strategy.

**Steps:**

1. **SWOT inventory:** Strengths, Weaknesses (internal); Opportunities, Threats (external).
2. **TOWS combinations:**
   - SO (Strengths × Opportunities) — leverage strengths to capture opportunities.
   - ST (Strengths × Threats) — use strengths to mitigate threats.
   - WO (Weaknesses × Opportunities) — fix weaknesses by pursuing opportunities.
   - WT (Weaknesses × Threats) — defensive moves to avoid disaster.
3. Each TOWS cell is a candidate strategy. Prioritize across them.

**Output:** Concrete strategic moves grounded in actual position, rather than a four-bucket list with no action.

---

## SAT (Structured Analytic Techniques)

**Origin:** US Intelligence Community
**Category:** Meta-library of analytic methods
**Cynefin fit:** All

**Use when:** You need a structured approach to a specific analytic task and the named methods above don't fit.

**Avoid when:** You already know which method to use — go directly to it.

**Key techniques:**

- **Key Assumptions Check** — explicitly list and challenge each assumption supporting your analysis.
- **Scenarios / Alternative Futures** — generate 3–4 distinct future worlds; plan for the most plausible AND the most dangerous.
- **Indicators / Signposts** — pre-define what evidence would change your assessment.
- **Quality of Information Check** — rate each input by source reliability and credibility. Elevated to its own card below (see the Primary/Secondary/Inferred tiering).
- **Devil's Advocacy** — assign someone to argue the strongest counter-position.

**Output:** A more rigorous analysis than narrative reasoning alone, with explicit checkpoints against bias.

---

## Quality of Information Check

**Origin:** US Intelligence Community (a SAT technique), elevated here to a standalone card
**Category:** Evidence quality / epistemic discipline
**Cynefin fit:** All — applies whenever a conclusion rests on facts

**Use when:** A decision or analysis depends on specific claims — what a file contains, what a doc says, what a command will do, what the backend returns, what a competitor charges, how many buyers exist, what users actually do. Run it _before_ treating any claim as load-bearing.

**Avoid when:** Never skip on high-stakes conclusions. Only skippable for a fact you just observed at primary level moments ago.

**Steps:**

1. List each fact the conclusion depends on.
2. Tag each fact by source-reliability tier (most reliable first), using the column for its domain:

   | Tier          | Code / systems                                                     | Product / market (external)                                                                                                                                                                                                     |
   | ------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Primary**   | Command output, code you just read, git history, test results.     | The entity's own source, opened this session (pricing page, docs, changelog, terms, app-store listing, filings, official statistics); the user's own data (analytics, payments, support tickets, interview notes).              |
   | **Secondary** | `.d.ts`, prose docs, CLAUDE.md, code comments. All subject to drift. | Third-party coverage: analyst reports, press, review sites, comparison blogs, search-result snippets, AI-generated summaries. Also an entity's claims about its own performance or adoption ("10,000 teams use us", "cuts reporting time by 40%") — tagged **self-reported**: the page is first-party, but nothing checks the number. Its own terms (prices, plan limits, features) are Primary, not self-reported. |
   | **Inferred**  | Memory, assumption, "it's probably like X", analogy to another codebase. | Training-data memory ("as I recall they charge $X"), analogy to another market, extrapolation from one anecdote.                                                                                                                 |

3. **Date every external fact.** Record the page date or, failing that, the date you accessed it. Prices, plans, feature sets, and headcounts decay in months; an undated product fact is Inferred regardless of where it came from.
4. For any load-bearing fact resting on Secondary or Inferred, **promote it**: run the command, read the file, check git — or open the entity's own page, find the filing, read the user's data — and convert it to Primary before relying on it. If it cannot be promoted (no web access, paywalled, not published), keep it in the analysis **labelled** as unverified; never restate it as fact.
5. If a Secondary source conflicts with a Primary source, the Primary wins; flag the Secondary as stale. If two Primary sources conflict (e.g. pricing page vs. docs), report both with dates rather than picking one.

**Output:** A conclusion where every load-bearing fact is verified at Primary level — and, for external facts, sourced and dated — not asserted from docs, memory, or partial evidence.

**Used as:** the **Evidence gate** in `SKILL.md` Step 2.5 — that gate _is_ this card applied at the door to code claims and to product/market claims before any method consumes them. It remains one method in this index, not a separate subsystem: the gate validates inputs; the conclusion is still produced by the methods downstream (5 Whys, ACH, First Principles). Delete the other methods and this card alone tells you a fact is trustworthy, not what it means.
