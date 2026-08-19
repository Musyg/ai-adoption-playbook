# AI Adoption Playbook — visual site

The bilingual site turns the repository’s adoption method into an interactive,
audience-specific path. It preserves the Musyg portfolio identity and keeps the
full operational templates in the repository as the source of truth.

Requires Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Run `npm run lint`, `npm run build`, and `npm test` before publishing.

English is served at `/`; French is served at `/fr/`. Both versions include
seven visual worked cases linked to complete bilingual evidence files under
`examples/`: an independent copilot, a micro-business inbox, an SME B2B quote
agent, a foundation grant-dossier administrative agent, a public planning-
dossier administrative agent, an independent A2 business agent, and an
orchestrated-agency analogy.

The control explorer is backed by a public, versioned JSON crosswalk and schema
under `public/data/`. It filters stable controls by the selected organization,
risk, and autonomy while preserving conditions, evidence IDs, gate mappings,
source versions, and implementation references.
