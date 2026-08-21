"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  buildProjectDossier,
  parseProjectDossier,
  PROJECT_DOSSIER_STORAGE_KEY,
} from "./project-dossier.mjs";
import type { ProjectArtifacts, ProjectChangeReview } from "./project-dossier.mjs";
import { createEmptyProjectArtifacts, materializeProjectArtifacts } from "./project-artifacts.mjs";
import { createProjectSnapshot, materializeProjectChangeReview } from "./project-change-review.mjs";
import { ProjectArtifactsWorkbench } from "./ProjectArtifactsWorkbench";
import { ProjectChangeReviewWorkbench } from "./ProjectChangeReview";

type Locale = "en" | "fr";
type AudienceId = "independent" | "tpe" | "pme" | "nonprofit" | "public";
type UsePatternId = "generation" | "retrieval" | "classification" | "prediction" | "conversation" | "multimodal" | "agentic";
type JurisdictionId = "CH" | "EU" | "BOTH";
type IntegrationId = "copilot" | "agent" | "agency";
type Option = { value: string; label: string };
type FieldDefinition = {
  id: string;
  label: string;
  help: string;
  kind: "text" | "textarea" | "number" | "date" | "select";
  options?: Option[];
};
type PhaseDefinition = {
  code: string;
  title: string;
  short: string;
  question: string;
  why: string;
  evidence: string;
  fields: FieldDefinition[];
};
type MatchedControl = {
  id: string;
  title: string;
  priority: string;
  family: string;
  phases: number[];
};
type RestorableContext = {
  audienceId: AudienceId;
  usePatternId: UsePatternId;
  jurisdictionId: JurisdictionId;
  integrationId: IntegrationId;
  autonomy: number;
  risk: number;
};
type Props = {
  locale: Locale;
  audienceId: AudienceId;
  audienceLabel: string;
  usePatternId: UsePatternId;
  usePatternLabel: string;
  jurisdictionId: JurisdictionId;
  jurisdictionLabel: string;
  integrationId: IntegrationId;
  integrationLabel: string;
  autonomy: number;
  initialRisk: number;
  matchedControls: MatchedControl[];
  onContextImport: (context: RestorableContext) => boolean;
  onRiskChange: (risk: number) => void;
  schemaHref: string;
};

const options = {
  en: {
    score: [{ value: "1", label: "1 · Low" }, { value: "2", label: "2" }, { value: "3", label: "3 · Medium" }, { value: "4", label: "4" }, { value: "5", label: "5 · High" }],
    impact: [{ value: "low", label: "Low and reversible" }, { value: "material", label: "Material for a person or organization" }, { value: "high", label: "High impact, rights, safety, or public authority" }],
    data: [{ value: "none", label: "No personal or confidential data" }, { value: "personal", label: "Personal or confidential data" }, { value: "sensitive", label: "Sensitive, privileged, or protected data" }],
    yesNo: [{ value: "no", label: "No" }, { value: "yes", label: "Yes" }],
    effects: [{ value: "none", label: "No external effect" }, { value: "reversible", label: "Approved and reversible effect" }, { value: "material", label: "Material or difficult-to-reverse effect" }],
    knowledge: [{ value: "prompt", label: "Prompt and model knowledge only" }, { value: "retrieval", label: "Controlled retrieval sources" }, { value: "systems", label: "Connected business systems" }],
    decision: [{ value: "unknown", label: "Not enough evidence" }, { value: "continue", label: "Continue the same scope" }, { value: "rework", label: "Rework and rerun" }, { value: "stop", label: "Stop and return safely" }],
  },
  fr: {
    score: [{ value: "1", label: "1 · Faible" }, { value: "2", label: "2" }, { value: "3", label: "3 · Moyen" }, { value: "4", label: "4" }, { value: "5", label: "5 · Élevé" }],
    impact: [{ value: "low", label: "Faible et réversible" }, { value: "material", label: "Significatif pour une personne ou une structure" }, { value: "high", label: "Impact élevé, droits, sûreté ou autorité publique" }],
    data: [{ value: "none", label: "Aucune donnée personnelle ou confidentielle" }, { value: "personal", label: "Données personnelles ou confidentielles" }, { value: "sensitive", label: "Données sensibles, protégées ou privilégiées" }],
    yesNo: [{ value: "no", label: "Non" }, { value: "yes", label: "Oui" }],
    effects: [{ value: "none", label: "Aucun effet externe" }, { value: "reversible", label: "Effet approuvé et réversible" }, { value: "material", label: "Effet significatif ou difficile à annuler" }],
    knowledge: [{ value: "prompt", label: "Instructions et connaissances du modèle" }, { value: "retrieval", label: "Sources de recherche contrôlées" }, { value: "systems", label: "Systèmes métier connectés" }],
    decision: [{ value: "unknown", label: "Preuves insuffisantes" }, { value: "continue", label: "Continuer le même périmètre" }, { value: "rework", label: "Corriger et rejouer" }, { value: "stop", label: "Arrêter et revenir en sécurité" }],
  },
};

const field = (id: string, label: string, help: string, kind: FieldDefinition["kind"] = "text", fieldOptions?: Option[]): FieldDefinition => ({ id, label, help, kind, options: fieldOptions });

