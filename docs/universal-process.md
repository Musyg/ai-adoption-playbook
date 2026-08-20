# Universal AI adoption process

This process is designed to remain recognizable from an independent professional to a public service. What changes is the level of evidence, the number of accountable roles, the degree of formalization, and the autonomy allowed.

## Overview

| Phase | Decisive question | Exit evidence |
|---|---|---|
| 0. Mandate | Why act? | Signed mandate and named owner |
| 1. Baseline | What actually happens today? | Initial measurements and case sample |
| 2. Mapping | Where are the work, data, and decisions? | Process map and system register |
| 3. Use case | What exact problem are we solving? | Comparable, prioritized cards |
| 4. Risk and law | What could affect people or the organization? | Classification and applicable requirements |
| 5. Architecture | What is the simplest sufficient solution? | Architecture decision and supplier file |
| 6. Evaluations | How will we know whether the system works? | Test set and preregistered thresholds |
| 7. Security | How could it be deceived or exceed its mandate? | Threat model and tests |
| 8. Pilot | Does it create value under bounded conditions? | Report compared with the baseline |
| 9. Production | Can we operate it, stop it, and roll it back? | Production decision and runbooks |
| 10. Monitoring | Does it remain useful and controlled? | Dashboard, reviews, and incidents |
| 11. Retirement | How do we stop it cleanly? | Export, deletion, revocation, and continuity |

## Phase 0 — Mandate

### Objective

Define the problem and the project’s authority before choosing a tool.

### Actions

- name the process owner and the person accountable for the final decision;
- describe the observable problem, the people concerned, and the expected value;
- set budget, deadline, scope, and exclusions;
- state which actions the AI must never perform;
- identify decisions that require a specialist or competent authority.

### Gate 1

The project starts only if the [mandate](../templates/mandate.md) names an owner, defines a measurable outcome, identifies a baseline to establish, and sets explicit limits.

## Phase 1 — Baseline

### Objective

Avoid comparing the future system with an impression or an idealized scenario.

### Possible measures

- minutes and cost per case;
- time to first response and total cycle time;
- error, rework, or abandonment rate;
- variation among operators;
- volume and seasonality;
- revenue, savings, or public-service value;
- satisfaction of users and affected people.

Retain a representative, properly authorized, minimized sample of real cases. It will become the basis for evaluations.

## Phase 2 — Map the real process

Observe work in practice, not only the theoretical process:

- steps, decisions, queues, and exceptions;
- website, messaging, CRM, ERP, documents, APIs, and automation;
- personal, sensitive, confidential, or privileged data;
- AI tools already in use, including informal use;
- suppliers, subprocessors, processing regions, and dependencies;
- corrections, workarounds, and invisible tasks.

Minimum deliverables: a current-process map, [AI system register](../templates/ai-system-register.csv), data inventory, and list of problems with volumes.

## Phase 3 — Use cases and prioritization

Turn each problem into a [use-case card](../templates/use-case-card.md). Do not combine different decisions, users, or risk levels in one card. Classify the AI task, interaction, knowledge, deployment, and effect using the [AI use-pattern guide](ai-use-patterns.md). These dimensions do not replace risk or autonomy.

Keep two scores separate:

- **value**: frequency, impact, time, quality, revenue, savings, or public value;
- **difficulty/risk**: data, rights, security, integrations, autonomy, irreversibility, and supplier dependency.

The first pilot is generally frequent, measurable, reversible, high-value, and controllable in risk. A spectacular use case that cannot be evaluated is a poor first pilot.

## Phase 4 — Risk, autonomy, and law

Classify separately:

1. the task and interaction patterns;
2. the potential impact of the use case;
3. the technical autonomy granted;
4. the data, knowledge sources, and deployment mode;
5. the organization’s role as provider, integrator, deployer, controller, processor, or user;
6. applicable jurisdictions and sector rules, with separate Switzerland and EU conclusions.

Use the [risk × autonomy guide](risk-autonomy.md) and [Switzerland/EU legal orientation](legal-switzerland-eu.md). An internal classification never replaces legal qualification.

## Phase 5 — Simplest sufficient system

Evaluate options in this order:

