export type ProjectDossierContext = {
  organization_type: "independent" | "tpe" | "pme" | "nonprofit" | "public";
  use_pattern: "generation" | "retrieval" | "classification" | "prediction" | "conversation" | "multimodal" | "agentic";
  jurisdiction: "CH" | "EU" | "BOTH";
  integration_level: "copilot" | "agent" | "agency";
  autonomy_level: number;
  risk_level: number;
};

export type ArtifactField = { value: string; mode: "linked" | "manual" };
export type ChecklistStatus = "not_started" | "in_progress" | "done" | "not_applicable";
export type ChecklistItem = {
  status: ChecklistStatus;
  status_mode: "linked" | "manual";
  owner: string;
  due_date: string;
  evidence_ref: string;
};
export type ProjectArtifacts = {
  system_register: { fields: Record<string, ArtifactField> };
  risk_assessment: { fields: Record<string, ArtifactField> };
  evaluation_plan: { fields: Record<string, ArtifactField> };
  implementation_checklist: { items: Record<string, ChecklistItem> };
};
export type ArtifactMaterializationInput = {
  values: Record<string, string>;
  completed_phases: number[];
  conditioned_controls: Record<string, boolean>;
  security_control_ids: string[];
  matched_control_ids: string[];
};

export type ProjectSnapshot = {
  context: ProjectDossierContext;
  fields: Record<string, string>;
  conditioned_controls: Record<string, boolean>;
  matched_control_ids: string[];
  completed_phases: number[];
  artifacts: ProjectArtifacts;
};
export type ChangeDomain = "scope" | "risk" | "architecture" | "evaluation" | "controls" | "ownership" | "delivery";
export type ChangeRecommendation = "review" | "reassess" | "restart";
export type ChangeDecision = "pending" | "accepted" | "reassess" | "restart";
export type ChangeReviewItem = {
  path: string;
  domain: ChangeDomain;
  before: string;
  after: string;
  recommended_action: ChangeRecommendation;
  decision: ChangeDecision;
  owner: string;
  due_date: string;
  evidence_ref: string;
  note: string;
};
export type ProjectChangeReview = {
  baseline: {
    dossier_id: string;
    updated_at: string;
    schema_version: string;
    playbook_version: string;
    snapshot: ProjectSnapshot;
  };
  compared_at: string;
  items: Record<string, ChangeReviewItem>;
};

export type ProjectDossier = {
  schema_version: "0.3.0";
  playbook_version: "0.2.2";
  dossier_id: string;
  created_at: string;
  updated_at: string;
  language: "en" | "fr";
  status: "working_draft";
  boundary: { local_only: true; no_raw_evidence: true; not_certification: true };
  context: ProjectDossierContext;
  active_phase: number;
  fields: Record<string, string>;
  conditioned_controls: Record<string, boolean>;
  matched_control_ids: string[];
  completed_phases: number[];
  artifacts: ProjectArtifacts;
  change_review: ProjectChangeReview | null;
};

export type ProjectDossierInput = Omit<ProjectDossier, "schema_version" | "playbook_version" | "status" | "boundary">;

export const PROJECT_DOSSIER_SCHEMA_VERSION: "0.3.0";
export const PROJECT_DOSSIER_STORAGE_KEY: "ai-adoption-playbook:project-dossier:v1";
export const PROJECT_DOSSIER_PLAYBOOK_VERSION: "0.2.2";
export function parseProjectDossier(input: unknown): { ok: true; value: ProjectDossier; migratedFrom?: "0.1.0" | "0.2.0" } | { ok: false; error: string };
export function buildProjectDossier(input: ProjectDossierInput): ProjectDossier;
