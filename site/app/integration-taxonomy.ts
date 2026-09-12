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
    agent: { label: "One business agent", text: "One agent chooses its next steps and uses connected tools. You set its permissions separately." },
    agency: { label: "Orchestrated agent team", text: "A coordinator gives different parts of the task to specialist agents, with shared controls." },
  },
  fr: {
    model: { label: "Un modèle ou assistant", text: "Un modèle produit une réponse sans coordonner d’outils." },
    workflow: { label: "Processus outillé", text: "Des étapes fixes relient modèles, règles, recherche ou outils." },
    agent: { label: "Un agent métier", text: "Un agent choisit ses prochaines étapes et utilise des outils connectés. Vous fixez ses permissions séparément." },
    agency: { label: "Équipe d’agents orchestrée", text: "Un coordinateur répartit la tâche entre des agents spécialistes, avec des contrôles communs." },
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
