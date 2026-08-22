import assert from "node:assert/strict";
import test from "node:test";

import { deriveRiskLevel } from "../app/risk-classification.mjs";

const base = { impact: "low", dataSensitivity: "none", externalInteraction: "no", automatedDecision: "no" };

test("R0 is reachable only for low-impact information or advice", () => {
  assert.equal(deriveRiskLevel({ ...base, autonomy: 0 }), 0);
});

test("ordinary reviewed assistance is R1", () => {
  assert.equal(deriveRiskLevel({ ...base, autonomy: 1 }), 1);
});

test("material impact, personal data, or external interaction raises the route to R2", () => {
  assert.equal(deriveRiskLevel({ ...base, impact: "material", autonomy: 0 }), 2);
  assert.equal(deriveRiskLevel({ ...base, dataSensitivity: "personal", autonomy: 0 }), 2);
  assert.equal(deriveRiskLevel({ ...base, externalInteraction: "yes", autonomy: 0 }), 2);
});

test("high impact or an automated decision about a person raises the route to R3", () => {
  assert.equal(deriveRiskLevel({ ...base, impact: "high", autonomy: 0 }), 3);
  assert.equal(deriveRiskLevel({ ...base, automatedDecision: "yes", autonomy: 0 }), 3);
});
