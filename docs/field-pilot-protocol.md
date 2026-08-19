# Field-pilot protocol

This protocol turns the playbook into a bounded field exercise without turning
one observation into a universal claim. The interactive site prepares a local
draft; it does not submit data or admit a report to the public registry.

## 1. Frame the pilot

Before live observation, record:

- a non-identifying project alias and one exact workflow;
- organization type, sector overlay, integration level, and system version;
- manual baseline, full request denominator, eligibility rule, exclusions, and
  preregistered thresholds;
- allowed effects, required approvals, stop authority, fallback, and evidence
  location.

Do not start when the owner, baseline, evaluation set, safe fallback, or
critical stop rule is missing.

## 2. Observe the complete denominator

Run the frozen evaluation set first, then shadow mode, then only the bounded
live level that passed its gates. Retain every request in the denominator,
including ineligible, refused, failed, escalated, and withdrawn cases.

Record accepted outcome, human active time, corrections, critical effects,
eligibility, approvals, tool effects, read-backs, incidents, and missing traces.
Model activity is not a business outcome.

## 3. Prepare a private draft

Use the [field-feedback template](../templates/field-feedback-report.md). Keep
raw evidence access-controlled. The draft must distinguish direct observation,
internal measurement, estimate, opinion, and supplier claim.

Do not place client data, identities, secrets, privileged material, raw prompts,
or exploitable security detail in a public issue or repository. Agree a private
review channel before transferring any report or evidence.

## 4. Review independently

A person who did not author the conclusion checks provenance, system and
workflow version, baseline, denominator, missing cases, incident accounting,
redaction, residual re-identification risk, transfer limits, publication
authority, and withdrawal route.

Passing this review makes the draft eligible for an admission decision. It does
not make the result representative of another organization or workflow.

## 5. Admit or withhold

Only a reviewed and anonymized report that meets every
[registry admission rule](../field-notes/README.md) may be added to
`field-notes/index.json`. Otherwise keep it private, request corrections, or
withhold publication. Synthetic cases remain under `examples/` and never count
as field evidence.

## Minimum first cohort

The first useful cohort should seek several distinct observations rather than a
single success story: at least one copilot, one bounded business agent, and one
orchestrated-agency candidate, with their implementation effort and failed or
excluded cases visible. This is a learning target, not a statistical validation
claim.
