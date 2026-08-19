import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const catalogUrl = new URL("../public/data/control-crosswalk.v1.json", import.meta.url);
const schemaUrl = new URL("../public/data/control-crosswalk.schema.json", import.meta.url);
const catalog = JSON.parse(await readFile(catalogUrl, "utf8"));
const schema = JSON.parse(await readFile(schemaUrl, "utf8"));

function applies(control, organization, risk, autonomy) {
  return control.applicability.organization_types.includes(organization)
    && control.applicability.risk_levels.includes(risk)
    && control.applicability.autonomy_levels.includes(autonomy);
}

test("publishes a versioned JSON Schema contract", () => {
  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.equal(schema.properties.schema_version.const, "1.0.0");
  assert.equal(catalog.schema_version, "1.0.0");
  assert.equal(catalog.catalog_version, "2026.08");
  assert.equal(catalog.published_on, "2026-08-19");
});

test("keeps control, evidence, and source references stable and resolvable", () => {
  assert.equal(catalog.controls.length, 20);
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

test("returns a graduated set without hiding conditional triggers", () => {
  const independentR1A1 = catalog.controls.filter((control) => applies(control, "independent", "R1", "A1"));
  const publicR3A2 = catalog.controls.filter((control) => applies(control, "public", "R3", "A2"));

  assert.equal(independentR1A1.length, 15);
  assert.equal(publicR3A2.length, 20);
  assert.ok(publicR3A2.some((control) => control.control_id === "AAP-PUB-001"));
  assert.ok(publicR3A2.some((control) => control.control_id === "AAP-AUT-001"));
  assert.ok(independentR1A1.some((control) => control.applicability.conditions.includes("external_provider")));
});
