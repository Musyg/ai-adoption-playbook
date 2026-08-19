# SME / PME track — 90 days

## Target

An organization with several departments, business systems, suppliers, and levels of accountability.

## Intended outcome

A prioritized portfolio, a shared foundation, and a first governed pilot — not a collection of isolated tools.

The synthetic [A2 business agent for B2B quotes](../../examples/en/sme-b2b-quote-business-agent.md) applies this track to an industrial SME: low, central, and high ranges; a global denominator; total cost; a frozen test set; a live pilot; and an explicit decision not to confuse A2 with A3.

## Days 1–30 — Govern and discover

### Lightweight governance

- executive sponsor;
- AI portfolio owner;
- business, IT/security, data, and data-protection owners;
- legal, HR, procurement, or compliance roles as cases require;
- monthly gate with written decisions.

### Work

- inventory official use and shadow AI;
- establish data classification and usage rules;
- map high-volume processes;
- build baselines and a use-case portfolio;
- immediately filter high-impact cases;
- define a target architecture and common supplier criteria.

## Days 31–60 — Build the evidence

- select one to three pilots that differ mechanically;
- assign an owner and budget to each;
- create test sets, critical segments, and thresholds;
- conduct legal, data-protection, and threat analyses;
- establish identities, secrets, logs, limits, and environments;
- run shadow mode and adversarial tests.

Avoid a general platform before common needs are proven. Share only what materially reduces risk or cost.

## Days 61–90 — Pilot and industrialize

- launch bounded copilots for cases that passed G2;
- measure business outcomes, human corrections, and incidents;
- test rollback and continuity;
- decide separately on value, reliability, and risk;
- version models, instructions, tools, corpora, and evaluations;
- establish supplier reviews and a reassessment calendar.

## Portfolio architecture

| Layer | Shared capability |
|---|---|
| Identity | SSO, roles, service accounts, revocation |
| Data | classification, provenance, minimization, retention |
| Models | authorized catalog, versions, cost, regions |
| Tools | gateways, allowlists, validation |
| Evaluations | versioned sets, thresholds, reports by segment |
| Operations | logs, alerts, incidents, rollback, retirement |

## Leadership indicators

- realized value versus announced value;
- share of systems recorded in the register;
- share of cases with a baseline and evaluations;
- severe errors and time to detection;
- supplier dependency and concentration;
- human-correction and workaround rates;
- total cost per useful outcome.
