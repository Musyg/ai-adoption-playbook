"use client";

import { useEffect, useMemo, useState } from "react";

import controlCrosswalk from "../public/data/control-crosswalk.v1.json";
import { decideEvidence } from "./evidence-decision.mjs";
import { geoArticlePath, geoArticles } from "./geo-content";

type Locale = "en" | "fr";
type AudienceId = "independent" | "tpe" | "pme" | "nonprofit" | "public";
type IntegrationId = "copilot" | "agent" | "agency";
type UsePatternId = "generation" | "retrieval" | "classification" | "prediction" | "conversation" | "multimodal" | "agentic";
type JurisdictionId = "CH" | "EU" | "BOTH";
type FieldSectorId = "general" | "healthcare" | "education" | "finance" | "critical";
type EvidenceDecision = "continue" | "rework" | "unknown" | "stop";
type EvidenceStatus = "pass" | "fail" | "incomplete" | "signal";
type DossierStatus = "ready" | "recorded" | "incomplete";
type LocalizedText = { en: string; fr: string };
type CrosswalkEvidence = { evidence_id: string; name: LocalizedText };
type CrosswalkControl = {
  control_id: string;
  family: string;
  priority: "baseline" | "strengthened" | "critical";
  title: LocalizedText;
  objective: LocalizedText;
  applicability: {
    organization_types: string[];
    risk_levels: string[];
    autonomy_levels: string[];
    use_patterns?: UsePatternId[];
    jurisdictions?: Array<"CH" | "EU">;
    conditions: string[];
  };
  lifecycle_phases: number[];
  gates: string[];
  evidence_ids: string[];
  source_refs: Array<{ source_id: string; relation: string }>;
};
type Phase = { label: string; title: string; text: string };
type Audience = {
  id: AudienceId;
  number: string;
  title: string;
  short: string;
  horizon: string;
  objective: string;
  roles: string;
  pilot: string;
  controls: string[];
  phases: Phase[];
  file: string;
};

const repository = "https://github.com/Musyg/ai-adoption-playbook";
const repositorySource = `${repository}/blob/main`;
const fieldPilotIssues: Record<Locale, string> = {
  en: `${repository}/issues/new?template=field-pilot-en.yml`,
  fr: `${repository}/issues/new?template=field-pilot-fr.yml`,
};
const githubPagesBase = "/ai-adoption-playbook";
const caseRevision = "8e9b2c3ef2109cbbe537c3dbe9011b6599526b01";
const controlCatalog = controlCrosswalk.controls as CrosswalkControl[];
const evidenceCatalog = new Map((controlCrosswalk.evidence_types as CrosswalkEvidence[]).map((evidence) => [evidence.evidence_id, evidence]));
const crosswalkConditions: Record<Locale, Record<string, string>> = {
  en: {
    always: "Always",
    external_provider: "When an external provider is used",
    personal_or_confidential_data: "When personal or confidential data is processed",
    external_content_or_tools: "When external content or tools cross a trust boundary",
    external_or_irreversible_action: "When the system can create an external or irreversible effect",
    material_human_impact: "When people may be materially affected",
    mission_population: "When mission populations or beneficiaries are affected",
    public_authority: "When public authority or public responsibility is involved",
    public_procurement: "When public procurement is involved",
    interactive_ai: "When a person interacts directly with the AI system",
    synthetic_content: "When synthetic or manipulated content is generated or distributed",
    automated_individual_decision: "When a decision about a person is based exclusively on automated processing",
    article50_transparency_scope: "When direct AI interaction or an Article 50 synthetic-content category is in scope",
    model_customization: "When the model is fine-tuned, adapted, or materially customized",
    software_or_code_effect: "When generated code or software can create an operational effect",
  },
  fr: {
    always: "Toujours",
    external_provider: "Lorsqu’un fournisseur externe est utilisé",
    personal_or_confidential_data: "Lorsque des données personnelles ou confidentielles sont traitées",
    external_content_or_tools: "Lorsque du contenu externe ou des outils franchissent une frontière de confiance",
    external_or_irreversible_action: "Lorsque le système peut produire un effet externe ou irréversible",
    material_human_impact: "Lorsque des personnes peuvent être matériellement affectées",
    mission_population: "Lorsque des bénéficiaires ou populations de mission sont concernés",
    public_authority: "Lorsqu’une autorité ou responsabilité publique est engagée",
    public_procurement: "Lorsqu’un achat public est engagé",
    interactive_ai: "Lorsqu’une personne interagit directement avec le système IA",
    synthetic_content: "Lorsqu’un contenu synthétique ou manipulé est généré ou diffusé",
    automated_individual_decision: "Lorsqu’une décision concernant une personne repose exclusivement sur un traitement automatisé",
    article50_transparency_scope: "Lorsqu’une interaction IA directe ou une catégorie de contenu synthétique de l’article 50 entre dans le périmètre",
    model_customization: "Lorsque le modèle est affiné, adapté ou modifié de manière substantielle",
    software_or_code_effect: "Lorsque du code ou un logiciel généré peut produire un effet opérationnel",
  },
};
const phase = (rows: string[][]): Phase[] => rows.map(([label, title, text]) => ({ label, title, text }));
const calibrationSpecs: Record<IntegrationId, { low: number; high: number; setup: number }> = {
  copilot: { low: 0.1, high: 0.3, setup: 8 },
  agent: { low: 0.2, high: 0.5, setup: 40 },
  agency: { low: 0.35, high: 0.7, setup: 120 },
};
const pilotSpecs: Record<IntegrationId, { horizon: number; frozen: number; live: number; valueFloor: number }> = {
  copilot: { horizon: 14, frozen: 20, live: 14, valueFloor: 10 },
  agent: { horizon: 30, frozen: 40, live: 20, valueFloor: 20 },
  agency: { horizon: 60, frozen: 60, live: 12, valueFloor: 35 },
};
const operationSpecs: Record<IntegrationId, { reviewDate: string; reviewDays: number; containment: string }> = {
  copilot: { reviewDate: "2026-09-17", reviewDays: 30, containment: "4 h" },
  agent: { reviewDate: "2026-09-01", reviewDays: 14, containment: "60 min" },
  agency: { reviewDate: "2026-08-25", reviewDays: 7, containment: "15 min" },
};

type UsePatternContent = {
  eyebrow: string;
  title: string;
  text: string;
  labels: { task: string; evaluate: string; threat: string; jurisdiction: string };
  guide: string;
  patterns: Array<{ id: UsePatternId; code: string; title: string; short: string; task: string; evaluate: string; threat: string }>;
  jurisdictionTitle: string;
  jurisdictions: Array<{ id: JurisdictionId; label: string; note: string }>;
  jurisdictionNotes: Record<JurisdictionId, { title: string; text: string }>;
  crosswalkPattern: string;
  crosswalkJurisdiction: string;
};

const usePatternContent: Record<Locale, UsePatternContent> = {
  en: {
    eyebrow: "FIRST AXIS · WHAT THE AI ACTUALLY DOES",
    title: "Choose the use pattern before choosing the integration level.",
    text: "A chatbot, a predictor, a retrieval system, and an agent can use similar models but require different evidence. Select the dominant pattern, then record every secondary pattern in the use-case card.",
    labels: { task: "Task", evaluate: "Evaluate", threat: "Threat focus", jurisdiction: "Legal route" },
    guide: "Open the complete classification guide",
    patterns: [
      { id: "generation", code: "01", title: "Generation", short: "Create a new output", task: "Create text, code, image, audio, or another new output.", evaluate: "Accepted quality, factual or source fidelity, severe errors, and human correction load.", threat: "Confabulation, sensitive-data disclosure, intellectual-property exposure, and unsafe output handling." },
      { id: "retrieval", code: "02", title: "Retrieval", short: "Find grounded information", task: "Find and synthesize information from an authorized corpus.", evaluate: "Retrieval coverage, groundedness, citation validity, corpus freshness, and access control.", threat: "Corpus poisoning, indirect prompt injection, cross-tenant leakage, and stale indexes." },
      { id: "classification", code: "03", title: "Extraction and classification", short: "Extract, label, or route", task: "Extract fields, assign known categories, route cases, or detect a defined condition.", evaluate: "Per-class precision and recall, critical errors, abstention, subgroup results, and drift.", threat: "Evasion, poisoned data or labels, class imbalance, and threshold manipulation." },
      { id: "prediction", code: "04", title: "Prediction and recommendation", short: "Score, rank, or recommend", task: "Estimate an outcome, calculate a score, rank options, or recommend an action.", evaluate: "Calibration, threshold utility, error cost, subgroup results, and feedback loops.", threat: "Automation bias, proxy discrimination, model extraction, drift, and self-reinforcing feedback." },
      { id: "conversation", code: "05", title: "Conversation", short: "Maintain a multi-turn exchange", task: "Maintain a multi-turn interaction with an internal or external user.", evaluate: "AI disclosure, task completion, human handoff, multi-turn consistency, retention, and deletion.", threat: "Impersonation, manipulation across turns, memory retention, unsafe advice, and failed handoff." },
      { id: "multimodal", code: "06", title: "Multimodal", short: "Interpret or create media", task: "Interpret or generate image, audio, video, speech, or sensor content.", evaluate: "Consent and rights, modality quality, provenance, transformation robustness, and accessibility.", threat: "Deepfakes, voice or identity misuse, hidden multimodal instructions, and stripped metadata." },
      { id: "agentic", code: "07", title: "Agentic action", short: "Plan and act through tools", task: "Plan steps, call tools, change systems, or coordinate specialist agents.", evaluate: "Plan and tool correctness, authorization, effect read-back, idempotency, rollback, and stopping.", threat: "Goal hijacking, tool misuse, privilege abuse, unexpected code execution, poisoned memory, and cascading failure." },
    ],
    jurisdictionTitle: "Where will the system operate or affect people?",
    jurisdictions: [
      { id: "CH", label: "Switzerland", note: "Swiss route" },
      { id: "EU", label: "European Union", note: "EU route" },
      { id: "BOTH", label: "Switzerland + EU", note: "Two separate analyses" },
    ],
    jurisdictionNotes: {
      CH: { title: "Swiss route", text: "Apply the FADP when personal data is processed and qualify cantonal, public-law, and sector rules. Direct language-model interaction and qualifying automated individual decisions create distinct information and review duties." },
      EU: { title: "EU route", text: "Classify the provider and deployer roles, the AI Act category, and GDPR duties separately. Article 50 transparency rules apply from 2 August 2026 to direct AI interaction and specified synthetic or manipulated content." },
      BOTH: { title: "Two routes, not one shortcut", text: "Run the Swiss and EU analyses independently. A Swiss assessment does not establish EU compliance, and an EU classification does not replace Swiss data-protection, cantonal, public-law, or sector analysis." },
    },
    crosswalkPattern: "use pattern",
    crosswalkJurisdiction: "jurisdiction route",
  },
  fr: {
    eyebrow: "PREMIER AXE · CE QUE FAIT RÉELLEMENT L’IA",
    title: "Choisissez le mode d’usage avant le niveau d’intégration.",
    text: "Un chatbot, un prédicteur, un système de recherche et un agent peuvent utiliser des modèles proches, mais ils n’exigent pas les mêmes preuves. Sélectionnez le mode dominant, puis consignez chaque mode secondaire dans la fiche de cas d’usage.",
    labels: { task: "Tâche", evaluate: "Évaluer", threat: "Menaces à tester", jurisdiction: "Route juridique" },
    guide: "Ouvrir le guide complet de classification",
    patterns: [
      { id: "generation", code: "01", title: "Génération", short: "Créer une nouvelle sortie", task: "Créer du texte, du code, une image, de l’audio ou une autre sortie nouvelle.", evaluate: "Qualité acceptée, fidélité aux faits ou aux sources, erreurs graves et charge de correction humaine.", threat: "Affabulation, divulgation de données sensibles, propriété intellectuelle et traitement dangereux des sorties." },
      { id: "retrieval", code: "02", title: "Recherche augmentée", short: "Trouver une information fondée", task: "Rechercher et synthétiser dans un corpus autorisé.", evaluate: "Couverture de recherche, ancrage, validité des citations, fraîcheur du corpus et contrôle d’accès.", threat: "Empoisonnement du corpus, injection indirecte, fuite entre locataires et index périmé." },
      { id: "classification", code: "03", title: "Extraction et classification", short: "Extraire, classer ou router", task: "Extraire des champs, attribuer une catégorie connue, router un cas ou détecter une condition définie.", evaluate: "Précision et rappel par classe, erreurs critiques, abstention, résultats par groupe et dérive.", threat: "Contournement, données ou labels empoisonnés, déséquilibre de classes et manipulation des seuils." },
      { id: "prediction", code: "04", title: "Prédiction et recommandation", short: "Noter, classer ou recommander", task: "Estimer un résultat, calculer un score, classer des options ou recommander une action.", evaluate: "Calibration, utilité des seuils, coût des erreurs, résultats par groupe et boucles de rétroaction.", threat: "Biais d’automatisation, discrimination par proxy, extraction du modèle, dérive et rétroaction auto-renforcée." },
      { id: "conversation", code: "05", title: "Conversation", short: "Maintenir un échange", task: "Maintenir une interaction en plusieurs tours avec une personne interne ou externe.", evaluate: "Signalement de l’IA, réussite de la tâche, transfert humain, cohérence, conservation et suppression.", threat: "Usurpation, manipulation entre les tours, mémoire persistante, conseil dangereux et transfert humain défaillant." },
      { id: "multimodal", code: "06", title: "Multimodal", short: "Interpréter ou créer un média", task: "Interpréter ou générer image, audio, vidéo, parole ou contenu de capteur.", evaluate: "Consentement et droits, qualité par modalité, provenance, robustesse aux transformations et accessibilité.", threat: "Hypertrucage, abus de voix ou d’identité, instruction multimodale cachée et suppression des métadonnées." },
      { id: "agentic", code: "07", title: "Action agentique", short: "Planifier et agir avec des outils", task: "Planifier, appeler des outils, modifier des systèmes ou coordonner des agents spécialisés.", evaluate: "Exactitude du plan et des outils, autorisation, relecture des effets, idempotence, rollback et arrêt.", threat: "Détournement d’objectif, abus d’outils ou de privilèges, exécution de code inattendue, mémoire empoisonnée et panne en cascade." },
    ],
    jurisdictionTitle: "Où le système opère-t-il ou affecte-t-il des personnes ?",
    jurisdictions: [
      { id: "CH", label: "Suisse", note: "Route suisse" },
      { id: "EU", label: "Union européenne", note: "Route UE" },
      { id: "BOTH", label: "Suisse + UE", note: "Deux analyses distinctes" },
    ],
    jurisdictionNotes: {
      CH: { title: "Route suisse", text: "Appliquez la LPD lorsque des données personnelles sont traitées et qualifiez les règles cantonales, de droit public et sectorielles. L’interaction directe avec un modèle de langage et certaines décisions individuelles automatisées déclenchent des obligations distinctes d’information et de revue." },
      EU: { title: "Route UE", text: "Qualifiez séparément les rôles de fournisseur et de déployeur, la catégorie de l’AI Act et les obligations du RGPD. Les règles de transparence de l’article 50 s’appliquent depuis le 2 août 2026 aux interactions directes et à certains contenus synthétiques ou manipulés." },
      BOTH: { title: "Deux routes, aucun raccourci", text: "Menez séparément les analyses suisse et européenne. Une analyse suisse ne prouve pas la conformité UE, et une classification UE ne remplace pas l’analyse suisse en matière de données, de droit cantonal, de droit public ou de règles sectorielles." },
    },
    crosswalkPattern: "mode d’usage",
    crosswalkJurisdiction: "route juridique",
  },
};

type NonAgenticCaseContent = {
  eyebrow: string;
  title: string;
  text: string;
  labels: { scope: string; proof: string; gate: string; open: string };
  boundary: string;
  cases: Array<{
    code: string;
    pattern: string;
    title: string;
    organization: string;
    scope: string;
    proof: string[];
    gate: string;
    file: string;
  }>;
};

const nonAgenticCaseContent: Record<Locale, NonAgenticCaseContent> = {
  en: {
    eyebrow: "FOUR SYNTHETIC CASES · ZERO AUTONOMOUS ACTIONS",
    title: "Same low autonomy, four different evidence contracts.",
    text: "RAG, prediction, an external chatbot, and a multimodal assistant can all remain at A0 or A1. Their data, failure modes, legal triggers, and acceptance metrics are still fundamentally different.",
    labels: { scope: "Bounded scope", proof: "Frozen proof contract", gate: "Decision", open: "Open the complete case" },
    boundary: "Every number below is fictional. These cases demonstrate how to preregister a decision; they are not field evidence, vendor benchmarks, or promised gains.",
    cases: [
      { code: "RAG", pattern: "Retrieval + generation · A1 · R1", title: "Read-only field-procedure assistant", organization: "Helvetia Facilities · internal", scope: "Retrieves current authorized passages and drafts a cited answer. No ticket, email, work order, or equipment access.", proof: ["80 frozen questions", "20 access-boundary tests", "0 write tools"], gate: "Authorize 30 shadow cases only", file: "examples/en/rag-policy-assistant.md" },
      { code: "PRED", pattern: "Prediction · A0 · R1", title: "Weekly spare-parts demand forecast", organization: "Léman Pièces · internal batch", scope: "Produces forecasts and intervals for a planner. New products use a manual rule; no supplier order can be created.", proof: ["26 frozen weeks", "5 product segments", "0 automatic orders"], gate: "Shadow established products only", file: "examples/en/predictive-demand-forecast.md" },
      { code: "CHAT", pattern: "Conversation + retrieval · A1 · R2", title: "External customer-information chatbot", organization: "Alpina Outdoor · CH + EU", scope: "Answers approved public questions, identifies itself as AI, and hands off. No account, payment, refund, or warranty access.", proof: ["160 conversations", "4 languages", "24 required handoffs"], gate: "Fix and rerun handoff before external use", file: "examples/en/external-customer-chatbot.md" },
      { code: "MM", pattern: "Multimodal + generation · A1 · R1", title: "Product-catalogue accessibility assistant", organization: "Asteria Home · CH + EU", scope: "Reads authorized images and packaging, drafts alt text, and flags mismatches. It cannot edit an asset or publish.", proof: ["140 image sets", "16 planted mismatches", "0 publishing rights"], gate: "Authorize 60 shadow sets only", file: "examples/en/multimodal-catalog-accessibility.md" },
    ],
  },
  fr: {
    eyebrow: "QUATRE CAS SYNTHÉTIQUES · AUCUNE ACTION AUTONOME",
    title: "Même faible autonomie, quatre contrats de preuve différents.",
    text: "Un RAG, une prédiction, un chatbot externe et un assistant multimodal peuvent tous rester en A0 ou A1. Leurs données, échecs, déclencheurs juridiques et métriques d’acceptation restent pourtant très différents.",
    labels: { scope: "Périmètre borné", proof: "Contrat de preuve figé", gate: "Décision", open: "Ouvrir le cas complet" },
    boundary: "Tous les chiffres ci-dessous sont fictifs. Ces cas montrent comment préenregistrer une décision ; ils ne constituent ni preuve terrain, ni benchmark fournisseur, ni promesse de gain.",
    cases: [
      { code: "RAG", pattern: "Recherche + génération · A1 · R1", title: "Assistant de procédures terrain en lecture seule", organization: "Helvetia Facilities · interne", scope: "Retrouve les passages actuels et autorisés, puis prépare une réponse citée. Aucun accès aux tickets, e-mails, ordres de travail ou équipements.", proof: ["80 questions figées", "20 tests de frontière d’accès", "0 outil d’écriture"], gate: "Autoriser seulement 30 cas en shadow", file: "examples/fr/assistant-rag-procedures.md" },
      { code: "PRÉD", pattern: "Prédiction · A0 · R1", title: "Prévision hebdomadaire de pièces", organization: "Léman Pièces · batch interne", scope: "Produit prévisions et intervalles pour un planificateur. Les nouveaux produits restent manuels et aucune commande fournisseur n’est créée.", proof: ["26 semaines figées", "5 segments produit", "0 commande automatique"], gate: "Shadow mode sur produits établis", file: "examples/fr/prevision-demande-pieces.md" },
      { code: "CHAT", pattern: "Conversation + recherche · A1 · R2", title: "Chatbot externe d’information client", organization: "Alpina Outdoor · CH + UE", scope: "Répond depuis les pages publiques, s’identifie comme IA et transfère. Aucun accès aux comptes, paiements, remboursements ou garanties.", proof: ["160 conversations", "4 langues", "24 transferts obligatoires"], gate: "Corriger et rejouer le transfert avant usage", file: "examples/fr/chatbot-client-externe.md" },
      { code: "MM", pattern: "Multimodal + génération · A1 · R1", title: "Assistant d’accessibilité du catalogue", organization: "Asteria Home · CH + UE", scope: "Lit images et emballages autorisés, prépare le texte alternatif et signale les écarts. Il ne peut ni modifier un média ni publier.", proof: ["140 jeux d’images", "16 incohérences provoquées", "0 droit de publication"], gate: "Autoriser seulement 60 lots en shadow", file: "examples/fr/catalogue-multimodal-accessibilite.md" },
    ],
  },
};

type GuidedContent = {
  eyebrow: string;
  title: string;
  text: string;
  progress: string[];
  stepLabel: string;
  steps: Array<{ eyebrow: string; title: string; text: string; helpLabel: string; help: string }>;
  levels: Array<{ id: IntegrationId; code: string; title: string; text: string; recommendation: string; autonomy: number }>;
  proofByPattern: Record<UsePatternId, string>;
  buttons: { back: string; next: string; result: string; restart: string; workspace: string; cases: string };
  result: { eyebrow: string; title: string; intro: string; pilot: string; measure: string; safeguards: string; selection: string };
  chapters: Array<{ id: string; number: string; title: string; text: string }>;
};

const guidedContent: Record<Locale, GuidedContent> = {
  en: {
    eyebrow: "GUIDED START · ABOUT 3 MINUTES",
    title: "Build your route, one simple choice at a time.",
    text: "Answer four short questions. The guide will explain each idea before showing the technical label. Nothing entered here is sent anywhere.",
    progress: ["Your situation", "The AI task", "Its right to act", "Territory", "Starting plan"],
    stepLabel: "Step",
    steps: [
      { eyebrow: "START WITH YOUR REALITY", title: "What kind of organization are you guiding?", text: "This changes ownership, timing, and the first safeguards. It does not change the core method.", helpLabel: "Why ask this first?", help: "An independent professional can decide and correct alone. A public service must involve more roles, formal authority, accessibility, and recourse. The useful first pilot is therefore different." },
      { eyebrow: "NAME THE JOB", title: "What should the AI mainly do?", text: "Choose the dominant task. Similar models can create very different risks depending on the job they perform.", helpLabel: "What is a use pattern?", help: "A use pattern describes the job performed by the AI, such as finding information, predicting demand, holding a conversation, or taking action. It is not the same as autonomy." },
      { eyebrow: "SET THE ACTION BOUNDARY", title: "How far may the system act?", text: "Choose the simplest level that can solve the problem. More autonomy is not automatically better.", helpLabel: "What is autonomy?", help: "Autonomy means how far the system can proceed without a person carrying the work. Preparing a draft is low autonomy. Changing a system or coordinating tools is higher autonomy." },
      { eyebrow: "KEEP THE LEGAL ROUTES SEPARATE", title: "Where will it operate or affect people?", text: "This is an orientation, not a legal conclusion. Switzerland and the European Union require separate checks.", helpLabel: "Why two routes?", help: "A Swiss analysis does not prove compliance in the European Union, and an EU classification does not replace Swiss data-protection, public-law, cantonal, or sector checks." },
      { eyebrow: "YOUR STARTING POINT", title: "A small first step, with clear limits.", text: "This recommendation combines your four choices. It is a starting hypothesis to test, not an authorization or a promised gain.", helpLabel: "What is an evidence contract?", help: "Before the pilot, write what will be tested, on which cases, what counts as success, what stops the test, and which records must remain. That written agreement is the evidence contract." },
    ],
    levels: [
      { id: "copilot", code: "A0–A1", title: "It prepares, you act", text: "The system searches, extracts, or drafts. A person checks the result and performs every external action.", recommendation: "Begin with a read-only or draft-only test. Keep every send, publication, approval, and system change human.", autonomy: 1 },
      { id: "agent", code: "A2–A3", title: "It executes a bounded process", text: "The system handles approved steps and tools for eligible cases. A person approves or owns exceptions.", recommendation: "Freeze eligibility, permissions, approval, and stop rules before connecting write tools.", autonomy: 2 },
      { id: "agency", code: "A3", title: "It coordinates specialists", text: "An orchestrator distributes work across specialist agents under one policy and a shared evidence trail.", recommendation: "Prove that orchestration beats one simpler agent on accepted outcomes before expanding scope.", autonomy: 3 },
    ],
    proofByPattern: {
      generation: "The output is useful, factually or source-correct, and needs an acceptable amount of human correction.",
      retrieval: "The right current sources are found and cited without crossing access boundaries.",
      classification: "The right fields or categories are produced, including on rare and important cases.",
      prediction: "The forecast beats the current method without hiding weak products, groups, or periods.",
      conversation: "People know they are speaking with AI, receive supported answers, and can reach a person when needed.",
      multimodal: "Media rights are clear, visible facts are captured correctly, and accessibility is not degraded.",
      agentic: "Every planned action is authorized, traceable, reversible, and stopped safely when the case is outside scope.",
    },
    buttons: { back: "Back", next: "Continue", result: "See my starting plan", restart: "Start again", workspace: "Build the test plan", cases: "Explore comparable cases" },
    result: { eyebrow: "GUIDED RECOMMENDATION", title: "Your first test should remain smaller than your ambition.", intro: "The guide recommends this bounded starting point from the choices above.", pilot: "First pilot", measure: "What to prove", safeguards: "Safeguards from day one", selection: "Your choices" },
    chapters: [
      { id: "concept-library", number: "01", title: "Understand the differences", text: "Use patterns, non-agentic cases, integration levels, and the public evidence review." },
      { id: "operational-workspace", number: "02", title: "Build and operate a pilot", text: "Scenario, test plan, observed evidence, operating card, handoff, and field draft." },
      { id: "implementation-library", number: "03", title: "Explore cases and controls", text: "Organization paths, sectors, eleven cases, risk orientation, controls, and templates." },
    ],
  },
  fr: {
    eyebrow: "DÉPART GUIDÉ · ENVIRON 3 MINUTES",
    title: "Construisez votre parcours, un choix simple à la fois.",
    text: "Répondez à quatre questions courtes. Le guide explique chaque idée avant d’afficher son code technique. Rien de ce qui est saisi ici n’est transmis.",
    progress: ["Votre situation", "La tâche de l’IA", "Son droit d’agir", "Le territoire", "Point de départ"],
    stepLabel: "Étape",
    steps: [
      { eyebrow: "PARTIR DE VOTRE RÉALITÉ", title: "Quel type d’organisation accompagnez-vous ?", text: "Ce choix modifie les responsabilités, le rythme et les premières protections. La méthode centrale reste la même.", helpLabel: "Pourquoi commencer ici ?", help: "Un indépendant peut décider et corriger seul. Un service public doit réunir davantage de rôles, un mandat formel, l’accessibilité et une voie de recours. Le premier pilote utile n’est donc pas le même." },
      { eyebrow: "NOMMER LE TRAVAIL", title: "Que doit principalement faire l’IA ?", text: "Choisissez la tâche dominante. Des modèles proches créent des risques différents selon le travail demandé.", helpLabel: "Qu’est-ce qu’un mode d’usage ?", help: "Le mode d’usage décrit le travail confié à l’IA : trouver une information, prévoir une demande, tenir une conversation ou agir. Il ne décrit pas encore son autonomie." },
      { eyebrow: "POSER LA LIMITE D’ACTION", title: "Jusqu’où le système peut-il agir ?", text: "Choisissez le niveau le plus simple capable de résoudre le problème. Davantage d’autonomie n’est pas automatiquement préférable.", helpLabel: "Qu’est-ce que l’autonomie ?", help: "L’autonomie indique jusqu’où le système avance sans qu’une personne transporte le travail. Préparer un brouillon reste peu autonome. Modifier un système ou coordonner des outils l’est davantage." },
      { eyebrow: "SÉPARER LES ROUTES JURIDIQUES", title: "Où opérera-t-il ou affectera-t-il des personnes ?", text: "Il s’agit d’une orientation, pas d’une conclusion juridique. La Suisse et l’Union européenne exigent des vérifications séparées.", helpLabel: "Pourquoi deux routes ?", help: "Une analyse suisse ne prouve pas la conformité dans l’Union européenne. Une classification européenne ne remplace pas les vérifications suisses sur les données, le droit public, les cantons ou le secteur." },
      { eyebrow: "VOTRE POINT DE DÉPART", title: "Un premier pas modeste, avec des limites claires.", text: "Cette recommandation combine vos quatre choix. C’est une hypothèse à tester, pas une autorisation ni une promesse de gain.", helpLabel: "Qu’est-ce qu’un contrat de preuve ?", help: "Avant le pilote, écrivez ce qui sera testé, sur quels cas, ce qui compte comme réussite, ce qui arrête le test et quelles traces doivent rester. Cet accord écrit constitue le contrat de preuve." },
    ],
    levels: [
      { id: "copilot", code: "A0–A1", title: "Elle prépare, vous agissez", text: "Le système recherche, extrait ou rédige. Une personne vérifie puis réalise chaque action externe.", recommendation: "Commencez en lecture seule ou avec des brouillons. Chaque envoi, publication, validation et modification reste humain.", autonomy: 1 },
      { id: "agent", code: "A2–A3", title: "Elle exécute un processus borné", text: "Le système utilise les étapes et outils autorisés pour les cas éligibles. Une personne approuve ou traite les exceptions.", recommendation: "Figez les cas éligibles, les permissions, l’approbation et les règles d’arrêt avant de connecter des outils d’écriture.", autonomy: 2 },
      { id: "agency", code: "A3", title: "Elle coordonne des spécialistes", text: "Un orchestrateur distribue le travail à plusieurs agents spécialisés sous une même politique et une trace commune.", recommendation: "Prouvez que l’orchestration surpasse un agent plus simple sur les résultats acceptés avant d’élargir le périmètre.", autonomy: 3 },
    ],
    proofByPattern: {
      generation: "La sortie est utile, fidèle aux faits ou aux sources et demande une quantité acceptable de corrections humaines.",
      retrieval: "Les bonnes sources, actuelles et autorisées, sont retrouvées et citées sans franchir les droits d’accès.",
      classification: "Les bons champs ou catégories sont produits, y compris pour les cas rares et importants.",
      prediction: "La prévision surpasse la méthode actuelle sans masquer les produits, groupes ou périodes faibles.",
      conversation: "Les personnes savent qu’elles parlent à une IA, reçoivent une réponse fondée et peuvent joindre un humain si nécessaire.",
      multimodal: "Les droits sur les médias sont clairs, les faits visibles sont correctement repris et l’accessibilité ne recule pas.",
      agentic: "Chaque action prévue est autorisée, traçable, réversible et arrêtée proprement lorsque le cas sort du périmètre.",
    },
    buttons: { back: "Retour", next: "Continuer", result: "Voir mon point de départ", restart: "Recommencer", workspace: "Construire le plan de test", cases: "Explorer des cas comparables" },
    result: { eyebrow: "RECOMMANDATION GUIDÉE", title: "Votre premier test doit rester plus petit que votre ambition.", intro: "Le guide propose ce point de départ borné à partir des choix précédents.", pilot: "Premier pilote", measure: "Ce qu’il faut prouver", safeguards: "Protections dès le premier jour", selection: "Vos choix" },
    chapters: [
      { id: "concept-library", number: "01", title: "Comprendre les différences", text: "Modes d’usage, cas non agentiques, niveaux d’intégration et revue des preuves publiques." },
      { id: "operational-workspace", number: "02", title: "Construire et exploiter un pilote", text: "Scénario, plan de test, preuves observées, fiche d’exploitation, transmission et brouillon terrain." },
      { id: "implementation-library", number: "03", title: "Explorer les cas et contrôles", text: "Parcours par structure, secteurs, onze cas, orientation du risque, contrôles et modèles." },
    ],
  },
};

