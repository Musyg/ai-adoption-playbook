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
  calculable: boolean;
  unavailable_reason: "no_eligible_cases" | null;
  source: "external_evidence" | "local_hypothesis";
  low: number;
  central: number;
  high: number;
  compatibility: string;
  evidence_id: string | null;
  target: EvidenceTarget | null;
  method: "greater_residual_plus_amortized_setup";
  human_work: {
    preparation_minutes: number;
    supervision_minutes: number;
    verification_minutes: number;
    correction_minutes: number;
    exception_rate_percent: number;
    exception_minutes: number;
    expected_exception_minutes: number;
    operating_human_minutes: number;
  };
  setup: {
    setup_hours: number;
    amortization_months: number;
    amortized_setup_minutes_per_case: number;
  };
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
    taskProfile: "What work do you want to estimate?",
    quality: "How finished must the result be?",
    expertise: "Who does this work today?",
    qualityOptions: { draft: "Draft to review", reviewed: "Reviewed output", production: "Production-ready result" },
    expertiseOptions: { developing: "Still learning", mixed: "Mixed experience", experienced: "Experienced" },
    taskHelp: "Choose one precise, repeated task, such as drafting an email or reviewing a case. We compare the work first, not the size of the organization.",
    evidenceStep: "02 · Compare it with a real study",
    evidenceHelp: "We look for research on work close to yours. A sufficiently similar study can suggest a starting range. Other studies remain useful examples but do not change the calculation.",
    evidenceGrade: "Measure type",
    sample: "Sample",
    source: "Open the study or original source",
    gradeHelpLabel: "What do A to E mean?",
    gradeHelpTitle: "The letter describes how the figure was obtained, not whether it is good or bad.",
    gradeHelpItems: ["A · People using AI were compared with people not using it", "B · Time was measured during real work", "C · Users estimated their own time", "D · The organization made an internal estimate", "E · The model made an estimate, or the figure is only a starting assumption"],
    statuses: { compatible: "Can guide this estimate", partial: "Use with caution", context: "Example only", incompatible: "Too different" },
    reasons: { task_profile: "different work", integration_mode: "different use of AI", quality_gate: "different finish level", expertise_level: "different experience", context_only: "no direct before-and-after human-time measure" },
    noEvidence: "No study in the register measures this work closely enough. Start with your own human-time estimate below, then replace it with observations from the pilot.",
    readerVerdicts: { usable: "CAN GUIDE THE STARTING ESTIMATE", context_only: "EXAMPLE ONLY · NOT USED IN THE CALCULATION" },
    readerUse: { usable: "The calculator may use this measure when your task and conditions are sufficiently similar.", context_only: "The figure remains visible for context, but it is not added to your estimated saving." },
    readerDetails: "See what was measured and what it does not prove",
    readerMeasured: "What the study actually measured",
    readerConditions: "When it is useful",
    readerLimits: "What you must not conclude",
    timeStep: "03 · Count the human time that remains",
    baseline: "Human minutes without AI",
    cases: "Cases per month",
    eligible: "Share of cases AI can actually handle",
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
      heading: "Estimated time saving, including setup",
      planningEvidence: "starting estimate based on a similar study and your settings",
      planningLocal: "starting scenario to verify in your pilot",
      planningUnavailable: "enter at least one eligible case before calculating",
      baseline: "Human time currently spent on relevant cases",
      recurring: "Human time that would remain per case",
      recurringGain: "Time saved before setup is included",
      setupPerCase: "Setup minutes added to each case",
      withAi: "Total human time per case, including setup",
      low: "Cautious estimate",
      central: "Middle estimate",
      high: "Most favourable estimate",
      payback: "Time until the savings cover setup",
      perMonth: "human hours saved per month",
      localFloor: "your total for preparation, oversight, checking, corrections, and exceptions",
      localScenario: "Your starting scenario",
      noRange: "Only one editable scenario is shown because the selected study does not provide a reliable range for this calculation.",
    },
    modeEffect: "WHY THE RESULT CHANGES",
    modeEffectLead: "This choice mainly changes the setup effort and which studies can be compared. It does not automatically add a productivity gain.",
    modeEffectRecurring: "For each case, you entered this much remaining human work:",
    modeEffectNet: "Before counting setup, this represents",
    modeEffectNetSuffix: "less human time. The net result then adds",
    modeEffectSetupSuffix: "per case during the period you chose for spreading the setup effort.",
    modeEffectSetupUnavailable: "Setup per case and the net result remain unavailable until at least one case is eligible.",
    evidenceRange: "Figures published by the study",
    evidenceReference: "Study reference",
    evidenceBlocked: "These figures remain visible for information, but they are not added to your estimate.",
    calculationLabel: "See the exact calculation",
    calculationPlain: "The calculator keeps whichever is larger: the time suggested by the study or the human time you entered. It then adds the share of setup assigned to one case.",
    negative: "A negative value means the scenario consumes more human time than the current process.",
    zeroEligible: "No net range is calculated at 0% eligibility because setup cannot be allocated to an eligible case.",
    boundary: "The calculator never removes the preparation, checking, corrections, and exception work that you entered. It then adds a share of the setup effort to each eligible case. Treat the result as a starting estimate and replace it with observed time during the pilot.",
  },
  fr: {
    taskStep: "01 · Définir une seule tâche",
    taskProfile: "Quel travail voulez-vous estimer ?",
    quality: "À quel point le résultat doit-il être terminé ?",
    expertise: "Qui réalise ce travail aujourd’hui ?",
    qualityOptions: { draft: "Brouillon à relire", reviewed: "Résultat relu", production: "Résultat prêt pour la production" },
    expertiseOptions: { developing: "Encore en apprentissage", mixed: "Expérience variée", experienced: "Expérimentée" },
    taskHelp: "Choisissez une tâche précise et répétée, par exemple rédiger un courriel ou examiner un dossier. Nous comparons d’abord le travail à faire, pas la taille de l’organisation.",
    evidenceStep: "02 · Comparer avec une étude réelle",
    evidenceHelp: "Nous cherchons une étude portant sur un travail proche du vôtre. Si elle est assez similaire, elle peut proposer une fourchette de départ. Les autres études restent des exemples, mais ne modifient pas le calcul.",
    evidenceGrade: "Type de mesure",
    sample: "Échantillon",
    source: "Ouvrir l’étude ou la source d’origine",
    gradeHelpLabel: "Que signifient les lettres A à E ?",
    gradeHelpTitle: "La lettre indique comment le chiffre a été obtenu, pas s’il est bon ou mauvais.",
    gradeHelpItems: ["A · Des personnes avec IA ont été comparées à des personnes sans IA", "B · Le temps a été mesuré pendant un vrai travail", "C · Les utilisateurs ont estimé eux-mêmes leur temps", "D · L’organisation a produit une estimation interne", "E · Le modèle a produit une estimation, ou le chiffre est seulement une hypothèse de départ"],
    statuses: { compatible: "Peut guider cette estimation", partial: "À utiliser avec prudence", context: "Exemple seulement", incompatible: "Trop différente" },
    reasons: { task_profile: "travail différent", integration_mode: "usage de l’IA différent", quality_gate: "niveau de finition différent", expertise_level: "expérience différente", context_only: "aucune mesure directe du temps humain avant et après" },
    noEvidence: "Aucune étude du registre ne mesure un travail suffisamment proche. Commencez avec votre propre estimation du temps humain ci-dessous, puis remplacez-la par les observations du pilote.",
    readerVerdicts: { usable: "PEUT GUIDER L’ESTIMATION DE DÉPART", context_only: "EXEMPLE SEULEMENT · NON UTILISÉ DANS LE CALCUL" },
    readerUse: { usable: "Le calculateur peut utiliser cette mesure si votre tâche et vos conditions sont suffisamment proches.", context_only: "Le chiffre reste visible pour vous informer, mais il n’est pas ajouté au gain estimé." },
    readerDetails: "Voir ce qui a été mesuré et ce que cela ne prouve pas",
    readerMeasured: "Ce que l’étude a réellement mesuré",
    readerConditions: "Quand cette étude est utile",
    readerLimits: "Ce qu’il ne faut pas en conclure",
    timeStep: "03 · Compter le temps humain qui reste",
    baseline: "Minutes humaines sans IA",
    cases: "Cas par mois",
    eligible: "Part des cas que l’IA peut réellement traiter",
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
      heading: "Gain de temps estimé, mise en place comprise",
      planningEvidence: "estimation de départ fondée sur une étude similaire et vos réglages",
      planningLocal: "scénario de départ à vérifier dans votre pilote",
      planningUnavailable: "saisissez au moins un cas éligible avant le calcul",
      baseline: "Temps humain actuel sur les cas concernés",
      recurring: "Temps humain qui resterait par cas",
      recurringGain: "Temps économisé avant de compter la mise en place",
      setupPerCase: "Minutes de mise en place ajoutées à chaque cas",
      withAi: "Temps humain total par cas, mise en place comprise",
      low: "Estimation prudente",
      central: "Estimation centrale",
      high: "Estimation la plus favorable",
      payback: "Temps nécessaire pour que les gains couvrent la mise en place",
      perMonth: "heures humaines économisées par mois",
      localFloor: "votre total de préparation, supervision, vérification, corrections et exceptions",
      localScenario: "Votre scénario de départ",
      noRange: "Un seul scénario modifiable est affiché, car l’étude sélectionnée ne fournit pas de fourchette fiable pour ce calcul.",
    },
    modeEffect: "POURQUOI LE RÉSULTAT CHANGE",
    modeEffectLead: "Ce choix modifie surtout le temps de mise en place et les études que l’on peut comparer. Il n’ajoute pas automatiquement un gain de productivité.",
    modeEffectRecurring: "Pour chaque cas, vous avez indiqué ce temps humain restant :",
    modeEffectNet: "Avant de compter la mise en place, cela représente",
    modeEffectNetSuffix: "de temps humain en moins. Le résultat net ajoute ensuite",
    modeEffectSetupSuffix: "par cas pendant la période choisie pour répartir la mise en place.",
    modeEffectSetupUnavailable: "La mise en place par cas et le résultat net restent indisponibles tant qu’aucun cas n’est éligible.",
    evidenceRange: "Chiffres publiés par l’étude",
    evidenceReference: "Référence de l’étude",
    evidenceBlocked: "Ces chiffres restent visibles pour vous informer, mais ils ne sont pas ajoutés à votre estimation.",
    calculationLabel: "Voir le calcul exact",
    calculationPlain: "Le calculateur conserve le temps le plus élevé entre celui suggéré par l’étude et celui que vous avez saisi. Il ajoute ensuite la part du temps de mise en place attribuée à un cas.",
    negative: "Une valeur négative signifie que le scénario consomme plus de temps humain que le processus actuel.",
    zeroEligible: "Aucune fourchette nette n’est calculée avec 0 % d’éligibilité, car la mise en place ne peut être répartie sur un cas éligible.",
    boundary: "Le calculateur ne supprime jamais le temps de préparation, de vérification, de correction et de gestion des exceptions que vous avez saisi. Il ajoute ensuite une part du temps de mise en place à chaque cas éligible. Considérez le résultat comme une estimation de départ, puis remplacez-le par le temps observé pendant le pilote.",
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
  const planningRange = useMemo(() => derivePlanningRange(evidenceTransfer, humanScenario, target) as TaskTimePlanningRange, [evidenceTransfer, humanScenario, target]);

  useEffect(() => onPlanningRangeChange(planningRange), [onPlanningRangeChange, planningRange]);

  const selectProfile = (nextProfileId: string) => {
    const profile = registry.task_profiles.find((item) => item.profile_id === nextProfileId) ?? registry.task_profiles[0];
    setProfileId(profile.profile_id);
    setQualityGate(profile.quality_gates.includes("reviewed") ? "reviewed" : profile.quality_gates[0]);
    setExpertiseLevel(profile.profile_id === "software_mature_repo" || profile.profile_id === "hard_automation_project" ? "experienced" : "mixed");
    setSelectedEvidenceId("");
  };
  const reasonText = (status: CompatibilityStatus, reasons: string[]) => {
    if (status === "context") return t.statuses.context;
    const translated = reasons.map((reason) => t.reasons[reason as keyof typeof t.reasons]).filter(Boolean);
    return translated.length ? `${t.statuses[status]}: ${translated.join(", ")}` : t.statuses[status];
  };
  const transferableRange = evidenceTransfer.ok ? evidenceTransfer.scenarios : null;
  const netScenarios = netPlanningRange.scenarios;
  const netCalculable = netPlanningRange.calculable;
  const planningBasis = !netCalculable
    ? t.results.planningUnavailable
    : netPlanningRange.source === "external_evidence"
      ? t.results.planningEvidence
      : t.results.planningLocal;
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
          <details className="task-time-grade-help">
            <summary>{t.gradeHelpLabel}<span aria-hidden="true">?</span></summary>
            <div><strong>{t.gradeHelpTitle}</strong><ul>{t.gradeHelpItems.map((item) => <li key={item}>{item}</li>)}</ul></div>
          </details>
          {evidenceOptions.length ? <fieldset><legend className="visually-hidden">{t.evidenceStep}</legend><div className="task-time-evidence-options">{evidenceOptions.map(({ record, compatibility }) => <label data-compatibility={compatibility.status} key={record.evidence_id}><input aria-label={record.title[locale]} checked={record.evidence_id === selectedRecord?.evidence_id} name="task-time-evidence" onChange={() => setSelectedEvidenceId(record.evidence_id)} type="radio" value={record.evidence_id} /><span><small>{reasonText(compatibility.status, compatibility.reasons)}</small><strong>{record.title[locale]}</strong><em>{t.evidenceGrade} {record.measurement.evidence_grade}{record.measurement.sample_size ? ` · ${t.sample} ${formatNumber(record.measurement.sample_size, locale, 0)}` : ""}</em></span></label>)}</div></fieldset> : <p className="task-time-no-evidence">{t.noEvidence}</p>}
          {selectedRecord && <article className="task-time-evidence-detail" data-compatibility={selectedCompatibility?.status}>
            <div className="task-time-evidence-plain"><span>{t.readerVerdicts[selectedRecord.transfer.quantitative_use]}</span><strong>{selectedRecord.reader_summary[locale]}</strong><p>{t.readerUse[selectedRecord.transfer.quantitative_use]}</p></div>
            <a href={selectedRecord.sources[0].url} rel="noreferrer" target="_blank">{t.source} ↗</a>
            <details><summary>{t.readerDetails}<span aria-hidden="true">+</span></summary><dl><div><dt>{t.readerMeasured}</dt><dd>{selectedRecord.measurement.notes[locale]}</dd></div><div><dt>{t.readerConditions}</dt><dd>{selectedRecord.transfer.preconditions[locale]}</dd></div><div><dt>{t.readerLimits}</dt><dd>{selectedRecord.transfer.limits[locale]}</dd></div></dl></details>
          </article>}
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
          <div className="task-time-mode-effect" data-mode={integrationMode}>
            <strong>{t.modeEffect}</strong>
            <p>{t.modeEffectLead} {t.modeEffectRecurring} <b>{formatNumber(netScenarios.central.operating_human_minutes, locale)} min</b>. {t.modeEffectNet} <b>{formatPercent(netScenarios.central.recurring_reduction_fraction, locale)}%</b> {netCalculable ? <>{t.modeEffectNetSuffix} <b>{formatNumber(netScenarios.central.amortized_setup_minutes_per_case ?? 0, locale)} min</b> {t.modeEffectSetupSuffix}</> : t.modeEffectSetupUnavailable}</p>
          </div>
        </div>

        <output className="calibrator-results" aria-live="polite">
          <div className="calibrator-result-head" data-calculable={netCalculable}><span>{t.results.heading}</span><strong>{netCalculable ? `${formatPercent(netScenarios.central.reduction_fraction ?? 0, locale)}%` : "n/a"}</strong><small>{planningBasis}</small></div>
          <div className="calibrator-result-grid">
            <p><span>{t.results.baseline}</span><strong>{formatNumber(humanScenario.baseline_eligible_human_hours, locale)} h</strong><small>{formatNumber(humanScenario.eligible_cases, locale)} {t.units.cases}</small></p>
            <p data-metric="recurring-time"><span>{t.results.recurring}</span><strong>{formatNumber(netScenarios.central.operating_human_minutes, locale)} min</strong><small>{formatNumber(netScenarios.central.local_operating_floor_minutes, locale)} min {t.results.localFloor}</small></p>
            <p data-metric="recurring-gain"><span>{t.results.recurringGain}</span><strong>{formatPercent(netScenarios.central.recurring_reduction_fraction, locale)}%</strong><small>{netCalculable ? `${formatNumber(netScenarios.central.recurring_human_hours_saved_per_month, locale)} ${t.results.perMonth}` : t.results.planningUnavailable}</small></p>
            <p data-metric="setup"><span>{t.results.setupPerCase}</span><strong>{netCalculable ? `${formatNumber(netScenarios.central.amortized_setup_minutes_per_case ?? 0, locale)} min` : "n/a"}</strong><small>{formatNumber(setupHours, locale)} h / {formatNumber(amortizationMonths, locale)} {t.units.months}</small></p>
            <p data-metric="net-time"><span>{t.results.withAi}</span><strong>{netCalculable ? `${formatNumber(netScenarios.central.human_time_with_ai_minutes ?? 0, locale)} min` : "n/a"}</strong><small>{netCalculable ? `${formatNumber(netScenarios.central.operating_human_minutes, locale)} + ${formatNumber(netScenarios.central.amortized_setup_minutes_per_case ?? 0, locale)} min` : t.results.planningUnavailable}</small></p>
            {transferableRange ? <>
              <p data-range="low"><span>{t.results.low}</span><strong>{netCalculable ? `${formatPercent(netScenarios.low.reduction_fraction ?? 0, locale)}%` : "n/a"}</strong><small>{netCalculable ? `${formatNumber(netScenarios.low.human_hours_saved_per_month ?? 0, locale)} ${t.results.perMonth}` : t.results.planningUnavailable}</small></p>
              <p data-range="central"><span>{t.results.central}</span><strong>{netCalculable ? `${formatPercent(netScenarios.central.reduction_fraction ?? 0, locale)}%` : "n/a"}</strong><small>{netCalculable ? `${formatNumber(netScenarios.central.human_hours_saved_per_month ?? 0, locale)} ${t.results.perMonth}` : t.results.planningUnavailable}</small></p>
              <p data-range="high"><span>{t.results.high}</span><strong>{netCalculable ? `${formatPercent(netScenarios.high.reduction_fraction ?? 0, locale)}%` : "n/a"}</strong><small>{netCalculable ? `${formatNumber(netScenarios.high.human_hours_saved_per_month ?? 0, locale)} ${t.results.perMonth}` : t.results.planningUnavailable}</small></p>
            </> : <p className="task-time-local-scenario" data-range="local"><span>{t.results.localScenario}</span><strong>{netCalculable ? `${formatPercent(netScenarios.central.reduction_fraction ?? 0, locale)}%` : "n/a"}</strong><small>{t.results.noRange}</small></p>}
            <p><span>{t.results.payback}</span><strong>{paybackRange}</strong></p>
          </div>
          <div className="task-time-source-range" data-transferable={Boolean(transferableRange)}><span>{t.evidenceRange}</span>{transferableRange ? <strong>{formatPercent(transferableRange.low.reduction_fraction, locale)}–{formatPercent(transferableRange.central.reduction_fraction, locale)}–{formatPercent(transferableRange.high.reduction_fraction, locale)}%</strong> : <p>{t.evidenceBlocked}</p>}<small>{selectedRecord ? `${t.evidenceReference} : ${selectedRecord.evidence_id} · ${t.statuses[selectedCompatibility?.status ?? "incompatible"]}` : t.noEvidence}</small></div>
          {netCalculable ? <details className="calibrator-equation calibrator-equation-details"><summary>{t.calculationLabel}<span aria-hidden="true">+</span></summary><p>{t.calculationPlain}</p><code>max({netScenarios.central.source_implied_human_minutes == null ? "n/a" : `${formatNumber(netScenarios.central.source_implied_human_minutes, locale)} min`}, {formatNumber(netScenarios.central.local_operating_floor_minutes, locale)} min) + {formatNumber(netScenarios.central.amortized_setup_minutes_per_case ?? 0, locale)} min = <strong>{formatNumber(netScenarios.central.human_time_with_ai_minutes ?? 0, locale)} min</strong></code></details> : <p className="calibrator-equation"><strong>n/a</strong> {t.zeroEligible}</p>}
          {netCalculable && (netScenarios.low.reduction_fraction ?? 0) < 0 && <p className="task-time-negative">{t.negative}</p>}
        </output>
      </div>
      <aside className="calibrator-note"><strong>{locale === "en" ? "HOW THE ESTIMATED SAVING IS CALCULATED" : "COMMENT LE GAIN DE TEMPS EST CALCULÉ"}</strong><p>{t.boundary}</p></aside>
    </>
  );
}
