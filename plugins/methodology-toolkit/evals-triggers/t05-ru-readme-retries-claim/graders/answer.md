---
type: llm
---

PASS if the answer says the README claim is not true: src/retry.js waits a fixed 500 ms between attempts (sleep(500) in every iteration), so there is no exponential backoff.
FAIL if it says the backoff is exponential, or stays undecided.
