const COMPATIBILITY_ORDER = { compatible: 0, partial: 1, context: 2, incompatible: 3 };
const GRADE_ORDER = { A: 0, B: 1, C: 2, D: 3, E: 4 };

const finite = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const bounded = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, finite(value, minimum)));

export function assessEvidenceCompatibility(record, target) {
  if (!record || !target) return { status: "incompatible", reasons: ["missing_contract"] };

  const transfer = record.transfer ?? {};
  const profileMatch = transfer.allowed_profiles?.includes(target.task_profile_id) === true;
  const modeMatch = transfer.integration_modes?.includes(target.integration_mode) === true;
  const qualityMatch = transfer.quality_gates?.includes(target.quality_gate) === true;
  const expertiseMatch = transfer.expertise_levels?.includes(target.expertise_level) === true;
  const reasons = [];
  if (!profileMatch) reasons.push("task_profile");
  if (!modeMatch) reasons.push("integration_mode");
  if (!qualityMatch) reasons.push("quality_gate");
  if (!expertiseMatch) reasons.push("expertise_level");

  const hasQuantitativeTime = transfer.quantitative_use === "usable"
    && record.measurement?.human_active_time_measured === true
    && record.measurement?.human_time_reduction_fraction != null;

  if (!profileMatch || !modeMatch) return { status: "incompatible", reasons };
  if (!hasQuantitativeTime) return { status: "context", reasons: ["context_only", ...reasons] };
  if (!qualityMatch || !expertiseMatch) return { status: "partial", reasons };
  return { status: "compatible", reasons: [] };
}

export function listEvidenceOptions(registry, target) {
  return (registry?.records ?? [])
    .map((record) => ({ record, compatibility: assessEvidenceCompatibility(record, target) }))
    .sort((left, right) => {
      const compatibilityDifference = COMPATIBILITY_ORDER[left.compatibility.status] - COMPATIBILITY_ORDER[right.compatibility.status];
      if (compatibilityDifference !== 0) return compatibilityDifference;
      return (GRADE_ORDER[left.record.measurement.evidence_grade] ?? 9) - (GRADE_ORDER[right.record.measurement.evidence_grade] ?? 9);
    });
}

function calculateRangePoint(reductionFraction, baselineMinutes, monthlyCases, eligibleShare) {
  const eligibleCases = monthlyCases * eligibleShare;
  const baselineEligibleHours = eligibleCases * baselineMinutes / 60;
  const humanTimeWithAiMinutes = baselineMinutes * (1 - reductionFraction);
  const humanHoursSavedPerMonth = baselineEligibleHours * reductionFraction;
  return {
    reduction_fraction: reductionFraction,
    human_time_with_ai_minutes: humanTimeWithAiMinutes,
    human_hours_saved_per_month: humanHoursSavedPerMonth,
    human_hours_saved_per_year: humanHoursSavedPerMonth * 12,
    whole_workload_reduction_fraction: eligibleShare * reductionFraction,
  };
}

export function buildEvidenceTransfer(record, target, workload) {
  const compatibility = assessEvidenceCompatibility(record, target);
  if (!record || !["compatible", "partial"].includes(compatibility.status)) {
    return { ok: false, compatibility };
  }

  const range = record.measurement.human_time_reduction_fraction;
  if (!range) return { ok: false, compatibility: { status: "context", reasons: ["context_only"] } };
  const baselineMinutes = bounded(workload?.baseline_human_minutes, 0.1, 10080);
  const monthlyCases = bounded(workload?.monthly_cases, 0, 1000000);
  const eligibleShare = bounded(workload?.eligible_share, 0, 100) / 100;

  return {
    ok: true,
    evidence_id: record.evidence_id,
    evidence_grade: record.measurement.evidence_grade,
    compatibility,
    workload: {
      baseline_human_minutes: baselineMinutes,
      monthly_cases: monthlyCases,
      eligible_share: eligibleShare,
      eligible_cases: monthlyCases * eligibleShare,
    },
    scenarios: {
      low: calculateRangePoint(range.low, baselineMinutes, monthlyCases, eligibleShare),
      central: calculateRangePoint(range.central, baselineMinutes, monthlyCases, eligibleShare),
      high: calculateRangePoint(range.high, baselineMinutes, monthlyCases, eligibleShare),
    },
  };
}

