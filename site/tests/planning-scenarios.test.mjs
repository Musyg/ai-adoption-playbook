import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { buildNetPlanningRange, calculateHumanTimeScenario, derivePlanningRange, normalizePlanningOptions } from "../app/task-time-transfer.mjs";

const input = {
  baseline_human_minutes: 60, monthly_cases: 60, eligible_share: 100,
  total_baseline_human_hours: 60, preparation_minutes: 5, supervision_minutes: 5,
  verification_minutes: 10, correction_minutes: 5, exception_rate: 20,
  exception_minutes: 20, setup_hours: 12, amortization_months: 12,
};
const margins = { enabled: true, cautious_review_minutes: 5, favorable_review_minutes: 5,
  cautious_exception_points: 10, favorable_exception_points: 10,
  cautious_setup_hours: 12, favorable_setup_hours: 12 };
const evidence = { ok: true, evidence_id: "TEST", compatibility: { status: "compatible" },
  scenarios: Object.fromEntries(["low", "central", "high"].map(key => [key, {
    reduction_fraction: 0.5, human_time_with_ai_minutes: 30,
  }])) };

test("local scenarios vary review, exceptions and setup without pretending to be observations", () => {
  const human = calculateHumanTimeScenario(input);
  const net = buildNetPlanningRange({ ok: false }, human, { sensitivity: margins });
  assert.equal(net.source, "local_hypothesis");
  assert.deepEqual(["low", "central", "high"].map(key => net.scenarios[key].human_time_with_ai_minutes), [38, 30, 22]);
  assert.deepEqual(["low", "central", "high"].map(key => net.scenarios[key].human_hours_saved_per_month), [22, 30, 38]);
  const exported = derivePlanningRange({ ok: false }, human, null, { sensitivity: margins });
  assert.deepEqual(exported.assumptions.sensitivity, margins);
  assert.equal(exported.human_work.verification_minutes, 10);
  assert.equal(exported.setup.setup_hours, 12);
});

test("counts overlapping work once, adds missing work, and replaces setup already in source", () => {
  const human = calculateHumanTimeScenario({ ...input, verification_minutes: 1 }); // local 20 min + setup 1
  const net = buildNetPlanningRange(evidence, human, { additional_minutes: 5, source_setup_minutes: 3 });
  assert.equal(net.scenarios.central.local_operating_floor_minutes, 20);
  assert.equal(net.scenarios.central.source_setup_removed_minutes, 3);
  assert.equal(net.scenarios.central.operating_human_minutes, 32);
  assert.equal(net.scenarios.central.human_time_with_ai_minutes, 33);
  assert.equal(net.scenarios.central.human_hours_saved_per_month, 27);
  assert.equal(buildNetPlanningRange(evidence, human, { source_setup_minutes: 100 }).scenarios.central.human_time_with_ai_minutes, 21);
});

test("a user can explore local automation without applying the comparable study ratio", () => {
  const human = calculateHumanTimeScenario({ ...input, verification_minutes: 1 });
  const net = buildNetPlanningRange(evidence, human, { use_source: false, additional_minutes: 5, source_setup_minutes: 3 });
  assert.equal(net.source, "local_hypothesis");
  assert.equal(net.evidence_id, null);
  assert.equal(net.scenarios.central.source_implied_human_minutes, null);
  assert.equal(net.scenarios.central.source_setup_removed_minutes, 0);
  assert.equal(net.scenarios.central.human_time_with_ai_minutes, 26);
  assert.equal(buildNetPlanningRange(evidence, human).scenarios.central.human_time_with_ai_minutes, 31);
});

test("optional settings preserve old calculations and normalize empty or invalid margins", () => {
  const human = calculateHumanTimeScenario(input);
  assert.deepEqual(buildNetPlanningRange(evidence, human), buildNetPlanningRange(evidence, human, normalizePlanningOptions()));
  assert.deepEqual(normalizePlanningOptions(null), normalizePlanningOptions());
  const options = normalizePlanningOptions({ additional_minutes: -2, source_setup_minutes: Infinity, sensitivity: {
    enabled: true, cautious_review_minutes: -5, favorable_exception_points: 500, favorable_setup_hours: "invalid",
  } });
  assert.equal(options.additional_minutes, 0);
  assert.equal(options.source_setup_minutes, 0);
  assert.equal(options.sensitivity.cautious_review_minutes, 0);
  assert.equal(options.sensitivity.favorable_exception_points, 100);
  assert.equal(options.sensitivity.favorable_setup_hours, 0);
});

test("sensitivity keeps bounds ordered, retains losses and handles zero eligibility", () => {
  const options = { sensitivity: { ...margins, favorable_review_minutes: 1000,
    favorable_exception_points: 100, favorable_setup_hours: 1000, cautious_review_minutes: 1000 } };
  const net = buildNetPlanningRange(evidence, calculateHumanTimeScenario(input), options);
  assert.ok(net.scenarios.low.reduction_fraction < 0);
  assert.ok(net.scenarios.low.reduction_fraction <= net.scenarios.central.reduction_fraction);
  assert.ok(net.scenarios.central.reduction_fraction <= net.scenarios.high.reduction_fraction);
  assert.ok(net.scenarios.high.reduction_fraction <= 1);
  const zero = buildNetPlanningRange(evidence, calculateHumanTimeScenario({ ...input, eligible_share: 0 }), options);
  assert.equal(zero.calculable, false);
  for (const point of Object.values(zero.scenarios)) assert.equal(point.human_hours_saved_per_month, null);
});

test("new case coverage and measurement metadata do not silently admit outcome percentages", async () => {
  const registry = JSON.parse(await readFile(new URL("../public/data/task-time-evidence.v1.json", import.meta.url), "utf8"));
  assert.equal(registry.records.length, 19);
  assert.equal(registry.records.filter(record => record.transfer.quantitative_use === "usable").length, 4);
  const schema = JSON.parse(await readFile(new URL("../public/data/task-time-evidence.schema.json", import.meta.url), "utf8"));
  assert.ok(!schema.$defs.measurement.required.includes("context"));
  for (const record of registry.records) {
    assert.ok(record.measurement.context);
    for (const key of ["observed_period", "model_and_tools", "time_coverage"]) {
      assert.ok(record.measurement.context[key].en);
      assert.ok(record.measurement.context[key].fr);
    }
    if (!record.measurement.human_active_time_measured) assert.equal(record.transfer.quantitative_use, "context_only");
  }
  for (const language of ["", ".fr"]) {
    const document = await readFile(new URL("../../references/recent-implementation-cases" + language + ".md", import.meta.url), "utf8");
    assert.doesNotMatch(document, /undefined/);
    assert.equal((document.match(/^## /gm) ?? []).length, 10);
    for (const match of document.matchAll(/\]\((https:[^)]+)\)/g)) {
      assert.equal(new URL(match[1]).protocol, "https:");
      assert.doesNotMatch(match[1], /\s/);
    }
  }
});
