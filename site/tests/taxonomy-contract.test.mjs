import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

const canonical = {
  en: {
    organizations: ["Independent", "Micro-business", "SME", "Nonprofit / foundation", "Public service"],
    patterns: ["Generation", "Retrieval", "Extraction and classification", "Prediction and recommendation", "Conversation", "Multimodal", "Agentic action"],
    modes: ["Copilot", "Bounded automation", "Strong automation"],
    architectures: ["One model or assistant", "Tool-assisted workflow", "One business agent", "Orchestrated agent team"],
    autonomy: ["A0 · advice only", "A1 · research or draft", "A2 · action after explicit approval", "A3 · bounded autonomous actions", "A4 · broad multi-system autonomy"],
    jurisdictions: ["Switzerland", "European Union", "Switzerland + EU"],
    sectors: ["General / cross-sector", "Healthcare", "Education", "Finance", "Critical infrastructure"],
  },
  fr: {
    organizations: ["Indépendant", "TPE", "PME", "Association / fondation", "Service public"],
    patterns: ["Génération", "Recherche augmentée", "Extraction et classification", "Prédiction et recommandation", "Conversation", "Multimodal", "Action avec des outils"],
    modes: ["Copilote", "Automatisation bornée", "Automatisation forte"],
    architectures: ["Un modèle ou assistant", "Processus outillé", "Un agent métier", "Équipe d’agents orchestrée"],
    autonomy: ["A0 · conseil uniquement", "A1 · recherche ou brouillon", "A2 · action après approbation explicite", "A3 · actions autonomes bornées", "A4 · autonomie large et multi-systèmes"],
    jurisdictions: ["Suisse", "Union européenne", "Suisse + UE"],
    sectors: ["Général / transverse", "Santé", "Éducation", "Finance", "Infrastructure critique"],
  },
};

test("keeps every repeated decision label identical in the guide, review, and GitHub intake", async () => {
  const [playbook, taxonomy, lifecycle, review, issueEn, issueFr] = await Promise.all([
    read("../app/Playbook.tsx"),
    read("../app/integration-taxonomy.ts"),
    read("../app/LifecycleWorkbench.tsx"),
    read("../app/ProjectChangeReview.tsx"),
    read("../../.github/ISSUE_TEMPLATE/field-pilot-en.yml"),
    read("../../.github/ISSUE_TEMPLATE/field-pilot-fr.yml"),
  ]);
  const guideSource = `${playbook}\n${taxonomy}`;

  for (const [locale, issue] of [["en", issueEn], ["fr", issueFr]]) {
    for (const labels of Object.values(canonical[locale])) {
      for (const label of labels) {
        assert.ok(guideSource.includes(label), `${locale} guide is missing canonical label: ${label}`);
        assert.ok(issue.includes(`        - ${label}`), `${locale} GitHub intake drifted from canonical label: ${label}`);
      }
    }
    for (const label of [...canonical[locale].organizations, ...canonical[locale].patterns, ...canonical[locale].modes, ...canonical[locale].architectures, ...canonical[locale].jurisdictions]) {
      assert.ok(review.includes(label), `${locale} change review is missing canonical label: ${label}`);
    }
  }
  assert.ok(lifecycle.includes("props.riskLabels[derivedRisk]"), "working plan must reuse the complete localized risk label");
  assert.ok(lifecycle.includes("props.autonomyLabels[props.autonomy]"), "working plan must reuse the complete localized autonomy label");
  assert.ok(review.includes('props.autonomyLabels[Number(value)]'), "change review must reuse complete autonomy labels");
  assert.ok(review.includes('props.riskLabels[Number(value)]'), "change review must reuse complete risk labels");
});

test("keeps the runtime, schema, roadmap, changelog, and dossier guide on schema 0.5.0", async () => {
  const [runtime, schema, roadmap, changelog, guideEn, guideFr] = await Promise.all([
    read("../app/project-dossier.mjs"),
    read("../public/data/project-dossier.schema.json"),
    read("../../ROADMAP.md"),
    read("../../CHANGELOG.md"),
    read("../../docs/project-dossier.md"),
    read("../../docs/project-dossier.fr.md"),
  ]);
  for (const [name, content] of Object.entries({ runtime, schema, roadmap, changelog, guideEn, guideFr })) {
    assert.ok(content.includes("0.5.0"), `${name} does not identify the current 0.5.0 dossier schema`);
  }
});
