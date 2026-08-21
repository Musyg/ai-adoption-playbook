const domains = new Set(["scope", "risk", "architecture", "evaluation", "controls", "ownership", "delivery"]);
const recommendations = new Set(["review", "reassess", "restart"]);
const decisions = new Set(["pending", "accepted", "reassess", "restart"]);
const organizationTypes = new Set(["independent", "tpe", "pme", "nonprofit", "public"]);
const usePatterns = new Set(["generation", "retrieval", "classification", "prediction", "conversation", "multimodal", "agentic"]);
const jurisdictions = new Set(["CH", "EU", "BOTH"]);
const integrationLevels = new Set(["copilot", "agent", "agency"]);
const supportedSchemaVersions = new Set(["0.1.0", "0.2.0", "0.3.0"]);

const riskFields = new Set(["riskImpact", "dataSensitivity", "automatedDecision", "externalInteraction", "affectedPeople", "legalRoute"]);
const architectureFields = new Set(["knowledgeSource", "externalEffects", "approvalPoint", "supplier", "exitPlan"]);
const evaluationFields = new Set(["baselineVolume", "baselineMinutes", "baselineQuality", "metric", "threshold", "sample", "criticalSegments", "evaluationOwner", "pilotDecision"]);
const ownershipFields = new Set(["owner", "decisionOwner", "retirementOwner"]);
const criticalLifecycleFields = new Set(["riskImpact", "dataSensitivity", "automatedDecision", "externalInteraction", "knowledgeSource", "externalEffects", "approvalPoint", "supplier"]);
const domainOrder = ["scope", "risk", "architecture", "evaluation", "controls", "ownership", "delivery"];

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasOnlyKeys(value, allowed) {
  return Object.keys(value).every((key) => allowed.has(key));
}

function isIsoDate(value) {
  return typeof value === "string" && value.length > 0 && Number.isFinite(Date.parse(value));
}

function canonical(value) {
  if (value === undefined || value === null || value === "") return "";
  if (Array.isArray(value)) return JSON.stringify([...value].sort((left, right) => typeof left === "number" && typeof right === "number" ? left - right : String(left).localeCompare(String(right))));
  return typeof value === "string" ? value : JSON.stringify(value);
}

function cloneArtifacts(artifacts) {
  return {
    system_register: { fields: Object.fromEntries(Object.entries(artifacts.system_register.fields).map(([id, field]) => [id, { ...field }])) },
    risk_assessment: { fields: Object.fromEntries(Object.entries(artifacts.risk_assessment.fields).map(([id, field]) => [id, { ...field }])) },
    evaluation_plan: { fields: Object.fromEntries(Object.entries(artifacts.evaluation_plan.fields).map(([id, field]) => [id, { ...field }])) },
    implementation_checklist: { items: Object.fromEntries(Object.entries(artifacts.implementation_checklist.items).map(([id, item]) => [id, { ...item }])) },
  };
}

export function createProjectSnapshot(source) {
  return {
    context: { ...source.context },
    fields: { ...source.fields },
    conditioned_controls: { ...source.conditioned_controls },
    matched_control_ids: [...new Set(source.matched_control_ids)].sort(),
    completed_phases: [...new Set(source.completed_phases)].sort((left, right) => left - right),
    artifacts: cloneArtifacts(source.artifacts),
  };
}

function entries(snapshot) {
  const result = new Map();
  for (const [id, value] of Object.entries(snapshot.context)) result.set(`context:${id}`, canonical(value));
  for (const [id, value] of Object.entries(snapshot.fields)) result.set(`lifecycle:${id}`, canonical(value));
  for (const [id, value] of Object.entries(snapshot.conditioned_controls)) result.set(`security:${id}`, canonical(value));
  result.set("controls:matched", canonical(snapshot.matched_control_ids));
  result.set("lifecycle:completed_phases", canonical(snapshot.completed_phases));
  for (const artifactId of ["system_register", "risk_assessment", "evaluation_plan"]) {
    for (const [id, field] of Object.entries(snapshot.artifacts[artifactId].fields)) result.set(`${artifactId}:${id}`, canonical(field.value));
  }
  for (const [id, item] of Object.entries(snapshot.artifacts.implementation_checklist.items)) {
    for (const property of ["status", "owner", "due_date", "evidence_ref"]) result.set(`checklist:${id}:${property}`, canonical(item[property]));
  }
  return result;
}

