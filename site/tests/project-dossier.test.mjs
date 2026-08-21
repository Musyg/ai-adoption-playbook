import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  buildProjectDossier,
  parseProjectDossier,
  PROJECT_DOSSIER_SCHEMA_VERSION,
  PROJECT_DOSSIER_STORAGE_KEY,
} from "../app/project-dossier.mjs";

const input = {
  dossier_id: "AAP-test-0001",
  created_at: "2026-08-21T10:00:00.000Z",
  updated_at: "2026-08-21T11:00:00.000Z",
  language: "en",
  context: {
    organization_type: "pme",
    use_pattern: "retrieval",
    jurisdiction: "BOTH",
    integration_level: "agent",
    autonomy_level: 2,
    risk_level: 2,
  },
  active_phase: 4,
  fields: { project: "Neutral project", owner: "Operations owner" },
  conditioned_controls: { "SEC-OWNER": true },
  matched_control_ids: ["AAP-SEC-002", "AAP-GOV-001", "AAP-GOV-001"],
  completed_phases: [4, 0, 4],
};

test("builds a deterministic, bounded working dossier", () => {
  const dossier = buildProjectDossier(input);
  assert.equal(dossier.schema_version, PROJECT_DOSSIER_SCHEMA_VERSION);
  assert.equal(dossier.status, "working_draft");
  assert.deepEqual(dossier.boundary, { local_only: true, no_raw_evidence: true, not_certification: true });
  assert.deepEqual(dossier.matched_control_ids, ["AAP-GOV-001", "AAP-SEC-002"]);
  assert.deepEqual(dossier.completed_phases, [0, 4]);
  assert.notEqual(dossier.fields, input.fields);
});

test("accepts a valid object or JSON string and rejects unsafe variants", () => {
  const dossier = buildProjectDossier(input);
  assert.equal(parseProjectDossier(dossier).ok, true);
  assert.equal(parseProjectDossier(JSON.stringify(dossier)).ok, true);
  assert.deepEqual(parseProjectDossier("{"), { ok: false, error: "invalid_json" });
  assert.deepEqual(parseProjectDossier({ ...dossier, schema_version: "2.0.0" }), { ok: false, error: "unsupported_schema" });
  assert.deepEqual(parseProjectDossier({ ...dossier, context: { ...dossier.context, autonomy_level: 8 } }), { ok: false, error: "invalid_context" });
  assert.deepEqual(parseProjectDossier({ ...dossier, boundary: { ...dossier.boundary, no_raw_evidence: false } }), { ok: false, error: "invalid_boundary" });
  assert.deepEqual(parseProjectDossier({ ...dossier, unexpected: true }), { ok: false, error: "invalid_root" });
});

test("publishes a strict JSON Schema matching the runtime contract", async () => {
  const schema = JSON.parse(await readFile(new URL("../public/data/project-dossier.schema.json", import.meta.url), "utf8"));
  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.equal(schema.properties.schema_version.const, PROJECT_DOSSIER_SCHEMA_VERSION);
  assert.equal(schema.additionalProperties, false);
  assert.match(PROJECT_DOSSIER_STORAGE_KEY, /project-dossier:v1$/);
});
