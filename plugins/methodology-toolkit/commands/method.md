---
description: Force methodology-driven analysis of a task, optionally with a specific method
argument-hint: "[method-name] <task description>"
---

The user has explicitly invoked methodology-driven reasoning via `/methodology-toolkit:method`.

User arguments: $ARGUMENTS

## How to parse the arguments

If the first token of `$ARGUMENTS` matches a method name from the methodology index (case-insensitive; treat hyphens, underscores, and spaces as equivalent) — e.g., `OODA`, `PDCA`, `cynefin`, `porter`, `5-forces`, `ADKAR`, `kotter`, `first-principles`, `5-whys`, `eisenhower`, `GTD`, `SMEAC`, `schwerpunkt`, `mental-models`, `system-1-2`, `JTBD`, `double-diamond`, `theory-of-constraints`, `ToC`, `OKR`, `minto`, `SCQA`, `BATNA`, `thomas-kilmann`, `ACH`, `red-team`, `pre-mortem`, `PMESII`, `SWOT`, `TOWS`, `SAT`, `quality-of-information-check` — then:

- Treat that token as the **forced method**.
- Treat the rest of `$ARGUMENTS` as the task description.
- Skip Cynefin classification — go straight to applying the named method.

Otherwise:

- Treat the entire `$ARGUMENTS` as the task description.
- Follow the full `methodology-driven-thinking` protocol (Cynefin classification → select 1–3 methods → apply → synthesize).

## Then

1. Read `${CLAUDE_PLUGIN_ROOT}/skills/methodology-driven-thinking/methodology.md` to get the canonical definitions, steps, and use/avoid criteria for the chosen method(s).
2. Apply the protocol from the `methodology-driven-thinking` skill (`${CLAUDE_PLUGIN_ROOT}/skills/methodology-driven-thinking/SKILL.md`).
3. Force methodological discipline even on borderline tasks — the user explicitly asked for it. Do not bail to "this is too simple" unless the task is truly trivial; in that case, say so and ask whether they still want the analysis.
4. **Anti-pattern guard:** walk through the steps of _every_ method you invoke, not just the first one. Opus 4.8 reads instructions literally and will not generalize "walk through the steps" across multiple methods unless you say so explicitly. Naming a method without applying its steps is the failure mode.

## Edge cases

- If `$ARGUMENTS` is empty, ask the user what task to analyze and whether they want a specific method or `auto`.
- If multiple methods are listed (e.g., `/methodology-toolkit:method ACH+red-team <task>`), apply up to 3.
- If the user names a method that doesn't exist in the index, list the available methods and ask them to pick.
- If the synthesis lands on a recommendation to take a hard-to-reverse action (touches money/auth/data integrity, a destructive or externally-visible operation, or a plan committed without reading the relevant code), **offer** a `red-team-critic` pass at the end rather than running it silently — e.g. "This is hard to reverse; want an independent red-team pass before committing?". Let the user decide; don't spawn the subagent automatically.