function domainFor(path) {
  const [group, id] = path.split(":");
  if (group === "context") {
    if (["risk_level", "jurisdiction"].includes(id)) return "risk";
    if (["integration_level", "autonomy_level"].includes(id)) return "architecture";
    return "scope";
  }
  if (group === "security" || group === "controls") return "controls";
  if (group === "risk_assessment") return "risk";
  if (group === "evaluation_plan") return "evaluation";
  if (group === "system_register") return ownershipFields.has(id) ? "ownership" : "scope";
  if (group === "checklist") return "delivery";
  if (group === "lifecycle") {
    if (riskFields.has(id)) return "risk";
    if (architectureFields.has(id)) return "architecture";
    if (evaluationFields.has(id)) return "evaluation";
    if (ownershipFields.has(id)) return "ownership";
    if (id === "completed_phases") return "delivery";
  }
  return "scope";
}

function recommendationFor(path, before, after) {
  const [group, id] = path.split(":");
  const property = path.split(":").at(-1);
  if (group === "context" && ["use_pattern", "jurisdiction", "integration_level"].includes(id)) return "restart";
  if (group === "context" && ["autonomy_level", "risk_level"].includes(id)) return Number(after) > Number(before) ? "restart" : "reassess";
  if (group === "lifecycle" && criticalLifecycleFields.has(id)) return "restart";
  if (group === "risk_assessment" || group === "evaluation_plan" || group === "security" || group === "controls") return "reassess";
  if (group === "lifecycle" && (riskFields.has(id) || architectureFields.has(id) || evaluationFields.has(id))) return "reassess";
  if (group === "lifecycle" && id === "completed_phases") {
    const oldCount = before ? JSON.parse(before).length : 0;
    const newCount = after ? JSON.parse(after).length : 0;
    return newCount < oldCount ? "reassess" : "review";
  }
  if (group === "checklist" && property === "status" && before === "done" && after !== "done") return "reassess";
  return "review";
}

function blankDecision(path, before, after) {
  return {
    path,
    domain: domainFor(path),
    before,
    after,
    recommended_action: recommendationFor(path, before, after),
    decision: "pending",
    owner: "",
    due_date: "",
    evidence_ref: "",
    note: "",
  };
}

function compare(snapshot, current, previousItems = {}) {
  const baselineEntries = entries(snapshot);
  const currentEntries = entries(current);
  const paths = [...new Set([...baselineEntries.keys(), ...currentEntries.keys()])];
  return Object.fromEntries(paths.flatMap((path) => {
    const before = baselineEntries.get(path) ?? "";
    const after = currentEntries.get(path) ?? "";
    if (before === after) return [];
    const fresh = blankDecision(path, before, after);
    const previous = previousItems[path];
    const item = previous && previous.before === before && previous.after === after
      ? { ...fresh, decision: previous.decision, owner: previous.owner, due_date: previous.due_date, evidence_ref: previous.evidence_ref, note: previous.note }
      : fresh;
    return [[path, item]];
  }).sort((left, right) => {
    const domainDifference = domainOrder.indexOf(left[1].domain) - domainOrder.indexOf(right[1].domain);
    return domainDifference || left[0].localeCompare(right[0]);
  }));
}

export function createProjectChangeReview(baselineDossier, currentSnapshot, comparedAt, sourceSchemaVersion = baselineDossier.schema_version) {
  const snapshot = createProjectSnapshot(baselineDossier);
  return {
    baseline: {
      dossier_id: baselineDossier.dossier_id,
      updated_at: baselineDossier.updated_at,
      schema_version: sourceSchemaVersion,
      playbook_version: baselineDossier.playbook_version,
      snapshot,
    },
    compared_at: comparedAt,
    items: compare(snapshot, currentSnapshot),
  };
}

export function materializeProjectChangeReview(review, currentSnapshot) {
  if (!review) return null;
  return {
    baseline: {
      ...review.baseline,
      snapshot: createProjectSnapshot(review.baseline.snapshot),
    },
    compared_at: review.compared_at,
    items: compare(review.baseline.snapshot, currentSnapshot, review.items),
  };
}

export function cloneProjectChangeReview(review) {
  if (!review) return null;
  return {
    baseline: { ...review.baseline, snapshot: createProjectSnapshot(review.baseline.snapshot) },
    compared_at: review.compared_at,
    items: Object.fromEntries(Object.entries(review.items).map(([id, item]) => [id, { ...item }])),
  };
}

function isStringRecord(value) {
  return isRecord(value) && Object.values(value).every((item) => typeof item === "string");
}

