const COMPATIBILITY_ORDER = { compatible: 0, partial: 1, context: 2, incompatible: 3 };
const GRADE_ORDER = { A: 0, B: 1, C: 2, D: 3, E: 4 };

const finite = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const bounded = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, finite(value, minimum)));

export function assessEvidenceCompatibility(record, target) {
  if (!record || !target) return { status: "incompatible", reasons: ["missing_contract"] };

  const transfer = record.transfer ?? {};
  const profileMatch = transfer.allowed_profiles?.includes(target.task_profile_id) === true;
  const modeMatch = transfer.work_modes?.includes(target.work_mode) === true;
  const architectureMatch = target.architecture == null || record.task_contract?.architectures?.includes(target.architecture) === true;
  const autonomyMatch = target.autonomy_level == null || record.task_contract?.autonomy_levels?.includes(target.autonomy_level) === true;
  const qualityMatch = transfer.quality_gates?.includes(target.quality_gate) === true;
  const expertiseMatch = transfer.expertise_levels?.includes(target.expertise_level) === true;
  const reasons = [];
  if (!profileMatch) reasons.push("task_profile");
  if (!modeMatch) reasons.push("work_mode");
  if (!architectureMatch) reasons.push("architecture");
  if (!autonomyMatch) reasons.push("autonomy_level");
  if (!qualityMatch) reasons.push("quality_gate");
  if (!expertiseMatch) reasons.push("expertise_level");

  const hasQuantitativeTime = transfer.quantitative_use === "usable"
    && record.measurement?.human_active_time_measured === true
    && record.measurement?.human_time_reduction_fraction != null;

  if (!profileMatch) return { status: "incompatible", reasons };
  if (!hasQuantitativeTime) return { status: "context", reasons: ["context_only", ...reasons] };
  if (!modeMatch || !qualityMatch || !expertiseMatch || !architectureMatch || !autonomyMatch) return { status: "partial", reasons };
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

function calculateRangePoint(reductionFraction, baselineMinutes, monthlyCases, eligibleShare, totalBaselineHumanHours) {
  const eligibleCases = monthlyCases * eligibleShare;
  const baselineEligibleHours = eligibleCases * baselineMinutes / 60;
  const humanTimeWithAiMinutes = baselineMinutes * (1 - reductionFraction);
  const humanHoursSavedPerMonth = baselineEligibleHours * reductionFraction;
  const workloadDenominatorValid = totalBaselineHumanHours >= baselineEligibleHours && totalBaselineHumanHours > 0;
  return {
    reduction_fraction: reductionFraction,
    human_time_with_ai_minutes: humanTimeWithAiMinutes,
    human_hours_saved_per_month: humanHoursSavedPerMonth,
    human_hours_saved_per_year: humanHoursSavedPerMonth * 12,
    whole_workload_reduction_fraction: workloadDenominatorValid ? humanHoursSavedPerMonth / totalBaselineHumanHours : null,
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
  const totalBaselineHumanHours = bounded(workload?.total_baseline_human_hours, 0, 1000000000);

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
      total_baseline_human_hours: totalBaselineHumanHours,
    },
    scenarios: {
      low: calculateRangePoint(range.low, baselineMinutes, monthlyCases, eligibleShare, totalBaselineHumanHours),
      central: calculateRangePoint(range.central, baselineMinutes, monthlyCases, eligibleShare, totalBaselineHumanHours),
      high: calculateRangePoint(range.high, baselineMinutes, monthlyCases, eligibleShare, totalBaselineHumanHours),
    },
  };
}

export function calculateHumanTimeScenario(input) {
  const baselineMinutes = bounded(input?.baseline_human_minutes, 0.1, 10080);
  const monthlyCases = bounded(input?.monthly_cases, 0, 1000000);
  const eligibleShare = bounded(input?.eligible_share, 0, 100) / 100;
  const eligibleCases = monthlyCases * eligibleShare;
  const totalBaselineHumanHours = bounded(input?.total_baseline_human_hours, 0, 1000000000);
  const baselineEligibleHumanHours = eligibleCases * baselineMinutes / 60;
  const workloadDenominatorValid = totalBaselineHumanHours >= baselineEligibleHumanHours && totalBaselineHumanHours > 0;
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
    total_baseline_human_hours: totalBaselineHumanHours,
    workload_denominator_valid: workloadDenominatorValid,
    calculable,
    baseline_eligible_human_hours: baselineEligibleHumanHours,
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
    whole_workload_reduction_fraction: workloadDenominatorValid ? monthlyHumanHoursSaved / totalBaselineHumanHours : null,
    human_hours_saved_per_month: monthlyHumanHoursSaved,
    human_hours_saved_per_year: monthlyHumanHoursSaved * 12,
    accepted_throughput_ratio: humanTimeWithAiMinutes > 0 ? baselineMinutes / humanTimeWithAiMinutes : null,
    setup_payback_months: monthlyOperatingHoursSaved > 0 ? setupHours / monthlyOperatingHoursSaved : null,
  };
}

