const artifactFieldSources = {
  system_register: {
    system_id: [],
    name: ["project"],
    owner: ["owner"],
    purpose: ["problem"],
    business_process: ["workInput", "baselineOutcome"],
    affected_people: ["affected"],
    data_classes: ["workData", "dataSensitivity"],
    provider_version: ["supplier"],
    human_approval: ["approvalPoint", "workDecision"],
    next_review: ["reviewDate", "decisionDate"],
    decision_reference: ["evidenceRefs"],
  },
  risk_assessment: {
    evaluator: ["owner"],
    next_review: ["reviewDate", "decisionDate"],
    data_categories: ["workData", "dataSensitivity"],
    data_provenance: ["workData"],
    retention_transfers: [],
    transparency_recourse: [],
    harm_scenarios: [],
    mitigations: [],
    residual_risk_authority: ["owner"],
    decision: ["decisionStatus"],
    conditions: ["decisionRationale"],
  },
  evaluation_plan: {
    decision_owner: ["owner"],
    deadline: ["decisionDate"],
    test_provenance: [],
    frozen_cases: ["evaluationCases"],
    baseline: ["baselineOutcome"],
    value_threshold: ["valueFloor"],
    quality_threshold: ["qualityFloor"],
    critical_segments: ["criticalSegments"],
    stop_rule: ["stopRule"],
    reproducibility_refs: ["evidenceRefs"],
  },
};

export const PROJECT_PHASE_TASKS = Array.from({ length: 12 }, (_, phase) => ({
  id: `phase:${phase}`,
  phase,
}));

export function createEmptyProjectArtifacts() {
  return {
    system_register: { fields: {} },
    risk_assessment: { fields: {} },
    evaluation_plan: { fields: {} },
    implementation_checklist: { items: {} },
  };
}

function linkedField(existing, value) {
  if (existing?.mode === "manual") return { value: existing.value, mode: "manual" };
  return { value, mode: "linked" };
}

function linkedChecklistItem(existing, status) {
  if (existing?.status_mode === "manual") return { ...existing };
  return {
    status,
    status_mode: "linked",
    owner: existing?.owner ?? "",
    due_date: existing?.due_date ?? "",
    evidence_ref: existing?.evidence_ref ?? "",
  };
}

function manualChecklistItem(existing) {
  return {
    status: existing?.status ?? "not_started",
    status_mode: "manual",
    owner: existing?.owner ?? "",
    due_date: existing?.due_date ?? "",
    evidence_ref: existing?.evidence_ref ?? "",
  };
}

function firstValue(values, sources) {
  for (const source of sources) {
    const value = values[source];
    if (typeof value === "string" && value.trim()) return value;
  }
  return "";
}

/** @param {import("./project-dossier.mjs").ProjectArtifacts} artifacts @param {import("./project-dossier.mjs").ArtifactMaterializationInput} input */
export function materializeProjectArtifacts(artifacts, input) {
  const source = artifacts ?? createEmptyProjectArtifacts();
  const next = createEmptyProjectArtifacts();

  for (const [artifactId, mappings] of Object.entries(artifactFieldSources)) {
    for (const [fieldId, sources] of Object.entries(mappings)) {
      next[artifactId].fields[fieldId] = linkedField(
        source[artifactId]?.fields?.[fieldId],
        firstValue(input.values, sources),
      );
    }
  }

  for (const task of PROJECT_PHASE_TASKS) {
    const id = task.id;
    next.implementation_checklist.items[id] = linkedChecklistItem(
      source.implementation_checklist?.items?.[id],
      input.completed_phases.includes(task.phase) ? "done" : "not_started",
    );
  }
  for (const id of input.security_control_ids) {
    const taskId = `security:${id}`;
    next.implementation_checklist.items[taskId] = linkedChecklistItem(
      source.implementation_checklist?.items?.[taskId],
      input.conditioned_controls[id] ? "done" : "not_started",
    );
  }
  for (const id of input.matched_control_ids) {
    const taskId = `control:${id}`;
    next.implementation_checklist.items[taskId] = manualChecklistItem(
      source.implementation_checklist?.items?.[taskId],
    );
  }

  return next;
}
