# AI Adoption Playbook — handoff

Snapshot: 2026-08-19 (Europe/Zurich)

## Status

The current reference version is implemented, validated, pushed, and deployed.
The first roadmap 0.3 tranche is complete; the field-feedback publication item
remains intentionally open until a real submission passes review.

- Canonical repository: `Musyg/ai-adoption-playbook`
- Canonical branch: `agent/add-visual-playbook`
- Reference implementation commit: `c5f8b778b670eb09175b9181b9c3bf5787e08742`
- Handoff document commit: the commit containing this file.
- Canonical site source: `site/`
- Local Sites publishing mirror: `work/sites-source/`
- Publishing-mirror branch: `main`
- Publishing-mirror commit: `c31aa6d4ca33b791e76e5700a7d51412ef0ccfe2`
- Both worktrees were clean and equal to their remotes at this snapshot.

The publishing mirror is not a second source of product truth. Make changes in
the canonical repository first, validate them there, then copy only the intended
site files into the mirror for Sites publication.

## Production

- Live URL: <https://ai-adoption-playbook.gimu84.chatgpt.site>
- French route: <https://ai-adoption-playbook.gimu84.chatgpt.site/fr/>
- Sites project: `appgprj_6a841ee3465c819189931388f30b54d6`
- Current Sites version: `20`
- Version ID: `appgprj_6a841ee3465c819189931388f30b54d6~appgver_1703df69d1b0819198e6429bfc38c2b0`
- Source commit used by Sites: `c31aa6d4ca33b791e76e5700a7d51412ef0ccfe2`
- Archive content hash: `sha256:b1653b5f3396acafe384591fbf2c2853c4d0e754489351a259f643da62d599e9`
- Deployment ID: `appgdep_6a8578a6d750819197b98d96751a5a7e`
- Deployment state: `succeeded`
- Access mode: private/custom; visitors may need to continue with ChatGPT.

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

The sticky decision rail exposes the five operational stages: Calibrate, Pilot,
Decide, Operate, and Hand off. On small screens it becomes a keyboard-accessible
horizontal rail. The primary hero action now starts at the integration-level
distinction instead of jumping past the new workflow.

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
their French links. Repository validation treats all 29 current pairs as a
required contract and rejects English operating files that fall back to
`.fr.md` links.

The first roadmap 0.3 tranche adds four bilingual sector overlays: healthcare,
education, finance, and critical infrastructure. Each keeps the universal
process intact while adding sector triggers, non-transferable vetoes, a default
autonomy ceiling, minimum evidence, and an explicit transfer boundary. Three
new bilingual tools cover accessibility, fundamental-rights impact, and field
feedback. The field registry is valid but empty: synthetic examples and
unreviewed submissions cannot be presented as field evidence. Repository links
from the deployed site target the real canonical branch rather than an absent
`main` branch.

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

The following checks passed on the canonical source and again on the publishing
mirror where applicable:

- ESLint: clean.
- Vinext production build: successful for `/` and `/fr`.
- Gate-decision unit tests: 4/4 passed.
- Control-crosswalk contract tests: 3/3 passed.
- Rendered bilingual HTML tests: 2/2 passed.
- Combined publishing-mirror test run: 9/9 passed.
- Repository validation: 88 Markdown files, 29 EN/FR pairs, AI register,
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
- Keyboard audit: skip link, header navigation, language switch, five-step rail,
  and hero actions expose visible focus.
- Interaction audit: the agency scenario produced `80–92%`; passing evidence
  produced `CONTINUER BORNÉ`; one critical effect produced
  `ARRÊTER + ROLLBACK`; naming both owners produced `DOSSIER RÉVISABLE` with zero
  missing items.

From `site/`, use a supported Node.js runtime and run:

```powershell
npm run lint
npm run build
node --test tests/*.test.mjs
```

On the snapshot machine, Node/npm were not on the default PowerShell `PATH`.
Resolve the bundled Codex workspace runtime instead of copying an old runtime
hash from another session.

## Known boundaries

- The live site is authentication-protected. The visual and interaction audit
  used the exact local source/build because the automation session reached the
  Sites sign-in gate; Sites then confirmed the saved version and production
  deployment as successful.
- The shared root layout serializes `lang="en"`. A synchronous bootstrap sets
  the runtime document language to `fr` on `/fr` before interaction, and the
  client keeps it synchronized. A fully SSR-native French root language would
  require separate locale root layouts or an equivalent routing change.
- The operating review dates and the playbook snapshot date are explicit
  reference data. Review them before presenting a later release as current.
- No browser-control audit was run for the 0.3 tranche. The four intended site
  files matched byte-for-byte between the canonical and publishing mirror
  sources, and both passed lint, production build, and all nine tests.
- The sector and legal-orientation sources were checked on 19 August 2026. They
  remain orientation material, not legal, clinical, financial, educational, or
  critical-infrastructure certification.
- `field-notes/index.json` contains zero reports. This is an honest publication
  boundary, not evidence that the method has already been validated in the field.

## First authorized next step

Sites version 20 contains the first roadmap 0.3 tranche. The next evidence-backed
step is to obtain one genuine field submission, review its consent, provenance,
redaction, limitations, and transferability against the publication contract,
then admit it to `field-notes/index.json` only if it passes. If no real submission
exists, keep the registry empty and ask for a different product priority. Do not
invent a field report, change access mode, or broaden legal claims.

## Resume checklist

1. Read this file and `ROADMAP.md` before editing.
2. Verify the canonical branch, commit, remote divergence, and clean worktree.
3. Treat `site/` as canonical and `work/sites-source/` as a publishing mirror.
4. Preserve the distinction between copilot, business agent, and orchestrated
   agency throughout copy, calculations, and examples.
5. Re-run lint, build, unit tests, rendered tests, and proportional browser checks.
6. Push the canonical commit before syncing the publishing mirror.
7. Save and deploy only a Sites archive built from the exact pushed mirror commit.
8. Update this handoff after every material, independently verified advancement.
