# Synthetic SME case — A2 business agent for B2B quotes

> **Fictional company.** Noroît Mécanique SA, its customers, volumes, costs,
> and results are synthetic. The case makes a decision calculable; it does not
> prove the performance of a product, supplier, or real SME.

> **Measured level: A2 business agent.** The system carries an eligible quote
> from the inbound request to updated systems, but every price and every
> external effect requires explicit human approval. “Ready to approve” does
> not mean “autonomous.”

## 1. Starting point

Noroît Mécanique SA is a fictional 42-person Swiss industrial SME. It produces
configurable stainless-steel assemblies for food-production lines. A
three-person commercial team handles about 160 quote requests per month,
received by email with tables, PDFs, and sometimes incomplete references.

An eight-week baseline covers 318 inbound requests. An accepted standard quote
requires a median **76 minutes of active human work**: qualify the request, find
the customer and terms, check references, obtain price and lead time, produce
and review the document, create the ERP quote, update the CRM, and prepare the
follow-up.

An A1 drafting copilot lowers that median to 58 minutes on the tested subset.
It helps read and write, but the team still carries the case across every
system. The A2 pilot therefore addresses a different problem:

**carry one eligible catalogue quote end to end, with pricing rules, evidence,
approval, verified effects, and safe exception escalation.**

## 2. Mandate, population, and boundaries

| Element | Decision |
|---|---|
| Business owner | Sales director |
| Approvers | Two named account managers and one deputy |
| Duration | 90 days: integration, frozen set, shadow mode, then 60 days live |
| Baseline | 318 requests over eight weeks |
| Pre-live evaluation | 80 frozen, authorized historical cases |
| Live population | 316 inbound requests, 238 initially admitted as eligible |
| Autonomy | A2 — no price or external effect without explicit approval |
| Impact | R2 — customer data, commercial terms, and external communication |
| Manual fallback | Existing mailbox, checklist, templates, ERP, and CRM retained |

A case is eligible only when the customer is known, products are in the
catalogue, quantities and units are explicit, discounts remain within the
approved matrix, lead time comes from the ERP, and contractual terms do not
change.

New custom parts, unknown references, out-of-matrix discounts, below-floor
margins, new contractual clauses, conflicting identity or recipient data,
unauthorized data, unavailable lead time, CRM/ERP conflicts, content attempting
to change system instructions, and requests requiring engineering judgment are
excluded or escalated.

## 3. What the agent actually does

The agent maintains versioned case state and performs seven steps:

1. open the request and check eligibility;
2. extract references, quantities, units, recipient, and requested date;
3. read only the authorized customer account, catalogue, discount matrix, and
   availability data;
4. calculate the quote with deterministic rules and prepare the email;
5. verify critical facts, margin, lead time, conflicts, and prohibited terms;
6. show the approver sources, differences, price, lead time, and intended effects;
7. after approval, create the ERP quote, write the CRM log, send to the displayed
   recipient, and read back the effect identifiers.

| Capability | Pilot permission |
|---|---|
| Quote mailbox | Read messages and attachments for the current case |
| CRM | Authorized-account read; write after approval |
| ERP / catalogue | Read; create quote after approval |
| Price | Calculate from a versioned matrix; no override |
| Email | Draft freely; send after approval to the displayed recipient |
| Contract, new product, credit | No decision or write |

Each connector has a separate least-privilege identity. Writes carry an
idempotency key. A post-write timeout triggers a read-back before any retry. A
kill switch blocks external effects without preventing read-only diagnosis.

## 4. Low, central, and high planning range

The range is written before live use. It applies only to **active human time on
eligible quotes** and combines two visible assumptions: eligible share and time
reduction on that subset.

`hours released / month = 160 requests × eligible share × 76 min × reduction / 60`

| Scenario | Eligible share | Reduction on eligible work | Gross capacity / month | Gross value at CHF 68/h |
|---|---:|---:|---:|---:|
| Low | 60% | 50% | 60.8 h | CHF 4,134 |
| Central | 75% | 64% | 97.3 h | CHF 6,615 |
| High | 85% | 75% | 129.2 h | CHF 8,786 |

The high bound is not a sales target. It assumes clean requests, a reliable
catalogue, and no new bottleneck. The currency figure is **theoretical
capacity**, not accounting savings or revenue. It creates value only if the SME
absorbs more demand, shortens delays, avoids hiring, or actually reallocates the
time.

With CHF 16,000 of setup and CHF 1,600 of recurring monthly cost, simple
theoretical payback ranges from **2.2 to 6.3 months after go-live**; the central
case is 3.2 months. Released salary capacity, margin, quality, incidents, and
change cost must remain separate.

