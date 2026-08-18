# AI Adoption Playbook — handoff

Snapshot: 2026-08-19 (Europe/Zurich)

## Status

The current reference version is implemented, validated, pushed, and deployed.
There is no unfinished implementation hidden behind this handoff.

- Canonical repository: `Musyg/ai-adoption-playbook`
- Canonical branch: `agent/add-visual-playbook`
- Reference implementation commit: `41b4fccb3487cf5bcef26c5b07a93947ed9f22e9`
- Handoff document commit: the commit containing this file.
- Canonical site source: `site/`
- Local Sites publishing mirror: `work/sites-source/`
- Publishing-mirror branch: `main`
- Publishing-mirror commit: `5036074ab41ff37381e4f75e2f95f830f2d69e9d`
- Both worktrees were clean and equal to their remotes at this snapshot.

The publishing mirror is not a second source of product truth. Make changes in
the canonical repository first, validate them there, then copy only the intended
site files into the mirror for Sites publication.

## Production

- Live URL: <https://ai-adoption-playbook.gimu84.chatgpt.site>
- French route: <https://ai-adoption-playbook.gimu84.chatgpt.site/fr/>
- Sites project: `appgprj_6a841ee3465c819189931388f30b54d6`
- Current Sites version: `16`
- Version ID: `appgprj_6a841ee3465c819189931388f30b54d6~appgver_0dbe0351b78c8191b792f4645c87c96c`
- Source commit used by Sites: `5036074ab41ff37381e4f75e2f95f830f2d69e9d`
- Archive content hash: `sha256:a68858e8d3977686669e0b6fba18bb39c1d6233c91d5e38eef3320f6b27adaa0`
- Deployment ID: `appgdep_6a84efc53e648191a30a7e7a10117030`
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
business agent, an orchestrated-agency analogy, a TPE customer-request case, an
SME/PME A2 business agent for B2B quotes, and a foundation A2 agent for grant
dossier administration. The new Fondation Lien Local case keeps telephone and
paper channels open, separates administrative transport from funding judgment,
uses a full 120-application denominator, and makes access, dignity, equity, and
recourse four mission vetoes. Its low, central, and high ranges are calculable;
all funding decisions remain human. The numerical ranges are planning envelopes
and the cases are synthetic; none is presented as a universal forecast or field
proof.

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
- Repository validation: 46 Markdown files and register contract passed.
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
- No new browser-control audit was run for the foundation section. The exact
  canonical and publishing-mirror sources matched byte for byte, and both passed
  lint, production build, and bilingual rendered-HTML tests.
- The roadmap still lacks the public-sector worked example and the planned
  machine-readable control crosswalk.

## First authorized next step

The implementation is complete. The next session should first open Sites version
16 while signed in and collect one bounded list of editorial or visual defects.
Do not change access mode, architecture, claims, or deploy another version without
a new user request.

If the reference version is accepted without defects, resume roadmap `0.2` with
the public-sector worked case. Keep it synthetic, source-labelled,
denominator-aware, explicit about transfer limits, and strict about mandate,
appeal, recordkeeping, procurement, and equality of access.

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
