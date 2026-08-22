export type IntegrationMode = "copilot" | "agent" | "agency";
export type QualityGate = "draft" | "reviewed" | "production";
export type ExpertiseLevel = "developing" | "mixed" | "experienced";
export type CompatibilityStatus = "compatible" | "partial" | "context" | "incompatible";
export type EvidenceTarget = {
  task_profile_id: string;
  integration_mode: IntegrationMode;
  quality_gate: QualityGate;
  expertise_level: ExpertiseLevel;
};
export type LocalizedText = { en: string; fr: string };
export type FractionRange = { low: number; central: number; high: number };
export type TaskTimeEvidenceRecord = {
  evidence_id: string;
  title: LocalizedText;
  reader_summary: LocalizedText;
  organization_context: { kind: string; name: string; region: string };
  task_contract: {
    profile_id: string;
    description: LocalizedText;
    integration_mode: IntegrationMode;
    autonomy_levels: string[];
    output_unit: LocalizedText;
    quality_gate: QualityGate;
    operator_expertise: ExpertiseLevel;
    verifiability: "low" | "medium" | "high";
    use_patterns: string[];
  };
  measurement: {
    evidence_grade: "A" | "B" | "C" | "D" | "E";
    design: string;
    sample_size: number | null;
    time_scope: string;
    human_active_time_measured: boolean;
    machine_runtime_measured: boolean;
    human_time_reduction_fraction: FractionRange | null;
    absolute_saving: { value: number; unit: string; direction: string } | null;
    outcome_change: { value: number; unit: string; direction: string } | null;
    quality_change: { value: number; unit: string; direction: string } | null;
    notes: LocalizedText;
  };
  transfer: {
    quantitative_use: "usable" | "context_only";
    allowed_profiles: string[];
    integration_modes: IntegrationMode[];
    quality_gates: QualityGate[];
    expertise_levels: ExpertiseLevel[];
    preconditions: LocalizedText;
    limits: LocalizedText;
  };
  sources: Array<{ title: string; url: string; published: string; accessed_on: string; source_type: string }>;
};
export type TaskTimeRegistry = {
  schema_version: "1.0.0";
  published_on: string;
  boundary: LocalizedText;
  evidence_grades: Record<"A" | "B" | "C" | "D" | "E", LocalizedText>;
  task_profiles: Array<{
    profile_id: string;
    label: LocalizedText;
    description: LocalizedText;
    use_patterns: string[];
    output_unit: LocalizedText;
    quality_gates: QualityGate[];
  }>;
  records: TaskTimeEvidenceRecord[];
};
export type WorkloadInput = { baseline_human_minutes: number; monthly_cases: number; eligible_share: number };
export type EvidenceRangePoint = {
  reduction_fraction: number;
  human_time_with_ai_minutes: number;
  human_hours_saved_per_month: number;
  human_hours_saved_per_year: number;
  whole_workload_reduction_fraction: number;
};
export type EvidenceTransferResult = {
  ok: true;
  evidence_id: string;
  evidence_grade: "A" | "B" | "C" | "D" | "E";
  compatibility: { status: "compatible" | "partial"; reasons: string[] };
  workload: WorkloadInput & { eligible_share: number; eligible_cases: number };
  scenarios: { low: EvidenceRangePoint; central: EvidenceRangePoint; high: EvidenceRangePoint };
} | {
  ok: false;
  compatibility: { status: CompatibilityStatus; reasons: string[] };
};
export type HumanTimeInput = WorkloadInput & {
  preparation_minutes: number;
  supervision_minutes: number;
  verification_minutes: number;
  correction_minutes: number;
  exception_rate: number;
  exception_minutes: number;
  setup_hours: number;
  amortization_months: number;
};
export type HumanTimeScenario = {
  baseline_human_minutes: number;
  monthly_cases: number;
  eligible_share: number;
  eligible_cases: number;
  calculable: boolean;
  baseline_eligible_human_hours: number;
  components: Record<string, number>;
  operating_human_minutes: number;
  setup_hours: number;
  amortization_months: number;
  human_time_with_ai_minutes: number;
  human_time_saved_per_case: number;
  reduction_fraction: number;
  whole_workload_reduction_fraction: number;
  human_hours_saved_per_month: number;
  human_hours_saved_per_year: number;
  accepted_throughput_ratio: number | null;
  setup_payback_months: number | null;
};
export type NetPlanningRangePoint = {
  source_reduction_fraction: number | null;
  source_implied_human_minutes: number | null;
  local_operating_floor_minutes: number;
  binding_floor: "source" | "local";
  operating_human_minutes: number;
  amortized_setup_minutes_per_case: number | null;
  human_time_with_ai_minutes: number | null;
  human_time_saved_per_case: number | null;
  recurring_reduction_fraction: number;
  recurring_human_hours_saved_per_month: number;
  reduction_fraction: number | null;
  whole_workload_reduction_fraction: number | null;
  human_hours_saved_per_month: number | null;
  human_hours_saved_per_year: number | null;
  setup_payback_months: number | null;
};
export type NetPlanningRange = {
  calculable: boolean;
  unavailable_reason: "no_eligible_cases" | null;
  source: "external_evidence" | "local_hypothesis";
  compatibility: string;
  evidence_id: string | null;
  method: "greater_residual_plus_amortized_setup";
  scenarios: { low: NetPlanningRangePoint; central: NetPlanningRangePoint; high: NetPlanningRangePoint };
};
export function assessEvidenceCompatibility(record: TaskTimeEvidenceRecord | undefined, target: EvidenceTarget): { status: CompatibilityStatus; reasons: string[] };
export function listEvidenceOptions(registry: TaskTimeRegistry, target: EvidenceTarget): Array<{ record: TaskTimeEvidenceRecord; compatibility: { status: CompatibilityStatus; reasons: string[] } }>;
export function buildEvidenceTransfer(record: TaskTimeEvidenceRecord | undefined, target: EvidenceTarget, workload: WorkloadInput): EvidenceTransferResult;
export function calculateHumanTimeScenario(input: HumanTimeInput): HumanTimeScenario;
export function buildNetPlanningRange(evidenceTransfer: EvidenceTransferResult, humanScenario: HumanTimeScenario): NetPlanningRange;
export function derivePlanningRange(evidenceTransfer: EvidenceTransferResult, humanScenario: ReturnType<typeof calculateHumanTimeScenario>, target?: EvidenceTarget | null): {
  calculable: boolean;
  unavailable_reason: "no_eligible_cases" | null;
  source: "external_evidence" | "local_hypothesis";
  low: number;
  central: number;
  high: number;
  compatibility: string;
  evidence_id: string | null;
  target: EvidenceTarget | null;
  method: "greater_residual_plus_amortized_setup";
  human_work: {
    preparation_minutes: number;
    supervision_minutes: number;
    verification_minutes: number;
    correction_minutes: number;
    exception_rate_percent: number;
    exception_minutes: number;
    expected_exception_minutes: number;
    operating_human_minutes: number;
  };
  setup: {
    setup_hours: number;
    amortization_months: number;
    amortized_setup_minutes_per_case: number;
  };
};
