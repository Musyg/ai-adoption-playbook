import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  assessEvidenceCompatibility,
  buildEvidenceTransfer,
  buildNetPlanningRange,
  calculateHumanTimeScenario,
  derivePlanningRange,
  listEvidenceOptions,
} from "../app/task-time-transfer.mjs";

const registry = JSON.parse(await readFile(new URL("../public/data/task-time-evidence.v1.json", import.meta.url), "utf8"));
const record = (evidenceId) => registry.records.find((item) => item.evidence_id === evidenceId);

test("publishes unique task profiles, evidence identifiers, and resolvable task contracts", () => {
  assert.equal(registry.schema_version, "1.0.0");
  assert.equal(new Set(registry.task_profiles.map((profile) => profile.profile_id)).size, registry.task_profiles.length);
  assert.equal(new Set(registry.records.map((item) => item.evidence_id)).size, registry.records.length);
  const profileIds = new Set(registry.task_profiles.map((profile) => profile.profile_id));
  for (const item of registry.records) {
    assert.ok(profileIds.has(item.task_contract.profile_id));
    assert.ok(item.sources.every((source) => source.url.startsWith("https://")));
  }
});

test("gives every evidence record a short beginner explanation before technical detail", () => {
  for (const item of registry.records) {
    assert.ok(item.reader_summary.en.length >= 80 && item.reader_summary.en.length <= 260);
    assert.ok(item.reader_summary.fr.length >= 80 && item.reader_summary.fr.length <= 300);
    assert.doesNotMatch(item.reader_summary.en, /denominator|paired|transferable|reported concentration|full real-world validation/i);
    assert.doesNotMatch(item.reader_summary.fr, /dénominateur|appari(?:é|ée)|transférable|concentration annoncée|validation terrain complète/i);
    if (item.transfer.quantitative_use === "context_only") {
      assert.match(item.reader_summary.en, /do not enter|does not enter/);
      assert.match(item.reader_summary.fr, /n’entrent pas|n’entre pas/);
    }
  }
});

test("maps every worked case once and keeps all synthetic numbers at grade E", () => {
  assert.equal(registry.case_applications.length, 11);
  assert.equal(new Set(registry.case_applications.map((item) => item.case_id)).size, 11);
  assert.equal(new Set(registry.case_applications.map((item) => item.example_files.en)).size, 11);
  const profileIds = new Set(registry.task_profiles.map((profile) => profile.profile_id));
  const evidenceIds = new Set(registry.records.map((item) => item.evidence_id));
  for (const item of registry.case_applications) {
    assert.equal(item.evidence_grade, "E");
    assert.equal(item.quantitative_use, "planning_only");
    assert.ok(profileIds.has(item.profile_id));
    assert.ok(item.external_anchor_ids.every((evidenceId) => evidenceIds.has(evidenceId)));
  }
});

test("ignores organization type and compares the task contract", () => {
  const writing = record("TT-2023-NOY-ZHANG-WRITING");
  const target = { task_profile_id: "professional_writing", integration_mode: "copilot", quality_gate: "reviewed", expertise_level: "mixed" };
  assert.deepEqual(assessEvidenceCompatibility(writing, target), { status: "compatible", reasons: [] });
  assert.equal(Object.hasOwn(target, "organization_type"), false);
});

test("marks a comparable task with a different review or experience context as partial", () => {
  const writing = record("TT-2023-NOY-ZHANG-WRITING");
  const compatibility = assessEvidenceCompatibility(writing, {
    task_profile_id: "professional_writing",
    integration_mode: "copilot",
    quality_gate: "draft",
    expertise_level: "experienced",
  });
  assert.equal(compatibility.status, "partial");
  assert.deepEqual(compatibility.reasons, ["quality_gate", "expertise_level"]);
});

test("keeps self-reports, outcome metrics, model estimates, and internal estimates contextual", () => {
  const targets = [
    ["TT-2025-UK-M365-DAY", "office_day_bundle", "copilot", "draft", "mixed"],
    ["TT-2023-NBER-CUSTOMER-SUPPORT", "customer_support", "copilot", "production", "mixed"],
    ["TT-2025-ANTHROPIC-MODEL-ESTIMATE", "information_synthesis", "copilot", "draft", "mixed"],
    ["TT-2026-OPENAI-HARNESS-PROJECT", "hard_automation_project", "agency", "production", "experienced"],
  ];
  for (const [evidenceId, taskProfile, integrationMode, qualityGate, expertise] of targets) {
    const compatibility = assessEvidenceCompatibility(record(evidenceId), {
      task_profile_id: taskProfile,
      integration_mode: integrationMode,
      quality_gate: qualityGate,
      expertise_level: expertise,
    });
    assert.equal(compatibility.status, "context");
    assert.ok(compatibility.reasons.includes("context_only"));
  }
});