const phaseDefinitions: Record<Locale, PhaseDefinition[]> = {
  en: [
    { code: "0", title: "Mandate", short: "Name the decision", question: "What observable problem is worth changing, and who may decide?", why: "A tool request without an owner, boundary, and decision date cannot become an accountable project.", evidence: "Signed mandate with owner, affected people, limits, and decision date.", fields: [field("project", "Non-identifying project name", "Use a neutral working title."), field("owner", "Accountable owner", "Name a role, not an AI team."), field("problem", "Observable problem", "Describe the current failure or delay, not the desired tool.", "textarea"), field("affected", "People affected", "Include users, customers, workers, beneficiaries, or the public."), field("decisionDate", "Decision date", "When will continue, rework, or stop be decided?", "date")] },
    { code: "1", title: "Initial state", short: "Measure before AI", question: "What happens today, across the complete workload?", why: "Without a denominator and a current result, task speed can be mistaken for business value.", evidence: "Dated baseline with volume, human time, outcome, errors, and exclusions.", fields: [field("baselineVolume", "Cases per month", "Count every request, including excluded work.", "number"), field("baselineMinutes", "Human minutes per case", "Use observed active time where possible.", "number"), field("baselineOutcome", "Current success unit", "Example: accepted quote, resolved request, complete dossier."), field("baselineErrors", "Current error or rework rate (%)", "Use the same definition that the pilot will use.", "number")] },
    { code: "2", title: "Map the work", short: "See the real process", question: "Where do data, decisions, exceptions, and waiting time actually move?", why: "Automation fails at handoffs and exceptions that a demonstration quietly omits.", evidence: "Current-state map from input to accepted outcome, including exceptions.", fields: [field("workInput", "Input", "What starts one case?"), field("workSystems", "Systems and people", "Who or what touches the case?", "textarea"), field("workData", "Data used", "List sources and access boundaries.", "textarea"), field("workDecision", "Human decisions", "What judgment or approval remains human?", "textarea"), field("workExceptions", "Exceptions", "Name missing, ambiguous, rare, or prohibited cases.", "textarea"), field("workOutput", "Accepted outcome", "What finished result counts?", "textarea")] },
    { code: "3", title: "Prioritize", short: "Choose one useful case", question: "Is this case valuable, frequent, measurable, reversible, and feasible enough to test?", why: "Value and difficulty must stay separate. A spectacular demo can still be a poor first pilot.", evidence: "Comparable score and one selected use case with an explicit reason.", fields: [field("priorityValue", "Business or public value", "How meaningful is the accepted outcome?", "select", options.en.score), field("priorityFrequency", "Frequency", "How often does the same bounded case occur?", "select", options.en.score), field("priorityMeasurable", "Measurability", "Can quality, time, and failures be observed?", "select", options.en.score), field("priorityReversible", "Reversibility", "Can errors be contained and repaired?", "select", options.en.score), field("priorityDifficulty", "Implementation difficulty", "Include data, integration, change, and oversight.", "select", options.en.score)] },
    { code: "4", title: "Risk and legal route", short: "Find the hard boundaries", question: "What harm, data, rights, and legal routes change the release conditions?", why: "Use pattern, autonomy, impact, data, sector, and jurisdiction are separate questions.", evidence: "Risk orientation and separate Swiss or EU qualification questions.", fields: [field("riskImpact", "Potential impact", "Judge the consequence of a wrong or unavailable result.", "select", options.en.impact), field("dataSensitivity", "Data sensitivity", "Classify the most sensitive data in scope.", "select", options.en.data), field("externalInteraction", "Direct interaction with people", "Does a person interact with the AI output or system?", "select", options.en.yesNo), field("automatedDecision", "Automated decision about a person", "Could the system decide or materially determine an outcome?", "select", options.en.yesNo), field("sectorDuty", "Sector or public-law rule to verify", "Name the applicable healthcare, education, finance, infrastructure, cantonal, or public rule. Use 'none identified' only after checking.")] },
    { code: "5", title: "Simplest sufficient system", short: "Design before buying", question: "What is the least complex design that can produce the accepted outcome?", why: "A more autonomous architecture needs stronger evidence and a reason why a simpler system is insufficient.", evidence: "Architecture decision, supplier boundary, approval point, and exit path.", fields: [field("knowledgeSource", "Knowledge source", "Choose the smallest source boundary that can work.", "select", options.en.knowledge), field("externalEffects", "External effects", "State what the system may change.", "select", options.en.effects), field("approvalPoint", "Human approval point", "Name the exact action that waits for approval."), field("supplier", "Supplier and deployment boundary", "Record hosting, subcontractors, retention, and model changes.", "textarea"), field("exitPlan", "Exit and continuity", "How does the work continue if the supplier or model is unavailable?", "textarea")] },
    { code: "6", title: "Evaluations", short: "Write failure first", question: "Which frozen cases and thresholds can disprove readiness?", why: "Tests written after a demo tend to confirm what already looked good.", evidence: "Versioned evaluation set, segments, thresholds, and stop rules.", fields: [field("evaluationCases", "Frozen cases", "Include normal, rare, critical, adversarial, and missing-data cases.", "number"), field("valueFloor", "Minimum value improvement (%)", "Measure accepted outcomes or human time, not model activity.", "number"), field("qualityFloor", "Minimum accepted quality (%)", "Define the review and major-correction budget.", "number"), field("criticalSegments", "Critical segments", "Languages, groups, channels, products, or rare conditions.", "textarea"), field("stopRule", "Critical stop rule", "One critical unauthorized or unsafe effect should be enough.", "textarea")] },
    { code: "7", title: "Security controls", short: "Build the control set", question: "Which protections are required by this exact design?", why: "Security depends on data, trust boundaries, tools, effects, autonomy, and use pattern, not on a generic checklist.", evidence: "Conditioned control list with an owner and verification method for each item.", fields: [] },
    { code: "8", title: "Pilot", short: "Move in bounded stages", question: "What can be observed safely before any real effect is allowed?", why: "Offline and no-effect stages expose failures without turning users into test subjects.", evidence: "Frozen, no-effect, and bounded-live stages with named stop authority.", fields: [field("pilotOwner", "Pilot owner", "This person can pause collection and operation."), field("pilotBoundary", "Eligible live boundary", "Describe the exact population and allowed effects.", "textarea"), field("pilotWindow", "Observation window", "Use dates or a case-count target."), field("pilotFallback", "Tested manual continuity", "Describe how pending and new cases return safely.", "textarea")] },
    { code: "9", title: "Decision", short: "Let the weakest result decide", question: "Do value, quality, safety, traceability, and eligibility support one next action?", why: "A strong average cannot cancel a critical failure or missing evidence.", evidence: "Signed continue, rework, stop, or unknown decision with authorized scope.", fields: [field("decisionStatus", "Decision", "Unknown is valid when evidence is incomplete.", "select", options.en.decision), field("decisionRationale", "Evidence-based rationale", "Separate value, quality, safety, trace, and eligibility.", "textarea"), field("authorizedScope", "Authorized next scope", "Do not silently add adjacent tasks or permissions.", "textarea")] },
    { code: "10", title: "Operate and reassess", short: "Keep production reversible", question: "Who monitors, suspends, contains, and re-authorizes the exact version?", why: "A model, data, tool, permission, or policy change reopens the evidence question.", evidence: "Operating card, monitoring windows, incident route, and tested return.", fields: [field("operationOwner", "Operating owner", "Owns quality, value, and the review date."), field("incidentOwner", "Reachable incident owner", "Can disable effects and preserve evidence."), field("monitoringWindow", "Monitoring cadence", "Define the case count or time window."), field("rollbackProof", "Return rehearsal", "Record when containment and manual continuity were tested.", "textarea")] },
    { code: "11", title: "Handoff and retirement", short: "Leave a reconstructable decision", question: "Can a future owner reproduce the decision and safely retire the system?", why: "A project is not governed if its evidence and shutdown path exist only in one person's memory.", evidence: "Decision dossier, evidence references, review date, withdrawal route, and retirement owner.", fields: [field("reviewDate", "Formal review date", "A dated reassessment is mandatory.", "date"), field("evidenceRefs", "Controlled evidence references", "Use stable identifiers or hashes, never raw client data here.", "textarea"), field("retirementOwner", "Retirement owner", "Owns export, deletion, access revocation, and supplier exit."), field("withdrawalPath", "Publication withdrawal route", "Who can correct or withdraw an admitted field report?", "textarea")] },
  ],
  fr: [
    { code: "0", title: "Mandat", short: "Nommer la décision", question: "Quel problème observable mérite d’être changé, et qui peut décider ?", why: "Une demande d’outil sans responsable, limite et date de décision ne peut pas devenir un projet redevable.", evidence: "Mandat validé avec responsable, personnes affectées, limites et date de décision.", fields: [field("project", "Nom de projet non identifiant", "Utilisez un titre de travail neutre."), field("owner", "Responsable redevable", "Nommez un rôle, pas une équipe IA."), field("problem", "Problème observable", "Décrivez l’échec ou le délai actuel, pas l’outil souhaité.", "textarea"), field("affected", "Personnes affectées", "Incluez utilisateurs, clients, travailleurs, bénéficiaires ou public."), field("decisionDate", "Date de décision", "Quand faudra-t-il continuer, corriger ou arrêter ?", "date")] },
    { code: "1", title: "Situation initiale", short: "Mesurer avant l’IA", question: "Que se passe-t-il aujourd’hui sur l’ensemble de la charge ?", why: "Sans dénominateur et résultat actuel, la vitesse d’une tâche peut être confondue avec la valeur métier.", evidence: "Situation initiale datée avec volume, temps humain, résultat, erreurs et exclusions.", fields: [field("baselineVolume", "Cas par mois", "Comptez toutes les demandes, y compris le travail exclu.", "number"), field("baselineMinutes", "Minutes humaines par cas", "Utilisez si possible le temps actif observé.", "number"), field("baselineOutcome", "Unité de réussite actuelle", "Exemple : devis accepté, demande résolue, dossier complet."), field("baselineErrors", "Taux actuel d’erreur ou de reprise (%)", "Gardez la même définition pendant le pilote.", "number")] },
    { code: "2", title: "Cartographie du travail", short: "Voir le vrai processus", question: "Où circulent réellement les données, décisions, exceptions et temps d’attente ?", why: "L’automatisation échoue souvent aux transmissions et exceptions qu’une démonstration omet.", evidence: "Carte actuelle de l’entrée au résultat accepté, exceptions comprises.", fields: [field("workInput", "Entrée", "Qu’est-ce qui déclenche un cas ?"), field("workSystems", "Systèmes et personnes", "Qui ou quoi intervient sur le cas ?", "textarea"), field("workData", "Données utilisées", "Listez les sources et les frontières d’accès.", "textarea"), field("workDecision", "Décisions humaines", "Quel jugement ou quelle approbation reste humain ?", "textarea"), field("workExceptions", "Exceptions", "Nommez les cas manquants, ambigus, rares ou interdits.", "textarea"), field("workOutput", "Résultat accepté", "Quel résultat terminé compte ?", "textarea")] },
    { code: "3", title: "Priorisation", short: "Choisir un cas utile", question: "Ce cas est-il assez utile, fréquent, mesurable, réversible et faisable pour être testé ?", why: "Valeur et difficulté doivent rester séparées. Une démonstration spectaculaire peut être un mauvais premier pilote.", evidence: "Score comparable et cas retenu avec une raison explicite.", fields: [field("priorityValue", "Valeur métier ou publique", "Quelle est l’importance du résultat accepté ?", "select", options.fr.score), field("priorityFrequency", "Fréquence", "À quelle fréquence le même cas borné se présente-t-il ?", "select", options.fr.score), field("priorityMeasurable", "Mesurabilité", "Peut-on observer qualité, temps et échecs ?", "select", options.fr.score), field("priorityReversible", "Réversibilité", "Les erreurs peuvent-elles être contenues et réparées ?", "select", options.fr.score), field("priorityDifficulty", "Difficulté de mise en œuvre", "Incluez données, intégration, changement et supervision.", "select", options.fr.score)] },
    { code: "4", title: "Risque et route juridique", short: "Trouver les limites fermes", question: "Quels dommages, données, droits et routes juridiques modifient les conditions de mise en service ?", why: "Mode d’usage, autonomie, impact, données, secteur et territoire sont des questions distinctes.", evidence: "Orientation du risque et questions séparées de qualification suisse ou européenne.", fields: [field("riskImpact", "Impact possible", "Jugez la conséquence d’un résultat faux ou indisponible.", "select", options.fr.impact), field("dataSensitivity", "Sensibilité des données", "Classez la donnée la plus sensible du périmètre.", "select", options.fr.data), field("externalInteraction", "Interaction directe avec des personnes", "Une personne interagit-elle avec le système ou sa sortie ?", "select", options.fr.yesNo), field("automatedDecision", "Décision automatisée sur une personne", "Le système peut-il décider ou déterminer matériellement un résultat ?", "select", options.fr.yesNo), field("sectorDuty", "Règle sectorielle ou de droit public à vérifier", "Nommez la règle santé, éducation, finance, infrastructure, cantonale ou publique. Écrivez 'aucune identifiée' seulement après vérification.")] },
    { code: "5", title: "Système suffisant le plus simple", short: "Concevoir avant d’acheter", question: "Quelle est l’architecture la moins complexe capable de produire le résultat accepté ?", why: "Une architecture plus autonome exige davantage de preuves et une raison pour laquelle un système plus simple ne suffit pas.", evidence: "Décision d’architecture, frontière fournisseur, approbation et voie de sortie.", fields: [field("knowledgeSource", "Source de connaissance", "Choisissez la plus petite frontière qui peut fonctionner.", "select", options.fr.knowledge), field("externalEffects", "Effets externes", "Indiquez ce que le système peut modifier.", "select", options.fr.effects), field("approvalPoint", "Point d’approbation humaine", "Nommez l’action exacte qui attend une approbation."), field("supplier", "Fournisseur et frontière de déploiement", "Consignez hébergement, sous-traitants, conservation et changements de modèle.", "textarea"), field("exitPlan", "Sortie et continuité", "Comment le travail continue-t-il si le fournisseur ou le modèle est indisponible ?", "textarea")] },
    { code: "6", title: "Évaluations", short: "Écrire l’échec d’abord", question: "Quels cas figés et seuils peuvent démontrer que le système n’est pas prêt ?", why: "Les tests écrits après une démonstration tendent à confirmer ce qui semblait déjà fonctionner.", evidence: "Jeu d’évaluation versionné, segments, seuils et règles d’arrêt.", fields: [field("evaluationCases", "Cas figés", "Incluez cas normaux, rares, critiques, adversariaux et données manquantes.", "number"), field("valueFloor", "Amélioration minimale de valeur (%)", "Mesurez résultat accepté ou temps humain, pas l’activité du modèle.", "number"), field("qualityFloor", "Qualité acceptée minimale (%)", "Définissez la revue et le budget de corrections majeures.", "number"), field("criticalSegments", "Segments critiques", "Langues, groupes, canaux, produits ou situations rares.", "textarea"), field("stopRule", "Règle d’arrêt critique", "Un seul effet critique non autorisé ou dangereux doit pouvoir suffire.", "textarea")] },
    { code: "7", title: "Contrôles de sécurité", short: "Construire les protections", question: "Quelles protections sont imposées par cette architecture précise ?", why: "La sécurité dépend des données, frontières de confiance, outils, effets, autonomie et modes d’usage, pas d’une liste générique.", evidence: "Liste conditionnelle avec responsable et méthode de vérification pour chaque contrôle.", fields: [] },
    { code: "8", title: "Pilote", short: "Avancer par étapes bornées", question: "Que peut-on observer sans risque avant d’autoriser un effet réel ?", why: "Les étapes hors ligne et sans effet révèlent les échecs sans transformer les usagers en sujets de test.", evidence: "Étapes figées, sans effet et réelles bornées avec autorité d’arrêt nommée.", fields: [field("pilotOwner", "Responsable du pilote", "Cette personne peut suspendre la collecte et l’exploitation."), field("pilotBoundary", "Périmètre réel éligible", "Décrivez la population exacte et les effets autorisés.", "textarea"), field("pilotWindow", "Fenêtre d’observation", "Utilisez des dates ou un objectif de nombre de cas."), field("pilotFallback", "Continuité manuelle testée", "Décrivez comment les cas en attente et nouveaux reviennent en sécurité.", "textarea")] },
    { code: "9", title: "Décision", short: "Laisser le résultat le plus faible décider", question: "Valeur, qualité, sécurité, traces et éligibilité soutiennent-elles une seule prochaine action ?", why: "Une bonne moyenne n’annule ni un échec critique ni des preuves manquantes.", evidence: "Décision signée de continuer, corriger, arrêter ou attendre, avec périmètre autorisé.", fields: [field("decisionStatus", "Décision", "L’absence de décision est valide lorsque les preuves sont incomplètes.", "select", options.fr.decision), field("decisionRationale", "Justification fondée sur les preuves", "Séparez valeur, qualité, sécurité, traces et éligibilité.", "textarea"), field("authorizedScope", "Prochain périmètre autorisé", "N’ajoutez pas silencieusement de tâche ou permission voisine.", "textarea")] },
    { code: "10", title: "Exploitation et réévaluation", short: "Garder la production réversible", question: "Qui surveille, suspend, contient et réautorise la version exacte ?", why: "Un changement de modèle, données, outil, permission ou règle rouvre la question des preuves.", evidence: "Fiche d’exploitation, fenêtres de suivi, voie d’incident et retour testé.", fields: [field("operationOwner", "Responsable d’exploitation", "Possède qualité, valeur et date de revue."), field("incidentOwner", "Responsable d’incident joignable", "Peut désactiver les effets et préserver les preuves."), field("monitoringWindow", "Cadence de surveillance", "Définissez le nombre de cas ou la fenêtre temporelle."), field("rollbackProof", "Exercice de retour", "Consignez quand le confinement et la continuité manuelle ont été testés.", "textarea")] },
    { code: "11", title: "Transmission et retrait", short: "Laisser une décision reconstructible", question: "Un futur responsable peut-il reproduire la décision et retirer le système en sécurité ?", why: "Un projet n’est pas gouverné si ses preuves et sa voie d’arrêt n’existent que dans la mémoire d’une personne.", evidence: "Dossier de décision, références, date de revue, voie de retrait et responsable de fin de vie.", fields: [field("reviewDate", "Date de revue formelle", "Une réévaluation datée est obligatoire.", "date"), field("evidenceRefs", "Références des preuves contrôlées", "Utilisez identifiants ou empreintes, jamais de données clients brutes ici.", "textarea"), field("retirementOwner", "Responsable du retrait", "Possède export, suppression, révocation des accès et sortie fournisseur."), field("withdrawalPath", "Voie de retrait d’une publication", "Qui peut corriger ou retirer un rapport terrain admis ?", "textarea")] },
  ],
};

