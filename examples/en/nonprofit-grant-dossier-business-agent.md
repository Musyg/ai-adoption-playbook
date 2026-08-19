# Synthetic nonprofit/foundation case — A2 agent for grant dossiers

> **Fictional organization.** Fondation Lien Local, its programs, applicants,
> volumes, costs, and results are synthetic. The case illustrates a decision
> method; it does not prove the performance of any tool, supplier, sector, or
> real organization.

> **Measured level: administrative A2 business agent.** The system carries a
> standard case to a reviewer-ready packet and performs external effects after
> approval. It does not score merit, rank needs, recommend an amount, or decide
> an award or refusal.

## 1. Mission and starting point

Fondation Lien Local is a fictional 14-person Swiss foundation. It supports
community projects through CHF 5,000–25,000 micro-grants. Twenty-four volunteer
reviewers and a seven-person committee examine about 720 applications per year
in French, German, and Italian. Telephone and paper channels remain available.

A baseline across two calls covers 241 applications. For a standard case that
is ultimately sent to reviewers, the secretariat spends a median **96 minutes
of active human work**: check consent and program, inventory documents, extract
budget and schedule, verify administrative completeness, pseudonymize the
review copy, request missing information, record the case, and assign two
reviewers.

The pilot does not try to accelerate funding judgment. It addresses a narrower
problem:

**carry an administratively standard case from receipt to two authorized
reviewers without turning AI into a judge of the mission, people, or funding.**

## 2. Mandate and population

| Element | Decision |
|---|---|
| Business owner | Head of programs |
| Mission guardian | Board member independent from the pilot |
| Operational approvers | Two named grant managers |
| Duration | 60 days: integration, frozen set, shadow mode, and 30 days live |
| Baseline | 241 applications from two previous calls |
| Pre-live evaluation | 60 frozen, authorized historical cases |
| Live population | 120 inbound applications, 86 admitted to the A2 workflow |
| Autonomy | A2 — messages and writes after explicit approval |
| Impact | Internal R3 — access to funding, personal data, and mission |
| Manual fallback | Portal, telephone, paper, checklist, and grant system retained |

“Admitted to the workflow” only means that a case can follow the standard
administrative path. It does not mean eligible for funding, recommended, or
prioritized.

The A2 workflow accepts only a known program, recorded consent, identified
applicant, readable documents, and defined document categories. It stops for an
offline application, assistance need, new program, ambiguous funder restriction,
unexpected highly sensitive data, conflicting identity, inaccessible document,
conflict of interest, or any situation requiring mission interpretation.

## 3. Boundary between administration and judgment

| The agent carries | People retain |
|---|---|
| Versioned case state and workflow-entry rules | Telephone, paper, and applicant support |
| Inventory, extraction, and citations to source documents | Context and mission interpretation |
| Completeness check against a published checklist | Merit and needs assessment |
| Draft missing-document request | Every award, refusal, and amount decision |
| Pseudonymized copy and reviewer packet | Conflict-of-interest declaration and resolution |
| Two-reviewer assignment after approval | Decision explanation and challenge handling |
| Writes and effect evidence after approval | Difference review by language, channel, and organization type |

The agent produces no risk, vulnerability, “quality,” or funding-probability
score. Reviewers see source documents and work without a prefilled
recommendation. Pseudonymization reduces some visible information; it does not
claim to remove every social or cultural signal.

## 4. Workflow and permissions

The agent performs seven steps:

1. check consent, program, channel, and workflow-entry rules;
2. inventory documents without copying unnecessary data;
3. extract administrative facts with page-level source citations;
4. apply the deterministic completeness checklist;
5. prepare a document request or pseudonymized reviewer packet;
6. show sources, transformations, recipients, and effects to the approver;
7. after approval, send, write to the grant system, assign two reviewers with no
   known conflict, and read back effect identifiers.

| Capability | Pilot permission |
|---|---|
| Portal and document store | Current-case read only |
| Applicant register | Minimum read; no automatic identity merge |
| Grant system | Create and assign after approval; no final status |
| Email | Draft; send after approval to displayed contact |
| Budget and policy | Read published rules; recommend no amount |
| Score, decision, payment | Prohibited |

Raw documents remain in the authorized system. The model receives only needed
extracts. Every connector uses a separate identity. Writes use an idempotency
key; a timeout triggers a read-back before retry. The kill switch blocks
messages and writes without removing the manual path.

## 5. Planning range

The range applies to administrative time only for cases that can follow the
standard workflow:

`hours released / month = 60 applications × workflow share × 96 min × reduction / 60`

| Scenario | Workflow share | Reduction on that work | Gross capacity / month | Gross value at CHF 62/h |
|---|---:|---:|---:|---:|
| Low | 55% | 45% | 23.8 h | CHF 1,473 |
| Central | 70% | 60% | 40.3 h | CHF 2,500 |
| High | 80% | 70% | 53.8 h | CHF 3,333 |