test("transfers a compatible measured range without clipping uncertainty", () => {
  const transfer = buildEvidenceTransfer(
    record("TT-2023-GITHUB-COPILOT-HTTP"),
    { task_profile_id: "software_greenfield", integration_mode: "copilot", quality_gate: "reviewed", expertise_level: "mixed" },
    { baseline_human_minutes: 120, monthly_cases: 10, eligible_share: 80 },
  );
  assert.equal(transfer.ok, true);
  assert.equal(transfer.scenarios.low.human_hours_saved_per_month, 3.36);
  assert.ok(Math.abs(transfer.scenarios.central.human_time_with_ai_minutes - 53.04) < 1e-12);
  assert.ok(Math.abs(transfer.scenarios.high.whole_workload_reduction_fraction - 0.712) < 1e-12);
});

test("preserves a measured slowdown as negative human time saved", () => {
  const transfer = buildEvidenceTransfer(
    record("TT-2025-METR-MATURE-REPOS"),
    { task_profile_id: "software_mature_repo", integration_mode: "copilot", quality_gate: "production", expertise_level: "experienced" },
    { baseline_human_minutes: 120, monthly_cases: 10, eligible_share: 100 },
  );
  assert.equal(transfer.ok, true);
  assert.ok(Math.abs(transfer.scenarios.low.human_hours_saved_per_month + 7.8) < 1e-12);
  assert.ok(Math.abs(transfer.scenarios.central.human_time_with_ai_minutes - 142.8) < 1e-12);
  assert.ok(Math.abs(transfer.scenarios.high.human_hours_saved_per_year + 4.8) < 1e-12);
});

test("does not convert contextual evidence into a time transfer", () => {
  const item = record("TT-2025-UK-CODING-ASSISTANTS");
  const transfer = buildEvidenceTransfer(
    item,
    { task_profile_id: "software_mature_repo", integration_mode: "copilot", quality_gate: "production", expertise_level: "mixed" },
    { baseline_human_minutes: 120, monthly_cases: 10, eligible_share: 100 },
  );
  assert.equal(transfer.ok, false);
  assert.equal(transfer.compatibility.status, "context");
});

test("accounts for every human component, exceptions, and amortized setup", () => {
  const scenario = calculateHumanTimeScenario({
    baseline_human_minutes: 60,
    monthly_cases: 100,
    eligible_share: 50,
    preparation_minutes: 5,
    supervision_minutes: 5,
    verification_minutes: 10,
    correction_minutes: 5,
    exception_rate: 20,
    exception_minutes: 20,
    setup_hours: 10,
    amortization_months: 5,
  });
  assert.equal(scenario.components.expected_exception_minutes, 4);
  assert.equal(scenario.components.amortized_setup_minutes_per_case, 2.4);
  assert.equal(scenario.human_time_with_ai_minutes, 31.4);
  assert.ok(Math.abs(scenario.human_hours_saved_per_month - 23.833333333333332) < 1e-12);
  assert.ok(Math.abs(scenario.whole_workload_reduction_fraction - 0.23833333333333334) < 1e-12);
});

test("produces a net evidence range after the local human floor and amortized setup", () => {
  const target = { task_profile_id: "knowledge_analysis", integration_mode: "copilot", quality_gate: "reviewed", expertise_level: "experienced" };
  const options = listEvidenceOptions(registry, target);
  assert.equal(options[0].record.evidence_id, "TT-2026-BCG-JAGGED-FRONTIER");
  assert.equal(options[0].compatibility.status, "compatible");
  const manual = calculateHumanTimeScenario({
    baseline_human_minutes: 60,
    monthly_cases: 40,
    eligible_share: 70,
    preparation_minutes: 5,
    supervision_minutes: 5,
    verification_minutes: 10,
    correction_minutes: 5,
    exception_rate: 20,
    exception_minutes: 20,
    setup_hours: 40,
    amortization_months: 12,
  });
  const evidence = buildEvidenceTransfer(options[0].record, target, { baseline_human_minutes: 60, monthly_cases: 40, eligible_share: 70 });
  const net = buildNetPlanningRange(evidence, manual);
  assert.equal(net.method, "greater_residual_plus_amortized_setup");
  assert.equal(net.scenarios.low.binding_floor, "source");
  assert.ok(Math.abs(net.scenarios.low.human_time_with_ai_minutes - 53.642857142857146) < 1e-12);
  assert.ok(Math.abs(net.scenarios.central.reduction_fraction - 0.13195238095238093) < 1e-12);
  assert.ok(Math.abs(net.scenarios.central.recurring_reduction_fraction - 0.251) < 1e-12);
  assert.ok(Math.abs(net.scenarios.central.recurring_human_hours_saved_per_month - 7.028) < 1e-12);
  assert.ok(Math.abs(net.scenarios.high.human_hours_saved_per_month - 4.394666666666667) < 1e-12);
  const planning = derivePlanningRange(evidence, manual, target);
  assert.equal(planning.calculable, true);
  assert.equal(planning.source, "external_evidence");
  assert.equal(planning.low, 0.1059523809523809);
  assert.equal(planning.central, 0.13195238095238093);
  assert.equal(planning.high, 0.15695238095238093);
  assert.equal(planning.compatibility, "compatible");
  assert.equal(planning.evidence_id, "TT-2026-BCG-JAGGED-FRONTIER");
  assert.deepEqual(planning.target, target);
  assert.deepEqual(planning.human_work, {
    preparation_minutes: 5,
    supervision_minutes: 5,
    verification_minutes: 10,
    correction_minutes: 5,
    exception_rate_percent: 20,
    exception_minutes: 20,
    expected_exception_minutes: 4,
    operating_human_minutes: 29,
  });
  assert.equal(planning.setup.setup_hours, 40);
  assert.equal(planning.setup.amortization_months, 12);
  assert.ok(Math.abs(planning.setup.amortized_setup_minutes_per_case - 7.142857142857143) < 1e-12);
  assert.equal(derivePlanningRange({ ok: false }, manual).source, "local_hypothesis");
});

