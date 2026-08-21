"use client";

import { useMemo, useRef, useState } from "react";

import { createProjectChangeReview } from "./project-change-review.mjs";
import { parseProjectDossier } from "./project-dossier.mjs";
import type { ChangeDecision, ChangeDomain, ChangeReviewItem, ProjectChangeReview, ProjectSnapshot } from "./project-dossier.mjs";
import { getProjectArtifactFieldLabel } from "./ProjectArtifactsWorkbench";

type Locale = "en" | "fr";
type Control = { id: string; title: string };
type SecurityControl = { id: string; label: string };
type FieldCatalog = Record<string, { label: string; phase: number }>;
type Props = {
  locale: Locale;
  dossierId: string;
  currentSnapshot: ProjectSnapshot;
  review: ProjectChangeReview | null;
  phaseTitles: string[];
  fieldCatalog: FieldCatalog;
  securityControls: SecurityControl[];
  matchedControls: Control[];
  onChange: (review: ProjectChangeReview | null) => void;
  onDirty: () => void;
  onOpenPhase: (phase: number) => void;
};

const copy = {
  en: {
    eyebrow: "CHANGE REVIEW",
    title: "See what changed before yesterday’s decision becomes today’s assumption.",
    text: "Load an earlier export of this dossier. The comparison stays in this browser, shows one difference at a time, and records the response beside the change.",
    load: "Choose a reference dossier",
    replace: "Choose another reference",
    remove: "Clear comparison",
    noReview: "No reference dossier loaded",
    noReviewText: "Export the dossier before a material change, then use that file here as the reference version.",
    invalid: "This file is not a compatible project dossier.",
    different: "Choose an earlier export with the same dossier ID. A different project cannot be treated as a version.",
    tooLarge: "The file is larger than the 2 MB local import limit.",
    identical: "No decision-relevant difference was found.",
    loaded: "Reference loaded. Review every changed decision before closing the comparison.",
    baseline: "Reference",
    compared: "Review started",
    changes: "changes",
    decided: "decisions recorded",
    groups: "Areas",
    all: "All",
    before: "Reference value",
    after: "Current value",
    empty: "Not recorded",
    recommendation: "Suggested response",
    why: "Why this response",
    decision: "Project decision",
    owner: "Owner",
    due: "Due date",
    evidence: "Evidence reference",
    note: "Decision note",
    openPhase: "Open affected phase",
    boundary: "The suggestion is a review prompt, not an automatic legal or release decision. Keep raw evidence outside this dossier.",
    recommendations: {
      review: "Review the difference",
      reassess: "Reassess affected evidence",
      restart: "Reopen the affected gate",
    },
    recommendationWhy: {
      review: "The operating record changed. Confirm that ownership, timing, and evidence still agree.",
      reassess: "This can change an evaluation, risk treatment, or control claim. Recheck the affected evidence.",
      restart: "This changes scope, territory, autonomy, or a release condition. Reopen the gate before relying on the earlier decision.",
    },
    decisions: {
      pending: "Decision pending",
      accepted: "Reviewed, no gate reopened",
      reassess: "Reassess affected evidence",
      restart: "Reopen affected gate",
    },
    domains: { scope: "Scope", risk: "Risk and law", architecture: "Architecture", evaluation: "Evaluation", controls: "Controls", ownership: "Ownership", delivery: "Delivery" },
    properties: { status: "Status", owner: "Owner", due_date: "Due date", evidence_ref: "Evidence reference" },
    statuses: { not_started: "Not started", in_progress: "In progress", done: "Done", not_applicable: "Not applicable" },
    matched: "Matched control set",
    completed: "Completed lifecycle phases",
  },
  fr: {
    eyebrow: "REVUE DES CHANGEMENTS",
    title: "Voir ce qui a changé avant qu’une ancienne décision devienne une hypothèse silencieuse.",
    text: "Chargez un ancien export de ce dossier. La comparaison reste dans ce navigateur, présente une différence à la fois et consigne la réponse avec le changement.",
    load: "Choisir un dossier de référence",
    replace: "Choisir une autre référence",
    remove: "Effacer la comparaison",
    noReview: "Aucun dossier de référence chargé",
    noReviewText: "Exportez le dossier avant un changement significatif, puis utilisez ce fichier ici comme version de référence.",
    invalid: "Ce fichier n’est pas un dossier projet compatible.",
    different: "Choisissez un ancien export portant le même identifiant de dossier. Un autre projet ne constitue pas une version.",
    tooLarge: "Le fichier dépasse la limite locale de 2 Mo.",
    identical: "Aucune différence influençant les décisions n’a été trouvée.",
    loaded: "Référence chargée. Examinez chaque changement avant de clore la comparaison.",
    baseline: "Référence",
    compared: "Revue démarrée",
    changes: "changements",
    decided: "décisions consignées",
    groups: "Domaines",
    all: "Tous",
    before: "Valeur de référence",
    after: "Valeur actuelle",
    empty: "Non renseigné",
    recommendation: "Réponse suggérée",
    why: "Pourquoi cette réponse",
    decision: "Décision du projet",
    owner: "Responsable",
    due: "Échéance",
    evidence: "Référence de preuve",
    note: "Note de décision",
    openPhase: "Ouvrir la phase concernée",
    boundary: "La suggestion invite à revoir la décision. Elle ne constitue ni une décision juridique ni une autorisation de mise en service. Gardez les preuves brutes hors de ce dossier.",
    recommendations: {
      review: "Examiner la différence",
      reassess: "Réévaluer les preuves concernées",
      restart: "Rouvrir la décision concernée",
    },
    recommendationWhy: {
      review: "L’enregistrement opérationnel a changé. Vérifiez que responsabilité, calendrier et preuves restent cohérents.",
      reassess: "Ce changement peut modifier une évaluation, un traitement du risque ou une affirmation de contrôle. Revérifiez les preuves concernées.",
      restart: "Ce changement touche le périmètre, le territoire, l’autonomie ou une condition de mise en service. Rouvrez la décision avant de réutiliser la conclusion précédente.",
    },
    decisions: {
      pending: "Décision à prendre",
      accepted: "Examiné, aucune décision rouverte",
      reassess: "Réévaluer les preuves concernées",
      restart: "Rouvrir la décision concernée",
    },
    domains: { scope: "Périmètre", risk: "Risque et droit", architecture: "Architecture", evaluation: "Évaluation", controls: "Contrôles", ownership: "Responsabilités", delivery: "Mise en œuvre" },
    properties: { status: "État", owner: "Responsable", due_date: "Échéance", evidence_ref: "Référence de preuve" },
    statuses: { not_started: "À faire", in_progress: "En cours", done: "Terminé", not_applicable: "Non applicable" },
    matched: "Ensemble de contrôles associés",
    completed: "Phases du cycle de vie terminées",
  },
};

