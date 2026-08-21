"use client";

import { useMemo, useState } from "react";

import type { ChecklistItem, ChecklistStatus, ProjectArtifacts } from "./project-dossier.mjs";

type Locale = "en" | "fr";
type FieldArtifactId = "system_register" | "risk_assessment" | "evaluation_plan";
type ArtifactId = FieldArtifactId | "implementation_checklist";
type ChecklistGroup = "phases" | "security" | "controls";
type FieldDefinition = {
  id: string;
  label: string;
  help: string;
  phase?: number;
  kind?: "text" | "textarea" | "number" | "date";
  required?: boolean;
};
type ArtifactDefinition = {
  id: ArtifactId;
  code: string;
  title: string;
  short: string;
  purpose: string;
  why: string;
  fields?: FieldDefinition[];
};
type ChecklistTask = {
  id: string;
  code: string;
  title: string;
  group: ChecklistGroup;
  linked: boolean;
  detail: string;
};
type Control = { id: string; title: string; priority?: string };
type SecurityControl = { id: string; label: string; checked: boolean };
type Props = {
  locale: Locale;
  usePatternId: string;
  usePatternLabel: string;
  jurisdictionLabel: string;
  artifacts: ProjectArtifacts;
  phaseTitles: string[];
  securityControls: SecurityControl[];
  matchedControls: Control[];
  onChange: (artifacts: ProjectArtifacts) => void;
  onDirty: () => void;
  onOpenPhase: (phase: number) => void;
};

const copy = {
  en: {
    eyebrow: "CONNECTED PROJECT RECORDS",
    title: "Turn answers into records people can operate.",
    text: "The guide pre-fills linked fields. Edit only what needs a project decision, then keep owners, dates, and evidence references beside the work.",
    ready: "required fields ready",
    why: "How this record is used",
    linked: "Linked",
    edited: "Edited",
    reset: "Use linked value",
    phase: "Open phase",
    empty: "Complete the linked phase or enter a project-specific value.",
    checklistGroups: { phases: "Lifecycle gates", security: "Conditioned security", controls: "Matched controls" },
    status: "Status",
    owner: "Owner",
    due: "Due date",
    evidence: "Evidence reference",
    statuses: { not_started: "Not started", in_progress: "In progress", done: "Done", not_applicable: "Not applicable" },
    linkedStatus: "Status follows the linked phase or control until you change it.",
    manualStatus: "Status set manually.",
    resetStatus: "Resume linked status",
    boundary: "These are working records, not approvals. Keep raw evidence in an authorized private system.",
    pattern: "Evaluation focus for this use pattern",
  },
  fr: {
    eyebrow: "ENREGISTREMENTS PROJET RELIÉS",
    title: "Transformer les réponses en documents réellement exploitables.",
    text: "Le guide préremplit les champs reliés. Modifiez seulement ce qui exige une décision propre au projet, puis gardez responsables, dates et références de preuve avec le travail.",
    ready: "champs requis prêts",
    why: "Utilité de cet enregistrement",
    linked: "Relié",
    edited: "Modifié",
    reset: "Reprendre la valeur reliée",
    phase: "Ouvrir la phase",
    empty: "Complétez la phase reliée ou saisissez une valeur propre au projet.",
    checklistGroups: { phases: "Décisions du cycle", security: "Sécurité conditionnelle", controls: "Contrôles associés" },
    status: "État",
    owner: "Responsable",
    due: "Échéance",
    evidence: "Référence de preuve",
    statuses: { not_started: "À faire", in_progress: "En cours", done: "Terminé", not_applicable: "Non applicable" },
    linkedStatus: "L’état suit la phase ou le contrôle relié tant que vous ne le modifiez pas.",
    manualStatus: "État défini manuellement.",
    resetStatus: "Reprendre l’état relié",
    boundary: "Ces documents restent des enregistrements de travail, pas des validations. Gardez les preuves brutes dans un système privé autorisé.",
    pattern: "Point d’attention pour ce mode d’usage",
  },
};