1. clarify or remove the step;
2. deterministic rule;
3. conventional automation;
4. model call with structured input and output;
5. controlled extraction or classification;
6. retrieval from an authorized corpus;
7. AI workflow with tools;
8. bounded agent;
9. multi-agent system only if tests prove its usefulness.

Choose the model on real cases, not on a general leaderboard. Document latency, cost, region, retention, training on customer data, subprocessors, version changes, export, deletion, reversibility, and contractual liability in the [supplier assessment](../templates/vendor-assessment.md).

The same integration level can contain different AI patterns. A retrieval
assistant needs corpus and access-control evidence; a classifier needs per-class
error and drift evidence; a public chatbot needs disclosure and handoff; a
multimodal system needs consent and provenance. Apply every relevant profile in
the [AI use-pattern guide](ai-use-patterns.md).

## Phase 6 — Evaluations before product

Build evaluations before optimizing the system. The set includes:

- common and difficult cases;
- ambiguities and missing information;
- exceptions and cases requiring escalation;
- adversarial inputs;
- cases where abstention or refusal is correct.

Measure domain accuracy, completeness, source fidelity, permissions, tool calls, refusals, latency, cost, relevant disparities, human corrections, and the final business outcome. Add pattern-specific measures for retrieval, classification, prediction, conversation, multimodal content, and agentic action.

Preregister thresholds in the [evaluation plan](../templates/evaluation-plan.md). See [Evaluations and gates](evaluations-and-gates.md).

### Gate 2

No pilot without acceptance thresholds, stop thresholds, a comparison method, and a person accountable for the judgment.

## Phase 7 — Security and containment

Address at least direct and indirect injection, information leakage, supply chains, data or context poisoning, unvalidated outputs, excessive agency, unbounded consumption, and exfiltration through tools. Extend the threat model for retrieval access and poisoning, predictive-model evasion and drift, multimodal instructions and impersonation, software execution, persistent memory, and inter-agent cascading failures whenever those patterns are present.

Baseline controls are least privilege, read-only access by default, distinct identities, authorized destinations, secrets outside context, deterministic validation, human approval, budgets, logging, outbound-network controls, a kill switch, and a manual procedure.

See [Security](security.md).

## Phase 8 — Three-stage pilot

1. **Shadow mode**: the system produces an output without influencing the live process.
2. **Copilot**: it proposes; a qualified person accepts, corrects, or rejects.
3. **Bounded automation**: it performs only actions whose reliability and reversibility have been demonstrated.

The pilot uses a limited population, bounded data, frozen model and instruction versions, a complete log, and an immediate stop procedure.

### Gate 3

The [pilot decision](../templates/pilot-decision.md) separates three questions:

- has business value been demonstrated?
- is reliability sufficient across every critical segment?
- have the right people accepted the residual risks?

A single “no” blocks production.

## Phase 9 — Production

Version models, instructions, tools, reference data, and thresholds. Provide:

- progressive rollout and rollback;
- cost, volume, and permission limits;
- monitoring of errors, drift, and tool calls;
- a reporting channel;
- an [incident runbook](../templates/incident-runbook.md);
- continuity without AI;
- a reassessment date and owner for every control.

## Phase 10 — Monitoring and improvement

Monitor business outcomes, not only technical availability. Compare them with preregistered thresholds, critical segments, and the baseline. Trigger reassessment after:

- a change of model, supplier, prompt, or corpus;
- a new integration or permission;
- an incident or drift;
- a legal or organizational change;
- extension to a new population or purpose.

## Phase 11 — Retirement

A system must be stopped as cleanly as it was launched:

- disable access and revoke secrets;
- export what is needed for continuity;
- delete or return data according to commitments;
- retain required evidence and decisions;
- inform users and affected people when necessary;
- restore the manual process or replacement solution.

## Definition of “production-ready”

At minimum, the case file contains:

1. a mandate, baseline, and owner;
2. a data and system map;
3. a risk classification and applicable requirements;
4. an architecture decision and supplier file;
5. a reproducible evaluation suite;
6. a threat model and security tests;
7. a pilot compared with the baseline;
8. an incident runbook, rollback, and manual procedure;
9. monitoring, a review date, and a retirement plan.
