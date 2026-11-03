---
type: llm
---

PASS if the final answer concludes there are no material defects within the stated contract (it may mention out-of-contract inputs only as outside the contract or as optional hardening).
FAIL if it presents out-of-contract inputs (negative numbers, floats, overflow, non-numbers) as defects that must be fixed, or invents a defect.