const copy = {
  en: {
    meta: "FIELD GUIDE · AUGUST 2026",
    nav: ["Use patterns", "Paths", "Sectors", "Method", "Worked cases", "Control level", "Toolkit"],
    heroTitle: "Move from AI interest to a system you can trust.",
    heroText: "Choose one useful problem, prove the value, control the risk, and increase autonomy only when the evidence supports it.",
    start: "Find my starting point",
    methodCta: "See the method",
    fieldPilotHero: "Prepare a field pilot",
    rule: "THREE CHECKS BEFORE MOVING ON",
    gates: [["No owner or starting point", "No project"], ["No success criteria", "No pilot"], ["No verifiable results", "No live use"]],
    stats: [["5", "organization paths"], ["8", "ordered steps"], ["3", "safety checks"]],
    summaryEyebrow: "WHAT THIS PLAYBOOK HELPS YOU DECIDE",
    summaryTitle: "Choose the smallest AI system that can improve a real workflow.",
    summaryText: "The guide separates three questions that are often confused: the job given to the AI, what it may do without you, and the rules that apply where it operates. It then turns those choices into a small, measurable first test.",
    integrationEyebrow: "NAME THE SYSTEM BEFORE QUOTING THE GAIN",
    integrationTitle: "Copilot, business agent, and orchestrated agency are not the same integration.",
    integrationText: "They move different amounts of work, require different permissions, and must be measured with different outcomes. A percentage without its level is misleading.",
    integrationLabels: { system: "What the system does", human: "Human role", planning: "Public evidence anchor", flow: "End-to-end evidence" },
    integrationLevels: [
      { code: "A0–A1", title: "Copilot", system: "Researches, extracts, or drafts one step. The person starts the task, carries the context, checks the answer, and performs every external action.", human: "Operator at every cycle", planning: "Published effects run from a measured slowdown to large gains on narrow tasks. There is no universal range.", flow: "0% without human completion" },
      { code: "A2–A3", title: "Business agent", system: "Receives a bounded case, uses approved tools and memory, follows the workflow, completes eligible cases, and escalates exceptions.", human: "Approver and exception owner", planning: "Direct field RCT: 16.8% faster on eligible chats, 3.2% across all chats, with a customer-rating trade-off.", flow: "5.8% eligible; 35% of agent-handled eligible chats without escalation in that setting" },
      { code: "A3–A4", title: "Orchestrated agency", system: "An orchestrator delegates to specialist agents for research, execution, quality control, and cross-system coordination under shared controls.", human: "Governor of goals, limits, and exceptions", planning: "No independent field study supports a generic 5x to 12x multiplier on accepted business outcomes.", flow: "CORPGEN: 15.2% completed at 46 concurrent tasks in a benchmark, not production" },
    ],
    measurementTitle: "Five numbers that must stay separate",
    measurements: [["01", "Cycle time", "Elapsed time from request to result."], ["02", "Human active time", "Minutes actually spent by a person."], ["03", "Accepted throughput", "Outputs accepted per owner-hour."], ["04", "Straight-through rate", "Eligible cases completed without intervention."], ["05", "Shipped outcome", "A real downstream result, not model activity."]],
    rangeNote: "The former universal 20–40%, 50–75%, and 80–92% bands have been removed. Public studies do not establish them as general effects. The calibrator now starts with editable challenge hypotheses, never with a promised gain.",
    evidenceLead: "PRIMARY FIELD EVIDENCE",
    evidenceLinks: [["Support copilot · +15%", "https://academic.oup.com/qje/article/140/2/889/7990658"], ["Small business · 0% average", "https://www.hbs.edu/ris/download.aspx?name=24-042.pdf"], ["Business agent · 5.8% eligible", "https://arxiv.org/abs/2605.14830"], ["Autonomous code · delivery gap", "https://www.nber.org/papers/w35275"]],
    researchEyebrow: "WHAT THE DENOMINATOR CHANGES",
    researchTitle: "Six findings that prevent inflated AI claims.",
    researchText: "Each figure answers a different question. Read the measured outcome and the transfer limit together.",
    researchSignals: [
      { tag: "COPILOT · FIELD", value: "+15%", title: "Support output", text: "Average issues resolved per hour. Less-experienced workers gained most; top performers had small quality declines.", url: "https://academic.oup.com/qje/article/140/2/889/7990658" },
      { tag: "SMALL BUSINESS · RCT", value: "0%", title: "Average business effect", text: "About +15% for high performers and −8% for low performers. Access to advice did not guarantee execution quality.", url: "https://www.hbs.edu/ris/download.aspx?name=24-042.pdf" },
      { tag: "BUSINESS AGENT · RCT", value: "5.8%", title: "Eligible share", text: "Eligible chats were 16.8% faster, but the whole flow improved 3.2% and customer rating fell on eligible chats.", url: "https://arxiv.org/abs/2605.14830" },
      { tag: "AUTONOMOUS CODE · FIELD", value: "+180%", title: "Commits, not outcomes", text: "The signal attenuated to +30% releases and no detected increase in total app usage.", url: "https://www.nber.org/papers/w35275" },
      { tag: "AGENCY · BENCHMARK", value: "15.2%", title: "Absolute completion", text: "A 3.5x relative gain over 4.3% at 46 concurrent tasks, in a simulated six-hour environment.", url: "https://www.microsoft.com/en-us/research/blog/corpgen-advances-ai-agents-for-real-work/" },
      { tag: "PUBLIC SECTOR · REVIEW", value: "19–26 min", title: "Self-reported daily saving", text: "Large trials, but no random allocation and no proof that saved time became a delivered public outcome.", url: "https://www.gov.uk/government/publications/microsoft-365-copilot-experiment-cross-government-findings-report" },
    ],
    researchReview: "Read the full 20-source evidence review",
    calibratorEyebrow: "CALIBRATE BEFORE YOU PROMISE",
    calibratorTitle: "Turn the ranges into a testable scenario for your own workflow.",
    calibratorText: "Choose the integration level, then expose volume, manual time, eligible share, low and high effect hypotheses, and setup effort. The result is a stress-test envelope, not a forecast.",
    calibratorLevel: "Integration level",
    calibratorLevels: [{ id: "copilot", label: "Copilot · A0–A1", note: "One assisted step" }, { id: "agent", label: "Business agent · A2–A3", note: "One bounded workflow" }, { id: "agency", label: "Orchestrated agency · A3", note: "Specialists under one policy" }],
    calibratorInputs: { minutes: "Manual minutes per case", cases: "Cases per month", eligible: "Share genuinely eligible", low: "Low effect hypothesis", high: "High effect hypothesis", setup: "One-off setup effort" },
    calibratorUnits: { minutes: "min", cases: "cases", eligible: "%", low: "%", high: "%", setup: "hours" },
    calibratorResults: { eligible: "Eligible workload today", freed: "Human hours freed / month", remaining: "Human hours remaining on eligible cases", total: "Reduction across the whole workload", throughput: "Theoretical accepted throughput", payback: "Setup absorbed after" },
    calibratorReading: "READ THIS RESULT CORRECTLY",
    calibratorCaution: "The calculation assumes accepted quality, no new bottleneck, and stable eligibility. It excludes model cost, supervision drift, incidents, demand elasticity, revenue, and the time of people outside the measured workflow. Replace every assumption with observed data during the pilot.",
    calibratorPreset: "Suggested setup effort",
    calibratorMonths: "months",
    pilotPlannerEyebrow: "FROM SCENARIO TO PROTOCOL",
    pilotPlannerTitle: "A range is not a plan. Make the next decision capable of failing cleanly.",
    pilotPlannerText: "The calibrator exposes the assumptions. This protocol now fixes the order, practical sample, evidence, and decision before the system touches live work.",
    pilotRoadmap: ["Scenario calibrated", "Pilot preregistered", "Evidence observed", "Scope decision", "Operate + reassess"],
    pilotPlanLabels: { horizon: "Minimum horizon", frozen: "Frozen evaluation set", live: "Bounded live cases", collection: "Live collection at this volume", days: "days", weeks: "weeks", cases: "cases" },
    pilotPlanSteps: [["01", "Freeze the decision", "Write the owner, workflow boundary, baseline, eligibility rule, allowed effects, thresholds, and stop authority."], ["02", "Evaluate offline", "Run frozen real cases, critical segments, abstentions, adversarial inputs, tool failures, and duplicate events before live use."], ["03", "Run in shadow", "Observe the complete workflow with no external effect. Compare accepted outcomes, not model activity, against the manual baseline."], ["04", "Operate within bounds", "Release only the selected level. Keep human approval, guardian veto, least privilege, logging, and rollback wherever the level requires them."], ["05", "Make the gate decision", "Judge value, quality, safety, and eligibility separately. Continue the same scope, rework and rerun, or stop and roll back."],],
    pilotThresholdTitle: "PRE-REGISTER THESE GATES",
    pilotThresholds: { value: "Human active-time reduction on accepted cases", quality: "At least 90% of outputs accepted after the defined review; set the major-correction budget before launch", safety: "Zero critical error, unauthorized effect, data boundary breach, price, contract, or irreversible commitment", trace: "100% of approvals, tool calls, external effects, exceptions, and rollback evidence recorded", eligibility: "Report observed eligibility over every request, including cases the system did not accept" },
    pilotDecisionTitle: "ONE DATE · THREE POSSIBLE DECISIONS",
    pilotDecisions: [["CONTINUE BOUNDED", "All critical gates pass. Keep the same workflow and permissions; set the next review."], ["REWORK + RERUN", "Value exists but quality, eligibility, or reliability misses. Fix the cause without increasing autonomy."], ["STOP + ROLLBACK", "A critical gate fails or no useful value appears. Return to the safe process and preserve the evidence."]],
    pilotPlanCaveat: "These are practical planning floors, not statistical power calculations. Extend the sample for rare failures, low volume, high variance, affected groups, or higher-stakes decisions. Calendar time never substitutes for enough eligible cases.",
    pilotPlanCopy: "Copy the pilot brief",
    pilotPlanCopied: "Pilot brief copied",
    pilotPlanTemplate: "Open the evaluation-plan template",
    evidenceEyebrow: "FROM PILOT TO GATE DECISION",
    evidenceTitle: "Enter observed evidence. The weakest critical gate decides what happens next.",
    evidenceText: "A strong average cannot cancel a critical incident, and missing traces are not a negative result: they make the pilot non-evaluable. The output authorizes one next action, never an automatic increase in autonomy.",
    evidenceInputsTitle: "OBSERVED PILOT RESULTS",
    evidenceInputs: { cases: "Bounded live cases observed", time: "Human active-time reduction", quality: "Outputs accepted after defined review", critical: "Critical or unauthorized effects", trace: "Complete effect and approval trace", eligibility: "Observed share eligible" },
    evidenceUnits: { cases: "cases", percent: "%", events: "events" },
    evidenceMatrixTitle: "GATE LEDGER",
    evidenceMatrix: { sample: "Decision sample", value: "Value on accepted cases", quality: "Accepted quality", safety: "Critical safety", trace: "Effect evidence", eligibility: "Eligibility · economic signal" },
    evidenceStatuses: { pass: "PASS", fail: "FAIL", incomplete: "INCOMPLETE", signal: "SIGNAL" },
    evidenceDecisions: {
      continue: { label: "CONTINUE BOUNDED", text: "All decision and critical gates pass. Continue only the same workflow, permissions, and fallback; set a dated review. Autonomy does not increase." },
      rework: { label: "REWORK + RERUN", text: "The pilot is evaluable, but value or accepted quality misses its preregistered floor. Fix the cause and rerun the same gate before expanding anything." },
      unknown: { label: "NO DECISION YET", text: "The live sample or effect trace is incomplete. Collect the missing evidence under the current boundary; do not count this as a failure or a success." },
      stop: { label: "STOP + ROLLBACK", text: "A critical or unauthorized effect occurred. Stop live operation, return to the safe process, contain the incident, and preserve the complete evidence." },
    },
    evidenceObserved: "Observed whole-workload reduction",
    evidencePlanned: "Planning envelope",
    evidenceFreed: "Human hours measured / month",
    evidenceEligibilityWarning: "Observed eligibility is more than 10 points below the assumption. The technical result may pass, but the economic case must be recalibrated.",
    evidenceRule: "Decision hierarchy: critical safety → evaluability → value and quality → bounded continuation. Eligibility changes the economics; it never disappears from the denominator.",
    evidenceCopy: "Copy the gate decision",
    evidenceCopied: "Gate decision copied",
    operationsEyebrow: "OPERATE WITHOUT LOSING THE BOUNDARY",
    operationsTitle: "Production is a reversible operating state. Evaluation continues.",
    operationsText: "Translate the gate decision into named ownership, monitoring windows, hard suspension triggers, a rehearsable rollback, and a dated reassessment. A model, tool, permission, policy, or data change reopens the evidence question.",
    operationStates: {
      continue: { label: "LIVE · BOUNDED", text: "The same measured workflow may operate under the proven permissions and fallback. No adjacent task or new autonomy is included." },
      rework: { label: "PILOT FROZEN", text: "Live expansion is blocked. Keep the safe process while the failed value or quality gate is corrected and rerun." },
      unknown: { label: "RELEASE BLOCKED", text: "Production is not authorized because the decision sample or effect evidence is incomplete." },
      stop: { label: "SUSPENDED", text: "Live operation is stopped. Rollback and incident handling take priority over further evaluation." },
    },
    operationOwnersTitle: "OPERATING CONTRACT",
    operationFields: { owner: "Workflow owner", incident: "Reachable incident owner", review: "Next formal reassessment" },
    operationDefaults: { owner: "Workflow owner", incident: "Incident owner" },
    operationMetrics: { review: "Formal review cadence", containment: "Target time to contain", scope: "Authorized scope" },
    operationDays: "days",
    operationSameScope: "Same proven workflow only",
    operationMonitoringTitle: "THE FOUR WINDOWS TO WATCH",
    operationMonitoring: [["QUALITY", "Every accepted output, correction, rejection, abstention, and exception by segment."], ["EFFECTS", "Every tool call, approval, destination, external effect, read-back, duplicate, and rollback result."], ["DRIFT + CHANGE", "Model, prompt, retrieval source, policy, permission, supplier, data mix, latency, and cost changes."], ["BUSINESS", "Observed eligibility, human active time, throughput, queue, rework, displaced bottlenecks, and shipped outcome."]],
    operationStopTitle: "SUSPEND IMMEDIATELY WHEN",
    operationStops: ["Any critical, unauthorized, irreversible, misdirected, or untraceable effect occurs.", "Required approval, guardian veto, identity boundary, write limit, or fallback is unavailable.", "The operating version differs from the evaluated model, prompt, tools, sources, permissions, or policy.", "Accepted quality falls below its gate in two consecutive windows, or one protected segment crosses a critical floor.", "Cost, latency, queue, or human workload exceeds the written operational limit."],
    operationRollbackTitle: "ROLLBACK IN FIVE PROVABLE STEPS",
    operationRollback: [["01", "Contain", "Stop intake and revoke or disable write-capable execution."], ["02", "Route safely", "Send pending and new cases to the tested manual fallback."], ["03", "Preserve", "Freeze logs, versions, approvals, tool receipts, destinations, and timestamps."], ["04", "Reconcile", "Read back external state, identify every effect, repair what is safely reversible, and escalate the rest."], ["05", "Re-authorize", "Resume only after the owner records cause, corrective action, rerun evidence, and a new gate decision."]],
    operationChangeRuleTitle: "CHANGE CONTROL",
    operationChangeRule: "Configuration changes are new evidence claims. Cosmetic changes may use a regression check; model, data, retrieval, tool, permission, policy, or workflow changes require the affected frozen tests and gate to be rerun before release.",
    operationRetireTitle: "REVIEW ALSO MEANS RETIRE",
    operationRetire: "At the review date, compare against the current manual baseline rather than the original demo. Continue, narrow, replace, or retire. Preserve export, deletion, supplier exit, access revocation, and the manual process.",
    operationCopy: "Copy the operating card",
    operationCopied: "Operating card copied",
    operationRunbook: "Open the incident runbook",
    dossierEyebrow: "HAND OFF THE DECISION · NOT THE DEMO",
    dossierTitle: "Package the whole chain of evidence into one reviewable decision dossier.",
    dossierText: "A future owner should be able to reconstruct the assumptions, protocol, observed result, authorized scope, and rollback without relying on memory or a slide deck.",
    dossierArtifacts: [["01", "Calibrated scenario", "Volume, manual baseline, eligible share, planning range, and setup assumption."], ["02", "Preregistered protocol", "Level, horizon, frozen set, bounded live sample, thresholds, and possible decisions."], ["03", "Gate decision", "Observed value, quality, safety, trace, eligibility, denominator, and authorized next action."], ["04", "Operating card", "Named owners, scope, monitoring, suspension triggers, rollback, change rule, and review date."]],
    dossierStatuses: { ready: "READY", recorded: "RECORDED", incomplete: "TO COMPLETE" },
    dossierReady: "REVIEWABLE DOSSIER",
    dossierDraft: "DRAFT DOSSIER",
    dossierMissing: "items still missing",
    dossierEvidenceMissing: "Complete decision sample or effect trace",
    dossierHandoffTitle: "ATTACH OR REFERENCE THESE SIX RECORDS",
    dossierHandoff: ["Signed mandate, scope, affected people, and current manual baseline with denominator.", "Exact system inventory: model, prompts, retrieval sources, tools, permissions, policies, suppliers, and versions.", "Frozen evaluation-set identifier or hash, segments, adversarial cases, thresholds, and reproducible results.", "Live-case ledger with eligibility, approvals, corrections, tool calls, destinations, external effects, read-backs, and rollbacks.", "Signed gate decision separating value, quality, safety, evaluability, economics, and authorized scope.", "Named operating and incident owners, contact route, fallback proof, rollback rehearsal, next review, and retirement path."],
    dossierBoundaryTitle: "KEEP THE DOSSIER SHAREABLE",
    dossierBoundary: "The exported Markdown contains the decision summary, not raw client data or secrets. Link to access-controlled evidence by stable identifier or hash, and record who can retrieve it. A file path that only one person understands is not a handoff.",
    dossierCopy: "Copy the complete dossier",
    dossierCopied: "Complete dossier copied",
    dossierDownload: "Download Markdown dossier",
    fieldPilotEyebrow: "0.3 · FROM METHOD TO FIELD EVIDENCE",
    fieldPilotTitle: "Prepare one real pilot without publishing raw evidence.",
    fieldPilotText: "Frame the observation, preserve the full denominator, review the redaction, and export a local draft. Nothing entered here is sent to a server or admitted to the public registry.",
    fieldPilotFlow: [["01", "Frame", "One workflow, version, baseline, population, and stop rule."], ["02", "Observe", "Keep accepted, failed, excluded, escalated, and missing cases."], ["03", "Review", "An independent person checks provenance, redaction, and transfer limits."], ["04", "Admit or withhold", "Only reviewed, anonymized reports may enter the public registry."]],
    fieldPilotLabels: { organization: "Organization path", integration: "Integration level", sector: "Sector overlay", alias: "Non-identifying project alias", workflow: "Exact workflow observed", version: "System + workflow version", start: "Observation start", end: "Observation end", transfer: "Where the result may transfer", unsupported: "What this result does not prove" },
    fieldPilotSectors: [{ id: "general", label: "General / cross-sector" }, { id: "healthcare", label: "Healthcare" }, { id: "education", label: "Education" }, { id: "finance", label: "Finance" }, { id: "critical", label: "Critical infrastructure" }],
    fieldPilotPrivacy: "Local-only drafting · Do not enter client names, personal data, secrets, privileged content, raw prompts, or exploitable security details.",
    fieldPilotChecklistTitle: "PUBLICATION REVIEW · ALL SIX MUST BE TRUE",
    fieldPilotChecklist: ["The baseline, denominator, exclusions, and missing cases are retained.", "Observation, internal measurement, estimate, opinion, and supplier claim are separated.", "Incidents, near misses, corrections, refusals, and withdrawals remain visible.", "Personal, identifying, confidential, privileged, and security-sensitive detail is removed.", "An independent reviewer, publication authority, and withdrawal route exist in the private record.", "Transfer limits and unsupported claims are explicit enough to prevent reuse as a universal benchmark."],
    fieldPilotState: { draft: "LOCAL DRAFT · INCOMPLETE", review: "READY FOR INDEPENDENT REVIEW", completed: "requirements complete", remaining: "still required" },
    fieldPilotEvidenceTitle: "CURRENT OBSERVATION SNAPSHOT",
    fieldPilotEvidenceConfirm: "I replaced the demonstration values above with actual observations from this exact pilot and kept every eligible, excluded, failed, and missing case in the denominator.",
    fieldPilotDownload: "Download the local draft",
    fieldPilotProtocol: "Open the complete protocol",
    fieldPilotTemplate: "Open the blank report",
    fieldPilotGitHub: "Propose a pilot on GitHub",
    fieldPilotAlwaysDraft: "The export always remains a draft. Review readiness is not publication approval and is not field validation.",
    pathsEyebrow: "START WITH YOUR REALITY",
    pathsTitle: "Choose the structure you are working with.",
    pathsText: "Same method. Different depth of control, evidence, and responsibility.",
    selected: "YOUR STARTING PLAN",
    roles: "Minimum ownership",
    pilot: "Good first pilot",
    controls: "Do not skip",
    fullGuide: "Open the complete guide on GitHub",
    sectorEyebrow: "0.3 · ADD THE SECTOR VETOES",
    sectorTitle: "The process stays universal. The release conditions do not.",
    sectorText: "Choose the organization path first, then add every sector overlay that touches the service. A hospital can require healthcare and critical-infrastructure gates at the same time.",
    sectorFlow: [["01", "Universal process", "Owner, baseline, risk, evaluations, pilot."], ["02", "Sector veto", "Name the harm that efficiency cannot offset."], ["03", "Bounded release", "Keep only the authority proven safe in context."]],
    sectorLabels: { trigger: "When it changes the gate", veto: "Non-transferable veto", evidence: "Minimum release proof" },
    sectorGuide: "Open the sector gates",
    sectorCaveat: "These are operational overlays, not legal classifications. Verify the exact role, jurisdiction, product, population, and sector rules before release.",
    sectors: [
      { code: "H", title: "Healthcare", trigger: "Clinical purpose, patient-facing guidance, triage, diagnosis, treatment, or medical-device software.", veto: "No ambiguous intended purpose, unsafe subgroup result, or unowned clinical decision.", evidence: "Product qualification · clinical owner · subgroup evaluation · safe-care fallback", file: "sectors/en/healthcare.md" },
      { code: "E", title: "Education", trigger: "Learner data, assessment, admission, placement, discipline, safeguarding, or personalized pathways.", veto: "No efficiency gain can excuse exclusion, invalid assessment, or unavailable human challenge.", evidence: "Pedagogical mandate · learner segments · accessibility · correction and recourse", file: "sectors/en/education.md" },
      { code: "F", title: "Finance", trigger: "A material model, regulated control, customer outcome, transaction, or critical outsourced function.", veto: "No material use without inventory, accountable owners, independent validation, and resilience.", evidence: "Materiality file · model validation · customer impact · tested provider exit", file: "sectors/en/finance.md" },
      { code: "C", title: "Critical infrastructure", trigger: "Advice or action can affect an essential service, operational technology, safety state, or recovery path.", veto: "No untested command path, weakened interlock, common-mode failure, or AI-dependent shutdown.", evidence: "Hazard case · segregated architecture · simulator tests · independent kill path", file: "sectors/en/critical-infrastructure.md" },
    ],
    methodEyebrow: "THE OPERATING LOOP",
    methodTitle: "Eight steps, in the order people need them.",
    methodText: "Open only the step you are working on. Every step ends with a concrete piece of evidence, not a presentation.",
    deliverable: "Evidence to keep",
    steps: [
      ["Define the mandate", "Name the owner, the observable problem, the people affected, the limits, and the decision date.", "A signed mandate and a measurable baseline."],
      ["Map the real work", "Observe decisions, exceptions, data, systems, suppliers, waiting time, and informal AI use.", "A current-state map and AI system register."],
      ["Prioritize use cases", "Score value and difficulty separately. Start with a frequent, measurable, reversible case.", "Comparable use-case cards and one chosen pilot."],
      ["Classify risk and autonomy", "Assess impact, data, scale, jurisdictions, reversibility, and the powers granted to the system.", "A documented classification and required reviews."],
      ["Choose the simplest sufficient system", "Test rules and conventional automation before retrieval, tool use, agents, or multi-agent designs.", "An architecture decision and supplier assessment."],
      ["Build evaluations first", "Use real cases, critical segments, adversarial inputs, abstentions, and thresholds written before the pilot.", "A reproducible evaluation plan with stop criteria."],
      ["Pilot in three levels", "Move from shadow mode to human-approved copilot, then bounded automation only after each gate passes.", "A pilot decision separating value, reliability, and risk."],
      ["Operate, review, and retire", "Version everything, monitor outcomes, rehearse incidents, preserve a manual fallback, and plan withdrawal.", "Runbooks, review date, rollback, and retirement plan."],
    ],
    caseEyebrow: "WORKED EXAMPLE · FICTIONAL MICRO-BUSINESS",
    caseTitle: "A shared inbox becomes a measured copilot.",
    caseText: "Follow one bounded use case from its four-week baseline to a conditional gate decision. The numbers are synthetic; the evidence structure is reusable.",
    caseBadge: "8 people · 30 days · human approval",
    caseProblem: "Atelier Horizon receives quotes, breakdowns, billing questions, and complaints in one shared inbox. The goal is deliberately narrow: suggest routing and prepare a draft. The system never sends or updates anything.",
    caseMetrics: [["360", "requests / month"], ["11 min", "baseline handling"], ["8 min 35", "pilot handling"], ["0", "automatic sends"]],
    caseTimeline: [
      ["01 · DAYS 1–7", "Measure", "Time, same-day replies, rework, and routing errors are recorded before choosing a tool."],
      ["02 · DAYS 8–14", "Bound", "No automatic send, price promise, CRM write, schedule change, or reply to an ambiguous request."],
      ["03 · BEFORE PILOT", "Evaluate", "Forty frozen cases must pass routing, extraction, escalation, unsupported-claim, correction, and time thresholds."],
      ["04 · DAYS 15–21", "Run in shadow", "The copilot produces proposals without influencing live replies; every configuration version is recorded."],
      ["05 · DAYS 22–30", "Use as copilot", "Three trained users accept, correct, or reject every category and draft before sending."],
      ["06 · GATE", "Continue conditionally", "Value and reliability pass. Automatic sending and system writes remain prohibited while weak segments receive more tests."],
    ],
    caseDecision: "The useful decision is not “AI works.”",
    caseDecisionText: "It is: keep the measured copilot for 60 more days, review errors weekly, rerun the frozen set after every change, and consider automation only for a stable and reversible subset.",
    caseCta: "Read the complete evidence file",
    smeEyebrow: "WORKED EXAMPLE 02 · SME · B2B QUOTES · A2",
    smeTitle: "A quote becomes a governed case, not just a faster paragraph.",
    smeText: "This fictional 42-person industrial SME tests a business agent on one catalogue-quote workflow. The low and high bounds stay visible, excluded requests remain in the denominator, and every price still requires approval.",
    smeBadge: "42 people · 160 requests/month · 90-day pilot · fictional",
    smeProblem: "Noroît Mécanique SA receives quote requests by email with PDFs and spreadsheets. The agent qualifies the request, checks the authorized customer, catalogue, pricing matrix, and lead time, then prepares and verifies the quote. It waits for explicit approval before writing to the ERP and CRM and sending to the displayed recipient.",
    smeWorkflow: [["01", "Qualify", "Known customer, catalogue product, complete units"], ["02", "Extract", "References, quantities, recipient, requested date"], ["03", "Ground", "CRM, catalogue, discount matrix, ERP lead time"], ["04", "Calculate", "Deterministic price and margin rules"], ["05", "Verify", "Facts, conflicts, policy, intended effects"], ["06", "Approve", "One person sees price, sources, and destination"], ["07", "Execute", "ERP quote, CRM log, email, and read-back"]],
    smeRangeTitle: "One formula. Three honest planning cases.",
    smeRangeText: "160 requests × eligible share × 76 baseline minutes × reduction on eligible work. Capacity is not revenue.",
    smeRange: [["LOW", "60.8 h", "60% eligible · −50%"], ["CENTRAL", "97.3 h", "75% eligible · −64%"], ["HIGH", "129.2 h", "85% eligible · −75%"]],
    smeMetrics: [["76 → 27 min", "median human time on accepted eligible quotes"], ["×2.81", "theoretical accepted throughput per human hour"], ["163/238", "ready to approve without correction"], ["≈ −45%", "portfolio ceiling after the denominator"], ["0%", "autonomous completion at A2"]],
    smeDenominatorTitle: "The spectacular −64% becomes about −45% across the intake.",
    smeDenominatorText: "Of 316 live requests, 238 pass initial eligibility, 220 are ultimately accepted, 18 stop safely, and 78 never enter the agent workflow. The 163/238 figure means ready to approve, not autonomous. Every quote still has a human gate.",
    smeEvidenceTitle: "Three evidence classes that must not be mixed",
    smeEvidence: [["SME SURVEY", "31% / 29%", "OECD: 31% report GenAI use, but only 29% of users report use in core activities. The survey does not measure the size of the gain.", "https://www.oecd.org/en/publications/generative-ai-and-the-sme-workforce_2d08b99d-en/full-report/component-4.html"], ["EMPIRICAL COPILOT", "+15%", "QJE: average increase in resolved support chats per hour across 5,172 workers. Useful lower anchor; not an A2 quote agent.", "https://academic.oup.com/qje/article/140/2/889/7990658"], ["PROVIDER CASE", "−80 to −95%", "AWS/Grupo Elfa reports these quote-processing reductions. Useful high anchor; large-scale customer claim, not independent SME proof.", "https://aws.amazon.com/pt/blogs/aws-brasil/grupo-elfa-como-genai-automatizou-cotacoes-e-apoiou-a-empresa-a-incrementar-r-240m-em-receitas-em-12-meses/"]],
    smeSourceNote: "These sources make the envelope plausible; they do not validate Noroît’s synthetic result. The local frozen set, live ledger, errors, approvals, full cost, and downstream outcome decide the gate.",
    smeDecision: "Keep A2. Do not turn a good approval workflow into an A3 claim.",
    smeDecisionText: "The observed case is near the central range: 89.8 hours of monthly capacity, about CHF 4,500 net of recurring cost, and a simple setup payback near 3.5 months. Custom parts, exceptional discounts, contracts, and every final price remain human.",
    smeCta: "Open the complete SME evidence case",
    missionEyebrow: "WORKED EXAMPLE 03 · FOUNDATION · GRANT DOSSIERS · A2",
    missionTitle: "The agent prepares the evidence. The committee decides.",
    missionText: "This fictional 14-person foundation tests an A2 agent on grant administration, never on grant judgment. Every excluded channel stays open, every funding decision stays human, and mission harm overrides productivity.",
    missionBadge: "14 staff · 24 volunteer reviewers · 60 days · fictional",
    missionProblem: "Fondation Lien Local handles 720 micro-grant applications per year in three languages. The agent checks workflow entry, inventories and cites documents, applies a published completeness checklist, and prepares a pseudonymized reviewer packet. After approval, it writes and routes the packet. It never scores merit, need, or funding probability.",
    missionWorkflow: [["01", "Admit", "Consent, known program, channel, readable files"], ["02", "Inventory", "Documents and necessary data only"], ["03", "Extract", "Administrative facts with page citations"], ["04", "Check", "Deterministic completeness checklist"], ["05", "Prepare", "Document request or pseudonymized packet"], ["06", "Approve", "Sources, transformations, and recipients"], ["07", "Route", "Grant system, two reviewers, effect read-back"]],
    missionAgentTitle: "THE A2 AGENT CARRIES",
    missionAgent: ["Case state and source-linked extraction", "Published completeness checklist", "Draft missing-document request", "Pseudonymized reviewer packet", "Writes and routing after approval"],
    missionHumanTitle: "PEOPLE RETAIN",
    missionHuman: ["Applicant support and offline channels", "Mission and context interpretation", "Merit, need, amount, award, and refusal", "Conflict-of-interest resolution", "Explanation, challenge, and board accountability"],
    missionRangeTitle: "Administrative capacity, not mission impact.",
    missionRangeText: "60 applications × workflow share × 96 baseline minutes × reduction. Setup is CHF 12,000; recurring cost is CHF 750 per month.",
    missionRange: [["LOW", "23.8 h", "55% workflow · −45% · 16.6-month payback"], ["CENTRAL", "40.3 h", "70% workflow · −60% · 6.9-month payback"], ["HIGH", "53.8 h", "80% workflow · −70% · 4.6-month payback"]],
    missionMetrics: [["96 → 39 min", "median human time per accepted reviewer packet"], ["×2.46", "theoretical packet throughput per human hour"], ["58/86", "reviewer-ready without correction"], ["≈ −39%", "portfolio ceiling after all 120 applications"], ["100%", "funding decisions made by people"]],
    missionDenominatorTitle: "Outside the workflow does not mean refused.",
    missionDenominatorText: "Of 120 applications, 86 enter the standard administrative workflow, 79 produce accepted packets, 7 stop safely, and 34 receive human service. Telephone and paper applicants reach the same human funding gate.",
    missionGateTitle: "The mission gate has four vetoes",
    missionGate: [["ACCESS", "No channel removed", "Telephone, paper, and assisted applications remain available."], ["DIGNITY", "No need score", "The system does not rank vulnerability or infer deservingness."], ["EQUITY", "Segment the evidence", "Rework and stops are reviewed by language, channel, and organization type."], ["RECOURSE", "A person answers", "Every decision is explained and can be challenged outside the agent."]],
    missionEvidenceTitle: "Sector reality, functional analogue, reported high bound",
    missionEvidence: [["SECTOR SURVEY", "1% yes", "Candid: 1% of 529 responding foundations report using GenAI to screen or help decide; 97% say no.", "https://candid.org/blogs/will-foundations-soon-use-ai-to-screen-grant-applications/"], ["FUNCTIONAL ANALOGUE", "1,000+", "Degrees of Change handles more than 1,000 applications with 150 volunteer assessors; the provider case describes extraction and staff-reviewed matching, not a causal time result.", "https://learn.microsoft.com/power-platform/guidance/case-studies/nonprofit"], ["PROVIDER HIGH BOUND", "−80%", "Microsoft reports an 80% reduction in aid-disbursement wait time at NZF. Several changes and a wider automation boundary prevent direct transfer.", "https://www.microsoft.com/en/customers/story/23068-national-zakat-foundation-microsoft-copilot-studio"]],
    missionLegalNote: "Swiss boundary: the FDPIC explains that fully automated individual decisions covered by Article 21 FADP trigger information and human-review rights. This case keeps the funding decision human by design; actual legal qualification still requires case-specific review.",
    missionDecision: "Keep administrative A2. Prohibit automated grant judgment.",
    missionDecisionText: "The observed case releases 37.5 administrative hours per month, about CHF 1,575 net of recurring cost, with a simple payback near 7.6 months. That creates capacity. It does not mean another grant. Any expansion requires affected-person consultation, larger language and channel samples, and a tested challenge path.",
    missionCta: "Open the complete foundation evidence case",
    publicEyebrow: "WORKED EXAMPLE · PUBLIC SERVICE · PLANNING DOSSIERS · A2",
    publicTitle: "The authority remains visible at every gate.",
    publicText: "This fictional Swiss municipality tests an A2 agent on administrative completeness, never on planning judgment. The workflow can move faster only if mandate, procurement, evidence, public notice, appeal, archives, and a no-AI service path move with it.",
    publicBadge: "62,000 residents · 17-person service · 90 days · fictional",
    publicProblem: "The City of Mont-Rive receives 1,080 planning applications per year in French and German. The agent inventories documents, extracts source-cited administrative facts, and applies a published checklist. After officer approval, it sends, records, and routes. It never declares completeness, interprets law, or recommends approval, refusal, conditions, or priority.",
    publicWorkflow: [["01", "Admit", "Authority, signature, channel, known request type"], ["02", "Inventory", "Documents, versions, and necessary data"], ["03", "Extract", "Parcel and project facts with page or plan citations"], ["04", "Cross-check", "Published checklist and controlled official sources"], ["05", "Prepare", "Missing-item list or neutral case packet"], ["06", "Approve", "Sources, uncertainty, recipient, and effects"], ["07", "Record", "Send, register, route, and effect read-back"]],
    publicAgentTitle: "THE A2 AGENT CARRIES",
    publicAgent: ["Versioned case state and source-linked extraction", "Published administrative checklist", "Draft missing-item request", "Neutral case packet with uncertainty", "Register write and routing after approval"],
    publicAuthorityTitle: "PEOPLE AND THE AUTHORITY RETAIN",
    publicAuthority: ["Assistance and offline channels", "Legal qualification and equal treatment", "Site visits, objections, and local context", "Approval, refusal, conditions, reasons, and signature", "File access, challenge, appeal, and accountability"],
    publicRangeTitle: "A public case can fail even when the tool saves time.",
    publicRangeText: "90 applications × workflow share × 145 baseline minutes × reduction. Setup is CHF 48,000; recurring cost is CHF 3,200 per month, including governance and exit.",
    publicRange: [["LOW", "39.2 h", "45% workflow · −40% · recurring cost not covered"], ["CENTRAL", "71.8 h", "60% workflow · −55% · 20.0-month payback"], ["HIGH", "106.5 h", "72% workflow · −68% · 9.4-month payback"]],
    publicMetrics: [["145 → 58 min", "median human time per accepted case packet"], ["×2.50", "theoretical packets per officer-hour"], ["121/166", "approval-ready without correction"], ["≈ −35%", "portfolio ceiling across all 270 applications"], ["100%", "public decisions made by qualified people"]],
    publicDenominatorTitle: "Outside the agent still means inside the public service.",
    publicDenominatorText: "Of 270 consecutive applications, 166 enter the standard workflow, 158 produce accepted packets, 8 stop safely, and 104 stay with people. Nineteen paper or assisted applications reach the same qualified officer without agent prioritization.",
    publicGatesTitle: "Six gates before public production",
    publicGates: [["P0", "Opportunity", "Mandate, baseline, non-AI options, and decision authority."], ["P1", "Law + impact", "Applicable law, rights, languages, accessibility, and appeal."], ["P2", "Procurement", "Audit, subprocessors, retention, changes, export, and exit."], ["P3", "Independent evidence", "Representative cases, segments, security, abuse, and outages."], ["P4", "Controlled pilot", "Shadow mode, named approvers, complaint path, and immediate stop."], ["P5", "Accountable production", "Signed decision, public notice, archives, fallback, and withdrawal date."]],
    publicEvidenceTitle: "Field result, task upper bound, governance analogue",
    publicEvidence: [["FIELD PILOT", "60–80%", "Milton Keynes officers reported faster validation; receipt-to-validation fell from 15.8 to 7.6 days. The three-month supplier case is not causal proof for a whole service.", "https://www.local.gov.uk/case-studies/milton-keynes-city-council-and-valon-streamlining-planning-ai"], ["TASK UPPER BOUND", "18.5h → 16m", "Cambridge reports 16 minutes for PlanAI summaries versus 18.5 human hours on summaries. Planners still read every submission; this narrow ratio cannot price a dossier workflow.", "https://www.cambridge.gov.uk/news/2025/07/21/harnessing-the-power-of-ai-to-transform-planning-consultations"], ["GOVERNANCE ANALOGUE", "6,000+", "Leeds handles over 6,000 applications yearly and paired six months of co-design with impact reviews, source links, officer approval, an audit trail, and a public ATRS record.", "https://www.local.gov.uk/case-studies/leeds-city-council-and-xylo-transforming-planning-ai"]],
    publicLegalNote: "Swiss boundary: there is no overarching AI-specific law yet, while existing information-security, data-protection, administrative, and sector rules still apply. The FDPIC is a federal reference; a municipality must qualify the relevant cantonal and public-law regime. Every public decision stays human here by design.",
    publicDecision: "Authorize administrative A2 for six months. Keep public power human.",
    publicDecisionText: "The normalized observation is 76.4 hours of monthly capacity, about CHF 2,757 net of recurring cost, and simple payback near 17.4 months. The low case fails the economic gate. Compliance analysis, reasons, prioritization, or a supplier model change returns the system to P0.",
    publicCta: "Open the complete public-service evidence case",
    soloEyebrow: "COPILOT CASE · INDEPENDENT PROFESSIONAL · A1",
    soloTitle: "Fourteen days to test one useful boundary.",
    soloText: "A small pilot should answer a small decision. Follow an independent consultant from meeting notes to a reviewed follow-up, without connecting email, calendar, or client systems.",
    soloBadge: "COPILOT · 1 person · 14 days · R2/A1",
    soloProblem: "Camille Rey spends a median 44 minutes turning meeting notes into a summary, action list, and follow-up email. The pilot tests a structured first draft while prices, commitments, recipients, and sending remain exclusively human.",
    soloRules: ["No meeting recording", "No mailbox connection", "No price or commitment", "Human chooses and sends"],
    soloMetrics: [["−23%", "median preparation time"], ["12/14", "ready within 24 hours"], ["4/14", "major rework"], ["0", "invented commitments"]],
    soloClarifierTitle: "Why only −23%? Because this is not a business agent.",
    soloClarifier: "The system drafts one step. It has no mailbox, calendar, CRM, memory, tool execution, or authority to complete the follow-up. This result must never be used as a benchmark for an A2–A4 implementation.",
    soloPhases: [
      ["DAYS 01–02", "Measure", "Confirm 22 historical follow-ups, the manual fallback, data rules, and an eight-hour setup cap."],
      ["DAYS 03–07", "Freeze", "Tune on 12 authorized cases, then decide on 12 separate cases against thresholds written in advance."],
      ["DAYS 08–10", "Shadow", "Generate five drafts but reveal them only after the real follow-up has been written manually."],
      ["DAYS 11–14", "Copilot", "Review nine live drafts against notes. Add commercial content, choose the recipient, and send manually."],
    ],
    soloDecision: "Extend the draft-only copilot for 30 days.",
    soloDecisionText: "The median falls from 44 to 34 minutes and all critical gates pass, but 29% of drafts still need major rework. No automatic sending, full proposal generation, or system connection is justified.",
    soloCta: "Open the 14-day evidence file",
    agentEyebrow: "WORKED EXAMPLE 03 · BUSINESS AGENT · INDEPENDENT · A2",
    agentTitle: "The same follow-up becomes a complete, approval-gated workflow.",
    agentText: "Phase 2 keeps the same professional, baseline, and outcome. What changes is the system: approved tools, persistent case state, quality control, execution after approval, and explicit exception handling.",
    agentBadge: "1 person · 30 days · R2/A2 · fictional case",
    agentProblem: "After the A1 copilot pilot, Camille tests a business agent on 20 eligible follow-ups. It reads authorized CRM context, prepares the summary and actions, and checks facts and policy. It waits for one explicit approval before updating the CRM, creating tasks, and sending the reviewed email.",
    agentWorkflow: [["01", "Capture", "Structured notes and eligibility check"], ["02", "Context", "Read-only CRM and client rules"], ["03", "Compose", "Summary, actions, and follow-up"], ["04", "Verify", "Facts, dates, policy, and conflicts"], ["05", "Approve", "One informed human decision"], ["06", "Execute", "Email, CRM, tasks, and audit log"]],
    agentDoesTitle: "THE AGENT OWNS",
    agentDoes: ["Case state and tool sequence", "Fact and policy checks", "Draft, CRM entry, and task preparation", "Execution after approval", "Complete action and error log"],
    humanDoesTitle: "THE PERSON OWNS",
    humanDoes: ["Eligibility and purpose", "Price, scope, and commitments", "The approval or refusal", "Ambiguous and sensitive exceptions", "Weekly error and value review"],
    agentMetrics: [["44 → 14 min", "median human active time · −68%"], ["×3.1", "accepted follow-ups per owner-hour"], ["13/20", "ready to approve without correction"], ["3/20", "correctly escalated"], ["0", "unapproved external actions"]],
    agentCompareTitle: "Same work. Three different claims.",
    agentCompare: [["A1 · Copilot", "44 → 34 min", "Drafts one step; the person carries and completes the workflow."], ["A2 · Business agent", "44 → 14 min", "Runs the full bounded workflow and executes only after approval."], ["A3 · Candidate", "Not claimed", "Autonomous low-risk sending requires 50 more cases and a new gate."]],
    agentPhases: [["DAYS 01–05", "Connect safely", "Use separate identity, least privilege, read-only CRM first, idempotent writes, a kill switch, and a tested manual fallback."], ["DAYS 06–12", "Replay frozen cases", "Run 40 representative cases, including conflicts, missing context, price requests, prompt injection, duplicate actions, and unavailable tools."], ["DAYS 13–20", "Run in shadow", "Compare the complete proposed workflow with the real manual follow-up; no email or write reaches a live system."], ["DAYS 21–30", "Operate at A2", "Camille reviews one evidence packet, approves or refuses, and the agent executes the authorized actions while logging every effect."]],
    agentDecision: "Keep A2 for 60 days. Do not claim A3 yet.",
    agentDecisionText: "The gain is large because the system now carries the workflow, not because the model merely writes faster. Autonomous sending remains blocked until 50 additional eligible cases show zero critical errors, stable exceptions, no more than 10% major correction, and a verified rollback.",
    agentCta: "Read the complete A2 evidence file",
    agencyEyebrow: "WORKED EXAMPLE 04 · ORCHESTRATED AGENCY · INDEPENDENT · A3",
    agencyTitle: "A multi-agent agency turns one standard diagnostic into a governed production line.",
    agencyText: "This is where orchestration becomes useful: the work contains distinct research, analysis, quality, and execution roles that can run in parallel. The scope remains one eligible service, not the whole business.",
    agencyBadge: "1 owner · 60 days · 60 frozen + 12 live cases · fictional",
    agencyProblem: "Camille delivers a standardized operational diagnostic for existing small-business clients. After the client interview, the agency qualifies the case, retrieves authorized evidence, scores the process, produces the report and action plan, challenges its own conclusions, then performs low-risk CRM, task, delivery, and scheduling actions inside a pre-approved service policy.",
    agencyOrchestrator: "Assigns work, enforces the case policy, resolves dependencies, stops on disagreement, and accepts no specialist’s self-reported success without effect evidence.",
    agencySpecialists: [["01", "Intake", "Identity, eligibility, minimization"], ["02", "Evidence", "Authorized sources and traceable citations"], ["03", "Analyst", "Diagnosis, scoring, and uncertainty"], ["04", "Delivery", "Report, actions, and client-ready structure"], ["05", "Guardian", "Facts, contradictions, risk, and permissions"], ["06", "Executor", "Delivery, CRM, tasks, and scheduling"]],
    agencyFoundationLabel: "SHARED CONTROL PLANE",
    agencyFoundation: ["Versioned case state", "Least-privilege identities", "Event and effect ledger", "Frozen evaluations", "Cost and concurrency limits", "Manual fallback + kill switch"],
    agencyCompareTitle: "Active human time for the same accepted diagnostic",
    agencyCompare: [["Manual", "7h 40", "Reference"], ["A1 · Copilot", "5h 50", "−24%"], ["A2 · Single agent", "2h 35", "−66%"], ["A3 · Orchestrated agency", "58 min", "−87%"]],
    agencyMetrics: [["×7.9", "accepted diagnostics per owner-hour"], ["9/12", "accepted without major rework"], ["8/12", "eligible cases completed straight through"], ["4/12", "stopped and escalated before effect"], ["5h 20", "median internal cycle vs 18h"], ["0", "unauthorized commitments or writes"]],
    agencyEligibilityTitle: "The denominator stays visible",
    agencyEligibilityText: "Only 12 of 17 live requests enter the A3 population. Five are excluded before execution: two new prices, one contract change, one HR dataset, and one contradictory client identity. The 8/12 straight-through result is therefore 8/17 across all requests, not 67% of the whole business.",
    agencyPhases: [["DAYS 01–10", "Decompose the service", "Separate roles, inputs, outputs, permissions, failure boundaries, effect evidence, and the situations that must remain human."], ["DAYS 11–25", "Freeze the comparison", "Run 60 cases through manual, copilot, single-agent, and orchestrated conditions; measure accepted output, not agent activity."], ["DAYS 26–40", "Shadow the agency", "Run specialists in parallel without live effects. Inject disagreement, stale memory, tool outages, duplicated events, and poisoned source content."], ["DAYS 41–60", "Operate bounded A3", "Allow only catalogued low-risk effects on eligible cases. Guardian veto, cost limits, rollback, and human escalation remain active."]],
    agencyDecision: "A3 passes for one standard service. A4 remains unproven.",
    agencyDecisionText: "The agency may continue for the defined diagnostic and its catalogued effects. It may not choose new services, prices, contracts, clients, data classes, or permissions. Broad multi-system autonomy requires a separate mandate, an independent audit, and evidence across several workflows.",
    agencyTalosNote: "Talos/Hermes analogy, not a Talos/Hermes result",
    agencyTalosText: "The architecture mirrors an orchestrator, specialists, shared state, tools, a guardian, and observability. The numbers belong only to this synthetic case; the public Talos repository does not yet publish a reproducible productivity benchmark.",
    agencyCta: "Read the complete A3 evidence file",
    ladderEyebrow: "TECHNICAL PROGRESSION",
    ladderTitle: "Complexity is earned, not assumed.",
    ladderText: "Move one level at a time. Stop when a simpler system meets the need.",
    ladder: ["Documented manual process", "Deterministic rule", "Conventional automation", "Single model call", "Controlled retrieval", "Tool workflow with approval", "Bounded business agent", "Multi-agent orchestration", "Supervised multi-system agency"],
    riskEyebrow: "QUICK CONTROL ORIENTATION",
    riskTitle: "See how impact and autonomy change the control level.",
    riskText: "This is internal triage, not a legal classification.",
    impact: "Potential impact",
    autonomy: "Technical autonomy",
    impactOptions: ["R0 · internal and easily checked", "R1 · assistance with review", "R2 · people, data, or external action", "R3 · rights, health, employment, public authority"],
    autonomyOptions: ["A0 · advice only", "A1 · research or draft", "A2 · action after explicit approval", "A3 · bounded autonomous actions", "A4 · broad multi-system autonomy"],
    orientation: "Recommended control baseline",
    orientations: ["Owner, data rules, business tests, and a change log.", "Qualified approval, output validation, full logging, and rollback.", "Threat model, least privilege, limits, monitoring, and adversarial tests.", "Formal legal and impact assessment, governance, independent review, and human recourse.", "Executive exception, proof that lower autonomy is insufficient, reinforced containment, and independent audit."],
    crosswalkOpen: "Open the matched control set",
    crosswalkEyebrow: "VERSIONED CONTROL CROSSWALK · JSON 1.1",
    crosswalkTitle: "Turn a risk label into controls that leave evidence.",
    crosswalkText: "Organization, impact, autonomy, use pattern, and jurisdiction resolve to stable control IDs. Each row exposes its trigger, evidence, decision gates, lifecycle phases, and dated source references.",
    crosswalkMatched: "candidate controls",
    crosswalkOrganization: "organization",
    crosswalkProfile: "active profile",
    crosswalkSources: "versioned sources",
    crosswalkRead: "READ 01 → 04",
    crosswalkReadingTitle: "Four questions per control",
    crosswalkReading: [["CONTROL", "What must be true?"], ["TRIGGER", "When does it apply?"], ["EVIDENCE", "What record must exist?"], ["GATE", "Which decision does it block or enable?"]],
    crosswalkEvidence: "Required evidence",
    crosswalkGates: "Decision gates",
    crosswalkPhases: "Lifecycle phases",
    crosswalkSourceRefs: "Source references",
    crosswalkCondition: "Trigger condition",
    crosswalkPriority: { baseline: "BASELINE", strengthened: "STRENGTHENED", critical: "CRITICAL" },
    crosswalkDownload: "Download the full control catalogue",
    crosswalkSchema: "Download the JSON schema",
    crosswalkLimit: "This is a thematic implementation crosswalk. It does not claim clause-level equivalence, certification, or legal compliance. A qualified person must still determine which conditions apply.",
    toolkitEyebrow: "USE THE PLAYBOOK",
    toolkitTitle: "Start with a blank decision, not a blank page.",
    toolkitText: "Copy the operational templates, complete the first gate, and keep the evidence with the project.",
    tools: [["Mandate", "Owner, baseline, outcome, and boundaries.", "templates/mandate.md"], ["Use-case card", "Value and difficulty kept separate.", "templates/use-case-card.md"], ["Risk assessment", "Scenarios, controls, and residual risk.", "templates/risk-assessment.md"], ["Evaluation plan", "Metrics, segments, thresholds, and stop rules.", "templates/evaluation-plan.md"], ["Pilot decision", "Value, reliability, and risk judged separately.", "templates/pilot-decision.md"], ["Incident runbook", "Contain, qualify, recover, and learn.", "templates/incident-runbook.md"], ["Accessibility assessment", "Complete tasks, assistive technologies, and an equivalent non-AI channel.", "templates/accessibility-assessment.md"], ["Fundamental-rights assessment", "Affected groups, rights, safeguards, recourse, and residual impact.", "templates/fundamental-rights-impact-assessment.md"], ["Field-feedback report", "Observed evidence, anonymization review, and explicit transfer limits.", "templates/field-feedback-report.md"]],
    sourceTitle: "Dated, primary-source foundation.",
    sourceText: "The playbook links to the official ISO catalogue, NIST AI RMF, OWASP GenAI, MITRE ATLAS, Swiss authorities, and current EU AI Act material. It is an implementation aid, not certification or legal advice.",
    sources: "Review the source register",
    footer: "AI Adoption Playbook · Evidence before autonomy.",
  },
  fr: {
    meta: "GUIDE DE TERRAIN · AOÛT 2026",
    nav: ["Modes d’usage", "Parcours", "Secteurs", "Méthode", "Cas d’école", "Contrôles", "Boîte à outils"],
    heroTitle: "Passez de l’intérêt pour l’IA à un système digne de confiance.",
    heroText: "Choisissez un problème utile, prouvez la valeur, maîtrisez le risque et n’augmentez l’autonomie que lorsque les preuves le permettent.",
    start: "Trouver mon point de départ",
    methodCta: "Voir la méthode",
    fieldPilotHero: "Préparer un pilote terrain",
    rule: "TROIS VÉRIFICATIONS AVANT D’AVANCER",
    gates: [["Sans responsable ni situation de départ", "Pas de projet"], ["Sans critères de réussite", "Pas de pilote"], ["Sans résultats vérifiables", "Pas de mise en service"]],
    stats: [["5", "parcours par structure"], ["8", "étapes ordonnées"], ["3", "règles de prudence"]],
    summaryEyebrow: "CE QUE CE PLAYBOOK VOUS AIDE À DÉCIDER",
    summaryTitle: "Choisir le système IA le plus simple qui améliore vraiment le travail.",
    summaryText: "Le guide sépare trois questions souvent confondues : le travail confié à l’IA, ce qu’elle peut faire sans vous et les règles du territoire où elle opère. Il transforme ensuite ces choix en un premier test petit et mesurable.",
    integrationEyebrow: "NOMMEZ LE SYSTÈME AVANT D’ANNONCER LE GAIN",
    integrationTitle: "Copilote, agent métier et agence orchestrée ne sont pas la même intégration.",
    integrationText: "Ils déplacent des volumes de travail différents, exigent des permissions différentes et se mesurent par des résultats différents. Un pourcentage sans son niveau induit en erreur.",
    integrationLabels: { system: "Ce que fait le système", human: "Rôle humain", planning: "Ancrage dans les preuves publiques", flow: "Preuve de bout en bout" },
    integrationLevels: [
      { code: "A0–A1", title: "Copilote", system: "Recherche, extrait ou rédige une étape. La personne déclenche, apporte le contexte, contrôle la réponse et réalise chaque action externe.", human: "Opérateur à chaque cycle", planning: "Les effets publiés vont d’un ralentissement mesuré à de forts gains sur des tâches étroites. Il n’existe pas de plage universelle.", flow: "0 % sans finalisation humaine" },
      { code: "A2–A3", title: "Agent métier", system: "Reçoit un dossier borné, utilise outils et mémoire autorisés, suit le workflow, termine les cas éligibles et escalade les exceptions.", human: "Validateur et responsable des exceptions", planning: "Essai terrain direct : 16,8 % plus rapide sur les échanges éligibles, 3,2 % sur tout le flux, avec une baisse de la note client.", flow: "5,8 % éligibles ; 35 % des échanges éligibles traités par l’agent sans escalade dans ce contexte" },
      { code: "A3–A4", title: "Agence orchestrée", system: "Un orchestrateur délègue recherche, exécution, contrôle qualité et coordination inter-systèmes à des agents spécialisés sous des règles communes.", human: "Gouverne objectifs, limites et exceptions", planning: "Aucune étude de terrain indépendante ne soutient un multiplicateur générique de 5 à 12 sur les résultats métier acceptés.", flow: "CORPGEN : 15,2 % terminés avec 46 tâches concurrentes dans un benchmark, pas en production" },
    ],
    measurementTitle: "Cinq chiffres à ne jamais mélanger",
    measurements: [["01", "Temps de cycle", "Délai écoulé entre demande et résultat."], ["02", "Temps humain actif", "Minutes réellement consacrées par une personne."], ["03", "Débit accepté", "Sorties acceptées par heure du responsable."], ["04", "Taux de bout en bout", "Cas éligibles terminés sans intervention."], ["05", "Résultat livré", "Effet réel en aval, pas l’activité du modèle."]],
    rangeNote: "Les anciennes plages universelles 20–40 %, 50–75 % et 80–92 % ont été retirées. Les études publiques ne les établissent pas comme effets généraux. Le calibrateur part maintenant d’hypothèses de mise à l’épreuve modifiables, jamais d’un gain promis.",
    evidenceLead: "PREUVES PRIMAIRES DE TERRAIN",
    evidenceLinks: [["Copilote support · +15 %", "https://academic.oup.com/qje/article/140/2/889/7990658"], ["Petite entreprise · 0 % en moyenne", "https://www.hbs.edu/ris/download.aspx?name=24-042.pdf"], ["Agent métier · 5,8 % éligibles", "https://arxiv.org/abs/2605.14830"], ["Code autonome · écart de livraison", "https://www.nber.org/papers/w35275"]],
    researchEyebrow: "CE QUE CHANGE LE DÉNOMINATEUR",
    researchTitle: "Six constats qui empêchent de gonfler les gains IA.",
    researchText: "Chaque chiffre répond à une question différente. Le résultat mesuré et la limite de transfert doivent être lus ensemble.",
    researchSignals: [
      { tag: "COPILOTE · TERRAIN", value: "+15 %", title: "Production du support", text: "Problèmes résolus par heure en moyenne. Les moins expérimentés gagnent le plus ; les meilleurs perdent légèrement en qualité.", url: "https://academic.oup.com/qje/article/140/2/889/7990658" },
      { tag: "PETITE ENTREPRISE · ECR", value: "0 %", title: "Effet métier moyen", text: "Environ +15 % pour les meilleurs et −8 % pour les plus faibles. Accéder au conseil ne garantit pas la qualité d’exécution.", url: "https://www.hbs.edu/ris/download.aspx?name=24-042.pdf" },
      { tag: "AGENT MÉTIER · ECR", value: "5,8 %", title: "Part éligible", text: "Les échanges éligibles sont 16,8 % plus rapides, mais le flux total gagne 3,2 % et leur note client baisse.", url: "https://arxiv.org/abs/2605.14830" },
      { tag: "CODE AUTONOME · TERRAIN", value: "+180 %", title: "Commits, pas résultats", text: "Le signal tombe à +30 % sur les versions livrées, sans hausse détectée de l’usage total des applications.", url: "https://www.nber.org/papers/w35275" },
      { tag: "AGENCE · BENCHMARK", value: "15,2 %", title: "Réalisation absolue", text: "Gain relatif de 3,5 face à 4,3 %, avec 46 tâches concurrentes dans un environnement simulé de six heures.", url: "https://www.microsoft.com/en-us/research/blog/corpgen-advances-ai-agents-for-real-work/" },
      { tag: "SECTEUR PUBLIC · ÉVALUATION", value: "19–26 min", title: "Gain quotidien déclaré", text: "Essais larges, sans attribution aléatoire ni preuve que le temps libéré devient un résultat public livré.", url: "https://www.gov.uk/government/publications/microsoft-365-copilot-experiment-cross-government-findings-report" },
    ],
    researchReview: "Lire la revue complète de 20 sources",
    calibratorEyebrow: "CALIBREZ AVANT DE PROMETTRE",
    calibratorTitle: "Transformez les fourchettes en scénario testable pour votre propre workflow.",
    calibratorText: "Choisissez le niveau d’intégration puis rendez visibles volume, temps manuel, part éligible, hypothèses d’effet basse et haute et effort initial. Le résultat est une enveloppe de stress, pas une prévision.",
    calibratorLevel: "Niveau d’intégration",
    calibratorLevels: [{ id: "copilot", label: "Copilote · A0–A1", note: "Une étape assistée" }, { id: "agent", label: "Agent métier · A2–A3", note: "Un workflow borné" }, { id: "agency", label: "Agence orchestrée · A3", note: "Spécialistes sous une politique" }],
    calibratorInputs: { minutes: "Minutes manuelles par dossier", cases: "Dossiers par mois", eligible: "Part réellement éligible", low: "Hypothèse d’effet basse", high: "Hypothèse d’effet haute", setup: "Effort initial de mise en place" },
    calibratorUnits: { minutes: "min", cases: "dossiers", eligible: "%", low: "%", high: "%", setup: "heures" },
    calibratorResults: { eligible: "Charge éligible actuelle", freed: "Heures humaines libérées / mois", remaining: "Heures humaines restantes sur les cas éligibles", total: "Réduction sur toute la charge", throughput: "Débit accepté théorique", payback: "Mise en place absorbée après" },
    calibratorReading: "LIRE CE RÉSULTAT CORRECTEMENT",
    calibratorCaution: "Le calcul suppose une qualité acceptée, aucun nouveau goulot et une éligibilité stable. Il exclut coût modèle, dérive de supervision, incidents, élasticité de la demande, revenu et temps des personnes hors workflow mesuré. Remplacez chaque hypothèse par une observation pendant le pilote.",
    calibratorPreset: "Effort suggéré",
    calibratorMonths: "mois",
    pilotPlannerEyebrow: "DU SCÉNARIO AU PROTOCOLE",
    pilotPlannerTitle: "Une fourchette n’est pas un plan. La prochaine décision doit pouvoir échouer proprement.",
    pilotPlannerText: "Le calibrateur rend les hypothèses visibles. Ce protocole fixe maintenant l’ordre, l’échantillon pratique, les preuves et la décision avant que le système ne touche au travail réel.",
    pilotRoadmap: ["Scénario calibré", "Pilote préenregistré", "Preuves observées", "Décision de périmètre", "Exploiter + réévaluer"],
    pilotPlanLabels: { horizon: "Horizon minimal", frozen: "Jeu d’évaluation figé", live: "Cas réels bornés", collection: "Collecte réelle à ce volume", days: "jours", weeks: "semaines", cases: "cas" },
    pilotPlanSteps: [["01", "Figer la décision", "Écrire responsable, périmètre du workflow, baseline, règle d’éligibilité, effets permis, seuils et autorité d’arrêt."], ["02", "Évaluer hors ligne", "Passer cas réels figés, segments critiques, abstentions, attaques, pannes d’outils et événements dupliqués avant tout usage réel."], ["03", "Observer en shadow", "Exécuter le workflow complet sans effet externe. Comparer les résultats acceptés à la baseline manuelle, pas l’activité du modèle."], ["04", "Opérer dans les limites", "Ne libérer que le niveau choisi. Maintenir validation humaine, veto du gardien, moindre privilège, journal et rollback lorsque le niveau l’exige."], ["05", "Prendre la décision de gate", "Juger séparément valeur, qualité, sécurité et éligibilité. Continuer le même périmètre, corriger et rejouer, ou arrêter et revenir en arrière."],],
    pilotThresholdTitle: "PRÉENREGISTRER CES GATES",
    pilotThresholds: { value: "Réduction du temps humain actif sur les cas acceptés", quality: "Au moins 90 % des sorties acceptées après la revue définie ; fixer le budget de corrections majeures avant le lancement", safety: "Zéro erreur critique, effet non autorisé, rupture de frontière de données, prix, contrat ou engagement irréversible", trace: "100 % des validations, appels d’outils, effets externes, exceptions et preuves de rollback journalisés", eligibility: "Publier l’éligibilité observée sur toutes les demandes, y compris celles que le système n’a pas acceptées" },
    pilotDecisionTitle: "UNE DATE · TROIS DÉCISIONS POSSIBLES",
    pilotDecisions: [["CONTINUER BORNÉ", "Toutes les gates critiques passent. Conserver le même workflow et les mêmes permissions ; fixer la prochaine revue."], ["CORRIGER + REJOUER", "La valeur existe mais qualité, éligibilité ou fiabilité manquent le seuil. Corriger la cause sans augmenter l’autonomie."], ["ARRÊTER + ROLLBACK", "Une gate critique échoue ou aucune valeur utile n’apparaît. Revenir au processus sûr et conserver les preuves."]],
    pilotPlanCaveat: "Ces volumes sont des planchers pratiques de planification, pas des calculs de puissance statistique. Étendez l’échantillon pour les erreurs rares, les faibles volumes, la forte variance, les groupes affectés ou les décisions à enjeu supérieur. Le temps calendaire ne remplace jamais assez de cas éligibles.",
    pilotPlanCopy: "Copier le brief de pilote",
    pilotPlanCopied: "Brief de pilote copié",
    pilotPlanTemplate: "Ouvrir le modèle de plan d’évaluation",
    evidenceEyebrow: "DU PILOTE À LA DÉCISION DE GATE",
    evidenceTitle: "Saisissez les preuves observées. La gate critique la plus faible décide de la suite.",
    evidenceText: "Une bonne moyenne n’annule pas un incident critique, et des traces manquantes ne constituent pas un résultat négatif : elles rendent le pilote non évaluable. La sortie autorise une seule prochaine action, jamais une hausse automatique de l’autonomie.",
    evidenceInputsTitle: "RÉSULTATS OBSERVÉS DU PILOTE",
    evidenceInputs: { cases: "Cas réels bornés observés", time: "Réduction du temps humain actif", quality: "Sorties acceptées après la revue définie", critical: "Effets critiques ou non autorisés", trace: "Trace complète des effets et validations", eligibility: "Part observée réellement éligible" },
    evidenceUnits: { cases: "cas", percent: "%", events: "événements" },
    evidenceMatrixTitle: "REGISTRE DES GATES",
    evidenceMatrix: { sample: "Échantillon de décision", value: "Valeur sur les cas acceptés", quality: "Qualité acceptée", safety: "Sécurité critique", trace: "Preuve des effets", eligibility: "Éligibilité · signal économique" },
    evidenceStatuses: { pass: "PASSE", fail: "ÉCHEC", incomplete: "INCOMPLET", signal: "SIGNAL" },
    evidenceDecisions: {
      continue: { label: "CONTINUER BORNÉ", text: "Toutes les gates de décision et critiques passent. Conserver uniquement le même workflow, les mêmes permissions et le fallback ; fixer une revue datée. L’autonomie n’augmente pas." },
      rework: { label: "CORRIGER + REJOUER", text: "Le pilote est évaluable, mais la valeur ou la qualité acceptée manque son plancher préenregistré. Corriger la cause et rejouer la même gate avant toute extension." },
      unknown: { label: "PAS ENCORE DE DÉCISION", text: "L’échantillon réel ou la trace des effets est incomplet. Recueillir les preuves manquantes dans le périmètre actuel ; ne compter cela ni comme un échec ni comme une réussite." },
      stop: { label: "ARRÊTER + ROLLBACK", text: "Un effet critique ou non autorisé s’est produit. Arrêter l’exploitation réelle, revenir au processus sûr, contenir l’incident et préserver toutes les preuves." },
    },
    evidenceObserved: "Réduction observée sur toute la charge",
    evidencePlanned: "Enveloppe de planification",
    evidenceFreed: "Heures humaines mesurées / mois",
    evidenceEligibilityWarning: "L’éligibilité observée est inférieure de plus de 10 points à l’hypothèse. Le résultat technique peut passer, mais le dossier économique doit être recalibré.",
    evidenceRule: "Hiérarchie de décision : sécurité critique → évaluabilité → valeur et qualité → continuation bornée. L’éligibilité modifie l’économie ; elle ne disparaît jamais du dénominateur.",
    evidenceCopy: "Copier la décision de gate",
    evidenceCopied: "Décision de gate copiée",
    operationsEyebrow: "EXPLOITER SANS PERDRE LA FRONTIÈRE",
    operationsTitle: "La production est un état réversible d’exploitation. L’évaluation continue.",
    operationsText: "Transformez la décision de gate en responsabilités nommées, fenêtres de surveillance, déclencheurs d’arrêt fermes, rollback répétable et réévaluation datée. Tout changement de modèle, outil, permission, règle ou donnée rouvre la question de la preuve.",
    operationStates: {
      continue: { label: "ACTIF · BORNÉ", text: "Le même workflow mesuré peut fonctionner avec les permissions et le fallback prouvés. Aucune tâche voisine ni autonomie nouvelle n’est incluse." },
      rework: { label: "PILOTE GELÉ", text: "L’extension réelle est bloquée. Conserver le processus sûr pendant la correction et le rejeu de la gate de valeur ou de qualité en échec." },
      unknown: { label: "MISE EN SERVICE BLOQUÉE", text: "La production n’est pas autorisée car l’échantillon de décision ou les preuves d’effets sont incomplets." },
      stop: { label: "SUSPENDU", text: "L’exploitation réelle est arrêtée. Le rollback et le traitement de l’incident passent avant toute nouvelle évaluation." },
    },
    operationOwnersTitle: "CONTRAT D’EXPLOITATION",
    operationFields: { owner: "Responsable du workflow", incident: "Responsable d’incident joignable", review: "Prochaine réévaluation formelle" },
    operationDefaults: { owner: "Responsable du workflow", incident: "Responsable d’incident" },
    operationMetrics: { review: "Cadence de revue formelle", containment: "Objectif de délai de confinement", scope: "Périmètre autorisé" },
    operationDays: "jours",
    operationSameScope: "Uniquement le workflow prouvé",
    operationMonitoringTitle: "LES QUATRE FENÊTRES À SURVEILLER",
    operationMonitoring: [["QUALITÉ", "Chaque sortie acceptée, correction, rejet, abstention et exception, ventilés par segment."], ["EFFETS", "Chaque appel d’outil, validation, destination, effet externe, relecture d’état, doublon et résultat de rollback."], ["DÉRIVE + CHANGEMENT", "Évolutions du modèle, prompt, source RAG, règle, permission, fournisseur, mix de données, latence et coût."], ["MÉTIER", "Éligibilité observée, temps humain actif, débit, file, reprises, goulots déplacés et résultat réellement livré."]],
    operationStopTitle: "SUSPENDRE IMMÉDIATEMENT SI",
    operationStops: ["Un effet critique, non autorisé, irréversible, mal dirigé ou non traçable se produit.", "La validation requise, le veto du gardien, la frontière d’identité, la limite d’écriture ou le fallback est indisponible.", "La version exploitée diffère du modèle, prompt, outils, sources, permissions ou règles évalués.", "La qualité acceptée passe sous sa gate pendant deux fenêtres consécutives, ou un segment protégé franchit un plancher critique.", "Le coût, la latence, la file ou la charge humaine dépasse la limite opérationnelle écrite."],
    operationRollbackTitle: "ROLLBACK EN CINQ ÉTAPES PROUVABLES",
    operationRollback: [["01", "Contenir", "Arrêter l’entrée et révoquer ou désactiver l’exécution capable d’écrire."], ["02", "Router en sécurité", "Envoyer les cas en attente et nouveaux vers le fallback manuel testé."], ["03", "Préserver", "Figer journaux, versions, validations, reçus d’outils, destinations et horodatages."], ["04", "Réconcilier", "Relire l’état externe, identifier chaque effet, réparer ce qui est réversible sans risque et escalader le reste."], ["05", "Réautoriser", "Ne reprendre qu’après consignation de la cause, correction, preuves rejouées et nouvelle décision de gate."],],
    operationChangeRuleTitle: "GESTION DU CHANGEMENT",
    operationChangeRule: "Une modification de configuration est une nouvelle affirmation de preuve. Un changement cosmétique peut utiliser une régression ; modèle, données, RAG, outil, permission, règle ou workflow exigent de rejouer les tests figés affectés et la gate avant remise en service.",
    operationRetireTitle: "RÉÉVALUER SIGNIFIE AUSSI RETIRER",
    operationRetire: "À la date de revue, comparez au processus manuel actuel plutôt qu’à la démonstration d’origine. Continuez, réduisez, remplacez ou retirez. Préservez export, suppression, sortie fournisseur, révocation des accès et processus manuel.",
    operationCopy: "Copier la fiche d’exploitation",
    operationCopied: "Fiche d’exploitation copiée",
    operationRunbook: "Ouvrir le runbook d’incident",
    dossierEyebrow: "TRANSMETTRE LA DÉCISION · PAS LA DÉMO",
    dossierTitle: "Rassemblez toute la chaîne de preuves dans un dossier de décision révisable.",
    dossierText: "Un futur responsable doit pouvoir reconstruire hypothèses, protocole, résultat observé, périmètre autorisé et rollback sans dépendre d’une mémoire orale ou d’un diaporama.",
    dossierArtifacts: [["01", "Scénario calibré", "Volume, baseline manuelle, part éligible, fourchette de planification et hypothèse de mise en place."], ["02", "Protocole préenregistré", "Niveau, horizon, jeu figé, échantillon réel borné, seuils et décisions possibles."], ["03", "Décision de gate", "Valeur, qualité, sécurité, trace, éligibilité et dénominateur observés, puis prochaine action autorisée."], ["04", "Fiche d’exploitation", "Responsables nommés, périmètre, surveillance, arrêts, rollback, gestion du changement et date de revue."]],
    dossierStatuses: { ready: "PRÊT", recorded: "CONSIGNÉ", incomplete: "À COMPLÉTER" },
    dossierReady: "DOSSIER RÉVISABLE",
    dossierDraft: "DOSSIER BROUILLON",
    dossierMissing: "éléments encore manquants",
    dossierEvidenceMissing: "Compléter l’échantillon de décision ou la trace des effets",
    dossierHandoffTitle: "JOINDRE OU RÉFÉRENCER CES SIX ENREGISTREMENTS",
    dossierHandoff: ["Mandat signé, périmètre, personnes affectées et baseline manuelle actuelle avec dénominateur.", "Inventaire exact du système : modèle, prompts, sources RAG, outils, permissions, règles, fournisseurs et versions.", "Identifiant ou hash du jeu d’évaluation figé, segments, cas adversariaux, seuils et résultats reproductibles.", "Registre des cas réels avec éligibilité, validations, corrections, appels d’outils, destinations, effets externes, relectures et rollbacks.", "Décision de gate signée séparant valeur, qualité, sécurité, évaluabilité, économie et périmètre autorisé.", "Responsables d’exploitation et d’incident nommés, contact, preuve du fallback, exercice de rollback, prochaine revue et voie de retrait."],
    dossierBoundaryTitle: "GARDER LE DOSSIER PARTAGEABLE",
    dossierBoundary: "Le Markdown exporté contient la synthèse de décision, pas les données clients brutes ni les secrets. Référencez les preuves sous contrôle d’accès par identifiant stable ou hash, et indiquez qui peut les retrouver. Un chemin de fichier compris par une seule personne n’est pas une transmission.",
    dossierCopy: "Copier le dossier complet",
    dossierCopied: "Dossier complet copié",
    dossierDownload: "Télécharger le dossier Markdown",
    fieldPilotEyebrow: "0.3 · DE LA MÉTHODE À LA PREUVE TERRAIN",
    fieldPilotTitle: "Préparez un vrai pilote sans publier les preuves brutes.",
    fieldPilotText: "Cadrez l’observation, conservez le dénominateur complet, révisez l’anonymisation et exportez un brouillon local. Rien de ce qui est saisi ici n’est transmis à un serveur ni admis dans le registre public.",
    fieldPilotFlow: [["01", "Cadrer", "Un workflow, une version, une baseline, une population et une règle d’arrêt."], ["02", "Observer", "Conserver cas acceptés, échoués, exclus, escaladés et traces manquantes."], ["03", "Réviser", "Une personne indépendante contrôle provenance, anonymisation et limites de transfert."], ["04", "Admettre ou retenir", "Seuls les rapports révisés et anonymisés peuvent rejoindre le registre public."]],
    fieldPilotLabels: { organization: "Parcours de l’organisation", integration: "Niveau d’intégration", sector: "Extension sectorielle", alias: "Alias de projet non identifiant", workflow: "Workflow exact observé", version: "Version du système + workflow", start: "Début de l’observation", end: "Fin de l’observation", transfer: "Contextes auxquels le résultat peut se transférer", unsupported: "Ce que ce résultat ne démontre pas" },
    fieldPilotSectors: [{ id: "general", label: "Général / transverse" }, { id: "healthcare", label: "Santé" }, { id: "education", label: "Éducation" }, { id: "finance", label: "Finance" }, { id: "critical", label: "Infrastructure critique" }],
    fieldPilotPrivacy: "Brouillon local uniquement · Ne saisissez ni nom de client, donnée personnelle, secret, contenu privilégié, prompt brut ou détail de sécurité exploitable.",
    fieldPilotChecklistTitle: "REVUE DE PUBLICATION · LES SIX DOIVENT ÊTRE VRAIES",
    fieldPilotChecklist: ["La baseline, le dénominateur, les exclusions et les cas manquants sont conservés.", "Observation, mesure interne, estimation, opinion et affirmation fournisseur sont séparées.", "Incidents, quasi-incidents, corrections, refus et retraits restent visibles.", "Les détails personnels, identifiants, confidentiels, privilégiés et sensibles pour la sécurité sont retirés.", "Un réviseur indépendant, une autorité de publication et une voie de retrait existent dans le dossier privé.", "Les limites de transfert et affirmations non démontrées empêchent l’usage comme benchmark universel."],
    fieldPilotState: { draft: "BROUILLON LOCAL · INCOMPLET", review: "PRÊT POUR REVUE INDÉPENDANTE", completed: "exigences complètes", remaining: "encore requises" },
    fieldPilotEvidenceTitle: "PHOTOGRAPHIE ACTUELLE DES OBSERVATIONS",
    fieldPilotEvidenceConfirm: "J’ai remplacé les valeurs de démonstration ci-dessus par les observations réelles de ce pilote précis et conservé chaque cas éligible, exclu, échoué ou manquant dans le dénominateur.",
    fieldPilotDownload: "Télécharger le brouillon local",
    fieldPilotProtocol: "Ouvrir le protocole complet",
    fieldPilotTemplate: "Ouvrir le rapport vierge",
    fieldPilotGitHub: "Proposer un pilote sur GitHub",
    fieldPilotAlwaysDraft: "L’export reste toujours un brouillon. Être prêt pour la revue n’est ni une autorisation de publier ni une validation terrain.",
    pathsEyebrow: "PARTEZ DE VOTRE RÉALITÉ",
    pathsTitle: "Choisissez la structure dans laquelle vous intervenez.",
    pathsText: "Même méthode. Profondeur différente pour les contrôles, les preuves et les responsabilités.",
    selected: "VOTRE PLAN DE DÉPART",
    roles: "Responsabilité minimale",
    pilot: "Bon premier pilote",
    controls: "À ne pas supprimer",
    fullGuide: "Ouvrir le guide complet sur GitHub",
    sectorEyebrow: "0.3 · AJOUTEZ LES VETOES SECTORIELS",
    sectorTitle: "Le processus reste universel. Les conditions de mise en service, non.",
    sectorText: "Choisissez d’abord le parcours de la structure, puis ajoutez chaque extension qui touche le service. Un hôpital peut cumuler les gates santé et infrastructure critique.",
    sectorFlow: [["01", "Processus universel", "Responsable, baseline, risque, évaluations, pilote."], ["02", "Veto sectoriel", "Nommer le dommage qu’un gain d’efficacité ne compense pas."], ["03", "Mise en service bornée", "Ne conserver que l’autorité prouvée sûre dans ce contexte."]],
    sectorLabels: { trigger: "Quand le gate change", veto: "Veto non transférable", evidence: "Preuve minimale de mise en service" },
    sectorGuide: "Ouvrir les gates du secteur",
    sectorCaveat: "Ces extensions sont opérationnelles, pas des qualifications juridiques. Vérifiez rôle, juridiction, produit, population et règles sectorielles avant la mise en service.",
    sectors: [
      { code: "H", title: "Santé", trigger: "Finalité clinique, guidance patient, triage, diagnostic, traitement ou logiciel de dispositif médical.", veto: "Aucune finalité ambiguë, défaillance grave d’un sous-groupe ou décision clinique sans responsable.", evidence: "Qualification produit · responsable clinique · évaluation segmentée · fallback de soin sûr", file: "sectors/fr/healthcare.md" },
      { code: "E", title: "Éducation", trigger: "Données apprenant, évaluation, admission, orientation, discipline, protection ou parcours personnalisé.", veto: "Aucun gain ne compense exclusion, évaluation invalide ou contestation humaine indisponible.", evidence: "Mandat pédagogique · segments apprenants · accessibilité · correction et recours", file: "sectors/fr/education.md" },
      { code: "F", title: "Finance", trigger: "Modèle matériel, contrôle réglementé, résultat client, transaction ou fonction critique externalisée.", veto: "Aucun usage matériel sans inventaire, responsables, validation indépendante et résilience.", evidence: "Matérialité · validation modèle · impact client · sortie fournisseur testée", file: "sectors/fr/finance.md" },
      { code: "C", title: "Infrastructure critique", trigger: "Le conseil ou l’action peut affecter service essentiel, technologie opérationnelle, état de sûreté ou reprise.", veto: "Aucune commande non testée, interlock affaibli, défaillance commune ou arrêt dépendant de l’IA.", evidence: "Dangers · architecture ségrégée · simulateur · arrêt indépendant", file: "sectors/fr/critical-infrastructure.md" },
    ],
    methodEyebrow: "LA BOUCLE OPÉRATIONNELLE",
    methodTitle: "Huit étapes, dans l’ordre utile aux personnes.",
    methodText: "N’ouvrez que l’étape sur laquelle vous travaillez. Chacune se termine par une preuve concrète, pas par une présentation.",
    deliverable: "Preuve à conserver",
    steps: [
      ["Définir le mandat", "Nommer le responsable, le problème observable, les personnes affectées, les limites et la date de décision.", "Un mandat validé et une baseline mesurable."],
      ["Cartographier le travail réel", "Observer décisions, exceptions, données, systèmes, fournisseurs, attentes et usages informels de l’IA.", "Une carte actuelle et un registre des systèmes IA."],
      ["Prioriser les cas d’usage", "Noter séparément valeur et difficulté. Commencer par un cas fréquent, mesurable et réversible.", "Des fiches comparables et un pilote choisi."],
      ["Classer risque et autonomie", "Examiner impact, données, échelle, juridictions, réversibilité et pouvoirs accordés au système.", "Une classification documentée et les revues requises."],
      ["Choisir le système suffisant le plus simple", "Tester règles et automatisation classique avant RAG, outils, agents ou multi-agents.", "Une décision d’architecture et un dossier fournisseur."],
      ["Construire les évaluations d’abord", "Utiliser cas réels, segments critiques, attaques, abstentions et seuils écrits avant le pilote.", "Un plan d’évaluation reproductible avec critères d’arrêt."],
      ["Piloter en trois niveaux", "Passer du shadow mode au copilote validé, puis à l’automatisation bornée après chaque gate.", "Une décision séparant valeur, fiabilité et risque."],
      ["Exploiter, revoir et retirer", "Versionner, surveiller, répéter les incidents, préserver le manuel et planifier le retrait.", "Runbooks, date de revue, rollback et plan de retrait."],
    ],
    caseEyebrow: "CAS COMPLET · TPE FICTIVE",
    caseTitle: "Une boîte mail partagée devient un copilote mesuré.",
    caseText: "Suivez un cas borné, de sa baseline sur quatre semaines jusqu’à une décision de gate conditionnelle. Les chiffres sont synthétiques ; la structure de preuve est réutilisable.",
    caseBadge: "8 personnes · 30 jours · validation humaine",
    caseProblem: "Atelier Horizon reçoit devis, pannes, questions de facturation et réclamations dans une boîte partagée. L’objectif reste volontairement étroit : proposer l’attribution et préparer un brouillon, sans jamais envoyer ni modifier un système.",
    caseMetrics: [["360", "demandes / mois"], ["11 min", "traitement initial"], ["8 min 35", "traitement pilote"], ["0", "envoi automatique"]],
    caseTimeline: [
      ["01 · JOURS 1–7", "Mesurer", "Temps, réponses le jour même, reprises et erreurs d’attribution sont relevés avant de choisir l’outil."],
      ["02 · JOURS 8–14", "Borner", "Aucun envoi, promesse de prix, écrit CRM, changement de planning ou réponse à une demande ambiguë."],
      ["03 · AVANT PILOTE", "Évaluer", "Quarante cas gelés doivent franchir les seuils d’attribution, extraction, escalade, affirmation, correction et temps."],
      ["04 · JOURS 15–21", "Travailler en shadow", "Le copilote propose sans influencer les réponses réelles ; chaque version de configuration est conservée."],
      ["05 · JOURS 22–30", "Utiliser en copilote", "Trois personnes formées acceptent, corrigent ou rejettent chaque catégorie et brouillon avant l’envoi."],
      ["06 · GATE", "Continuer sous conditions", "Valeur et fiabilité passent. Envoi automatique et écriture restent interdits pendant que les segments faibles reçoivent plus de tests."],
    ],
    caseDecision: "La décision utile n’est pas « l’IA fonctionne ».",
    caseDecisionText: "Elle est : conserver le copilote mesuré pendant 60 jours, revoir les erreurs chaque semaine, répéter le jeu gelé après chaque changement et n’envisager l’automatisation que pour un sous-ensemble stable et réversible.",
    caseCta: "Lire le dossier de preuves complet",
    smeEyebrow: "CAS COMPLET 02 · PME · DEVIS B2B · A2",
    smeTitle: "Le devis devient un dossier gouverné, pas un paragraphe plus rapide.",
    smeText: "Cette PME industrielle fictive de 42 personnes teste un agent métier sur un seul workflow de devis catalogue. Les bornes basse et haute restent visibles, les demandes exclues restent au dénominateur et chaque prix exige toujours une approbation.",
    smeBadge: "42 personnes · 160 demandes/mois · pilote 90 jours · fictif",
    smeProblem: "Noroît Mécanique SA reçoit ses demandes de devis par courriel, avec PDF et tableaux. L’agent qualifie la demande, contrôle client autorisé, catalogue, matrice de prix et délai, puis prépare et vérifie le devis. Il attend une approbation explicite avant d’écrire dans l’ERP et le CRM et d’envoyer au destinataire affiché.",
    smeWorkflow: [["01", "Qualifier", "Client connu, produit catalogue, unités complètes"], ["02", "Extraire", "Références, quantités, destinataire, date demandée"], ["03", "Ancrer", "CRM, catalogue, matrice de remise, délai ERP"], ["04", "Calculer", "Règles déterministes de prix et de marge"], ["05", "Vérifier", "Faits, conflits, règles et effets prévus"], ["06", "Approuver", "Une personne voit prix, sources et destination"], ["07", "Exécuter", "Devis ERP, journal CRM, courriel et relecture"]],
    smeRangeTitle: "Une formule. Trois scénarios de planification honnêtes.",
    smeRangeText: "160 demandes × part éligible × 76 minutes initiales × réduction sur l’éligible. La capacité n’est pas du revenu.",
    smeRange: [["BAS", "60,8 h", "60 % éligible · −50 %"], ["CENTRAL", "97,3 h", "75 % éligible · −64 %"], ["HAUT", "129,2 h", "85 % éligible · −75 %"]],
    smeMetrics: [["76 → 27 min", "temps humain médian des devis éligibles acceptés"], ["×2,81", "débit accepté théorique par heure humaine"], ["163/238", "prêts à approuver sans correction"], ["≈ −45 %", "plafond portefeuille après dénominateur"], ["0 %", "traitement autonome au niveau A2"]],
    smeDenominatorTitle: "Le spectaculaire −64 % devient environ −45 % sur les demandes reçues.",
    smeDenominatorText: "Sur 316 demandes live, 238 passent l’éligibilité initiale, 220 sont finalement acceptées, 18 s’arrêtent proprement et 78 n’entrent jamais dans le workflow agentique. Le 163/238 signifie prêt à approuver, pas autonome. Chaque devis garde sa gate humaine.",
    smeEvidenceTitle: "Trois classes de preuves à ne jamais mélanger",
    smeEvidence: [["ENQUÊTE PME", "31 % / 29 %", "OCDE : 31 % déclarent utiliser l’IA générative, mais 29 % seulement des utilisatrices l’emploient dans les activités cœur. L’enquête ne mesure pas l’ampleur du gain.", "https://www.oecd.org/en/publications/generative-ai-and-the-sme-workforce_2d08b99d-en/full-report/component-4.html"], ["COPILOTE EMPIRIQUE", "+15 %", "QJE : hausse moyenne des conversations de support résolues par heure sur 5 172 personnes. Repère bas utile ; ce n’est pas un agent de devis A2.", "https://academic.oup.com/qje/article/140/2/889/7990658"], ["CAS FOURNISSEUR", "−80 à −95 %", "AWS/Grupo Elfa déclare ces réductions de traitement des devis. Repère haut utile ; cas client à grande échelle, pas preuve PME indépendante.", "https://aws.amazon.com/pt/blogs/aws-brasil/grupo-elfa-como-genai-automatizou-cotacoes-e-apoiou-a-empresa-a-incrementar-r-240m-em-receitas-em-12-meses/"]],
    smeSourceNote: "Ces sources rendent l’enveloppe plausible ; elles ne valident pas le résultat synthétique de Noroît. Le jeu gelé local, le journal live, les erreurs, approbations, coûts complets et résultats aval décident de la gate.",
    smeDecision: "Conserver A2. Ne pas transformer un bon workflow d’approbation en revendication A3.",
    smeDecisionText: "Le cas observé se place près du central : 89,8 heures de capacité mensuelle, environ 4 500 CHF nets des coûts récurrents et un retour simple de la mise en place proche de 3,5 mois. Pièces sur plan, remises exceptionnelles, contrats et prix final restent humains.",
    smeCta: "Ouvrir le cas PME complet et ses preuves",
    missionEyebrow: "CAS COMPLET 03 · FONDATION · DOSSIERS DE SUBVENTION · A2",
    missionTitle: "L’agent prépare les preuves. Le comité décide.",
    missionText: "Cette fondation fictive de 14 personnes teste un agent A2 sur l’administration des subventions, pas sur le jugement. Chaque canal exclu reste ouvert, chaque décision de financement reste humaine et un dommage à la mission annule le gain de productivité.",
    missionBadge: "14 salariés · 24 évaluateurs bénévoles · 60 jours · fictif",
    missionProblem: "La Fondation Lien Local traite 720 demandes de micro-subvention par an en trois langues. L’agent contrôle l’entrée du workflow, inventorie et cite les pièces, applique une checklist publiée, puis prépare un paquet pseudonymisé. Après approbation, il écrit et attribue ce paquet. Il ne note jamais mérite, besoin ou probabilité de financement.",
    missionWorkflow: [["01", "Admettre", "Consentement, programme connu, canal, pièces lisibles"], ["02", "Inventorier", "Documents et seules données nécessaires"], ["03", "Extraire", "Faits administratifs avec citation de page"], ["04", "Contrôler", "Checklist déterministe de complétude"], ["05", "Préparer", "Demande de pièce ou paquet pseudonymisé"], ["06", "Approuver", "Sources, transformations et destinataires"], ["07", "Attribuer", "Système, deux évaluateurs et relecture des effets"]],
    missionAgentTitle: "L’AGENT A2 TRANSPORTE",
    missionAgent: ["État du dossier et extraction reliée aux sources", "Checklist de complétude publiée", "Projet de demande de pièce", "Paquet pseudonymisé pour les évaluateurs", "Écritures et attribution après approbation"],
    missionHumanTitle: "LES PERSONNES GARDENT",
    missionHuman: ["Accompagnement et canaux hors ligne", "Interprétation de la mission et du contexte", "Mérite, besoin, montant, attribution et refus", "Résolution des conflits d’intérêts", "Explication, contestation et responsabilité du conseil"],
    missionRangeTitle: "Capacité administrative, pas impact de mission.",
    missionRangeText: "60 demandes × part workflow × 96 minutes initiales × réduction. Mise en place : 12 000 CHF ; coût récurrent : 750 CHF par mois.",
    missionRange: [["BAS", "23,8 h", "55 % workflow · −45 % · retour 16,6 mois"], ["CENTRAL", "40,3 h", "70 % workflow · −60 % · retour 6,9 mois"], ["HAUT", "53,8 h", "80 % workflow · −70 % · retour 4,6 mois"]],
    missionMetrics: [["96 → 39 min", "temps humain médian par paquet accepté"], ["×2,46", "débit théorique de paquets par heure humaine"], ["58/86", "prêts pour les évaluateurs sans correction"], ["≈ −39 %", "plafond portefeuille sur les 120 demandes"], ["100 %", "décisions de financement prises par des personnes"]],
    missionDenominatorTitle: "Hors workflow ne signifie pas refusé.",
    missionDenominatorText: "Sur 120 demandes, 86 entrent dans le workflow administratif standard, 79 produisent un paquet accepté, 7 s’arrêtent proprement et 34 reçoivent un traitement humain. Les candidatures téléphone et papier atteignent la même gate de financement humaine.",
    missionGateTitle: "La gate mission possède quatre vetos",
    missionGate: [["ACCÈS", "Aucun canal supprimé", "Téléphone, papier et candidatures accompagnées restent disponibles."], ["DIGNITÉ", "Aucun score de besoin", "Le système ne classe pas la vulnérabilité et n’infère pas le mérite."], ["ÉQUITÉ", "Segmenter les preuves", "Reprises et arrêts sont revus par langue, canal et type d’organisation."], ["RECOURS", "Une personne répond", "Chaque décision est expliquée et contestable en dehors de l’agent."]],
    missionEvidenceTitle: "Réalité sectorielle, analogue fonctionnel, borne haute déclarée",
    missionEvidence: [["ENQUÊTE SECTORIELLE", "1 % oui", "Candid : 1 % des 529 fondations répondantes déclarent utiliser l’IA générative pour filtrer ou aider à décider ; 97 % répondent non.", "https://candid.org/blogs/will-foundations-soon-use-ai-to-screen-grant-applications/"], ["ANALOGUE FONCTIONNEL", "1 000+", "Degrees of Change traite plus de 1 000 candidatures avec 150 évaluateurs bénévoles ; le cas fournisseur décrit extraction et matching relu, pas un gain temporel causal.", "https://learn.microsoft.com/power-platform/guidance/case-studies/nonprofit"], ["BORNE HAUTE FOURNISSEUR", "−80 %", "Microsoft annonce 80 % de réduction du délai de versement de l’aide chez NZF. Plusieurs transformations et une autonomie plus large interdisent le transfert direct.", "https://www.microsoft.com/en/customers/story/23068-national-zakat-foundation-microsoft-copilot-studio"]],
    missionLegalNote: "Frontière suisse : le PFPDT explique que les décisions individuelles entièrement automatisées visées par l’article 21 LPD ouvrent des droits d’information et de revue humaine. Ici, la décision de financement reste humaine par conception ; la qualification juridique réelle doit être examinée au cas par cas.",
    missionDecision: "Conserver l’A2 administratif. Interdire le jugement automatisé des subventions.",
    missionDecisionText: "Le cas observé libère 37,5 heures administratives par mois, environ 1 575 CHF nets des coûts récurrents, avec un retour simple proche de 7,6 mois. C’est une capacité, pas une subvention supplémentaire. Toute extension exige consultation, échantillons plus larges par langue et canal, et recours testé.",
    missionCta: "Ouvrir le cas fondation complet et ses preuves",
    publicEyebrow: "CAS COMPLET · SERVICE PUBLIC · DOSSIERS D’URBANISME · A2",
    publicTitle: "L’autorité reste visible à chaque gate.",
    publicText: "Cette commune suisse fictive teste un agent A2 sur la complétude administrative, pas sur le jugement urbanistique. Le workflow ne peut accélérer que si mandat, achat, preuves, notice publique, recours, archives et service sans IA avancent avec lui.",
    publicBadge: "62 000 habitants · service de 17 personnes · 90 jours · fictif",
    publicProblem: "La Ville de Mont-Rive reçoit 1 080 demandes d’autorisation par an en français et en allemand. L’agent inventorie les pièces, extrait des faits administratifs cités et applique une checklist publiée. Après approbation, il envoie, enregistre et attribue. Il ne déclare jamais la complétude, n’interprète pas le droit et ne recommande ni octroi, ni refus, ni condition, ni priorité.",
    publicWorkflow: [["01", "Admettre", "Autorité, signature, canal et type de demande connu"], ["02", "Inventorier", "Pièces, versions et données nécessaires"], ["03", "Extraire", "Parcelle et projet avec citations de page ou de plan"], ["04", "Recouper", "Checklist publiée et sources officielles contrôlées"], ["05", "Préparer", "Liste de compléments ou paquet neutre"], ["06", "Approuver", "Sources, incertitude, destinataire et effets"], ["07", "Enregistrer", "Envoi, registre, attribution et relecture des effets"]],
    publicAgentTitle: "L’AGENT A2 TRANSPORTE",
    publicAgent: ["État versionné et extraction reliée aux sources", "Checklist administrative publiée", "Projet de demande de complément", "Paquet neutre avec incertitudes", "Écriture au registre et attribution après approbation"],
    publicAuthorityTitle: "LES PERSONNES ET L’AUTORITÉ GARDENT",
    publicAuthority: ["Assistance et canaux hors ligne", "Qualification juridique et égalité de traitement", "Visites, oppositions et contexte local", "Octroi, refus, conditions, motifs et signature", "Accès au dossier, contestation, recours et responsabilité"],
    publicRangeTitle: "Un cas public peut échouer même si l’outil gagne du temps.",
    publicRangeText: "90 demandes × part workflow × 145 minutes initiales × réduction. Mise en place : 48 000 CHF ; coût récurrent : 3 200 CHF par mois, gouvernance et sortie incluses.",
    publicRange: [["BAS", "39,2 h", "45 % workflow · −40 % · coût récurrent non couvert"], ["CENTRAL", "71,8 h", "60 % workflow · −55 % · retour 20,0 mois"], ["HAUT", "106,5 h", "72 % workflow · −68 % · retour 9,4 mois"]],
    publicMetrics: [["145 → 58 min", "temps humain médian par paquet accepté"], ["×2,50", "débit théorique par heure de collaborateur"], ["121/166", "prêts à approuver sans correction"], ["≈ −35 %", "plafond portefeuille sur les 270 demandes"], ["100 %", "décisions publiques prises par des personnes qualifiées"]],
    publicDenominatorTitle: "Hors agent signifie toujours dans le service public.",
    publicDenominatorText: "Sur 270 demandes consécutives, 166 entrent dans le workflow standard, 158 produisent un paquet accepté, 8 s’arrêtent proprement et 104 restent traitées par des personnes. Dix-neuf demandes papier ou accompagnées atteignent le même collaborateur, sans priorité donnée par l’agent.",
    publicGatesTitle: "Six gates avant la production publique",
    publicGates: [["P0", "Opportunité", "Mandat, baseline, options non-IA et autorité de décision."], ["P1", "Droit + impacts", "Droit applicable, droits, langues, accessibilité et recours."], ["P2", "Achat", "Audit, sous-traitants, rétention, changements, export et sortie."], ["P3", "Preuve indépendante", "Cas représentatifs, segments, sécurité, abus et pannes."], ["P4", "Pilote contrôlé", "Shadow mode, approbateurs nommés, plainte et arrêt immédiat."], ["P5", "Production redevable", "Décision signée, notice publique, archives, fallback et retrait."]],
    publicEvidenceTitle: "Résultat terrain, borne haute de tâche, analogue de gouvernance",
    publicEvidence: [["PILOTE TERRAIN", "60–80 %", "À Milton Keynes, les collaborateurs déclarent une validation plus rapide ; le délai réception-validation passe de 15,8 à 7,6 jours. Ce cas fournisseur de trois mois n’est pas une preuve causale pour tout un service.", "https://www.local.gov.uk/case-studies/milton-keynes-city-council-and-valon-streamlining-planning-ai"], ["BORNE HAUTE DE TÂCHE", "18,5 h → 16 min", "Cambridge rapporte 16 minutes pour les résumés PlanAI contre 18,5 heures humaines. Les urbanistes lisent toujours chaque contribution ; ce ratio étroit ne chiffre pas un workflow de dossier.", "https://www.cambridge.gov.uk/news/2025/07/21/harnessing-the-power-of-ai-to-transform-planning-consultations"], ["ANALOGUE DE GOUVERNANCE", "6 000+", "Leeds traite plus de 6 000 demandes par an et associe six mois de co-conception à analyses d’impact, sources visibles, approbation, audit trail et fiche ATRS publique.", "https://www.local.gov.uk/case-studies/leeds-city-council-and-xylo-transforming-planning-ai"]],
    publicLegalNote: "Frontière suisse : il n’existe pas encore de loi transversale propre à l’IA, tandis que sécurité de l’information, protection des données, procédure administrative et droit sectoriel restent applicables. Le PFPDT est un repère fédéral ; une commune doit qualifier le droit cantonal et public pertinent. Toute décision publique reste ici humaine par conception.",
    publicDecision: "Autoriser l’A2 administratif six mois. Garder le pouvoir public humain.",
    publicDecisionText: "L’observation normalisée indique 76,4 heures de capacité mensuelle, environ 2 757 CHF nets du coût récurrent et un retour simple proche de 17,4 mois. Le cas bas échoue au gate économique. Analyse de conformité, motifs, priorité ou changement de modèle fournisseur renvoient le système à P0.",
    publicCta: "Ouvrir le cas service public complet et ses preuves",
    soloEyebrow: "CAS COPILOTE · INDÉPENDANT · A1",
    soloTitle: "Quatorze jours pour tester une seule frontière utile.",
    soloText: "Un petit pilote doit éclairer une petite décision. Suivez une consultante indépendante, des notes de rendez-vous au suivi relu, sans connecter messagerie, calendrier ou systèmes clients.",
    soloBadge: "COPILOTE · 1 personne · 14 jours · R2/A1",
    soloProblem: "Camille Rey consacre une médiane de 44 minutes à transformer ses notes en compte rendu, actions et courriel de suivi. Le pilote teste un premier brouillon structuré ; prix, engagements, destinataires et envoi restent exclusivement humains.",
    soloRules: ["Aucun enregistrement", "Aucune connexion mail", "Aucun prix ni engagement", "L’humain choisit et envoie"],
    soloMetrics: [["−23 %", "temps médian de préparation"], ["12/14", "prêts en moins de 24 h"], ["4/14", "reprises majeures"], ["0", "engagement inventé"]],
    soloClarifierTitle: "Pourquoi seulement −23 % ? Parce que ce n’est pas un agent métier.",
    soloClarifier: "Le système rédige une seule étape. Il ne dispose ni de messagerie, ni de calendrier, ni de CRM, ni de mémoire, ni d’outils d’exécution, ni du pouvoir de terminer le suivi. Ce résultat ne doit jamais servir de référence pour une intégration A2–A4.",
    soloPhases: [
      ["JOURS 01–02", "Mesurer", "Confirmer 22 suivis historiques, le fallback manuel, les règles de données et un plafond de huit heures de préparation."],
      ["JOURS 03–07", "Geler", "Régler sur 12 cas autorisés, puis décider sur 12 cas distincts avec des seuils écrits à l’avance."],
      ["JOURS 08–10", "Shadow", "Produire cinq brouillons, révélés seulement après la rédaction manuelle du véritable suivi."],
      ["JOURS 11–14", "Copilote", "Relire neuf brouillons avec les notes. Ajouter le commercial, choisir le destinataire et envoyer manuellement."],
    ],
    soloDecision: "Prolonger 30 jours le copilote de brouillon.",
    soloDecisionText: "La médiane passe de 44 à 34 minutes et les gates critiques passent, mais 29 % des brouillons exigent encore une reprise majeure. Aucun envoi automatique, proposition complète ou raccordement système n’est justifié.",
    soloCta: "Ouvrir le dossier de preuves sur 14 jours",
    agentEyebrow: "CAS COMPLET 03 · AGENT MÉTIER · INDÉPENDANT · A2",
    agentTitle: "Le même suivi devient un workflow complet soumis à approbation.",
    agentText: "La phase 2 conserve la même professionnelle, la même baseline et le même résultat attendu. Ce qui change, c’est le système : outils autorisés, état persistant du dossier, contrôle qualité, exécution après approbation et traitement explicite des exceptions.",
    agentBadge: "1 personne · 30 jours · R2/A2 · cas fictif",
    agentProblem: "Après le pilote copilote A1, Camille teste un agent métier sur 20 suivis éligibles. Il lit le contexte CRM autorisé, prépare le compte rendu et les actions, puis vérifie faits et règles. Il attend une approbation explicite avant de mettre à jour le CRM, de créer les tâches et d’envoyer le courriel relu.",
    agentWorkflow: [["01", "Capturer", "Notes structurées et test d’éligibilité"], ["02", "Contextualiser", "CRM en lecture et règles client"], ["03", "Composer", "Compte rendu, actions et suivi"], ["04", "Vérifier", "Faits, dates, règles et conflits"], ["05", "Approuver", "Une décision humaine informée"], ["06", "Exécuter", "Courriel, CRM, tâches et journal d’audit"]],
    agentDoesTitle: "L’AGENT PREND EN CHARGE",
    agentDoes: ["État du dossier et séquence des outils", "Contrôles des faits et des règles", "Brouillon, fiche CRM et préparation des tâches", "Exécution après approbation", "Journal complet des actions et erreurs"],
    humanDoesTitle: "LA PERSONNE GARDE",
    humanDoes: ["Éligibilité et finalité", "Prix, périmètre et engagements", "Approbation ou refus", "Exceptions ambiguës ou sensibles", "Revue hebdomadaire des erreurs et de la valeur"],
    agentMetrics: [["44 → 14 min", "temps humain actif médian · −68 %"], ["×3,1", "suivis acceptés par heure du responsable"], ["13/20", "prêts à approuver sans correction"], ["3/20", "correctement escaladés"], ["0", "action externe sans approbation"]],
    agentCompareTitle: "Même travail. Trois affirmations différentes.",
    agentCompare: [["A1 · Copilote", "44 → 34 min", "Rédige une étape ; la personne transporte et termine le workflow."], ["A2 · Agent métier", "44 → 14 min", "Exécute le workflow borné complet, uniquement après approbation."], ["A3 · Candidat", "Non revendiqué", "L’envoi autonome à faible risque exige 50 cas supplémentaires et une nouvelle gate."]],
    agentPhases: [["JOURS 01–05", "Connecter sans ouvrir", "Identité séparée, moindre privilège, CRM d’abord en lecture, écritures idempotentes, coupe-circuit et fallback manuel testé."], ["JOURS 06–12", "Rejouer les cas gelés", "Exécuter 40 cas représentatifs avec conflits, contexte manquant, demandes de prix, prompt injection, actions dupliquées et outils indisponibles."], ["JOURS 13–20", "Travailler en shadow", "Comparer le workflow complet proposé au véritable suivi manuel ; aucun courriel ni écrit n’atteint un système réel."], ["JOURS 21–30", "Exploiter en A2", "Camille examine un dossier de preuves, approuve ou refuse, puis l’agent exécute les actions autorisées et journalise chaque effet."]],
    agentDecision: "Conserver A2 pendant 60 jours. Ne pas revendiquer A3.",
    agentDecisionText: "Le gain devient important parce que le système transporte désormais le workflow, pas parce que le modèle écrit simplement plus vite. L’envoi autonome reste bloqué jusqu’à 50 cas éligibles supplémentaires, zéro erreur critique, des exceptions stables, au plus 10 % de reprises majeures et un rollback vérifié.",
    agentCta: "Lire le dossier de preuves A2 complet",
    agencyEyebrow: "CAS COMPLET 04 · AGENCE ORCHESTRÉE · INDÉPENDANT · A3",
    agencyTitle: "Une agence multi-agents transforme un diagnostic standard en chaîne de production gouvernée.",
    agencyText: "L’orchestration devient utile lorsque le travail contient des rôles distincts de recherche, d’analyse, de qualité et d’exécution qui peuvent avancer en parallèle. Le périmètre reste un service éligible, pas toute l’entreprise.",
    agencyBadge: "1 responsable · 60 jours · 60 cas gelés + 12 live · fictif",
    agencyProblem: "Camille réalise un diagnostic opérationnel standardisé pour des petites entreprises déjà clientes. Après l’entretien, l’agence qualifie le dossier, collecte les preuves autorisées, note le processus, produit rapport et plan d’action, conteste ses propres conclusions puis exécute les opérations CRM, tâches, livraison et planification à faible risque prévues par la politique du service.",
    agencyOrchestrator: "Distribue le travail, impose la politique du dossier, résout les dépendances, s’arrête en cas de désaccord et n’accepte jamais le succès déclaré d’un spécialiste sans preuve de l’effet.",
    agencySpecialists: [["01", "Admission", "Identité, éligibilité, minimisation"], ["02", "Preuves", "Sources autorisées et citations traçables"], ["03", "Analyste", "Diagnostic, score et incertitude"], ["04", "Livraison", "Rapport, actions et structure client"], ["05", "Gardien", "Faits, contradictions, risque et permissions"], ["06", "Exécuteur", "Livraison, CRM, tâches et planification"]],
    agencyFoundationLabel: "PLAN DE CONTRÔLE PARTAGÉ",
    agencyFoundation: ["État du dossier versionné", "Identités au moindre privilège", "Journal des événements et effets", "Évaluations gelées", "Limites de coût et concurrence", "Fallback manuel + coupe-circuit"],
    agencyCompareTitle: "Temps humain actif pour le même diagnostic accepté",
    agencyCompare: [["Manuel", "7 h 40", "Référence"], ["A1 · Copilote", "5 h 50", "−24 %"], ["A2 · Agent unique", "2 h 35", "−66 %"], ["A3 · Agence orchestrée", "58 min", "−87 %"]],
    agencyMetrics: [["×7,9", "diagnostics acceptés par heure du responsable"], ["9/12", "acceptés sans reprise majeure"], ["8/12", "cas éligibles terminés de bout en bout"], ["4/12", "arrêtés et escaladés avant effet"], ["5 h 20", "cycle interne médian contre 18 h"], ["0", "engagement ou écrit non autorisé"]],
    agencyEligibilityTitle: "Le dénominateur reste visible",
    agencyEligibilityText: "Seules 12 des 17 demandes live entrent dans la population A3. Cinq sont exclues avant exécution : deux nouveaux prix, une modification contractuelle, un jeu de données RH et une identité client contradictoire. Le résultat de 8/12 de bout en bout représente donc 8/17 de toutes les demandes, pas 67 % de toute l’activité.",
    agencyPhases: [["JOURS 01–10", "Décomposer le service", "Séparer rôles, entrées, sorties, permissions, frontières de panne, preuves des effets et situations qui doivent rester humaines."], ["JOURS 11–25", "Geler la comparaison", "Faire passer 60 cas par les conditions manuel, copilote, agent unique et agence orchestrée ; mesurer la sortie acceptée, pas l’activité des agents."], ["JOURS 26–40", "Observer l’agence", "Exécuter les spécialistes en parallèle sans effet réel. Injecter désaccord, mémoire périmée, panne d’outil, événement dupliqué et source empoisonnée."], ["JOURS 41–60", "Exploiter A3 borné", "N’autoriser que les effets catalogués à faible risque sur les cas éligibles. Veto du gardien, limites de coût, rollback et escalade humaine restent actifs."]],
    agencyDecision: "A3 passe pour un service standard. A4 reste non démontré.",
    agencyDecisionText: "L’agence peut continuer pour le diagnostic défini et ses effets catalogués. Elle ne peut choisir de nouveaux services, prix, contrats, clients, classes de données ou permissions. L’autonomie large multi-systèmes exige un mandat distinct, un audit indépendant et des preuves sur plusieurs workflows.",
    agencyTalosNote: "Analogie Talos/Hermes, pas résultat Talos/Hermes",
    agencyTalosText: "L’architecture reprend orchestrateur, spécialistes, état partagé, outils, gardien et observabilité. Les chiffres appartiennent uniquement à ce cas synthétique ; le dépôt public Talos ne publie pas encore de benchmark de productivité reproductible.",
    agencyCta: "Lire le dossier de preuves A3 complet",
    ladderEyebrow: "PROGRESSION TECHNIQUE",
    ladderTitle: "La complexité se mérite, elle ne se présume pas.",
    ladderText: "Montez d’un niveau à la fois. Arrêtez-vous dès qu’un système plus simple répond au besoin.",
    ladder: ["Processus manuel documenté", "Règle déterministe", "Automatisation classique", "Appel de modèle unique", "Recherche contrôlée", "Workflow avec approbation", "Agent métier borné", "Orchestration multi-agents", "Agence multi-systèmes supervisée"],
    riskEyebrow: "ORIENTATION RAPIDE DES CONTRÔLES",
    riskTitle: "Voyez comment l’impact et l’autonomie modifient le niveau de contrôle.",
    riskText: "Il s’agit d’un triage interne, pas d’une qualification juridique.",
    impact: "Impact potentiel",
    autonomy: "Autonomie technique",
    impactOptions: ["R0 · interne et facilement vérifiable", "R1 · assistance avec relecture", "R2 · personnes, données ou action externe", "R3 · droits, santé, emploi, autorité publique"],
    autonomyOptions: ["A0 · conseil uniquement", "A1 · recherche ou brouillon", "A2 · action après approbation explicite", "A3 · actions autonomes bornées", "A4 · autonomie large et multi-systèmes"],
    orientation: "Socle de contrôle recommandé",
    orientations: ["Responsable, règles de données, tests métier et journal des changements.", "Approbation qualifiée, validation des sorties, journal complet et rollback.", "Modèle de menace, moindre privilège, limites, surveillance et tests adversariaux.", "Qualification juridique et analyse d’impact formelles, gouvernance, revue indépendante et recours humain.", "Exception de direction, preuve qu’une autonomie inférieure ne suffit pas, confinement renforcé et audit indépendant."],
    crosswalkOpen: "Ouvrir les contrôles correspondants",
    crosswalkEyebrow: "RÉFÉRENTIEL VERSIONNÉ · JSON 1.1",
    crosswalkTitle: "Transformez un niveau de risque en contrôles qui laissent des preuves.",
    crosswalkText: "La structure, l’impact, l’autonomie, le mode d’usage et la juridiction conduisent à des identifiants de contrôle stables. Chaque ligne expose son déclencheur, ses preuves, ses gates, ses phases et ses sources datées.",
    crosswalkMatched: "contrôles candidats",
    crosswalkOrganization: "organisation",
    crosswalkProfile: "profil actif",
    crosswalkSources: "sources versionnées",
    crosswalkRead: "LIRE 01 → 04",
    crosswalkReadingTitle: "Quatre questions par contrôle",
    crosswalkReading: [["CONTRÔLE", "Qu’est-ce qui doit être vrai ?"], ["DÉCLENCHEUR", "Quand s’applique-t-il ?"], ["PREUVE", "Quel enregistrement doit exister ?"], ["GATE", "Quelle décision bloque-t-il ou autorise-t-il ?"]],
    crosswalkEvidence: "Preuves requises",
    crosswalkGates: "Gates de décision",
    crosswalkPhases: "Phases du cycle de vie",
    crosswalkSourceRefs: "Références sources",
    crosswalkCondition: "Condition de déclenchement",
    crosswalkPriority: { baseline: "SOCLE", strengthened: "RENFORCÉ", critical: "CRITIQUE" },
    crosswalkDownload: "Télécharger le catalogue complet",
    crosswalkSchema: "Télécharger le schéma JSON",
    crosswalkLimit: "Cette correspondance aide à mettre en œuvre les contrôles. Elle ne constitue ni une équivalence article par article, ni une certification, ni une conformité juridique. Une personne compétente doit encore qualifier les conditions applicables.",
    toolkitEyebrow: "UTILISEZ LE PLAYBOOK",
    toolkitTitle: "Commencez par une décision vide, pas par une page blanche.",
    toolkitText: "Copiez les modèles opérationnels, franchissez le premier gate et conservez les preuves avec le projet.",
    tools: [["Mandat", "Responsable, baseline, résultat et limites.", "templates/mandate.fr.md"], ["Fiche de cas d’usage", "Valeur et difficulté restent séparées.", "templates/use-case-card.fr.md"], ["Évaluation du risque", "Scénarios, contrôles et risque résiduel.", "templates/risk-assessment.fr.md"], ["Plan d’évaluation", "Métriques, segments, seuils et critères d’arrêt.", "templates/evaluation-plan.fr.md"], ["Décision de pilote", "Valeur, fiabilité et risque jugés séparément.", "templates/pilot-decision.fr.md"], ["Runbook d’incident", "Contenir, qualifier, rétablir et apprendre.", "templates/incident-runbook.fr.md"], ["Évaluation d’accessibilité", "Tâches complètes, technologies d’assistance et canal équivalent sans IA.", "templates/accessibility-assessment.fr.md"], ["Analyse des droits fondamentaux", "Groupes affectés, droits, garanties, recours et impact résiduel.", "templates/fundamental-rights-impact-assessment.fr.md"], ["Rapport de retour terrain", "Preuves observées, revue d’anonymisation et limites de transfert explicites.", "templates/field-feedback-report.fr.md"]],
    sourceTitle: "Un socle daté, fondé sur des sources primaires.",
    sourceText: "Le playbook renvoie vers le catalogue ISO, le NIST AI RMF, OWASP GenAI, MITRE ATLAS, les autorités suisses et les ressources actuelles de l’AI Act. C’est une aide à la mise en œuvre, pas une certification ni un avis juridique.",
    sources: "Consulter le registre des sources",
    footer: "AI Adoption Playbook · La preuve avant l’autonomie.",
  },
} as const;

