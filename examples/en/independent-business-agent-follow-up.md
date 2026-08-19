# Synthetic independent-professional case — From copilot to an A2 business agent

> **Fictional example.** Camille Rey, her clients, volumes, and results are
> synthetic. The case illustrates a measurement method; it does not prove the
> performance of a product, Talos, Hermes, or a profession.

> **Measured level: A2 business agent.** The system carries one bounded case
> end to end and performs external actions after explicit human approval. It is
> neither a simple A1 copilot nor A3 autonomy.

## 1. Continuity with the copilot pilot

Camille first tested a drafting copilot for fourteen days. Median human work
fell from 44 to 34 minutes, but she still had to provide context, check notes,
transfer actions, update the CRM, create tasks, choose recipients, and send.

The new problem is no longer “write better.” It is:

**carry an eligible client follow-up from structured notes to updated systems,
with controls, one approval, traceable execution, and exception escalation.**

## 2. Mandate and eligible population

| Element | Decision |
|---|---|
| Owner and approver | Camille Rey |
| Duration | 30 days |
| Live population | 20 eligible client follow-ups |
| Pre-live evaluation | 40 frozen, authorized historical cases |
| Autonomy | A2 — action after explicit approval |
| Impact | R2 — client data and external communication |
| Manual fallback | Existing checklist, templates, and systems retained |

A case is eligible only when the client, purpose, possible recipients, and
follow-up category are already known. New pricing, contract changes, legal
recommendations, disputes, health or HR data, unauthorized third-party data,
unknown recipients, unconfirmed decisions, and note/CRM conflicts are excluded.

## 3. Workflow and permissions

The agent performs six steps in a versioned case state:

1. check eligibility and minimize the notes;
2. read authorized client context and CRM rules;
3. prepare the summary, actions, dates, and email;
4. verify facts, dates, owners, prohibited commitments, and conflicts;
5. present one evidence packet to Camille;
6. after approval, send, write to the CRM, create tasks, and retain effect IDs.

| Capability | Pilot permission |
|---|---|
| Structured notes | Current case read only |
| CRM | Authorized-client read; write after approval |
| Email | Draft freely; send after approval to displayed recipients |
| Task system | Create after approval; no deletion |
| Calendar | Availability read; no automatic booking |
| Price and contract | No write or decision |

Each system uses a separate technical identity. Writes carry an idempotency key
so a retry cannot create duplicate tasks or emails. A kill switch blocks
external effects without blocking read-only diagnosis. Tokens, instructions,
outputs, validations, tool calls, responses, and effect IDs are logged.

## 4. Evaluation written before live use

The 40 frozen cases cover simple files, ambiguous dates, ownerless actions,
CRM/note conflicts, price requests, missing recipients, injected note content,
expired sessions, unavailable CRM, post-write timeouts, and replayed cases.

| Measure | Threshold | Frozen result |
|---|---:|---:|
| Critical facts correctly carried | 100% | 117/117 |
| Mandatory exceptions escalated | 100% | 14/14 |
| Invented commitment, price, or recipient | 0 | 0 |
| External action before approval | 0 | 0 |
| Duplicate write after retry | 0 | 0 |
| Major rework on eligible cases | ≤ 10% | 3/40 — 7.5% |
| Safe fallback during simulated outage | 100% | 8/8 |

Three cases pass the critical gates but require major restructuring. They remain
in the regression set. No critical failure is hidden inside a global average.

## 5. Thirty-day pilot

- **Days 1–5 — Connect safely.** Separate identities, least privilege,
  read-only CRM, simulated writes, idempotency, kill switch, and manual fallback.
- **Days 6–12 — Replay and attack.** Run all 40 cases again after any change to
  instructions, model, connector, or policy.
- **Days 13–20 — Full shadow mode.** Compare the proposed end-to-end workflow
  with the real manual follow-up; no live system receives an effect.
- **Days 21–30 — A2 with approval.** Camille sees sources, message, intended
  writes, and passed controls. One approval authorizes only those displayed
  effects for that case and expires after execution.

## 6. Synthetic results

| Measure | Initial manual | A1 copilot | A2 business agent |
|---|---:|---:|---:|
| Median active human time | 44 min | 34 min | 14 min |
| Theoretical accepted output per human hour | 1.36 | 1.76 | 4.29 |
| Throughput ratio vs manual | ×1 | ×1.29 | **×3.15** |
| Workflow carried by the system | 0/6 step | 1/6 step | 6/6 steps |
| Permitted external action | none | none | after approval |

Across the 20 live cases:

- 13 are ready to approve without correction;
- 4 need a minor correction before approval;
- 3 are correctly escalated: two price/scope requests and one conflicting date;
- no price, commitment, or recipient is invented;
- no external action occurs without approval;
- no write or email is duplicated.

The **straight-through rate remains 0%** because A2 requires approval for every
case. The 13/20 result means “ready to approve without correction,” not
“autonomous.” This prevents a good A2 outcome from becoming an A3 claim.

The ×3.15 ratio applies only to accepted follow-ups per active human hour. It
does not prove tripled revenue, annual return, or removal of other bottlenecks.

## 7. Gate decision

**Decision: keep A2 for 60 days; do not enable A3.**

A limited A3 candidate for recurring low-risk follow-ups can be reviewed only
after 50 additional eligible cases, zero critical or unauthorized effects, at
least 80% ready without correction, no more than 10% major rework, stable
exception categories, tested restoration and permission revocation, and a new
documented decision distinct from A2 success.

## 8. Why the gain exceeds the copilot result

The model is not assumed to be three times smarter. The gain comes from moving
work the copilot left with Camille: context retrieval, system-to-system
transport, checks, write preparation, execution, and logging.

External ranges, limitations, and counter-evidence are documented in
[Copilot, business agent, and orchestrated agency](../../references/agentic-integration-levels.md).

## 9. Evidence pack

The pilot retains its mandate, eligibility rules, permission matrix, threat
model, 40 frozen cases, versioned outputs and traces, approval evidence, effect
IDs, idempotency tests, incidents, active-time measures, corrections,
escalations, gate decision, and manual fallback.
