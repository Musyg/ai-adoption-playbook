# AI Adoption Playbook: handoff

## September 20 wide-desktop chapter layout correction

The owner reported compressed, overlapping content below the chapter topic
selector in Chrome on a large desktop screen. Reproduced in Chrome at 1920px:
chapter sections had 360px horizontal padding calculated from the viewport,
inside an already capped 1200px chapter body. This left only about 480px for
desktop grids. The same defect affects the other detailed chapter sections.

The two affected CSS rules now use 40px horizontal padding inside chapters.
The existing 20px mobile padding and genuinely full-width guided introduction,
header and footer are unchanged. No content or decision logic was modified.
New regression coverage checks EN/FR, light/dark, and viewport widths 1280,
1440, 1920, 2560 and 3840px. It checks local child bounds as ancestor clipping
can conceal overflow from a document-width test. The regression failed before
the correction (360px instead of 40px) and passes after it.

Local builds, TypeScript, ESLint and all 66 Node tests pass. Four new desktop
checks pass (the explicitly desktop cases skip the mobile project); the existing
mobile and desktop navigation/route checks are retained. Publication requires
independent review and the normal PR, main-validation and Pages gates.

The preceding SEO/GEO correction was published as `bcfb876` through PRs #59/#60:
main validation `35500090501` and Pages `35500454449` succeeded. Live checks and
independent verification passed for all 14 sitemap URLs and localized metadata.
The older prepublication notes below are retained as historical checkpoints.

## September 20 SEO/GEO corrections: prepublication validation

The approved follow-up corrects editorial dates, author attribution and article
sharing images without changing guide advice, evidence or decision logic.
The September 12 revision date is grounded in commit `9736e1f`, not the build
clock. Article ISO dates now drive the visible date, JSON-LD and sitemap;
the two home dates are maintained in `site/app/editorial-metadata.mjs`.
The guide identifies Gilles Musy (Musyg) as a Person and links the localized
portfolio biography. Hosted articles reuse the guide's sharing image.
Provider-neutral builds retain noindex and no hosted canonical/image metadata.

Local validation: TypeScript and ESLint pass; 66 Node tests pass; all four
hosted-export checks pass (including server article metadata and the 14-page
sitemap); nine targeted browser checks pass across desktop light/dark and mobile,
covering both homes and all 12 articles. The neutral export is restored.
An independent agent approved the diff and separately passed the two new
editorial metadata unit tests. These are prepublication validation results, not
proof of a successful deployment. Publication was subsequently authorized by the
owner; the PR, main validation and Pages run must be checked before crediting
the public site with these corrections.

Publication follow-up: PR #59 merged as `5269170`; PR and main validation
passed. Pages run `35499570529` then correctly stopped before deployment because
the new server metadata check lacked the public URL at test runtime. The workflow
now passes the same PUBLIC_SITE_URL and STATIC_BASE_PATH to build and hosted
verification. The exact missing-environment failure was reproduced locally;
restoring these variables made all four hosted checks pass. Independent review
approved the three-line workflow correction. A successful subsequent Pages run
and live verification are still required; no assertion or gate was removed.

Read-only live follow-up on September 20: the GitHub Pages root robots.txt and
guide sitemap both return HTTP 200. Robots permits all paths. The public sitemap
still contains the old August dates, as expected before this correction is
published. Remaining work: publish the approved correction, verify public
parity, then inspect actual indexing and AI referral/citation evidence rather
than infer visibility from crawl permissions alone.

Publication status verified: 2026-09-12 (Europe/Zurich).

## Current publication and maintenance status

