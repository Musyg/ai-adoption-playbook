# Field-feedback registry

This directory is the publication boundary for reviewed, anonymized field feedback. It contains no field report yet. An empty registry is not evidence that the playbook works in practice.

Start with the [field-pilot protocol](../docs/field-pilot-protocol.md). Its site
assistant creates a local draft only; raw evidence must never be submitted
through a public issue.

Use the [public pilot intake](https://github.com/Musyg/ai-adoption-playbook/issues/new?template=field-pilot.yml)
only to coordinate a non-identifying pilot. After the private evidence review,
a sanitized report may use the
[field-report pull-request template](../.github/PULL_REQUEST_TEMPLATE/field-report.md).
GitHub never receives raw prompts, logs, screenshots, client material, personal
data, secrets, or other raw evidence.

## Admission rule

A report is listed in [`index.json`](index.json) only when it:

1. uses the [field-feedback template](../templates/field-feedback-report.md);
2. identifies provenance, collection method, system version, baseline, denominator, and missing cases;
3. separates observation, estimate, opinion, and supplier claim;
4. records incidents, failures, corrections, and withdrawals;
5. removes personal data, identities, secrets, privileged material, and exploitable security detail;
6. states the populations, workflows, conditions, and claims to which the result does **not** transfer;
7. has a named publication authority, reviewer, and withdrawal route.

## What anonymization cannot prove

Removing a name does not make a report anonymous. Rare roles, dates, volumes, locations, vendors, incidents, or combinations of attributes may re-identify an organization or person. Review the complete report and its context, minimize details, aggregate where justified, and withhold publication when residual re-identification or security risk remains.

## Status values

- `reviewed`: admitted to the public index with its evidence boundary;
- `withdrawn`: retained as a tombstone with a reason, not silently deleted;
- drafts remain outside the public index.

Synthetic worked examples belong under `examples/`, never in this registry.