const contextLabels = {
  en: { organization_type: "Organization type", use_pattern: "AI use pattern", jurisdiction: "Territory", integration_level: "Integration level", autonomy_level: "Autonomy level", risk_level: "Risk orientation" },
  fr: { organization_type: "Type de structure", use_pattern: "Mode d’usage de l’IA", jurisdiction: "Territoire", integration_level: "Niveau d’intégration", autonomy_level: "Niveau d’autonomie", risk_level: "Orientation du risque" },
};

function checklistLabel(locale: Locale, taskId: string, property: string, props: Props) {
  let task = taskId;
  if (taskId.startsWith("phase:")) {
    const phase = Number(taskId.slice(6));
    task = `${locale === "en" ? "Phase" : "Phase"} ${phase} · ${props.phaseTitles[phase] ?? taskId}`;
  } else if (taskId.startsWith("security:")) {
    const id = taskId.slice(9);
    task = props.securityControls.find((control) => control.id === id)?.label ?? id;
  } else if (taskId.startsWith("control:")) {
    const id = taskId.slice(8);
    task = props.matchedControls.find((control) => control.id === id)?.title ?? id;
  }
  return `${task} · ${copy[locale].properties[property as keyof typeof copy.en.properties] ?? property}`;
}

function changeLabel(item: ChangeReviewItem, props: Props) {
  const parts = item.path.split(":");
  const group = parts.shift() ?? "";
  const id = parts.shift() ?? "";
  if (group === "context") return contextLabels[props.locale][id as keyof typeof contextLabels.en] ?? id;
  if (group === "lifecycle") return id === "completed_phases" ? copy[props.locale].completed : props.fieldCatalog[id]?.label ?? id;
  if (["system_register", "risk_assessment", "evaluation_plan"].includes(group)) return getProjectArtifactFieldLabel(props.locale, group as "system_register" | "risk_assessment" | "evaluation_plan", id);
  if (group === "security") return props.securityControls.find((control) => control.id === id)?.label ?? id;
  if (group === "controls") return copy[props.locale].matched;
  if (group === "checklist") {
    const property = parts.pop() ?? "";
    return checklistLabel(props.locale, [id, ...parts].join(":"), property, props);
  }
  return item.path;
}

