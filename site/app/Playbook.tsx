"use client";

import { useEffect, useMemo, useState } from "react";

type Locale = "en" | "fr";
type AudienceId = "independent" | "tpe" | "pme" | "nonprofit" | "public";
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
const caseRevision = "8e9b2c3ef2109cbbe537c3dbe9011b6599526b01";
const phase = (rows: string[][]): Phase[] => rows.map(([label, title, text]) => ({ label, title, text }));

const copy = {
  en: {
    meta: "FIELD GUIDE · AUGUST 2026",
    nav: ["Integration levels", "Paths", "Method", "Worked cases", "Control level", "Toolkit"],
    heroTitle: "Move from AI interest to a system you can trust.",
    heroText: "Choose one useful problem, prove the value, control the risk, and increase autonomy only when the evidence supports it.",
    start: "Find my starting point",
    methodCta: "See the method",
    rule: "THE RELEASE RULE",
    gates: [["No owner or baseline", "No project"], ["No acceptance thresholds", "No pilot"], ["No separate evidence", "No production"]],
    stats: [["5", "organization paths"], ["8", "ordered steps"], ["3", "non-negotiable gates"]],
    integrationEyebrow: "NAME THE SYSTEM BEFORE QUOTING THE GAIN",
    integrationTitle: "Copilot, business agent, and orchestrated agency are not the same integration.",
    integrationText: "They move different amounts of work, require different permissions, and must be measured with different outcomes. A percentage without its level is misleading.",
    integrationLabels: { system: "What the system does", human: "Human role", planning: "Planning band", flow: "Eligible cases completed end to end" },
    integrationLevels: [
      { code: "A0–A1", title: "Copilot", system: "Researches, extracts, or drafts one step. The person starts the task, carries the context, checks the answer, and performs every external action.", human: "Operator at every cycle", planning: "20–40% less active time · ×1.25–1.7 accepted throughput", flow: "0% without human completion" },
      { code: "A2–A3", title: "Business agent", system: "Receives a bounded case, uses approved tools and memory, follows the workflow, completes eligible cases, and escalates exceptions.", human: "Approver and exception owner", planning: "50–75% less active time · ×2–4 accepted throughput", flow: "50–85% planning range" },
      { code: "A3–A4", title: "Orchestrated agency", system: "An orchestrator delegates to specialist agents for research, execution, quality control, and cross-system coordination under shared controls.", human: "Governor of goals, limits, and exceptions", planning: "80–92% less active time · ×5–12 on a clean bounded workflow", flow: "80–94% on narrow eligible requests" },
    ],
    measurementTitle: "Five numbers that must stay separate",
    measurements: [["01", "Cycle time", "Elapsed time from request to result."], ["02", "Human active time", "Minutes actually spent by a person."], ["03", "Accepted throughput", "Outputs accepted per owner-hour."], ["04", "Straight-through rate", "Eligible cases completed without intervention."], ["05", "Shipped outcome", "A real downstream result—not model activity."]],
    rangeNote: "These are evidence-informed planning bands, not promises or statistical confidence intervals. The high range applies only to eligible, digital, stable workflows. Integration can produce no gain—or a temporary loss—during setup.",
    evidenceLead: "FIELD EVIDENCE AND COUNTER-EVIDENCE",
    evidenceLinks: [["Linde · 24h → 2h", "https://hdsr.mitpress.mit.edu/pub/0mrfxamu/release/3"], ["IBM AskHR · 94% containment", "https://www.ibm.com/case-studies/ibm-askhr"], ["Klarna · SEC filing", "https://www.sec.gov/Archives/edgar/data/2003292/000162828025012824/klarnagroupplcf-1.htm"], ["Remote Labor Index · 2.5%", "https://scale.com/blog/rli"]],
    pathsEyebrow: "START WITH YOUR REALITY",
    pathsTitle: "Choose the structure you are working with.",
    pathsText: "Same method. Different depth of control, evidence, and responsibility.",
    selected: "YOUR STARTING PLAN",
    roles: "Minimum ownership",
    pilot: "Good first pilot",
    controls: "Do not skip",
    fullGuide: "Open the complete guide on GitHub",
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
    caseProblem: "Atelier Horizon receives quotes, breakdowns, billing questions, and complaints in one shared inbox. The goal is deliberately narrow: suggest routing and prepare a draft—never send or update a system.",
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
    soloEyebrow: "COPILOT CASE · INDEPENDENT PROFESSIONAL · A1",
    soloTitle: "Fourteen days to test one useful boundary.",
    soloText: "A small pilot should answer a small decision. Follow an independent consultant from meeting notes to a reviewed follow-up—without connecting email, calendar, or client systems.",
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
    toolkitEyebrow: "USE THE PLAYBOOK",
    toolkitTitle: "Start with a blank decision, not a blank page.",
    toolkitText: "Copy the operational templates, complete the first gate, and keep the evidence with the project.",
    tools: [["Mandate", "Owner, baseline, outcome, and boundaries.", "templates/mandate.fr.md"], ["Use-case card", "Value and difficulty kept separate.", "templates/use-case-card.fr.md"], ["Risk assessment", "Scenarios, controls, and residual risk.", "templates/risk-assessment.fr.md"], ["Evaluation plan", "Metrics, segments, thresholds, and stop rules.", "templates/evaluation-plan.fr.md"], ["Pilot decision", "Value, reliability, and risk judged separately.", "templates/pilot-decision.fr.md"], ["Incident runbook", "Contain, qualify, recover, and learn.", "templates/incident-runbook.fr.md"]],
    sourceTitle: "Dated, primary-source foundation.",
    sourceText: "The playbook links to the official ISO catalogue, NIST AI RMF, OWASP GenAI, MITRE ATLAS, Swiss authorities, and current EU AI Act material. It is an implementation aid—not certification or legal advice.",
    sources: "Review the source register",
    footer: "AI Adoption Playbook · Evidence before autonomy.",
  },
  fr: {
    meta: "GUIDE DE TERRAIN · AOÛT 2026",
    nav: ["Niveaux d’intégration", "Parcours", "Méthode", "Cas d’école", "Contrôles", "Boîte à outils"],
    heroTitle: "Passez de l’intérêt pour l’IA à un système digne de confiance.",
    heroText: "Choisissez un problème utile, prouvez la valeur, maîtrisez le risque et n’augmentez l’autonomie que lorsque les preuves le permettent.",
    start: "Trouver mon point de départ",
    methodCta: "Voir la méthode",
    rule: "LA RÈGLE DE PASSAGE",
    gates: [["Sans responsable ni baseline", "Pas de projet"], ["Sans seuils d’acceptation", "Pas de pilote"], ["Sans preuves séparées", "Pas de production"]],
    stats: [["5", "parcours par structure"], ["8", "étapes ordonnées"], ["3", "gates non négociables"]],
    integrationEyebrow: "NOMMEZ LE SYSTÈME AVANT D’ANNONCER LE GAIN",
    integrationTitle: "Copilote, agent métier et agence orchestrée ne sont pas la même intégration.",
    integrationText: "Ils déplacent des volumes de travail différents, exigent des permissions différentes et se mesurent par des résultats différents. Un pourcentage sans son niveau induit en erreur.",
    integrationLabels: { system: "Ce que fait le système", human: "Rôle humain", planning: "Fourchette de planification", flow: "Cas éligibles traités de bout en bout" },
    integrationLevels: [
      { code: "A0–A1", title: "Copilote", system: "Recherche, extrait ou rédige une étape. La personne déclenche, apporte le contexte, contrôle la réponse et réalise chaque action externe.", human: "Opérateur à chaque cycle", planning: "20–40 % de temps actif en moins · débit accepté ×1,25–1,7", flow: "0 % sans finalisation humaine" },
      { code: "A2–A3", title: "Agent métier", system: "Reçoit un dossier borné, utilise outils et mémoire autorisés, suit le workflow, termine les cas éligibles et escalade les exceptions.", human: "Validateur et responsable des exceptions", planning: "50–75 % de temps actif en moins · débit accepté ×2–4", flow: "Fourchette de planification 50–85 %" },
      { code: "A3–A4", title: "Agence orchestrée", system: "Un orchestrateur délègue recherche, exécution, contrôle qualité et coordination inter-systèmes à des agents spécialisés sous des règles communes.", human: "Gouverne objectifs, limites et exceptions", planning: "80–92 % de temps actif en moins · ×5–12 sur un workflow propre et borné", flow: "80–94 % sur des demandes étroites et éligibles" },
    ],
    measurementTitle: "Cinq chiffres à ne jamais mélanger",
    measurements: [["01", "Temps de cycle", "Délai écoulé entre demande et résultat."], ["02", "Temps humain actif", "Minutes réellement consacrées par une personne."], ["03", "Débit accepté", "Sorties acceptées par heure du responsable."], ["04", "Taux de bout en bout", "Cas éligibles terminés sans intervention."], ["05", "Résultat livré", "Effet réel en aval, pas l’activité du modèle."]],
    rangeNote: "Ces valeurs sont des fourchettes de planification synthétisées à partir de cas publiés, pas des promesses ni des intervalles de confiance. La borne haute ne vaut que pour des workflows éligibles, numériques, stables et bornés. L’intégration peut produire zéro gain — ou une perte temporaire — pendant la mise en place.",
    evidenceLead: "PREUVES DE TERRAIN ET CONTRE-PREUVES",
    evidenceLinks: [["Linde · 24 h → 2 h", "https://hdsr.mitpress.mit.edu/pub/0mrfxamu/release/3"], ["IBM AskHR · 94 % de traitement autonome", "https://www.ibm.com/case-studies/ibm-askhr"], ["Klarna · dépôt SEC", "https://www.sec.gov/Archives/edgar/data/2003292/000162828025012824/klarnagroupplcf-1.htm"], ["Remote Labor Index · 2,5 %", "https://scale.com/blog/rli"]],
    pathsEyebrow: "PARTEZ DE VOTRE RÉALITÉ",
    pathsTitle: "Choisissez la structure dans laquelle vous intervenez.",
    pathsText: "Même méthode. Profondeur différente pour les contrôles, les preuves et les responsabilités.",
    selected: "VOTRE PLAN DE DÉPART",
    roles: "Responsabilité minimale",
    pilot: "Bon premier pilote",
    controls: "À ne pas supprimer",
    fullGuide: "Ouvrir le guide complet sur GitHub",
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
    toolkitEyebrow: "UTILISEZ LE PLAYBOOK",
    toolkitTitle: "Commencez par une décision vide, pas par une page blanche.",
    toolkitText: "Copiez les modèles opérationnels, franchissez le premier gate et conservez les preuves avec le projet.",
    tools: [["Mandat", "Responsable, baseline, résultat et limites.", "templates/mandate.fr.md"], ["Fiche de cas d’usage", "Valeur et difficulté restent séparées.", "templates/use-case-card.fr.md"], ["Évaluation du risque", "Scénarios, contrôles et risque résiduel.", "templates/risk-assessment.fr.md"], ["Plan d’évaluation", "Métriques, segments, seuils et critères d’arrêt.", "templates/evaluation-plan.fr.md"], ["Décision de pilote", "Valeur, fiabilité et risque jugés séparément.", "templates/pilot-decision.fr.md"], ["Runbook d’incident", "Contenir, qualifier, rétablir et apprendre.", "templates/incident-runbook.fr.md"]],
    sourceTitle: "Un socle daté, fondé sur des sources primaires.",
    sourceText: "Le playbook renvoie vers le catalogue ISO, le NIST AI RMF, OWASP GenAI, MITRE ATLAS, les autorités suisses et les ressources actuelles de l’AI Act. C’est une aide à la mise en œuvre, pas une certification ni un avis juridique.",
    sources: "Consulter le registre des sources",
    footer: "AI Adoption Playbook · La preuve avant l’autonomie.",
  },
} as const;

