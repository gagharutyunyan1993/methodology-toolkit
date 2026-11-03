---
type: llm
---

PASS if the answer concludes the effective production timeout is 5000 ms, explaining the precedence with evidence: default.yaml sets 30000, production.yaml does not override it, and src/config.js lets the HTTP_TIMEOUT_MS env var (set to 5000 in deploy/values-prod.yaml) override it last — while noting the assumption that values-prod.yaml is what is actually deployed.
FAIL if it answers 30 s, or gives 5 s without the precedence evidence.
