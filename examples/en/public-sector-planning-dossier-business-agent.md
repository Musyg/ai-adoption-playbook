# Synthetic public-sector case — A2 agent for planning dossiers

> **Fictional authority.** The City of Mont-Rive, its territory, mandate,
> volumes, costs, and results are synthetic. The case illustrates a decision
> method; it does not prove the performance of any real tool, supplier, or
> public service.

> **Measured level: administrative A2 business agent.** The system prepares the
> completeness review of a planning-permission dossier and, after approval,
> records and routes authorized effects. It does not declare a case complete,
> recommend approval or refusal, interpret law, or sign a public decision.

## 1. Mandate and starting point

The City of Mont-Rive is a fictional Swiss municipality with 62,000 residents.
Its 17-person planning service receives about 1,080 applications per year in
French and German. The public counter, post, and telephone assistance remain
available alongside the portal.

A baseline across 386 applications measures a median **145 minutes of active
human work** for a standard case ultimately accepted at administrative review:
check authority and signature, inventory documents, extract parcel and project
facts, consult published rules, apply the checklist, prepare a document request,
record the case, and assign the qualified officer.

The pilot problem is deliberately narrower than the permission decision:

**carry an administratively standard dossier to a qualified officer, with every
fact and rule tied to its source, without delegating power over the project or
people's rights to the agent.**

## 2. Scope and authority

| Element | Decision |
|---|---|
| Administrative authority | Head of the planning service |
| Operating owner | Administrative validation lead |
| Approvers | Six named, qualified officers |
| Independent guardian | Internal audit, with legal and data-protection teams |
| Duration | 90 days: framing, frozen set, shadow mode, and live A2 |
| Baseline | 386 authorized historical applications |
| Pre-live evaluation | 90 frozen, representative, contradictory cases |
| Observed population | 270 consecutive applications; 166 enter the workflow |
| Autonomy | A2 — no message or write without explicit approval |
| Impact | Public R3 — administrative procedure, personal data, and public effect |
| Continuity | Portal, counter, post, telephone, and manual process retained |

“Enters the workflow” only means that the case matches the tested standard
administrative path. It does not mean legally complete, compliant, or likely to
receive permission.

The agent stops for paper or assisted applications, ambiguous signature or
identity, a new project class, conflicting rules, derogation, third-party
objection, unexpected sensitive data, unreadable plan, required site visit,
equal-treatment concern, or any situation requiring legal or planning judgment.

## 3. Boundary between transport and public power

| The A2 agent carries | People and the authority retain |
|---|---|
| Versioned state and workflow-entry rules | Assistance and offline channels |
| Document inventory and source-cited extraction | Legal qualification and authority competence |
| Published administrative checklist | Decision that a dossier is formally complete |
| Draft request for missing material | Site visit, dialogue, and objection review |
| Surfaced rules and constraints with source links | Interpretation, balancing, and equal treatment |
| Register write and routing after approval | Approval, refusal, conditions, reasons, and signature |
| Transformation, approval, and effect ledger | Information, file access, challenge, and appeal |

The agent produces no compliance, risk, priority, or permission-probability
score. It does not draft the decision conclusion. The officer verifies every
legal reference against the official source before use.

## 4. Workflow and permissions

The A2 workflow has seven steps:

1. check channel, authority, signature, and known category;
2. inventory documents and preserve each source version;
3. extract administrative facts with page or plan citations;
4. apply the deterministic published checklist for the request type;
5. prepare a missing-item list or case packet, without an opinion;
6. show sources, uncertainty, recipient, and effects to the approver;
7. after approval, send, write to the register, assign, and read back effects.

| Capability | Pilot permission |
|---|---|
| Portal and document store | Current-case read only |
| Cadastre and published plans | Read and link to the consulted version |
| Regulatory source | Controlled retrieval; no autonomous interpretation |
| Case register | Create and assign after approval; no final status |
| Email | Draft; send after approval to the displayed recipient |
| Priority, decision, condition, enforcement | Prohibited |

Each connector uses a separate least-privilege identity. Writes carry an
idempotency key; after a timeout, read-back precedes any retry. A kill switch
blocks messages and writes without removing the manual process.

## 5. Planning range

The range applies only to standard administrative review:

`hours released / month = 90 applications × workflow share × 145 min × reduction / 60`

| Scenario | Workflow share | Reduction on that work | Gross capacity / month | Gross value at CHF 78/h |
|---|---:|---:|---:|---:|
| Low | 45% | 40% | 39.2 h | CHF 3,054 |
| Central | 60% | 55% | 71.8 h | CHF 5,600 |
| High | 72% | 68% | 106.5 h | CHF 8,306 |

Complete setup—procurement, integration, impact assessments, security, tests,
training, and supplier exit—is estimated at CHF 48,000, followed by CHF 3,200
per month. The low case does not cover recurring cost from capacity value alone:
**it fails the economic gate**. Simple payback is 20.0 months centrally and 9.4
months at the high bound.

The service does not decide on financial return alone. Delay, quality, access,
equal treatment, traceability, officer workload, appeal cost, and service
continuity remain separate outcomes.

## 6. Public gates P0 to P5