test("blocks the net range when no case is eligible and setup cannot be allocated", () => {
  const target = { task_profile_id: "knowledge_analysis", integration_mode: "copilot", quality_gate: "reviewed", expertise_level: "experienced" };
  const evidence = buildEvidenceTransfer(record("TT-2026-BCG-JAGGED-FRONTIER"), target, {
    baseline_human_minutes: 60,
    monthly_cases: 40,
    eligible_share: 0,
  });
  const manual = calculateHumanTimeScenario({
    baseline_human_minutes: 60,
    monthly_cases: 40,
    eligible_share: 0,
    preparation_minutes: 5,
    supervision_minutes: 5,
    verification_minutes: 10,
    correction_minutes: 5,
    exception_rate: 20,
    exception_minutes: 20,
    setup_hours: 40,
    amortization_months: 12,
  });
  const net = buildNetPlanningRange(evidence, manual);
  const planning = derivePlanningRange(evidence, manual);
  assert.equal(manual.calculable, false);
  assert.equal(net.calculable, false);
  assert.equal(net.unavailable_reason, "no_eligible_cases");
  assert.equal(net.scenarios.central.recurring_reduction_fraction, (60 - net.scenarios.central.operating_human_minutes) / 60);
  assert.equal(net.scenarios.central.amortized_setup_minutes_per_case, null);
  assert.equal(net.scenarios.central.reduction_fraction, null);
  assert.equal(net.scenarios.central.human_hours_saved_per_month, null);
  assert.equal(planning.calculable, false);
  assert.deepEqual([planning.low, planning.central, planning.high], [0, 0, 0]);
});

test("uses the declared human work as a floor without adding it twice", () => {
  const target = { task_profile_id: "software_greenfield", integration_mode: "copilot", quality_gate: "reviewed", expertise_level: "mixed" };
  const evidence = buildEvidenceTransfer(record("TT-2023-GITHUB-COPILOT-HTTP"), target, {
    baseline_human_minutes: 120,
    monthly_cases: 10,
    eligible_share: 100,
  });
  const manual = calculateHumanTimeScenario({
    baseline_human_minutes: 120,
    monthly_cases: 10,
    eligible_share: 100,
    preparation_minutes: 20,
    supervision_minutes: 20,
    verification_minutes: 30,
    correction_minutes: 20,
    exception_rate: 50,
    exception_minutes: 20,
    setup_hours: 0,
    amortization_months: 12,
  });
  const net = buildNetPlanningRange(evidence, manual);
  assert.equal(manual.operating_human_minutes, 100);
  assert.equal(net.scenarios.low.binding_floor, "local");
  assert.equal(net.scenarios.low.human_time_with_ai_minutes, 100);
  assert.equal(net.scenarios.central.human_time_with_ai_minutes, 100);
  assert.equal(net.scenarios.high.human_time_with_ai_minutes, 100);
  assert.ok(Math.abs(net.scenarios.central.reduction_fraction - (1 / 6)) < 1e-12);
});

test("keeps an evidence-backed slowdown negative after local costs and setup", () => {
  const target = { task_profile_id: "software_mature_repo", integration_mode: "copilot", quality_gate: "production", expertise_level: "experienced" };
  const evidence = buildEvidenceTransfer(record("TT-2025-METR-MATURE-REPOS"), target, {
    baseline_human_minutes: 120,
    monthly_cases: 10,
    eligible_share: 100,
  });
  const manual = calculateHumanTimeScenario({
    baseline_human_minutes: 120,
    monthly_cases: 10,
    eligible_share: 100,
    preparation_minutes: 5,
    supervision_minutes: 5,
    verification_minutes: 10,
    correction_minutes: 5,
    exception_rate: 0,
    exception_minutes: 0,
    setup_hours: 12,
    amortization_months: 12,
  });
  const net = buildNetPlanningRange(evidence, manual);
  assert.ok(net.scenarios.low.reduction_fraction < -0.39);
  assert.ok(net.scenarios.central.reduction_fraction < -0.19);
  assert.ok(net.scenarios.high.reduction_fraction < -0.02);
});

test("publishes a strict schema for the registry", async () => {
  const schema = JSON.parse(await readFile(new URL("../public/data/task-time-evidence.schema.json", import.meta.url), "utf8"));
  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.equal(schema.properties.schema_version.const, registry.schema_version);
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.$defs.evidenceRecord.additionalProperties, false);
  assert.equal(schema.$defs.measurement.additionalProperties, false);
  assert.equal(schema.$defs.caseApplication.additionalProperties, false);
});
