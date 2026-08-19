# AI Adoption Playbook: handoff

Snapshot: 2026-08-19 (Europe/Zurich)

## Status

The current reference version is implemented, validated, and merged into `main`.
The repository is private. No public hosting target or website URL is declared.
GitHub Pages was disabled on 19 August 2026 at the owner's request.
The first roadmap 0.3 tranche is complete; the field-feedback publication item
remains intentionally open until a real submission passes review.

- Canonical repository: `Musyg/ai-adoption-playbook`
- Canonical branch: `main`
- Reference implementation commit: `0c02c61b9cd126969e0cfd1a8bcdcc236ec6ec52`
- Handoff document commit: the commit containing this file.
- Canonical site source: `site/`
- Static-export client entry: `site/pages-client/`
- Validation workflow: `.github/workflows/pages.yml`
- Legacy Sites publishing mirror: `work/sites-source/`
- Publishing-mirror branch: `main`
- Publishing-mirror commit: `85a80a08f4350402025cc5d856d60672e2a289eb`
- The reference implementation was clean, merged, and equal to `origin/main`
  before this handoff-only update.

The Sites mirror is not a second source of product truth. Make changes in the
canonical repository first. A merge to `main` validates the application and its
static export, but does not deploy either one. Do not publish or sync a mirror
until the owner has selected and explicitly approved a hosting target.

## Hosting state

- Repository visibility: private
- Repository Website field: empty
- Public website URL: none declared
- GitHub Pages: disabled
- Workflow behavior: build, lint, test, and validate only; no deployment job
- Last historical Pages validation/deployment run: `32260561614`
- Cancelled deployment run during the return to private state: `32263416426`
- Merge path before the private-state correction: PRs `#1` through `#14`
- Legacy Sites mirror: noncanonical and not an approved current host
- Sites project: `appgprj_6a841ee3465c819189931388f30b54d6`
- Current Sites version: `21`
- Version ID: `appgprj_6a841ee3465c819189931388f30b54d6~appgver_ca11992f83608191bf2b7e42168b6fcc`
- Source commit used by Sites: `85a80a08f4350402025cc5d856d60672e2a289eb`
- Archive content hash: `sha256:35850e44a041dfa4af6f9bb0928fff5c9ba64cd06cc24482dde9faee4c8dafc5`
- Deployment ID: `appgdep_6a85865b511481918fc9e663f99aada4`
- Historical deployment state: `succeeded`
- Current publication authority: none. Do not expose the legacy mirror or treat
  its historical deployment state as a current release.

Never persist a Sites source-repository token. Generate a fresh short-lived
credential for each later publishing session and use per-command Git
authentication.

## What the reference version contains

The web experience is bilingual and follows one explicit decision chain:

1. distinguish a copilot, a bounded business agent, and an orchestrated agency;
2. calibrate a planning range against the real workflow;
3. preregister a bounded pilot and its acceptance thresholds;
4. enter observed evidence and obtain one of four gate outcomes;
5. translate the gate into a reversible operating state;
6. resolve organization, impact, and autonomy to a versioned control set;
7. export a reviewable Markdown decision dossier.

The sticky decision rail exposes six operational stages: Calibrate, Pilot,
Decide, Operate, Hand off, and Field test. On small screens it becomes a
keyboard-accessible horizontal rail. The primary hero action starts at the
integration-level distinction, while a second action opens the field-pilot
assistant directly.

The worked material includes an independent-professional copilot, a bounded
business agent, an orchestrated-agency analogy, a TPE customer-request case, an
SME/PME A2 business agent for B2B quotes, and a foundation A2 agent for grant
dossier administration, plus a public-service A2 agent for planning dossiers.
The Fondation Lien Local case keeps telephone and paper channels open and makes
access, dignity, equity, and recourse four mission vetoes. The new City of
Mont-Rive case keeps public authority visible through formal gates P0–P5,
preserves counter, post, and assisted channels, makes its low case fail the
economic gate, and keeps every planning decision human. Both cases use full
intake denominators and distinguish administrative transport from judgment.
The numerical ranges are planning envelopes and the cases are synthetic; none
is presented as a universal forecast or field proof.