export function calculateHumanTimeScenario(input) {
  const baselineMinutes = bounded(input?.baseline_human_minutes, 0.1, 10080);
  const monthlyCases = bounded(input?.monthly_cases, 0, 1000000);
  const eligibleShare = bounded(input?.eligible_share, 0, 100) / 100;
  const eligibleCases = monthlyCases * eligibleShare;
  const calculable = eligibleCases > 0;
  const preparationMinutes = bounded(input?.preparation_minutes, 0, 10080);
  const supervisionMinutes = bounded(input?.supervision_minutes, 0, 10080);
  const verificationMinutes = bounded(input?.verification_minutes, 0, 10080);
  const correctionMinutes = bounded(input?.correction_minutes, 0, 10080);
  const exceptionRate = bounded(input?.exception_rate, 0, 100) / 100;
  const exceptionMinutes = bounded(input?.exception_minutes, 0, 10080);
  const setupHours = bounded(input?.setup_hours, 0, 1000000);
  const amortizationMonths = bounded(input?.amortization_months, 1, 120);
  const expectedExceptionMinutes = exceptionRate * exceptionMinutes;
  const operatingHumanMinutes = preparationMinutes + supervisionMinutes + verificationMinutes + correctionMinutes + expectedExceptionMinutes;
  const amortizedSetupMinutesPerCase = eligibleCases > 0 ? setupHours * 60 / (eligibleCases * amortizationMonths) : 0;
  const humanTimeWithAiMinutes = operatingHumanMinutes + amortizedSetupMinutesPerCase;
  const humanTimeSavedPerCase = baselineMinutes - humanTimeWithAiMinutes;
  const operatingTimeSavedPerCase = baselineMinutes - operatingHumanMinutes;
  const monthlyHumanHoursSaved = humanTimeSavedPerCase * eligibleCases / 60;
  const monthlyOperatingHoursSaved = operatingTimeSavedPerCase * eligibleCases / 60;
  const reductionFraction = humanTimeSavedPerCase / baselineMinutes;

  return {
    baseline_human_minutes: baselineMinutes,
    monthly_cases: monthlyCases,
    eligible_share: eligibleShare,
    eligible_cases: eligibleCases,
    calculable,
    baseline_eligible_human_hours: eligibleCases * baselineMinutes / 60,
    components: {
      preparation_minutes: preparationMinutes,
      supervision_minutes: supervisionMinutes,
      verification_minutes: verificationMinutes,
      correction_minutes: correctionMinutes,
      exception_rate: exceptionRate,
      exception_minutes: exceptionMinutes,
      expected_exception_minutes: expectedExceptionMinutes,
      amortized_setup_minutes_per_case: amortizedSetupMinutesPerCase,
    },
    operating_human_minutes: operatingHumanMinutes,
    setup_hours: setupHours,
    amortization_months: amortizationMonths,
    human_time_with_ai_minutes: humanTimeWithAiMinutes,
    human_time_saved_per_case: humanTimeSavedPerCase,
    reduction_fraction: reductionFraction,
    whole_workload_reduction_fraction: eligibleShare * reductionFraction,
    human_hours_saved_per_month: monthlyHumanHoursSaved,
    human_hours_saved_per_year: monthlyHumanHoursSaved * 12,
    accepted_throughput_ratio: humanTimeWithAiMinutes > 0 ? baselineMinutes / humanTimeWithAiMinutes : null,
    setup_payback_months: monthlyOperatingHoursSaved > 0 ? setupHours / monthlyOperatingHoursSaved : null,
  };
}

