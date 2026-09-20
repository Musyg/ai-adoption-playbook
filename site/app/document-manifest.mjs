// Public reading allowlist. New repository files are never published implicitly.
export const categories = {
  tracks: { en: "Organisation tracks", fr: "Parcours par organisation" },
  sectors: { en: "Sector guidance", fr: "Repères sectoriels" },
  examples: { en: "Worked examples", fr: "Cas d’école" },
  templates: { en: "Templates", fr: "Modèles" },
  docs: { en: "Methods and protocols", fr: "Méthodes et protocoles" },
  references: { en: "Evidence and references", fr: "Études et références" },
  "field-notes": { en: "Field evidence", fr: "Retours terrain" },
  controls: { en: "Controls (French)", fr: "Contrôles" },
};

const pairs = [];
for (const [category, names] of Object.entries({
  tracks: ["README", "independent", "tpe", "pme", "nonprofit-foundation", "public-sector"],
  sectors: ["README", "healthcare", "education", "finance", "critical-infrastructure"],
})) for (const name of names) pairs.push([category, name.toLowerCase(), `${category}/en/${name}.md`, `${category}/fr/${name}.md`]);

for (const [en, fr] of [
  ["tpe-customer-requests", "tpe-demandes-clients"],
  ["sme-b2b-quote-business-agent", "pme-agent-metier-devis-b2b"],
  ["nonprofit-grant-dossier-business-agent", "association-agent-dossiers-subventions"],
  ["public-sector-planning-dossier-business-agent", "service-public-agent-dossiers-urbanisme"],
  ["independent-client-follow-up", "independant-suivi-client"],
  ["independent-business-agent-follow-up", "independant-agent-metier-suivi"],
  ["independent-orchestrated-agency-diagnostic", "independant-agence-orchestree-diagnostic"],
  ["rag-policy-assistant", "assistant-rag-procedures"],
  ["predictive-demand-forecast", "prevision-demande-pieces"],
  ["external-customer-chatbot", "chatbot-client-externe"],
  ["multimodal-catalog-accessibility", "catalogue-multimodal-accessibilite"],
]) pairs.push(["examples", en, `examples/en/${en}.md`, `examples/fr/${fr}.md`]);

for (const [category, names] of Object.entries({
  templates: ["accessibility-assessment", "evaluation-plan", "field-feedback-report", "fundamental-rights-impact-assessment", "incident-runbook", "mandate", "pilot-decision", "risk-assessment", "training-plan", "use-case-card", "vendor-assessment"],
  references: ["agentic-integration-levels", "field-evidence-review-2026", "independent-knowledge-work-cases", "nonprofit-grantmaking-ai-cases", "pme-b2b-quote-cases", "public-sector-planning-ai-cases", "recent-implementation-cases", "sources", "tpe-customer-support-cases"],
  docs: ["ai-use-patterns", "evaluations-and-gates", "field-pilot-cohort", "field-pilot-protocol", "legal-switzerland-eu", "maturity-model", "project-dossier", "risk-autonomy", "security", "task-time-evidence", "universal-process"],
  "field-notes": ["README"],
})) for (const name of names) pairs.push([category, name.toLowerCase(), `${category}/${name}.md`, `${category}/${name}.fr.md`]);

export const libraryPath = (locale) => locale === "fr" ? "/fr/bibliotheque/" : "/library/";
export const documents = pairs.flatMap(([category, id, en, fr]) => ["en", "fr"].map((locale) => ({
  id: `${category}-${id}`, category, locale, source: locale === "en" ? en : fr,
  path: `${libraryPath(locale)}${category}-${id}/`,
})));
documents.push({ id: "controls-readme", category: "controls", locale: "fr", source: "controls/README.md", path: "/fr/bibliotheque/controls-readme/" });
export const documentForSource = (source) => documents.find((item) => item.source === source);
export const alternateDocument = (doc) => documents.find((item) => item.id === doc.id && item.locale !== doc.locale);
export function documentPath(source) {
  const doc = documentForSource(source);
  if (!doc) throw new Error(`Document not approved for web publication: ${source}`);
  return doc.path;
}
export const downloads = ["templates/ai-system-register.csv", "field-notes/index.json"];
