# AI Adoption Playbook — handoff

Snapshot: 2026-08-19 (Europe/Zurich)

## Status

The current reference version is implemented, validated, pushed, and deployed.
There is no unfinished implementation hidden behind this handoff.

- Canonical repository: `Musyg/ai-adoption-playbook`
- Canonical branch: `agent/add-visual-playbook`
- Reference implementation commit: `2389ac797e3076abb79703dde9e3c97a44293da5`
- Handoff document commit: the commit containing this file.
- Canonical site source: `site/`
- Local Sites publishing mirror: `work/sites-source/`
- Publishing-mirror branch: `main`
- Publishing-mirror commit: `331785f41b3df95d4cc67ab9a78e19bc9d631d2e`
- Both worktrees were clean and equal to their remotes at this snapshot.

The publishing mirror is not a second source of product truth. Make changes in
the canonical repository first, validate them there, then copy only the intended
site files into the mirror for Sites publication.

## Production

- Live URL: <https://ai-adoption-playbook.gimu84.chatgpt.site>
- French route: <https://ai-adoption-playbook.gimu84.chatgpt.site/fr/>
- Sites project: `appgprj_6a841ee3465c819189931388f30b54d6`
- Current Sites version: `15`
- Version ID: `appgprj_6a841ee3465c819189931388f30b54d6~appgver_9e323752c874819185126f8fa27233b1`
- Source commit used by Sites: `331785f41b3df95d4cc67ab9a78e19bc9d631d2e`
- Archive content hash: `sha256:a764a2e8b22c821df0d6036ac59dcb12a6729db2d85822a9f451c607e26b2e68`
- Deployment ID: `appgdep_6a84ebb29a348191a10c6f086fa6f55f`
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
6. export a reviewable Markdown decision dossier.

The sticky decision rail exposes the five operational stages: Calibrate, Pilot,
Decide, Operate, and Hand off. On small screens it becomes a keyboard-accessible
horizontal rail. The primary hero action now starts at the integration-level
distinction instead of jumping past the new workflow.

The worked material includes an independent-professional copilot, a bounded
business agent, an orchestrated-agency analogy, a TPE customer-request case, and
an SME/PME A2 business agent for B2B quotes. The SME case makes its low, central,
and high assumptions calculable; separates eligible-work gains from the global
denominator; distinguishes survey, empirical-copilot, and provider-case evidence;
and keeps all prices behind explicit approval. The numerical ranges are planning
envelopes and the cases are synthetic; neither is presented as a universal
forecast or field proof.

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

The pure gate function is in `site/app/evidence-decision.mjs`. The interactive
page is in `site/app/Playbook.tsx`, and the visual system is in
`site/app/globals.css`.

## Latest validation

The following checks passed on the canonical source and again on the publishing
mirror where applicable:

- ESLint: clean.
- Vinext production build: successful for `/` and `/fr`.
- Gate-decision unit tests: 4/4 passed.
- Rendered bilingual HTML tests: 2/2 passed.
- Combined publishing-mirror test run: 6/6 passed.
- Repository validation: 43 Markdown files and register contract passed.
- Browser audit: 1440 × 900 and 390 × 844, including the new SME case.
- Browser structure: no duplicate IDs, no unnamed visible controls, and no page
  overflow at either audited viewport.
- New SME rendered assertions cover the A2 level, 60.8–129.2 hour envelope,
  76-to-27-minute observation, 163/238 correction denominator, approximately
  45% portfolio ceiling, 0% autonomous completion, and evidence-class boundary.
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
node --test tests/evidence-decision.test.mjs tests/rendered-html.test.mjs
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
- The roadmap still lacks worked examples for nonprofit/foundation and
  public-sector tracks, plus the planned machine-readable control crosswalk.

## First authorized next step

The implementation is complete. The next session should first open Sites version
15 while signed in and collect one bounded list of editorial or visual defects.
Do not change access mode, architecture, claims, or deploy another version without
a new user request.

If the reference version is accepted without defects, resume roadmap `0.2` with
one missing worked case at a time. The recommended next content task is the
nonprofit/foundation case, followed by public sector. Keep every case synthetic,
source-labelled, denominator-aware, and explicit about transfer limits.

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
