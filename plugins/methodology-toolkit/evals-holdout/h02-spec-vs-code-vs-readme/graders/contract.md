---
type: llm
---

PASS if the answer treats the approved spec as the intended behaviour and reports that the code deviates from it: the discount (and the 50% cap) is computed on items + shipping instead of the items subtotal only, so shipping gets discounted whenever shipping > 0 (e.g. finalPrice(100, 20, 0.2) returns 96 while the spec gives 100); it notes that README describes the code rather than the spec, and that the passing test cannot catch this because it uses shipping = 0.
FAIL if it declares the calculation correct, treats README or the code as the source of truth over the spec, or accepts the green test as proof.
