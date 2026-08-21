"use client";

import { useEffect, useMemo, useState } from "react";

import taskTimeEvidence from "../public/data/task-time-evidence.v1.json";
import {
  buildEvidenceTransfer,
  buildNetPlanningRange,
  calculateHumanTimeScenario,
  derivePlanningRange,
  listEvidenceOptions,
} from "./task-time-transfer.mjs";
import type {
  CompatibilityStatus,
  EvidenceTarget,
  ExpertiseLevel,
  IntegrationMode,
  QualityGate,
  TaskTimeEvidenceRecord,
  TaskTimeRegistry,
} from "./task-time-transfer.mjs";

type Locale = "en" | "fr";
type UsePatternId = "generation" | "retrieval" | "classification" | "prediction" | "conversation" | "multimodal" | "agentic";

export type TaskTimePlanningRange = {
  source: "external_evidence" | "local_hypothesis";
  low: number;
  central: number;
  high: number;
  compatibility: string;
  evidence_id: string | null;
};

const registry = taskTimeEvidence as unknown as TaskTimeRegistry;
const setupPresets: Record<IntegrationMode, number> = { copilot: 8, agent: 40, agency: 120 };
const defaultProfileByPattern: Record<UsePatternId, string> = {
  generation: "professional_writing",
  retrieval: "information_synthesis",
  classification: "knowledge_analysis",
  prediction: "predictive_decision_support",
  conversation: "customer_support",
  multimodal: "multimodal_review",
  agentic: "hard_automation_project",
};

