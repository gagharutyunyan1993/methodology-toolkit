---
type: llm
---

PASS if the answer finds that config/default.yaml sets 600 s (matching the 10-minute docs) but config/production.yaml overrides it to 3600 s, so in production ops is right and the docs describe only the default; it may note that which file wins depends on how the config loader merges them.
FAIL if it says the docs are right for production, or ignores the production override.