const artifactDefinitions: Record<Locale, ArtifactDefinition[]> = {
  en: [
    {
      id: "system_register", code: "REG", title: "AI system register", short: "Identity and ownership", purpose: "Keep one operational identity for the system, its purpose, boundaries, owner, supplier, and review route.", why: "A register makes scope and ownership findable without reopening every project discussion.",
      fields: [
        { id: "system_id", label: "System ID", help: "Use a stable internal identifier, for example AI-014.", required: true },
        { id: "name", label: "System name", help: "A neutral name that remains stable across supplier changes.", phase: 0, required: true },
        { id: "owner", label: "Accountable owner", help: "The role that owns the operating decision.", phase: 0, required: true },
        { id: "purpose", label: "Purpose and problem", help: "Describe the observable problem, not the desired tool.", phase: 0, kind: "textarea", required: true },
        { id: "business_process", label: "Business process", help: "Name the input-to-outcome process in scope.", phase: 2, kind: "textarea", required: true },
        { id: "affected_people", label: "Affected people", help: "Include users, customers, workers, beneficiaries, or the public.", phase: 0, required: true },
        { id: "data_classes", label: "Data classes and boundary", help: "Record categories, sensitivity, and permitted sources.", phase: 2, kind: "textarea", required: true },
        { id: "provider_version", label: "Provider, model, and deployment", help: "Record the supplier boundary and version identifiers.", phase: 5, kind: "textarea" },
        { id: "human_approval", label: "Human approval", help: "Name the action that cannot proceed without a person.", phase: 5, kind: "textarea", required: true },
        { id: "next_review", label: "Next review", help: "Use a dated reassessment point.", phase: 11, kind: "date", required: true },
        { id: "decision_reference", label: "Decision or evidence reference", help: "Use stable identifiers or hashes, never raw evidence.", phase: 11, kind: "textarea" },
      ],
    },
    {
      id: "risk_assessment", code: "RSK", title: "Risk and impact assessment", short: "Harms and authority", purpose: "Record the data, transparency, harm, treatment, and residual-risk decisions that change release conditions.", why: "A risk label is only useful when the scenarios, controls, decision authority, and next review are visible.",
      fields: [
        { id: "evaluator", label: "Evaluator", help: "Name the accountable role or qualified reviewer.", phase: 0, required: true },
        { id: "next_review", label: "Next review", help: "Set the date when this assessment expires.", phase: 11, kind: "date", required: true },
        { id: "data_categories", label: "Data categories and sensitivity", help: "Include the most sensitive data in scope.", phase: 4, kind: "textarea", required: true },
        { id: "data_provenance", label: "Provenance and usage rights", help: "Record source authority and allowed use.", phase: 2, kind: "textarea" },
        { id: "retention_transfers", label: "Retention, location, and transfers", help: "Include deletion, subprocessors, and supplier reuse.", kind: "textarea", required: true },
        { id: "transparency_recourse", label: "Transparency, human channel, and recourse", help: "Explain information, challenge, and qualified human review.", phase: 4, kind: "textarea", required: true },
        { id: "harm_scenarios", label: "Material harm scenarios", help: "Describe who or what could be harmed and how.", phase: 4, kind: "textarea", required: true },
        { id: "mitigations", label: "Controls and residual risk", help: "Connect each material scenario to controls and remaining exposure.", phase: 7, kind: "textarea", required: true },
        { id: "residual_risk_authority", label: "Residual-risk authority", help: "Name the role allowed to accept the remaining risk.", phase: 0, required: true },
        { id: "decision", label: "Treatment decision", help: "Accept, treat, transfer, avoid, or keep undecided.", phase: 9, required: true },
        { id: "conditions", label: "Conditions and limitations", help: "State the scope and conditions of the decision.", phase: 9, kind: "textarea" },
      ],
    },
    {
      id: "evaluation_plan", code: "EVAL", title: "Evaluation plan", short: "Thresholds before testing", purpose: "Freeze the cases, segments, thresholds, stop rules, and decision authority before the pilot result is known.", why: "A preregistered plan can disprove readiness. A test written after the demonstration usually cannot.",
      fields: [
        { id: "decision_owner", label: "Decision owner", help: "Name the person who will continue, rework, or stop.", phase: 0, required: true },
        { id: "deadline", label: "Decision deadline", help: "Set the decision date before testing.", phase: 0, kind: "date", required: true },
        { id: "test_provenance", label: "Test-set provenance and authorization", help: "Record how cases were selected, authorized, and frozen.", kind: "textarea", required: true },
        { id: "frozen_cases", label: "Frozen cases", help: "Include normal, rare, critical, adversarial, and missing-data cases.", phase: 6, kind: "number", required: true },
        { id: "baseline", label: "Baseline outcome", help: "Use the same accepted-outcome definition as the pilot.", phase: 1, kind: "textarea", required: true },
        { id: "value_threshold", label: "Minimum value improvement (%)", help: "Measure accepted outcomes or human time, not model activity.", phase: 6, kind: "number", required: true },
        { id: "quality_threshold", label: "Minimum accepted quality (%)", help: "Define review and major-correction limits.", phase: 6, kind: "number", required: true },
        { id: "critical_segments", label: "Critical segments", help: "List languages, groups, channels, products, or rare conditions.", phase: 6, kind: "textarea", required: true },
        { id: "stop_rule", label: "Critical stop rule", help: "One critical unauthorized or unsafe effect should be enough.", phase: 6, kind: "textarea", required: true },
        { id: "reproducibility_refs", label: "Reproducibility references", help: "Reference frozen sets, rubrics, configurations, and results.", phase: 11, kind: "textarea" },
      ],
    },
    { id: "implementation_checklist", code: "ACT", title: "Implementation checklist", short: "Owners, dates, and evidence", purpose: "Turn lifecycle gates and conditioned controls into assignable work with a status, owner, due date, and evidence reference.", why: "A control list becomes operational only when someone owns the work and another person can verify the evidence." },
  ],
  fr: [
    {
      id: "system_register", code: "REG", title: "Registre du système IA", short: "Identité et responsabilité", purpose: "Conserver une identité opérationnelle unique pour le système, sa finalité, ses limites, son responsable, son fournisseur et sa revue.", why: "Un registre rend le périmètre et les responsabilités accessibles sans rouvrir toutes les discussions du projet.",
      fields: [
        { id: "system_id", label: "Identifiant du système", help: "Utilisez un identifiant interne stable, par exemple AI-014.", required: true },
        { id: "name", label: "Nom du système", help: "Un nom neutre qui reste stable si le fournisseur change.", phase: 0, required: true },
        { id: "owner", label: "Responsable redevable", help: "Le rôle qui porte la décision d’exploitation.", phase: 0, required: true },
        { id: "purpose", label: "Finalité et problème", help: "Décrivez le problème observable, pas l’outil souhaité.", phase: 0, kind: "textarea", required: true },
        { id: "business_process", label: "Processus métier", help: "Nommez le processus de l’entrée au résultat couvert.", phase: 2, kind: "textarea", required: true },
        { id: "affected_people", label: "Personnes affectées", help: "Incluez utilisateurs, clients, travailleurs, bénéficiaires ou public.", phase: 0, required: true },
        { id: "data_classes", label: "Catégories et frontière des données", help: "Consignez catégories, sensibilité et sources permises.", phase: 2, kind: "textarea", required: true },
        { id: "provider_version", label: "Fournisseur, modèle et déploiement", help: "Consignez la frontière fournisseur et les identifiants de version.", phase: 5, kind: "textarea" },
        { id: "human_approval", label: "Validation humaine", help: "Nommez l’action qui ne peut pas avancer sans une personne.", phase: 5, kind: "textarea", required: true },
        { id: "next_review", label: "Prochaine revue", help: "Fixez une date de réévaluation.", phase: 11, kind: "date", required: true },
        { id: "decision_reference", label: "Référence de décision ou de preuve", help: "Utilisez des identifiants stables ou empreintes, jamais les preuves brutes.", phase: 11, kind: "textarea" },
      ],
    },
    {
      id: "risk_assessment", code: "RSK", title: "Évaluation des risques et impacts", short: "Dommages et autorité", purpose: "Consigner les décisions sur les données, la transparence, les dommages, le traitement et le risque résiduel qui changent les conditions de mise en service.", why: "Un niveau de risque n’est utile que si les scénarios, contrôles, autorités de décision et prochaines revues sont visibles.",
      fields: [
        { id: "evaluator", label: "Évaluateur", help: "Nommez le rôle redevable ou la personne qualifiée.", phase: 0, required: true },
        { id: "next_review", label: "Prochaine revue", help: "Fixez la date d’expiration de cette évaluation.", phase: 11, kind: "date", required: true },
        { id: "data_categories", label: "Catégories et sensibilité des données", help: "Incluez les données les plus sensibles du périmètre.", phase: 4, kind: "textarea", required: true },
        { id: "data_provenance", label: "Provenance et droits d’utilisation", help: "Consignez l’autorité de la source et l’usage permis.", phase: 2, kind: "textarea" },
        { id: "retention_transfers", label: "Conservation, localisation et transferts", help: "Incluez suppression, sous-traitants et réutilisation fournisseur.", kind: "textarea", required: true },
        { id: "transparency_recourse", label: "Transparence, canal humain et recours", help: "Expliquez l’information, la contestation et la revue humaine qualifiée.", phase: 4, kind: "textarea", required: true },
        { id: "harm_scenarios", label: "Scénarios de dommage significatif", help: "Décrivez qui ou quoi pourrait être affecté et comment.", phase: 4, kind: "textarea", required: true },
        { id: "mitigations", label: "Contrôles et risque résiduel", help: "Reliez chaque scénario significatif aux contrôles et à l’exposition restante.", phase: 7, kind: "textarea", required: true },
        { id: "residual_risk_authority", label: "Autorité du risque résiduel", help: "Nommez le rôle autorisé à accepter le risque restant.", phase: 0, required: true },
        { id: "decision", label: "Décision de traitement", help: "Accepter, traiter, transférer, éviter ou laisser indécis.", phase: 9, required: true },
        { id: "conditions", label: "Conditions et limites", help: "Précisez le périmètre et les conditions de la décision.", phase: 9, kind: "textarea" },
      ],
    },
    {
      id: "evaluation_plan", code: "EVAL", title: "Plan d’évaluation", short: "Seuils avant les tests", purpose: "Figer les cas, segments, seuils, règles d’arrêt et autorités de décision avant de connaître le résultat du pilote.", why: "Un plan préenregistré peut réfuter la préparation. Un test écrit après la démonstration le peut rarement.",
      fields: [
        { id: "decision_owner", label: "Responsable de la décision", help: "Nommez la personne qui continuera, corrigera ou arrêtera.", phase: 0, required: true },
        { id: "deadline", label: "Échéance de décision", help: "Fixez la date avant les tests.", phase: 0, kind: "date", required: true },
        { id: "test_provenance", label: "Provenance et autorisation du jeu de tests", help: "Consignez comment les cas ont été sélectionnés, autorisés et figés.", kind: "textarea", required: true },
        { id: "frozen_cases", label: "Cas figés", help: "Incluez les cas normaux, rares, critiques, adversariaux et incomplets.", phase: 6, kind: "number", required: true },
        { id: "baseline", label: "Résultat de référence", help: "Utilisez la même définition du résultat accepté que pendant le pilote.", phase: 1, kind: "textarea", required: true },
        { id: "value_threshold", label: "Amélioration minimale de valeur (%)", help: "Mesurez les résultats acceptés ou le temps humain, pas l’activité du modèle.", phase: 6, kind: "number", required: true },
        { id: "quality_threshold", label: "Qualité minimale acceptée (%)", help: "Définissez les limites de revue et de correction majeure.", phase: 6, kind: "number", required: true },
        { id: "critical_segments", label: "Segments critiques", help: "Listez langues, groupes, canaux, produits ou conditions rares.", phase: 6, kind: "textarea", required: true },
        { id: "stop_rule", label: "Règle d’arrêt critique", help: "Un seul effet critique non autorisé ou dangereux doit suffire.", phase: 6, kind: "textarea", required: true },
        { id: "reproducibility_refs", label: "Références de reproductibilité", help: "Référencez jeux figés, grilles, configurations et résultats.", phase: 11, kind: "textarea" },
      ],
    },
    { id: "implementation_checklist", code: "ACT", title: "Liste de mise en œuvre", short: "Responsables, dates et preuves", purpose: "Transformer les décisions du cycle et les contrôles conditionnels en travail attribuable avec un état, un responsable, une échéance et une référence de preuve.", why: "Une liste de contrôles devient opérationnelle quand une personne porte le travail et qu’une autre peut vérifier la preuve." },
  ],
};

