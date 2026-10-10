import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { activeUsePatterns, matchesUsePatterns, validAdditionalUsePatterns } from "../app/use-pattern-routing.mjs";

test("combined functions accumulate controls without replacing the main task", async () => {
  const catalog = JSON.parse(await readFile(new URL("../public/data/control-crosswalk.v1.json", import.meta.url)));
  const notice = catalog.controls.find((control) => control.control_id === "AAP-TRN-004");
  assert.equal(matchesUsePatterns(notice, "retrieval"), false);
  assert.equal(matchesUsePatterns(notice, "retrieval", ["conversation"]), true);
  for (const pair of [["retrieval", "conversation"], ["generation", "multimodal"], ["conversation", "agentic"]]) {
    const combined = catalog.controls.filter((control) => matchesUsePatterns(control, pair[0], [pair[1]]));
    for (const pattern of pair) for (const control of catalog.controls.filter((control) => matchesUsePatterns(control, pattern))) {
      assert.ok(combined.includes(control), `${pair.join("+")} lost ${control.control_id}`);
    }
    assert.equal(new Set(combined.map((control) => control.control_id)).size, combined.length);
  }
});

test("secondary functions are explicit, unique and canonically ordered", () => {
  assert.deepEqual(activeUsePatterns("retrieval", ["agentic", "conversation"]), ["retrieval", "conversation", "agentic"]);
  assert.equal(validAdditionalUsePatterns("retrieval", []), true);
  for (const values of [["retrieval"], ["conversation", "conversation"], ["unknown"], undefined]) assert.equal(validAdditionalUsePatterns("retrieval", values), false);
});

test("generation explains the media choice identically in the guide and control catalog", async () => {
  const catalog = JSON.parse(await readFile(new URL("../public/data/control-crosswalk.v1.json", import.meta.url)));
  const source = await readFile(new URL("../app/Playbook.tsx", import.meta.url), "utf8");
  const generation = catalog.use_pattern_profiles.find((profile) => profile.use_pattern_id === "generation");
  for (const locale of ["en", "fr"]) {
    assert.match(generation.task[locale], /Multimodal/);
    assert.ok(source.includes(JSON.stringify(generation.task[locale])), `${locale} task explanation drifted`);
  }
});
