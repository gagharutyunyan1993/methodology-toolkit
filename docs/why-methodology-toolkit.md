# Claude Does Not Need More Prompts. It Needs Reasoning Discipline.

Large language models are good at sounding structured. That is not the same as
being structured.

Ask an AI assistant to "use first principles" and it may produce a confident
answer with the phrase "first principles" near the top. Ask it to "red-team this
plan" and it may list generic risks. Ask it to "apply OODA" and it may give you
four headings without doing the hard part: orienting against assumptions,
constraints, and evidence.

That failure mode is subtle because the answer looks responsible. It has the
right vocabulary. It has the right shape. But the method did not actually
control the analysis.

I built `methodology-toolkit` to target that gap.

The goal is not to add more clever prompts to Claude Code. The goal is to add a
small layer of discipline around non-trivial decisions: classify the problem,
choose methods that fit, apply those methods explicitly, verify load-bearing
claims, and stress-test plans before they harden into action.

Repository: <https://github.com/gagharutyunyan1993/methodology-toolkit>

## The Problem: Methodology Theater

Methodologies are useful because they constrain attention.

First Principles asks you to strip assumptions and rebuild from base facts. ACH
asks you to compare competing hypotheses by disconfirming evidence, not by
collecting confirmations for your favorite answer. OODA asks you to separate
raw observation from orientation, where bias and context do most of the work.
Pre-mortem asks you to imagine the plan has already failed so optimism does not
screen out obvious risks.

When an AI assistant merely names those methods, you get the cost without the
benefit.

The answer becomes longer, more formal, and more convincing, but not necessarily
more correct. That is worse than a short intuitive answer because the structure
creates false confidence.

`methodology-toolkit` treats that as the core anti-pattern:

> If a method is named, its steps must be walked.

Not hinted at. Not summarized. Applied.

## The Second Problem: Confident Wrongness

The other failure mode is more operational: AI agents often make load-bearing
claims from memory or partial context.

In a codebase, that can look like:

- assuming which file owns behavior without opening it;
- trusting stale docs instead of current code;
- patching the nearest visible symptom;
- treating generated types or comments as ground truth;
- deciding before running the grep, test, or build that would falsify the idea.

This is where "reasoning" by itself is not enough. A polished argument with
unverified premises is still fragile.

So the toolkit includes a dedicated Quality of Information Check. Its rule is
simple: before a conclusion depends on a fact, promote that fact to primary
evidence when possible.

Primary evidence means things like:

- code just read;
- command output;
- test results;
- git history;
- observed runtime behavior.

Docs, comments, and memory can be useful, but they are not the final authority
when the code or command output says otherwise.

## What the Plugin Actually Adds

`methodology-toolkit` bundles three pieces that share one methodology index.

The first is the `methodology-driven-thinking` skill. It can activate on
non-trivial tasks like architecture decisions, prioritization, root-cause
analysis, strategy, planning under uncertainty, or tradeoff analysis. It starts
with Cynefin as a dispatcher: clear tasks should be answered directly, while
complicated, complex, or chaotic tasks get different treatment.

The second is the `/methodology-toolkit:method` slash command. This gives you a
manual trigger when you explicitly want the full protocol, or when you want to
force a specific method:

```text
/methodology-toolkit:method how should we prioritize the Q3 backlog?
/methodology-toolkit:method ACH+pre-mortem should we migrate polling to WebSocket?
/methodology-toolkit:method red-team <the plan you just wrote>
```

The third is the `red-team-critic` subagent. It is intentionally adversarial. It
does not try to balance the positives. Its job is to find load-bearing
assumptions, failure modes, attack paths, and disconfirming evidence.

The shared index currently contains 29 methods, including Cynefin, OODA, PDCA,
First Principles, 5 Whys, Porter, ADKAR, JTBD, Theory of Constraints, OKR,
Minto, BATNA, ACH, Red Team, Pre-mortem, PMESII, SWOT/TOWS, SAT, and Quality of
Information Check.

The number is not the point. The point is that each method has explicit
`use_when`, `avoid_when`, `steps`, and expected output. The agent is instructed
to read that index instead of relying on memory.

## Design Choice 1: Classify Before Applying

The easiest way to misuse a methodology is to apply it to the wrong type of
problem.

Some problems are clear. A syntax question does not need OODA. A direct command
does not need a pre-mortem. A small deterministic fix does not need three
frameworks and a leadership memo.

Other problems are complicated: the answer is knowable through expertise and
analysis. That is where methods like First Principles, ACH, 5 Whys, Theory of
Constraints, Porter, or PMESII can help.