const requiredByPhase = [
  ["project", "owner", "problem", "affected", "decisionDate"],
  ["baselineVolume", "baselineMinutes", "baselineOutcome", "baselineErrors"],
  ["workInput", "workSystems", "workData", "workDecision", "workExceptions", "workOutput"],
  ["priorityValue", "priorityFrequency", "priorityMeasurable", "priorityReversible", "priorityDifficulty"],
  ["riskImpact", "dataSensitivity", "externalInteraction", "automatedDecision", "sectorDuty"],
  ["knowledgeSource", "externalEffects", "approvalPoint", "supplier", "exitPlan"],
  ["evaluationCases", "valueFloor", "qualityFloor", "criticalSegments", "stopRule"],
  [],
  ["pilotOwner", "pilotBoundary", "pilotWindow", "pilotFallback"],
  ["decisionStatus", "decisionRationale", "authorizedScope"],
  ["operationOwner", "incidentOwner", "monitoringWindow", "rollbackProof"],
  ["reviewDate", "evidenceRefs", "retirementOwner", "withdrawalPath"],
];

const ui = {
  en: { eyebrow: "INTERACTIVE LIFECYCLE", title: "Work through phases 0 to 11 without opening everything at once.", text: "Your entries can be saved in this browser and resumed later. Use non-identifying working information only. The workbench guides a decision; it does not certify compliance.", complete: "phases complete", current: "Current phase", why: "Why this matters", keep: "Evidence to keep", matched: "Controls already matched", noControls: "Complete the risk questions to refine the control list.", previous: "Previous phase", next: "Next phase", done: "Review the plan", copy: "Copy the working plan", copied: "Working plan copied", incomplete: "Complete the required fields to mark this phase ready.", ready: "Minimum record complete for this phase.", priority: "Priority orientation", hours: "Current human hours per month", risk: "Risk orientation", architecture: "Smallest plausible design", routes: "Questions to verify", security: "Confirm every conditioned control", local: "Local project dossier" },
  fr: { eyebrow: "CYCLE DE VIE INTERACTIF", title: "Parcourez les phases 0 à 11 sans tout ouvrir en même temps.", text: "Vos saisies peuvent être enregistrées dans ce navigateur et reprises plus tard. Utilisez seulement des informations de travail non identifiantes. L’atelier guide une décision ; il ne certifie aucune conformité.", complete: "phases complètes", current: "Phase actuelle", why: "Pourquoi c’est important", keep: "Preuve à conserver", matched: "Contrôles déjà associés", noControls: "Complétez les questions de risque pour affiner la liste de contrôles.", previous: "Phase précédente", next: "Phase suivante", done: "Relire le plan", copy: "Copier le plan de travail", copied: "Plan de travail copié", incomplete: "Complétez les champs requis pour rendre cette phase prête.", ready: "Enregistrement minimal complet pour cette phase.", priority: "Orientation de priorité", hours: "Heures humaines actuelles par mois", risk: "Orientation du risque", architecture: "Architecture minimale plausible", routes: "Questions à vérifier", security: "Confirmez chaque contrôle conditionnel", local: "Dossier projet local" },
};