function calculateNetRangePoint(evidencePoint, humanScenario) {
  const baselineMinutes = humanScenario.baseline_human_minutes;
  const eligibleCases = humanScenario.eligible_cases;
  const localOperatingFloorMinutes = humanScenario.operating_human_minutes;
  const sourceImpliedHumanMinutes = evidencePoint?.human_time_with_ai_minutes ?? null;
  const operatingHumanMinutes = sourceImpliedHumanMinutes == null
    ? localOperatingFloorMinutes
    : Math.max(sourceImpliedHumanMinutes, localOperatingFloorMinutes);
  if (!humanScenario.calculable) {
    return {
      source_reduction_fraction: evidencePoint?.reduction_fraction ?? null,
      source_implied_human_minutes: sourceImpliedHumanMinutes,
      local_operating_floor_minutes: localOperatingFloorMinutes,
      binding_floor: sourceImpliedHumanMinutes != null && sourceImpliedHumanMinutes >= localOperatingFloorMinutes ? "source" : "local",
      operating_human_minutes: operatingHumanMinutes,
      amortized_setup_minutes_per_case: 0,
      human_time_with_ai_minutes: 0,
      human_time_saved_per_case: 0,
      reduction_fraction: 0,
      whole_workload_reduction_fraction: 0,
      human_hours_saved_per_month: 0,
      human_hours_saved_per_year: 0,
      setup_payback_months: null,
    };
  }
  const amortizedSetupMinutesPerCase = humanScenario.components.amortized_setup_minutes_per_case;
  const humanTimeWithAiMinutes = operatingHumanMinutes + amortizedSetupMinutesPerCase;
  const humanTimeSavedPerCase = baselineMinutes - humanTimeWithAiMinutes;
  const recurringTimeSavedPerCase = baselineMinutes - operatingHumanMinutes;
  const humanHoursSavedPerMonth = humanTimeSavedPerCase * eligibleCases / 60;
  const recurringHumanHoursSavedPerMonth = recurringTimeSavedPerCase * eligibleCases / 60;

  return {
    source_reduction_fraction: evidencePoint?.reduction_fraction ?? null,
    source_implied_human_minutes: sourceImpliedHumanMinutes,
    local_operating_floor_minutes: localOperatingFloorMinutes,
    binding_floor: sourceImpliedHumanMinutes != null && sourceImpliedHumanMinutes >= localOperatingFloorMinutes ? "source" : "local",
    operating_human_minutes: operatingHumanMinutes,
    amortized_setup_minutes_per_case: amortizedSetupMinutesPerCase,
    human_time_with_ai_minutes: humanTimeWithAiMinutes,
    human_time_saved_per_case: humanTimeSavedPerCase,
    reduction_fraction: humanTimeSavedPerCase / baselineMinutes,
    whole_workload_reduction_fraction: humanScenario.eligible_share * humanTimeSavedPerCase / baselineMinutes,
    human_hours_saved_per_month: humanHoursSavedPerMonth,
    human_hours_saved_per_year: humanHoursSavedPerMonth * 12,
    setup_payback_months: recurringHumanHoursSavedPerMonth > 0
      ? humanScenario.setup_hours / recurringHumanHoursSavedPerMonth
      : null,
  };
}

export function buildNetPlanningRange(evidenceTransfer, humanScenario) {
  const evidenceScenarios = evidenceTransfer?.ok ? evidenceTransfer.scenarios : null;
  return {
    calculable: humanScenario.calculable,
    unavailable_reason: humanScenario.calculable ? null : "no_eligible_cases",
    source: evidenceScenarios ? "external_evidence" : "local_hypothesis",
    compatibility: evidenceScenarios ? evidenceTransfer.compatibility.status : "not_available",
    evidence_id: evidenceScenarios ? evidenceTransfer.evidence_id : null,
    method: "greater_residual_plus_amortized_setup",
    scenarios: {
      low: calculateNetRangePoint(evidenceScenarios?.low, humanScenario),
      central: calculateNetRangePoint(evidenceScenarios?.central, humanScenario),
      high: calculateNetRangePoint(evidenceScenarios?.high, humanScenario),
    },
  };
}

export function derivePlanningRange(evidenceTransfer, humanScenario, target = null) {
  const netRange = buildNetPlanningRange(evidenceTransfer, humanScenario);
  const components = humanScenario.components;
  return {
    calculable: netRange.calculable,
    unavailable_reason: netRange.unavailable_reason,
    source: netRange.source,
    low: netRange.calculable ? netRange.scenarios.low.reduction_fraction : 0,
    central: netRange.calculable ? netRange.scenarios.central.reduction_fraction : 0,
    high: netRange.calculable ? netRange.scenarios.high.reduction_fraction : 0,
    compatibility: netRange.compatibility,
    evidence_id: netRange.evidence_id,
    target,
    method: netRange.method,
    human_work: {
      preparation_minutes: components.preparation_minutes,
      supervision_minutes: components.supervision_minutes,
      verification_minutes: components.verification_minutes,
      correction_minutes: components.correction_minutes,
      exception_rate_percent: components.exception_rate * 100,
      exception_minutes: components.exception_minutes,
      expected_exception_minutes: components.expected_exception_minutes,
      operating_human_minutes: humanScenario.operating_human_minutes,
    },
    setup: {
      setup_hours: humanScenario.setup_hours,
      amortization_months: humanScenario.amortization_months,
      amortized_setup_minutes_per_case: components.amortized_setup_minutes_per_case,
    },
  };
}
