import { createEmptyProjectArtifacts } from "./project-artifacts.mjs";

export const PROJECT_DOSSIER_SCHEMA_VERSION = "0.2.0";
export const PROJECT_DOSSIER_STORAGE_KEY = "ai-adoption-playbook:project-dossier:v1";
export const PROJECT_DOSSIER_PLAYBOOK_VERSION = "0.2.2";

const LEGACY_SCHEMA_VERSION = "0.1.0";
const baseKeys = ["schema_version", "playbook_version", "dossier_id", "created_at", "updated_at", "language", "status", "boundary", "context", "active_phase", "fields", "conditioned_controls", "matched_control_ids", "completed_phases"];

const organizationTypes = new Set(["independent", "tpe", "pme", "nonprofit", "public"]);
const usePatterns = new Set(["generation", "retrieval", "classification", "prediction", "conversation", "multimodal", "agentic"]);
const jurisdictions = new Set(["CH", "EU", "BOTH"]);
const integrationLevels = new Set(["copilot", "agent", "agency"]);
const languages = new Set(["en", "fr"]);

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasOnlyKeys(value, allowed) {
  return Object.keys(value).every((key) => allowed.has(key));
}

function isIsoDate(value) {
  return typeof value === "string" && value.length > 0 && Number.isFinite(Date.parse(value));
}

function isStringRecord(value) {
  return isRecord(value) && Object.values(value).every((item) => typeof item === "string");
}

function isBooleanRecord(value) {
  return isRecord(value) && Object.values(value).every((item) => typeof item === "boolean");
}

function isUniqueStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === "string" && item.length > 0) && new Set(value).size === value.length;
}

function isUniquePhaseArray(value) {
  return Array.isArray(value)
    && value.every((item) => Number.isInteger(item) && item >= 0 && item <= 11)
    && new Set(value).size === value.length;
}

function isArtifactField(value) {
  return isRecord(value)
    && hasOnlyKeys(value, new Set(["value", "mode"]))
    && typeof value.value === "string"
    && (value.mode === "linked" || value.mode === "manual");
}

function isArtifactFieldRecord(value) {
  return isRecord(value) && Object.values(value).every(isArtifactField);
}

function isChecklistItem(value) {
  return isRecord(value)
    && hasOnlyKeys(value, new Set(["status", "status_mode", "owner", "due_date", "evidence_ref"]))
    && ["not_started", "in_progress", "done", "not_applicable"].includes(value.status)
    && (value.status_mode === "linked" || value.status_mode === "manual")
    && typeof value.owner === "string"
    && typeof value.due_date === "string"
    && typeof value.evidence_ref === "string";
}

function isProjectArtifacts(value) {
  if (!isRecord(value)
    || !hasOnlyKeys(value, new Set(["system_register", "risk_assessment", "evaluation_plan", "implementation_checklist"]))) return false;
  for (const id of ["system_register", "risk_assessment", "evaluation_plan"]) {
    if (!isRecord(value[id])
      || !hasOnlyKeys(value[id], new Set(["fields"]))
      || !isArtifactFieldRecord(value[id].fields)) return false;
  }
  return isRecord(value.implementation_checklist)
    && hasOnlyKeys(value.implementation_checklist, new Set(["items"]))
    && isRecord(value.implementation_checklist.items)
    && Object.values(value.implementation_checklist.items).every(isChecklistItem);
}

function cloneArtifacts(artifacts) {
  const source = artifacts ?? createEmptyProjectArtifacts();
  return {
    system_register: { fields: Object.fromEntries(Object.entries(source.system_register.fields).map(([id, field]) => [id, { ...field }])) },
    risk_assessment: { fields: Object.fromEntries(Object.entries(source.risk_assessment.fields).map(([id, field]) => [id, { ...field }])) },
    evaluation_plan: { fields: Object.fromEntries(Object.entries(source.evaluation_plan.fields).map(([id, field]) => [id, { ...field }])) },
    implementation_checklist: { items: Object.fromEntries(Object.entries(source.implementation_checklist.items).map(([id, item]) => [id, { ...item }])) },
  };
}

/**
 * Validate an imported dossier without mutating it.
 *
 * @param {unknown} input
 * @returns {{ ok: true, value: import("./project-dossier.mjs").ProjectDossier } | { ok: false, error: string }}
 */