function calculateNetRangePoint(evidencePoint, humanScenario, options = {}) {
  const baselineMinutes = humanScenario.baseline_human_minutes;
  const eligibleCases = humanScenario.eligible_cases;
  const localOperatingFloorMinutes = humanScenario.operating_human_minutes;
  const sourceImpliedHumanMinutes = evidencePoint?.human_time_with_ai_minutes ?? null;
  const sourceSetupRemoved = sourceImpliedHumanMinutes == null ? 0
    : Math.min(sourceImpliedHumanMinutes, bounded(options.source_setup_minutes, 0, 10080));
  const sourceOperatingMinutes = sourceImpliedHumanMinutes == null ? null : sourceImpliedHumanMinutes - sourceSetupRemoved;
  const additionalMinutes = bounded(options.additional_minutes, 0, 10080);
  const operatingHumanMinutes = (sourceOperatingMinutes == null
    ? localOperatingFloorMinutes
    : Math.max(sourceOperatingMinutes, localOperatingFloorMinutes)) + additionalMinutes;
  if (!humanScenario.calculable) {
    const recurringTimeSavedPerCase = baselineMinutes - operatingHumanMinutes;
    return {
      source_reduction_fraction: evidencePoint?.reduction_fraction ?? null,
      source_implied_human_minutes: sourceImpliedHumanMinutes,
      source_setup_removed_minutes: sourceSetupRemoved,
      additional_minutes: additionalMinutes,
      local_operating_floor_minutes: localOperatingFloorMinutes,
      binding_floor: sourceOperatingMinutes != null && sourceOperatingMinutes >= localOperatingFloorMinutes ? "source" : "local",
      operating_human_minutes: operatingHumanMinutes,
      amortized_setup_minutes_per_case: null,
      human_time_with_ai_minutes: null,
      human_time_saved_per_case: null,
      recurring_reduction_fraction: recurringTimeSavedPerCase / baselineMinutes,
      recurring_human_hours_saved_per_month: 0,
      reduction_fraction: null,
      whole_workload_reduction_fraction: null,
      human_hours_saved_per_month: null,
      human_hours_saved_per_year: null,
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
    source_setup_removed_minutes: sourceSetupRemoved,
    additional_minutes: additionalMinutes,
    local_operating_floor_minutes: localOperatingFloorMinutes,
    binding_floor: sourceOperatingMinutes != null && sourceOperatingMinutes >= localOperatingFloorMinutes ? "source" : "local",
    operating_human_minutes: operatingHumanMinutes,
    amortized_setup_minutes_per_case: amortizedSetupMinutesPerCase,
    human_time_with_ai_minutes: humanTimeWithAiMinutes,
    human_time_saved_per_case: humanTimeSavedPerCase,
    recurring_reduction_fraction: recurringTimeSavedPerCase / baselineMinutes,
    recurring_human_hours_saved_per_month: recurringHumanHoursSavedPerMonth,
    reduction_fraction: humanTimeSavedPerCase / baselineMinutes,
    whole_workload_reduction_fraction: humanScenario.workload_denominator_valid
      ? humanHoursSavedPerMonth / humanScenario.total_baseline_human_hours
      : null,
    human_hours_saved_per_month: humanHoursSavedPerMonth,
    human_hours_saved_per_year: humanHoursSavedPerMonth * 12,
    setup_payback_months: recurringHumanHoursSavedPerMonth > 0
      ? humanScenario.setup_hours / recurringHumanHoursSavedPerMonth
      : null,
  };
}

export function normalizePlanningOptions(options = {}) {
  options = options ?? {};
  const sensitivity = options.sensitivity ?? {};
  return {
    use_source: options.use_source !== false,
    additional_minutes: bounded(options.additional_minutes, 0, 10080),
    source_setup_minutes: bounded(options.source_setup_minutes, 0, 10080),
    sensitivity: {
      enabled: sensitivity.enabled === true,
      cautious_review_minutes: bounded(sensitivity.cautious_review_minutes, 0, 10080),
      favorable_review_minutes: bounded(sensitivity.favorable_review_minutes, 0, 10080),
      cautious_exception_points: bounded(sensitivity.cautious_exception_points, 0, 100),
      favorable_exception_points: bounded(sensitivity.favorable_exception_points, 0, 100),
      cautious_setup_hours: bounded(sensitivity.cautious_setup_hours, 0, 1000000),
      favorable_setup_hours: bounded(sensitivity.favorable_setup_hours, 0, 1000000),
    },
  };
}

function sensitivityScenario(humanScenario, options, point) {
  if (!options.sensitivity.enabled || point === "central") return humanScenario;
  const c = humanScenario.components;
  const cautious = point === "low";
  const sign = cautious ? 1 : -1;
  const prefix = cautious ? "cautious" : "favorable";
  return calculateHumanTimeScenario({
    baseline_human_minutes: humanScenario.baseline_human_minutes,
    monthly_cases: humanScenario.monthly_cases,
    eligible_share: humanScenario.eligible_share * 100,
    total_baseline_human_hours: humanScenario.total_baseline_human_hours,
    preparation_minutes: c.preparation_minutes,
    supervision_minutes: c.supervision_minutes,
    verification_minutes: c.verification_minutes + sign * options.sensitivity[prefix + "_review_minutes"],
    correction_minutes: c.correction_minutes,
    exception_rate: c.exception_rate * 100 + sign * options.sensitivity[prefix + "_exception_points"],
    exception_minutes: c.exception_minutes,
    setup_hours: humanScenario.setup_hours + sign * options.sensitivity[prefix + "_setup_hours"],
    amortization_months: humanScenario.amortization_months,
  });
}

export function buildNetPlanningRange(evidenceTransfer, humanScenario, inputOptions = {}) {
  const options = normalizePlanningOptions(inputOptions);
  const evidenceScenarios = evidenceTransfer?.ok && options.use_source ? evidenceTransfer.scenarios : null;
  const eligibleCaseCalculable = humanScenario.calculable;
  const wholeWorkloadCalculable = eligibleCaseCalculable && humanScenario.workload_denominator_valid;
  return {
    calculable: eligibleCaseCalculable,
    eligible_case_calculable: eligibleCaseCalculable,
    whole_workload_calculable: wholeWorkloadCalculable,
    unavailable_reason: !eligibleCaseCalculable
      ? "no_eligible_cases"
      : wholeWorkloadCalculable ? null : "invalid_workload_denominator",
    source: evidenceScenarios ? "external_evidence" : "local_hypothesis",
    compatibility: evidenceScenarios ? evidenceTransfer.compatibility.status : "not_available",
    evidence_id: evidenceScenarios ? evidenceTransfer.evidence_id : null,
    method: "greater_residual_plus_amortized_setup",
    scenarios: {
      low: calculateNetRangePoint(evidenceScenarios?.low, sensitivityScenario(humanScenario, options, "low"), options),
      central: calculateNetRangePoint(evidenceScenarios?.central, humanScenario, options),
      high: calculateNetRangePoint(evidenceScenarios?.high, sensitivityScenario(humanScenario, options, "high"), options),
    },
  };
}

export function derivePlanningRange(evidenceTransfer, humanScenario, target = null, options = {}) {
  const netRange = buildNetPlanningRange(evidenceTransfer, humanScenario, options);
  const components = humanScenario.components;
  return {
    calculable: netRange.whole_workload_calculable,
    unavailable_reason: netRange.unavailable_reason,
    source: netRange.source,
    low: netRange.whole_workload_calculable ? netRange.scenarios.low.reduction_fraction : 0,
    central: netRange.whole_workload_calculable ? netRange.scenarios.central.reduction_fraction : 0,
    high: netRange.whole_workload_calculable ? netRange.scenarios.high.reduction_fraction : 0,
    compatibility: netRange.compatibility,
    evidence_id: netRange.evidence_id,
    target,
    method: netRange.method,
    assumptions: normalizePlanningOptions(options),
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
