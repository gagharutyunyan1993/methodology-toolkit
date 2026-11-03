# Maintenance

> Maintainer process for this skill — **not** runtime content. This file is intentionally kept out of `SKILL.md` and `references/` so it never loads into the model's context at runtime.

Every 3–4 weeks, review recent methodology-driven sessions and ask:

- **Which methods were selected repeatedly?** → Candidates for `core` tier.
- **Which methods were never used?** → Candidates for removal, merge, or `manual-only` (accessible only via `/methodology-toolkit:method`).
- **Which selections felt wrong, forced, or overloaded?** → Disambiguation rules need refinement.
- **Which overlap rules failed?** → The disambiguation block needs a new entry or a sharper distinction.
- **Which missing method would have improved the result?** → Candidate for addition (verify it doesn't duplicate an existing method first).
- **Where did the agent name a method without actually applying it?** → `SKILL.md` anti-pattern guard needs strengthening.
- **In Research mode runs, which external facts reached the report without a source or a date, or were later found wrong?** → The evidence gate or `evidence-scout`'s rules need tightening. Track whether wrong facts came from memory, from snippets that were never opened, or from self-reported vendor numbers.

Output of each review: concrete edits to a card in `references/`, to `references/methods.json`, or to `SKILL.md`. If a review produces no edits, that's also a valid result — note it and re-check next cycle.

The review is the only feedback loop this library has. Skipping it means the library reflects taste rather than reality.