const dossierUi = {
  en: {
    title: "Resume this project later",
    text: "Answers and selected controls are saved only in this browser. Export the JSON file to move or back up the working dossier.",
    saved: "Saved locally",
    notSaved: "Not saved yet",
    saveError: "Local save failed. Export the dossier before leaving this page.",
    resumed: "Local dossier resumed.",
    migrated: "Older dossier updated to the current project-record format.",
    imported: "Dossier imported and guide context restored.",
    removed: "Local copy removed. A new blank dossier is ready.",
    invalid: "This file is not a compatible project dossier. Your current work was not changed.",
    tooLarge: "This file is too large. Project dossiers must stay below 2 MB.",
    export: "Export JSON",
    import: "Import JSON",
    remove: "Start a new dossier",
    schema: "View the JSON Schema",
    boundary: "Do not enter raw client evidence, secrets, or identifying personal data. Browser storage is not an authorized evidence repository.",
    lastSaved: "Last local save",
    draft: "WORKING DRAFT",
  },
  fr: {
    title: "Reprendre ce projet plus tard",
    text: "Les réponses et contrôles sélectionnés sont enregistrés uniquement dans ce navigateur. Exportez le fichier JSON pour déplacer ou sauvegarder le dossier de travail.",
    saved: "Enregistré localement",
    notSaved: "Pas encore enregistré",
    saveError: "L’enregistrement local a échoué. Exportez le dossier avant de quitter cette page.",
    resumed: "Dossier local repris.",
    migrated: "Ancien dossier mis à jour vers le format actuel des documents projet.",
    imported: "Dossier importé et contexte du guide restauré.",
    removed: "Copie locale supprimée. Un nouveau dossier vide est prêt.",
    invalid: "Ce fichier n’est pas un dossier projet compatible. Votre travail actuel n’a pas été modifié.",
    tooLarge: "Ce fichier est trop volumineux. Un dossier projet doit rester inférieur à 2 Mo.",
    export: "Exporter le JSON",
    import: "Importer un JSON",
    remove: "Créer un nouveau dossier",
    schema: "Voir le schéma JSON",
    boundary: "Ne saisissez aucune preuve client brute, aucun secret ni aucune donnée personnelle identifiante. Le stockage du navigateur n’est pas un dépôt de preuves autorisé.",
    lastSaved: "Dernier enregistrement local",
    draft: "BROUILLON DE TRAVAIL",
  },
};