With CHF 12,000 of setup and CHF 750 in recurring monthly cost, simple
theoretical payback ranges from **4.6 to 16.6 months** after go-live; the central
case is 6.9 months. The high bound is not a mission target.

These figures are theoretical administrative capacity—not another donation or
social impact. Released time creates value only when actually reassigned to
applicant support, decision quality, or shorter applicant delays.

## 6. Gates before live use

The 60 frozen cases cover three languages, small and large organizations, portal
and scans, multi-sheet budgets, missing files, unreadable documents, conflicting
identity, minors, unexpected health data, conflicts of interest, an injected
instruction in an attachment, unavailable services, post-write timeout, and
replay of the same case.

| Measure | Threshold | Frozen result |
|---|---:|---:|
| Critical administrative facts tied to the correct source | 100% | 266/266 |
| Mandatory stop situations escalated | 100% | 18/18 |
| Generated score, ranking, recommendation, or decision | 0 | 0 |
| External message or write before approval | 0 | 0 |
| Prohibited data in pseudonymized packet | 0 | 0 |
| Duplicate after timeout or retry | 0 | 0/16 |
| Major rework on workflow cases | ≤ 12% | 6/60 — 10% |
| Major-rework gap between languages | ≤ 5 points | 3.2 points |
| Safe handoff to a person or offline channel | 100% | 12/12 |

One suggested funding decision, data leak, channel exclusion, unauthorized
action, or untraceable transformation stops the pilot regardless of time gain.

## 7. Sixty-day pilot

- **Days 1–10 — Map and minimize.** Test rules, documents, consent, languages,
  channels, roles, retention, pseudonymization, and fallback.
- **Days 11–20 — Replay and contradict.** Run all 60 frozen cases after any
  model, instruction, rule, language, source, or connector change.
- **Days 21–30 — Shadow mode.** The secretariat prepares the real packet before
  seeing the proposal. No applicant or reviewer receives an effect.
- **Days 31–60 — Live A2.** A manager approves the message, packet, and two
  recipients; reviewers and committee then work without an agent score or
  recommendation.

## 8. Synthetic results

Across 120 inbound applications:

- 86 enter the standard administrative workflow;
- 34 remain outside the workflow and receive human service, without being
  treated as refused or “bad” applications;
- 58 packets are reviewer-ready without correction;
- 21 require a minor correction and are then accepted;
- 7 stop and escalate before effect;
- no decision, amount recommendation, or priority is generated;
- no offline channel is removed and no action occurs without approval.

| Measure | Manual | A1 copilot | A2 administrative agent |
|---|---:|---:|---:|
| Median active human time, accepted packet | 96 min | 74 min | 39 min |
| Reduction on accepted standard work | reference | −23% | **−59%** |
| Theoretical throughput per human hour | 0.63 | 0.81 | 1.54 |
| Throughput ratio vs manual | ×1 | ×1.30 | **×2.46** |
| Median time to reviewer-ready packet | 5.5 days | not measured | 2.1 days |
| Human funding decision | 100% | 100% | **100%** |

The 79 accepted packets are 65.8% of all 120 applications. Assuming the same
reference time across the portfolio, `65.8% × 59.4%` gives a **weighted ceiling
of about 39%** less administrative time across all applications—not 59% of the
foundation's entire activity.

The pilot releases about 75 hours over 60 days, or 37.5 hours per month. At CHF
62/h and after CHF 750 in recurring cost, net monthly capacity is about CHF
1,575, for a simple payback near 7.6 months. No additional social impact or
funding is automatically attributed to the agent.

## 9. Mission gate

Results are segmented by language, channel, and organization size. The pilot
does not show a gap above the preregistered major-rework threshold. Two
applicants use the telephone channel; their cases remain outside the agent and
advance to the same human gate. No AI-treatment complaint is logged in this
small sample; that does not prove the absence of a trust effect.

**Decision: keep A2 for standard administration for 90 days; prohibit every
automated funding decision or recommendation.**

The system reduces real work without crossing the mission boundary. Any
extension requires a new mandate, consultation with affected people, a larger
sample by language and channel, a tested challenge mechanism, and a decision
independent from the administrative success.

## 10. External anchors and limits

The note
[AI and grantmaking: external anchors and limits](../../references/nonprofit-grantmaking-ai-cases.md)
separates sector survey, functional analogues, provider story, Swiss law, and
evaluation guidance. Sources make the workflow plausible; they validate neither
the figures nor the boundary chosen for Fondation Lien Local.

## 11. Evidence packet to hand over

The handoff contains the mandate, mission guardian, consulted groups, baseline
and denominators, workflow-entry rules, data and consent inventory, permission
matrix, funder register, threat model, frozen set, results by language and
channel, ledger for all 120 applications, pseudonymization transformations,
approvals, corrections, escalations, recipients and read-back effects,
complaints, costs, gate decision, fallback, and review date.
