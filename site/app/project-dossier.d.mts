export type ProjectDossierContext = {
  organization_type: "independent" | "tpe" | "pme" | "nonprofit" | "public";
  use_pattern: "generation" | "retrieval" | "classification" | "prediction" | "conversation" | "multimodal" | "agentic";
  jurisdiction: "CH" | "EU" | "BOTH";
  integration_level: "copilot" | "agent" | "agency";
  autonomy_level: number;
  risk_level: number;
};

export type ProjectDossier = {
  schema_version: "0.1.0";
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
};

export type ProjectDossierInput = Omit<ProjectDossier, "schema_version" | "playbook_version" | "status" | "boundary">;

export const PROJECT_DOSSIER_SCHEMA_VERSION: "0.1.0";
export const PROJECT_DOSSIER_STORAGE_KEY: "ai-adoption-playbook:project-dossier:v1";
export const PROJECT_DOSSIER_PLAYBOOK_VERSION: "0.2.2";
export function parseProjectDossier(input: unknown): { ok: true; value: ProjectDossier } | { ok: false; error: string };
export function buildProjectDossier(input: ProjectDossierInput): ProjectDossier;
