# Synthetic independent-professional case — From meeting to reviewed follow-up

> **Fictional example.** The person, clients, volumes, and results are
> synthetic. The scenario illustrates a cautious pilot; it does not prove the
> performance of a tool or profession.

## 1. Starting point

**Camille Rey** is an independent operations consultant supporting six small
companies. She normally holds 12 to 18 client meetings per month. After each
meeting, she reviews her notes, prepares a summary, lists next actions, and
drafts a follow-up email.

Some meetings are straightforward. Others contain hypotheses, unconfirmed
decisions, or commercially sensitive information. Prices, contractual scope,
and final recommendations directly commit the consultant.

### Baseline over 22 authorized historical follow-ups

| Measure | Initial value | Source |
|---|---:|---|
| Median time from notes to reviewed draft | 44 min | Retrospective timing |
| Follow-ups ready within 24 hours | 64% | Timestamps |
| At least one agreed action omitted | 14% | File review |
| Major rework before sending | not measured | New pilot measure |

The selected problem is not “automate the client relationship.” It is:
**turn structured notes into a first summary and email draft without deciding,
promising, or sending on the consultant’s behalf**.

## 2. Mandate and boundaries

| Item | Pilot decision |
|---|---|
| Owner and decision-maker | Camille Rey |
| Duration | 14 days |
| Budget | CHF 120 in software and no more than eight setup hours |
| Scope | 14 eligible meetings, one workflow |
| Autonomy | A1 — extraction and drafting only |
| Potential impact | R2 — client data and future external communication |

Written exclusions include meeting recording or automatic transcription;
health, HR, dispute, and third-party-secret data; model access to email,
calendar, storage, or billing; generated prices, contractual commitments, or
final recommendations; automatic recipient selection or sending; and supplier
training on client data without verified conditions.

Camille uses a local five-field form: authorized context, confirmed facts,
decisions, actions, and points to clarify. Unnecessary information is removed
before a draft is requested.

## 3. Simplest sufficient system

Three options are compared: a manual mandatory-field template; the same
template with one model call producing structured output; and an assistant
connected to meetings, email, and calendar.

The second option is selected. The form supplies the structure, and the model
produces confirmed facts, actions with owners and dates, and an email draft.
Price, commitment, and recipient fields do not exist. Camille always compares
the proposal with her notes. The connected option is rejected because it adds
data, permissions, and external effects that the test does not need.

## 4. Pre-registered evaluation

Twenty-four authorized closed files are minimized. Twelve tune the form and
instructions; twelve remain frozen. The frozen set includes ambiguous dates, an
unconfirmed decision, an action without an owner, and four cases that must be
flagged instead of completed.

| Metric | Acceptance | Stop |
|---|---:|---:|
| Required facts reproduced correctly | ≥98% | <95% |
| Ambiguous cases correctly flagged | 100% | <100% |
| Invented price, commitment, or critical fact | 0 | ≥1 |
| Drafts requiring major rework | ≤30% | >45% |
| Median time to reviewed draft | ≤35 min | ≥40 min |

### Frozen-set results

| Measure | Result | Decision |
|---|---:|---|
| Facts reproduced correctly | 58/59 — 98.3% | pass |
| Ambiguous cases flagged | 4/4 — 100% | pass |
| Invented price, commitment, or critical fact | 0 | pass |
| Major rework | 3/12 — 25% | pass |
| Simulated median time | 33 min | pass |

One secondary date is attached to the wrong milestone. The error stays in the
log, and a visual date check is added to the review checklist.

## 5. Fourteen-day pilot

- **Days 1–2 — Measure and bound.** Confirm the baseline, eligible categories,
  manual fallback, and supplier data conditions.
- **Days 3–7 — Tune and test.** Use 12 tuning cases, freeze the instructions,
  then run the 12 decision cases. A critical failure stops the pilot.
- **Days 8–10 — Shadow mode.** Process five meetings, but reveal the generated
  drafts only after the manual follow-ups have been written.
- **Days 11–14 — Copilot.** Process nine eligible meetings. Camille reviews the
  notes, corrects the draft, adds commercial content herself, chooses the
  recipient, and sends through her usual email client.

## 6. Observed results

The results cover all 14 meetings. This small sample supports a continuation
decision, not an annual return claim.

| Measure | Baseline | Pilot | Observed change |
|---|---:|---:|---:|
| Median time to reviewed draft | 44 min | 34 min | −23% |
| Follow-up ready within 24 hours | 64% | 12/14 — 86% | +22 points |
| Agreed action omitted from final draft | 14% | 1/14 — 7% | −7 points |
| Major AI-draft rework | not measured | 4/14 — 29% | new measure |
| Invented price or commitment | not measured | 0 | threshold met |
| Serious incident | 0 observed | 0 observed | no rarity inference |

One date is attached incorrectly and caught before sending. Four drafts need
major restructuring. The ten-minute median saving is useful, but it has not yet
recovered the maximum eight setup hours and does not demonstrate higher revenue.

## 7. Gate decision

**Decision: extend for 30 days as an unconnected copilot.**

The pre-registered thresholds pass and follow-up becomes more consistent. The
rework rate still rules out automatic sending and any extension to complete
commercial proposals.

The extension keeps the form and date checklist, measures entry/review/correction
time separately, reviews major-rework cases weekly, reruns the frozen set after
every model or instruction change, stops on any invented price or commitment,
and decides after 30 days whether time actually released justifies the tool.

## 8. Evidence anchor

Published studies calibrate the scenario but do not supply its results. The
BCG–Harvard experiment found gains on some consulting tasks and lower accuracy
outside the AI capability frontier. Noy and Zhang studied controlled
professional writing tasks rather than an ongoing client relationship. OECD
survey data report that one-person firms often perceive a workload reduction,
while a 66-organization experiment found less email time but no detected shift
in aggregate task quantity or composition.

Sources and transfer limits are recorded in the
[evidence note](../../references/independent-knowledge-work-cases.md).

## 9. Evidence pack

The pilot retains the mandate, baseline, empty form, data rules, 12 frozen
cases, versioned outputs, error log, time measures, and gate decision. Another
person can see what was observed, what remains prohibited, and why the pilot
continues.