function number(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function newDossierId() {
  const suffix = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `AAP-${suffix}`;
}

export function LifecycleWorkbench(props: Props) {
  const { locale, onContextImport, onRiskChange } = props;
  const phases = phaseDefinitions[locale];
  const labels = ui[locale];
  const dossierLabels = dossierUi[locale];
  const [activePhase, setActivePhase] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [checkedControls, setCheckedControls] = useState<Record<string, boolean>>({});
  const [artifacts, setArtifacts] = useState<ProjectArtifacts>(() => createEmptyProjectArtifacts());
  const [changeReview, setChangeReview] = useState<ProjectChangeReview | null>(null);
  const [copied, setCopied] = useState(false);
  const [dossierId, setDossierId] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [savedAt, setSavedAt] = useState("");
  const [storageReady, setStorageReady] = useState(false);
  const [hasLocalCopy, setHasLocalCopy] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const [dossierNotice, setDossierNotice] = useState("");
  const importInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const now = new Date().toISOString();
      const startBlank = () => {
        setDossierId(newDossierId());
        setCreatedAt(now);
        setStorageReady(true);
      };
      const stored = window.localStorage.getItem(PROJECT_DOSSIER_STORAGE_KEY);
      if (!stored) {
        startBlank();
        return;
      }
      const parsed = parseProjectDossier(stored);
      if (!parsed.ok) {
        setDossierNotice(dossierUi[locale].invalid);
        startBlank();
        return;
      }
      const accepted = onContextImport({
        audienceId: parsed.value.context.organization_type,
        usePatternId: parsed.value.context.use_pattern,
        jurisdictionId: parsed.value.context.jurisdiction,
        integrationId: parsed.value.context.integration_level,
        autonomy: parsed.value.context.autonomy_level,
        risk: parsed.value.context.risk_level,
      });
      if (!accepted) {
        setDossierNotice(dossierUi[locale].invalid);
        startBlank();
        return;
      }
      setDossierId(parsed.value.dossier_id);
      setCreatedAt(parsed.value.created_at);
      setSavedAt(parsed.value.updated_at);
      setActivePhase(parsed.value.active_phase);
      setValues(parsed.value.fields);
      setCheckedControls(parsed.value.conditioned_controls);
      setArtifacts(parsed.value.artifacts);
      setChangeReview(parsed.value.change_review);
      setHasLocalCopy(true);
      setDossierNotice(parsed.migratedFrom ? dossierUi[locale].migrated : dossierUi[locale].resumed);
      setStorageReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [locale, onContextImport]);

  const priorityComplete = requiredByPhase[3].every((id) => values[id]);
  const priorityScore = priorityComplete
    ? number(values.priorityValue) + number(values.priorityFrequency) + number(values.priorityMeasurable) + number(values.priorityReversible) + (6 - number(values.priorityDifficulty))
    : 0;
  const baselineHours = number(values.baselineVolume) * number(values.baselineMinutes) / 60;
  const riskComplete = requiredByPhase[4].every((id) => values[id]);
  const derivedRisk = useMemo(() => {
    if (!riskComplete) return props.initialRisk;
    let score = values.riskImpact === "high" ? 3 : values.riskImpact === "material" ? 2 : 1;
    if (values.dataSensitivity === "sensitive" || values.automatedDecision === "yes") score += 1;
    if (props.audienceId === "public" && values.riskImpact !== "low") score += 1;
    return Math.min(3, score);
  }, [props.audienceId, props.initialRisk, riskComplete, values.automatedDecision, values.dataSensitivity, values.riskImpact]);

  useEffect(() => {
    if (riskComplete) onRiskChange(derivedRisk);
  }, [derivedRisk, onRiskChange, riskComplete]);

  const legalRoutes = useMemo(() => {
    const rows: string[] = [];
    const bothOrCH = props.jurisdictionId === "CH" || props.jurisdictionId === "BOTH";
    const bothOrEU = props.jurisdictionId === "EU" || props.jurisdictionId === "BOTH";
    if (bothOrCH) rows.push(locale === "en" ? "Switzerland: qualify data processing, direct interaction, automated individual decisions, and applicable cantonal or sector law separately." : "Suisse : qualifier séparément traitement des données, interaction directe, décision individuelle automatisée et droit cantonal ou sectoriel applicable.");
    if (bothOrEU) rows.push(locale === "en" ? "European Union: qualify provider or deployer role, AI Act risk, Article 50 transparency, GDPR, and any high-risk duties separately." : "Union européenne : qualifier séparément rôle de fournisseur ou déployeur, risque AI Act, transparence de l’article 50, RGPD et éventuelles obligations à haut risque.");
    if (values.automatedDecision === "yes") rows.push(locale === "en" ? "Do not release until qualified human review, information, explanation, and recourse duties are recorded." : "Ne pas mettre en service avant d’avoir consigné revue humaine qualifiée, information, explication et voie de recours.");
    if (values.externalInteraction === "yes") rows.push(locale === "en" ? "Record how people are informed that they interact with AI and how they reach a person." : "Consignez comment les personnes sont informées de l’interaction avec une IA et comment elles joignent une personne.");
    return rows;
  }, [locale, props.jurisdictionId, values.automatedDecision, values.externalInteraction]);

  const architecture = useMemo(() => {
    if (props.integrationId === "agency") return locale === "en" ? "Start with one bounded business agent. Add orchestration only after a like-for-like comparison proves a better accepted outcome." : "Commencer par un agent métier borné. Ajouter l’orchestration seulement si une comparaison à travail identique démontre un meilleur résultat accepté.";
    if (props.usePatternId === "retrieval") return locale === "en" ? "Read-only retrieval over controlled, current, access-filtered sources." : "Recherche en lecture seule sur des sources contrôlées, actuelles et filtrées par droits d’accès.";
    if (props.usePatternId === "prediction") return locale === "en" ? "A conventional predictive model with calibrated errors and a non-AI operating path." : "Un modèle prédictif classique avec erreurs calibrées et voie d’exploitation sans IA.";
    if (props.usePatternId === "classification") return locale === "en" ? "Structured extraction or classification with confidence and explicit abstention." : "Extraction ou classification structurée avec confiance et abstention explicite.";
    if (props.usePatternId === "multimodal") return locale === "en" ? "A bounded multimodal processor with file validation and human review." : "Un traitement multimodal borné avec validation des fichiers et revue humaine.";
    if (props.usePatternId === "conversation") return locale === "en" ? "A disclosed assistant with supported answers and reliable human handoff." : "Un assistant déclaré comme IA, avec réponses fondées et transfert humain fiable.";
    if (props.usePatternId === "agentic" || props.integrationId === "agent") return locale === "en" ? "One bounded agent with approved tools, least privilege, approval, effect read-back, and tested return." : "Un agent borné avec outils approuvés, moindre privilège, approbation, relecture des effets et retour testé.";
    return locale === "en" ? "One structured model call with human review and no external effect." : "Un appel de modèle structuré avec revue humaine et aucun effet externe.";
  }, [locale, props.integrationId, props.usePatternId]);

  const securityControls = useMemo(() => {
    const rows = [
      { id: "SEC-OWNER", en: "Named owner and separate user identities", fr: "Responsable nommé et identités utilisateurs séparées" },
      { id: "SEC-DATA", en: "Documented data boundary, retention, and deletion", fr: "Frontière des données, conservation et suppression documentées" },
      { id: "SEC-VERSION", en: "Versioned model, instructions, sources, tools, and policy", fr: "Modèle, instructions, sources, outils et règles versionnés" },
      { id: "SEC-TRACE", en: "Logs sufficient to reconstruct decisions and effects", fr: "Journaux suffisants pour reconstruire décisions et effets" },
    ];
    if (values.dataSensitivity === "personal" || values.dataSensitivity === "sensitive") rows.push({ id: "SEC-SENSITIVE", en: "Minimization, access review, encryption, and supplier-use limits", fr: "Minimisation, revue des accès, chiffrement et limites d’usage fournisseur" });
    if (values.externalInteraction === "yes" || props.usePatternId === "conversation") rows.push({ id: "SEC-INTERACTION", en: "Abuse controls, rate limits, AI notice, and reliable human handoff", fr: "Contrôles d’abus, limites de débit, information IA et transfert humain fiable" });
    if (values.knowledgeSource === "retrieval" || props.usePatternId === "retrieval") rows.push({ id: "SEC-RETRIEVAL", en: "Source authorization, freshness, provenance, poisoning, and citation tests", fr: "Tests d’autorisation, actualité, provenance, empoisonnement et citation des sources" });
    if (props.usePatternId === "prediction") rows.push({ id: "SEC-PREDICTION", en: "Calibration, drift, subgroup, override, and feedback-loop controls", fr: "Contrôles de calibration, dérive, sous-groupes, dérogation et boucle de rétroaction" });
    if (props.usePatternId === "multimodal") rows.push({ id: "SEC-MULTIMODAL", en: "File validation, malware scanning, modality quality, rights, and accessibility", fr: "Validation des fichiers, analyse antimalware, qualité par modalité, droits et accessibilité" });
    if ((values.externalEffects && values.externalEffects !== "none") || props.integrationId !== "copilot" || props.usePatternId === "agentic") {
      rows.push({ id: "SEC-ACTION", en: "Tool allowlist, least privilege, destination binding, approval, and action limits", fr: "Liste d’outils autorisés, moindre privilège, destination liée, approbation et limites d’action" });
      rows.push({ id: "SEC-EFFECT", en: "Idempotency, effect receipt, external read-back, stop, and tested return", fr: "Idempotence, reçu d’effet, relecture externe, arrêt et retour testé" });
    }
    if (props.integrationId === "agency") rows.push({ id: "SEC-AGENCY", en: "Coordinator limits, specialist isolation, guardian veto, loop and cost bounds", fr: "Limites de l’orchestrateur, isolation des spécialistes, blocage du gardien, bornes de boucle et de coût" });
    if (derivedRisk >= 2) rows.push({ id: "SEC-INDEPENDENT", en: "Independent review, critical segments, adversarial tests, and incident rehearsal", fr: "Revue indépendante, segments critiques, tests adversariaux et exercice d’incident" });
    return rows.map((row) => ({ id: row.id, label: row[locale] }));
  }, [derivedRisk, locale, props.integrationId, props.usePatternId, values.dataSensitivity, values.externalEffects, values.externalInteraction, values.knowledgeSource]);

  const phaseReady = phases.map((_, index) => index === 7
    ? securityControls.every((control) => checkedControls[control.id])
    : requiredByPhase[index].every((id) => values[id]?.trim()));
  const completedCount = phaseReady.filter(Boolean).length;
  const completedPhases = phaseReady.flatMap((ready, index) => ready ? [index] : []);
  const completedPhaseKey = completedPhases.join(",");
  const matchedControlKey = [...new Set(props.matchedControls.map((control) => control.id))].sort().join(",");
  const conditionedControls = useMemo(() => Object.fromEntries(securityControls.map((control) => [control.id, checkedControls[control.id] ?? false])), [checkedControls, securityControls]);
  const securityControlKey = securityControls.map((control) => control.id).join(",");
  const resolvedArtifacts = useMemo(() => materializeProjectArtifacts(artifacts, {
    values,
    completed_phases: completedPhaseKey ? completedPhaseKey.split(",").map(Number) : [],
    conditioned_controls: conditionedControls,
    security_control_ids: securityControlKey ? securityControlKey.split(",") : [],
    matched_control_ids: matchedControlKey ? matchedControlKey.split(",") : [],
  }), [artifacts, completedPhaseKey, conditionedControls, matchedControlKey, securityControlKey, values]);
  const currentSnapshot = useMemo(() => createProjectSnapshot({
    context: {
      organization_type: props.audienceId,
      use_pattern: props.usePatternId,
      jurisdiction: props.jurisdictionId,
      integration_level: props.integrationId,
      autonomy_level: props.autonomy,
      risk_level: derivedRisk,
    },
    fields: values,
    conditioned_controls: conditionedControls,
    matched_control_ids: matchedControlKey ? matchedControlKey.split(",") : [],
    completed_phases: completedPhaseKey ? completedPhaseKey.split(",").map(Number) : [],
    artifacts: resolvedArtifacts,
  }), [completedPhaseKey, conditionedControls, derivedRisk, matchedControlKey, props.audienceId, props.autonomy, props.integrationId, props.jurisdictionId, props.usePatternId, resolvedArtifacts, values]);
  const resolvedChangeReview = useMemo(() => materializeProjectChangeReview(changeReview, currentSnapshot), [changeReview, currentSnapshot]);
  const fieldCatalog = useMemo(() => Object.fromEntries(phases.flatMap((phase, phaseIndex) => phase.fields.map((item) => [item.id, { label: item.label, phase: phaseIndex }]))), [phases]);
  const current = phases[activePhase];
  const controlsForPhase = props.matchedControls.filter((control) => control.phases.includes(activePhase));

  useEffect(() => {
    if (!storageReady || !hasLocalCopy || !dossierId || !createdAt) return;
    const timer = window.setTimeout(() => {
      const updatedAt = new Date().toISOString();
      const dossier = buildProjectDossier({
        dossier_id: dossierId,
        created_at: createdAt,
        updated_at: updatedAt,
        language: locale,
        context: {
          organization_type: props.audienceId,
          use_pattern: props.usePatternId,
          jurisdiction: props.jurisdictionId,
          integration_level: props.integrationId,
          autonomy_level: props.autonomy,
          risk_level: derivedRisk,
        },
        active_phase: activePhase,
        fields: values,
        conditioned_controls: conditionedControls,
        matched_control_ids: matchedControlKey ? matchedControlKey.split(",") : [],
        completed_phases: completedPhaseKey ? completedPhaseKey.split(",").map(Number) : [],
        artifacts: resolvedArtifacts,
        change_review: resolvedChangeReview,
      });
      try {
        window.localStorage.setItem(PROJECT_DOSSIER_STORAGE_KEY, JSON.stringify(dossier));
        setSavedAt(updatedAt);
        setSaveFailed(false);
      } catch {
        setSaveFailed(true);
      }
    }, 150);
    return () => window.clearTimeout(timer);
  }, [activePhase, completedPhaseKey, conditionedControls, createdAt, derivedRisk, dossierId, hasLocalCopy, locale, matchedControlKey, props.audienceId, props.autonomy, props.integrationId, props.jurisdictionId, props.usePatternId, resolvedArtifacts, resolvedChangeReview, storageReady, values]);

  const update = (id: string, value: string) => {
    setValues((previous) => ({ ...previous, [id]: value }));
    setHasLocalCopy(true);
    setDossierNotice("");
    setCopied(false);
  };

  const selectPhase = (phase: number) => {
    setActivePhase(phase);
    if (Object.keys(values).length > 0 || Object.keys(checkedControls).length > 0) setHasLocalCopy(true);
  };

  const currentDossier = () => buildProjectDossier({
    dossier_id: dossierId || newDossierId(),
    created_at: createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
    language: locale,
    context: {
      organization_type: props.audienceId,
      use_pattern: props.usePatternId,
      jurisdiction: props.jurisdictionId,
      integration_level: props.integrationId,
      autonomy_level: props.autonomy,
      risk_level: derivedRisk,
    },
    active_phase: activePhase,
    fields: values,
    conditioned_controls: conditionedControls,
    matched_control_ids: props.matchedControls.map((control) => control.id),
    completed_phases: completedPhases,
    artifacts: resolvedArtifacts,
    change_review: resolvedChangeReview,
  });

  const exportDossier = () => {
    const dossier = currentDossier();
    const blob = new Blob([`${JSON.stringify(dossier, null, 2)}\n`], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const projectSlug = (values.project || dossier.dossier_id).normalize("NFKD").replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase().slice(0, 60) || "project";
    anchor.href = url;
    anchor.download = `ai-adoption-project-${projectSlug}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const importDossier = async (file: File | undefined) => {
    if (!file) return;
    try {
      if (file.size > 2_000_000) {
        setDossierNotice(dossierLabels.tooLarge);
        return;
      }
      const parsed = parseProjectDossier(await file.text());
      if (!parsed.ok) {
        setDossierNotice(dossierLabels.invalid);
        return;
      }
      const accepted = onContextImport({
        audienceId: parsed.value.context.organization_type,
        usePatternId: parsed.value.context.use_pattern,
        jurisdictionId: parsed.value.context.jurisdiction,
        integrationId: parsed.value.context.integration_level,
        autonomy: parsed.value.context.autonomy_level,
        risk: parsed.value.context.risk_level,
      });
      if (!accepted) {
        setDossierNotice(dossierLabels.invalid);
        return;
      }
      setDossierId(parsed.value.dossier_id);
      setCreatedAt(parsed.value.created_at);
      setSavedAt(parsed.value.updated_at);
      setActivePhase(parsed.value.active_phase);
      setValues(parsed.value.fields);
      setCheckedControls(parsed.value.conditioned_controls);
      setArtifacts(parsed.value.artifacts);
      setChangeReview(parsed.value.change_review);
      setHasLocalCopy(true);
      setDossierNotice(parsed.migratedFrom ? dossierLabels.migrated : dossierLabels.imported);
      setSaveFailed(false);
    } catch {
      setDossierNotice(dossierLabels.invalid);
    } finally {
      if (importInput.current) importInput.current.value = "";
    }
  };

  const resetDossier = () => {
    const now = new Date().toISOString();
    window.localStorage.removeItem(PROJECT_DOSSIER_STORAGE_KEY);
    setDossierId(newDossierId());
    setCreatedAt(now);
    setSavedAt("");
    setActivePhase(0);
    setValues({});
    setCheckedControls({});
    setArtifacts(createEmptyProjectArtifacts());
    setChangeReview(null);
    setHasLocalCopy(false);
    setSaveFailed(false);
    setCopied(false);
    setDossierNotice(dossierLabels.removed);
  };

  const copyPlan = async () => {
    const lines = [
      locale === "en" ? "AI ADOPTION LIFECYCLE WORKING PLAN" : "PLAN DE TRAVAIL DU CYCLE DE VIE IA",
      `${props.audienceLabel} · ${props.usePatternLabel} · ${props.integrationLabel} · ${props.jurisdictionLabel} · R${derivedRisk} × A${props.autonomy}`,
      "",
      ...phases.flatMap((phase, index) => [
        `${phase.code}. ${phase.title} · ${phaseReady[index] ? "COMPLETE" : "INCOMPLETE"}`,
        ...phase.fields.filter((item) => values[item.id]).map((item) => `- ${item.label}: ${values[item.id]}`),
        ...(index === 7 ? securityControls.map((control) => `- [${checkedControls[control.id] ? "x" : " "}] ${control.id}: ${control.label}`) : []),
        "",
      ]),
      locale === "en" ? "Boundary: this working summary contains no certification and should contain no raw client data or secrets." : "Limite : cette synthèse de travail ne constitue pas une certification et ne doit contenir aucune donnée client brute ni secret.",
    ];
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
  };

  const priorityLabel = priorityScore >= 19
    ? (locale === "en" ? "Strong first-pilot candidate" : "Bon candidat pour un premier pilote")
    : priorityScore >= 15
      ? (locale === "en" ? "Compare with simpler alternatives" : "Comparer à des options plus simples")
      : (locale === "en" ? "Reframe before investing" : "Recadrer avant d’investir");

  return (
    <div className="lifecycle-workbench" id="lifecycle-workbench">
      <header className="lifecycle-head">
        <div><p className="eyebrow">{labels.eyebrow}</p><h3>{labels.title}</h3><p>{labels.text}</p></div>
        <output aria-live="polite"><strong>{completedCount}/12</strong><span>{labels.complete}</span><small>R{derivedRisk} × A{props.autonomy}</small></output>
      </header>

      <nav aria-label={locale === "en" ? "Lifecycle phases" : "Phases du cycle de vie"} className="lifecycle-nav">
        {phases.map((phase, index) => <button aria-current={activePhase === index ? "step" : undefined} data-complete={phaseReady[index]} data-phase={phase.code} key={phase.code} onClick={() => selectPhase(index)} type="button"><span>{phase.code}</span><strong>{phase.title}</strong><small>{phase.short}</small></button>)}
      </nav>

      <div className="lifecycle-context" aria-label={locale === "en" ? "Current context" : "Contexte actuel"}>
        <p><span>{locale === "en" ? "Organization" : "Structure"}</span><strong>{props.audienceLabel}</strong></p>
        <p><span>{locale === "en" ? "Use pattern" : "Mode d’usage"}</span><strong>{props.usePatternLabel}</strong></p>
        <p><span>{locale === "en" ? "Integration" : "Intégration"}</span><strong>{props.integrationLabel}</strong></p>
        <p><span>{locale === "en" ? "Route" : "Territoire"}</span><strong>{props.jurisdictionLabel}</strong></p>
      </div>

      <section aria-labelledby="lifecycle-phase-title" className="lifecycle-phase" data-phase={current.code}>
        <header><div><span>{labels.current} · {current.code}/11</span><h4 id="lifecycle-phase-title">{current.title}</h4><p>{current.question}</p></div><details><summary aria-label={labels.why}>?</summary><div role="note"><strong>{labels.why}</strong><p>{current.why}</p></div></details></header>

        {activePhase !== 7 && <div className="lifecycle-fields">{current.fields.map((item) => <label key={item.id}><span>{item.label}</span>{item.kind === "textarea"
          ? <textarea name={item.id} onChange={(event) => update(item.id, event.target.value)} rows={3} value={values[item.id] ?? ""} />
          : item.kind === "select"
            ? <select name={item.id} onChange={(event) => update(item.id, event.target.value)} value={values[item.id] ?? ""}><option value="">{locale === "en" ? "Choose" : "Choisir"}</option>{item.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
            : <input min={item.kind === "number" ? "0" : undefined} name={item.id} onChange={(event) => update(item.id, event.target.value)} type={item.kind} value={values[item.id] ?? ""} />}
          <small>{item.help}</small></label>)}</div>}

        {activePhase === 3 && priorityComplete && <output className="lifecycle-result"><span>{labels.priority}</span><strong>{priorityScore}/25</strong><p>{priorityLabel}. {locale === "en" ? "This is an orientation, not a business case." : "Il s’agit d’une orientation, pas d’un dossier économique."}</p></output>}
        {activePhase === 1 && baselineHours > 0 && <output className="lifecycle-result"><span>{labels.hours}</span><strong>{baselineHours.toFixed(1)} h</strong><p>{locale === "en" ? "Keep the complete denominator when calculating any later reduction." : "Conservez le dénominateur complet pour calculer toute réduction ultérieure."}</p></output>}
        {activePhase === 4 && riskComplete && <div className="lifecycle-guidance"><output><span>{labels.risk}</span><strong>R{derivedRisk}</strong></output><div><p>{labels.routes}</p><ul>{legalRoutes.map((row) => <li key={row}>{row}</li>)}</ul></div></div>}
        {activePhase === 5 && <output className="lifecycle-result"><span>{labels.architecture}</span><strong>{props.usePatternLabel} · {props.integrationLabel}</strong><p>{architecture}</p></output>}
        {activePhase === 7 && <fieldset className="security-builder"><legend>{labels.security}</legend>{securityControls.map((control) => <label key={control.id}><input checked={checkedControls[control.id] ?? false} name={control.id} onChange={(event) => { setCheckedControls((previous) => ({ ...previous, [control.id]: event.target.checked })); setHasLocalCopy(true); setDossierNotice(""); }} type="checkbox" /><span><strong>{control.id}</strong>{control.label}</span></label>)}</fieldset>}

        <div className="lifecycle-evidence"><article><span>{labels.keep}</span><p>{current.evidence}</p></article><article><span>{labels.matched}</span>{controlsForPhase.length > 0 ? <ul>{controlsForPhase.map((control) => <li key={control.id}><strong>{control.id}</strong><span>{control.title}</span><small>{control.priority}</small></li>)}</ul> : <p>{labels.noControls}</p>}</article></div>

        <footer><p data-ready={phaseReady[activePhase]}>{phaseReady[activePhase] ? labels.ready : labels.incomplete}</p><div><button disabled={activePhase === 0} onClick={() => selectPhase(Math.max(0, activePhase - 1))} type="button">← {labels.previous}</button><button onClick={() => selectPhase(Math.min(11, activePhase + 1))} type="button">{activePhase === 11 ? labels.done : labels.next} →</button></div></footer>
      </section>

      <ProjectArtifactsWorkbench
        artifacts={resolvedArtifacts}
        jurisdictionLabel={props.jurisdictionLabel}
        locale={locale}
        matchedControls={props.matchedControls}
        onChange={setArtifacts}
        onDirty={() => { setHasLocalCopy(true); setDossierNotice(""); }}
        onOpenPhase={(phase) => { selectPhase(phase); window.requestAnimationFrame(() => document.querySelector(".lifecycle-phase")?.scrollIntoView({ behavior: "smooth", block: "start" })); }}
        phaseTitles={phases.map((phase) => phase.title)}
        securityControls={securityControls.map((control) => ({ ...control, checked: conditionedControls[control.id] }))}
        usePatternId={props.usePatternId}
        usePatternLabel={props.usePatternLabel}
      />

      <ProjectChangeReviewWorkbench
        currentSnapshot={currentSnapshot}
        dossierId={dossierId}
        fieldCatalog={fieldCatalog}
        locale={locale}
        matchedControls={props.matchedControls}
        onChange={setChangeReview}
        onDirty={() => { setHasLocalCopy(true); setDossierNotice(""); }}
        onOpenPhase={(phase) => { selectPhase(phase); window.requestAnimationFrame(() => document.querySelector(".lifecycle-phase")?.scrollIntoView({ behavior: "smooth", block: "start" })); }}
        phaseTitles={phases.map((phase) => phase.title)}
        review={resolvedChangeReview}
        securityControls={securityControls}
      />

      <section aria-labelledby="project-dossier-title" className="project-dossier-manager" data-dossier-state={saveFailed ? "error" : hasLocalCopy ? "saved" : "new"}>
        <header><div><p className="eyebrow">{labels.local}</p><h4 id="project-dossier-title">{dossierLabels.title}</h4><p>{dossierLabels.text}</p></div><output aria-live="polite"><strong>{saveFailed ? dossierLabels.saveError : hasLocalCopy ? dossierLabels.saved : dossierLabels.notSaved}</strong><span>{dossierLabels.draft}</span>{savedAt && <small>{dossierLabels.lastSaved}: <time dateTime={savedAt}>{new Intl.DateTimeFormat(locale === "fr" ? "fr-CH" : "en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(savedAt))}</time></small>}</output></header>
        <p className="dossier-boundary">{dossierLabels.boundary}</p>
        {dossierNotice && <p className="dossier-notice" role="status">{dossierNotice}</p>}
        <div className="dossier-actions">
          <button className="button primary" onClick={() => void copyPlan()} type="button">{copied ? labels.copied : labels.copy}</button>
          <button className="button secondary" onClick={exportDossier} type="button">{dossierLabels.export} ↓</button>
          <button className="button secondary" onClick={() => importInput.current?.click()} type="button">{dossierLabels.import} ↑</button>
          <input accept="application/json,.json" aria-label={dossierLabels.import} className="dossier-file-input" onChange={(event) => void importDossier(event.target.files?.[0])} ref={importInput} type="file" />
          <button className="button dossier-reset" onClick={resetDossier} type="button">{dossierLabels.remove}</button>
        </div>
        <a className="dossier-schema" href={props.schemaHref}>{dossierLabels.schema} ↗</a>
      </section>
    </div>
  );
}