function phaseFor(item: ChangeReviewItem, props: Props) {
  const [group, id] = item.path.split(":");
  if (group === "lifecycle") return props.fieldCatalog[id]?.phase;
  if (group === "system_register") return ({ name: 0, owner: 0, purpose: 0, business_process: 2, affected_people: 0, data_classes: 2, provider_version: 5, human_approval: 5, next_review: 11, decision_reference: 11 } as Record<string, number>)[id];
  if (group === "risk_assessment") return ({ evaluator: 0, next_review: 11, data_categories: 4, data_provenance: 2, transparency_recourse: 4, harm_scenarios: 4, mitigations: 7, residual_risk_authority: 0, decision: 9, conditions: 9 } as Record<string, number>)[id];
  if (group === "evaluation_plan") return ({ decision_owner: 0, deadline: 0, frozen_cases: 6, baseline: 1, value_threshold: 6, quality_threshold: 6, critical_segments: 6, stop_rule: 6, reproducibility_refs: 11 } as Record<string, number>)[id];
  if (group === "context") return ["jurisdiction", "risk_level"].includes(id) ? 4 : ["integration_level", "autonomy_level"].includes(id) ? 5 : 0;
  if (group === "security" || group === "controls") return 7;
  return undefined;
}

function displayValue(value: string, item: ChangeReviewItem, props: Props) {
  if (!value) return copy[props.locale].empty;
  const [group, id] = item.path.split(":");
  if (group === "context") {
    const maps: Record<string, Record<string, string>> = {
      organization_type: props.locale === "en" ? { independent: "Independent", tpe: "Micro-business", pme: "SME", nonprofit: "Nonprofit", public: "Public service" } : { independent: "Indépendant", tpe: "Très petite entreprise", pme: "PME", nonprofit: "Organisation sans but lucratif", public: "Service public" },
      use_pattern: props.locale === "en" ? { generation: "Generation", retrieval: "Retrieval", classification: "Classification", prediction: "Prediction", conversation: "Conversation", multimodal: "Multimodal", agentic: "Agentic action" } : { generation: "Génération", retrieval: "Recherche documentaire", classification: "Classification", prediction: "Prédiction", conversation: "Conversation", multimodal: "Multimodal", agentic: "Action agentique" },
      jurisdiction: props.locale === "en" ? { CH: "Switzerland", EU: "European Union", BOTH: "Switzerland + EU" } : { CH: "Suisse", EU: "Union européenne", BOTH: "Suisse + UE" },
      integration_level: props.locale === "en" ? { copilot: "Copilot", agent: "Business agent", agency: "Orchestrated agency" } : { copilot: "Copilote", agent: "Agent métier", agency: "Agence orchestrée" },
    };
    return maps[id]?.[value] ?? (["autonomy_level", "risk_level"].includes(id) ? `${id === "autonomy_level" ? "A" : "R"}${value}` : value);
  }
  if (group === "security") return value === "true" ? (props.locale === "en" ? "Confirmed" : "Confirmé") : (props.locale === "en" ? "Not confirmed" : "Non confirmé");
  if (group === "controls") {
    try {
      return (JSON.parse(value) as string[]).map((controlId) => props.matchedControls.find((control) => control.id === controlId)?.title ?? controlId).join(", ") || copy[props.locale].empty;
    } catch { return value; }
  }
  if (group === "lifecycle" && id === "completed_phases") {
    try {
      return (JSON.parse(value) as number[]).map((phase) => `Phase ${phase} · ${props.phaseTitles[phase] ?? ""}`.trim()).join(", ") || copy[props.locale].empty;
    } catch { return value; }
  }
  const property = item.path.split(":").at(-1);
  if (group === "checklist" && property === "status") return copy[props.locale].statuses[value as keyof typeof copy.en.statuses] ?? value.replaceAll("_", " ");
  return value;
}

