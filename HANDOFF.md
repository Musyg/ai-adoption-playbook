# AI Adoption Playbook: handoff

Snapshot: 2026-08-19 (Europe/Zurich)

## Current state

- Repository: `Musyg/ai-adoption-playbook`
- Canonical branch: `main`
- Release prepared: `0.2.0`
- Visibility: private
- Repository website field: empty
- Public website URL: none
- Static hosting: disabled
- Canonical application source: `site/`
- Provider-neutral static client: `site/static-client/`
- Generated static output: `site/static-dist/`, ignored by Git
- Validation workflow: `.github/workflows/validate.yml`
- Dependency updates: `.github/dependabot.yml`

No publication or hosting change is authorized by this handoff. A future host
selection is a separate owner decision.

## What is ready

The repository contains a bilingual, interactive decision path from integration
choice to a bounded operating handoff. It keeps three systems distinct:

1. a copilot, where a person operates every cycle;
2. a bounded business agent, where the system completes eligible cases and
   escalates exceptions;
3. an orchestrated agency, where specialist agents coordinate under shared
   controls and must outperform a simpler design.

The visual application includes realistic planning ranges, seven synthetic
worked cases, pilot preregistration, evidence gates, reversible operations,
decision-dossier export, field-pilot preparation, five organization paths, four
sector overlays, and a versioned control crosswalk. The Markdown guides and
templates remain the operational source of truth.

Synthetic examples are not field evidence. `field-notes/index.json` remains
empty until a genuine, independently reviewed and sanitized submission meets the
publication contract.

## Hosting-neutral behavior

The default server and static builds declare no production origin. They omit
canonical links, language alternates tied to an origin, `og:url`, and social
images that require an absolute URL. The static export also omits a sitemap and
ships with `noindex, nofollow`.

Only after the owner approves a host may a deployment configure:

- `PUBLIC_SITE_URL`, the approved absolute canonical origin;
- `STATIC_BASE_PATH`, if the application is served below the origin root.

With `PUBLIC_SITE_URL` set, the static finalizer can generate canonical links,
English and French alternates, `og:url`, absolute social images, and the
bilingual sitemap. This capability is build-time configuration, not a current
deployment.

## Validation contract

From `site/`:

```powershell
npm ci
npm run verify
python ../scripts/validate.py
```

The verification contract covers:

- ESLint and strict TypeScript compilation;
- the Vinext server build and provider-neutral static export;
- 18 Node tests for accessibility semantics, decision logic, rendered HTML,
  controls, GEO content, and all 14 exported routes;
- 12 Playwright checks across English, French, desktop light, desktop dark, and
  mobile light profiles;
- full-page automated Axe analysis;
- responsive overflow, language, interaction, and hosting-neutrality checks;
- repository structure, bilingual pairs, links, register contracts, crosswalk
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

## Next authorized decision

Present the final private-repository audit to the owner. Do not change visibility,
declare a website URL, enable static hosting, deploy a mirror, or submit a
sitemap. Those actions require a later, explicit instruction after the owner has
accepted the repository result.
