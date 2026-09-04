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

## Three questions for a reliable result

1. **Can it succeed once?** Try a few representative cases and check the final outcome, not only the displayed response.
2. **Does it succeed consistently?** Run the same cases several times. Record successes, failures and retries, even when the final attempt succeeds.
3. **Does it remain good after a change?** Rerun your reference cases after changing a model, instruction, tool or data source. Compare before and after, then monitor a sample of authorized real cases.

For example, one successful attempt out of five shows that the system can solve that case. It does not show that it solves it reliably. Set the number of attempts and maximum budget before testing. Count human review time and every attempt, not just the best result.

You can start with demonstration cases reviewed by a domain practitioner. Label them synthetic. Adapt their diversity and the number of attempts to the consequences of an error. No universal test count guarantees reliability.

### Details to retain in the dossier

- Distinct case count, attempts per case, successes per attempt and cases successful on every attempt.
- Total budget, retries, elapsed time and human time, including failures.
- Exact model, instruction, tool and test-set versions.
- A sample scored separately by a person and the automated evaluator, with their disagreements resolved.
- Monitoring owner, frequency, alert threshold and fallback. An alert must lead to an action.

Validation continues after launch: add incidents and difficult cases to the test set without exposing sensitive data.

Practical references : [Anthropic](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents), [LangChain](https://www.langchain.com/blog/agent-evaluation-readiness-checklist), [OpenAI](https://developers.openai.com/api/docs/guides/evaluation-best-practices).
