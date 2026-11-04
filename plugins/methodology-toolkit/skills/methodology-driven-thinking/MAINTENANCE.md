# Maintenance

> Maintainer process for this skill — **not** runtime content. This file is intentionally kept out of `SKILL.md` and `references/` so it never loads into the model's context at runtime.

Every 3–4 weeks, review recent methodology-driven sessions and ask:

- **Which methods were selected repeatedly?** → Keep them first in their row of the selection map in `SKILL.md`; check the map still routes to them.
- **Which methods were never used?** → Candidates for removal, merge, or manual-only use: drop them from the selection map so only `/methodology-toolkit:method <slug>` reaches them (`scripts/validate-skill.mjs` reports how many methods the map routes).
- **Which selections felt wrong, forced, or overloaded?** → Disambiguation rules need refinement.
- **Which overlap rules failed?** → The disambiguation block needs a new entry or a sharper distinction.
- **Which missing method would have improved the result?** → Candidate for addition (verify it doesn't duplicate an existing method first).
- **Where did the agent name a method without actually applying it?** → Strengthen the Step 4 rules in `SKILL.md` and the anti-pattern guard in `commands/method.md`.
- **Which eval cases fail, or pass only without the plugin?** → Fix against `evals/` and `evals-triggers/`, then report `evals-holdout/` as is — never edit prompts or cards to pass a holdout case. Add a case for every new failure found in real sessions.
- **Which subagent reports failed the contract check?** → Read `report-checks.jsonl` in the plugin data directory (pass/fail and error kinds only); a recurring error kind means the agent's output rules need tightening, or the checker is wrong.
- **In Research mode runs, which external facts reached the report without a source or a date, or were later found wrong?** → The evidence gate or `evidence-scout`'s rules need tightening. Track whether wrong facts came from memory, from snippets that were never opened, or from self-reported vendor numbers.

Output of each review: concrete edits to a card in `references/`, to `references/methods.json`, to `SKILL.md`, to an agent, or a new eval case. If a review produces no edits, that's also a valid result — note it and re-check next cycle.

The eval suites catch regressions on known cases; this review is what finds the new ones. Skipping it means the library reflects taste rather than reality.
