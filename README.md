# AI Adoption Playbook

**A practical, evidence-gated path from the first useful AI workflow to governed production systems.**

[Visual application source](site/README.md) · [Version française](README.fr.md) · [Start here](docs/universal-process.md) · [AI use patterns](docs/ai-use-patterns.md) · [JSON controls](controls/) · [Templates](templates/) · [Sources](references/sources.md) · [Contributing](CONTRIBUTING.md) · [Conduct](CODE_OF_CONDUCT.md) · [Security](SECURITY.md)

![AI Adoption Playbook: Evidence before autonomy](site/public/og.png)

The bilingual visual edition turns the method into an interactive path: identify
generation, retrieval, classification, prediction, conversation, multimodal, and
agentic patterns; distinguish copilot, business-agent, and orchestrated-agency integration; calibrate a realistic
range; turn it into a preregistered pilot protocol; enter the observed evidence; then
make a bounded gate decision and generate a reversible operating card with monitoring,
suspension, rollback, and dated reassessment; finally, export the complete chain as a
reviewable Markdown decision dossier. The Markdown guides remain the operational source
of truth.

**New:** compare the complete synthetic cases for an
[independent copilot](examples/en/independent-client-follow-up.md), a
[micro-business shared inbox](examples/en/tpe-customer-requests.md), a
[B2B quote business agent for an SME](examples/en/sme-b2b-quote-business-agent.md), a
[grant-dossier administrative agent for a foundation](examples/en/nonprofit-grant-dossier-business-agent.md), a
[planning-dossier administrative agent for a public service](examples/en/public-sector-planning-dossier-business-agent.md), a
[bounded business agent](examples/en/independent-business-agent-follow-up.md), and an
[orchestrated agency](examples/en/independent-orchestrated-agency-diagnostic.md),
from baseline and pre-registered thresholds to an explicit scope decision.
Four additional non-agentic cases show why low autonomy does not imply one
evaluation contract: a read-only [RAG procedure assistant](examples/en/rag-policy-assistant.md),
a [predictive demand forecast](examples/en/predictive-demand-forecast.md), an
[external customer chatbot](examples/en/external-customer-chatbot.md), and a
[multimodal catalogue assistant](examples/en/multimodal-catalog-accessibility.md).
All eleven cases are synthetic and label their evidence limits explicitly.

> Status: version **0.2.1**, private repository, snapshot **2026-08-20**. Operating guides, organization tracks, templates, worked examples, and the visual application source are available in English and French. No public hosting URL is declared.

**0.3 evidence and sector work:** the bilingual
[20-source public evidence review](references/field-evidence-review-2026.md)
separates task effects, eligible-flow effects, whole-workload outcomes,
benchmarks, telemetry, and supplier cases. It finds no independent causal field
support for a generic 5x to 12x accepted-outcome multiplier. The
[healthcare](sectors/en/healthcare.md),
[education](sectors/en/education.md), [finance](sectors/en/finance.md), and
[critical infrastructure](sectors/en/critical-infrastructure.md) add explicit
vetoes and evidence gates without replacing the universal process.