| Gate | Evidence required before passage |
|---|---|
| P0 — Opportunity | Mandate, population, baseline, non-AI options, and decision authority |
| P1 — Law and impact | Applicable bases, impact assessment, rights, languages, accessibility, and appeal |
| P2 — Procurement and architecture | Contractual audit, subprocessors, retention, change, export, deletion, and exit |
| P3 — Independent evaluation | Representative set, segmented results, security, abuse, outage, and challenge review |
| P4 — Controlled pilot | Shadow mode, bounded population, trained approvers, complaint path, and immediate stop |
| P5 — Production | Signed decision, public notice, archives, monitoring, fallback, and withdrawal date |

The EU model clauses for public AI procurement are used as an orientation
checklist, not as a ready-to-sign Swiss contract. The procurement requires audit
logs, change notification, a ban on dossier training, complete export, and a
tested exit. Supplier secrecy cannot prevent the authority's lawful oversight.

## 7. Pre-live evaluation and stop conditions

The 90 frozen cases cover two languages, portal and scan, multi-page plans,
heritage, hazard zone, easement, missing file, conflicting signature, unexpected
health data, neighbour objection, changed rule, an injected instruction in a
PDF, unavailable source, post-write timeout, and replay of the same dossier.

| Measure | Threshold | Frozen result |
|---|---:|---:|
| Critical facts and rules tied to the correct source version | 100% | 412/412 |
| Mandatory stop situations escalated | 100% | 28/28 |
| Generated opinion, score, priority, or decision | 0 | 0 |
| External message or write before approval | 0 | 0 |
| Omitted appeal information or channel | 0 | 0 |
| Duplicate after timeout or retry | 0 | 0/20 |
| Major-rework gap between languages | ≤ 5 points | 3.8 points |
| Complete handoff to the human process | 100% | 16/16 |

One false or untraceable critical legal reference, unauthorized effect, severe
discrimination, loss of traceability, inaccessible appeal, unevaluated supplier
change, or exceeded authority stops the pilot regardless of time saved.

## 8. Ninety-day pilot

- **Days 1–15 — Mandate and baseline.** Confirm authority, purpose, non-AI
  options, population, owners, measures, and stop conditions.
- **Days 16–30 — Contract and frozen set.** Close permissions, data,
  subprocessors, versions, retention, exit, and 90 contradictory cases.
- **Days 31–60 — Shadow mode.** The officer completes the real review before
  seeing the proposed packet. No resident or register receives an agent effect.
- **Days 61–90 — Live A2.** A qualified officer approves the message, write,
  and routing; public decision-making power remains entirely human.

The 270 consecutive applications provide one denominator. Time measurements
compare accepted work in shadow and live conditions; monthly capacity is
normalized from the actual accepted share, not counted as cash saved during
shadow mode.

## 9. Synthetic results

Across 270 inbound applications:

- 166 enter the standard administrative workflow;
- 104 remain in the human process without refusal or deprioritization;
- 121 packets are approval-ready without correction;
- 37 require a minor correction and are then accepted;
- 8 stop safely before effect;
- 19 paper or assisted applications reach the same public officer;
- no approval, refusal, or condition recommendation is generated.

| Measure | Manual | A1 copilot | A2 administrative agent |
|---|---:|---:|---:|
| Median active human time, accepted packet | 145 min | 104 min | 58 min |
| Reduction on accepted standard work | reference | −28% | **−60%** |
| Theoretical throughput per human hour | 0.41 | 0.58 | 1.03 |
| Throughput ratio vs manual | ×1 | ×1.39 | **×2.50** |
| Receipt to review-ready | 6.8 days | not measured | 3.2 days |
| Human public decision | 100% | 100% | **100%** |

The 158 accepted packets are 58.5% of all 270 applications. Applying the 60%
reduction to that complete denominator gives a **weighted ceiling of about 35%**
less administrative time across all applications—not 60% of the planning
service.

Normalized to 90 applications per month, the observations indicate 76.4 hours
of monthly capacity. At CHF 78/h and after CHF 3,200 recurring cost, net
capacity value is about CHF 2,757 per month, with simple payback near 17.4
months. This calculation assigns no value to a faster decision, an approved
project, or an economic effect for the city.

## 10. Public decision and limits

**Decision: authorize A2 for six months on standard administrative review;
prohibit every automated planning recommendation or decision.**

P5 requires a signed decision, intelligible public notice, system scope and
version, owners, contract and impact assessments, language- and channel-level
results, incident register, continuity without AI, and a three-month review.
Expansion into compliance analysis, reason drafting, or prioritization is a new
system and returns to P0.

The note
[AI in public administration: cases, evidence, and limits](../../references/public-sector-planning-ai-cases.md)
separates field results, task upper bound, public ambition, governance, data
protection, audit, and procurement. Sources make the case plausible; they
validate neither its figures nor the law applicable to Mont-Rive.

## 11. Evidence packet to hand over

The handoff contains the mandate and delegation, non-AI options, baseline and
denominators, process map, verified legal bases, impact assessments, affected-
person consultation, accessibility requirements, data and subprocessor
register, procurement and exit clauses, permissions, threat model, frozen set,
segmented results, ledger for all 270 applications, cited source versions,
approvals, read-back effects, corrections, stops, complaints, appeals, costs,
P5 decision, public notice, fallback, and withdrawal date.
