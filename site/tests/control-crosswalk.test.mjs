import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const catalogUrl = new URL("../public/data/control-crosswalk.v1.json", import.meta.url);
const schemaUrl = new URL("../public/data/control-crosswalk.schema.json", import.meta.url);
const catalog = JSON.parse(await readFile(catalogUrl, "utf8"));
const schema = JSON.parse(await readFile(schemaUrl, "utf8"));

function applies(control, organization, risk, autonomy, usePattern, jurisdiction) {
  return control.applicability.organization_types.includes(organization)
    && control.applicability.risk_levels.includes(risk)
    && control.applicability.autonomy_levels.includes(autonomy)
    && (!control.applicability.use_patterns || control.applicability.use_patterns.includes(usePattern))
    && (!control.applicability.jurisdictions || jurisdiction === "BOTH" || control.applicability.jurisdictions.includes(jurisdiction));
}

test("publishes a versioned JSON Schema contract", () => {
  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.equal(schema.properties.schema_version.const, "1.1.0");
  assert.equal(catalog.schema_version, "1.1.0");
  assert.equal(catalog.catalog_version, "2026.08");
  assert.equal(catalog.published_on, "2026-08-20");
});

test("keeps control, evidence, and source references stable and resolvable", () => {
  assert.equal(catalog.controls.length, 27);
  const controlIds = catalog.controls.map((control) => control.control_id);
  const evidenceIds = new Set(catalog.evidence_types.map((evidence) => evidence.evidence_id));
  const sourceIds = new Set(catalog.sources.map((source) => source.source_id));

  assert.equal(new Set(controlIds).size, controlIds.length);
  assert.match(controlIds[0], /^AAP-[A-Z]{3}-\d{3}$/);
  for (const control of catalog.controls) {
    assert.ok(control.evidence_ids.length > 0);
    assert.ok(control.evidence_ids.every((evidenceId) => evidenceIds.has(evidenceId)));
    assert.ok(control.source_refs.length > 0);
    assert.ok(control.source_refs.every((source) => sourceIds.has(source.source_id)));
    assert.ok(control.gates.length > 0);
  }
});

test("covers each use pattern exactly once", () => {
  const expected = ["generation", "retrieval", "classification", "prediction", "conversation", "multimodal", "agentic"];
  assert.deepEqual(catalog.axes.use_patterns, expected);
  assert.deepEqual(catalog.use_pattern_profiles.map((profile) => profile.use_pattern_id), expected);
});

test("returns a graduated set across pattern and jurisdiction without hiding conditional triggers", () => {
  const independentR1A1 = catalog.controls.filter((control) => applies(control, "independent", "R1", "A1", "retrieval", "CH"));
  const publicR3A2 = catalog.controls.filter((control) => applies(control, "public", "R3", "A2", "agentic", "BOTH"));

  assert.equal(independentR1A1.length, 18);
  assert.equal(publicR3A2.length, 26);
  assert.ok(publicR3A2.some((control) => control.control_id === "AAP-PUB-001"));
  assert.ok(publicR3A2.some((control) => control.control_id === "AAP-AUT-001"));
  assert.ok(publicR3A2.some((control) => control.control_id === "AAP-TRN-003"));
  assert.ok(publicR3A2.some((control) => control.control_id === "AAP-TRN-004"));
  assert.ok(independentR1A1.some((control) => control.applicability.conditions.includes("external_provider")));
});

test("keeps Swiss and EU transparency routes distinct", () => {
  const swissAgent = catalog.controls.filter((control) => applies(control, "public", "R3", "A2", "agentic", "CH"));
  const euAgent = catalog.controls.filter((control) => applies(control, "public", "R3", "A2", "agentic", "EU"));

  assert.ok(swissAgent.some((control) => control.control_id === "AAP-TRN-003"));
  assert.ok(!swissAgent.some((control) => control.control_id === "AAP-TRN-004"));
  assert.ok(euAgent.some((control) => control.control_id === "AAP-TRN-004"));
  assert.ok(!euAgent.some((control) => control.control_id === "AAP-TRN-003"));
});
