export type IntegrationId = "copilot" | "agent" | "agency";
export type ArchitectureId = "model" | "workflow" | "agent" | "agency";

export const workModeTaxonomy = {
  en: {
    copilot: { label: "Copilot", code: "01" },
    agent: { label: "Bounded automation", code: "02" },
    agency: { label: "Strong automation", code: "03" },
  },
  fr: {
    copilot: { label: "Copilote", code: "01" },
    agent: { label: "Automatisation bornée", code: "02" },
    agency: { label: "Automatisation forte", code: "03" },
  },
} as const;

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
