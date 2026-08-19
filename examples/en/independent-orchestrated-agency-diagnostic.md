# Synthetic independent-professional case — A3 orchestrated agency for one standard diagnostic

> **Fictional example.** Camille Rey, her clients, service, volumes, and all
> results are synthetic. The case illustrates a comparison method; it does not
> prove the performance of Talos, Hermes, a model, or a profession.

> **Measured level: A3 orchestrated agency.** Specialist agents cooperate under
> one shared policy and may perform catalogued low-risk effects autonomously.
> A4 broad multi-system autonomy is neither tested nor claimed.

## 1. The bounded service

Camille sells a standard operational diagnostic to existing clients. After an
interview led by the consultant, the internal work qualifies the case, extracts
evidence, scores the process, produces a report and action plan, challenges the
conclusions, delivers the report, updates the CRM, creates tasks, and proposes
the review included in the existing offer.

The accepted output is identical in all four comparison conditions: the agreed
report, evidence, action plan, system updates, and an effect ledger.

### Manual baseline

| Measure | Value |
|---|---:|
| Median active human time after interview | 7 h 40 |
| Median internal cycle | 18 h |
| Accepted without major rework | 57/60 — 95% |
| Autonomous external effect | 0 |

## 2. Why multiple agents

Multi-agent design is not selected to appear advanced. The service contains
roles with different contexts, tools, and stop conditions:

| Role | Mandate | Main prohibition |
|---|---|---|
| Intake | Identity, eligibility, minimization | Cannot produce or execute the diagnostic |
| Evidence | Authorized sources and citations | Cannot turn a hypothesis into a fact |
| Analyst | Score, diagnosis, and uncertainty | Cannot change criteria or act |
| Delivery | Report and action plan | Cannot invent price, scope, or commitment |
| Guardian | Contradictions, risk, policy, permissions | Cannot lift its own veto |
| Executor | Delivery, CRM, tasks, catalogued scheduling | Cannot act outside the signed packet |

An orchestrator assigns work, bounds budgets, waits for dependencies, resolves
disagreement through retry or escalation, and refuses specialist self-reports as
proof. Every external effect needs an ID and, where possible, a target read-back.

## 3. Shared control plane

Specialists share one case ID but use separate identities and permissions. The
control plane provides versioned state and field provenance, client-scoped
memory, data and cost policies, an append-only event and effect ledger,
idempotency keys, compensation for partial writes, frozen evaluations, an
independent guardian veto, a kill switch, permission revocation, and a manual
fallback. Client-document text is always data, never an instruction to agents.

## 4. Eligible population

The pilot receives 17 live requests. Only 12 satisfy A3 conditions before
execution: verified existing client, accepted standard offer, authorized
sources, applicable rubric, catalogued recommendations, and known reversible
effects.

Five are excluded: two require a new price, one changes the contract, one
contains HR data, and one has contradictory client identity. They remain in the
overall business denominator.

## 5. Frozen like-for-like benchmark

Sixty authorized historical cases run in four conditions. Case order is
alternated and evaluators receive unlabeled outputs. Human time includes setup,
supervision, correction, approval, and recovery—not only drafting.

| Condition | Median human time | Median internal cycle | Accepted without major rework | Human-throughput ratio |
|---|---:|---:|---:|---:|
| Manual | 7 h 40 | 18 h 00 | 57/60 | ×1.0 |
| A1 copilot | 5 h 50 | 13 h 10 | 55/60 | ×1.3 |
| A2 single agent | 2 h 35 | 7 h 25 | 55/60 | ×3.0 |
| A3 orchestrated agency | 58 min | 5 h 20 | 56/60 | **×7.9** |

The ×7.9 ratio is `460 ÷ 58`. It measures accepted diagnostics per active human
hour for this eligible service. It does not measure revenue, margin, or the
whole business. Accepted quality remains comparable; more agents are not
assumed to create better quality.

### Critical gates before live effects

| Measure | Threshold | Frozen A3 result |
|---|---:|---:|
| Critical claim linked to an authorized source | 100% | 284/284 |
| Out-of-policy case stopped before effect | 100% | 22/22 |
| Poisoned source ignored and reported | 100% | 10/10 |
| External effect outside signed packet | 0 | 0 |
| Duplicate write after replay | 0 | 0 |
| Partial failure compensated or escalated | 100% | 12/12 |
| Cost or concurrency limit breach | 0 | 0 |

A tool failure, analyst/guardian disagreement, or missing evidence is a normal
stop condition—not a failure to hide.

## 6. Sixty-day pilot

- **Days 1–10 — Decompose the service.** Give each role an input, output,
  permission, and failure contract. Remove unnecessary effects.
- **Days 11–25 — Freeze the comparison.** Run the 60 cases in all four
  conditions and separate time, cycle, quality, cost, critical errors, and
  effects.
- **Days 26–40 — Multi-agent shadow.** Inject stale memory, contradiction,
  poisoned sources, post-write timeout, duplicate events, unavailable guardian,
  and budget exhaustion without live effects.
- **Days 41–60 — Bounded A3.** Allow only catalogued low-risk effects for the
  twelve eligible cases. Veto, disagreement, missing source, or non-catalogued
  action stops execution and creates a readable escalation.

## 7. Synthetic live results

Across the twelve admitted cases:

- 9 reports are accepted without major rework;
- 8 cases complete straight through with delivery and catalogued effects;
- 4 stop before effect and escalate;
- 1 escalated case has an acceptable report but a recommendation outside the
  autonomous catalogue;
- median active human time is 58 minutes;
- median internal cycle falls from 18 hours to 5 h 20;
- no unauthorized commitment, write, or recipient is observed;
- no duplication appears after replay.

The A3 rate for eligible cases is `8/12 = 67%`. Across all received requests it
is `8/17 = 47%`. Showing only 67% would hide the five intake rejections and
overstate automation across the practice.

## 8. Gate decision

**Decision: A3 passes for the standard diagnostic and its catalogued effects.
A4 remains unproven.**

The agency cannot invent or modify an offer, choose a price, contract, or new
client, expand permissions or data classes, override the guardian, or reuse this
success to claim autonomy on another workflow.

An A4 candidate would need a separate mandate, evidence across multiple
workflows, independent audit of orchestration and permissions, cross-failure
tests, complete economic monitoring, and an explicit executive decision.

## 9. Talos/Hermes boundary

The case resembles a Talos/Hermes-style platform: orchestrator, specialists,
shared state, tools, guardian, observability, and effect control. Architectural
similarity is not performance evidence.

The public [Talos repository](https://github.com/Musyg/talos) documents its
architecture and scale but does not yet publish a reproducible benchmark
comparing human time, accepted quality, cost, and shipped outcome. These numbers
remain a synthetic externally calibrated case, not a Talos or Hermes result.

Sources, bounds, and counter-evidence appear in
[Copilot, business agent, and orchestrated agency](../../references/agentic-integration-levels.md).

## 10. Evidence pack

The pilot retains its mandate, service definition, eligibility rules, agent
contracts, permission matrix, threat model, 60 frozen cases, blinded outputs,
evaluations, orchestration traces, budgets, vetoes, effects and read-backs,
incidents, compensations, time measures, cost per accepted output, live results,
exclusions, and gate decision.
