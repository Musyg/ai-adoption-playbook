# AI Adoption Playbook: handoff

Snapshot: 2026-08-21 (Europe/Zurich)

## Current state

- Repository: `Musyg/ai-adoption-playbook`
- Canonical branch: `main`
- Release: `0.2.2`
- Visibility: public
- Approved public website: `https://musyg.github.io/ai-adoption-playbook/`
- Static hosting: GitHub Pages through `.github/workflows/pages.yml`
- Canonical application source: `site/`
- Provider-neutral static client: `site/static-client/`
- Generated static output: `site/static-dist/`, ignored by Git
- Validation workflow: `.github/workflows/validate.yml`
- Deployment workflow: `.github/workflows/pages.yml`
- Dependency updates: `.github/dependabot.yml`

Repository publication is complete. The owner approved GitHub Pages on
2026-08-20. Deployment remains gated on a successful validation run for `main`.

## What is ready

The repository contains a progressive decision path from a first
plain-language question to a bounded operating handoff. The default path shows
one of five decisions at a time, provides contextual help bubbles, and returns
a personalized starting plan. Three closed chapters keep the concept library,
pilot workspace, and implementation library available without exposing the
reader to the full technical corpus at once. Each open chapter presents a
plain-language topic router and reveals only the selected topic. The worked
cases have a second router so only one comparison appears at a time. Deep links
restore the required chapter, topic, and case automatically.

The path distinguishes seven ways of using AI: generation, retrieval,
extraction and classification, prediction and recommendation, conversation,
multimodal systems, and agentic action.

It then keeps three integration levels distinct:

1. a copilot, where a person operates every cycle;
2. a bounded business agent, where the system completes eligible cases and
   escalates exceptions;
3. an orchestrated agency, where specialist agents coordinate under shared
   controls and must outperform a simpler design.

Use pattern, interaction, knowledge source, deployment, integration level,
autonomy, risk, and jurisdiction are separate dimensions. The visual application
includes a task-time evidence selector and full human-time account, six
primary-evidence reality checks, eleven synthetic worked cases, pilot
preregistration, evidence gates, reversible operations, decision-dossier
export, field-pilot preparation, five organization paths, four sector overlays,
and a versioned control crosswalk. The selected use pattern chooses the nearest
task profile, while use pattern and jurisdiction feed the control filter and
exported pilot records. The Markdown guides and templates remain the
operational source of truth.

Swiss and EU routes are evaluated separately. The Swiss route covers FADP data
processing, direct language-model interaction, qualifying automated individual
decisions, and applicable cantonal, public-law, and sector rules. The EU route
covers provider/deployer roles, AI Act classification, Article 50 transparency,
and separate GDPR or high-risk duties. Neither route is evidence of compliance
with the other.

Four additional synthetic cases operationalize the non-agentic modes:
read-only RAG, conventional prediction, an external customer chatbot, and a
multimodal catalogue assistant. They demonstrate that systems can share A0 or
A1 autonomy while requiring different frozen datasets, failure metrics, legal
routes, security tests, and release gates.

The public-evidence review covers 20 public studies,
deployments, benchmarks, official evaluations, and negative results. It removes
the former universal productivity bands from the visual guide. The public
evidence does not support a generic 5x to 12x multiplier on accepted business
outcomes. Those figures may be tested as explicit hypotheses only.

Synthetic examples are not field evidence. `field-notes/index.json` remains
empty until a genuine, independently reviewed and sanitized submission meets
the publication contract. Public third-party studies inform pilot design but do
not satisfy that first-party admission rule. Release 0.3 remains unreleased
until at least three genuine first-party reports pass independent review,
anonymization, complete-denominator, transfer-limit, and registry requirements.
This limitation does not turn public studies or synthetic cases into field
evidence for release 0.2.2.

## 0.6 implementation: transferable task-time evidence

The current quantitative layer compares bounded tasks and workflows, not
organization categories. Evidence from an AI company, research laboratory,
university, public administration, independent practice, or small business may
inform another context only when the task contract, automation mechanism,
prerequisites, and acceptance threshold are comparable. Organization type is a
context overlay for scale, law, governance, data, procurement, and control
requirements. It is not the benchmark unit.