Some problems are complex: cause and effect are only visible in hindsight. Those
need probes, feedback loops, and iteration. OODA, PDCA, Double Diamond, and JTBD
fit better there.

Some problems are chaotic: the first job is stabilization, not analysis.

That is why the skill uses Cynefin first. It prevents the plugin from becoming a
framework machine that turns every question into a workshop.

## Design Choice 2: Apply Methods Explicitly

The toolkit has a hard rule:

> Never name a method without walking through its steps.

If the answer uses OODA, the user should see Observe, Orient, Decide, and Act.
If it uses ACH, the user should see competing hypotheses, evidence, and
disconfirming logic. If it uses Pre-mortem, the answer should imagine failure
and work backward to causes.

This is not about making the answer longer. It is about making failure visible.

When the structure is visible, the user can inspect it:

- Did the agent skip the real bottleneck?
- Did it confirm the favorite hypothesis instead of trying to disprove it?
- Did it treat a secondary source as fact?
- Did the Orient step name the actual assumptions?
- Did the pre-mortem surface concrete failure modes or generic worries?

Visible structure makes the analysis debuggable.

## Design Choice 3: Separate The Critic

Self-review is useful, but it has a weakness: the same context that produced the
first answer often rationalizes it during review.

The `red-team-critic` subagent exists to create a sharper second pass. It is
designed to critique only. It looks for what would make the plan fail, what an
opponent would exploit, which assumptions carry the most weight, and what
evidence would change the decision.

This is intentionally not run silently for every task. Independent critique has
a cost. The toolkit encourages it when decisions are hard to reverse, touch
money, auth, data integrity, security, or when the first answer was not grounded
in verified evidence.

## Example: Architecture Decision

Suppose the question is:

> Should we migrate polling to WebSocket?

A generic AI answer will often drift toward WebSocket because it sounds more
modern and more real-time. It will list familiar pros and cons: latency,
complexity, scaling, browser support, server load.

That is not useless, but it is shallow.

With the toolkit, the analysis should change shape:

- Cynefin classifies the decision as complicated or complex, not clear.
- First Principles asks what real-time property is actually required.
- ACH compares polling, SSE, and WebSocket against evidence that could
  disconfirm each option.
- Pre-mortem asks how the migration fails after launch.

That can lead to a narrower answer:

Use WebSocket if bidirectional low-latency interaction is actually required. Use
SSE if the server mostly pushes updates to the client. Keep or tune polling if
freshness requirements are loose, the operational surface must stay small, or
the current bottleneck is elsewhere.

The method does not guarantee the answer. It improves the path to the answer.

## Example: Codebase Diagnosis

Suppose a page crashes when a user has no profile.

A fast assistant might patch the component:

```ts
user?.profile?.name
```

That may be correct. It may also hide the real defect.

With the toolkit, 5 Whys is only appropriate while the causal chain stays
mechanical:

1. Why did the page crash? Rendering accessed a missing field.
2. Why was the field missing? The API returned no profile object.
3. Why did the API return no profile? The session was partially expired.
4. Why did that state reach the UI? The auth refresh path did not normalize the
   response.

At that point, the patch may belong in the auth/data layer, not the component.

The Quality of Information Check matters here. The agent should read the
component, grep the callers, inspect the API mapper, and run the relevant test
before deciding where the fix belongs.

## What This Does Not Solve

This plugin does not make AI reasoning magically correct.

It does not replace domain expertise. It does not remove the need to run tests,
inspect production telemetry, talk to users, or understand the business. It also
does not mean every answer should become a methodology exercise.

In fact, one of the rules is to exit when the problem is clear and simple.

The value is narrower and more practical: it reduces a few predictable failure
modes in AI-assisted work.

- It makes it harder to use framework names as decoration.
- It makes assumptions easier to inspect.
- It encourages primary evidence before confident claims.
- It gives high-stakes plans an adversarial second pass.
- It turns "think harder" into a repeatable protocol.

## Try It

Install from this marketplace:

```text
/plugin marketplace add gagharutyunyan1993/methodology-toolkit
/plugin install methodology-toolkit@methodology-toolkit
```

Or try it locally:

```bash
claude --plugin-dir /path/to/methodology-toolkit/plugins/methodology-toolkit
```

Then ask a non-trivial question, or invoke the method command directly:

```text
/methodology-toolkit:method should we rewrite this module or stabilize it incrementally?
/methodology-toolkit:method ACH+pre-mortem should we ship this migration this week?
```

The point is not to make Claude sound like a consultant.

The point is to make its decisions easier to inspect, challenge, and correct.
