# AI Adoption Playbook — handoff

Snapshot: 2026-08-19 (Europe/Zurich)

## Status

The current reference version is implemented, validated, pushed, and deployed.
There is no unfinished implementation hidden behind this handoff.

- Canonical repository: `Musyg/ai-adoption-playbook`
- Canonical branch: `agent/add-visual-playbook`
- Reference implementation commit: `8a2bfa57472cbf9ef708e50db045fee2f516af6a`
- Handoff document commit: the commit containing this file.
- Canonical site source: `site/`
- Local Sites publishing mirror: `work/sites-source/`
- Publishing-mirror branch: `main`
- Publishing-mirror commit: `598ffcd7919d61c0c6723be1a4c2876a16d5ca42`
- Both worktrees were clean and equal to their remotes at this snapshot.

The publishing mirror is not a second source of product truth. Make changes in
the canonical repository first, validate them there, then copy only the intended
site files into the mirror for Sites publication.

## Production

- Live URL: <https://ai-adoption-playbook.gimu84.chatgpt.site>
- French route: <https://ai-adoption-playbook.gimu84.chatgpt.site/fr/>
- Sites project: `appgprj_6a841ee3465c819189931388f30b54d6`
- Current Sites version: `18`
- Version ID: `appgprj_6a841ee3465c819189931388f30b54d6~appgver_bb074312f790819180e414c7e387d7dd`
- Source commit used by Sites: `598ffcd7919d61c0c6723be1a4c2876a16d5ca42`
- Archive content hash: `sha256:acbd579f40668a3de11ce3817b84e6c189ff2fb4623958615b176dd98f970377`
- Deployment ID: `appgdep_6a84fcc8a7ec81918bc0e3f0465d4ae4`
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
- Repository validation: 50 Markdown files, AI register, and control-crosswalk
  contracts passed.
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
- Markdown operating tracks currently exist in French only. The English web
  experience does not mean every underlying guide has an English file.
- No new browser-control audit was run for the foundation, public-service, or
  control-crosswalk sections. The eight intended site files matched between the
  canonical and publishing-mirror sources, and both passed lint, production
  build, and all nine tests.
- Bilingual worked examples cover every organization track, and the machine-
  readable control crosswalk is implemented. Roadmap 0.2 now lacks only the
  complete English operating-guide translation.

## First authorized next step

The implementation is complete. The next session should first open Sites version
18 while signed in and collect one bounded list of editorial or visual defects.
Do not change access mode, architecture, claims, or deploy another version without
a new user request.

If the reference version is accepted without defects, resume roadmap `0.2` with
the remaining English operating-guide translations. Preserve the French source
files, add one English counterpart at a time, keep links explicit, and do not
claim roadmap `0.2` complete until every operating guide and organization track
has a validated English file.

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