export function parseProjectDossier(input) {
  let dossier = input;
  if (typeof input === "string") {
    try {
      dossier = JSON.parse(input);
    } catch {
      return { ok: false, error: "invalid_json" };
    }
  }

  if (!isRecord(dossier)) return { ok: false, error: "invalid_root" };
  const legacy = dossier.schema_version === LEGACY_SCHEMA_VERSION;
  if (dossier.schema_version !== PROJECT_DOSSIER_SCHEMA_VERSION && !legacy) return { ok: false, error: "unsupported_schema" };
  const allowedKeys = new Set(legacy ? baseKeys : [...baseKeys, "artifacts"]);
  if (!hasOnlyKeys(dossier, allowedKeys)) return { ok: false, error: "invalid_root" };
  if (dossier.playbook_version !== PROJECT_DOSSIER_PLAYBOOK_VERSION) return { ok: false, error: "unsupported_playbook" };
  if (typeof dossier.dossier_id !== "string" || !/^[A-Za-z0-9][A-Za-z0-9._-]{7,127}$/.test(dossier.dossier_id)) return { ok: false, error: "invalid_id" };
  if (!isIsoDate(dossier.created_at) || !isIsoDate(dossier.updated_at) || Date.parse(dossier.created_at) > Date.parse(dossier.updated_at)) return { ok: false, error: "invalid_timestamp" };
  if (!languages.has(dossier.language) || dossier.status !== "working_draft") return { ok: false, error: "invalid_metadata" };
  if (!isRecord(dossier.boundary)
    || !hasOnlyKeys(dossier.boundary, new Set(["local_only", "no_raw_evidence", "not_certification"]))
    || dossier.boundary.local_only !== true
    || dossier.boundary.no_raw_evidence !== true
    || dossier.boundary.not_certification !== true) return { ok: false, error: "invalid_boundary" };
  if (!isRecord(dossier.context)
    || !hasOnlyKeys(dossier.context, new Set(["organization_type", "use_pattern", "jurisdiction", "integration_level", "autonomy_level", "risk_level"]))
    || !organizationTypes.has(dossier.context.organization_type)
    || !usePatterns.has(dossier.context.use_pattern)
    || !jurisdictions.has(dossier.context.jurisdiction)
    || !integrationLevels.has(dossier.context.integration_level)
    || !Number.isInteger(dossier.context.autonomy_level)
    || dossier.context.autonomy_level < 0
    || dossier.context.autonomy_level > 4
    || !Number.isInteger(dossier.context.risk_level)
    || dossier.context.risk_level < 0
    || dossier.context.risk_level > 3) return { ok: false, error: "invalid_context" };
  if (!Number.isInteger(dossier.active_phase) || dossier.active_phase < 0 || dossier.active_phase > 11) return { ok: false, error: "invalid_phase" };
  if (!isStringRecord(dossier.fields)) return { ok: false, error: "invalid_fields" };
  if (!isBooleanRecord(dossier.conditioned_controls)) return { ok: false, error: "invalid_controls" };
  if (!isUniqueStringArray(dossier.matched_control_ids)) return { ok: false, error: "invalid_matched_controls" };
  if (!isUniquePhaseArray(dossier.completed_phases)) return { ok: false, error: "invalid_completed_phases" };
  if (!legacy && !isProjectArtifacts(dossier.artifacts)) return { ok: false, error: "invalid_artifacts" };

  if (legacy) {
    return {
      ok: true,
      migratedFrom: LEGACY_SCHEMA_VERSION,
      value: /** @type {import("./project-dossier.mjs").ProjectDossier} */ ({
        ...dossier,
        schema_version: PROJECT_DOSSIER_SCHEMA_VERSION,
        artifacts: createEmptyProjectArtifacts(),
      }),
    };
  }
  return { ok: true, value: /** @type {import("./project-dossier.mjs").ProjectDossier} */ (dossier) };
}

/** @param {import("./project-dossier.mjs").ProjectDossierInput} input */
export function buildProjectDossier(input) {
  return {
    schema_version: PROJECT_DOSSIER_SCHEMA_VERSION,
    playbook_version: PROJECT_DOSSIER_PLAYBOOK_VERSION,
    dossier_id: input.dossier_id,
    created_at: input.created_at,
    updated_at: input.updated_at,
    language: input.language,
    status: "working_draft",
    boundary: {
      local_only: true,
      no_raw_evidence: true,
      not_certification: true,
    },
    context: { ...input.context },
    active_phase: input.active_phase,
    fields: { ...input.fields },
    conditioned_controls: { ...input.conditioned_controls },
    matched_control_ids: [...new Set(input.matched_control_ids)].sort(),
    completed_phases: [...new Set(input.completed_phases)].sort((left, right) => left - right),
    artifacts: cloneArtifacts(input.artifacts),
  };
}