The reader-clarity corrections were published through
[PR #55](https://github.com/Musyg/ai-adoption-playbook/pull/55), merged into
`main` at `9736e1f4a0a572bd40ac007bf6926265a28ff310` on September 12.
[Main validation](https://github.com/Musyg/ai-adoption-playbook/actions/runs/34685111291)
and [Pages deployment](https://github.com/Musyg/ai-adoption-playbook/actions/runs/34685452972)
both succeeded. All 14 public routes returned HTTP 200, and both home routes
contained the new monthly-workload summary. Main validation passed 62 Node
tests and 144 Chrome checks, with zero npm audit findings at that point.

The user then authorized documentation cleanup and targeted loading
optimization on `maintenance/publication-performance`. This new maintenance
pass is separate from the published commit above; its publication must not be
assumed from the September 12 deployment. No new numbered release or Git tag
is implied. Reader sessions remain user-led, and the known 0.3 field-evidence
gate remains unchanged.

See the [loading review](docs/loading-review.md) and its
[French version](docs/loading-review.fr.md) for the measured static payload,
cache boundaries, French hydration correction and remaining server-build scope.

Local maintenance validation passed on September 12: TypeScript, lint,
production/server and static builds, 64 Node tests, and 153 Chrome checks
(6.7 minutes, three workers, no retries). Repository validation covers 127
Markdown files and the declared contracts; the source-discovery regression
also passes. All three hosted-export checks pass, including all 12 article
paths. A Chrome smoke check of the hosted base path verified both interactive
home routes and the article language link without browser errors or failed
asset responses. The provider-neutral export is restored for local testing.
No dependency lockfile, evidence registry, calculation engine, decision engine
or dossier schema was changed. These results were obtained before commit and
push. Git history and the remote maintenance branch record subsequent delivery;
a branch push does not imply a merge or a new Pages deployment.

The dated sections below preserve historical verification and review records.
Their local-only, branch, test-count and deployment statements describe those
earlier snapshots, not the current publication status above.

## September 12 reader-clarity follow-up

The user authorized correction of all findings from the reader-clarity audit
before arranging readers themselves. Work is on `improvement/reader-clarity`,
based on local `main` at `7623b15`. This is local implementation, not a new
publication. Earlier snapshots below describe their own point in time.

The [correction map](docs/reader-clarity-review.md) and its
[French version](docs/reader-clarity-review.fr.md) trace each finding to the
affected surface. Preserve the three work modes, four architectures, A0 to A4,
transferable evidence, editable demonstrations, quantitative calculations and
the existing real-decision gates. Human reader sessions are a later user-led
step, not a prerequisite for these corrections or their technical validation.

Local verification completed: lint, TypeScript, build, 62 Node tests, 144 Chrome
checks across desktop light/dark and mobile, repository validation and the two
JSON Schema checks passed. New screen captures were inspected in all three
browser profiles. See the correction map for details. No commit, push, merge
or deployment was performed for this correction pass.

## September 12 merge follow-up

[PR #53](https://github.com/Musyg/ai-adoption-playbook/pull/53) tracks integration
of the reviewed refresh and dependency fixes. Its initial GitHub check found
GHSA-2883-xcg3-v3hh, published on September 8 at 21:24 UTC, after the local audit.
The lockfile now updates only js-yaml 4.3.1 to 4.3.2 for this additional fix;
the refreshed lockfile audit reports zero vulnerabilities. The required checks
must pass again for this new head before merge. The PR and its linked workflow
runs are the authoritative integration and deployment status; the September 8
snapshot below records the prior local verification, not the final merge state.

## Dependency security refresh

The maintenance branch now locks Browserslist 4.28.9, fast-uri 3.1.7 and
fflate 0.7.5. Browserslist's compatibility-data dependencies were updated with
it. Direct dependencies, application content and calculation logic are unchanged.
The update addresses five high-severity alerts reported on GitHub and one
additional moderate-severity fflate finding from npm. A clean `npm ci` and
`npm audit --audit-level=moderate` report zero vulnerabilities on 2026-09-08.
This is an audit result for this dependency snapshot, not a guarantee that
future advisories will not be published. GitHub's default-branch alerts will
remain open until the correction is merged into `main` and re-evaluated.

## September evidence and scenario refresh

Local implementation of all six audit priorities is complete and verified.
Working branch: `maintenance/september-evidence-scenarios`. The reviewed refresh
at `c0fa2b1` was pushed on 2026-09-07. No merge or publication was performed;
`main` remains at `d6a7b3d`. Priorities 1 to 5 cover the
corrected accounting and BCG summary, a single evidence-grade vocabulary,
C2PA 2.4 and the QJE support publication, ten additional implementation cases,
editable scenario margins, source-time coverage and short evaluation guidance.

The registry now contains 19 sources, with four admitted human-time ratios.
Context-only cases can seed explicit demonstrations; they do not become measured
coefficients automatically. Optional measurement metadata identifies the kind
of range, observation period, model/tools and what time was counted.

Scenario settings are saved and copied with frozen hypotheses. The main inputs
describe the central case; optional review, exception and setup margins produce
cautious and favourable cases. Additional work must be absent from both the
source and local breakdown. Setup already included in source time is removed
before local setup is added. That source-specific adjustment resets when the
user selects another task or study. Older sessions retain the default method.

The known first-party evidence requirement for 0.3 is unchanged. The new examples
and simulations enrich its hypothesis layer, not its observation layer.

Two separate agents reviewed the frozen changes: calculation/state/export and
source accuracy/reader clarity. Both approved `c7c3976` after corrections. The
subsequent CSS and source-only validation changes were separately approved at
`ff66b33`, including the inspected CI regression-test addition. Final Chrome
coverage ran against the application content at `9b53df1`; later changes affect
repository validation, its CI command and this handoff, not the application.

The review corrected an incomplete first-audit recommendation: C2PA 2.4, not
2.3, is the current published reference checked here. Old source identifiers
remain available for provenance. The amortization display now keeps a scenario
that never pays back visible instead of showing only its favourable endpoint.

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
four questions followed by a result, provides contextual help bubbles, and returns
a personalized starting plan. Three closed chapters keep the concept library,
pilot workspace, and implementation library available without exposing the
reader to the full technical corpus at once. Each open chapter presents a
plain-language topic router and reveals only the selected topic. The worked
cases have a second router so only one comparison appears at a time. Deep links
restore the required chapter, topic, and case automatically.

The path distinguishes seven ways of using AI: generation, retrieval,
extraction and classification, prediction and recommendation, conversation,
multimodal systems, and agentic action.

It then keeps three decisions distinct:

1. work mode: copilot, bounded automation, or strong automation;
2. architecture: one model, a tool-assisted workflow, one business agent, or
   an orchestrated agent team;
3. exact action boundary: A0 to A4.

Use pattern, interaction, knowledge source, deployment, work mode,
architecture, exact action boundary, risk, and jurisdiction are separate dimensions. The visual application
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

The 0.3 work combines two labelled layers. Public studies, transferable task
records, and synthetic cases may seed preregistered hypotheses. Field pilots
then preserve the hypothesis, the complete observed denominator, and the gap
used for recalibration. This makes extrapolation part of 0.3 without relabelling
it as observation. `field-notes/index.json` remains empty until genuine,
independently reviewed and sanitized submissions meet the publication contract.
The field-validation gate still requires at least three admitted first-party
reports.

## 0.6 implementation: transferable task-time evidence

The current quantitative layer compares bounded tasks and workflows, not
organization categories. Evidence from an AI company, research laboratory,
university, public administration, independent practice, or small business may
inform another context only when the task contract, automation mechanism,
prerequisites, and acceptance threshold are comparable. Organization type is a
context overlay for scale, law, governance, data, procurement, and control
requirements. It is not the benchmark unit.

The implementation preserves the existing seven use patterns, three work
modes, four architecture choices, A0 to A4 action scale, R0 to R3 impact scale, Swiss and EU
routing, progressive interface, lifecycle, controls, dossier, and worked cases.
The cases are normalized as applications of transferable mechanisms rather
than discarded or rewritten from scratch.

The three operational modes remain distinct:

1. copilot: AI prepares, suggests, retrieves, or analyzes while a person
   operates every cycle, generally at A0 or A1;
2. bounded automation: AI completes an explicitly eligible process with
   authorized tools and escalates exceptions, generally from A1 to A3;
3. strong automation: long-horizon work uses several tools or agents, may run in
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
local human work = preparation + supervision + verification
                   + corrections + exceptions
human time with AI = max(adjusted source residual, local human work)
                     + work absent from both + local amortized setup
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
2. partially compatible: keep the range usable as a starting point, expose the
   differences, and label the result for local verification;
3. context only: retain the mechanism or reported outcome without transferring
   a human-time ratio;
4. incompatible: do not transfer the quantitative result when the underlying
   task itself is too different.

A percentage is never transferred merely because two organizations share a
sector or size. Conversely, a source from a different organization type is not
excluded when the task and evaluation contract are genuinely comparable.

### Evidence grades

Quantitative records must expose their source and use one evidence grade:

- A: controlled or paired measurements with actual task-time logs;
- B: field telemetry or other objective operational measurements;
- C: self-reported time or survey estimates;
- D: published case or capability test without independently validated human-time comparison;
- E: model-estimated, synthetic, or planning-only value.

Grades describe the measurement basis, not whether the result is favorable.
Public and supplier evidence seeds the hypothesis layer of 0.3. It remains
distinct from the observed layer required by the first-party admission contract.

### Implementation state

1. `task-time-evidence.v1.json` and its strict JSON Schema contain ten task
   profiles, nineteen external evidence records, evidence grades A to E, and the
   classification of all eleven worked cases.
2. The pure transfer engine compares task profile, work mode, architecture,
   exact A0 to A4 action boundary, output state, and operator experience. A
   comparable measured task remains quantitatively usable across the other
   dimensions with visible warnings; only a different task profile blocks the
   transfer. Measured slowdowns stay negative and context-only sources remain
   outside the automatic calculation.
3. The progressive calculator exposes one task, one evidence anchor, and one
   complete human-time account. Preparation, supervision, verification,
   corrections, expected exception work, and amortized setup remain editable.
4. The engine now produces a net low, central, and high range. For each source
   point it retains the greater of adjusted source-implied residual human time and the
   declared local human-work floor, then adds work absent from both and local amortized setup. The unadjusted
   source range remains visible and neither result is presented as pilot evidence.
   At zero eligible cases the net range is unavailable, source and local
   provenance labels remain distinct, and the copied pilot brief preserves the
   complete human-work and setup contract for reproduction.
   Whole-workload percentages use the complete baseline human hours, not the
   share of cases. Eligible cases, eligible human hours, and complete workload
   hours remain visible separately, and a contradictory denominator blocks the
   whole-workload calculation.
5. Every worked-case result is explicitly classified as a grade E planning
   hypothesis. External records may remain attached as separate context without
   upgrading the synthetic result.
6. No `time_scenario` was added to the project dossier. The calculator keeps
   its editable scenario while switching routes and languages, but it does not
   turn a demonstration into an authorized project record. A future additive
   migration may store an explicitly frozen scenario.
7. Source, calculation, editorial, JSON, TypeScript, accessibility, responsive,
   palette, and browser checks pass on the current release candidate. Two
   independent journey audits drive the exact-head merge gate and must remain
   separate from the known first-party field-data limitation.
8. The 0.3 field draft now consumes the same quantitative layer. It preserves
   the low, central, and high hypothesis, source or local basis, transfer
   contract, observed whole-workload result, range position, and recalibration
   boundary in both routes.
9. The evidence selector now begins with a non-technical verdict, a short
   account of what was observed, and an explicit statement of whether the
   figure enters the estimate. Grades A to E and the complete methodology stay
   available through optional explanations in both routes.
10. Real-decision exports now preserve the use pattern, territory, frozen
    system and workflow version, work mode, architecture, and exact action
    boundary. The operating card additionally requires named owners, a dated
    review, a tried manual fallback, and a rehearsed suspension and containment
    procedure. Demonstration calculations remain freely available without
    those real-evidence fields.
11. The six case-specific evidence notes now follow the selected route. A route
    no longer opens evidence text written for the other route.
12. Every frozen planning hypothesis receives an immutable configuration ID.
    Observations, the field draft, the evidence memo, and the operating card
    can refer only to the explicitly confirmed frozen configuration. Any change
    to the context, design, system version, or calculation requires a separate
    recalibration snapshot before the result can authorize another action.
13. Topic navigation updates the deep link, and a language change preserves the
    current topic, calculator, snapshots, observations, field draft, owners,
    review date, and tested fallback and containment controls.
14. Repeated organization, use-pattern, work-mode, architecture, action-boundary,
    territory, and sector labels are checked automatically against the GitHub
    intake so a reader sees the same choice name throughout the journey.

This quantitative evidence and transfer layer now feeds 0.3 directly. The field
draft retains its source, transfer contract, net range, human-work assumptions,
observed whole-workload result, and position against the range. It is not a new
organization track and it does not require rebuilding the playbook. The
remaining 0.3 gate is field confirmation, not extrapolation work left undone.

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

Latest local verification on 2026-09-08 after the dependency refresh:

- clean `npm ci`: pass; npm audit at the moderate threshold: zero vulnerabilities
- ESLint: pass
- TypeScript 6.0.3: pass
- server and static builds: pass
- Node tests: 62/62 pass
- Playwright in Chrome: 126/126 pass, no retries, across both routes, desktop light, desktop dark, and
  mobile light
- automated axe checks: zero violations
- repository validation: 123 Markdown files and 49 paired documents pass
- source-discovery regression: 1/1 pass; CI now runs it before repository validation
- task-time and control-crosswalk JSON Schema validation: pass

Generated browser reports are excluded from source-document validation, and
dependency/generated directories are pruned before discovery. No artifacts
were deleted to hide validation errors. The existing build warning about a
client bundle above 500 kB remains non-blocking; this update does not claim to
resolve application code-splitting. The September 8 dependency-only correction
is recorded above; vulnerability auditing remains part of the CI workflow.

The verification contract covers:

- ESLint and strict TypeScript compilation;
- the Vinext server build and provider-neutral static export;
- 62 Node tests for accessibility semantics, decision logic, task-time transfer,
  rendered HTML, controls, GEO content, and all 14 exported routes;
- 126 Playwright checks across both routes, desktop light, desktop dark, and
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
- Use pattern is not work mode. Work mode is not architecture, and neither one
  defines the exact A0 to A4 action boundary.
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
