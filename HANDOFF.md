# AI Adoption Playbook: handoff

Snapshot: 2026-08-20 (Europe/Zurich)

## Current state

- Repository: `Musyg/ai-adoption-playbook`
- Canonical branch: `main`
- Working branch: `feat/ai-use-patterns-ch-eu`
- Release prepared: `0.2.1`
- Visibility: public
- Repository website field: empty
- Public website URL: none
- Static hosting: disabled
- Canonical application source: `site/`
- Provider-neutral static client: `site/static-client/`
- Generated static output: `site/static-dist/`, ignored by Git
- Validation workflow: `.github/workflows/validate.yml`
- Dependency updates: `.github/dependabot.yml`

Repository publication is complete. Any future host selection remains a
separate owner decision.

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
includes editable low/high challenge hypotheses, six
primary-evidence reality checks, eleven synthetic worked cases, pilot
preregistration, evidence gates, reversible operations, decision-dossier
export, field-pilot preparation, five organization paths, four sector overlays,
and a versioned control crosswalk. The selected use pattern and jurisdiction
feed the control filter and exported pilot records. The Markdown guides and
templates remain the operational source of truth.

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

The 0.3 research pass adds a review of 20 public studies,
deployments, benchmarks, official evaluations, and negative results. It removes
the former universal productivity bands from the visual guide. The public
evidence does not support a generic 5x to 12x multiplier on accepted business
outcomes. Those figures may be tested as explicit hypotheses only.

Synthetic examples are not field evidence. `field-notes/index.json` remains
empty until a genuine, independently reviewed and sanitized submission meets
the publication contract. Public third-party studies inform pilot design but do
not satisfy that first-party admission rule. This remains the only open 0.3
roadmap item and does not block publication of the complete 0.2.1 release.

## Hosting-neutral behavior

The default server and static builds declare no production origin. They omit
canonical links, alternate route metadata tied to an origin, `og:url`, and
social images that require an absolute URL. The static export also omits a
sitemap and ships with `noindex, nofollow`.

Only after the owner approves a host may a deployment configure:

- `PUBLIC_SITE_URL`, the approved absolute canonical origin;
- `STATIC_BASE_PATH`, if the application is served below the origin root.

With `PUBLIC_SITE_URL` set, the static finalizer can generate canonical links,
alternate routes, `og:url`, absolute social images, and the sitemap. This
capability is build-time configuration, not a current deployment.

## Validation contract

From `site/`:

```powershell
npm ci
npm run verify
python ../scripts/validate.py
```

Latest local verification on 2026-08-20:

- ESLint: pass
- TypeScript 6.0.3: pass
- server and static builds: pass
- Node tests: 21/21 pass
- Playwright: 27/27 pass across both routes, desktop light, desktop dark, and
  mobile light
- automated axe checks: zero violations
- repository validation: 108 Markdown files and 45 paired documents pass

The verification contract covers:

- ESLint and strict TypeScript compilation;
- the Vinext server build and provider-neutral static export;
- 21 Node tests for accessibility semantics, decision logic, rendered HTML,
  controls, GEO content, and all 14 exported routes;
- 27 Playwright checks across both routes, desktop light, desktop dark, and
  mobile light profiles;
- full-page automated Axe analysis;
- responsive overflow, language, interaction, and hosting-neutrality checks;
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

Do not declare a website URL, enable static hosting, deploy a mirror, or submit
a sitemap without a separate explicit instruction. Public repository visibility
does not authorize hosting.