The new machine-readable crosswalk publishes 20 stable control IDs, 19 evidence
types, and nine dated source records under `site/public/data/`. A JSON Schema
fixes contract version `1.0.0`; the repository validator checks uniqueness,
references, applicability axes, gates, lifecycle phases, and implementation
paths. The bilingual interface filters candidate controls by the selected
organization and R×A profile while keeping conditional triggers visible. Its
source relations are deliberately thematic, not clause-level equivalence,
certification, or legal-compliance claims.

Roadmap 0.2 is complete. Six operating guides, eight copy-ready templates, and
six organization-track files now have explicit one-to-one English/French pairs.
The language-neutral CSV register remains shared. The English README and web
experience link to the English artifacts; the French README and `/fr` route keep
their French links. Repository validation treats all 31 current pairs as a
required contract and rejects English operating files that fall back to
`.fr.md` links.

The first roadmap 0.3 tranche adds four bilingual sector overlays: healthcare,
education, finance, and critical infrastructure. Each keeps the universal
process intact while adding sector triggers, non-transferable vetoes, a default
autonomy ceiling, minimum evidence, and an explicit transfer boundary. Three
new bilingual tools cover accessibility, fundamental-rights impact, and field
feedback. The field registry is valid but empty: synthetic examples and
unreviewed submissions cannot be presented as field evidence. Repository links
from the application target the canonical `main` branch.

The new bilingual field-pilot assistant frames an organization, integration
level, sector, non-identifying alias, exact workflow, version, observation
period, and transfer limits. It reuses the evidence gate only after the user
explicitly confirms that demonstration values were replaced with observations,
checks six publication safeguards, and downloads a local Markdown draft. The
site sends none of these inputs to a server, and the export always remains a
draft pending independent review and a separate admission decision. The paired
Markdown protocol makes the same boundary available outside the web interface.
The application and contribution guides link to locale-specific repository
pilot-intake forms that accept non-identifying coordination metadata only.
`CONTRIBUTING.md` and `CONTRIBUTING.fr.md`, the field-pilot issue forms, and the
field-report pull-request templates each keep one language per artifact. The
report templates remain reserved for independently reviewed, sanitized field
reports; raw evidence never belongs in GitHub.

The visual system now follows the portfolio surface rule: blue remains an accent
for orientation, progress, focus, borders, and small indicators, but is not used
as a large section, panel, decision-band, or button background. Neutral paper,
surface, and ink layers carry the hierarchy. Primary and secondary actions have
explicit normal, hover, active, and focus states in both color schemes. The
field-pilot handoff uses a balanced two-column action grid on desktop, two action
columns below 980 px, and one below 680 px.

The English and French static exports contain the complete playbook in the
initial HTML and hydrate it for interaction. The export architecture supports
indexable content without requiring JavaScript. Route titles, descriptions,
language alternates, social metadata, structured data, and the bilingual sitemap
are implemented, but their final canonical origin must be configured only after
a host is selected. The opening sequence also includes a short, plain-language
explanation of who the guide serves and which decision it helps make. The visible
application and primary README contain no em dash characters.

The first GEO content cluster adds six focused questions in both English and
French, for 12 independently shareable article routes. It covers integration
choice, realistic ROI, pilot design, agent governance, orchestrated agencies,
and a worked SME quote-agent example. Every article opens with a direct answer,
then provides three takeaways, a comparison table, a bounded example, three
identified sources, related guides, a locale switch, and a return to the full
playbook. The home routes link to all six local guides, so discovery does not
depend on the sitemap alone. Detail routes use their own canonical, language,
Open Graph, Twitter, `Article`, and `BreadcrumbList` metadata. They deliberately
omit the generic home-page social image because no route-specific image exists.
The generated sitemap covers all 14 planned routes. It is a build artifact, not
evidence that those routes are currently published.

## Decision and evidence rules

- A productivity percentage applies only to eligible work, not automatically to
  the whole workload.
- A planning range is not a forecast. Replace assumptions with observations in
  the pilot.
- Incomplete sample or trace evidence is `unknown`, not a failure and not a pass.
- A critical or unauthorized effect overrides value and quality and produces
  `stop`.