const content = {
  en: {
    taskStep: "01 · Define one task",
    taskProfile: "Closest measured task",
    quality: "Required output state",
    expertise: "Operator experience",
    qualityOptions: { draft: "Draft to review", reviewed: "Reviewed output", production: "Production-ready result" },
    expertiseOptions: { developing: "Developing", mixed: "Mixed", experienced: "Experienced" },
    taskHelp: "Choose the output unit you can count repeatedly. The organization is deliberately absent because it changes controls, not the task benchmark.",
    evidenceStep: "02 · Choose an evidence anchor",
    evidenceHelp: "A comparable source can frame a test. Context-only evidence stays visible but cannot generate a transferable percentage.",
    evidenceGrade: "Evidence grade",
    sample: "Sample",
    source: "Open the primary source",
    statuses: { compatible: "Comparable", partial: "Hypothesis only", context: "Context only", incompatible: "Not transferable" },
    reasons: { task_profile: "different task", integration_mode: "different operating mode", quality_gate: "different quality gate", expertise_level: "different experience", context_only: "no measured transferable human-time ratio" },
    noEvidence: "No source in the registry matches this task yet. Use the human-time account below and replace it with pilot observations.",
    timeStep: "03 · Count the human time that remains",
    baseline: "Human minutes without AI",
    cases: "Cases per month",
    eligible: "Share genuinely eligible",
    components: "Open the human-time breakdown",
    componentsHelp: "Machine runtime is separate. Enter only minutes spent by people, including review and failed cases.",
    preparation: "Preparation and context",
    supervision: "Supervision",
    verification: "Verification",
    correction: "Corrections",
    exceptionRate: "Cases needing exception work",
    exceptionMinutes: "Minutes per exception",
    setup: "One-off setup effort",
    amortization: "Spread setup over",
    units: { minutes: "min", cases: "cases", percent: "%", hours: "hours", months: "months" },
    results: {
      heading: "Your net planning range",
      planning: "source evidence constrained by your declared human work",
      baseline: "Eligible human workload today",
      withAi: "Central human time with AI",
      low: "Low net case",
      central: "Central net case",
      high: "High net case",
      payback: "Setup payback range",
      perMonth: "human hours per month",
      localFloor: "local floor before setup",
    },
    evidenceRange: "Unadjusted source range on the comparable task",
    evidenceBlocked: "This source does not produce a transferable range for the selected contract.",
    negative: "A negative value means the scenario consumes more human time than the current process.",
    boundary: "For each source point, the engine keeps the greater of the source-implied residual time and your declared human-work floor, then adds amortized setup. This avoids double counting while preventing hidden oversight. The pilot must replace every planning input with observations.",
  },
  fr: {
    taskStep: "01 · Définir une seule tâche",
    taskProfile: "Tâche mesurée la plus proche",
    quality: "État exigé du résultat",
    expertise: "Expérience de l’opérateur",
    qualityOptions: { draft: "Brouillon à relire", reviewed: "Résultat relu", production: "Résultat prêt pour la production" },
    expertiseOptions: { developing: "En développement", mixed: "Mixte", experienced: "Expérimentée" },
    taskHelp: "Choisissez une unité de résultat que vous pouvez compter plusieurs fois. L’organisation est volontairement absente, car elle modifie les contrôles, pas la référence de la tâche.",
    evidenceStep: "02 · Choisir un ancrage de preuve",
    evidenceHelp: "Une source comparable peut encadrer un test. Une source seulement contextuelle reste visible, mais ne peut pas générer un pourcentage transférable.",
    evidenceGrade: "Niveau de preuve",
    sample: "Échantillon",
    source: "Ouvrir la source primaire",
    statuses: { compatible: "Comparable", partial: "Hypothèse seulement", context: "Contexte seulement", incompatible: "Non transférable" },
    reasons: { task_profile: "tâche différente", integration_mode: "mode opératoire différent", quality_gate: "seuil de qualité différent", expertise_level: "expérience différente", context_only: "aucun ratio mesuré et transférable de temps humain" },
    noEvidence: "Aucune source du registre ne correspond encore à cette tâche. Utilisez le décompte du temps humain ci-dessous, puis remplacez-le par les observations du pilote.",
    timeStep: "03 · Compter le temps humain qui reste",
    baseline: "Minutes humaines sans IA",
    cases: "Cas par mois",
    eligible: "Part réellement éligible",
    components: "Ouvrir la décomposition du temps humain",
    componentsHelp: "Le temps machine reste séparé. Saisissez uniquement les minutes des personnes, y compris la revue et les cas en échec.",
    preparation: "Préparation et contexte",
    supervision: "Supervision",
    verification: "Vérification",
    correction: "Corrections",
    exceptionRate: "Cas nécessitant une exception",
    exceptionMinutes: "Minutes par exception",
    setup: "Effort initial de mise en place",
    amortization: "Répartir la mise en place sur",
    units: { minutes: "min", cases: "cas", percent: "%", hours: "heures", months: "mois" },
    results: {
      heading: "Votre fourchette nette de planification",
      planning: "preuve externe contrainte par le travail humain déclaré",
      baseline: "Charge humaine éligible actuelle",
      withAi: "Temps humain central avec IA",
      low: "Cas net bas",
      central: "Cas net central",
      high: "Cas net haut",
      payback: "Fourchette d’amortissement",
      perMonth: "heures humaines par mois",
      localFloor: "plancher local avant mise en place",
    },
    evidenceRange: "Plage brute de la source pour la tâche comparable",
    evidenceBlocked: "Cette source ne produit aucune plage transférable pour le contrat sélectionné.",
    negative: "Une valeur négative signifie que le scénario consomme plus de temps humain que le processus actuel.",
    boundary: "Pour chaque point de la source, le moteur conserve le plus grand temps entre le résiduel déduit de la source et votre plancher de travail humain, puis ajoute la mise en place amortie. Cette règle évite le double comptage sans masquer le contrôle humain. Le pilote doit remplacer chaque paramètre par une observation.",
  },
} as const;

const formatPercent = (value: number, locale: Locale) => new Intl.NumberFormat(locale === "fr" ? "fr-CH" : "en-GB", { maximumFractionDigits: 1, signDisplay: value < 0 ? "always" : "auto" }).format(value * 100);
const formatNumber = (value: number, locale: Locale, digits = 1) => new Intl.NumberFormat(locale === "fr" ? "fr-CH" : "en-GB", { maximumFractionDigits: digits }).format(value);

