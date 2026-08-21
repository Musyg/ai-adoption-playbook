import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  buildProjectDossier,
  parseProjectDossier,
  PROJECT_DOSSIER_SCHEMA_VERSION,
  PROJECT_DOSSIER_STORAGE_KEY,
} from "../app/project-dossier.mjs";
import { createEmptyProjectArtifacts, materializeProjectArtifacts } from "../app/project-artifacts.mjs";
import { createProjectChangeReview, createProjectSnapshot, materializeProjectChangeReview } from "../app/project-change-review.mjs";

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
  artifacts: createEmptyProjectArtifacts(),
  change_review: null,
};

test("builds a deterministic, bounded working dossier", () => {
  const dossier = buildProjectDossier(input);
  assert.equal(dossier.schema_version, PROJECT_DOSSIER_SCHEMA_VERSION);
  assert.equal(dossier.status, "working_draft");
  assert.deepEqual(dossier.boundary, { local_only: true, no_raw_evidence: true, not_certification: true });
  assert.deepEqual(dossier.matched_control_ids, ["AAP-GOV-001", "AAP-SEC-002"]);
  assert.deepEqual(dossier.completed_phases, [0, 4]);
  assert.notEqual(dossier.fields, input.fields);
  assert.notEqual(dossier.artifacts, input.artifacts);
  assert.equal(dossier.change_review, null);
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
  assert.deepEqual(parseProjectDossier({ ...dossier, artifacts: { ...dossier.artifacts, unexpected: {} } }), { ok: false, error: "invalid_artifacts" });
  assert.deepEqual(parseProjectDossier({ ...dossier, change_review: { baseline: {} } }), { ok: false, error: "invalid_change_review" });
  const current = createProjectSnapshot(dossier);
  const otherProjectReview = createProjectChangeReview(dossier, current, "2026-08-21T12:00:00.000Z");
  otherProjectReview.baseline.dossier_id = "AAP-other-0001";
  assert.deepEqual(parseProjectDossier({ ...dossier, change_review: otherProjectReview }), { ok: false, error: "invalid_change_review" });
});

test("migrates a valid 0.1.0 dossier without losing lifecycle data", () => {
  const current = buildProjectDossier(input);
  const legacy = { ...current, schema_version: "0.1.0" };
  delete legacy.artifacts;
  delete legacy.change_review;
  const parsed = parseProjectDossier(legacy);
  assert.equal(parsed.ok, true);
  assert.equal(parsed.migratedFrom, "0.1.0");
  assert.equal(parsed.value.fields.project, "Neutral project");
  assert.deepEqual(parsed.value.artifacts, createEmptyProjectArtifacts());
  assert.equal(parsed.value.change_review, null);
});

test("migrates a valid 0.2.0 dossier additively", () => {
  const current = buildProjectDossier(input);
  const legacy = { ...current, schema_version: "0.2.0" };
  delete legacy.change_review;
  const parsed = parseProjectDossier(legacy);
  assert.equal(parsed.ok, true);
  assert.equal(parsed.migratedFrom, "0.2.0");
  assert.deepEqual(parsed.value.artifacts, current.artifacts);
  assert.equal(parsed.value.change_review, null);
});

test("keeps linked artifact values current and preserves manual decisions", () => {
  const first = materializeProjectArtifacts(createEmptyProjectArtifacts(), {
    values: { project: "Linked name", owner: "Owner A" },
    completed_phases: [0],
    conditioned_controls: { "SEC-OWNER": true },
    security_control_ids: ["SEC-OWNER"],
    matched_control_ids: ["AAP-GOV-001"],
  });
  assert.deepEqual(first.system_register.fields.name, { value: "Linked name", mode: "linked" });
  assert.equal(first.implementation_checklist.items["phase:0"].status, "done");
  assert.equal(first.implementation_checklist.items["security:SEC-OWNER"].status, "done");
  assert.equal(first.implementation_checklist.items["control:AAP-GOV-001"].status_mode, "manual");

  first.system_register.fields.name = { value: "Approved register name", mode: "manual" };
  const second = materializeProjectArtifacts(first, {
    values: { project: "Changed guide name", owner: "Owner B" },
    completed_phases: [],
    conditioned_controls: { "SEC-OWNER": false },
    security_control_ids: ["SEC-OWNER"],
    matched_control_ids: ["AAP-GOV-001"],
  });
  assert.deepEqual(second.system_register.fields.name, { value: "Approved register name", mode: "manual" });
  assert.deepEqual(second.system_register.fields.owner, { value: "Owner B", mode: "linked" });
  assert.equal(second.implementation_checklist.items["phase:0"].status, "not_started");
});

test("compares decision-relevant changes and resets stale review decisions", () => {
  const baseline = buildProjectDossier(input);
  baseline.artifacts.implementation_checklist.items["phase:0"] = { status: "done", status_mode: "manual", owner: "", due_date: "", evidence_ref: "" };
  const current = createProjectSnapshot(baseline);
  current.context.integration_level = "agency";
  current.context.autonomy_level = 3;
  current.fields.riskImpact = "high";
  current.conditioned_controls["SEC-ACTION"] = false;
  current.artifacts.evaluation_plan.fields.stop_rule = { value: "Stop on one unauthorized effect", mode: "manual" };
  current.artifacts.implementation_checklist.items["phase:0"].status = "in_progress";

  const review = createProjectChangeReview(baseline, current, "2026-08-21T12:00:00.000Z", "0.2.0");
  assert.equal(review.baseline.schema_version, "0.2.0");
  assert.equal(review.items["context:integration_level"].recommended_action, "restart");
  assert.equal(review.items["lifecycle:riskImpact"].domain, "risk");
  assert.equal(review.items["security:SEC-ACTION"].recommended_action, "reassess");
  assert.equal(review.items["evaluation_plan:stop_rule"].domain, "evaluation");
  assert.equal(review.items["checklist:phase:0:status"].recommended_action, "reassess");

  review.items["context:integration_level"].decision = "restart";
  review.items["context:integration_level"].owner = "Programme owner";
  const unchanged = materializeProjectChangeReview(review, current);
  assert.equal(unchanged.items["context:integration_level"].decision, "restart");
  assert.equal(unchanged.items["context:integration_level"].owner, "Programme owner");

  current.context.integration_level = "copilot";
  const changedAgain = materializeProjectChangeReview(unchanged, current);
  assert.equal(changedAgain.items["context:integration_level"].decision, "pending");
  assert.equal(changedAgain.items["context:integration_level"].after, "copilot");
});

test("publishes a strict JSON Schema matching the runtime contract", async () => {
  const schema = JSON.parse(await readFile(new URL("../public/data/project-dossier.schema.json", import.meta.url), "utf8"));
  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.equal(schema.properties.schema_version.const, PROJECT_DOSSIER_SCHEMA_VERSION);
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.properties.artifacts.additionalProperties, false);
  assert.ok(schema.properties.change_review);
  assert.ok(schema.$defs.projectSnapshot);
  assert.ok(schema.$defs.changeReviewItem);
  assert.ok(schema.$defs.artifactField);
  assert.match(PROJECT_DOSSIER_STORAGE_KEY, /project-dossier:v1$/);
});