- Production remains bounded, reversible, version-specific, and subject to a
  dated reassessment.
- The exported dossier contains a readable decision summary, not raw client data,
  secrets, or uncontrolled evidence copies.
- An orchestrated agency must earn its added complexity against a simpler design;
  the playbook does not treat multi-agent architecture as the default.
- A filtered control list remains conditional guidance. A qualified person must
  decide whether each trigger and applicable legal requirement is present.

The pure gate function is in `site/app/evidence-decision.mjs`. The interactive
page is in `site/app/Playbook.tsx`, and the visual system is in
`site/app/globals.css`.

## Latest validation

The following checks passed on the canonical source and in GitHub Actions.
References to deployed routes below are historical verification records from
before public hosting was disabled; they do not describe current availability.

- ESLint: clean.
- Vinext production build: successful for `/` and `/fr`.
- Gate-decision unit tests: 4/4 passed.
- Control-crosswalk contract tests: 3/3 passed.
- Rendered bilingual HTML tests: 2/2 passed.
- GitHub Pages artifact tests: 3/3 passed.
- GEO content and route tests: 3/3 passed across all 12 article routes.
- Combined Node test run: 15/15 passed.
- Repository validation: 93 Markdown files, 31 EN/FR pairs, AI register,
  field-feedback registry, and control-crosswalk contracts passed.
- JSON Schema 2020-12 validation passed for 20 controls, 19 evidence types, and
  nine source records.
- Previous browser audit: 1440 × 900 and 390 × 844, through the SME case.
- That earlier browser audit found no duplicate IDs, unnamed visible controls,
  or page overflow at either audited viewport.
- New SME rendered assertions cover the A2 level, 60.8–129.2 hour envelope,
  76-to-27-minute observation, 163/238 correction denominator, approximately
  45% portfolio ceiling, 0% autonomous completion, and evidence-class boundary.
- New foundation rendered assertions cover the A2 boundary, 23.8–53.8 hour
  envelope, 96-to-39-minute observation, 58/86 correction denominator,
  approximately 39% portfolio ceiling, 100% human funding decisions, four
  mission vetoes, and the sector-evidence boundary.
- New public-service rendered assertions cover Mont-Rive, formal gates P0–P5,
  the 39.2–106.5 hour envelope, 145-to-58-minute observation, 121/166 correction
  denominator, approximately 35% portfolio ceiling, 100% human public decisions,
  a deliberately non-viable low case, and three external evidence classes.
- New control-crosswalk rendered assertions cover the bilingual section,
  stable control and evidence IDs, source references, JSON/schema links,
  and the explicit non-equivalence boundary.
- New locale-link assertions verify that `/` exposes the English mandate,
  evaluation plan, incident runbook, and organization track, while `/fr`
  exposes their French counterparts.
- New sector assertions cover the four bilingual overlays, their explicit
  non-transferable-veto boundary, and the three new assessment/report tools.
- New field-pilot assertions cover the local-only boundary, demonstration-value
  confirmation, publication review, draft export, and locale-correct protocol
  links.
- GitHub Pages assertions cover the English and French documents, repository
  base path, copied JSON/schema and visual assets, absence of the Vinext runtime,
  interactive client bundle, public pilot-intake link, and initial-anchor logic.
  They also require pre-rendered content, canonical and alternate-language links,
  structured data, the bilingual sitemap, and the absence of loading-shell text,
  development URLs, and em dash characters.
- Keyboard audit: skip link, header navigation, language switch, five-step rail,
  and hero actions expose visible focus.
- Interaction audit: the agency scenario produced `80–92%`; passing evidence
  produced `CONTINUER BORNÉ`; one critical effect produced
  `ARRÊTER + ROLLBACK`; naming both owners produced `DOSSIER RÉVISABLE` with zero
  missing items.
- The final pre-disable real-Chrome audit of the French Pages route confirmed
  `lang="fr"`, French-only rendered contribution copy, the French
  `field-pilot-fr.yml` intake link, zero horizontal overflow, and neutral
  `#field-pilot` section/background surfaces. Elements retaining `#1c9fff` as a
  background were limited to thin progress/workflow indicators.
