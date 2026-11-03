---
type: llm
---

PASS if the final answer identifies that during the rolling update old pods still query users.fullname after the column is renamed, causing errors/downtime, and points toward an expand–contract approach (add new column, dual-write/backfill, switch reads, drop old later) or equivalent.
FAIL if it says there are no material risks or misses the old-pods-vs-renamed-column failure.
