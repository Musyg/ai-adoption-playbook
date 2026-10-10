// Reading guidance is editorial content, not a new permission or decision gate.
const paired = (en, fr) => ({ en, fr });
const byCategory = {
  tracks: paired("Adapt responsibilities and your first pilot to your situation.", "Adapter les responsabilités et le premier pilote à votre situation."),
  sectors: paired("Check the extra conditions that apply in your sector.", "Vérifier les conditions supplémentaires propres à votre secteur."),
  examples: paired("See a complete worked example. Its numbers are demonstrations, not results from your project.", "Voir un cas complet. Ses chiffres sont des démonstrations, pas les résultats de votre projet."),
  templates: paired("Fill in a working document for your project; leave unknown answers open.", "Remplir un document de travail pour votre projet ; laisser ouvertes les réponses inconnues."),
  docs: paired("Understand one part of the method and apply it to your own task.", "Comprendre une partie de la méthode et l’appliquer à votre tâche."),
  references: paired("Check what a source measured and whether its result applies to your task.", "Vérifier ce qu’une source a mesuré et si son résultat s’applique à votre tâche."),
  "field-notes": paired("Read or prepare a record of an observed pilot, separate from a simulation.", "Lire ou préparer un retour de pilote observé, distinct d’une simulation."),
  controls: paired("Identify checks and the records needed to show they were performed.", "Identifier les vérifications et les documents montrant qu’elles ont été réalisées."),
};
const specific = {
  "templates-mandate": paired("Agree the task, owner, scope and stop rules before starting.", "Convenir de la tâche, du responsable, du périmètre et des règles d’arrêt avant de commencer."),
  "templates-use-case-card": paired("Describe the task, current process and expected output on one working card.", "Décrire la tâche, le processus actuel et le résultat attendu dans une fiche de travail."),
  "templates-evaluation-plan": paired("Choose test cases, acceptance criteria and a fair comparison.", "Choisir les cas de test, les critères d’acceptation et une comparaison équitable."),
  "templates-risk-assessment": paired("Identify what could go wrong, who is affected and how to reduce it.", "Identifier ce qui peut mal se passer, qui est concerné et comment réduire le risque."),
  "templates-accessibility-assessment": paired("Check whether people can understand and use the service, including with assistive tools.", "Vérifier que les personnes peuvent comprendre et utiliser le service, aussi avec des outils d’assistance."),
  "templates-vendor-assessment": paired("Compare suppliers on data handling, permissions, continuity and exit.", "Comparer les fournisseurs sur les données, les permissions, la continuité et la sortie."),
  "templates-fundamental-rights-impact-assessment": paired("Assess effects on people’s rights where this assessment is required.", "Évaluer les effets sur les droits des personnes lorsque cette analyse est requise."),
  "templates-training-plan": paired("Plan who needs to learn what, with practical exercises and checks.", "Prévoir qui doit apprendre quoi, avec des exercices et des vérifications pratiques."),
  "templates-incident-runbook": paired("Prepare who stops the service, informs people and restores a safe situation.", "Prévoir qui arrête le service, informe les personnes et rétablit une situation sûre."),
  "templates-pilot-decision": paired("Record a decision to continue, change or stop, using actual test results.", "Consigner la décision de continuer, modifier ou arrêter à partir des résultats réels des tests."),
  "templates-field-feedback-report": paired("Record what was actually observed, including corrections and exceptions.", "Consigner ce qui a été réellement observé, corrections et exceptions comprises."),
  "docs-ai-use-patterns": paired("Separate the AI’s task from its human role, components and permissions.", "Distinguer la tâche de l’IA, le rôle humain, les composants et les permissions."),
  "docs-task-time-evidence": paired("Estimate human hours saved or added from comparable task evidence.", "Estimer les heures humaines économisées ou ajoutées à partir de tâches comparables."),
  "docs-project-dossier": paired("Save, export and resume your project, then compare changes.", "Enregistrer, exporter et reprendre votre projet, puis comparer les changements."),
  "docs-evaluations-and-gates": paired("Define what to test and what must be true before moving on.", "Définir ce qu’il faut tester et les conditions pour passer à la suite."),
  "docs-security": paired("Choose security checks for the functions your system actually has.", "Choisir les vérifications de sécurité selon les fonctions réelles de votre système."),
  "docs-legal-switzerland-eu": paired("Locate the Swiss and EU questions to check for your intended use.", "Repérer les questions suisses et européennes à vérifier pour l’usage prévu."),
  "docs-universal-process": paired("Follow the project from a defined task to operation and reassessment.", "Suivre le projet d’une tâche définie à l’exploitation et à la réévaluation."),
  "docs-risk-autonomy": paired("Choose an action boundary without confusing it with risk or capability.", "Choisir une limite d’action sans la confondre avec le risque ou les capacités."),
  "docs-maturity-model": paired("Identify what is already demonstrated and what still needs work.", "Identifier ce qui est déjà démontré et ce qui reste à travailler."),
  "docs-field-pilot-protocol": paired("Run a local comparison and count the human work that remains.", "Organiser une comparaison locale et compter le travail humain qui reste."),
  "docs-field-pilot-cohort": paired("Prepare a group of pilots with comparable records and review.", "Préparer un groupe de pilotes avec des relevés comparables et une revue."),
};
export function documentGuidance(doc) {
  const purpose = (specific[doc.id] ?? byCategory[doc.category])[doc.locale];
  const anchor = doc.category === "references" || doc.id === "docs-task-time-evidence" ? "calibrator"
    : doc.category === "templates" || doc.id === "docs-project-dossier" ? "lifecycle-workbench" : "guided-start";
  const action = doc.locale === "fr"
    ? anchor === "calibrator" ? "Estimer mon scénario" : anchor === "lifecycle-workbench" ? "Ouvrir mon dossier de travail" : "Construire mon parcours"
    : anchor === "calibrator" ? "Estimate my scenario" : anchor === "lifecycle-workbench" ? "Open my working dossier" : "Build my route";
  return { purpose, action, path: `${doc.locale === "fr" ? "/fr/" : "/"}#${anchor}` };
}
