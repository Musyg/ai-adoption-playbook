# Publication follow-up and loading review

[Français](loading-review.fr.md)

Date: September 12, 2026. Baseline: published `main` at `9736e1f`.
Working branch: `maintenance/publication-performance`. Publication requires a
separate merge and successful Pages run; pushing this branch is not deployment.

## What changed

- The handoff, changelog and reader-clarity reports now distinguish the verified
  PR #55 publication from earlier local snapshots. No new release tag is claimed.
- The 12 editorial routes keep their prerendered HTML, CSS, native links,
  anchors, language links and JSON-LD, but no longer load or preload the
  interactive guide's JavaScript. The two home routes retain full interaction.
- The static guide has separate content-hashed chunks for React, evidence and
  project workspaces. An editorial change need not invalidate those files.
  They are still loaded immediately where the guide needs them; this is not
  lazy loading or a claim that its initial download was halved.
- A French hydration mismatch was found by the new browser test: the server
  rendered `100'000`, while Chrome rendered `100 000`. Number formatting now
  uses consistent grouping and decimal separators, retaining the existing
  numerical values, rounding and signs. React no longer rebuilds that page
  because of this mismatch in the targeted checks.

## Measured static output

Bytes measured locally from the production export. Gzip uses Node `gzipSync`
with default settings for both builds; actual hosting compression may differ.

| JavaScript | Published baseline | Maintenance build |
| --- | ---: | ---: |
| Downloaded by an article | 862,672 bytes | 0 bytes |
| Largest file on the interactive guide | 862,672 bytes | 423,072 bytes |
| All guide JavaScript, uncompressed | 862,672 bytes | 855,429 bytes |
| All guide JavaScript, gzip sum | 251,307 bytes | 250,688 bytes |

The guide's other chunks are 190,190 bytes (React), 132,691 bytes (evidence),
and 109,476 bytes (project workspace). Their filenames remained unchanged
when the number-formatting correction changed the main file. The CSS is
unchanged at 196,981 bytes. Article HTML and CSS still have a download cost;
zero JavaScript does not mean a zero-byte page.

The static export no longer emits the 500 kB chunk warning, without increasing
the warning threshold. The separate Vinext client build still emits its
pre-existing warning; its JavaScript is not the client deployed to GitHub
Pages. This targeted work does not claim a full server-build optimization,
Core Web Vitals improvement, or a measured gain on readers' devices.

## Regression coverage

The checks enforce the static chunk budget, script-free articles with CSS and
JSON-LD preserved, all 12 hosted article paths, native navigation without
JavaScript, both interactive home routes without hydration errors, and stable
number formatting. Existing browser checks cover the 12 articles with script
request tracking, calculations, saved dossiers, language changes, accessibility,
mobile layout, themes and hover states.

Final local validation passed: TypeScript, lint, server/static builds, 64 Node
tests, 153 Chrome checks (6.7 minutes, no retries), 127 Markdown files and the
repository contracts, plus the source-discovery regression. The three hosted
export checks passed; a Chrome smoke check also verified both home routes and
the article language link below the hosted base path without browser errors
or failed asset responses. This is local verification, not a new deployment.

Sources for the build mechanism:
[Vite production builds](https://vite.dev/guide/build) and
[Vite build options](https://vite.dev/config/build-options.html).