**Field validation:** use the [field-pilot protocol](docs/field-pilot-protocol.md)
to prepare a local draft, preserve the full denominator, and request independent
review before any anonymized result can enter the public registry. To coordinate
a genuine pilot without publishing raw evidence, open the
[pilot intake form](https://github.com/Musyg/ai-adoption-playbook/issues/new?template=field-pilot-en.yml).

## Why this repository exists

AI adoption fails when a tool demo is mistaken for an operating model. This playbook starts with the actual work, measures the baseline, chooses the least complex sufficient system, and requires evidence before autonomy increases.

It scales across five contexts without pretending their controls should be identical:

| Context | Recommended entry path | First useful horizon |
|---|---|---:|
| Independent professional | One reversible, low-risk workflow | 14 days |
| Micro-business (TPE) | One shared process with an owner and fallback | 30 days |
| Small or medium enterprise (PME) | Portfolio, common platform and formal gates | 90 days |
| Nonprofit or foundation | Mission, beneficiary and donor safeguards | 60 days |
| Public service | Legal mandate, impact assessment, audit and human recourse | Stage-gated |

Open the matching implementation track:

- [Independent professional](tracks/en/independent.md)
- [Micro-business / TPE](tracks/en/tpe.md)
- [SME / PME](tracks/en/pme.md)
- [Nonprofit or foundation](tracks/en/nonprofit-foundation.md)
- [Public service](tracks/en/public-sector.md)

## The operating loop

```mermaid
flowchart LR
    A["Mandate and baseline"] --> B["Map work and data"]
    B --> C["Prioritize use cases"]
    C --> D["Classify risk and autonomy"]
    D --> E["Choose the simplest sufficient system"]
    E --> F["Build evaluations first"]
    F --> G["Shadow pilot"]
    G --> H["Human-approved copilot"]
    H --> I["Bounded automation"]
    I --> J["Monitor, review, retire"]
    J --> C
```

Three rules are non-negotiable:

1. **No owner, baseline or measurable outcome: no project.**
2. **No written acceptance and stop thresholds: no pilot.**
3. **No separate evidence for value, safety and reliability: no production.**

## Progressive technical ladder

Start at the lowest level that can solve the problem and only move upward when evaluation evidence justifies the added complexity:

First identify the [AI use pattern](docs/ai-use-patterns.md). Task type,
interaction, knowledge source, deployment, impact, and autonomy are separate
dimensions. A retrieval assistant and a predictive classifier can share A1
autonomy while requiring different evidence.

1. documented manual process;
2. deterministic rule or conventional automation;
3. single model call with structured output;
4. retrieval over controlled sources;
5. workflow with tools and explicit approval;
6. bounded agent with least privilege;
7. multi-agent system only when it outperforms a simpler design on real cases.

## What is included

- a universal lifecycle with explicit evidence gates;
- a bilingual taxonomy of generation, retrieval, classification, prediction,
  conversation, multimodal, and agentic use patterns;
- risk × autonomy classification;
- adoption tracks for each organization type;
- sector overlays for healthcare, education, finance, and critical infrastructure;
- pattern-specific evaluation and security profiles, with separate Switzerland
  and European Union legal routing;
- copy-ready registers, accessibility and fundamental-rights assessments, forms, and runbooks;
- a versioned JSON crosswalk connecting controls, applicability, evidence, gates, and sources;
- a dated register of primary sources;
- dependency-free repository validation in CI;
- automated TypeScript, dependency, accessibility, static-export, and browser checks.

## Repository validation

From `site/`, install the locked dependencies and run the complete verification:

```bash
npm ci
npm run verify
python ../scripts/validate.py
```

The default static export is provider neutral and deliberately uses `noindex`.
It emits no canonical origin or sitemap until `PUBLIC_SITE_URL` is configured for
an explicitly approved host. `STATIC_BASE_PATH` can be set when that host serves
the application below its root path. Neither setting is configured in this
private repository.

## Quick start

1. Read the [universal process](docs/universal-process.md).
2. Select one organizational [track](tracks/en/).
3. Add the relevant [sector overlay](sectors/en/) when the work affects healthcare, education, finance, or critical infrastructure.
4. Copy the [mandate](templates/mandate.md) and [use-case card](templates/use-case-card.md).
5. Record every current or proposed system in the [AI register](templates/ai-system-register.csv).
6. Do not build until the first gate is satisfied.

## Scope and limits

This repository is an implementation aid, not a certification scheme and not legal, procurement, security or data-protection advice. Requirements depend on jurisdiction, sector, role in the AI value chain and the concrete use case. Validate high-impact decisions with qualified specialists and the competent authorities.

## Foundations

The playbook operationalizes, without reproducing proprietary standards:

- ISO/IEC 42001 (AI management systems), ISO/IEC 5338 (AI system life cycle), ISO/IEC 23894 (AI risk management), and the ISO/IEC 5259 data-quality series;
- NIST AI RMF and its Generative AI Profile;
- OWASP GenAI guidance and MITRE ATLAS;
- current Swiss data-protection guidance and EU AI Act implementation material.

See the [source register](references/sources.md) for primary links, status notes and verification dates.

## Contributing and license

Focused corrections, field reports and reusable templates are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md). The repository is released under the [MIT License](LICENSE).