export function ProjectChangeReviewWorkbench(props: Props) {
  const labels = copy[props.locale];
  const inputRef = useRef<HTMLInputElement>(null);
  const [notice, setNotice] = useState("");
  const [activeDomain, setActiveDomain] = useState<ChangeDomain | "all">("all");
  const [activePath, setActivePath] = useState("");
  const items = useMemo(() => Object.values(props.review?.items ?? {}), [props.review]);
  const availableDomains = (["scope", "risk", "architecture", "evaluation", "controls", "ownership", "delivery"] as ChangeDomain[]).filter((domain) => items.some((item) => item.domain === domain));
  const selectedDomain = activeDomain === "all" || availableDomains.includes(activeDomain) ? activeDomain : "all";
  const visibleItems = selectedDomain === "all" ? items : items.filter((item) => item.domain === selectedDomain);
  const activeItem = visibleItems.find((item) => item.path === activePath) ?? visibleItems[0];
  const decided = items.filter((item) => item.decision !== "pending").length;

  const loadReference = async (file: File | undefined) => {
    if (!file) return;
    try {
      if (file.size > 2_000_000) { setNotice(labels.tooLarge); return; }
      const parsed = parseProjectDossier(await file.text());
      if (!parsed.ok) { setNotice(labels.invalid); return; }
      if (parsed.value.dossier_id !== props.dossierId) { setNotice(labels.different); return; }
      const review = createProjectChangeReview(parsed.value, props.currentSnapshot, new Date().toISOString(), parsed.migratedFrom ?? parsed.value.schema_version);
      props.onChange(review);
      props.onDirty();
      setActiveDomain("all");
      setActivePath(Object.keys(review.items)[0] ?? "");
      setNotice(Object.keys(review.items).length ? labels.loaded : labels.identical);
    } catch {
      setNotice(labels.invalid);
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const updateItem = (path: string, patch: Partial<ChangeReviewItem>) => {
    if (!props.review) return;
    props.onChange({ ...props.review, items: { ...props.review.items, [path]: { ...props.review.items[path], ...patch } } });
    props.onDirty();
  };

  return <section aria-labelledby="change-review-title" className="change-review-workbench">
    <header>
      <div><p className="eyebrow">{labels.eyebrow}</p><h4 id="change-review-title">{labels.title}</h4><p>{labels.text}</p></div>
      <output aria-live="polite"><strong>{items.length}</strong><span>{labels.changes}</span><small>{decided}/{items.length} {labels.decided}</small></output>
    </header>

    {!props.review && <div className="change-review-empty"><div><strong>{labels.noReview}</strong><p>{labels.noReviewText}</p></div><button className="button primary" disabled={!props.dossierId} onClick={() => inputRef.current?.click()} type="button">{labels.load}</button></div>}

    {props.review && <>
      <div className="change-review-meta">
        <p><span>{labels.baseline}</span><strong>{new Intl.DateTimeFormat(props.locale === "fr" ? "fr-CH" : "en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(props.review.baseline.updated_at))}</strong><small>{props.review.baseline.schema_version}</small></p>
        <p><span>{labels.compared}</span><strong>{new Intl.DateTimeFormat(props.locale === "fr" ? "fr-CH" : "en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(props.review.compared_at))}</strong><small>{props.review.baseline.dossier_id}</small></p>
        <div><button className="button secondary" onClick={() => inputRef.current?.click()} type="button">{labels.replace}</button><button className="button change-review-clear" onClick={() => { props.onChange(null); props.onDirty(); setNotice(""); }} type="button">{labels.remove}</button></div>
      </div>

      {items.length > 0 && <div className="change-review-body">
        <nav aria-label={labels.groups} className="change-domain-router">
          <button aria-current={selectedDomain === "all" ? "page" : undefined} onClick={() => setActiveDomain("all")} type="button"><strong>{labels.all}</strong><span>{items.length}</span></button>
          {availableDomains.map((domain) => <button aria-current={selectedDomain === domain ? "page" : undefined} key={domain} onClick={() => setActiveDomain(domain)} type="button"><strong>{labels.domains[domain]}</strong><span>{items.filter((item) => item.domain === domain).length}</span></button>)}
        </nav>
        {activeItem && <div className="change-item-layout">
          <nav aria-label={props.locale === "en" ? "Changed decisions" : "Décisions modifiées"}>{visibleItems.map((item) => <button aria-current={activeItem.path === item.path ? "step" : undefined} data-change={item.path} data-decision={item.decision} key={item.path} onClick={() => setActivePath(item.path)} type="button"><span>{item.decision === "pending" ? "○" : "✓"}</span><strong>{changeLabel(item, props)}</strong><small>{labels.domains[item.domain]}</small></button>)}</nav>
          <article data-change={activeItem.path} data-decision={activeItem.decision}>
            <header><div><span>{labels.domains[activeItem.domain]}</span><h5>{changeLabel(activeItem, props)}</h5></div>{phaseFor(activeItem, props) !== undefined && <button onClick={() => props.onOpenPhase(phaseFor(activeItem, props)!)} type="button">{labels.openPhase} {phaseFor(activeItem, props)}</button>}</header>
            <div className="change-values"><section><span>{labels.before}</span><p>{displayValue(activeItem.before, activeItem, props)}</p></section><section><span>{labels.after}</span><p>{displayValue(activeItem.after, activeItem, props)}</p></section></div>
            <aside><span>{labels.recommendation}</span><strong>{labels.recommendations[activeItem.recommended_action]}</strong><p><b>{labels.why}</b> {labels.recommendationWhy[activeItem.recommended_action]}</p></aside>
            <div className="change-decision-fields">
              <label><span>{labels.decision}</span><select aria-label={`${labels.decision}: ${changeLabel(activeItem, props)}`} onChange={(event) => updateItem(activeItem.path, { decision: event.target.value as ChangeDecision })} value={activeItem.decision}>{Object.entries(labels.decisions).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
              <label><span>{labels.owner}</span><input aria-label={`${labels.owner}: ${changeLabel(activeItem, props)}`} onChange={(event) => updateItem(activeItem.path, { owner: event.target.value })} value={activeItem.owner} /></label>
              <label><span>{labels.due}</span><input aria-label={`${labels.due}: ${changeLabel(activeItem, props)}`} onChange={(event) => updateItem(activeItem.path, { due_date: event.target.value })} type="date" value={activeItem.due_date} /></label>
              <label><span>{labels.evidence}</span><input aria-label={`${labels.evidence}: ${changeLabel(activeItem, props)}`} onChange={(event) => updateItem(activeItem.path, { evidence_ref: event.target.value })} value={activeItem.evidence_ref} /></label>
              <label className="change-note"><span>{labels.note}</span><textarea aria-label={`${labels.note}: ${changeLabel(activeItem, props)}`} onChange={(event) => updateItem(activeItem.path, { note: event.target.value })} rows={3} value={activeItem.note} /></label>
            </div>
          </article>
        </div>}
      </div>}
    </>}

    {props.review && items.length === 0 && <p className="change-review-notice" role="status">{labels.identical}</p>}
    {notice && !(props.review && items.length === 0) && <p className="change-review-notice" role="status">{notice}</p>}
    <input accept="application/json,.json" aria-label={labels.load} className="dossier-file-input" onChange={(event) => void loadReference(event.target.files?.[0])} ref={inputRef} type="file" />
    <footer>{labels.boundary}</footer>
  </section>;
}