## 5. Gates written before live use

The 80 frozen cases include simple requests, multi-line tables, scanned files,
similar references, ambiguous units, out-of-matrix discounts, low margins,
same-name customers, changed contact details, injected instructions in a PDF,
unavailable ERP, a post-write timeout, and replay of the same event.

| Measure | Threshold | Frozen result |
|---|---:|---:|
| Critical reference, quantity, unit, price, and lead-time facts correct | 100% | 312/312 |
| Mandatory exceptions escalated | 100% | 24/24 |
| Invented price, discount, lead time, or recipient | 0 | 0 |
| External effect before approval | 0 | 0 |
| Duplicate after timeout or retry | 0 | 0/20 |
| Major rework on eligible cases | ≤ 12% | 8/80 — 10% |
| Safe fallback during simulated outage | 100% | 12/12 |

One price, recipient, authorization, or untraceable-effect error stops the
pilot, even if average handling time is good.

## 6. Ninety-day sequence

- **Days 1–10 — Integrate without opening.** Inventory rules, separate
  identities, read-only access, simulated writes, effect ledger, and fallback.
- **Days 11–20 — Replay and attack.** Rerun all 80 frozen cases after any model,
  instruction, rule, source, or connector change.
- **Days 21–30 — Full shadow mode.** The team finishes the real quote before
  seeing the proposal; no live system receives an effect.
- **Days 31–90 — Live A2.** An approver sees the evidence packet and authorizes
  only the displayed price, recipient, and writes.

## 7. Synthetic pilot results

Across 316 inbound requests:

- 238 pass the initial eligibility filter;
- 78 are rejected at admission and remain in the global denominator;
- 163 are ready to approve without correction;
- 57 require a minor correction and are then accepted;
- 18 stop and escalate before effect because of a newly found conflict;
- no action occurs without approval, no price is invented, and no effect is
  duplicated.

| Measure | Manual | A1 copilot | A2 business agent |
|---|---:|---:|---:|
| Median active human time, accepted standard quote | 76 min | 58 min | 27 min |
| Reduction on accepted eligible work | reference | −24% | **−64%** |
| Theoretical throughput per human hour | 0.79 | 1.03 | 2.22 |
| Throughput ratio vs manual | ×1 | ×1.31 | **×2.81** |
| Workflow carried | 0/7 step | 1–2/7 steps | 7/7 steps |
| External effect | human | human | after approval |

The 220 accepted quotes are 69.6% of all 316 requests. Assuming the same
reference time across the portfolio, `69.6% × 64.5%` gives a **weighted ceiling
of about 45%** less active human time across all requests—not 64%. The actual
ledger must replace this shortcut when excluded requests take different times.

The pilot releases about 179.7 hours over 60 days, or 89.8 hours per month. At
CHF 68/h and after CHF 1,600 of recurring cost, that is about CHF 4,500 of net
monthly capacity and an observed simple payback near 3.5 months. No extra
revenue is attributed to the agent.

The autonomous completion rate remains **0%**: every accepted quote requires an
approval. The 163/238 result means “ready to approve without correction,” not
“completed end to end without a person.”

## 8. Gate decision

**Decision: keep A2 for 90 days and do not open A3.**

The gain on eligible work falls inside the preregistered range, the critical
gates pass, and central cost remains plausible. The SME still retains approval
for every price and recipient. Custom parts, exceptional discounts, and
contractual changes remain human work.

An A3 candidate limited to repeat orders with unchanged price and recipient
requires a new mandate, at least 300 additional eligible cases, zero critical
errors, measured segment drift, access-revocation testing, proven rollback, and
a decision independent from the A2 success.

## 9. What makes the case realistic—and not directly transferable

The evidence note
[B2B quoting in SMEs: external anchors and transfer limits](../../references/pme-b2b-quote-cases.md)
separates an SME survey, supplier-published case studies, and agent benchmarks.
External observations make the magnitudes plausible; they validate neither
Noroît Mécanique SA nor its costs or results.

Performance depends mainly on the genuinely eligible share, catalogue quality,
pricing rules, ERP/CRM integration, stable exceptions, and effect control. An
SME whose quotes mostly require engineering judgment may reasonably see a low,
zero, or negative gain.

## 10. Evidence packet to hand over

The handoff retains the signed mandate, baseline and denominators, versioned
pricing rules, permission matrix, threat model, frozen-set identifier, segmented
results, ledger for all 316 requests, approvals, corrections, escalations, tool
calls, effect identifiers and read-backs, incidents, costs, gate decision,
manual procedure, and next review date.
