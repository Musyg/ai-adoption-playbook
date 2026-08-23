# Risk × autonomy classification

This matrix supports internal triage. It does not replace legal analysis, security analysis, or an impact assessment.

## Axis 1 — Use-case impact

| Level | Description | Indicative examples |
|---|---|---|
| R0 | Internal, public, easily verifiable, with no consequence for a person | Summarizing a public text, ideation |
| R1 | Work assistance with validation and recoverable errors | Drafting, document research, internal classification |
| R2 | Personal data, external communication, or modification of a system | Customer reply, CRM update, operational recommendation |
| R3 | Rights, health, employment, credit, benefits, surveillance, public authority, or critical infrastructure | Eligibility, diagnosis, allocation, enforcement, regulated decision |

A use case moves to the higher level as soon as one higher-level characteristic is present. Frequency and scale can also raise the level.

The interactive triage applies this rule mechanically: low-impact A0 information
or advice is R0; the same low-impact work with A1 or greater assistance is R1;
material impact, personal or sensitive data, or direct external interaction is
at least R2; high impact or an automated decision about a person is R3.

## Axis 2 — Technical autonomy

| Level | Capability |
|---|---|
| A0 | Information or advice only |
| A1 | Search, extraction, classification, or draft |
| A2 | Action only after explicit, informed human approval |
| A3 | Autonomous actions bounded by permissions, budget, duration, and destinations |
| A4 | Broad, multi-system, or self-extending autonomy — disabled by default |

## Minimum control by combination

| Combination | Minimum control |
|---|---|
| R0–R1 / A0–A1 | Owner, data rules, domain tests, change log |
| R1–R2 / A2 | Qualified approval, output validation, complete log, tested return |
| R2 / A3 | Threat model, least privilege, limits, monitoring, adversarial tests |
| R3 / any level | Legal qualification, impact assessment, formal governance, audit, and human recourse |
| Any risk / A4 | Documented executive exception, evidence that A3 is insufficient, stronger containment, and independent audit |

The table lists minimum anchors, not every possible pair. For a combination
that is not written verbatim, apply every row that matches either axis and keep
the stricter control. For example, R2/A1 still requires the R2 protections;
R1/A3 still requires the A3 threat model, least privilege, monitoring, and
adversarial testing.

## Triage questions

- Could an error affect a right, benefit, job, health, or safety?
- Does the system process personal, sensitive, confidential, or privileged data?
- Does a person know they are interacting with an AI system when required?
- Can the system write, send, purchase, publish, delete, or modify?
- Is the action reversible? Within what time?
- Is human approval real, informed, and feasible within the available time?
- Can the system read untrusted content and then call tools?
- Could errors multiply at scale before detection?

Document the answer and evidence in the [risk-assessment template](../templates/risk-assessment.md).
