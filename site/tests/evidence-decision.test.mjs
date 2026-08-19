import assert from "node:assert/strict";
import test from "node:test";

import { decideEvidence } from "../app/evidence-decision.mjs";

const passing = { samplePass: true, valuePass: true, qualityPass: true, safetyPass: true, tracePass: true };

test("continues only when every decision gate passes", () => {
  assert.equal(decideEvidence(passing), "continue");
});

test("reworks an evaluable pilot that misses value or quality", () => {
  assert.equal(decideEvidence({ ...passing, valuePass: false }), "rework");
  assert.equal(decideEvidence({ ...passing, qualityPass: false }), "rework");
});

test("keeps incomplete samples and traces non-evaluable", () => {
  assert.equal(decideEvidence({ ...passing, samplePass: false }), "unknown");
  assert.equal(decideEvidence({ ...passing, tracePass: false }), "unknown");
});

test("critical safety failure overrides every other result", () => {
  assert.equal(decideEvidence({ samplePass: false, valuePass: false, qualityPass: false, safetyPass: false, tracePass: false }), "stop");
});
