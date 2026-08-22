export type IntegrationId = "copilot" | "agent" | "agency";
export type ArchitectureId = "model" | "workflow" | "agent" | "agency";

export const workModeTaxonomy = {
  en: {
    copilot: { label: "Copilot", code: "A0–A1" },
    agent: { label: "Bounded automation", code: "A1–A3" },
    agency: { label: "Strong automation", code: "A3–A4" },
  },
  fr: {
    copilot: { label: "Copilote", code: "A0–A1" },
    agent: { label: "Automatisation bornée", code: "A1–A3" },
    agency: { label: "Automatisation forte", code: "A3–A4" },
  },
} as const;

// Kept as an internal alias while the data registry still calls this field
// `integration_mode`. All visible labels use the clearer work-mode wording.
export const integrationTaxonomy = workModeTaxonomy;

export const architectureTaxonomy = {
  en: {
    model: { label: "One model or assistant", text: "One model produces an answer without coordinating tools." },
    workflow: { label: "Tool-assisted workflow", text: "Fixed steps connect models, rules, retrieval, or tools." },
    agent: { label: "One business agent", text: "One agent chooses bounded steps and uses approved tools." },
    agency: { label: "Orchestrated agent team", text: "A coordinator delegates to specialist agents under shared controls." },
  },
  fr: {
    model: { label: "Un modèle ou assistant", text: "Un modèle produit une réponse sans coordonner d’outils." },
    workflow: { label: "Processus outillé", text: "Des étapes fixes relient modèles, règles, recherche ou outils." },
    agent: { label: "Un agent métier", text: "Un agent choisit des étapes bornées et utilise des outils autorisés." },
    agency: { label: "Équipe d’agents orchestrée", text: "Un orchestrateur délègue à des agents spécialistes soumis aux mêmes contrôles." },
  },
} as const;

export const defaultArchitectureByIntegration: Record<IntegrationId, ArchitectureId> = {
  copilot: "model",
  agent: "workflow",
  agency: "agency",
};

export const defaultAutonomyByIntegration: Record<IntegrationId, number> = {
  copilot: 1,
  agent: 2,
  agency: 3,
};

export function integrationForAutonomy(autonomy: number, current: IntegrationId): IntegrationId {
  if (autonomy === 0) return "copilot";
  if (autonomy === 1) return current === "agency" ? "agent" : current;
  if (autonomy === 2) return "agent";
  if (autonomy === 3) return current === "copilot" ? "agent" : current;
  return "agency";
}
