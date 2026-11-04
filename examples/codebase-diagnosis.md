# Example: Codebase Diagnosis Without Guessing

This example shows how `methodology-toolkit` changes a bug-fix workflow. The
scenario is intentionally small: a page crashes when a user has no profile.

## User prompt

```text
The account page crashes for users without a profile. Fix it.
```

## Typical answer without the toolkit

The component is probably reading a nested property without checking for null.
Add optional chaining:

```ts
user?.profile?.name
```

This prevents the crash and keeps the UI rendering.

## Why that may be wrong

The optional chaining patch may be correct as a local hardening step, but it is
not automatically the right fix.

The crash could be a symptom of several different defects:

- the API contract permits `profile: null`, but the UI assumed otherwise;
- the API mapper failed to normalize the response;
- an auth/session edge case returned a partial user object;
- the account page fetched user data before bootstrap completed;
- test fixtures hid the missing-profile state.

If the agent patches the nearest component without checking those possibilities,
it may hide the real defect and leave other screens broken.

## Toolkit-driven answer shape

### Cynefin classification

This is **complicated**.

The cause is knowable by reading code and running targeted checks. It should not
be solved by intuition alone.

### Quality of Information Check

Before concluding, promote load-bearing claims to primary evidence.

| Claim | Starting tier | How to promote it | Status |
| --- | --- | --- | --- |
| The account page owns the crash | Inferred | Open the component and stack trace | `[performed]` — trace: `AccountPage` reads `user.profile.name`, `profile = null` |
| `profile` can be null | Inferred/secondary | Read API schema, mapper, and runtime fixture | `[planned]` |
| Optional chaining is sufficient | Inferred | Grep other profile readers and run tests | `[planned]` |
| Backend contract allows missing profile | Secondary until verified | Check OpenAPI/source handler or observed response | `[planned]` |

The fix waits until the claims it depends on are checked. Only the first row is
established in this walk-through; everything below is labelled accordingly.

### 5 Whys while the chain stays mechanical

1. **Why did the page crash?** Rendering dereferenced `profile.name` with
   `profile = null` (evidence: the stack trace, row 1 above).
2. **Why was `profile` null?** Not established. The chain stops at link 1.
   `[hypothesis]` H1: the API permits a missing profile. H2: the mapper fails to
   normalize it. H3: auth/bootstrap returns a partial object.

Whether tests cover the missing-profile state is a separate question, also
unchecked. The chain branches here, so the next step is not another invented
"why" but evidence gathering, organised by ACH.

### ACH: competing root-cause hypotheses

None of the cells below is observed yet: they are the conditions each
hypothesis predicts and the observations that would rule it out — the
checklist for the `[planned]` rows above. Once they are checked, each cell
becomes consistent (C) or inconsistent (I), and the hypothesis with the fewest
inconsistencies survives.

| Hypothesis | Would be consistent with | Would disconfirm it |
| --- | --- | --- |
| UI null-state bug | Only account page crashes; API explicitly allows `profile: null` | Other screens crash too; design requires profile before account page |
| Mapper normalization bug | Raw API has nullable profile but app model expects non-null fields | Mapper already emits a safe empty profile object |
| Auth/bootstrap race | Crash happens after refresh or first page load only | Repro happens with stable authenticated fixture |
| Test coverage gap only | Behavior is contract-valid but untested | Runtime contract says profile should always exist |

The surviving hypothesis should be selected by inconsistencies, not by whichever
file is easiest to edit.

## Better fix path

1. Reproduce or inspect the stack trace.
2. Open the account page and identify the exact access that throws.
3. Grep all profile field readers.
4. Read the API schema/handler/mapper that defines user profile shape.
5. Decide the correct contract:
   - if `profile` is optional, add a real empty-state UI and test it;
   - if `profile` should be normalized, fix the mapper and add mapper tests;
   - if partial users come from auth/bootstrap, fix the data-loading boundary.
6. Add the narrow regression test that represents the selected contract.

## Example final recommendation

If the product allows users without profiles, the correct fix is not just:

```ts
user?.profile?.name
```

The correct fix is:

- render an explicit "profile not created yet" state on the account page;
- make shared profile accessors handle the nullable contract consistently;
- add a regression test for a user with `profile: null`;
- only patch the mapper if the verified backend contract says the app should
  never see `profile: null`.

## What changed

The toolkit shifts the agent from "patch the visible crash" to "verify the
contract and fix at the right boundary."

That is the difference between a local defensive patch and a durable bug fix.
