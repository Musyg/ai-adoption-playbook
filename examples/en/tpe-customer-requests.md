# Synthetic micro-business case — From shared inbox to validated copilot

> **Fictional example.** The company, people, volumes, and results are entirely
> synthetic. They illustrate the method; they are not market research,
> performance evidence, or legal advice.

## 1. Starting point

**Atelier Horizon** is a fictional eight-person business that installs and
maintains equipment for professional customers. A shared inbox receives about
360 requests each month: quotes, appointments, breakdowns, billing questions,
and complaints.

Two people read the messages, search internal documents, select the right owner,
and draft a reply. Ambiguous or incomplete requests sometimes move between
several team members.

### Four-week baseline

| Measure | Starting value | Source |
|---|---:|---|
| Requests received | 360 per month | Shared inbox |
| Median active handling time | 11 min per request | Timed sample |
| First reply on the same day | 68% | Email timestamps |
| Rework after an incomplete reply | 18% | Review of 80 cases |
| Incorrect initial routing | 9% | Transfer history |

The selected problem is not “automate customer service.” It is narrower:
**prepare a useful routing suggestion and draft without sending or changing any
system before human approval**.

## 2. Mandate and boundaries

| Item | Pilot decision |
|---|---|
| Process owner | Customer service lead |
| Final decision owner | Company director |
| Duration | 30 days |
| Maximum budget | CHF 7,500 including configuration, support, and internal time |
| Population | One inbox and three trained users |
| Autonomy | A1 — research and drafting only |
| Potential impact | R2 — customer data and future external communication |

### Prohibitions written before selecting the tool

- no automatic sending;
- no promise about price, deadline, warranty, or compensation;
- no change to the CRM or schedule;
- no use of banking, health, or unrelated data;
- no reply when identity, destination, or intent remains ambiguous;
- no provider training on company data without a verified agreement.

The manual procedure remains available throughout the pilot. A user can remove
the copilot from the flow without interrupting the inbox.

## 3. Simplest sufficient architecture

The team compares three options:

1. add email rules and response templates;
2. combine deterministic routing with a model that extracts information and
   drafts from approved content;
3. use an agent connected to email, the CRM, and the schedule.

Option 2 is selected. Conventional rules handle known senders, contract numbers,
and stable categories. The model receives a minimized message, suggests a
category, lists missing information, and prepares a draft. The reviewer sees the
original message, approved sources, and proposal in the same screen.

The agentic option is rejected because it adds permissions and effects that are
not required for the intended result.

## 4. Pre-registered evaluation

The team assembles 80 authorized and minimized historical requests. Forty tune
the system; forty are frozen for the decision. The decision set covers routine
requests, missing information, complaints, protected data, a wrong recipient,
and malicious instructions embedded in message content.

| Metric | Acceptance threshold | Stop threshold |
|---|---:|---:|
| Correct routing | ≥ 95% | < 90% |
| Correct extraction of required fields | ≥ 95% | < 90% |
| Escalation of sensitive or ambiguous cases | 100% | < 100% |
| Critical unsupported claim | 0 | ≥ 1 |
| Drafts needing major correction | ≤ 35% | > 50% |
| Median handling time | ≤ 9 min | ≥ 10 min |

### Frozen-set results

| Measure | Result | Decision |
|---|---:|---|
| Correct routing | 39/40 — 97.5% | Accepted |
| Complete extraction | 38/40 — 95% | Accepted at threshold |
| Escalation of eight critical cases | 8/8 — 100% | Accepted |
| Critical unsupported claim | 0 | Accepted |
| Major correction | 14/40 — 35% | Accepted at threshold |
| Simulated median time | 8 min 25 sec | Accepted |

Two drafts use wording that is too assertive, but neither promises a price,
deadline, or warranty. They remain in the error register and are added to the
regression tests.

## 5. Two-stage pilot

### Days 15–21 — Shadow mode

The copilot processes new messages without showing its proposals to the people
who reply. An evaluator later compares the category, extracted information, and
draft with the real treatment. Configuration may change during this phase, and
every version is recorded.

### Days 22–30 — Copilot

Three trained users see the proposal. They must accept, correct, or reject both
the routing and the draft. Sending remains an explicit action in the email tool.
Complaints, financial requests, and ambiguous messages are always escalated.

## 6. Observed results

The copilot stage covers 90 consecutive requests. Results are compared with the
baseline without annual extrapolation.

| Measure | Baseline | Pilot | Observed difference |
|---|---:|---:|---:|
| Median active handling time | 11 min | 8 min 35 sec | −22% |
| First reply on the same day | 68% | 80% | +12 points |
| Rework after incomplete reply | 18% | 15% | −3 points |
| Incorrect initial routing | 9% | 5% | −4 points |
| Major draft correction | not measured | 31% | new measure |
| Serious incident | 0 observed | 0 observed | no rarity claim |

Incomplete requests and unusual product references account for most corrections.
The observed gain remains within the broad range of available field evidence
without being presented as a replication. The absence of a serious incident
across 90 requests demonstrates neither zero risk nor a low incident rate.

## 7. Gate decision

**Decision: continue conditionally at copilot level.**

Business value and reliability thresholds are met within the observed scope.
The team does not authorize automatic sending, CRM writes, or schedule changes.

Conditions for the next 60 days:

1. add 20 cases covering unusual references and missing information;
2. retain a weekly error and near-miss review;
3. repeat the frozen set after every model or instruction change;
4. monitor time, quality, corrections, and escalations separately;
5. review the provider, costs, and exit path after 60 days.

Bounded automation will be considered only if a stable, reversible, and
verifiable subset exceeds the thresholds over a longer period.

## 8. Published-case anchors

The scenario uses mechanisms observed in practice, but no external organization’s
number is reused as a result of the fictional pilot:

- the Croatian SME RIS case describes email classification, retrieval from an
  internal knowledge base, and agent-reviewed drafts; its reported gains are
  success-story estimates rather than an independent benchmark;
- a *Quarterly Journal of Economics* field study of 5,172 support agents reports
  an average 15% productivity gain, with substantial variation by experience and
  problem type;
- a maritime industrial case finds that drafts may streamline work while still
  requiring substantial modification, leaving final decisions with experts;
- an experiment across 66 organizations finds less email time among active users
  but no detected change in the overall composition of work;
- OECD and Microsoft cases illustrate the relevance of email, response speed,
  and language quality but cannot predict performance for a Swiss micro-business.

Links, reported figures, and transfer limits are recorded in the
[case-evidence note](../../references/tpe-customer-support-cases.md).

## 9. Evidence file

The pilot retains the mandate and baseline, use-case card, provider assessment,
evaluation plan and frozen set, configuration versions, error register, pilot
decision, incident runbook, and tested manual procedure.

The French operational templates are available in the repository’s
[`templates`](../../templates/) directory. This file lets another person
understand why the pilot was authorized, what was actually observed, and which
actions remain prohibited.
