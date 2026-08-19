# AI Adoption Playbook — handoff

Snapshot: 2026-08-19 (Europe/Zurich)

## Status

The current reference version is implemented, validated, merged into `main`,
and publicly deployed through GitHub Pages.
The first roadmap 0.3 tranche is complete; the field-feedback publication item
remains intentionally open until a real submission passes review.

- Canonical repository: `Musyg/ai-adoption-playbook`
- Canonical branch: `main`
- Reference implementation commit: `9ebef93be09b6e03632ecbc284e14c5edffabcfa`
- Handoff document commit: the commit containing this file.
- Canonical site source: `site/`
- GitHub Pages client entry: `site/pages-client/`
- GitHub Pages workflow: `.github/workflows/pages.yml`
- Legacy Sites publishing mirror: `work/sites-source/`
- Publishing-mirror branch: `main`
- Publishing-mirror commit: `85a80a08f4350402025cc5d856d60672e2a289eb`
- The reference implementation was clean, merged, and equal to `origin/main`
  before this handoff-only update.

The Sites mirror is not a second source of product truth. Make changes in the
canonical repository first. A merge to `main` now builds and deploys GitHub Pages
automatically; sync the Sites mirror only if the authenticated fallback must also
be refreshed.

## Production

- Canonical public URL: <https://musyg.github.io/ai-adoption-playbook/>
- Canonical French route: <https://musyg.github.io/ai-adoption-playbook/fr/>
- Pages source: GitHub Actions workflow from `main`
- Verified workflow run: <https://github.com/Musyg/ai-adoption-playbook/actions/runs/32250045693>
- Deployment result: successful, public, HTTPS enforced
- Merge path: PRs `#1`, `#2`, `#3`, and `#4`
- Authenticated Sites fallback: <https://ai-adoption-playbook.gimu84.chatgpt.site>
- Sites project: `appgprj_6a841ee3465c819189931388f30b54d6`
- Current Sites version: `21`
- Version ID: `appgprj_6a841ee3465c819189931388f30b54d6~appgver_ca11992f83608191bf2b7e42168b6fcc`
- Source commit used by Sites: `85a80a08f4350402025cc5d856d60672e2a289eb`
- Archive content hash: `sha256:35850e44a041dfa4af6f9bb0928fff5c9ba64cd06cc24482dde9faee4c8dafc5`
- Deployment ID: `appgdep_6a85865b511481918fc9e663f99aada4`
- Deployment state: `succeeded`
- Sites fallback access: private/custom; visitors may need to continue with
  ChatGPT. GitHub Pages is the public reference.

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
their French links. Repository validation treats all 30 current pairs as a
required contract and rejects English operating files that fall back to
`.fr.md` links.

The first roadmap 0.3 tranche adds four bilingual sector overlays: healthcare,
education, finance, and critical infrastructure. Each keeps the universal
process intact while adding sector triggers, non-transferable vetoes, a default
autonomy ceiling, minimum evidence, and an explicit transfer boundary. Three
new bilingual tools cover accessibility, fundamental-rights impact, and field
feedback. The field registry is valid but empty: synthetic examples and
unreviewed submissions cannot be presented as field evidence. Repository links
from the deployed site target the canonical `main` branch.

The new bilingual field-pilot assistant frames an organization, integration
level, sector, non-identifying alias, exact workflow, version, observation
period, and transfer limits. It reuses the evidence gate only after the user
explicitly confirms that demonstration values were replaced with observations,
checks six publication safeguards, and downloads a local Markdown draft. The
site sends none of these inputs to a server, and the export always remains a
draft pending independent review and a separate admission decision. The paired
Markdown protocol makes the same boundary available outside the web interface.
The site and `CONTRIBUTING.md` link to a public GitHub pilot-intake form that
accepts non-identifying coordination metadata only. A separate pull-request
template is reserved for independently reviewed, sanitized field reports; raw
evidence never belongs in GitHub.

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

The following checks passed on the canonical source and in GitHub Actions:

- ESLint: clean.
- Vinext production build: successful for `/` and `/fr`.
- Gate-decision unit tests: 4/4 passed.
- Control-crosswalk contract tests: 3/3 passed.
- Rendered bilingual HTML tests: 2/2 passed.
- GitHub Pages artifact tests: 3/3 passed.
- Combined Node test run: 12/12 passed.
- Repository validation: 91 Markdown files, 30 EN/FR pairs, AI register,
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
  stable control and evidence IDs, source references, public JSON/schema links,
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
- Keyboard audit: skip link, header navigation, language switch, five-step rail,
  and hero actions expose visible focus.
- Interaction audit: the agency scenario produced `80–92%`; passing evidence
  produced `CONTINUER BORNÉ`; one critical effect produced
  `ARRÊTER + ROLLBACK`; naming both owners produced `DOSSIER RÉVISABLE` with zero
  missing items.
- Final real-Chrome audit of the public French Pages route confirmed
  `lang="fr"`, the portfolio blue `#1c9fff`, 23 buttons, 30 form controls, no
  horizontal overflow, the correct pilot-intake URL, and a visible
  `#field-pilot` heading after direct deep-link navigation.
- Public HTTP checks returned `200` for the English route, French route, JSON
  crosswalk, and hashed client bundle. The deployed HTML contains no `/_next/`
  server-runtime path.

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

- GitHub Pages is a browser-rendered React build and therefore requires
  JavaScript for the interactive content. Its English and French HTML shells
  still publish locale-correct titles, descriptions, social metadata, language
  attributes, and fallback text.
- The Sites fallback remains authentication-protected. Its shared server layout
  serializes `lang="en"`; a synchronous bootstrap and the client correct the
  French route at runtime. The GitHub Pages French shell starts with `lang="fr"`.
- The operating review dates and the playbook snapshot date are explicit
  reference data. Review them before presenting a later release as current.
- The final GitHub Actions run passed but emitted non-blocking Node 20
  deprecation annotations for GitHub-maintained action majors that GitHub forced
  to Node 24. The build, artifact upload, and deployment all completed.
- The sector and legal-orientation sources were checked on 19 August 2026. They
  remain orientation material, not legal, clinical, financial, educational, or
  critical-infrastructure certification.
- `field-notes/index.json` contains zero reports. This is an honest publication
  boundary, not evidence that the method has already been validated in the field.

## First authorized next step

The public GitHub Pages site contains the field-pilot assistant, protocol, and
non-identifying intake route. The next step is operational rather than another
content expansion: recruit one genuine pilot,
complete the local draft, and review consent, provenance, redaction, limitations,
and transferability against the publication contract. Admit it to
`field-notes/index.json` only if it passes. If no real submission exists, keep
the registry empty. Do not invent a field report, change access mode, or broaden
legal claims.

## Resume checklist

1. Read this file and `ROADMAP.md` before editing.
2. Verify the canonical branch, commit, remote divergence, and clean worktree.
3. Treat `site/` as canonical, `site/pages-client/` as the Pages entry, and
   `work/sites-source/` as a legacy fallback mirror only.
4. Preserve the distinction between copilot, business agent, and orchestrated
   agency throughout copy, calculations, and examples.
5. Re-run lint, build, unit tests, rendered tests, and proportional browser checks.
6. Use a reviewed PR to merge canonical changes into `main`.
7. Verify the Pages workflow, public HTTP responses, and real-browser behavior;
   sync Sites only when a fallback update is explicitly needed.
8. Update this handoff after every material, independently verified advancement.
