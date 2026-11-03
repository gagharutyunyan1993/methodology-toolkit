# Example: Pricing Research Without Memory

This example shows how `methodology-toolkit` changes a product-research answer.
The scenario: a small B2B SaaS team is deciding whether to add a cheaper plan.
Company names and numbers below are illustrative — the point is the shape of the
reasoning, not the figures.

## User prompt

```text
Research our competitors' pricing. Should we add a cheaper plan for small teams?
```

## Typical answer without the toolkit

Your main competitors are Rival A, Rival B, and Rival C. Rival A charges around
$15 per user, Rival B is a bit cheaper, and Rival C targets enterprise. The
market for team analytics is large and growing quickly.

Using SWOT: your strengths are the product and support; the threat is
competition on price. A cheaper plan would help you capture small teams, who
told you in interviews they'd love a lower price.

Recommendation: launch a $9/seat Starter plan.

## Why that may be wrong

Every load-bearing fact in that answer is **Inferred**:

- the prices are recalled, undated, and may be a year out of date;
- "a bit cheaper" and "large and growing" are not facts anyone can check;
- "they'd love a lower price" is an opinion, not evidence of demand;
- SWOT is named but not walked, and it has no data source under it.

If Rival B now has a free plan for up to three seats, a $9 Starter plan
competes with free, and the whole recommendation inverts.

## Toolkit-driven answer shape

### Cynefin

**Complicated.** The facts are knowable (prices, plan limits, what our own
customers did), so analysis fits before experimentation.

### R1 — Frame the decision

Decision: add a lower-priced plan for teams of 2–10, or not. What would change
it: rivals already serving that segment for free or near-free, or no evidence
that small teams pay for a workaround today.

### R2 — Questions and load-bearing claims

1. What does each rival charge at the entry tier, and with what seat limits?
   Claims: entry price, free-tier existence, seat cap — per rival.
2. Do small teams pay for this job today?
   Claims: share of small-team interviewees with a paid workaround; trial-to-paid
   conversion of teams of 2–10 in our own data.

### R3 — Gather (three `evidence-scout` agents in parallel, one per rival)

| Claim | Finding | Source | Tier | Date |
| --- | --- | --- | --- | --- |
| Rival A entry price | $12/seat/mo, billed yearly; $15 monthly | Rival A pricing page | Primary | page checked 2026-10-02 |
| Rival B free tier | Free up to 3 seats, then $10/seat | Rival B pricing page | Primary | page checked 2026-10-02 |
| Rival C entry tier | `NOT FOUND` — "contact sales" only | Rival C pricing page | — | checked 2026-10-02 |
| Rival A "used by 8,000 teams" | 8,000 teams | Rival A homepage | Secondary, self-reported | checked 2026-10-02 |

Our own data, read directly: 9 of 14 small-team interview notes describe a paid
workaround (a spreadsheet consultant, a BI seat); trial-to-paid for teams of
2–10 is 6% vs 14% for larger teams over the last two quarters.

### R4 — Gate

- All rival prices are Primary and dated. Rival C is a gap, not a guess.
- Rival A's 8,000 teams is self-reported — kept out of any sizing.
- Two interview quotes ("I'd definitely pay less for a light version") are
  opinion and are discounted (Mom Test, step 5). The 9 paid workarounds are
  behaviour and count.

### R5 — Methods

**JTBD.** Situation: a team lead of 3–8 people preparing a monthly review.
Job: show the team's progress without building reports by hand. Competing
solutions for the same job: Rival B's free tier, a spreadsheet, a part-time
analyst. Friction: Rival B's free tier stops at 3 seats; spreadsheets break
at month-end. → The job is real, and teams of 4–10 sit in a gap: too big for
Rival B's free plan, too small to justify Rival A.

**Assumption Mapping.** Bet: a $8/seat plan for teams of 4–10 lifts small-team
trial-to-paid from 6% to 10%.

| Belief | Type | Importance | Evidence |
| --- | --- | --- | --- |
| Teams of 4–10 hit Rival B's 3-seat cap | Desirability | High | Primary (pricing page) |
| Price, not onboarding, is why small teams don't convert | Viability | High | **None** — no churn-reason data |
| A cheaper plan won't cannibalise current 4–10 seat customers | Viability | High | Weak — 11 such accounts today |
| We can enforce a seat cap in billing | Feasibility | Medium | Primary (billing code read) |

The important × no-evidence quadrant has one item: price as the conversion
blocker. That is the test.

### R6 — Report

**Bottom line.** Don't ship the plan yet. The gap is real (Rival B's free tier
ends at 3 seats, Rival A starts at $12), but nothing shows that price, rather
than onboarding, is what stops small teams from converting.

**Findings.**

1. Teams of 4–10 are underserved on price — **High** (two rival pricing pages,
   2026-10-02).
2. Small teams pay for this job today — **Medium** (9 of 14 interviews; one
   source type).
3. Price is the conversion blocker — **Low** (no data).

**What we don't know.** Why small-team trials don't convert (would flip the
bottom line); Rival C's pricing.

**Next step.** Two weeks of a price-anchored checkout test for new 4–10 seat
trials: show $8/seat to half. Pass if trial-to-paid in that arm reaches 10% with
at least 60 trials per arm; otherwise invest in onboarding instead.

## What changed

- Prices come from the rivals' own pages, with dates; the missing one is
  reported as missing, not guessed.
- "They'd love a lower price" is discounted; paid workarounds are counted.
- The methods run on gated facts, and each one is walked.
- The answer is a test with a pass/fail line, not a launch on assumptions.