const audiences: Record<Locale, Audience[]> = {
  en: [
    { id: "independent", number: "01", title: "Independent", short: "One reversible workflow", horizon: "14 days", objective: "One measured, low-risk workflow with a manual fallback.", roles: "The process owner is also the final decision-maker.", pilot: "Drafting, structured extraction, or supplier comparison with human review.", controls: ["Simple AI register", "Data rules", "Reusable tests", "Monthly value and error review"], phases: phase([["Days 1–2", "Choose the problem", "Measure five repetitive tasks and exclude high-impact decisions."], ["Days 3–7", "Set the boundary", "Choose the simplest tool and build 20–50 representative tests."], ["Days 8–10", "Run in shadow", "Produce results without sending, publishing, or modifying anything."], ["Days 11–14", "Decide", "Continue, correct, or stop against the written threshold."]]), file: "tracks/fr/independent.md" },
    { id: "tpe", number: "02", title: "Micro-business", short: "One shared process", horizon: "30 days", objective: "One team process with a named owner, shared rules, and incident capacity.", roles: "AI lead, business owner, and one reachable incident owner.", pilot: "A reversible customer or operations workflow with explicit approval.", controls: ["Individual accounts", "Read-only by default", "Supplier review", "Tested manual fallback"], phases: phase([["Week 1", "Make usage visible", "Inventory official and informal AI, publish a one-page rule, and measure the baseline."], ["Week 2", "Choose and qualify", "Compare three cases and assess the supplier, data, roles, and permissions."], ["Week 3", "Test in shadow", "Use 30–100 real cases, including missing data, attacks, and unavailable systems."], ["Week 4", "Pilot and decide", "Train each role, run a bounded copilot, and hold a gate review."]]), file: "tracks/fr/tpe.md" },
    { id: "pme", number: "03", title: "SME", short: "Portfolio and platform", horizon: "90 days", objective: "A prioritized portfolio, shared controls, and one governed pilot.", roles: "Executive sponsor, portfolio owner, business, IT/security, data, and privacy owners.", pilot: "One to three distinct cases that can prove shared platform needs.", controls: ["Portfolio gates", "Common identity and logging", "Segmented evaluations", "Supplier concentration review"], phases: phase([["Days 1–30", "Govern and discover", "Inventory shadow AI, map high-volume work, and create the portfolio."], ["Days 31–60", "Build evidence", "Select pilots, create test sets, and implement identities, logs, and limits."], ["Days 61–75", "Run copilots", "Measure business outcomes, corrections, incidents, and workarounds."], ["Days 76–90", "Industrialize selectively", "Version the proven common controls and schedule reassessment."]]), file: "tracks/fr/pme.md" },
    { id: "nonprofit", number: "04", title: "Nonprofit / foundation", short: "Mission-safe adoption", horizon: "60 days", objective: "Useful adoption that protects mission, beneficiaries, donors, and trust.", roles: "Business owner, mission guardian, beneficiary-facing staff, and data/privacy owner.", pilot: "Controlled research, translation, internal synthesis, or administrative triage.", controls: ["Mission gate", "Language and accessibility slices", "Complaint path", "No unauthorized aid decision"], phases: phase([["Days 1–15", "Align with the mission", "Consult beneficiary-facing people and define value and harms beyond money."], ["Days 16–30", "Protect access", "Check sensitive data, language, accessibility, supplier use, and human escalation."], ["Days 31–45", "Evaluate fairly", "Measure quality by relevant language and group, including stigma and disclosure risks."], ["Days 46–60", "Pilot accountably", "Run shadow mode, then a copilot, and report the decision to oversight."]]), file: "tracks/fr/nonprofit-foundation.md" },
    { id: "public", number: "05", title: "Public service", short: "Formal evidence gates", horizon: "Stage-gated", objective: "A lawful, proportionate, accessible service with audit and human recourse.", roles: "Administrative authority, service owner, legal, privacy, security, procurement, and archives.", pilot: "A bounded support function with no unauthorized legal effect.", controls: ["Legal mandate", "Impact assessment", "Auditable procurement", "Human appeal and continuity"], phases: phase([["P0–P1", "Prove public legitimacy", "Document the mandate, non-AI alternatives, affected population, and required impact reviews."], ["P2", "Procure for control", "Require audit, logs, change notice, export, deletion, continuity, and exit rights."], ["P3–P4", "Evaluate independently", "Test representative populations, rare cases, abuse, accessibility, and oversight."], ["P5", "Operate accountably", "Register the system, enable recourse, archive evidence, monitor, and plan retirement."]]), file: "tracks/fr/public-sector.md" },
  ],
  fr: [
    { id: "independent", number: "01", title: "Indépendant", short: "Un workflow réversible", horizon: "14 jours", objective: "Un workflow peu risqué, mesuré et doté d’une procédure manuelle.", roles: "Le propriétaire du processus prend aussi la décision finale.", pilot: "Brouillon, extraction structurée ou comparaison de fournisseurs avec validation humaine.", controls: ["Registre IA simple", "Règles de données", "Tests réutilisables", "Revue mensuelle valeur/erreurs"], phases: phase([["Jours 1–2", "Choisir le problème", "Mesurer cinq tâches répétitives et exclure les décisions à fort impact."], ["Jours 3–7", "Poser les limites", "Choisir l’outil le plus simple et construire 20 à 50 tests représentatifs."], ["Jours 8–10", "Travailler en shadow", "Produire sans envoyer, publier ou modifier quoi que ce soit."], ["Jours 11–14", "Décider", "Continuer, corriger ou arrêter selon le seuil écrit."]]), file: "tracks/fr/independent.md" },
    { id: "tpe", number: "02", title: "TPE", short: "Un processus partagé", horizon: "30 jours", objective: "Un processus d’équipe avec responsable, règles communes et capacité d’incident.", roles: "Responsable IA, propriétaire métier et responsable d’incident joignable.", pilot: "Un workflow client ou opérationnel réversible avec approbation explicite.", controls: ["Comptes individuels", "Lecture seule par défaut", "Revue fournisseur", "Retour manuel testé"], phases: phase([["Semaine 1", "Rendre les usages visibles", "Inventorier l’IA officielle et informelle, publier une règle d’une page et mesurer."], ["Semaine 2", "Choisir et qualifier", "Comparer trois cas et évaluer fournisseur, données, rôles et permissions."], ["Semaine 3", "Tester en shadow", "Utiliser 30 à 100 cas, avec données manquantes, attaques et indisponibilités."], ["Semaine 4", "Piloter et décider", "Former chaque rôle, exécuter un copilote borné et tenir la revue de gate."]]), file: "tracks/fr/tpe.md" },
    { id: "pme", number: "03", title: "PME", short: "Portefeuille et plateforme", horizon: "90 jours", objective: "Un portefeuille priorisé, des contrôles communs et un premier pilote gouverné.", roles: "Sponsor, responsable de portefeuille, métier, IT/sécurité, données et protection des données.", pilot: "Un à trois cas distincts capables de prouver les besoins réellement communs.", controls: ["Gates de portefeuille", "Identité et journaux communs", "Évaluations par segment", "Revue de concentration fournisseur"], phases: phase([["Jours 1–30", "Gouverner et découvrir", "Inventorier la shadow AI, cartographier le travail et constituer le portefeuille."], ["Jours 31–60", "Construire les preuves", "Choisir les pilotes, créer les tests et déployer identités, journaux et limites."], ["Jours 61–75", "Exécuter les copilotes", "Mesurer résultats, corrections, incidents et contournements."], ["Jours 76–90", "Industrialiser avec sélection", "Versionner les contrôles communs prouvés et planifier les revues."]]), file: "tracks/fr/pme.md" },
    { id: "nonprofit", number: "04", title: "Association / fondation", short: "Adoption alignée sur la mission", horizon: "60 jours", objective: "Une adoption utile qui protège mission, bénéficiaires, donateurs et confiance.", roles: "Propriétaire métier, garant de la mission, terrain et responsable données/vie privée.", pilot: "Recherche, traduction, synthèse interne ou tri administratif contrôlé.", controls: ["Gate mission", "Tests langue/accessibilité", "Voie de plainte", "Aucune décision d’aide non autorisée"], phases: phase([["Jours 1–15", "S’aligner sur la mission", "Consulter le terrain et définir valeur et dommages au-delà de l’argent."], ["Jours 16–30", "Protéger l’accès", "Vérifier données, langues, accessibilité, fournisseur et escalade humaine."], ["Jours 31–45", "Évaluer équitablement", "Mesurer par langue et groupe pertinent, y compris stigmatisation et divulgation."], ["Jours 46–60", "Piloter avec redevabilité", "Passer du shadow au copilote et présenter la décision à la surveillance."]]), file: "tracks/fr/nonprofit-foundation.md" },
    { id: "public", number: "05", title: "Service public", short: "Gates formels", horizon: "Par gates", objective: "Un service légal, proportionné, accessible, auditable et contestable humainement.", roles: "Autorité administrative, métier, juridique, données, sécurité, achats et archives.", pilot: "Une fonction de soutien bornée sans effet juridique non autorisé.", controls: ["Mandat légal", "Analyse d’impact", "Achat auditable", "Recours humain et continuité"], phases: phase([["P0–P1", "Prouver la légitimité publique", "Documenter mandat, options non-IA, population et analyses d’impact nécessaires."], ["P2", "Acheter pour garder le contrôle", "Exiger audit, journaux, changements, export, suppression, continuité et sortie."], ["P3–P4", "Évaluer indépendamment", "Tester populations, cas rares, abus, accessibilité et supervision."], ["P5", "Exploiter avec redevabilité", "Inscrire le système, ouvrir le recours, archiver, surveiller et préparer le retrait."]]), file: "tracks/fr/public-sector.md" },
  ],
};

