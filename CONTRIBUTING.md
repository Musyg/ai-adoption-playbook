# Contributing

Contributions should make the playbook more verifiable, usable, or current.

## Three contribution paths

### 1. Correct a public claim

Open a [source-backed correction](https://github.com/Musyg/ai-adoption-playbook/issues/new?template=correction.yml). Quote only the shortest necessary excerpt, link a primary source, and distinguish binding requirements, guidance, and project recommendations.

### 2. Propose a real pilot

Open the [public pilot intake](https://github.com/Musyg/ai-adoption-playbook/issues/new?template=field-pilot-en.yml) with non-identifying coordination metadata only. Then run the pilot locally using the [field-pilot protocol](docs/field-pilot-protocol.md).

GitHub never receives raw evidence. Keep client names, personal data, secrets, contracts, raw prompts, logs, screenshots, privileged material, and exploitable security detail in an authorized private system.

Only after independent review may a sanitized report use the [field-report pull-request template](.github/PULL_REQUEST_TEMPLATE/field-report.md). Review readiness is not publication approval, and an accepted report supports only its explicit evidence boundary.

Every release or material quantitative change also requires a fresh-context independent review of the exact pull-request head SHA. A prior review becomes stale as soon as that SHA changes. Merge is blocked until the new head has no open P0, P1, or P2 finding and the reviewer records the commands and evidence used.

### 3. Improve the playbook

Good contributions include reusable templates with clear inputs and exit criteria, idiomatic translations, and accessibility, security, or reproducibility improvements.

## Before opening a pull request

1. Keep one concern per pull request.
2. Date volatile legal, regulatory, and vendor claims.
3. Never paste proprietary standards or confidential organizational material.
4. Explain what changed, why, who benefits, and how it was checked.
5. Run `python scripts/validate.py`; site changes also require `npm run lint` and `npm test` from `site/`.
