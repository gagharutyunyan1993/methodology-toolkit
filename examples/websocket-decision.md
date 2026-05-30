# Example: Polling vs SSE vs WebSocket

This example shows the kind of difference `methodology-toolkit` is designed to
create. The scenario is intentionally common: a team wants to replace polling
with WebSocket because the current UI feels stale.

## User prompt

```text
Should we migrate our dashboard updates from polling to WebSocket?
```

## Typical answer without the toolkit

WebSocket is a good option if you need real-time updates. It provides lower
latency than polling and can reduce unnecessary requests. The tradeoffs are
more operational complexity, connection management, scaling concerns, and
fallback behavior.

Recommendation: migrate to WebSocket if the dashboard needs live updates.
Otherwise, consider increasing the polling interval or using long polling.

## Toolkit-driven answer shape

The exact output depends on the codebase and product context, but the important
difference is the structure of the reasoning.

### Cynefin classification

This is **complicated/complex**, not clear.

There is no universally correct transport. The right answer depends on product
freshness requirements, server push directionality, infrastructure constraints,
client behavior, and operational cost.

### First Principles

1. **Problem:** dashboard data feels stale.
2. **Base facts to verify:**
   - Required freshness: seconds, sub-second, or "eventually updated"?
   - Directionality: server-to-client only, or bidirectional interaction?
   - User count and concurrency profile.
   - Current polling interval, request cost, cache behavior, and backend load.
   - Failure behavior: what happens when a client disconnects or sleeps?
3. **Verified implication:** "real-time" is not a transport requirement. It is
   a product requirement that must be translated into latency, directionality,
   durability, and operational constraints.
4. **Rebuild from base facts:** choose the smallest transport that satisfies the
   actual product requirement.

### ACH: competing hypotheses

| Hypothesis | Supporting evidence | Disconfirming evidence to seek |
| --- | --- | --- |
| Keep/tune polling | Current system is simple; freshness may only need 15-30s; CDN/cache may absorb cost | Users need updates within 1-2s; polling load is already a measured bottleneck |
| Move to SSE | Updates are server-to-client; lower operational complexity than WebSocket | Client must send frequent interactive messages; infra/proxy stack handles SSE poorly |
| Move to WebSocket | Bidirectional low-latency interaction is required; many small updates | Updates are one-way; connection fanout and reconnect logic create more risk than value |

The winning option is the one with the fewest serious inconsistencies after
checking evidence, not the one that sounds most modern.

### Pre-mortem

Imagine the migration shipped and failed.

- The team moved to WebSocket, but the product only needed one-way updates.
  Operational complexity increased without user-visible value.
- Connection reconnect behavior broke on mobile sleep/wake and corporate
  proxies.
- Backend fanout became the real bottleneck, so the transport change did not
  fix freshness.
- The team migrated before measuring current polling cost, so it optimized the
  wrong constraint.
- Rollback was hard because the UI became tightly coupled to socket events.

### Better recommendation

Do not start with "WebSocket vs polling." Start with the freshness contract.

Use **tuned polling** when updates can be stale by tens of seconds and the
current system is not a measured bottleneck.

Use **SSE** when updates are mostly server-to-client and the product needs
fresher data without bidirectional socket semantics.

Use **WebSocket** when the feature genuinely requires bidirectional,
low-latency interaction and the team is ready to own reconnects, fanout,
backpressure, auth refresh, and observability.

Before committing, verify:

- current polling interval and request cost;
- required freshness per dashboard widget;
- one-way vs bidirectional communication;
- proxy/load balancer support;
- reconnect and auth refresh behavior;
- rollback path.

## What changed

The toolkit does not force a more complex answer. It forces a better decision
surface:

- the transport is selected from product requirements, not trend pressure;
- disconfirming evidence is named before the recommendation hardens;
- operational failure modes are surfaced before migration work starts;
- "real-time" is decomposed into measurable constraints.
