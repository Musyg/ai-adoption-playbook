import { rm } from "node:fs/promises";

// Start from fresh client shells, never HTML finalized by a previous export.
await rm(new URL("../static-dist/", import.meta.url), { recursive: true, force: true });