The implementation preserves the existing seven use patterns, three
integration levels, A0 to A4 autonomy scale, R0 to R3 impact scale, Swiss and EU
routing, progressive interface, lifecycle, controls, dossier, and worked cases.
The cases are normalized as applications of transferable mechanisms rather
than discarded or rewritten from scratch.

The three operational modes remain distinct:

1. copilot: AI prepares, suggests, retrieves, or analyzes while a person
   operates every cycle, generally at A0 or A1;
2. bounded automation: AI completes an explicitly eligible process with
   authorized tools and escalates exceptions, generally from A1 to A3;
3. hard automation: long-horizon work uses several tools or agents, may run in
   parallel, and requires stronger controls, generally at A3 or A4.

Scale, multiple agents, or a frontier organization do not automatically imply
A4. Autonomy remains a separate, observed property of what the system may do.

### Time-accounting contract

Every quantitative record must distinguish:

- baseline human time without AI;
- human preparation time;
- human supervision time;
- human verification and correction time;
- human time spent on exceptions and rework;
- amortized human setup time;
- machine runtime;
- end-to-end elapsed time;
- task frequency and volume;
- the required quality threshold, acceptance rate, and exception rate.

Machine runtime is never counted as human time saved. A slower or negative
result remains valid evidence and must not be clipped away. The core equations
are:

```text
human time with AI = preparation + supervision + verification
                     + corrections + exceptions + amortized setup
human time saved per task = baseline human time - human time with AI
annual human time saved = human time saved per task * annual frequency
```

Elapsed-time reduction, human-capacity gain, quality, and risk remain separate
outputs. A claim such as a review moving from three days to one day is an
elapsed-time observation unless the human minutes are also measured.

### Transfer contract

For each source record, calculate its residual human-time ratio:

```text
residual ratio = human time with AI / baseline human time
```

The ratio may inform a target task only after checking output unit, complexity,
quality threshold, verifiability, data and tool access, operator experience,
exception rate, and consequence of error. The transfer result has four states:

1. compatible: produce a source-informed low, central, and high range;
2. partially compatible: expose the adjustments and label the result as a
   hypothesis to test;
3. context only: retain the mechanism or reported outcome without transferring
   a human-time ratio;
4. incompatible: do not transfer the quantitative result.

A percentage is never transferred merely because two organizations share a
sector or size. Conversely, a source from a different organization type is not
excluded when the task and evaluation contract are genuinely comparable.

### Evidence grades

Quantitative records must expose their source and use one evidence grade:

- A: controlled or paired measurements with actual task-time logs;
- B: field telemetry or other objective operational measurements;
- C: self-reported time or survey estimates;
- D: internal or supplier case study with incomplete independent validation;
- E: model-estimated, synthetic, or planning-only value.

Grades describe the measurement basis, not whether the result is favorable.
Public and supplier evidence can seed planning, but it does not satisfy the 0.3
first-party admission contract.

### Implementation state

1. `task-time-evidence.v1.json` and its strict JSON Schema contain ten task
   profiles, nine external evidence records, evidence grades A to E, and the
   classification of all eleven worked cases.
2. The pure transfer engine checks the task profile, operating mode, output
   state, and operator experience. It keeps measured slowdowns negative and
   blocks context-only sources from automatic transfer.
3. The progressive calculator exposes one task, one evidence anchor, and one
   complete human-time account. Preparation, supervision, verification,
   corrections, expected exception work, and amortized setup remain editable.
4. The engine now produces a net low, central, and high range. For each source
   point it retains the greater of source-implied residual human time and the
   declared local human-work floor, then adds amortized setup. The unadjusted
   source range remains visible and neither result is presented as pilot evidence.
   At zero eligible cases the net range is unavailable, source and local
   provenance labels remain distinct, and the copied pilot brief preserves the
   complete human-work and setup contract for reproduction.