const audiences: Record<Locale, Audience[]> = {
  en: [
    { id: "independent", number: "01", title: "Independent", short: "One reversible workflow", horizon: "14 days", objective: "One measured, low-risk workflow with a manual fallback.", roles: "The process owner is also the final decision-maker.", pilot: "Drafting, structured extraction, or supplier comparison with human review.", controls: ["Simple AI register", "Data rules", "Reusable tests", "Monthly value and error review"], phases: phase([["Days 1–2", "Choose the problem", "Measure five repetitive tasks and exclude high-impact decisions."], ["Days 3–7", "Set the boundary", "Choose the simplest tool and build 20–50 representative tests."], ["Days 8–10", "Run in shadow", "Produce results without sending, publishing, or modifying anything."], ["Days 11–14", "Decide", "Continue, correct, or stop against the written threshold."]]), file: "tracks/en/independent.md" },
    { id: "tpe", number: "02", title: "Micro-business", short: "One shared process", horizon: "30 days", objective: "One team process with a named owner, shared rules, and incident capacity.", roles: "AI lead, business owner, and one reachable incident owner.", pilot: "A reversible customer or operations workflow with explicit approval.", controls: ["Individual accounts", "Read-only by default", "Supplier review", "Tested manual fallback"], phases: phase([["Week 1", "Make usage visible", "Inventory official and informal AI, publish a one-page rule, and measure the baseline."], ["Week 2", "Choose and qualify", "Compare three cases and assess the supplier, data, roles, and permissions."], ["Week 3", "Test in shadow", "Use 30–100 real cases, including missing data, attacks, and unavailable systems."], ["Week 4", "Pilot and decide", "Train each role, run a bounded copilot, and hold a gate review."]]), file: "tracks/en/tpe.md" },
    { id: "pme", number: "03", title: "SME", short: "Portfolio and platform", horizon: "90 days", objective: "A prioritized portfolio, shared controls, and one governed pilot.", roles: "Executive sponsor, portfolio owner, business, IT/security, data, and privacy owners.", pilot: "One to three distinct cases that can prove shared platform needs.", controls: ["Portfolio gates", "Common identity and logging", "Segmented evaluations", "Supplier concentration review"], phases: phase([["Days 1–30", "Govern and discover", "Inventory shadow AI, map high-volume work, and create the portfolio."], ["Days 31–60", "Build evidence", "Select pilots, create test sets, and implement identities, logs, and limits."], ["Days 61–75", "Run copilots", "Measure business outcomes, corrections, incidents, and workarounds."], ["Days 76–90", "Industrialize selectively", "Version the proven common controls and schedule reassessment."]]), file: "tracks/en/pme.md" },
    { id: "nonprofit", number: "04", title: "Nonprofit / foundation", short: "Mission-safe adoption", horizon: "60 days", objective: "Useful adoption that protects mission, beneficiaries, donors, and trust.", roles: "Business owner, mission guardian, beneficiary-facing staff, and data/privacy owner.", pilot: "Controlled research, translation, internal synthesis, or administrative triage.", controls: ["Mission gate", "Language and accessibility slices", "Complaint path", "No unauthorized aid decision"], phases: phase([["Days 1–15", "Align with the mission", "Consult beneficiary-facing people and define value and harms beyond money."], ["Days 16–30", "Protect access", "Check sensitive data, language, accessibility, supplier use, and human escalation."], ["Days 31–45", "Evaluate fairly", "Measure quality by relevant language and group, including stigma and disclosure risks."], ["Days 46–60", "Pilot accountably", "Run shadow mode, then a copilot, and report the decision to oversight."]]), file: "tracks/en/nonprofit-foundation.md" },
    { id: "public", number: "05", title: "Public service", short: "Formal evidence gates", horizon: "Stage-gated", objective: "A lawful, proportionate, accessible service with audit and human recourse.", roles: "Administrative authority, service owner, legal, privacy, security, procurement, and archives.", pilot: "A bounded support function with no unauthorized legal effect.", controls: ["Legal mandate", "Impact assessment", "Auditable procurement", "Human appeal and continuity"], phases: phase([["P0–P1", "Prove public legitimacy", "Document the mandate, non-AI alternatives, affected population, and required impact reviews."], ["P2", "Procure for control", "Require audit, logs, change notice, export, deletion, continuity, and exit rights."], ["P3–P4", "Evaluate independently", "Test representative populations, rare cases, abuse, accessibility, and oversight."], ["P5", "Operate accountably", "Register the system, enable recourse, archive evidence, monitor, and plan retirement."]]), file: "tracks/en/public-sector.md" },
  ],
  fr: [
    { id: "independent", number: "01", title: "Indépendant", short: "Un processus réversible", horizon: "14 jours", objective: "Un processus peu risqué, mesuré et doté d’une procédure manuelle.", roles: "Le propriétaire du processus prend aussi la décision finale.", pilot: "Brouillon, extraction structurée ou comparaison de fournisseurs avec validation humaine.", controls: ["Registre IA simple", "Règles de données", "Tests réutilisables", "Revue mensuelle valeur/erreurs"], phases: phase([["Jours 1–2", "Choisir le problème", "Mesurer cinq tâches répétitives et exclure les décisions à fort impact."], ["Jours 3–7", "Poser les limites", "Choisir l’outil le plus simple et construire 20 à 50 tests représentatifs."], ["Jours 8–10", "Observer en parallèle", "Produire sans envoyer, publier ou modifier quoi que ce soit."], ["Jours 11–14", "Décider", "Continuer, corriger ou arrêter selon le seuil écrit."]]), file: "tracks/fr/independent.md" },
    { id: "tpe", number: "02", title: "TPE", short: "Un processus partagé", horizon: "30 jours", objective: "Un processus d’équipe avec responsable, règles communes et capacité d’incident.", roles: "Responsable IA, propriétaire métier et responsable d’incident joignable.", pilot: "Un processus client ou opérationnel réversible avec approbation explicite.", controls: ["Comptes individuels", "Lecture seule par défaut", "Revue fournisseur", "Procédure manuelle testée"], phases: phase([["Semaine 1", "Rendre les usages visibles", "Inventorier l’IA officielle et informelle, publier une règle d’une page et mesurer."], ["Semaine 2", "Choisir et qualifier", "Comparer trois cas et évaluer fournisseur, données, rôles et permissions."], ["Semaine 3", "Observer en parallèle", "Utiliser 30 à 100 cas, avec données manquantes, attaques et indisponibilités."], ["Semaine 4", "Piloter et décider", "Former chaque rôle, exécuter un copilote borné et tenir le point de décision."]]), file: "tracks/fr/tpe.md" },
    { id: "pme", number: "03", title: "PME", short: "Portefeuille et plateforme", horizon: "90 jours", objective: "Un portefeuille priorisé, des contrôles communs et un premier pilote gouverné.", roles: "Sponsor, responsable de portefeuille, métier, IT/sécurité, données et protection des données.", pilot: "Un à trois cas distincts capables de prouver les besoins réellement communs.", controls: ["Points de décision du portefeuille", "Identité et journaux communs", "Évaluations par segment", "Revue de concentration fournisseur"], phases: phase([["Jours 1–30", "Gouverner et découvrir", "Inventorier les usages IA informels, cartographier le travail et constituer le portefeuille."], ["Jours 31–60", "Construire les preuves", "Choisir les pilotes, créer les tests et déployer identités, journaux et limites."], ["Jours 61–75", "Exécuter les copilotes", "Mesurer résultats, corrections, incidents et contournements."], ["Jours 76–90", "Industrialiser avec sélection", "Versionner les contrôles communs prouvés et planifier les revues."]]), file: "tracks/fr/pme.md" },
    { id: "nonprofit", number: "04", title: "Association / fondation", short: "Adoption alignée sur la mission", horizon: "60 jours", objective: "Une adoption utile qui protège mission, bénéficiaires, donateurs et confiance.", roles: "Propriétaire métier, garant de la mission, terrain et responsable données/vie privée.", pilot: "Recherche, traduction, synthèse interne ou tri administratif contrôlé.", controls: ["Point de décision lié à la mission", "Tests langue/accessibilité", "Voie de plainte", "Aucune décision d’aide non autorisée"], phases: phase([["Jours 1–15", "S’aligner sur la mission", "Consulter le terrain et définir valeur et dommages au-delà de l’argent."], ["Jours 16–30", "Protéger l’accès", "Vérifier données, langues, accessibilité, fournisseur et escalade humaine."], ["Jours 31–45", "Évaluer équitablement", "Mesurer par langue et groupe pertinent, y compris stigmatisation et divulgation."], ["Jours 46–60", "Piloter avec redevabilité", "Passer de l’observation en parallèle au copilote et présenter la décision à la surveillance."]]), file: "tracks/fr/nonprofit-foundation.md" },
    { id: "public", number: "05", title: "Service public", short: "Décisions formelles", horizon: "Par étapes", objective: "Un service légal, proportionné, accessible, auditable et contestable humainement.", roles: "Autorité administrative, métier, juridique, données, sécurité, achats et archives.", pilot: "Une fonction de soutien bornée sans effet juridique non autorisé.", controls: ["Mandat légal", "Analyse d’impact", "Achat auditable", "Recours humain et continuité"], phases: phase([["P0–P1", "Prouver la légitimité publique", "Documenter mandat, options non-IA, population et analyses d’impact nécessaires."], ["P2", "Acheter pour garder le contrôle", "Exiger audit, journaux, changements, export, suppression, continuité et sortie."], ["P3–P4", "Évaluer indépendamment", "Tester populations, cas rares, abus, accessibilité et supervision."], ["P5", "Exploiter avec redevabilité", "Inscrire le système, ouvrir le recours, archiver, surveiller et préparer le retrait."]]), file: "tracks/fr/public-sector.md" },
  ],
};

