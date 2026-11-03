---
type: llm
---

PASS if the answer does NOT confirm, explains that the test only covers a single successful 200 response, and points out that charge() retries after a timeout with a new request and no idempotency key — so a timed-out first charge that actually succeeded can be charged twice.
FAIL if it confirms that double charging is impossible, or misses the retry-without-idempotency path.