5. Every worked-case result is explicitly classified as a grade E planning
   hypothesis. External records may remain attached as separate context without
   upgrading the synthetic result.
6. No `time_scenario` was added to the project dossier. The calculator is not
   currently persisted or exported, so an additive schema migration would add
   complexity without preserving any user-authorized record.
7. Source, calculation, editorial, JSON, TypeScript, accessibility, responsive,
   palette, and browser checks pass locally for the previous layer. The net
   range change must pass the same checks and an independent external review
   before assigning a 0.6 release date.

This work is a new quantitative evidence and transfer layer. It is not a new
organization track, it does not require rebuilding the playbook, and it does
not by itself complete release 0.3.

## GitHub Pages deployment

The default server and static builds declare no production origin. They omit
canonical links, alternate route metadata tied to an origin, `og:url`, and
social images that require an absolute URL. The static export also omits a
sitemap and ships with `noindex, nofollow`.

The owner approved GitHub Pages as the public host. The deployment workflow
runs only after the validation workflow succeeds on `main`, then configures:

- `PUBLIC_SITE_URL`, the approved absolute canonical origin;
- `STATIC_BASE_PATH`, if the application is served below the origin root.

With these values set, the static finalizer generates canonical links,
alternate routes, `og:url`, absolute social images, the sitemap, and
`.nojekyll`. A dedicated hosted-export test verifies the 14 routes and prevents
paths from escaping the project base. Local exports remain provider neutral.

## Validation contract

From `site/`:

```powershell
npm ci
npm run verify
python ../scripts/validate.py
```

Latest local verification on 2026-08-21:

- ESLint: pass
- TypeScript 6.0.3: pass
- server and static builds: pass
- Node tests: 40/40 pass
- Playwright: 42/42 pass across both routes, desktop light, desktop dark, and
  mobile light
- automated axe checks: zero violations
- repository validation: 114 Markdown files and 48 paired documents pass

The verification contract covers:

- ESLint and strict TypeScript compilation;
- the Vinext server build and provider-neutral static export;
- 40 Node tests for accessibility semantics, decision logic, task-time transfer,
  rendered HTML, controls, GEO content, and all 14 exported routes;
- 42 Playwright checks across both routes, desktop light, desktop dark, and
  mobile light profiles;
- full-page automated Axe analysis;
- responsive overflow, route selection, interaction, palette, and neutral local-export checks;
- repository structure, paired documents, links, register contracts, crosswalk
  references, and forbidden historical hosting origins;
- npm dependency audit at the moderate threshold in continuous integration.

## GitHub controls

One least-privilege validation workflow handles pull requests and pushes to
`main`. It has read-only repository contents permission, cancels superseded
runs, and performs repository validation, dependency audit, lint, type checks,
builds, Node tests, and Chrome browser tests.

Dependabot configuration covers npm dependencies under `site/` and GitHub
Actions at the repository root. Repository vulnerability alerts and automatic
security fixes must remain enabled. These controls do not make the repository
public and do not deploy the application.

## Boundaries that must remain explicit

- Planning ranges are not forecasts or confidence intervals.
- Use pattern is not integration level, and integration level is not autonomy.
- Swiss and EU legal routes must be qualified independently.
- Percentages apply only to eligible work, not automatically to a whole role or
  organization.
- Incomplete evidence is `unknown`, not a pass and not a failure.
- A critical safety or unauthorized effect overrides value and quality.
- Production remains bounded, reversible, version-specific, and subject to a
  dated reassessment.
- A filtered control list is conditional guidance, not certification or legal
  advice.
- No raw client data, secrets, or uncontrolled evidence belongs in GitHub.
- Search-ready metadata does not prove indexation, ranking, or answer-engine
  citation.

## Publication decision

The owner authorized public visibility on 2026-08-20. The incomplete
field-feedback objective remains visible and is not presented as implemented.

The owner separately authorized GitHub Pages hosting on 2026-08-20. Publish only
through the gated workflow, preserve the neutral local export, and verify the
live URL, metadata, routes, assets, sitemap, and palette after each deployment.