const patternGuidance: Record<Locale, Record<string, string>> = {
  en: {
    generation: "Test accepted quality, factual or source fidelity, prohibited content, and reproducibility limits.",
    retrieval: "Test source access, retrieval coverage, groundedness, citation validity, freshness, and poisoning.",
    classification: "Test the confusion matrix, critical classes, abstention, prevalence, subgroups, and drift.",
    prediction: "Test calibration, threshold utility, false-positive and false-negative costs, subgroups, and feedback loops.",
    conversation: "Test AI disclosure, task completion, human handoff, multi-turn consistency, retention, deletion, and abuse.",
    multimodal: "Test consent and rights, each modality, provenance, labelling, robustness, and accessibility.",
    agentic: "Test plan and tool correctness, authorization, effect read-back, idempotency, rollback, stopping, and hostile inputs.",
  },
  fr: {
    generation: "Testez la qualité acceptée, la fidélité factuelle ou aux sources, les contenus interdits et les limites de reproductibilité.",
    retrieval: "Testez les droits d’accès, la couverture, l’ancrage, les citations, la fraîcheur et l’empoisonnement.",
    classification: "Testez la matrice de confusion, les classes critiques, l’abstention, la prévalence, les segments et la dérive.",
    prediction: "Testez la calibration, l’utilité du seuil, le coût des faux positifs et négatifs, les segments et les boucles de rétroaction.",
    conversation: "Testez l’information IA, la réussite, le transfert humain, la cohérence, la conservation, la suppression et les abus.",
    multimodal: "Testez consentement et droits, chaque modalité, provenance, marquage, robustesse et accessibilité.",
    agentic: "Testez plan et outils, autorisation, relecture des effets, idempotence, retour arrière, arrêt et entrées hostiles.",
  },
};

