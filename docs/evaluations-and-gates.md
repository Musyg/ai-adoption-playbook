# Evaluations and gates

A useful evaluation connects measurable behavior to a decision. An isolated average score is not enough.

## 1. Define the unit of success

Choose the unit that actually matters: a case handled correctly, an accepted response, a valid action, an escalated decision, or a business outcome. Measure subcomponents separately when their failure calls for different corrective actions.

## 2. Build the test set

Include common cases, difficult cases, edge cases, missing information, ambiguities, exceptions, language variations, sensitive segments, adversarial inputs, and abstention cases.

Each case contains:

- a stable identifier;
- provenance and authorization;
- a minimized input;
- the expected result or judging rubric;
- the segment;
- the severity of an error;
- the authorized evaluator or evaluators.

Keep the development set separate from the decision set. Do not optimize on the same cases used to authorize production.

## 3. Combine evaluation methods

- **Deterministic tests**: schemas, permissions, parameters, citations, formats, destinations, and invariants.
- **Human evaluation**: domain accuracy, usefulness, tone, exceptions, and impact.
- **Model-based evaluation**: volume and consistency, after calibration against human judgments.
- **In-situ outcomes**: time, quality, cost, rework, satisfaction, and incidents.

A model evaluator is not a source of truth. Measure its disagreements, positional biases, and sensitivity to wording.

## 4. Evaluate agents step by step

For a system that uses tools, separate understanding, planning, tool choice, parameters, authorization, effect, result read-back, and stopping. A tool call proves neither the external effect nor its persistence.

Test attacks that cross trust boundaries: web content, email, retrieved documents, memory, tool results, and rendered output.

## 5. Preregister decisions

Before the pilot, the [evaluation plan](../templates/evaluation-plan.md) records:

- the primary metric and critical segments;
- the acceptance threshold;
- the stop threshold;
- the minimum sample size;
- tolerance for severe errors;
- treatment of technical incidents;
- the person authorized to conclude.

## Recommended gates

| Gate | Authorizes | Requires |
|---|---|---|
| G1 — Discovery | Prototype | Mandate, owner, baseline, scope |
| G2 — Pilot | Shadow mode | Tests, thresholds, security, authorized data |
| G3 — Copilot | Bounded human use | G2 results, training, supervision, fallback |
| G4 — Automation | Bounded actions | Reliability by segment, reversibility, observability |
| G5 — Extension | New users or powers | Reassessment, operational capacity, risk acceptance |

A satisfactory average does not offset failure on a critical segment or an error of unacceptable severity.
