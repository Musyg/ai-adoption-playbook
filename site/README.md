# AI Adoption Playbook: visual site

The site turns the repository’s adoption method into a progressive,
audience-specific path. Its five-step guided start shows one decision at a
time, adds plain-language help bubbles, and keeps the detailed method in three
closed expert chapters. Topic routers reveal only one part of a chapter at a
time, while a separate case router opens one worked comparison. It preserves
the Musyg portfolio identity and keeps the full operational templates in the
repository as the source of truth.

The complete reading library is available at `/library/` and
`/fr/bibliotheque/`. Its 109 documents are generated from the explicit allowlist
in `app/document-manifest.mjs`, not a recursive repository scan. Original
Markdown stays the single source of truth. Reader pages, tables, section
navigation and language links work without JavaScript; original documents are
downloadable, and a print stylesheet supports PDF output. Internal reports and
handoffs are excluded. Run commands below from this `site` directory, since
server-side source reading resolves the repository root relative to it.

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

`npm run verify` checks lint, TypeScript, both production builds, Node tests,
and Playwright checks across localized routes, desktop, dark mode, and mobile.
Install Chromium once with `npx playwright install chromium` when the local
Playwright browser is not already present.

## Provider-neutral static export

```bash
npm run build:static
npm run preview:static
```

The export is written to `static-dist/`. Without configuration it uses
`noindex, nofollow`, omits canonical URLs, alternate route metadata, `og:url`,
and the sitemap, and contains no provider-specific deployment artifact.

The approved GitHub Pages deployment supplies `PUBLIC_SITE_URL` and
`STATIC_BASE_PATH` at build time. It verifies canonical metadata, all 14 routes,
base-aware assets, the sitemap, and `.nojekyll` before publishing. Local builds
remain neutral unless the variables are set explicitly.

Both available routes include eleven visual worked cases linked to complete
evidence files under `examples/`: seven organization and integration cases,
plus four non-agentic cases for read-only RAG, conventional prediction, an
external customer chatbot, and a multimodal catalogue assistant. Each
non-agentic case defines a distinct evaluation, security, legal, and gate
contract while remaining at A0 or A1.

The control explorer is backed by a public, versioned JSON crosswalk and schema
under `public/data/`. It filters stable controls by the selected organization,
risk, autonomy, AI use pattern, and Swiss or EU route while preserving
conditions, evidence IDs, gate mappings, source versions, and implementation
references.
