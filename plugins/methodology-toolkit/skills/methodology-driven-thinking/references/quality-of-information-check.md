# Quality of Information Check

**Origin:** US Intelligence Community (a SAT technique), elevated here to a standalone card
**Category:** Evidence quality / epistemic discipline
**Cynefin fit:** All — factual verification is independent of how complex the problem is

**Use when:** A conclusion, risk call or next action depends on a checkable claim — what a file contains, what a command returns, what the backend sends, what a document or contract promises, what a competitor charges, how many buyers exist, what users actually did. Also for claims a method introduces mid-analysis.

**Avoid when:** No checkable premise could change the answer (pure judgement about people, timing, preference), or the claim was just observed directly and still applies — reuse it rather than re-checking.

**Steps:**

1. **List the claims whose reversal would change the answer.** Separate what was _observed_ from what is _inferred_, _assumed_ (`[hypothesis]`) or _predicted_.
2. **Tag provenance** — where the evidence comes from, using the column for its domain. Provenance describes the source; it is **not** a truth ranking.

   | Tier          | Code / systems                                                     | Product / market (external)                                                                                                                                       |
   | ------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Primary**   | Command output, code you just read, git history, test results.     | The entity's own source for its own terms (pricing page, docs, changelog, terms, filings, official statistics); the user's own data (analytics, payments, tickets, interview notes). |
   | **Secondary** | Prose docs, `.d.ts`, comments, project-instruction files — they describe the code and drift from it. | Third-party coverage (analysts, press, reviews, comparison blogs, search snippets, AI summaries); an entity's claims about its own performance or adoption, tagged **self-reported**. |
   | **Inferred**  | Memory, assumption, analogy to another codebase.                   | Training-data memory, analogy to another market, extrapolation from one anecdote.                                                                                  |

   A source locator can be a URL, a file plus line, a passage the user supplied, or a tool result. "Inferred" describes the claim, not the availability of web tools: a document or export the user gave you keeps its provenance with the network off.
3. **Check support for the exact claim**, not just the source's standing. A tool result shows what was returned; a quote checked against its page shows what that page says. Reading code or a passing test establishes only the properties they actually cover — inspect what the test asserts. `NOT FOUND` is not proof of absence.
4. **Hypotheses are allowed; laundering them is not.** Methods may run on `[hypothesis]` premises (ACH, Pre-mortem, Assumption Mapping, the branches below a 5 Whys chain) — that is how you decide what to check next. Keep the label wherever the conclusion depends on it. A conditional conclusion is fine when it states its assumptions, how sensitive the decision is to them, and the check that would settle them. An unverified decisive premise never supports an unconditional factual conclusion.
5. **Resolve conflicts by domain — there is no automatic winner.**
   - _Code, actual behaviour:_ match build, configuration, inputs and execution path. A relevant execution observation outweighs conflicting prose **for the observed case**; docs or comments that disagree with running code are flagged as stale for that case.
   - _Code, intended behaviour:_ a specification or contract is independent normative evidence. Code that disagrees with it may be the defect — implementation does not redefine the promise.
   - _Product / market:_ match entity, plan, region, billing basis, effective period and population. Report conflicting sources with their dates; a newer date or a first-party source does not win by itself.
6. **Freshness is separate from provenance.** Record the page's own date and the access date for every external fact. For prices, plans and limits, a page date older than 12 months, or none, triggers a currency check. "The page shows X now" and "X applies to this user now" are different claims; while current applicability is unresolved, confidence in it is at most Medium. A second source helps only if it closes that gap — a copy of the same stale number does not.
7. **Rate two confidences, one reason each:** _observation_ confidence (directness, scope match, freshness, unresolved conflicts) and _conclusion_ confidence (premises plus the validity of the inference, alternatives considered, sensitivity). High conclusion confidence never follows from provenance or source count alone.
8. **Promote or label.** For every load-bearing claim resting on Secondary or Inferred, try to promote it (run the read-only check, read the file, open the owner's page, read the user's data). If it cannot be promoted, keep it labelled as unverified — never restate it as fact.

**Output:** A claim-to-evidence map with observation and conclusion confidence kept apart, unresolved conflicts shown with their dates, and honest status for every external step (`[performed]` / `[planned]` / `[blocked]`).

**Used as:** the **Evidence gate** in `SKILL.md` Step 2 and Research mode R4 — applied at the door to code and product/market claims, and again to new load-bearing claims a method introduces. A forced method (`/methodology-toolkit:method <name>`) never bypasses it. The gate validates inputs; the conclusion is still produced by the methods downstream (5 Whys, ACH, First Principles). Delete the other methods and this card alone tells you a fact is trustworthy, not what it means.
