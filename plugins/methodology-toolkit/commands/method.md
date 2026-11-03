---
description: Force methodology-driven analysis of a task, optionally with a specific method
argument-hint: "[method[+method...] | research [method] | recheck] <task description>"
---

The user has explicitly invoked methodology-driven reasoning via `/methodology-toolkit:method`.

User arguments: $ARGUMENTS

## Routes

Resolve method names against the registry `${CLAUDE_PLUGIN_ROOT}/skills/methodology-driven-thinking/references/methods.json` — the single list of slugs, display names and aliases. Normalize the token first: lower-case, and treat spaces, underscores and hyphens as equivalent (`First_Principles`, `first principles`, `first-principles` are the same). A token matches a method if it equals its slug or one of its aliases.

| First token of `$ARGUMENTS`                         | Route                | What runs                                                                                                                                                                              |
| --------------------------------------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| one method, or up to three joined by `+` (`ach+red-team`) | **forced**     | Skip Cynefin and automatic selection. **The Evidence gate (skill Step 2) still runs** before the method consumes the task's claims. Open each named card and walk it (skill Step 4–5).   |
| `research`, optionally followed by one method token | **research**         | The skill's Research mode (R1–R6) end to end; a following method token is the forced method inside R5 (e.g. `research jtbd who competes with us for small teams?`).                      |
| `recheck`                                           | **recheck**          | Independent critique of a decision, plan or conclusion: brief the `red-team-critic` subagent with the target (the previous answer unless the rest of `$ARGUMENTS` names another one). Not for re-checking a single fact or a calculation — do that directly. |
| anything else                                       | **auto**             | The whole of `$ARGUMENTS` is the task: the full skill protocol (Cynefin → gate → select 1–3 → open cards → apply → synthesize).                                                         |

A forced method changes _which_ method runs, never which facts count as true. If a premise of the task turns out false, say so and apply the method to the corrected facts.

## Then

1. Apply the protocol from the `methodology-driven-thinking` skill (`${CLAUDE_PLUGIN_ROOT}/skills/methodology-driven-thinking/SKILL.md`). Open only the cards of the methods that will run (`references/<slug>.md`), never the whole library.
2. Force methodological discipline even on borderline tasks — the user explicitly asked for it. Do not bail to "this is too simple" unless the task is truly trivial; in that case, say so and ask whether they still want the analysis.
3. **Anti-pattern guard:** walk through the steps of _every_ method you invoke, not just the first one — the rule applies to each method separately. Naming a method without applying its steps is the failure mode; so is filling a step with invented content to complete the method's shape (see the skill's Step 4 rules: evidence on every link, `[planned]` for unexecuted steps, answer the question asked).

## Edge cases

- `$ARGUMENTS` empty → ask what task to analyze and whether they want a specific method or `auto`.
- More than three methods joined by `+` → say only three run, name the three you keep, and ask whether that choice is right before applying.
- A token that looks like a method name (it contains `+`, or it is the only word before an obvious task) but matches nothing in the registry → do not guess: list the closest slugs from `methods.json` and ask which one was meant. A first word that is plainly part of the task ("why does…", "should we…") is the **auto** route, not an unknown method.
- A token that matches more than one method → list the matches and ask.
- If the synthesis lands on a recommendation to take a hard-to-reverse action (touches money/auth/data integrity, a destructive or externally-visible operation, or a plan committed without reading the relevant code), **offer** a `red-team-critic` pass at the end rather than running it silently — e.g. "This is hard to reverse; want an independent red-team pass before committing?". Let the user decide; don't spawn the subagent automatically.