- The same Chrome session confirmed primary hover from light-on-dark to
  transparent-with-light-text, and secondary hover from transparent-with-light-
  text to light-with-dark-text, both with a visible border and `translateY(-2px)`.
  The English route rendered `lang="en"`, no French pilot CTA, and the dedicated
  `field-pilot-en.yml` intake link.
- Pre-disable HTTP checks returned `200` for the English route, French route, JSON
  crosswalk, and hashed client bundle. The deployed HTML contains no `/_next/`
  server-runtime path.
- Pre-disable HTTP checks on deployment run `32258123723` returned `200` for the
  English route, French route, and sitemap. Both HTML documents contained the
  pre-render marker, locale-correct discovery metadata, structured data, and the
  plain-language summary, with no `localhost` URL or em dash character.
- Pre-disable HTTP checks on deployment run `32260561614` returned `200` for the
  French home route, the paired French and English integration guides, the
  French ROI guide, and the 14-URL sitemap. The home route exposed the new
  internal links. Each checked article contained its direct answer, canonical,
  language alternates, pre-rendered body, and `Article` structured data, with no
  inherited social image, development URL, or em dash character.

From `site/`, use a supported Node.js runtime and run:

```powershell
npm run lint
npm test
python ../scripts/validate.py
```

On the snapshot machine, Node/npm were not on the default PowerShell `PATH`.
Resolve the bundled Codex workspace runtime instead of copying an old runtime
hash from another session.

## Known boundaries

- There is no current website release. The repository is private, GitHub Pages
  is disabled, and the validation workflow has no deployment permission or job.
- The static-export implementation still contains the former provisional Pages
  origin in canonical metadata and tests. Treat it as build configuration debt,
  not as a declared website URL. Replace it with the selected production origin
  before any future deployment.
- The export pre-renders the complete English and French guide. JavaScript is
  required for calculators, evidence inputs, and local draft generation, but not
  for reading the static content.
- Publishing focused pages would make them eligible for discovery but would not
  prove indexation, ranking, or citation by an answer engine. Do not submit a
  sitemap or claim search visibility before a host and canonical origin exist.
- The legacy Sites mirror is not an approved current host. Do not expose, sync,
  or describe it as a fallback unless the owner explicitly reauthorizes it.
- The operating review dates and the playbook snapshot date are explicit
  reference data. Review them before presenting a later release as current.
- The final historical Pages run passed but emitted non-blocking Node 20
  deprecation annotations for GitHub-maintained action majors that GitHub forced
  to Node 24. The current workflow validates only and does not upload or deploy a
  Pages artifact.
- The sector and legal-orientation sources were checked on 19 August 2026. They
  remain orientation material, not legal, clinical, financial, educational, or
  critical-infrastructure certification.
- `field-notes/index.json` contains zero reports. This is an honest publication
  boundary, not evidence that the method has already been validated in the field.

## First authorized next step

Keep the repository private. Before any discovery work, the owner must choose a
hosting provider and canonical origin, then explicitly authorize deployment.
Only after that decision should the code replace the provisional origin, publish
the site, verify both languages, and submit the resulting sitemap to search
engines. Do not infer hosting approval from ordinary content or repository work.

For product evidence, recruit one genuine pilot, complete the local draft, and
review consent, provenance, redaction, limitations, and transferability against
the publication contract. Admit it to `field-notes/index.json` only if it passes.
If no real submission exists, keep the registry empty. Do not invent a field
report, change access mode, or broaden legal claims.

## Resume checklist

1. Read this file and `ROADMAP.md` before editing.
2. Verify the canonical branch, commit, remote divergence, and clean worktree.
3. Treat `site/` as canonical, `site/pages-client/` as the static-export entry, and
   `work/sites-source/` as a legacy fallback mirror only.
4. Preserve the distinction between copilot, business agent, and orchestrated
   agency throughout copy, calculations, and examples.
5. Re-run lint, build, unit tests, rendered tests, and proportional browser checks.
6. Use a reviewed PR to merge canonical changes into `main`.
7. Verify that the workflow remains validation-only and that Pages stays
   disabled. Do not publish or sync a mirror without explicit authorization.
8. Update this handoff after every material, independently verified advancement.
