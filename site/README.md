# AI Adoption Playbook: visual site

The bilingual site turns the repository’s adoption method into an interactive,
audience-specific path. It preserves the Musyg portfolio identity and keeps the
full operational templates in the repository as the source of truth.

Requires Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Run the complete local verification before proposing a merge:

```bash
npm run verify
python ../scripts/validate.py
```

`npm run verify` checks lint, TypeScript, both production builds, 20 Node tests,
and 18 Playwright checks across English, French, desktop, dark mode, and mobile.
Install Chromium once with `npx playwright install chromium` when the local
Playwright browser is not already present.

## Provider-neutral static export

```bash
npm run build:static
npm run preview:static
```

The export is written to `static-dist/`. Without configuration it uses
`noindex, nofollow`, omits canonical URLs, language alternates, `og:url`, and the
sitemap, and contains no provider-specific deployment artifact.

Set `PUBLIC_SITE_URL` only after a production host and canonical origin have
been approved. Set `STATIC_BASE_PATH` only when the chosen host serves the app
below `/`. These variables are intentionally unset in the private repository.

English is served at `/`; French is served at `/fr/`. Both versions include
seven visual worked cases linked to complete bilingual evidence files under
`examples/`: an independent copilot, a micro-business inbox, an SME B2B quote
agent, a foundation grant-dossier administrative agent, a public planning-
dossier administrative agent, an independent A2 business agent, and an
orchestrated-agency analogy.

The control explorer is backed by a public, versioned JSON crosswalk and schema
under `public/data/`. It filters stable controls by the selected organization,
risk, autonomy, AI use pattern, and Swiss or EU route while preserving
conditions, evidence IDs, gate mappings, source versions, and implementation
references.