function isBooleanRecord(value) {
  return isRecord(value) && Object.values(value).every((item) => typeof item === "boolean");
}

function isArtifactField(value) {
  return isRecord(value) && hasOnlyKeys(value, new Set(["value", "mode"])) && typeof value.value === "string" && ["linked", "manual"].includes(value.mode);
}

function isChecklistItem(value) {
  return isRecord(value)
    && hasOnlyKeys(value, new Set(["status", "status_mode", "owner", "due_date", "evidence_ref"]))
    && ["not_started", "in_progress", "done", "not_applicable"].includes(value.status)
    && ["linked", "manual"].includes(value.status_mode)
    && [value.owner, value.due_date, value.evidence_ref].every((item) => typeof item === "string");
}

function isArtifacts(value) {
  if (!isRecord(value) || !hasOnlyKeys(value, new Set(["system_register", "risk_assessment", "evaluation_plan", "implementation_checklist"]))) return false;
  for (const id of ["system_register", "risk_assessment", "evaluation_plan"]) {
    if (!isRecord(value[id]) || !hasOnlyKeys(value[id], new Set(["fields"])) || !isRecord(value[id].fields) || !Object.values(value[id].fields).every(isArtifactField)) return false;
  }
  return isRecord(value.implementation_checklist)
    && hasOnlyKeys(value.implementation_checklist, new Set(["items"]))
    && isRecord(value.implementation_checklist.items)
    && Object.values(value.implementation_checklist.items).every(isChecklistItem);
}

export function isProjectSnapshot(value) {
  if (!isRecord(value) || !hasOnlyKeys(value, new Set(["context", "fields", "conditioned_controls", "matched_control_ids", "completed_phases", "artifacts"]))) return false;
  return isRecord(value.context)
    && hasOnlyKeys(value.context, new Set(["organization_type", "use_pattern", "jurisdiction", "integration_level", "autonomy_level", "risk_level"]))
    && organizationTypes.has(value.context.organization_type)
    && usePatterns.has(value.context.use_pattern)
    && jurisdictions.has(value.context.jurisdiction)
    && integrationLevels.has(value.context.integration_level)
    && Number.isInteger(value.context.autonomy_level)
    && value.context.autonomy_level >= 0
    && value.context.autonomy_level <= 4
    && Number.isInteger(value.context.risk_level)
    && value.context.risk_level >= 0
    && value.context.risk_level <= 3
    && isStringRecord(value.fields)
    && isBooleanRecord(value.conditioned_controls)
    && Array.isArray(value.matched_control_ids)
    && value.matched_control_ids.every((item) => typeof item === "string" && item.length > 0)
    && new Set(value.matched_control_ids).size === value.matched_control_ids.length
    && Array.isArray(value.completed_phases)
    && value.completed_phases.every((item) => Number.isInteger(item) && item >= 0 && item <= 11)
    && new Set(value.completed_phases).size === value.completed_phases.length
    && isArtifacts(value.artifacts);
}

export function isProjectChangeReview(value) {
  if (value === null) return true;
  if (!isRecord(value) || !hasOnlyKeys(value, new Set(["baseline", "compared_at", "items"]))) return false;
  if (!isRecord(value.baseline)
    || !hasOnlyKeys(value.baseline, new Set(["dossier_id", "updated_at", "schema_version", "playbook_version", "snapshot"]))
    || typeof value.baseline.dossier_id !== "string"
    || !/^[A-Za-z0-9][A-Za-z0-9._-]{7,127}$/.test(value.baseline.dossier_id)
    || !isIsoDate(value.baseline.updated_at)
    || !supportedSchemaVersions.has(value.baseline.schema_version)
    || value.baseline.playbook_version !== "0.2.2"
    || !isProjectSnapshot(value.baseline.snapshot)
    || !isIsoDate(value.compared_at)
    || !isRecord(value.items)) return false;
  return Object.entries(value.items).every(([id, item]) => isRecord(item)
    && id === item.path
    && hasOnlyKeys(item, new Set(["path", "domain", "before", "after", "recommended_action", "decision", "owner", "due_date", "evidence_ref", "note"]))
    && typeof item.path === "string"
    && domains.has(item.domain)
    && typeof item.before === "string"
    && typeof item.after === "string"
    && recommendations.has(item.recommended_action)
    && decisions.has(item.decision)
    && [item.owner, item.due_date, item.evidence_ref, item.note].every((field) => typeof field === "string"));
}
