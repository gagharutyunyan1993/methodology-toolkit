# 5 Whys

**Origin:** Toyota Production System
**Category:** Root cause analysis
**Cynefin fit:** Complicated

**Use when:** Operational incidents, manufacturing defects, simple causal chains where the chain is mechanical.

**Avoid when:** Human/political/systemic problems — past 2–3 "whys" the method drifts into pop-psychology. Switch to ACH or Cynefin.

**Steps:**

1. State the problem concretely. This is the question the chain must answer — do not swap it for an easier one halfway down.
2. Ask "why did this happen?" — answer with a concrete cause and the evidence that shows it (file:line, log line, command output, document). A cause with no evidence is a `[hypothesis]`, not a link.
3. Take that cause as the new problem. Ask why again.
4. Repeat (up to ~5) while each link is supported. **Stop the established chain at the last supported link (N).** Below N, list the competing hypotheses and the check that would tell them apart — do not keep descending on guesses.
5. Validate: if you fixed the cause at N, would the symptom go away? If N is not deep enough to act on, say the root cause is undetermined and name the evidence that would determine it.

**Output:** A causal chain established to link N with its evidence, plus labelled hypotheses below N and the discriminating check. "Root cause undetermined from the available data" is a valid output; a different problem's root cause presented as this one's is not.