function controlIndex(risk: number, autonomy: number) {
  if (autonomy === 4) return 4;
  if (risk === 3) return 3;
  if (risk >= 2 && autonomy >= 3) return 2;
  if (risk >= 1 || autonomy >= 2) return 1;
  return 0;
}

function ConceptTip({ label, text }: { label: string; text: string }) {
  return (
    <details className="concept-tip">
      <summary aria-label={label}>?</summary>
      <div role="note"><strong>{label}</strong><p>{text}</p></div>
    </details>
  );
}

export function Playbook({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const patternCopy = usePatternContent[locale];
  const nonAgenticCopy = nonAgenticCaseContent[locale];
  const guideCopy = guidedContent[locale];
  const [audienceId, setAudienceId] = useState<AudienceId>("independent");
  const [usePattern, setUsePattern] = useState<UsePatternId>("retrieval");
  const [jurisdiction, setJurisdiction] = useState<JurisdictionId>("BOTH");
  const [risk, setRisk] = useState(1);
  const [autonomy, setAutonomy] = useState(1);
  const [calibrationLevel, setCalibrationLevel] = useState<IntegrationId>("agent");
  const [caseMinutes, setCaseMinutes] = useState(60);
  const [monthlyCases, setMonthlyCases] = useState(40);
  const [eligibleShare, setEligibleShare] = useState(70);
  const [impactLow, setImpactLow] = useState(calibrationSpecs.agent.low * 100);
  const [impactHigh, setImpactHigh] = useState(calibrationSpecs.agent.high * 100);
  const [setupHours, setSetupHours] = useState(40);
  const [pilotPlanCopied, setPilotPlanCopied] = useState(false);
  const [observedCases, setObservedCases] = useState(20);
  const [observedTimeReduction, setObservedTimeReduction] = useState(55);
  const [observedQuality, setObservedQuality] = useState(93);
  const [criticalEffects, setCriticalEffects] = useState(0);
  const [traceCompleteness, setTraceCompleteness] = useState(100);
  const [observedEligibility, setObservedEligibility] = useState(65);
  const [evidenceCopied, setEvidenceCopied] = useState(false);
  const [operationOwner, setOperationOwner] = useState<string>(t.operationDefaults.owner);
  const [incidentOwner, setIncidentOwner] = useState<string>(t.operationDefaults.incident);
  const [reviewDate, setReviewDate] = useState(operationSpecs.agent.reviewDate);
  const [operationCopied, setOperationCopied] = useState(false);
  const [dossierCopied, setDossierCopied] = useState(false);
  const [fieldSectorId, setFieldSectorId] = useState<FieldSectorId>("general");
  const [fieldAlias, setFieldAlias] = useState("");
  const [fieldWorkflow, setFieldWorkflow] = useState("");
  const [fieldVersion, setFieldVersion] = useState("");
  const [fieldStart, setFieldStart] = useState("");
  const [fieldEnd, setFieldEnd] = useState("");
  const [fieldTransfer, setFieldTransfer] = useState("");
  const [fieldUnsupported, setFieldUnsupported] = useState("");
  const [fieldEvidenceConfirmed, setFieldEvidenceConfirmed] = useState(false);
  const [fieldReviewChecks, setFieldReviewChecks] = useState<boolean[]>(() => t.fieldPilotChecklist.map(() => false));
  const [guideStep, setGuideStep] = useState(0);
  const [guideFurthestStep, setGuideFurthestStep] = useState(0);
  const selected = useMemo(() => audiences[locale].find((item) => item.id === audienceId) ?? audiences[locale][0], [audienceId, locale]);
  const selectedUsePattern = useMemo(() => patternCopy.patterns.find((item) => item.id === usePattern) ?? patternCopy.patterns[0], [patternCopy.patterns, usePattern]);
  const selectedJurisdiction = useMemo(() => patternCopy.jurisdictions.find((item) => item.id === jurisdiction) ?? patternCopy.jurisdictions[2], [jurisdiction, patternCopy.jurisdictions]);
  const selectedGuideLevel = useMemo(() => guideCopy.levels.find((item) => item.id === calibrationLevel) ?? guideCopy.levels[0], [calibrationLevel, guideCopy.levels]);
  const applicableControls = useMemo(() => controlCatalog.filter((control) => (
    control.applicability.organization_types.includes(selected.id)
    && control.applicability.risk_levels.includes(`R${risk}`)
    && control.applicability.autonomy_levels.includes(`A${autonomy}`)
    && (!control.applicability.use_patterns || control.applicability.use_patterns.includes(usePattern))
    && (!control.applicability.jurisdictions || jurisdiction === "BOTH" || control.applicability.jurisdictions.includes(jurisdiction))
  )), [selected.id, risk, autonomy, usePattern, jurisdiction]);
  const applicableSourceCount = useMemo(() => new Set(applicableControls.flatMap((control) => control.source_refs.map((source) => source.source_id))).size, [applicableControls]);
  const deploymentBase = typeof window !== "undefined"
    && (window.location.pathname === githubPagesBase || window.location.pathname.startsWith(`${githubPagesBase}/`))
    ? githubPagesBase
    : "";
  const sitePath = (path: string) => `${deploymentBase}${path}`;
  const geoGuides = geoArticles.filter((article) => article.locale === locale);
  const langHref = sitePath(locale === "en" ? "/fr/" : "/");
  const langLabel = locale === "en" ? "FR" : "EN";
  const journeyLabel = locale === "en" ? "Decision path" : "Parcours de décision";
  const journeySteps = guideCopy.progress;
  const selectCalibrationLevel = (level: IntegrationId) => {
    const spec = calibrationSpecs[level];
    setCalibrationLevel(level);
    setImpactLow(spec.low * 100);
    setImpactHigh(spec.high * 100);
    setSetupHours(spec.setup);
    setReviewDate(operationSpecs[level].reviewDate);
    setOperationCopied(false);
    setDossierCopied(false);
    setFieldEvidenceConfirmed(false);
  };
  const selectGuideLevel = (level: GuidedContent["levels"][number]) => {
    selectCalibrationLevel(level.id);
    setAutonomy(level.autonomy);
  };
  const goToGuideStep = (step: number) => {
    const boundedStep = Math.max(0, Math.min(guideCopy.steps.length - 1, step));
    setGuideStep(boundedStep);
    setGuideFurthestStep((current) => Math.max(current, boundedStep));
  };
  const openChapter = (chapterId: string, targetId: string) => {
    const chapter = document.getElementById(chapterId) as HTMLDetailsElement | null;
    if (chapter) chapter.open = true;
    window.requestAnimationFrame(() => document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  const calibration = useMemo(() => {
    const spec = calibrationSpecs[calibrationLevel];
    const low = Math.min(impactLow, impactHigh) / 100;
    const high = Math.max(impactLow, impactHigh) / 100;
    const eligibleCases = monthlyCases * eligibleShare / 100;
    const eligibleHours = eligibleCases * caseMinutes / 60;
    const freedLow = eligibleHours * low;
    const freedHigh = eligibleHours * high;
    return {
      spec,
      low,
      high,
      eligibleCases,
      eligibleHours,
      freedLow,
      freedHigh,
      remainingLow: eligibleHours * (1 - high),
      remainingHigh: eligibleHours * (1 - low),
      totalLow: eligibleShare * low,
      totalHigh: eligibleShare * high,
      throughputLow: 1 / (1 - low),
      throughputHigh: 1 / (1 - high),
      paybackLow: setupHours / Math.max(freedHigh, 0.01),
      paybackHigh: setupHours / Math.max(freedLow, 0.01),
    };
  }, [calibrationLevel, caseMinutes, monthlyCases, eligibleShare, impactLow, impactHigh, setupHours]);
  const formatNumber = (value: number, maximumFractionDigits = 1) => new Intl.NumberFormat(locale === "fr" ? "fr-CH" : "en-GB", { maximumFractionDigits }).format(value);
  const pilotSpec = pilotSpecs[calibrationLevel];
  const pilotLevelLabel = t.calibratorLevels.find((level) => level.id === calibrationLevel)?.label ?? calibrationLevel;
  const pilotCollectionWeeks = pilotSpec.live / Math.max(calibration.eligibleCases, 0.01) * 4.35;
  const pilotBrief = locale === "en"
    ? [`AI PILOT BRIEF`, `Use pattern: ${selectedUsePattern.title}`, `Jurisdiction route: ${selectedJurisdiction.label}`, `Level: ${pilotLevelLabel}`, `Workflow assumption: ${monthlyCases} cases/month · ${caseMinutes} manual min/case · ${eligibleShare}% eligible`, `Planning range: ${formatNumber(calibration.totalLow)}–${formatNumber(calibration.totalHigh)}% across the whole measured workload`, `Protocol: ${pilotSpec.horizon} days minimum · ${pilotSpec.frozen} frozen cases · ${pilotSpec.live} bounded live cases`, `Value gate: at least ${pilotSpec.valueFloor}% less human active time on accepted cases`, `Critical gates: zero unauthorized or irreversible effect · 100% effect and approval trace`, `Decision: continue the same scope / rework and rerun / stop and roll back`].join("\n")
    : [`BRIEF DE PILOTE IA`, `Mode d’usage : ${selectedUsePattern.title}`, `Route juridique : ${selectedJurisdiction.label}`, `Niveau : ${pilotLevelLabel}`, `Hypothèse workflow : ${monthlyCases} dossiers/mois · ${caseMinutes} min manuelles/dossier · ${eligibleShare} % éligibles`, `Fourchette : ${formatNumber(calibration.totalLow)}–${formatNumber(calibration.totalHigh)} % sur toute la charge mesurée`, `Protocole : ${pilotSpec.horizon} jours minimum · ${pilotSpec.frozen} cas figés · ${pilotSpec.live} cas réels bornés`, `Gate de valeur : au moins ${pilotSpec.valueFloor} % de temps humain actif en moins sur les cas acceptés`, `Gates critiques : zéro effet non autorisé ou irréversible · 100 % des effets et validations tracés`, `Décision : continuer le même périmètre / corriger et rejouer / arrêter et revenir en arrière`].join("\n");
  const samplePass = observedCases >= pilotSpec.live;
  const valuePass = observedTimeReduction >= pilotSpec.valueFloor;
  const qualityPass = observedQuality >= 90;
  const safetyPass = criticalEffects === 0;
  const tracePass = traceCompleteness === 100;
  const observedWholeReduction = observedEligibility * observedTimeReduction / 100;
  const observedFreedHours = monthlyCases * caseMinutes / 60 * observedWholeReduction / 100;
  const eligibilityWarning = observedEligibility < eligibleShare - 10;
  const evidenceDecision: EvidenceDecision = decideEvidence({ samplePass, valuePass, qualityPass, safetyPass, tracePass });
  const evidenceRows: Array<{ code: string; label: string; observed: string; status: EvidenceStatus }> = [
    { code: "N", label: t.evidenceMatrix.sample, observed: `${observedCases}/${pilotSpec.live}`, status: samplePass ? "pass" : "incomplete" },
    { code: "V", label: t.evidenceMatrix.value, observed: `${observedTimeReduction}% / ≥ ${pilotSpec.valueFloor}%`, status: valuePass ? "pass" : "fail" },
    { code: "Q", label: t.evidenceMatrix.quality, observed: `${observedQuality}% / ≥ 90%`, status: qualityPass ? "pass" : "fail" },
    { code: "S", label: t.evidenceMatrix.safety, observed: `${criticalEffects} / 0`, status: safetyPass ? "pass" : "fail" },
    { code: "T", label: t.evidenceMatrix.trace, observed: `${traceCompleteness}% / 100%`, status: tracePass ? "pass" : "incomplete" },
    { code: "E", label: t.evidenceMatrix.eligibility, observed: `${observedEligibility}% / ${eligibleShare}%`, status: "signal" },
  ];
  const evidenceDecisionCopy = t.evidenceDecisions[evidenceDecision];
  const operationSpec = operationSpecs[calibrationLevel];
  const operationState = t.operationStates[evidenceDecision];
  const reviewDateLabel = new Intl.DateTimeFormat(locale === "fr" ? "fr-CH" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${reviewDate}T12:00:00Z`));
  const evidenceMemo = locale === "en"
    ? [`AI PILOT GATE DECISION`, `Level: ${pilotLevelLabel}`, `Decision: ${evidenceDecisionCopy.label}`, `Sample: ${observedCases}/${pilotSpec.live} bounded live cases`, `Value: ${observedTimeReduction}% human active-time reduction · floor ${pilotSpec.valueFloor}%`, `Quality: ${observedQuality}% accepted after defined review · floor 90%`, `Safety: ${criticalEffects} critical or unauthorized effects · required 0`, `Trace: ${traceCompleteness}% complete · required 100%`, `Eligibility: ${observedEligibility}% observed · ${eligibleShare}% assumed`, `Whole-workload reduction: ${formatNumber(observedWholeReduction)}% · ${formatNumber(observedFreedHours)} human hours/month`, `Authorized next action: ${evidenceDecisionCopy.text}`].join("\n")
    : [`DÉCISION DE GATE DU PILOTE IA`, `Niveau : ${pilotLevelLabel}`, `Décision : ${evidenceDecisionCopy.label}`, `Échantillon : ${observedCases}/${pilotSpec.live} cas réels bornés`, `Valeur : ${observedTimeReduction} % de temps humain actif en moins · plancher ${pilotSpec.valueFloor} %`, `Qualité : ${observedQuality} % acceptés après la revue définie · plancher 90 %`, `Sécurité : ${criticalEffects} effet critique ou non autorisé · exigence 0`, `Trace : ${traceCompleteness} % complète · exigence 100 %`, `Éligibilité : ${observedEligibility} % observés · ${eligibleShare} % supposés`, `Réduction sur toute la charge : ${formatNumber(observedWholeReduction)} % · ${formatNumber(observedFreedHours)} heures humaines/mois`, `Prochaine action autorisée : ${evidenceDecisionCopy.text}`].join("\n");
  const operationCard = locale === "en"
    ? [`BOUNDED AI OPERATING CARD`, `Level: ${pilotLevelLabel}`, `Operating state: ${operationState.label}`, `Workflow owner: ${operationOwner}`, `Incident owner: ${incidentOwner}`, `Formal review: ${reviewDateLabel} · default cadence ${operationSpec.reviewDays} days`, `Containment target: ${operationSpec.containment}`, `Authorized scope: ${t.operationSameScope}`, `Immediate suspension triggers:`, ...t.operationStops.map((item) => `- ${item}`), `Rollback: contain → route safely → preserve → reconcile → re-authorize`, `Change rule: ${t.operationChangeRule}`].join("\n")
    : [`FICHE D’EXPLOITATION IA BORNÉE`, `Niveau : ${pilotLevelLabel}`, `État d’exploitation : ${operationState.label}`, `Responsable du workflow : ${operationOwner}`, `Responsable d’incident : ${incidentOwner}`, `Revue formelle : ${reviewDateLabel} · cadence par défaut ${operationSpec.reviewDays} jours`, `Objectif de confinement : ${operationSpec.containment}`, `Périmètre autorisé : ${t.operationSameScope}`, `Déclencheurs de suspension immédiate :`, ...t.operationStops.map((item) => `- ${item}`), `Rollback : contenir → router en sécurité → préserver → réconcilier → réautoriser`, `Règle de changement : ${t.operationChangeRule}`].join("\n");
  const operationOwnerReady = operationOwner.trim().length > 0 && operationOwner.trim() !== t.operationDefaults.owner;
  const incidentOwnerReady = incidentOwner.trim().length > 0 && incidentOwner.trim() !== t.operationDefaults.incident;
  const evidenceRecordReady = evidenceDecision !== "unknown";
  const dossierMissingItems = [
    ...(!evidenceRecordReady ? [t.dossierEvidenceMissing] : []),
    ...(!operationOwnerReady ? [t.operationFields.owner] : []),
    ...(!incidentOwnerReady ? [t.operationFields.incident] : []),
  ];
  const dossierReady = dossierMissingItems.length === 0;
  const dossierArtifactStatuses: DossierStatus[] = ["ready", "ready", evidenceRecordReady ? "recorded" : "incomplete", operationOwnerReady && incidentOwnerReady ? "ready" : "incomplete"];
  const dossierMarkdown = [
    `# ${locale === "en" ? "AI Adoption Decision Dossier" : "Dossier de décision d’adoption IA"}`,
    ``,
    `**${locale === "en" ? "Status" : "État"}:** ${dossierReady ? t.dossierReady : t.dossierDraft}`,
    `**${locale === "en" ? "Playbook snapshot" : "Photographie du playbook"}:** 2026-08-18`,
    ...(dossierMissingItems.length ? [`**${locale === "en" ? "Missing" : "Manquant"}:** ${dossierMissingItems.join(" · ")}`] : []),
    ``,
    `## 1. ${t.dossierArtifacts[0][1]}`,
    ``,
    pilotBrief,
    ``,
    `## 2. ${t.dossierArtifacts[1][1]}`,
    ``,
    `${locale === "en" ? "Preregistered level and gate protocol" : "Niveau et protocole de gate préenregistrés"}: ${pilotLevelLabel} · ${pilotSpec.horizon} ${t.pilotPlanLabels.days} · ${pilotSpec.frozen} ${t.pilotPlanLabels.cases} ${locale === "en" ? "frozen" : "figés"} · ${pilotSpec.live} ${locale === "en" ? "bounded live" : "réels bornés"}.`,
    ``,
    `## 3. ${t.dossierArtifacts[2][1]}`,
    ``,
    evidenceMemo,
    ``,
    `## 4. ${t.dossierArtifacts[3][1]}`,
    ``,
    operationCard,
    ``,
    `## ${t.dossierHandoffTitle}`,
    ``,
    ...t.dossierHandoff.map((item) => `- [ ] ${item}`),
    ``,
    `## ${t.dossierBoundaryTitle}`,
    ``,
    t.dossierBoundary,
  ].join("\n");
  const fieldSector = t.fieldPilotSectors.find((sector) => sector.id === fieldSectorId) ?? t.fieldPilotSectors[0];
  const fieldDatesValid = Boolean(fieldStart && fieldEnd && fieldEnd >= fieldStart);
  const fieldRequirements = [
    fieldAlias.trim().length > 0,
    fieldWorkflow.trim().length > 0,
    fieldVersion.trim().length > 0,
    fieldDatesValid,
    fieldTransfer.trim().length > 0,
    fieldUnsupported.trim().length > 0,
    evidenceRecordReady && fieldEvidenceConfirmed,
    ...fieldReviewChecks,
  ];
  const fieldCompleted = fieldRequirements.filter(Boolean).length;
  const fieldReadyForReview = fieldCompleted === fieldRequirements.length;
  const fieldSlug = fieldAlias.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "field-pilot";
  const fieldReportMarkdown = [
    `# ${locale === "en" ? "Anonymized field-feedback report" : "Rapport anonymisé de retour terrain"}`,
    ``,
    `**${locale === "en" ? "Status" : "Statut"}:** ${locale === "en" ? "DRAFT · not admitted to the public registry" : "BROUILLON · non admis dans le registre public"}`,
    `**${locale === "en" ? "Review readiness" : "État de préparation"}:** ${fieldReadyForReview ? t.fieldPilotState.review : t.fieldPilotState.draft} · ${fieldCompleted}/${fieldRequirements.length}`,
    ``,
    `## ${locale === "en" ? "Pilot identity" : "Identité du pilote"}`,
    ``,
    `- ${t.fieldPilotLabels.alias}: ${fieldAlias.trim() || "[TO COMPLETE]"}`,
    `- ${t.fieldPilotLabels.organization}: ${selected.title}`,
    `- ${t.fieldPilotLabels.sector}: ${fieldSector.label}`,
    `- ${locale === "en" ? "Use pattern" : "Mode d’usage"}: ${selectedUsePattern.title}`,
    `- ${locale === "en" ? "Jurisdiction route" : "Route juridique"}: ${selectedJurisdiction.label}`,
    `- ${t.fieldPilotLabels.integration}: ${pilotLevelLabel}`,
    `- ${t.fieldPilotLabels.version}: ${fieldVersion.trim() || "[TO COMPLETE]"}`,
    `- ${locale === "en" ? "Observation period" : "Période d’observation"}: ${fieldStart || "[TO COMPLETE]"} → ${fieldEnd || "[TO COMPLETE]"}`,
    ``,
    `## ${locale === "en" ? "Workflow and evidence boundary" : "Workflow et frontière des preuves"}`,
    ``,
    `${fieldWorkflow.trim() || "[TO COMPLETE]"}`,
    ``,
    fieldEvidenceConfirmed ? evidenceMemo : `[${locale === "en" ? "TO COMPLETE: confirm that demonstration values were replaced with observed evidence" : "À COMPLÉTER : confirmer que les valeurs de démonstration ont été remplacées par des preuves observées"}]`,
    ``,
    `## ${locale === "en" ? "Transfer limits" : "Limites de transfert"}`,
    ``,
    `- ${t.fieldPilotLabels.transfer}: ${fieldTransfer.trim() || "[TO COMPLETE]"}`,
    `- ${t.fieldPilotLabels.unsupported}: ${fieldUnsupported.trim() || "[TO COMPLETE]"}`,
    ``,
    `## ${locale === "en" ? "Publication review" : "Revue avant publication"}`,
    ``,
    ...t.fieldPilotChecklist.map((item, index) => `- [${fieldReviewChecks[index] ? "x" : " "}] ${item}`),
    ``,
    `> ${t.fieldPilotAlwaysDraft}`,
  ].join("\n");
  const copyPilotBrief = async () => {
    try {
      await navigator.clipboard.writeText(pilotBrief);
      setPilotPlanCopied(true);
    } catch {
      setPilotPlanCopied(false);
    }
  };
  const copyEvidenceMemo = async () => {
    try {
      await navigator.clipboard.writeText(evidenceMemo);
      setEvidenceCopied(true);
    } catch {
      setEvidenceCopied(false);
    }
  };
  const copyOperationCard = async () => {
    try {
      await navigator.clipboard.writeText(operationCard);
      setOperationCopied(true);
    } catch {
      setOperationCopied(false);
    }
  };
  const copyDossier = async () => {
    try {
      await navigator.clipboard.writeText(dossierMarkdown);
      setDossierCopied(true);
    } catch {
      setDossierCopied(false);
    }
  };
  const downloadDossier = () => {
    const blob = new Blob([dossierMarkdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `ai-adoption-decision-${calibrationLevel}.md`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };
  const downloadFieldReport = () => {
    const blob = new Blob([fieldReportMarkdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `field-feedback-${fieldSlug}.md`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  useEffect(() => {
    const revealHashTarget = () => {
      if (!window.location.hash) return;
      const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      const chapter = target?.closest("details.guide-chapter") as HTMLDetailsElement | null;
      if (chapter) chapter.open = true;
    };
    revealHashTarget();
    window.addEventListener("hashchange", revealHashTarget);
    return () => window.removeEventListener("hashchange", revealHashTarget);
  }, []);

  return (
    <div className="page-shell">
      <a className="skip-link" href="#main">{locale === "en" ? "Skip to content" : "Aller au contenu"}</a>
      <header className="site-header">
        <a className="brand" href="#top"><span aria-hidden="true" />MUSYG · AI ADOPTION</a>
        <nav className="site-nav" aria-label={locale === "en" ? "Primary navigation" : "Navigation principale"}>
          <a href="#guided-start">{locale === "en" ? "Guided start" : "Départ guidé"}</a><a href="#concept-library">{locale === "en" ? "Understand" : "Comprendre"}</a><a href="#operational-workspace">{locale === "en" ? "Pilot workspace" : "Espace pilote"}</a><a href="#implementation-library">{locale === "en" ? "Library" : "Bibliothèque"}</a><a href={repository}>GitHub ↗</a><a className="lang" href={langHref} lang={locale === "en" ? "fr" : "en"}>{langLabel}</a>
        </nav>
      </header>

      <nav className="journey-nav" aria-label={locale === "en" ? "Guided decision path" : "Parcours de décision guidé"}>
        <strong>{journeyLabel}</strong>
        {journeySteps.map((label, index) => <button aria-current={guideStep === index ? "step" : undefined} disabled={index > guideFurthestStep} key={label} onClick={() => { goToGuideStep(index); document.getElementById("guided-start")?.scrollIntoView({ behavior: "smooth" }); }} type="button"><span>0{index + 1}</span><b>{label}</b></button>)}
      </nav>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-copy"><p className="eyebrow">{t.meta}</p><h1>{t.heroTitle}</h1><p className="lede">{t.heroText}</p><div className="hero-actions"><a className="button primary" href="#guided-start">{t.start}</a><a className="button secondary" href="#operational-workspace">{locale === "en" ? "Open the expert workspace" : "Ouvrir l’espace expert"}</a></div></div>
          <aside className="hero-rule" aria-label={t.rule}><p className="rule-label">{t.rule}</p><ol>{t.gates.map(([condition, decision], index) => <li key={condition}><span>0{index + 1}</span><strong>{condition}</strong><em>{decision}</em></li>)}</ol></aside>
        </section>

        <section className="stat-strip" aria-label={locale === "en" ? "Playbook summary" : "Résumé du playbook"}>{t.stats.map(([value, label]) => <p key={label}><strong>{value}</strong><span>{label}</span></p>)}</section>

        <section className="plain-summary" aria-labelledby="plain-summary-title">
          <p className="eyebrow">{t.summaryEyebrow}</p>
          <h2 id="plain-summary-title">{t.summaryTitle}</h2>
          <p>{t.summaryText}</p>
        </section>

        <section className="guided-start" id="guided-start" aria-labelledby="guided-start-title">
          <div className="guided-intro">
            <p className="eyebrow">{guideCopy.eyebrow}</p>
            <h2 id="guided-start-title">{guideCopy.title}</h2>
            <p>{guideCopy.text}</p>
          </div>
          <div className="guided-shell">
            <nav className="guided-progress" aria-label={locale === "en" ? "Guide progress" : "Progression du guide"}>
              <ol>{guideCopy.progress.map((label, index) => <li data-current={guideStep === index} data-complete={index < guideFurthestStep} key={label}><button disabled={index > guideFurthestStep} onClick={() => goToGuideStep(index)} type="button"><span>0{index + 1}</span><strong>{label}</strong></button></li>)}</ol>
              <p><strong>{guideFurthestStep + 1}/5</strong><span>{locale === "en" ? "steps available" : "étapes accessibles"}</span></p>
            </nav>
            <div className="guided-panel" aria-live="polite">
              <header className="guided-step-head">
                <div><p className="eyebrow">{guideCopy.steps[guideStep].eyebrow}</p><span>{guideCopy.stepLabel} {guideStep + 1}/5</span></div>
                <ConceptTip label={guideCopy.steps[guideStep].helpLabel} text={guideCopy.steps[guideStep].help} />
                <h3>{guideCopy.steps[guideStep].title}</h3>
                <p>{guideCopy.steps[guideStep].text}</p>
              </header>

              {guideStep === 0 && <div className="guide-choice-grid guide-audiences">{audiences[locale].map((audience) => <button aria-pressed={audienceId === audience.id} key={audience.id} onClick={() => setAudienceId(audience.id)} type="button"><span>{audience.number}</span><strong>{audience.title}</strong><small>{audience.short}</small><em>{audience.horizon}</em></button>)}</div>}

              {guideStep === 1 && <div className="guide-choice-grid guide-patterns">{patternCopy.patterns.map((pattern) => <button aria-pressed={usePattern === pattern.id} key={pattern.id} onClick={() => setUsePattern(pattern.id)} type="button"><span>{pattern.code}</span><strong>{pattern.title}</strong><small>{pattern.short}</small></button>)}</div>}

              {guideStep === 2 && <div className="guide-choice-grid guide-levels">{guideCopy.levels.map((level) => <button aria-pressed={calibrationLevel === level.id} key={level.id} onClick={() => selectGuideLevel(level)} type="button"><span>{level.code}</span><strong>{level.title}</strong><small>{level.text}</small></button>)}</div>}

              {guideStep === 3 && <div className="guide-choice-grid guide-jurisdictions">{patternCopy.jurisdictions.map((option) => <button aria-pressed={jurisdiction === option.id} key={option.id} onClick={() => setJurisdiction(option.id)} type="button"><span>{option.id}</span><strong>{option.label}</strong><small>{option.note}</small></button>)}</div>}

              {guideStep === 4 && <div className="guided-result">
                <div className="guided-result-lead"><p className="eyebrow">{guideCopy.result.eyebrow}</p><h3>{guideCopy.result.title}</h3><p>{guideCopy.result.intro}</p><strong>{selectedGuideLevel.recommendation}</strong></div>
                <div className="guided-selection" aria-label={guideCopy.result.selection}><span>{selected.title}</span><span>{selectedUsePattern.title}</span><span>{selectedGuideLevel.title} · {selectedGuideLevel.code}</span><span>{selectedJurisdiction.label}</span></div>
                <div className="guided-result-grid">
                  <article><span>01</span><strong>{guideCopy.result.pilot}</strong><p>{selected.pilot}</p></article>
                  <article><span>02</span><strong>{guideCopy.result.measure}</strong><p>{guideCopy.proofByPattern[usePattern]}</p></article>
                  <article><span>03</span><strong>{guideCopy.result.safeguards}</strong><ul>{selected.controls.slice(0, 3).map((control) => <li key={control}>{control}</li>)}</ul></article>
                </div>
                <div className="guided-result-actions"><button className="button primary" onClick={() => openChapter("operational-workspace", "pilot-plan")} type="button">{guideCopy.buttons.workspace}</button><button className="button secondary" onClick={() => openChapter("concept-library", "non-agentic-cases")} type="button">{guideCopy.buttons.cases}</button></div>
              </div>}

              <div className="guided-controls">
                <button className="guide-back" disabled={guideStep === 0} onClick={() => goToGuideStep(guideStep - 1)} type="button">← {guideCopy.buttons.back}</button>
                {guideStep < 4 ? <button className="guide-next" onClick={() => goToGuideStep(guideStep + 1)} type="button">{guideStep === 3 ? guideCopy.buttons.result : guideCopy.buttons.next} →</button> : <button className="guide-restart" onClick={() => { setGuideStep(0); setGuideFurthestStep(0); }} type="button">{guideCopy.buttons.restart}</button>}
              </div>
            </div>
          </div>
        </section>

        <div className="chapter-stack" aria-label={locale === "en" ? "Detailed playbook chapters" : "Chapitres détaillés du playbook"}>
        <details className="guide-chapter" id="concept-library">
          <summary><span>{guideCopy.chapters[0].number}</span><div><strong>{guideCopy.chapters[0].title}</strong><small>{guideCopy.chapters[0].text}</small></div><b aria-hidden="true">+</b></summary>
          <div className="guide-chapter-content">

        <section className="geo-library" aria-labelledby="geo-library-title">
          <div className="section-heading">
            <p className="eyebrow">{locale === "en" ? "PRACTICAL ANSWERS" : "RÉPONSES PRATIQUES"}</p>
            <h2 id="geo-library-title">{locale === "en" ? "Explore the questions behind the decision." : "Approfondissez les questions qui font la décision."}</h2>
            <p>{locale === "en" ? "Each guide gives a direct answer, a comparison, a realistic example, and the sources that limit the claim." : "Chaque guide apporte une réponse directe, une comparaison, un exemple réaliste et les sources qui bornent la conclusion."}</p>
          </div>
          <div className="geo-library-grid">
            {geoGuides.map((guide, index) => (
              <a href={sitePath(geoArticlePath(guide))} key={guide.id}>
                <span>0{index + 1}</span><small>{guide.eyebrow}</small><strong>{guide.title}</strong><p>{guide.description}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="use-patterns section-light" id="use-patterns" aria-labelledby="use-patterns-title">
          <div className="section-heading">
            <p className="eyebrow">{patternCopy.eyebrow}</p>
            <h2 id="use-patterns-title">{patternCopy.title}</h2>
            <p>{patternCopy.text}</p>
          </div>
          <div className="use-pattern-shell">
            <fieldset className="use-pattern-picker">
              <legend>{locale === "en" ? "Dominant use pattern" : "Mode d’usage dominant"}</legend>
              <div className="use-pattern-grid">
                {patternCopy.patterns.map((pattern) => (
                  <button aria-pressed={usePattern === pattern.id} key={pattern.id} onClick={() => setUsePattern(pattern.id)} type="button">
                    <span>{pattern.code}</span><strong>{pattern.title}</strong><small>{pattern.short}</small>
                  </button>
                ))}
              </div>
            </fieldset>
            <output className="use-pattern-detail" aria-live="polite">
              <p className="eyebrow">{selectedUsePattern.code} · {selectedUsePattern.title}</p>
              <dl>
                <div><dt>{patternCopy.labels.task}</dt><dd>{selectedUsePattern.task}</dd></div>
                <div><dt>{patternCopy.labels.evaluate}</dt><dd>{selectedUsePattern.evaluate}</dd></div>
                <div><dt>{patternCopy.labels.threat}</dt><dd>{selectedUsePattern.threat}</dd></div>
              </dl>
              <a href={`${repositorySource}/docs/ai-use-patterns${locale === "fr" ? ".fr" : ""}.md`}>{patternCopy.guide} ↗</a>
            </output>
            <fieldset className="jurisdiction-picker">
              <legend>{patternCopy.jurisdictionTitle}</legend>
              <div className="jurisdiction-options">
                {patternCopy.jurisdictions.map((option) => (
                  <button aria-pressed={jurisdiction === option.id} key={option.id} onClick={() => setJurisdiction(option.id)} type="button">
                    <strong>{option.label}</strong><span>{option.note}</span>
                  </button>
                ))}
              </div>
            </fieldset>
            <aside className="jurisdiction-note" aria-live="polite">
              <span>{patternCopy.labels.jurisdiction}</span><strong>{patternCopy.jurisdictionNotes[jurisdiction].title}</strong><p>{patternCopy.jurisdictionNotes[jurisdiction].text}</p>
            </aside>
          </div>
        </section>

        <section className="non-agentic-cases section-light" id="non-agentic-cases" aria-labelledby="non-agentic-cases-title">
          <div className="section-heading">
            <p className="eyebrow">{nonAgenticCopy.eyebrow}</p>
            <h2 id="non-agentic-cases-title">{nonAgenticCopy.title}</h2>
            <p>{nonAgenticCopy.text}</p>
          </div>
          <div className="non-agentic-grid">
            {nonAgenticCopy.cases.map((item) => (
              <article key={item.code}>
                <div className="non-agentic-head">
                  <span>{item.code}</span>
                  <small>{item.pattern}</small>
                </div>
                <h3>{item.title}</h3>
                <p className="non-agentic-org">{item.organization}</p>
                <div className="non-agentic-scope">
                  <strong>{nonAgenticCopy.labels.scope}</strong>
                  <p>{item.scope}</p>
                </div>
                <div className="non-agentic-proof">
                  <strong>{nonAgenticCopy.labels.proof}</strong>
                  <ul>{item.proof.map((signal) => <li key={signal}>{signal}</li>)}</ul>
                </div>
                <div className="non-agentic-footer">
                  <div><span>{nonAgenticCopy.labels.gate}</span><strong>{item.gate}</strong></div>
                  <a href={`${repositorySource}/${item.file}`}>{nonAgenticCopy.labels.open} ↗</a>
                </div>
              </article>
            ))}
          </div>
          <aside className="non-agentic-boundary">
            <strong>{locale === "en" ? "SYNTHETIC EVIDENCE BOUNDARY" : "FRONTIÈRE DES PREUVES SYNTHÉTIQUES"}</strong>
            <p>{nonAgenticCopy.boundary}</p>
          </aside>
        </section>

        <section className="integration-guide section-light" id="integration-levels" aria-labelledby="integration-title">
          <div className="section-heading"><p className="eyebrow">{t.integrationEyebrow}</p><h2 id="integration-title">{t.integrationTitle}</h2><p>{t.integrationText}</p></div>
          <div className="integration-grid">
            {t.integrationLevels.map((level, index) => <article className={`integration-card level-${index + 1}`} key={level.title}>
              <div className="integration-card-head"><span>0{index + 1}</span><small>{level.code}</small></div>
              <h3>{level.title}</h3>
              <div className="integration-band" aria-hidden="true"><span /></div>
              <dl>
                <div><dt>{t.integrationLabels.system}</dt><dd>{level.system}</dd></div>
                <div><dt>{t.integrationLabels.human}</dt><dd>{level.human}</dd></div>
                <div className="integration-gain"><dt>{t.integrationLabels.planning}</dt><dd>{level.planning}</dd></div>
                <div><dt>{t.integrationLabels.flow}</dt><dd>{level.flow}</dd></div>
              </dl>
            </article>)}
          </div>
          <div className="measurement-block">
            <div><p className="eyebrow">{locale === "en" ? "MEASUREMENT KEY" : "CLÉ DE LECTURE"}</p><h3>{t.measurementTitle}</h3></div>
            <ol>{t.measurements.map(([number, title, text]) => <li key={number}><span>{number}</span><strong>{title}</strong><p>{text}</p></li>)}</ol>
          </div>
          <aside className="range-note"><p>{t.rangeNote}</p><div><span>{t.evidenceLead}</span>{t.evidenceLinks.map(([label, url]) => <a href={url} key={url}>{label} ↗</a>)}</div></aside>
          <section className="research-reality" aria-labelledby="research-reality-title">
            <div className="research-reality-head"><div><p className="eyebrow">{t.researchEyebrow}</p><h3 id="research-reality-title">{t.researchTitle}</h3></div><p>{t.researchText}</p></div>
            <div className="research-reality-grid">{t.researchSignals.map((signal) => <a href={signal.url} key={signal.tag}><small>{signal.tag}</small><strong>{signal.value}</strong><h4>{signal.title}</h4><p>{signal.text}</p><span aria-hidden="true">↗</span></a>)}</div>
            <a className="research-review-link" href={`${repositorySource}/references/field-evidence-review-2026${locale === "fr" ? ".fr" : ""}.md`}>{t.researchReview} ↗</a>
          </section>
        </section>

          </div>
        </details>

        <details className="guide-chapter" id="operational-workspace">
          <summary><span>{guideCopy.chapters[1].number}</span><div><strong>{guideCopy.chapters[1].title}</strong><small>{guideCopy.chapters[1].text}</small></div><b aria-hidden="true">+</b></summary>
          <div className="guide-chapter-content">

        <section className="calibrator section-blue" id="calibrator" aria-labelledby="calibrator-title">
          <div className="section-heading"><p className="eyebrow">{t.calibratorEyebrow}</p><h2 id="calibrator-title">{t.calibratorTitle}</h2><p>{t.calibratorText}</p></div>
          <div className="calibrator-shell">
            <div className="calibrator-controls">
              <fieldset><legend>{t.calibratorLevel}</legend><div className="calibrator-levels">{t.calibratorLevels.map((level) => <button aria-pressed={calibrationLevel === level.id} key={level.id} onClick={() => selectCalibrationLevel(level.id)} type="button"><strong>{level.label}</strong><span>{level.note}</span></button>)}</div></fieldset>
              <div className="calibrator-inputs">
                <label><span>{t.calibratorInputs.minutes}</span><div><input aria-label={t.calibratorInputs.minutes} max="1440" min="5" onChange={(event) => setCaseMinutes(Math.min(1440, Math.max(5, Number(event.target.value) || 5)))} step="5" type="number" value={caseMinutes} /><small>{t.calibratorUnits.minutes}</small></div></label>
                <label><span>{t.calibratorInputs.cases}</span><div><input aria-label={t.calibratorInputs.cases} max="2000" min="1" onChange={(event) => setMonthlyCases(Math.min(2000, Math.max(1, Number(event.target.value) || 1)))} step="1" type="number" value={monthlyCases} /><small>{t.calibratorUnits.cases}</small></div></label>
                <label><span>{t.calibratorInputs.eligible}</span><div><input aria-label={t.calibratorInputs.eligible} max="100" min="1" onChange={(event) => setEligibleShare(Math.min(100, Math.max(1, Number(event.target.value) || 1)))} step="1" type="number" value={eligibleShare} /><small>{t.calibratorUnits.eligible}</small></div></label>
                <label><span>{t.calibratorInputs.low}</span><div><input aria-label={t.calibratorInputs.low} max="95" min="0" onChange={(event) => setImpactLow(Math.min(95, Math.max(0, Number(event.target.value) || 0)))} step="1" type="number" value={impactLow} /><small>{t.calibratorUnits.low}</small></div></label>
                <label><span>{t.calibratorInputs.high}</span><div><input aria-label={t.calibratorInputs.high} max="95" min="0" onChange={(event) => setImpactHigh(Math.min(95, Math.max(0, Number(event.target.value) || 0)))} step="1" type="number" value={impactHigh} /><small>{t.calibratorUnits.high}</small></div></label>
                <label><span>{t.calibratorInputs.setup}</span><div><input aria-label={t.calibratorInputs.setup} max="2000" min="0" onChange={(event) => setSetupHours(Math.min(2000, Math.max(0, Number(event.target.value) || 0)))} step="1" type="number" value={setupHours} /><small>{t.calibratorUnits.setup}</small></div><em>{t.calibratorPreset}: {calibration.spec.setup} h</em></label>
              </div>
            </div>
            <output className="calibrator-results" aria-live="polite">
              <div className="calibrator-result-head"><span>{t.calibratorLevels.find((level) => level.id === calibrationLevel)?.label}</span><strong>{formatNumber(calibration.low * 100, 0)}–{formatNumber(calibration.high * 100, 0)}%</strong><small>{locale === "en" ? "editable hypothesis on eligible work" : "hypothèse modifiable sur la charge éligible"}</small></div>
              <div className="calibrator-result-grid">
                <p><span>{t.calibratorResults.eligible}</span><strong>{formatNumber(calibration.eligibleHours)} h</strong><small>{formatNumber(calibration.eligibleCases)} {t.calibratorUnits.cases}</small></p>
                <p><span>{t.calibratorResults.freed}</span><strong>{formatNumber(calibration.freedLow)}–{formatNumber(calibration.freedHigh)} h</strong></p>
                <p><span>{t.calibratorResults.remaining}</span><strong>{formatNumber(calibration.remainingLow)}–{formatNumber(calibration.remainingHigh)} h</strong></p>
                <p><span>{t.calibratorResults.total}</span><strong>{formatNumber(calibration.totalLow)}–{formatNumber(calibration.totalHigh)}%</strong></p>
                <p><span>{t.calibratorResults.throughput}</span><strong>×{formatNumber(calibration.throughputLow)}–{formatNumber(calibration.throughputHigh)}</strong></p>
                <p><span>{t.calibratorResults.payback}</span><strong>{formatNumber(calibration.paybackLow)}–{formatNumber(calibration.paybackHigh)} {t.calibratorMonths}</strong></p>
              </div>
              <p className="calibrator-equation">{eligibleShare}% × {formatNumber(calibration.low * 100, 0)}–{formatNumber(calibration.high * 100, 0)}% = <strong>{formatNumber(calibration.totalLow)}–{formatNumber(calibration.totalHigh)}%</strong> {locale === "en" ? "across the whole measured workload" : "sur toute la charge mesurée"}</p>
            </output>
          </div>
          <aside className="calibrator-note"><strong>{t.calibratorReading}</strong><p>{t.calibratorCaution}</p></aside>
        </section>

        <section className="pilot-planner section-light" id="pilot-plan" aria-labelledby="pilot-plan-title">
          <div className="section-heading"><p className="eyebrow">{t.pilotPlannerEyebrow}</p><h2 id="pilot-plan-title">{t.pilotPlannerTitle}</h2><p>{t.pilotPlannerText}</p></div>
          <ol className="pilot-roadmap" aria-label={locale === "en" ? "Adoption decision sequence" : "Séquence de décision d’adoption"}>{t.pilotRoadmap.map((item, index) => <li data-current={index === 1} key={item}><span>0{index + 1}</span><strong>{item}</strong></li>)}</ol>
          <div className="pilot-specs" aria-live="polite">
            <p><span>{t.pilotPlanLabels.horizon}</span><strong>{pilotSpec.horizon}</strong><small>{t.pilotPlanLabels.days}</small></p>
            <p><span>{t.pilotPlanLabels.frozen}</span><strong>{pilotSpec.frozen}</strong><small>{t.pilotPlanLabels.cases}</small></p>
            <p><span>{t.pilotPlanLabels.live}</span><strong>{pilotSpec.live}</strong><small>{t.pilotPlanLabels.cases}</small></p>
            <p><span>{t.pilotPlanLabels.collection}</span><strong>≈ {formatNumber(pilotCollectionWeeks)}</strong><small>{t.pilotPlanLabels.weeks}</small></p>
          </div>
          <div className="pilot-protocol">
            <ol className="pilot-steps">{t.pilotPlanSteps.map(([number, title, text]) => <li key={number}><span>{number}</span><div><strong>{title}</strong><p>{text}</p></div></li>)}</ol>
            <aside className="pilot-gates">
              <p className="eyebrow">{t.pilotThresholdTitle}</p>
              <h3>{pilotLevelLabel}</h3>
              <ol>
                <li><span>V</span><p><strong>≥ {pilotSpec.valueFloor}%</strong>{t.pilotThresholds.value}</p></li>
                <li><span>Q</span><p>{t.pilotThresholds.quality}</p></li>
                <li><span>S</span><p>{t.pilotThresholds.safety}</p></li>
                <li><span>T</span><p>{t.pilotThresholds.trace}</p></li>
                <li><span>E</span><p>{t.pilotThresholds.eligibility}</p></li>
              </ol>
            </aside>
          </div>
          <div className="pilot-decision-board">
            <p className="eyebrow">{t.pilotDecisionTitle}</p>
            <div>{t.pilotDecisions.map(([decision, text], index) => <article data-decision={index} key={decision}><span>0{index + 1}</span><h3>{decision}</h3><p>{text}</p></article>)}</div>
          </div>
          <div className="pilot-plan-footer">
            <p>{t.pilotPlanCaveat}</p>
            <div><button className="button primary" onClick={() => void copyPilotBrief()} type="button">{pilotPlanCopied ? t.pilotPlanCopied : t.pilotPlanCopy}</button><a className="button secondary" href={`${repositorySource}/templates/evaluation-plan${locale === "fr" ? ".fr" : ""}.md`}>{t.pilotPlanTemplate} ↗</a></div>
          </div>
        </section>

        <section className="evidence-gate section-blue" id="evidence-gate" aria-labelledby="evidence-gate-title">
          <div className="section-heading"><p className="eyebrow">{t.evidenceEyebrow}</p><h2 id="evidence-gate-title">{t.evidenceTitle}</h2><p>{t.evidenceText}</p></div>
          <ol className="pilot-roadmap evidence-roadmap" aria-label={locale === "en" ? "Adoption decision sequence" : "Séquence de décision d’adoption"}>{t.pilotRoadmap.map((item, index) => <li data-current={index === 2} key={item}><span>0{index + 1}</span><strong>{item}</strong></li>)}</ol>
          <div className="evidence-shell">
            <div className="evidence-controls">
              <p className="eyebrow">{t.evidenceInputsTitle}</p>
              <h3>{pilotLevelLabel}</h3>
              <div>
                <label><span>{t.evidenceInputs.cases}</span><div><input aria-label={t.evidenceInputs.cases} max="2000" min="0" onChange={(event) => { setObservedCases(Math.min(2000, Math.max(0, Number(event.target.value) || 0))); setFieldEvidenceConfirmed(false); }} step="1" type="number" value={observedCases} /><small>{t.evidenceUnits.cases}</small></div></label>
                <label><span>{t.evidenceInputs.time}</span><div><input aria-label={t.evidenceInputs.time} max="100" min="0" onChange={(event) => { setObservedTimeReduction(Math.min(100, Math.max(0, Number(event.target.value) || 0))); setFieldEvidenceConfirmed(false); }} step="1" type="number" value={observedTimeReduction} /><small>{t.evidenceUnits.percent}</small></div></label>
                <label><span>{t.evidenceInputs.quality}</span><div><input aria-label={t.evidenceInputs.quality} max="100" min="0" onChange={(event) => { setObservedQuality(Math.min(100, Math.max(0, Number(event.target.value) || 0))); setFieldEvidenceConfirmed(false); }} step="1" type="number" value={observedQuality} /><small>{t.evidenceUnits.percent}</small></div></label>
                <label><span>{t.evidenceInputs.critical}</span><div><input aria-label={t.evidenceInputs.critical} max="99" min="0" onChange={(event) => { setCriticalEffects(Math.min(99, Math.max(0, Number(event.target.value) || 0))); setFieldEvidenceConfirmed(false); }} step="1" type="number" value={criticalEffects} /><small>{t.evidenceUnits.events}</small></div></label>
                <label><span>{t.evidenceInputs.trace}</span><div><input aria-label={t.evidenceInputs.trace} max="100" min="0" onChange={(event) => { setTraceCompleteness(Math.min(100, Math.max(0, Number(event.target.value) || 0))); setFieldEvidenceConfirmed(false); }} step="1" type="number" value={traceCompleteness} /><small>{t.evidenceUnits.percent}</small></div></label>
                <label><span>{t.evidenceInputs.eligibility}</span><div><input aria-label={t.evidenceInputs.eligibility} max="100" min="0" onChange={(event) => { setObservedEligibility(Math.min(100, Math.max(0, Number(event.target.value) || 0))); setFieldEvidenceConfirmed(false); }} step="1" type="number" value={observedEligibility} /><small>{t.evidenceUnits.percent}</small></div></label>
              </div>
            </div>
            <output className="evidence-result" data-decision={evidenceDecision} aria-live="polite">
              <div className="evidence-verdict"><span>{locale === "en" ? "AUTHORIZED NEXT ACTION" : "PROCHAINE ACTION AUTORISÉE"}</span><strong>{evidenceDecisionCopy.label}</strong><p>{evidenceDecisionCopy.text}</p></div>
              <div className="evidence-impact">
                <p><span>{t.evidenceObserved}</span><strong>{formatNumber(observedWholeReduction)}%</strong></p>
                <p><span>{t.evidencePlanned}</span><strong>{formatNumber(calibration.totalLow)}–{formatNumber(calibration.totalHigh)}%</strong></p>
                <p><span>{t.evidenceFreed}</span><strong>{formatNumber(observedFreedHours)} h</strong></p>
              </div>
              <div className="evidence-ledger"><p className="eyebrow">{t.evidenceMatrixTitle}</p><ol>{evidenceRows.map((row) => <li data-status={row.status} key={row.code}><span>{row.code}</span><p><strong>{row.label}</strong><small>{row.observed}</small></p><em>{t.evidenceStatuses[row.status]}</em></li>)}</ol></div>
              {eligibilityWarning && <p className="evidence-warning">{t.evidenceEligibilityWarning}</p>}
            </output>
          </div>
          <div className="evidence-footer"><p>{t.evidenceRule}</p><button className="button primary" onClick={() => void copyEvidenceMemo()} type="button">{evidenceCopied ? t.evidenceCopied : t.evidenceCopy}</button></div>
        </section>

        <section className="operations section-light" id="operations" aria-labelledby="operations-title">
          <div className="section-heading"><p className="eyebrow">{t.operationsEyebrow}</p><h2 id="operations-title">{t.operationsTitle}</h2><p>{t.operationsText}</p></div>
          <ol className="pilot-roadmap operations-roadmap" aria-label={locale === "en" ? "Adoption decision sequence" : "Séquence de décision d’adoption"}>{t.pilotRoadmap.map((item, index) => <li data-current={index === 4} key={item}><span>0{index + 1}</span><strong>{item}</strong></li>)}</ol>
          <div className="operation-contract">
            <output className="operation-state" data-state={evidenceDecision} aria-live="polite"><span>{locale === "en" ? "CURRENT OPERATING STATE" : "ÉTAT D’EXPLOITATION ACTUEL"}</span><strong>{operationState.label}</strong><p>{operationState.text}</p><small>{evidenceDecisionCopy.label} → {pilotLevelLabel}</small></output>
            <fieldset className="operation-owners"><legend>{t.operationOwnersTitle}</legend>
              <label><span>{t.operationFields.owner}</span><input aria-label={t.operationFields.owner} maxLength={80} onChange={(event) => { setOperationOwner(event.target.value); setOperationCopied(false); setDossierCopied(false); }} type="text" value={operationOwner} /></label>
              <label><span>{t.operationFields.incident}</span><input aria-label={t.operationFields.incident} maxLength={80} onChange={(event) => { setIncidentOwner(event.target.value); setOperationCopied(false); setDossierCopied(false); }} type="text" value={incidentOwner} /></label>
              <label><span>{t.operationFields.review}</span><input aria-label={t.operationFields.review} min="2026-08-19" onChange={(event) => { if (event.target.value) setReviewDate(event.target.value); setOperationCopied(false); setDossierCopied(false); }} type="date" value={reviewDate} /></label>
            </fieldset>
          </div>
          <div className="operation-metrics">
            <p><span>{t.operationMetrics.review}</span><strong>{operationSpec.reviewDays}</strong><small>{t.operationDays} · {reviewDateLabel}</small></p>
            <p><span>{t.operationMetrics.containment}</span><strong>{operationSpec.containment}</strong><small>{locale === "en" ? "planning target, rehearse it" : "objectif à tester par exercice"}</small></p>
            <p><span>{t.operationMetrics.scope}</span><strong>1</strong><small>{t.operationSameScope}</small></p>
          </div>
          <div className="operation-monitoring"><p className="eyebrow">{t.operationMonitoringTitle}</p><div>{t.operationMonitoring.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div>
          <div className="operation-response">
            <article className="operation-stops"><p className="eyebrow">{t.operationStopTitle}</p><ol>{t.operationStops.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></li>)}</ol></article>
            <article className="operation-rollback"><p className="eyebrow">{t.operationRollbackTitle}</p><ol>{t.operationRollback.map(([number, title, text]) => <li key={number}><span>{number}</span><div><strong>{title}</strong><p>{text}</p></div></li>)}</ol></article>
          </div>
          <div className="operation-rules"><article><span>{t.operationChangeRuleTitle}</span><p>{t.operationChangeRule}</p></article><article><span>{t.operationRetireTitle}</span><p>{t.operationRetire}</p></article></div>
          <div className="operation-footer"><p>{locale === "en" ? "The operating card is valid only with named people, reachable fallback, tested containment, and the exact evaluated system version." : "La fiche d’exploitation n’est valable qu’avec des personnes nommées, un fallback joignable, un confinement testé et la version exacte du système évalué."}</p><div><button className="button primary" onClick={() => void copyOperationCard()} type="button">{operationCopied ? t.operationCopied : t.operationCopy}</button><a className="button secondary" href={`${repositorySource}/templates/incident-runbook${locale === "fr" ? ".fr" : ""}.md`}>{t.operationRunbook} ↗</a></div></div>
        </section>

        <section className="decision-dossier section-dark" id="decision-dossier" aria-labelledby="decision-dossier-title">
          <div className="section-heading"><p className="eyebrow">{t.dossierEyebrow}</p><h2 id="decision-dossier-title">{t.dossierTitle}</h2><p>{t.dossierText}</p></div>
          <div className="dossier-status" data-ready={dossierReady}><div><span>{locale === "en" ? "CURRENT PACKAGE STATE" : "ÉTAT ACTUEL DU DOSSIER"}</span><strong>{dossierReady ? t.dossierReady : t.dossierDraft}</strong></div><p><strong>{dossierMissingItems.length}</strong><span>{t.dossierMissing}</span></p></div>
          <div className="dossier-artifacts">{t.dossierArtifacts.map(([number, title, text], index) => <article data-status={dossierArtifactStatuses[index]} key={number}><div><span>{number}</span><em>{t.dossierStatuses[dossierArtifactStatuses[index]]}</em></div><h3>{title}</h3><p>{text}</p></article>)}</div>
          {dossierMissingItems.length > 0 && <aside className="dossier-missing"><span>{locale === "en" ? "COMPLETE BEFORE HANDOFF" : "À COMPLÉTER AVANT TRANSMISSION"}</span><ul>{dossierMissingItems.map((item) => <li key={item}>{item}</li>)}</ul></aside>}
          <div className="dossier-handoff">
            <article><p className="eyebrow">{t.dossierHandoffTitle}</p><ol>{t.dossierHandoff.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></li>)}</ol></article>
            <aside><span>{t.dossierBoundaryTitle}</span><p>{t.dossierBoundary}</p><div><strong>4</strong><small>{locale === "en" ? "decision artifacts in the export" : "artefacts de décision dans l’export"}</small></div></aside>
          </div>
          <div className="dossier-footer"><p>{locale === "en" ? "Export a readable summary now, then attach controlled evidence by identifier. The file remains explicitly marked as a draft until the missing ownership or evidence fields are completed." : "Exportez maintenant une synthèse lisible, puis joignez les preuves contrôlées par identifiant. Le fichier reste explicitement marqué brouillon tant que les responsabilités ou preuves manquantes ne sont pas complétées."}</p><div><button className="button dossier-copy" onClick={() => void copyDossier()} type="button">{dossierCopied ? t.dossierCopied : t.dossierCopy}</button><button className="button dossier-download" onClick={downloadDossier} type="button">{t.dossierDownload} ↓</button></div></div>
        </section>

        <section className="field-pilot section-blue" id="field-pilot" aria-labelledby="field-pilot-title">
          <div className="section-heading"><p className="eyebrow">{t.fieldPilotEyebrow}</p><h2 id="field-pilot-title">{t.fieldPilotTitle}</h2><p>{t.fieldPilotText}</p></div>
          <ol className="field-pilot-flow">{t.fieldPilotFlow.map(([number, title, text]) => <li key={number}><span>{number}</span><strong>{title}</strong><p>{text}</p></li>)}</ol>
          <div className="field-pilot-shell">
            <div className="field-pilot-form">
              <p className="field-pilot-privacy"><strong>{locale === "en" ? "PRIVACY BOUNDARY" : "FRONTIÈRE DE CONFIDENTIALITÉ"}</strong>{t.fieldPilotPrivacy}</p>
              <div className="field-pilot-selects">
                <label><span>{t.fieldPilotLabels.organization}</span><select onChange={(event) => { setAudienceId(event.target.value as AudienceId); setFieldEvidenceConfirmed(false); }} value={audienceId}>{audiences[locale].map((audience) => <option key={audience.id} value={audience.id}>{audience.title}</option>)}</select></label>
                <label><span>{t.fieldPilotLabels.integration}</span><select onChange={(event) => selectCalibrationLevel(event.target.value as IntegrationId)} value={calibrationLevel}>{t.calibratorLevels.map((level) => <option key={level.id} value={level.id}>{level.label}</option>)}</select></label>
                <label><span>{t.fieldPilotLabels.sector}</span><select onChange={(event) => { setFieldSectorId(event.target.value as FieldSectorId); setFieldEvidenceConfirmed(false); }} value={fieldSectorId}>{t.fieldPilotSectors.map((sector) => <option key={sector.id} value={sector.id}>{sector.label}</option>)}</select></label>
              </div>
              <div className="field-pilot-fields">
                <label><span>{t.fieldPilotLabels.alias}</span><input maxLength={80} onChange={(event) => setFieldAlias(event.target.value)} placeholder={locale === "en" ? "Example: Workshop North" : "Exemple : Atelier Nord"} type="text" value={fieldAlias} /></label>
                <label><span>{t.fieldPilotLabels.version}</span><input maxLength={100} onChange={(event) => setFieldVersion(event.target.value)} placeholder={locale === "en" ? "Workflow 1.2 · model/config 2026-08" : "Workflow 1.2 · modèle/config 2026-08"} type="text" value={fieldVersion} /></label>
                <label className="field-pilot-wide"><span>{t.fieldPilotLabels.workflow}</span><textarea maxLength={360} onChange={(event) => setFieldWorkflow(event.target.value)} placeholder={locale === "en" ? "Describe one bounded input-to-accepted-outcome workflow." : "Décrivez un seul workflow borné, de l’entrée au résultat accepté."} rows={3} value={fieldWorkflow} /></label>
                <label><span>{t.fieldPilotLabels.start}</span><input onChange={(event) => setFieldStart(event.target.value)} type="date" value={fieldStart} /></label>
                <label><span>{t.fieldPilotLabels.end}</span><input min={fieldStart || undefined} onChange={(event) => setFieldEnd(event.target.value)} type="date" value={fieldEnd} /></label>
                <label className="field-pilot-wide"><span>{t.fieldPilotLabels.transfer}</span><textarea maxLength={420} onChange={(event) => setFieldTransfer(event.target.value)} placeholder={locale === "en" ? "Name the represented population, workflow, permissions, and conditions." : "Nommez population, workflow, permissions et conditions représentés."} rows={3} value={fieldTransfer} /></label>
                <label className="field-pilot-wide"><span>{t.fieldPilotLabels.unsupported}</span><textarea maxLength={420} onChange={(event) => setFieldUnsupported(event.target.value)} placeholder={locale === "en" ? "Example: does not prove gains for other sectors, versions, or autonomy levels." : "Exemple : ne démontre aucun gain pour d’autres secteurs, versions ou niveaux d’autonomie."} rows={3} value={fieldUnsupported} /></label>
              </div>
            </div>
            <aside className="field-pilot-review">
              <output className="field-pilot-status" data-ready={fieldReadyForReview} aria-live="polite"><span>{fieldReadyForReview ? t.fieldPilotState.review : t.fieldPilotState.draft}</span><strong>{fieldCompleted}/{fieldRequirements.length}</strong><small>{fieldReadyForReview ? t.fieldPilotState.completed : `${fieldRequirements.length - fieldCompleted} ${t.fieldPilotState.remaining}`}</small></output>
              <div className="field-pilot-evidence"><p>{t.fieldPilotEvidenceTitle}</p><div><span><small>{locale === "en" ? "SAMPLE" : "ÉCHANTILLON"}</small><strong>{observedCases}/{pilotSpec.live}</strong></span><span><small>{locale === "en" ? "VALUE" : "VALEUR"}</small><strong>{observedTimeReduction}%</strong></span><span><small>{locale === "en" ? "QUALITY" : "QUALITÉ"}</small><strong>{observedQuality}%</strong></span><span><small>{locale === "en" ? "CRITICAL" : "CRITIQUE"}</small><strong>{criticalEffects}</strong></span><span><small>{locale === "en" ? "TRACE" : "TRACE"}</small><strong>{traceCompleteness}%</strong></span><span><small>{locale === "en" ? "ELIGIBILITY" : "ÉLIGIBILITÉ"}</small><strong>{observedEligibility}%</strong></span></div><a href="#evidence-gate">{locale === "en" ? "Change the observed evidence" : "Modifier les preuves observées"} ↑</a><label className="field-pilot-evidence-confirm"><input checked={fieldEvidenceConfirmed} onChange={(event) => setFieldEvidenceConfirmed(event.target.checked)} type="checkbox" /><span>{t.fieldPilotEvidenceConfirm}</span></label></div>
              <fieldset className="field-pilot-checklist"><legend>{t.fieldPilotChecklistTitle}</legend>{t.fieldPilotChecklist.map((item, index) => <label key={item}><input checked={fieldReviewChecks[index]} onChange={() => setFieldReviewChecks((current) => current.map((value, currentIndex) => currentIndex === index ? !value : value))} type="checkbox" /><span>{item}</span></label>)}</fieldset>
            </aside>
          </div>
          <div className="field-pilot-footer"><div><strong>{t.fieldPilotAlwaysDraft}</strong><p>{locale === "en" ? "The public registry still contains zero reports. Preparing a draft does not change that count." : "Le registre public contient toujours zéro rapport. Préparer un brouillon ne modifie pas ce nombre."}</p></div><div><button className="button primary" onClick={downloadFieldReport} type="button">{t.fieldPilotDownload} ↓</button><a className="button secondary" href={fieldPilotIssues[locale]}>{t.fieldPilotGitHub} ↗</a><a className="button secondary" href={`${repositorySource}/docs/field-pilot-protocol${locale === "fr" ? ".fr" : ""}.md`}>{t.fieldPilotProtocol} ↗</a><a className="button secondary" href={`${repositorySource}/templates/field-feedback-report${locale === "fr" ? ".fr" : ""}.md`}>{t.fieldPilotTemplate} ↗</a></div></div>
        </section>

          </div>
        </details>

        <details className="guide-chapter" id="implementation-library">
          <summary><span>{guideCopy.chapters[2].number}</span><div><strong>{guideCopy.chapters[2].title}</strong><small>{guideCopy.chapters[2].text}</small></div><b aria-hidden="true">+</b></summary>
          <div className="guide-chapter-content">

        <section className="paths section-dark" id="paths" aria-labelledby="paths-title">
          <div className="section-heading"><p className="eyebrow">{t.pathsEyebrow}</p><h2 id="paths-title">{t.pathsTitle}</h2><p>{t.pathsText}</p></div>
          <div className="path-grid">
            {audiences[locale].map((audience) => <button aria-pressed={audience.id === selected.id} className="path-card" data-active={audience.id === selected.id} key={audience.id} onClick={() => setAudienceId(audience.id)} type="button"><span className="path-number">{audience.number}</span><span className="path-title">{audience.title}</span><span className="path-copy">{audience.short}</span><span className="path-horizon">{audience.horizon} →</span></button>)}
          </div>
          <article className="selected-plan" aria-live="polite">
            <div className="plan-intro"><p className="eyebrow">{t.selected} · {selected.number}</p><h3>{selected.title}</h3><p>{selected.objective}</p><dl><div><dt>{t.roles}</dt><dd>{selected.roles}</dd></div><div><dt>{t.pilot}</dt><dd>{selected.pilot}</dd></div></dl></div>
            <ol className="phase-list">{selected.phases.map((item) => <li key={item.label}><span>{item.label}</span><div><strong>{item.title}</strong><p>{item.text}</p></div></li>)}</ol>
            <div className="control-box"><p>{t.controls}</p><ul>{selected.controls.map((control) => <li key={control}>{control}</li>)}</ul><a href={`${repositorySource}/${selected.file}`}>{t.fullGuide} ↗</a></div>
          </article>
        </section>

        <section className="sector-lenses section-blue" id="sectors" aria-labelledby="sectors-title">
          <div className="section-heading"><p className="eyebrow">{t.sectorEyebrow}</p><h2 id="sectors-title">{t.sectorTitle}</h2><p>{t.sectorText}</p></div>
          <ol className="sector-flow">{t.sectorFlow.map(([number, title, text]) => <li key={number}><span>{number}</span><div><strong>{title}</strong><p>{text}</p></div></li>)}</ol>
          <div className="sector-grid">{t.sectors.map((sector, index) => <a href={`${repositorySource}/${sector.file}`} key={sector.code}><header><span>{sector.code}</span><small>0{index + 1}</small></header><h3>{sector.title}</h3><dl><div><dt>{t.sectorLabels.trigger}</dt><dd>{sector.trigger}</dd></div><div className="sector-veto"><dt>{t.sectorLabels.veto}</dt><dd>{sector.veto}</dd></div><div><dt>{t.sectorLabels.evidence}</dt><dd>{sector.evidence}</dd></div></dl><b>{t.sectorGuide} ↗</b></a>)}</div>
          <p className="sector-caveat">{t.sectorCaveat}</p>
        </section>

        <section className="method section-light" id="method" aria-labelledby="method-title">
          <div className="section-heading"><p className="eyebrow">{t.methodEyebrow}</p><h2 id="method-title">{t.methodTitle}</h2><p>{t.methodText}</p></div>
          <div className="process-list">{t.steps.map(([title, text, evidence], index) => <details key={title} open={index === 0}><summary><span>{String(index + 1).padStart(2, "0")}</span><strong>{title}</strong><em aria-hidden="true">+</em></summary><div className="step-body"><p>{text}</p><p className="evidence"><span>{t.deliverable}</span>{evidence}</p></div></details>)}</div>
        </section>

        <section className="worked-case section-dark" id="case" aria-labelledby="case-title">
          <div className="section-heading"><p className="eyebrow">{t.caseEyebrow}</p><h2 id="case-title">{t.caseTitle}</h2><p>{t.caseText}</p></div>
          <div className="case-overview"><article><span>{t.caseBadge}</span><h3>Atelier Horizon</h3><p>{t.caseProblem}</p></article><div className="case-metrics">{t.caseMetrics.map(([value, label]) => <p key={label}><strong>{value}</strong><span>{label}</span></p>)}</div></div>
          <ol className="case-timeline">{t.caseTimeline.map(([label, title, text]) => <li key={label}><span>{label}</span><div><strong>{title}</strong><p>{text}</p></div></li>)}</ol>
          <div className="case-decision"><div><p className="eyebrow">GATE 03 · DECISION</p><h3>{t.caseDecision}</h3><p>{t.caseDecisionText}</p></div><a className="button case-button" href={`${repository}/blob/${caseRevision}/${locale === "en" ? "examples/en/tpe-customer-requests.md" : "examples/fr/tpe-demandes-clients.md"}`}>{t.caseCta} ↗</a></div>
        </section>

        <section className="sme-case section-light" id="sme-case" aria-labelledby="sme-case-title">
          <div className="section-heading"><p className="eyebrow">{t.smeEyebrow}</p><h2 id="sme-case-title">{t.smeTitle}</h2><p>{t.smeText}</p></div>
          <div className="sme-lead"><article><span>{t.smeBadge}</span><h3>Noroît Mécanique SA</h3><p>{t.smeProblem}</p></article><div className="sme-mark"><strong>A2</strong><span>{locale === "en" ? "FULL WORKFLOW · HUMAN GATE" : "WORKFLOW COMPLET · GATE HUMAINE"}</span></div></div>
          <ol className="sme-workflow" aria-label={locale === "en" ? "B2B quote workflow" : "Workflow du devis B2B"}>{t.smeWorkflow.map(([number, title, text]) => <li key={number}><span>{number}</span><strong>{title}</strong><p>{text}</p></li>)}</ol>
          <div className="sme-range"><div className="sme-range-copy"><p className="eyebrow">{locale === "en" ? "LOW / CENTRAL / HIGH" : "BAS / CENTRAL / HAUT"}</p><h3>{t.smeRangeTitle}</h3><p>{t.smeRangeText}</p></div><ol>{t.smeRange.map(([label, value, assumptions], index) => <li className={`sme-range-bar sme-range-${index + 1}`} key={label}><span>{label}</span><div><i aria-hidden="true" /></div><strong>{value}</strong><small>{assumptions}</small></li>)}</ol></div>
          <div className="sme-metrics">{t.smeMetrics.map(([value, label]) => <p key={label}><strong>{value}</strong><span>{label}</span></p>)}</div>
          <aside className="sme-denominator"><div><span>316</span><small>{locale === "en" ? "ALL REQUESTS" : "TOUTES DEMANDES"}</small></div><div><span>238</span><small>{locale === "en" ? "INITIALLY ELIGIBLE" : "ÉLIGIBLES INITIALES"}</small></div><div><span>220</span><small>{locale === "en" ? "ACCEPTED QUOTES" : "DEVIS ACCEPTÉS"}</small></div><article><strong>{t.smeDenominatorTitle}</strong><p>{t.smeDenominatorText}</p></article></aside>
          <div className="sme-evidence"><h3>{t.smeEvidenceTitle}</h3><div>{t.smeEvidence.map(([kind, value, text, href]) => <a href={href} key={kind}><span>{kind}</span><strong>{value}</strong><p>{text}</p><b aria-hidden="true">↗</b></a>)}</div><p>{t.smeSourceNote}</p></div>
          <div className="sme-decision"><div><p className="eyebrow">GATE 04 · {locale === "en" ? "LEVEL DECISION" : "DÉCISION DE NIVEAU"}</p><h3>{t.smeDecision}</h3><p>{t.smeDecisionText}</p></div><a className="button primary" href={`${repositorySource}/${locale === "en" ? "examples/en/sme-b2b-quote-business-agent.md" : "examples/fr/pme-agent-metier-devis-b2b.md"}`}>{t.smeCta} ↗</a></div>
        </section>

        <section className="mission-case section-dark" id="mission-case" aria-labelledby="mission-case-title">
          <div className="section-heading"><p className="eyebrow">{t.missionEyebrow}</p><h2 id="mission-case-title">{t.missionTitle}</h2><p>{t.missionText}</p></div>
          <div className="mission-lead"><article><span>{t.missionBadge}</span><h3>Fondation Lien Local</h3><p>{t.missionProblem}</p></article><div className="mission-mark"><strong>A2</strong><span>{locale === "en" ? "ADMINISTRATION · NOT JUDGMENT" : "ADMINISTRATION · PAS DE JUGEMENT"}</span></div></div>
          <ol className="mission-workflow" aria-label={locale === "en" ? "Grant dossier administrative workflow" : "Workflow administratif des dossiers de subvention"}>{t.missionWorkflow.map(([number, title, text]) => <li key={number}><span>{number}</span><strong>{title}</strong><p>{text}</p></li>)}</ol>
          <div className="mission-boundary"><article><p>{t.missionAgentTitle}</p><ul>{t.missionAgent.map((item) => <li key={item}>{item}</li>)}</ul></article><article><p>{t.missionHumanTitle}</p><ul>{t.missionHuman.map((item) => <li key={item}>{item}</li>)}</ul></article></div>
          <div className="mission-range"><div><p className="eyebrow">{locale === "en" ? "LOW / CENTRAL / HIGH" : "BAS / CENTRAL / HAUT"}</p><h3>{t.missionRangeTitle}</h3><p>{t.missionRangeText}</p></div><ol>{t.missionRange.map(([label, value, assumptions], index) => <li className={`mission-range-bar mission-range-${index + 1}`} key={label}><span>{label}</span><div><i aria-hidden="true" /></div><strong>{value}</strong><small>{assumptions}</small></li>)}</ol></div>
          <div className="mission-metrics">{t.missionMetrics.map(([value, label]) => <p key={label}><strong>{value}</strong><span>{label}</span></p>)}</div>
          <aside className="mission-denominator"><div><span>120</span><small>{locale === "en" ? "ALL APPLICATIONS" : "TOUTES DEMANDES"}</small></div><div><span>86</span><small>{locale === "en" ? "STANDARD WORKFLOW" : "WORKFLOW STANDARD"}</small></div><div><span>79</span><small>{locale === "en" ? "ACCEPTED PACKETS" : "PAQUETS ACCEPTÉS"}</small></div><article><strong>{t.missionDenominatorTitle}</strong><p>{t.missionDenominatorText}</p></article></aside>
          <div className="mission-gates"><div><p className="eyebrow">GATE 04 · {locale === "en" ? "MISSION BEFORE EFFICIENCY" : "MISSION AVANT EFFICACITÉ"}</p><h3>{t.missionGateTitle}</h3></div><ol>{t.missionGate.map(([label, title, text], index) => <li key={label}><span>{String(index + 1).padStart(2, "0")}</span><small>{label}</small><strong>{title}</strong><p>{text}</p></li>)}</ol></div>
          <div className="mission-evidence"><h3>{t.missionEvidenceTitle}</h3><div>{t.missionEvidence.map(([kind, value, evidence, href]) => <a href={href} key={kind}><span>{kind}</span><strong>{value}</strong><p>{evidence}</p><b aria-hidden="true">↗</b></a>)}</div></div>
          <aside className="mission-legal"><strong>{locale === "en" ? "AUTOMATED-DECISION BOUNDARY" : "FRONTIÈRE DE DÉCISION AUTOMATISÉE"}</strong><p>{t.missionLegalNote}</p><a href="https://www.edoeb.admin.ch/en/duty-to-provide-information">{locale === "en" ? "Swiss FDPIC guidance" : "Indications du PFPDT"} ↗</a></aside>
          <div className="mission-decision"><div><p className="eyebrow">GATE 05 · {locale === "en" ? "AUTONOMY DECISION" : "DÉCISION D’AUTONOMIE"}</p><h3>{t.missionDecision}</h3><p>{t.missionDecisionText}</p></div><a className="button primary" href={`${repositorySource}/${locale === "en" ? "examples/en/nonprofit-grant-dossier-business-agent.md" : "examples/fr/association-agent-dossiers-subventions.md"}`}>{t.missionCta} ↗</a></div>
        </section>

        <section className="public-case section-blue" id="public-case" aria-labelledby="public-case-title">
          <div className="section-heading"><p className="eyebrow">{t.publicEyebrow}</p><h2 id="public-case-title">{t.publicTitle}</h2><p>{t.publicText}</p></div>
          <div className="public-lead"><article><span>{t.publicBadge}</span><h3>{locale === "en" ? "City of Mont-Rive" : "Ville de Mont-Rive"}</h3><p>{t.publicProblem}</p></article><div className="public-seal"><strong>P0–P5</strong><span>{locale === "en" ? "FORMAL PUBLIC GATES" : "GATES PUBLICS FORMELS"}</span></div></div>
          <ol className="public-workflow" aria-label={locale === "en" ? "Public planning dossier workflow" : "Workflow public des dossiers d’urbanisme"}>{t.publicWorkflow.map(([number, title, text]) => <li key={number}><span>{number}</span><strong>{title}</strong><p>{text}</p></li>)}</ol>
          <div className="public-boundary"><article><p>{t.publicAgentTitle}</p><ul>{t.publicAgent.map((item) => <li key={item}>{item}</li>)}</ul></article><article><p>{t.publicAuthorityTitle}</p><ul>{t.publicAuthority.map((item) => <li key={item}>{item}</li>)}</ul></article></div>
          <div className="public-range"><div><p className="eyebrow">{locale === "en" ? "LOW / CENTRAL / HIGH" : "BAS / CENTRAL / HAUT"}</p><h3>{t.publicRangeTitle}</h3><p>{t.publicRangeText}</p></div><ol>{t.publicRange.map(([label, value, assumptions], index) => <li className={`public-range-bar public-range-${index + 1}`} key={label}><span>{label}</span><div><i aria-hidden="true" /></div><strong>{value}</strong><small>{assumptions}</small></li>)}</ol></div>
          <div className="public-metrics">{t.publicMetrics.map(([value, label]) => <p key={label}><strong>{value}</strong><span>{label}</span></p>)}</div>
          <aside className="public-denominator"><div><span>270</span><small>{locale === "en" ? "ALL APPLICATIONS" : "TOUTES DEMANDES"}</small></div><div><span>166</span><small>{locale === "en" ? "STANDARD WORKFLOW" : "WORKFLOW STANDARD"}</small></div><div><span>158</span><small>{locale === "en" ? "ACCEPTED PACKETS" : "PAQUETS ACCEPTÉS"}</small></div><article><strong>{t.publicDenominatorTitle}</strong><p>{t.publicDenominatorText}</p></article></aside>
          <div className="public-gates"><div><p className="eyebrow">P0 → P5</p><h3>{t.publicGatesTitle}</h3></div><ol>{t.publicGates.map(([gate, title, text]) => <li key={gate}><span>{gate}</span><strong>{title}</strong><p>{text}</p></li>)}</ol></div>
          <div className="public-evidence"><h3>{t.publicEvidenceTitle}</h3><div>{t.publicEvidence.map(([kind, value, evidence, href]) => <a href={href} key={kind}><span>{kind}</span><strong>{value}</strong><p>{evidence}</p><b aria-hidden="true">↗</b></a>)}</div></div>
          <aside className="public-legal"><strong>{locale === "en" ? "SWISS LEGAL BOUNDARY" : "FRONTIÈRE JURIDIQUE SUISSE"}</strong><p>{t.publicLegalNote}</p><div><a href="https://www.bk.admin.ch/en/artificial-intelligence">{locale === "en" ? "Federal Chancellery" : "Chancellerie fédérale"} ↗</a><a href="https://www.edoeb.admin.ch/en/ai-and-data-protection">PFPDT / FDPIC ↗</a></div></aside>
          <div className="public-decision"><div><p className="eyebrow">P5 · {locale === "en" ? "FORMAL PRODUCTION DECISION" : "DÉCISION FORMELLE DE PRODUCTION"}</p><h3>{t.publicDecision}</h3><p>{t.publicDecisionText}</p></div><a className="button primary" href={`${repositorySource}/${locale === "en" ? "examples/en/public-sector-planning-dossier-business-agent.md" : "examples/fr/service-public-agent-dossiers-urbanisme.md"}`}>{t.publicCta} ↗</a></div>
        </section>

        <section className="solo-case section-light" aria-labelledby="solo-title">
          <div className="section-heading"><p className="eyebrow">{t.soloEyebrow}</p><h2 id="solo-title">{t.soloTitle}</h2><p>{t.soloText}</p></div>
          <div className="solo-board">
            <div className="solo-clock"><span>{locale === "en" ? "PILOT" : "PILOTE"}</span><strong>14</strong><em>{locale === "en" ? "DAYS" : "JOURS"}</em><small>{t.soloBadge}</small></div>
            <article className="solo-brief"><p className="eyebrow">CAMILLE REY · CLIENT FOLLOW-UP</p><h3>{locale === "en" ? "Notes in. Reviewed follow-up out." : "Des notes au suivi relu."}</h3><p>{t.soloProblem}</p><ul>{t.soloRules.map((rule) => <li key={rule}>{rule}</li>)}</ul></article>
            <div className="solo-metrics">{t.soloMetrics.map(([value, label]) => <p key={label}><strong>{value}</strong><span>{label}</span></p>)}</div>
          </div>
          <aside className="case-level-note"><strong>{t.soloClarifierTitle}</strong><p>{t.soloClarifier}</p></aside>
          <ol className="solo-phases">{t.soloPhases.map(([label, title, text], index) => <li key={label}><span>{String(index + 1).padStart(2, "0")}</span><small>{label}</small><strong>{title}</strong><p>{text}</p></li>)}</ol>
          <div className="solo-decision"><div><p className="eyebrow">GATE 02 · {locale === "en" ? "BOUNDARY DECISION" : "DÉCISION DE PÉRIMÈTRE"}</p><h3>{t.soloDecision}</h3><p>{t.soloDecisionText}</p></div><a className="button primary" href={`${repository}/blob/${caseRevision}/${locale === "en" ? "examples/en/independent-client-follow-up.md" : "examples/fr/independant-suivi-client.md"}`}>{t.soloCta} ↗</a></div>
        </section>

        <section className="agent-case section-dark" id="agent-case" aria-labelledby="agent-case-title">
          <div className="section-heading"><p className="eyebrow">{t.agentEyebrow}</p><h2 id="agent-case-title">{t.agentTitle}</h2><p>{t.agentText}</p></div>
          <div className="agent-case-lead"><article><span>{t.agentBadge}</span><h3>Camille Rey · Phase 2</h3><p>{t.agentProblem}</p></article><div className="agent-mark"><strong>A2</strong><span>{locale === "en" ? "ACTION AFTER APPROVAL" : "ACTION APRÈS APPROBATION"}</span></div></div>
          <ol className="agent-flow" aria-label={locale === "en" ? "Business-agent workflow" : "Workflow de l’agent métier"}>{t.agentWorkflow.map(([number, title, text]) => <li key={number}><span>{number}</span><strong>{title}</strong><p>{text}</p></li>)}</ol>
          <div className="agent-ownership"><article><p>{t.agentDoesTitle}</p><ul>{t.agentDoes.map((item) => <li key={item}>{item}</li>)}</ul></article><article><p>{t.humanDoesTitle}</p><ul>{t.humanDoes.map((item) => <li key={item}>{item}</li>)}</ul></article></div>
          <div className="agent-metrics">{t.agentMetrics.map(([value, label]) => <p key={label}><strong>{value}</strong><span>{label}</span></p>)}</div>
          <div className="agent-comparison"><h3>{t.agentCompareTitle}</h3><div>{t.agentCompare.map(([level, value, text]) => <article key={level}><span>{level}</span><strong>{value}</strong><p>{text}</p></article>)}</div></div>
          <ol className="agent-phases">{t.agentPhases.map(([label, title, text], index) => <li key={label}><span>{String(index + 1).padStart(2, "0")}</span><small>{label}</small><strong>{title}</strong><p>{text}</p></li>)}</ol>
          <div className="agent-decision"><div><p className="eyebrow">GATE 04 · {locale === "en" ? "AUTONOMY DECISION" : "DÉCISION D’AUTONOMIE"}</p><h3>{t.agentDecision}</h3><p>{t.agentDecisionText}</p></div><a className="button primary" href={`${repositorySource}/${locale === "en" ? "examples/en/independent-business-agent-follow-up.md" : "examples/fr/independant-agent-metier-suivi.md"}`}>{t.agentCta} ↗</a></div>
        </section>

        <section className="agency-case section-light" id="agency-case" aria-labelledby="agency-case-title">
          <div className="section-heading"><p className="eyebrow">{t.agencyEyebrow}</p><h2 id="agency-case-title">{t.agencyTitle}</h2><p>{t.agencyText}</p></div>
          <div className="agency-lead"><article><span>{t.agencyBadge}</span><h3>{locale === "en" ? "Camille Rey · Standard diagnostic" : "Camille Rey · Diagnostic standard"}</h3><p>{t.agencyProblem}</p></article><div className="agency-mark"><strong>A3</strong><span>{locale === "en" ? "BOUNDED AUTONOMY" : "AUTONOMIE BORNÉE"}</span></div></div>
          <div className="agency-system">
            <article className="agency-orchestrator"><span>{locale === "en" ? "ORCHESTRATOR" : "ORCHESTRATEUR"}</span><h3>{locale === "en" ? "One policy. Six specialists." : "Une politique. Six spécialistes."}</h3><p>{t.agencyOrchestrator}</p></article>
            <ol className="agency-specialists">{t.agencySpecialists.map(([number, title, text]) => <li key={number}><span>{number}</span><strong>{title}</strong><p>{text}</p></li>)}</ol>
            <div className="agency-foundation"><span>{t.agencyFoundationLabel}</span><ul>{t.agencyFoundation.map((item) => <li key={item}>{item}</li>)}</ul></div>
          </div>
          <div className="agency-benchmark"><div><p className="eyebrow">{locale === "en" ? "LIKE-FOR-LIKE BENCHMARK" : "COMPARAISON À TRAVAIL IDENTIQUE"}</p><h3>{t.agencyCompareTitle}</h3></div><ol>{t.agencyCompare.map(([level, time, gain], index) => <li className={`agency-bar bar-${index + 1}`} key={level}><span>{level}</span><div><i aria-hidden="true" /></div><strong>{time}</strong><small>{gain}</small></li>)}</ol></div>
          <div className="agency-metrics">{t.agencyMetrics.map(([value, label]) => <p key={label}><strong>{value}</strong><span>{label}</span></p>)}</div>
          <aside className="agency-eligibility"><strong>{t.agencyEligibilityTitle}</strong><p>{t.agencyEligibilityText}</p></aside>
          <ol className="agency-phases">{t.agencyPhases.map(([label, title, text], index) => <li key={label}><span>{String(index + 1).padStart(2, "0")}</span><small>{label}</small><strong>{title}</strong><p>{text}</p></li>)}</ol>
          <aside className="agency-talos"><strong>{t.agencyTalosNote}</strong><p>{t.agencyTalosText}</p><a href="https://github.com/Musyg/talos">Talos ↗</a></aside>
          <div className="agency-decision"><div><p className="eyebrow">GATE 05 · {locale === "en" ? "SCOPE DECISION" : "DÉCISION DE PÉRIMÈTRE"}</p><h3>{t.agencyDecision}</h3><p>{t.agencyDecisionText}</p></div><a className="button primary" href={`${repositorySource}/${locale === "en" ? "examples/en/independent-orchestrated-agency-diagnostic.md" : "examples/fr/independant-agence-orchestree-diagnostic.md"}`}>{t.agencyCta} ↗</a></div>
        </section>

        <section className="ladder-section section-blue" aria-labelledby="ladder-title"><div><p className="eyebrow">{t.ladderEyebrow}</p><h2 id="ladder-title">{t.ladderTitle}</h2><p>{t.ladderText}</p></div><ol className="ladder">{t.ladder.map((level, index) => <li key={level}><span>{index + 1}</span><strong>{level}</strong></li>)}</ol></section>

        <section className="controls section-light" id="controls" aria-labelledby="controls-title">
          <div className="section-heading"><p className="eyebrow">{t.riskEyebrow}</p><h2 id="controls-title">{t.riskTitle}</h2><p>{t.riskText}</p></div>
          <div className="control-explorer"><fieldset><legend>{t.impact}</legend><div className="choice-list">{t.impactOptions.map((label, index) => <button aria-pressed={risk === index} key={label} onClick={() => setRisk(index)} type="button">{label}</button>)}</div></fieldset><fieldset><legend>{t.autonomy}</legend><div className="choice-list">{t.autonomyOptions.map((label, index) => <button aria-pressed={autonomy === index} key={label} onClick={() => setAutonomy(index)} type="button">{label}</button>)}</div></fieldset><output className="orientation" aria-live="polite"><span>{t.orientation}</span><strong>{t.orientations[controlIndex(risk, autonomy)]}</strong><small>R{risk} × A{autonomy}</small><a className="orientation-link" href="#control-crosswalk">{t.crosswalkOpen} ↓</a></output></div>
        </section>

        <section className="control-crosswalk section-dark" id="control-crosswalk" aria-labelledby="control-crosswalk-title">
          <div className="section-heading"><p className="eyebrow">{t.crosswalkEyebrow}</p><h2 id="control-crosswalk-title">{t.crosswalkTitle}</h2><p>{t.crosswalkText}</p></div>
          <div className="crosswalk-summary" aria-live="polite">
            <p><strong>{applicableControls.length}</strong><span>{t.crosswalkMatched}</span></p>
            <p><strong>{selected.title}</strong><span>{t.crosswalkOrganization}</span></p>
            <p><strong>R{risk} × A{autonomy}</strong><span>{t.crosswalkProfile}</span></p>
            <p><strong>{selectedUsePattern.title}</strong><span>{patternCopy.crosswalkPattern}</span></p>
            <p><strong>{selectedJurisdiction.label}</strong><span>{patternCopy.crosswalkJurisdiction}</span></p>
            <p><strong>{applicableSourceCount}</strong><span>{t.crosswalkSources}</span></p>
          </div>
          <div className="crosswalk-shell">
            <aside className="crosswalk-reading"><p className="eyebrow">{t.crosswalkRead}</p><h3>{t.crosswalkReadingTitle}</h3><ol>{t.crosswalkReading.map(([label, text], index) => <li key={label}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{label}</strong><p>{text}</p></div></li>)}</ol></aside>
            <div className="crosswalk-controls">{applicableControls.map((control) => <details key={control.control_id}><summary><span>{control.control_id}</span><strong>{control.title[locale]}</strong><small data-priority={control.priority}>{t.crosswalkPriority[control.priority]}</small></summary><div className="crosswalk-detail"><p>{control.objective[locale]}</p><dl><div><dt>{t.crosswalkEvidence}</dt><dd>{control.evidence_ids.map((evidenceId) => `${evidenceId} · ${evidenceCatalog.get(evidenceId)?.name[locale] ?? evidenceId}`).join(" / ")}</dd></div><div><dt>{t.crosswalkGates}</dt><dd>{control.gates.join(" · ")}</dd></div><div><dt>{t.crosswalkPhases}</dt><dd>{control.lifecycle_phases.join(" · ")}</dd></div><div><dt>{t.crosswalkSourceRefs}</dt><dd>{control.source_refs.map((source) => source.source_id).join(" · ")}</dd></div></dl>{control.applicability.conditions[0] !== "always" && <p className="crosswalk-condition"><strong>{t.crosswalkCondition}</strong>{control.applicability.conditions.map((condition) => crosswalkConditions[locale][condition] ?? condition).join(" · ")}</p>}</div></details>)}</div>
          </div>
          <div className="crosswalk-footer"><p>{t.crosswalkLimit}</p><div><a className="button primary" download href={sitePath("/data/control-crosswalk.v1.json")}>{t.crosswalkDownload} ↓</a><a className="button secondary" download href={sitePath("/data/control-crosswalk.schema.json")}>{t.crosswalkSchema} ↓</a></div></div>
        </section>

        <section className="toolkit section-dark" id="toolkit" aria-labelledby="toolkit-title"><div className="section-heading"><p className="eyebrow">{t.toolkitEyebrow}</p><h2 id="toolkit-title">{t.toolkitTitle}</h2><p>{t.toolkitText}</p></div><div className="tool-grid">{t.tools.map(([name, description, file], index) => <a href={`${repositorySource}/${file}`} key={name}><span>{String(index + 1).padStart(2, "0")}</span><h3>{name}</h3><p>{description}</p><b>↗</b></a>)}</div></section>

        <aside className="source-note"><p className="eyebrow">SOURCES · LIMITS</p><h2>{t.sourceTitle}</h2><p>{t.sourceText}</p><a className="button secondary" href={`${repositorySource}/references/sources.md`}>{t.sources} ↗</a></aside>
          </div>
        </details>
        </div>
      </main>
      <footer><p>{t.footer}</p><a href={repository}>GitHub ↗</a></footer>
    </div>
  );
}
