# Security for AI and agentic systems

The model is only one component. The security boundary includes data, retrieval, memory, tools, identities, the interface, logs, and operators.

## Priority threats

- direct or indirect prompt injection;
- disclosure of sensitive information;
- poisoning of data, context, memory, or tools;
- a compromised component or model in the supply chain;
- unsafe output handling;
- excessive agency or permissions;
- weak indexes, embeddings, and access controls;
- misinformation or misleading citations;
- unbounded consumption;
- exfiltration or destruction through tool calls.

## Threat additions by use pattern

| Pattern | Add to the threat model |
|---|---|
| Retrieval | corpus poisoning, stale or forged sources, cross-user and cross-tenant access, malicious retrieved instructions |
| Classification / prediction | evasion, data and label poisoning, model extraction, threshold manipulation, drift and feedback loops |
| Conversation | impersonation, multi-turn manipulation, memory retention, unsafe advice, failed human handoff |
| Multimodal | hidden image or audio instructions, deepfake and voice misuse, metadata stripping, malicious documents |
| Code and agentic action | goal hijack, tool misuse, identity abuse, unexpected code execution, poisoned memory, insecure inter-agent messages, cascading failures |

RAG, a system prompt, or fine-tuning does not eliminate injection risk.

## Minimum control architecture

1. **Identity** — separate service account, strong authentication, and per-user attribution.
2. **Least privilege** — read-only by default, temporary permissions, and explicitly authorized resources.
3. **Trust boundaries** — treat retrieved content and tool results as untrusted data.
4. **Validation** — schemas and deterministic rules before any action.
5. **Approval** — explicit human confirmation for sensitive or irreversible actions.
6. **Containment** — sandboxing, network restrictions, and authorized destinations and file types.
7. **Limits** — budget, steps, volume, frequency, duration, and cost.
8. **Secrets** — never in prompts or memory; short-lived and rotatable.
9. **Observability** — input, version, decision, tool, parameters, result, and actor, with data minimization.
10. **Stop** — tested kill switch, access revocation, rollback, and manual procedure.

## Tests before a pilot

- malicious instructions in every external source;
- permission bypass and identity confusion;
- unauthorized destinations, extensions, and parameters;
- leakage through links, rendering, citations, or metadata;
- repetition, loops, cost explosion, and quota exhaustion;
- data or tools changed between validation and action;
- partial failure, empty response, timeout, and inconsistent state;
- attempts to disable logs, controls, or approvals.

Map relevant scenarios to [OWASP GenAI](../references/sources.md#security), the OWASP Top 10 for Agentic Applications when tools or agents are present, NIST adversarial-ML guidance for predictive systems, and [MITRE ATLAS](../references/sources.md#security). Retain the evidence and limits of the tests.

## Incident

The [runbook](../templates/incident-runbook.md) must support containment, evidence preservation, notification of the right owners, access revocation, return to the safe process, and a decision on reassessment or retirement.