function controlIndex(risk: number, autonomy: number) {
  if (autonomy === 4) return 4;
  if (risk === 3) return 3;
  if (risk >= 2 && autonomy >= 3) return 2;
  if (risk >= 1 || autonomy >= 2) return 1;
  return 0;
}

export function Playbook({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [audienceId, setAudienceId] = useState<AudienceId>("independent");
  const [risk, setRisk] = useState(1);
  const [autonomy, setAutonomy] = useState(1);
  const selected = useMemo(() => audiences[locale].find((item) => item.id === audienceId) ?? audiences[locale][0], [audienceId, locale]);
  const langHref = locale === "en" ? "/fr/" : "/";
  const langLabel = locale === "en" ? "FR" : "EN";

  useEffect(() => { document.documentElement.lang = locale; }, [locale]);

  return (
    <div className="page-shell">
      <a className="skip-link" href="#main">{locale === "en" ? "Skip to content" : "Aller au contenu"}</a>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="AI Adoption Playbook"><span aria-hidden="true" />MUSYG · AI ADOPTION</a>
        <nav aria-label={locale === "en" ? "Primary navigation" : "Navigation principale"}>
          <a href="#integration-levels">{t.nav[0]}</a><a href="#paths">{t.nav[1]}</a><a href="#method">{t.nav[2]}</a><a href="#case">{t.nav[3]}</a><a href="#controls">{t.nav[4]}</a><a href="#toolkit">{t.nav[5]}</a><a href={repository}>GitHub ↗</a><a className="lang" href={langHref} lang={locale === "en" ? "fr" : "en"}>{langLabel}</a>
        </nav>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-copy"><p className="eyebrow">{t.meta}</p><h1>{t.heroTitle}</h1><p className="lede">{t.heroText}</p><div className="hero-actions"><a className="button primary" href="#paths">{t.start}</a><a className="button secondary" href="#method">{t.methodCta}</a></div></div>
          <aside className="hero-rule" aria-label={t.rule}><p className="rule-label">{t.rule}</p><ol>{t.gates.map(([condition, decision], index) => <li key={condition}><span>0{index + 1}</span><strong>{condition}</strong><em>{decision}</em></li>)}</ol></aside>
        </section>

        <section className="stat-strip" aria-label={locale === "en" ? "Playbook summary" : "Résumé du playbook"}>{t.stats.map(([value, label]) => <p key={label}><strong>{value}</strong><span>{label}</span></p>)}</section>

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
        </section>

        <section className="paths section-dark" id="paths" aria-labelledby="paths-title">
          <div className="section-heading"><p className="eyebrow">{t.pathsEyebrow}</p><h2 id="paths-title">{t.pathsTitle}</h2><p>{t.pathsText}</p></div>
          <div className="path-grid" role="list">
            {audiences[locale].map((audience) => <button aria-pressed={audience.id === selected.id} className="path-card" data-active={audience.id === selected.id} key={audience.id} onClick={() => setAudienceId(audience.id)} type="button"><span className="path-number">{audience.number}</span><span className="path-title">{audience.title}</span><span className="path-copy">{audience.short}</span><span className="path-horizon">{audience.horizon} →</span></button>)}
          </div>
          <article className="selected-plan" aria-live="polite">
            <div className="plan-intro"><p className="eyebrow">{t.selected} · {selected.number}</p><h3>{selected.title}</h3><p>{selected.objective}</p><dl><div><dt>{t.roles}</dt><dd>{selected.roles}</dd></div><div><dt>{t.pilot}</dt><dd>{selected.pilot}</dd></div></dl></div>
            <ol className="phase-list">{selected.phases.map((item) => <li key={item.label}><span>{item.label}</span><div><strong>{item.title}</strong><p>{item.text}</p></div></li>)}</ol>
            <div className="control-box"><p>{t.controls}</p><ul>{selected.controls.map((control) => <li key={control}>{control}</li>)}</ul><a href={`${repository}/blob/main/${selected.file}`}>{t.fullGuide} ↗</a></div>
          </article>
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

        <section className="ladder-section section-blue" aria-labelledby="ladder-title"><div><p className="eyebrow">{t.ladderEyebrow}</p><h2 id="ladder-title">{t.ladderTitle}</h2><p>{t.ladderText}</p></div><ol className="ladder">{t.ladder.map((level, index) => <li key={level}><span>{index + 1}</span><strong>{level}</strong></li>)}</ol></section>

        <section className="controls section-light" id="controls" aria-labelledby="controls-title">
          <div className="section-heading"><p className="eyebrow">{t.riskEyebrow}</p><h2 id="controls-title">{t.riskTitle}</h2><p>{t.riskText}</p></div>
          <div className="control-explorer"><fieldset><legend>{t.impact}</legend><div className="choice-list">{t.impactOptions.map((label, index) => <button aria-pressed={risk === index} key={label} onClick={() => setRisk(index)} type="button">{label}</button>)}</div></fieldset><fieldset><legend>{t.autonomy}</legend><div className="choice-list">{t.autonomyOptions.map((label, index) => <button aria-pressed={autonomy === index} key={label} onClick={() => setAutonomy(index)} type="button">{label}</button>)}</div></fieldset><output className="orientation" aria-live="polite"><span>{t.orientation}</span><strong>{t.orientations[controlIndex(risk, autonomy)]}</strong><small>R{risk} × A{autonomy}</small></output></div>
        </section>

        <section className="toolkit section-dark" id="toolkit" aria-labelledby="toolkit-title"><div className="section-heading"><p className="eyebrow">{t.toolkitEyebrow}</p><h2 id="toolkit-title">{t.toolkitTitle}</h2><p>{t.toolkitText}</p></div><div className="tool-grid">{t.tools.map(([name, description, file], index) => <a href={`${repository}/blob/main/${file}`} key={name}><span>{String(index + 1).padStart(2, "0")}</span><h3>{name}</h3><p>{description}</p><b>↗</b></a>)}</div></section>

        <aside className="source-note"><p className="eyebrow">SOURCES · LIMITS</p><h2>{t.sourceTitle}</h2><p>{t.sourceText}</p><a className="button secondary" href={`${repository}/blob/main/references/sources.md`}>{t.sources} ↗</a></aside>
      </main>
      <footer><p>{t.footer}</p><a href={repository}>GitHub ↗</a></footer>
    </div>
  );
}