export function TaskTimeCalibrator({
  locale,
  integrationMode,
  usePattern,
  baselineMinutes,
  monthlyCases,
  eligibleShare,
  setupHours,
  onIntegrationModeChange,
  onBaselineMinutesChange,
  onMonthlyCasesChange,
  onEligibleShareChange,
  onSetupHoursChange,
  onPlanningRangeChange,
}: {
  locale: Locale;
  integrationMode: IntegrationMode;
  usePattern: UsePatternId;
  baselineMinutes: number;
  monthlyCases: number;
  eligibleShare: number;
  setupHours: number;
  onIntegrationModeChange: (value: IntegrationMode) => void;
  onBaselineMinutesChange: (value: number) => void;
  onMonthlyCasesChange: (value: number) => void;
  onEligibleShareChange: (value: number) => void;
  onSetupHoursChange: (value: number) => void;
  onPlanningRangeChange: (value: TaskTimePlanningRange) => void;
}) {
  const t = content[locale];
  const [profileId, setProfileId] = useState(defaultProfileByPattern[usePattern]);
  const [qualityGate, setQualityGate] = useState<QualityGate>("draft");
  const [expertiseLevel, setExpertiseLevel] = useState<ExpertiseLevel>("mixed");
  const [selectedEvidenceId, setSelectedEvidenceId] = useState("");
  const [preparationMinutes, setPreparationMinutes] = useState(5);
  const [supervisionMinutes, setSupervisionMinutes] = useState(5);
  const [verificationMinutes, setVerificationMinutes] = useState(15);
  const [correctionMinutes, setCorrectionMinutes] = useState(5);
  const [exceptionRate, setExceptionRate] = useState(20);
  const [exceptionMinutes, setExceptionMinutes] = useState(15);
  const [amortizationMonths, setAmortizationMonths] = useState(12);
  const selectedProfile = registry.task_profiles.find((profile) => profile.profile_id === profileId) ?? registry.task_profiles[0];
  const target = useMemo<EvidenceTarget>(() => ({
    task_profile_id: profileId,
    integration_mode: integrationMode,
    quality_gate: qualityGate,
    expertise_level: expertiseLevel,
  }), [expertiseLevel, integrationMode, profileId, qualityGate]);
  const evidenceOptions = useMemo(() => listEvidenceOptions(registry, target).filter(({ record }) => (
    record.transfer.allowed_profiles.includes(profileId) || record.task_contract.profile_id === profileId
  )), [profileId, target]);
  const selectedOption = evidenceOptions.find(({ record }) => record.evidence_id === selectedEvidenceId) ?? evidenceOptions[0];
  const selectedRecord = selectedOption?.record as TaskTimeEvidenceRecord | undefined;
  const selectedCompatibility = selectedOption?.compatibility;

  const humanScenario = useMemo(() => calculateHumanTimeScenario({
    baseline_human_minutes: baselineMinutes,
    monthly_cases: monthlyCases,
    eligible_share: eligibleShare,
    preparation_minutes: preparationMinutes,
    supervision_minutes: supervisionMinutes,
    verification_minutes: verificationMinutes,
    correction_minutes: correctionMinutes,
    exception_rate: exceptionRate,
    exception_minutes: exceptionMinutes,
    setup_hours: setupHours,
    amortization_months: amortizationMonths,
  }), [amortizationMonths, baselineMinutes, correctionMinutes, eligibleShare, exceptionMinutes, exceptionRate, monthlyCases, preparationMinutes, setupHours, supervisionMinutes, verificationMinutes]);
  const evidenceTransfer = useMemo(() => buildEvidenceTransfer(selectedRecord, target, {
    baseline_human_minutes: baselineMinutes,
    monthly_cases: monthlyCases,
    eligible_share: eligibleShare,
  }), [baselineMinutes, eligibleShare, monthlyCases, selectedRecord, target]);
  const netPlanningRange = useMemo(() => buildNetPlanningRange(evidenceTransfer, humanScenario), [evidenceTransfer, humanScenario]);
  const planningRange = useMemo(() => derivePlanningRange(evidenceTransfer, humanScenario) as TaskTimePlanningRange, [evidenceTransfer, humanScenario]);

  useEffect(() => onPlanningRangeChange(planningRange), [onPlanningRangeChange, planningRange]);

  const selectProfile = (nextProfileId: string) => {
    const profile = registry.task_profiles.find((item) => item.profile_id === nextProfileId) ?? registry.task_profiles[0];
    setProfileId(profile.profile_id);
    setQualityGate(profile.quality_gates.includes("reviewed") ? "reviewed" : profile.quality_gates[0]);
    setExpertiseLevel(profile.profile_id === "software_mature_repo" || profile.profile_id === "hard_automation_project" ? "experienced" : "mixed");
    setSelectedEvidenceId("");
  };
  const reasonText = (status: CompatibilityStatus, reasons: string[]) => {
    const translated = reasons.map((reason) => t.reasons[reason as keyof typeof t.reasons]).filter(Boolean);
    return translated.length ? `${t.statuses[status]}: ${translated.join(", ")}` : t.statuses[status];
  };
  const transferableRange = evidenceTransfer.ok ? evidenceTransfer.scenarios : null;
  const netScenarios = netPlanningRange.scenarios;
  const paybacks = [netScenarios.low.setup_payback_months, netScenarios.high.setup_payback_months].filter((value): value is number => value != null);
  const paybackRange = paybacks.length ? `${formatNumber(Math.min(...paybacks), locale)}–${formatNumber(Math.max(...paybacks), locale)} ${t.units.months}` : "n/a";
  const inputNumber = (value: string, minimum: number, maximum: number) => Math.min(maximum, Math.max(minimum, Number(value) || minimum));

  return (
    <>
      <div className="task-time-guide">
        <section className="task-time-definition" aria-labelledby="task-time-definition-title">
          <header><span>01</span><div><h3 id="task-time-definition-title">{t.taskStep}</h3><p>{t.taskHelp}</p></div></header>
          <div className="task-time-selects">
            <label><span>{t.taskProfile}</span><select onChange={(event) => selectProfile(event.target.value)} value={profileId}>{registry.task_profiles.map((profile) => <option key={profile.profile_id} value={profile.profile_id}>{profile.label[locale]}</option>)}</select></label>
            <label><span>{t.quality}</span><select onChange={(event) => setQualityGate(event.target.value as QualityGate)} value={qualityGate}>{selectedProfile.quality_gates.map((gate) => <option key={gate} value={gate}>{t.qualityOptions[gate]}</option>)}</select></label>
            <label><span>{t.expertise}</span><select onChange={(event) => setExpertiseLevel(event.target.value as ExpertiseLevel)} value={expertiseLevel}>{(["developing", "mixed", "experienced"] as ExpertiseLevel[]).map((level) => <option key={level} value={level}>{t.expertiseOptions[level]}</option>)}</select></label>
          </div>
          <p className="task-profile-note"><strong>{selectedProfile.label[locale]}</strong>{selectedProfile.description[locale]} <span>{selectedProfile.output_unit[locale]}</span></p>
        </section>

        <section className="task-time-evidence" aria-labelledby="task-time-evidence-title">
          <header><span>02</span><div><h3 id="task-time-evidence-title">{t.evidenceStep}</h3><p>{t.evidenceHelp}</p></div></header>
          {evidenceOptions.length ? <fieldset><legend className="visually-hidden">{t.evidenceStep}</legend><div className="task-time-evidence-options">{evidenceOptions.map(({ record, compatibility }) => <label data-compatibility={compatibility.status} key={record.evidence_id}><input aria-label={record.title[locale]} checked={record.evidence_id === selectedRecord?.evidence_id} name="task-time-evidence" onChange={() => setSelectedEvidenceId(record.evidence_id)} type="radio" value={record.evidence_id} /><span><small>{reasonText(compatibility.status, compatibility.reasons)}</small><strong>{record.title[locale]}</strong><em>{t.evidenceGrade} {record.measurement.evidence_grade}{record.measurement.sample_size ? ` · ${t.sample} ${record.measurement.sample_size}` : ""}</em></span></label>)}</div></fieldset> : <p className="task-time-no-evidence">{t.noEvidence}</p>}
          {selectedRecord && <article className="task-time-evidence-detail" data-compatibility={selectedCompatibility?.status}><div><span>{selectedRecord.evidence_id}</span><strong>{selectedRecord.measurement.notes[locale]}</strong><p>{selectedRecord.transfer.limits[locale]}</p></div><a href={selectedRecord.sources[0].url} rel="noreferrer" target="_blank">{t.source} ↗</a></article>}
        </section>
      </div>

      <div className="calibrator-shell task-time-calibrator-shell">
        <div className="calibrator-controls">
          <fieldset><legend>{t.timeStep}</legend><div className="calibrator-levels">{(["copilot", "agent", "agency"] as IntegrationMode[]).map((mode) => <button aria-pressed={integrationMode === mode} key={mode} onClick={() => onIntegrationModeChange(mode)} type="button"><strong>{mode === "copilot" ? (locale === "en" ? "Copilot" : "Copilote") : mode === "agent" ? (locale === "en" ? "Bounded automation" : "Automatisation bornée") : (locale === "en" ? "Hard automation" : "Automatisation forte")}</strong><span>{mode === "copilot" ? "A0–A1" : mode === "agent" ? "A1–A3" : "A3–A4"}</span></button>)}</div></fieldset>
          <div className="calibrator-inputs task-time-core-inputs">
            <label><span>{t.baseline}</span><div><input aria-label={t.baseline} max="10080" min="1" onChange={(event) => onBaselineMinutesChange(inputNumber(event.target.value, 1, 10080))} step="1" type="number" value={baselineMinutes} /><small>{t.units.minutes}</small></div></label>
            <label><span>{t.cases}</span><div><input aria-label={t.cases} max="1000000" min="1" onChange={(event) => onMonthlyCasesChange(inputNumber(event.target.value, 1, 1000000))} step="1" type="number" value={monthlyCases} /><small>{t.units.cases}</small></div></label>
            <label><span>{t.eligible}</span><div><input aria-label={t.eligible} max="100" min="0" onChange={(event) => onEligibleShareChange(inputNumber(event.target.value, 0, 100))} step="1" type="number" value={eligibleShare} /><small>{t.units.percent}</small></div></label>
          </div>
          <details className="task-time-components"><summary>{t.components}<span>+</span></summary><p>{t.componentsHelp}</p><div className="calibrator-inputs">
            <label><span>{t.preparation}</span><div><input aria-label={t.preparation} max="10080" min="0" onChange={(event) => setPreparationMinutes(inputNumber(event.target.value, 0, 10080))} type="number" value={preparationMinutes} /><small>{t.units.minutes}</small></div></label>
            <label><span>{t.supervision}</span><div><input aria-label={t.supervision} max="10080" min="0" onChange={(event) => setSupervisionMinutes(inputNumber(event.target.value, 0, 10080))} type="number" value={supervisionMinutes} /><small>{t.units.minutes}</small></div></label>
            <label><span>{t.verification}</span><div><input aria-label={t.verification} max="10080" min="0" onChange={(event) => setVerificationMinutes(inputNumber(event.target.value, 0, 10080))} type="number" value={verificationMinutes} /><small>{t.units.minutes}</small></div></label>
            <label><span>{t.correction}</span><div><input aria-label={t.correction} max="10080" min="0" onChange={(event) => setCorrectionMinutes(inputNumber(event.target.value, 0, 10080))} type="number" value={correctionMinutes} /><small>{t.units.minutes}</small></div></label>
            <label><span>{t.exceptionRate}</span><div><input aria-label={t.exceptionRate} max="100" min="0" onChange={(event) => setExceptionRate(inputNumber(event.target.value, 0, 100))} type="number" value={exceptionRate} /><small>{t.units.percent}</small></div></label>
            <label><span>{t.exceptionMinutes}</span><div><input aria-label={t.exceptionMinutes} max="10080" min="0" onChange={(event) => setExceptionMinutes(inputNumber(event.target.value, 0, 10080))} type="number" value={exceptionMinutes} /><small>{t.units.minutes}</small></div></label>
            <label><span>{t.setup}</span><div><input aria-label={t.setup} max="1000000" min="0" onChange={(event) => onSetupHoursChange(inputNumber(event.target.value, 0, 1000000))} type="number" value={setupHours} /><small>{t.units.hours}</small></div><em>{locale === "en" ? "Mode preset" : "Repère du mode"}: {setupPresets[integrationMode]} h</em></label>
            <label><span>{t.amortization}</span><div><input aria-label={t.amortization} max="120" min="1" onChange={(event) => setAmortizationMonths(inputNumber(event.target.value, 1, 120))} type="number" value={amortizationMonths} /><small>{t.units.months}</small></div></label>
          </div></details>
        </div>

        <output className="calibrator-results" aria-live="polite">
          <div className="calibrator-result-head"><span>{t.results.heading}</span><strong>{formatPercent(netScenarios.central.reduction_fraction, locale)}%</strong><small>{t.results.planning}</small></div>
          <div className="calibrator-result-grid">
            <p><span>{t.results.baseline}</span><strong>{formatNumber(humanScenario.baseline_eligible_human_hours, locale)} h</strong><small>{formatNumber(humanScenario.eligible_cases, locale)} {t.units.cases}</small></p>
            <p><span>{t.results.withAi}</span><strong>{formatNumber(netScenarios.central.human_time_with_ai_minutes, locale)} min</strong><small>{formatNumber(netScenarios.central.local_operating_floor_minutes, locale)} min {t.results.localFloor}</small></p>
            <p data-range="low"><span>{t.results.low}</span><strong>{formatPercent(netScenarios.low.reduction_fraction, locale)}%</strong><small>{formatNumber(netScenarios.low.human_hours_saved_per_month, locale)} {t.results.perMonth}</small></p>
            <p data-range="central"><span>{t.results.central}</span><strong>{formatPercent(netScenarios.central.reduction_fraction, locale)}%</strong><small>{formatNumber(netScenarios.central.human_hours_saved_per_month, locale)} {t.results.perMonth}</small></p>
            <p data-range="high"><span>{t.results.high}</span><strong>{formatPercent(netScenarios.high.reduction_fraction, locale)}%</strong><small>{formatNumber(netScenarios.high.human_hours_saved_per_month, locale)} {t.results.perMonth}</small></p>
            <p><span>{t.results.payback}</span><strong>{paybackRange}</strong></p>
          </div>
          <div className="task-time-source-range" data-transferable={Boolean(transferableRange)}><span>{t.evidenceRange}</span>{transferableRange ? <strong>{formatPercent(transferableRange.low.reduction_fraction, locale)}–{formatPercent(transferableRange.central.reduction_fraction, locale)}–{formatPercent(transferableRange.high.reduction_fraction, locale)}%</strong> : <p>{t.evidenceBlocked}</p>}<small>{selectedRecord ? `${selectedRecord.evidence_id} · ${t.statuses[selectedCompatibility?.status ?? "incompatible"]}` : t.noEvidence}</small></div>
          <p className="calibrator-equation">max({netScenarios.central.source_implied_human_minutes == null ? "n/a" : `${formatNumber(netScenarios.central.source_implied_human_minutes, locale)} min`}, {formatNumber(netScenarios.central.local_operating_floor_minutes, locale)} min) + {formatNumber(netScenarios.central.amortized_setup_minutes_per_case, locale)} min = <strong>{formatNumber(netScenarios.central.human_time_with_ai_minutes, locale)} min</strong> {locale === "en" ? "net in the central case" : "nettes dans le cas central"}</p>
          {netScenarios.low.reduction_fraction < 0 && <p className="task-time-negative">{t.negative}</p>}
        </output>
      </div>
      <aside className="calibrator-note"><strong>{locale === "en" ? "HOW THE NET RANGE IS BUILT" : "COMMENT LA FOURCHETTE NETTE EST CONSTRUITE"}</strong><p>{t.boundary}</p></aside>
    </>
  );
}