export function ProjectArtifactsWorkbench(props: Props) {
  const { artifacts, locale } = props;
  const labels = copy[locale];
  const definitions = artifactDefinitions[locale];
  const [activeArtifact, setActiveArtifact] = useState<ArtifactId>("system_register");
  const [checklistGroup, setChecklistGroup] = useState<ChecklistGroup>("phases");
  const [activeChecklistTaskId, setActiveChecklistTaskId] = useState("phase:0");
  const current = definitions.find((artifact) => artifact.id === activeArtifact) ?? definitions[0];

  const checklistTasks = useMemo<ChecklistTask[]>(() => [
    ...props.phaseTitles.map((title, phase) => ({ id: `phase:${phase}`, code: String(phase).padStart(2, "0"), title, group: "phases" as const, linked: true, detail: locale === "en" ? `Lifecycle phase ${phase}` : `Phase ${phase} du cycle` })),
    ...props.securityControls.map((control) => ({ id: `security:${control.id}`, code: control.id, title: control.label, group: "security" as const, linked: true, detail: control.checked ? labels.statuses.done : labels.statuses.not_started })),
    ...props.matchedControls.map((control) => ({ id: `control:${control.id}`, code: control.id, title: control.title, group: "controls" as const, linked: false, detail: control.priority ?? "" })),
  ], [labels.statuses.done, labels.statuses.not_started, locale, props.matchedControls, props.phaseTitles, props.securityControls]);

  const fieldProgress = (definition: ArtifactDefinition) => {
    if (!definition.fields) return { ready: 0, total: 0 };
    const required = definition.fields.filter((field) => field.required);
    const ready = required.filter((field) => artifacts[definition.id as FieldArtifactId].fields[field.id]?.value.trim()).length;
    return { ready, total: required.length };
  };
  const checklistReady = checklistTasks.filter((task) => {
    const status = artifacts.implementation_checklist.items[task.id]?.status;
    return status === "done" || status === "not_applicable";
  }).length;

  const updateField = (artifactId: FieldArtifactId, fieldId: string, value: string) => {
    props.onChange({
      ...artifacts,
      [artifactId]: {
        fields: {
          ...artifacts[artifactId].fields,
          [fieldId]: { value, mode: "manual" },
        },
      },
    });
    props.onDirty();
  };

  const resetField = (artifactId: FieldArtifactId, fieldId: string) => {
    props.onChange({
      ...artifacts,
      [artifactId]: {
        fields: {
          ...artifacts[artifactId].fields,
          [fieldId]: { value: "", mode: "linked" },
        },
      },
    });
    props.onDirty();
  };

  const updateChecklist = (task: ChecklistTask, patch: Partial<ChecklistItem>, manualStatus = false) => {
    const currentItem = artifacts.implementation_checklist.items[task.id];
    const nextItem: ChecklistItem = {
      ...currentItem,
      ...patch,
      status_mode: manualStatus ? "manual" : (patch.status_mode ?? currentItem.status_mode),
    };
    props.onChange({
      ...artifacts,
      implementation_checklist: {
        items: { ...artifacts.implementation_checklist.items, [task.id]: nextItem },
      },
    });
    props.onDirty();
  };

  const resetChecklistStatus = (task: ChecklistTask) => updateChecklist(task, { status_mode: "linked" });
  const visibleTasks = checklistTasks.filter((task) => task.group === checklistGroup);
  const activeChecklistTask = visibleTasks.find((task) => task.id === activeChecklistTaskId) ?? visibleTasks[0];

  return (
    <section aria-labelledby="project-artifacts-title" className="project-artifacts-workbench">
      <header className="project-artifacts-head">
        <div><p className="eyebrow">{labels.eyebrow}</p><h4 id="project-artifacts-title">{labels.title}</h4><p>{labels.text}</p></div>
        <output aria-live="polite"><strong>4</strong><span>{locale === "en" ? "connected records" : "documents reliés"}</span></output>
      </header>

      <nav aria-label={locale === "en" ? "Project records" : "Documents du projet"} className="artifact-router">
        {definitions.map((artifact) => {
          const progress = fieldProgress(artifact);
          const ready = artifact.id === "implementation_checklist" ? checklistReady : progress.ready;
          const total = artifact.id === "implementation_checklist" ? checklistTasks.length : progress.total;
          return <button aria-current={activeArtifact === artifact.id ? "page" : undefined} data-artifact={artifact.id} key={artifact.id} onClick={() => setActiveArtifact(artifact.id)} type="button"><span>{artifact.code}</span><strong>{artifact.title}</strong><small>{artifact.short}</small><em>{ready}/{total}</em></button>;
        })}
      </nav>

      <div className="artifact-context"><p><span>{locale === "en" ? "Use pattern" : "Mode d’usage"}</span><strong>{props.usePatternLabel}</strong></p><p><span>{locale === "en" ? "Legal route" : "Route juridique"}</span><strong>{props.jurisdictionLabel}</strong></p></div>

      <section aria-labelledby="artifact-panel-title" className="artifact-panel" data-artifact={current.id}>
        <header><div><span>{current.code}</span><h5 id="artifact-panel-title">{current.title}</h5><p>{current.purpose}</p></div><details><summary aria-label={labels.why}>?</summary><div role="note"><strong>{labels.why}</strong><p>{current.why}</p></div></details></header>

        {current.id !== "implementation_checklist" && <>
          {current.id === "evaluation_plan" && <aside className="artifact-pattern-note"><strong>{labels.pattern}</strong><p>{patternGuidance[locale][props.usePatternId]}</p></aside>}
          <div className="artifact-fields">{current.fields?.map((field) => {
            const artifactId = current.id as FieldArtifactId;
            const record = artifacts[artifactId].fields[field.id];
            const isManual = record.mode === "manual";
            const input = field.kind === "textarea"
              ? <textarea name={`artifact-${artifactId}-${field.id}`} onChange={(event) => updateField(artifactId, field.id, event.target.value)} rows={3} value={record.value} />
              : <input min={field.kind === "number" ? "0" : undefined} name={`artifact-${artifactId}-${field.id}`} onChange={(event) => updateField(artifactId, field.id, event.target.value)} type={field.kind ?? "text"} value={record.value} />;
            return <label data-field={field.id} data-mode={record.mode} key={field.id}><span><strong>{field.label}{field.required ? " *" : ""}</strong><em>{isManual ? labels.edited : labels.linked}</em></span>{input}<small>{record.value ? field.help : labels.empty}</small><b>{field.phase !== undefined && <button onClick={() => props.onOpenPhase(field.phase!)} type="button">{labels.phase} {field.phase}</button>}{isManual && field.phase !== undefined && <button onClick={() => resetField(artifactId, field.id)} type="button">{labels.reset}</button>}</b></label>;
          })}</div>
        </>}

        {current.id === "implementation_checklist" && <div className="artifact-checklist">
          <nav aria-label={locale === "en" ? "Checklist groups" : "Groupes de la liste"}>{(["phases", "security", "controls"] as ChecklistGroup[]).map((group) => {
            const tasks = checklistTasks.filter((task) => task.group === group);
            const done = tasks.filter((task) => ["done", "not_applicable"].includes(artifacts.implementation_checklist.items[task.id]?.status)).length;
            return <button aria-current={checklistGroup === group ? "page" : undefined} key={group} onClick={() => { setChecklistGroup(group); setActiveChecklistTaskId(tasks[0]?.id ?? ""); }} type="button"><strong>{labels.checklistGroups[group]}</strong><span>{done}/{tasks.length}</span></button>;
          })}</nav>
          {activeChecklistTask && <div className="checklist-task-layout">
            <nav aria-label={locale === "en" ? "Checklist items" : "Éléments de la liste"}>{visibleTasks.map((task) => { const item = artifacts.implementation_checklist.items[task.id]; return <button aria-current={activeChecklistTask.id === task.id ? "step" : undefined} data-status={item.status} key={task.id} onClick={() => setActiveChecklistTaskId(task.id)} type="button"><span>{task.code}</span><strong>{task.title}</strong><small>{labels.statuses[item.status]}</small></button>; })}</nav>
            {(() => {
              const task = activeChecklistTask;
              const item = artifacts.implementation_checklist.items[task.id];
              return <article data-status={item.status} data-task={task.id}><header><span>{task.code}</span><div><strong>{task.title}</strong><small>{task.detail}</small></div></header><div className="checklist-fields"><label><span>{labels.status}</span><select aria-label={`${labels.status}: ${task.title}`} onChange={(event) => updateChecklist(task, { status: event.target.value as ChecklistStatus }, true)} value={item.status}>{Object.entries(labels.statuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label><span>{labels.owner}</span><input aria-label={`${labels.owner}: ${task.title}`} onChange={(event) => updateChecklist(task, { owner: event.target.value })} value={item.owner} /></label><label><span>{labels.due}</span><input aria-label={`${labels.due}: ${task.title}`} onChange={(event) => updateChecklist(task, { due_date: event.target.value })} type="date" value={item.due_date} /></label><label><span>{labels.evidence}</span><input aria-label={`${labels.evidence}: ${task.title}`} onChange={(event) => updateChecklist(task, { evidence_ref: event.target.value })} value={item.evidence_ref} /></label></div><footer><p>{item.status_mode === "linked" ? labels.linkedStatus : labels.manualStatus}</p>{task.linked && item.status_mode === "manual" && <button onClick={() => resetChecklistStatus(task)} type="button">{labels.resetStatus}</button>}</footer></article>;
            })()}
          </div>}
        </div>}

        <footer>{labels.boundary}</footer>
      </section>
    </section>
  );
}
