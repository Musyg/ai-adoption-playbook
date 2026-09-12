"use client";

import { formatLocalizedNumber } from "./format-number.mjs";

import { useEffect, useMemo, useRef } from "react";

import taskTimeEvidence from "../public/data/task-time-evidence.v1.json";
import { workModeTaxonomy } from "./integration-taxonomy";
import {
  buildEvidenceTransfer,
  buildNetPlanningRange,
  calculateHumanTimeScenario,
  derivePlanningRange,
  listEvidenceOptions,
  normalizePlanningOptions,
} from "./task-time-transfer.mjs";
import type {
  CompatibilityStatus,
  EvidenceTarget,
  ExpertiseLevel,
  IntegrationMode,
  QualityGate,
  PlanningOptions,
  TaskTimeEvidenceRecord,
  TaskTimeRegistry,
} from "./task-time-transfer.mjs";

type Locale = "en" | "fr";
type UsePatternId = "generation" | "retrieval" | "classification" | "prediction" | "conversation" | "multimodal" | "agentic";

export type TaskTimePlanningRange = {
  assumptions?: PlanningOptions;
  calculable: boolean;
  unavailable_reason: "no_eligible_cases" | "invalid_workload_denominator" | null;
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

export type TaskTimeScenarioState = {
  planningOptions?: PlanningOptions;
  profileId: string;
  qualityGate: QualityGate;
  expertiseLevel: ExpertiseLevel;
  selectedEvidenceId: string;
  preparationMinutes: number;
  supervisionMinutes: number;
  verificationMinutes: number;
  correctionMinutes: number;
  exceptionRate: number;
  exceptionMinutes: number;
  amortizationMonths: number;
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

export const createDefaultTaskTimeScenario = (usePattern: UsePatternId): TaskTimeScenarioState => ({
  profileId: defaultProfileByPattern[usePattern],
  qualityGate: "draft",
  expertiseLevel: "mixed",
  selectedEvidenceId: "",
  preparationMinutes: 5,
  supervisionMinutes: 5,
  verificationMinutes: 15,
  correctionMinutes: 5,
  exceptionRate: 20,
  exceptionMinutes: 15,
  amortizationMonths: 12,
});

const content = {
  en: {
    evalHelpTitle: "How do I test this estimate?",
    evalQuestions: ["Can it succeed once? Check the final outcome on a few representative cases.", "Does it succeed consistently? Repeat cases and count failed attempts, retries and human review.", "Does it remain good after a change? Rerun the same reference cases after changing the model, instructions, tools or data."],
    evalHelpNote: "Start with clearly labelled demonstration cases if needed. Set a budget before testing. In live use, assign someone to review alerts and update the tests.",
    scenarioTitle: "Explore cautious, middle and favourable scenarios",
    scenarioToggle: "Use three editable demonstration scenarios",
    scenarioHelp: "The main fields describe the middle case. Add work for the cautious case and remove work for the favourable case. Defaults are examples, not study findings. Review and setup cannot fall below zero; exception rates stay between 0% and 100%.",
    localChoice: "Local demonstration selected. The study stays visible, but its percentage is not used.",
    basisLabel: "What should guide the calculation?",
    basisSource: "Comparable study, when available",
    basisLocal: "My own demonstration assumptions",
    extraTitle: "Avoid missing or counting work twice",
    additional: "Extra human minutes not already counted",
    sourceSetup: "Setup minutes already included in the study time",
    coverageHelp: "Add only work missing from both the study and your breakdown. If study time includes setup, enter that part per transferred case: it is removed before adding your local setup. Leave zero when setup is excluded; check the source when unsure.",
    scenarioLabels: {"cautious_review_minutes":"Cautious: extra review minutes per case","favorable_review_minutes":"Favourable: fewer review minutes per case","cautious_exception_points":"Cautious: extra percentage points of exceptions","favorable_exception_points":"Favourable: fewer percentage points of exceptions","cautious_setup_hours":"Cautious: extra setup hours","favorable_setup_hours":"Favourable: fewer setup hours"},
    rangeKinds: {"point_estimate":"One estimated average, not a range","treatment_span":"Differences between experimental groups","confidence_interval":"Statistical interval in the source, not a local forecast","model_estimate":"Estimate generated by a model","internal_estimate":"Internal estimate, not a measured range","none":"No admitted human-time range"},
    period: "When the work was observed",
    modelTools: "Model and tools",
    coverage: "What the figure includes",
    taskStep: "01 · Define one task",
    taskProfile: "What work do you want to estimate?",
    quality: "How finished must the result be?",
    expertise: "Who does this work today?",
    qualityOptions: { draft: "Draft to review", reviewed: "Reviewed output", production: "Production-ready result" },
    expertiseOptions: { developing: "Still learning", mixed: "Mixed experience", experienced: "Experienced" },
    taskHelp: "Choose one precise, repeated task, such as drafting an email or reviewing a case. We compare the work first, not the size of the organization.",
    evidenceStep: "02 · Compare it with a real study",
    evidenceHelp: "We look for research on work close to yours. A sufficiently similar study can suggest a starting range. Other studies remain useful examples but do not change the calculation.",
    evidenceGrade: "Study method",
    sample: "Sample",
    source: "Open the study or original source",
    gradeHelpLabel: "What do A to E mean?",
    gradeHelpTitle: "This letter describes only the selected source. It is unrelated to the A0 to A4 autonomy codes.",
    gradeScaleIntro: "A means the strongest direct comparison in this register. E means a synthetic estimate or planning assumption. The selected source is highlighted below.",
    gradeNames: { A: "Observed comparison between work with and without AI", B: "Operational measure from real work", C: "Time reported by users", D: "Published case or capability test", E: "Synthetic estimate or planning assumption" },
    gradeCode: "evidence grade",
    statuses: { compatible: "Can guide this estimate", partial: "Use with caution", context: "Example only", incompatible: "Too different" },
    reasons: { task_profile: "different work", work_mode: "different way of sharing work", architecture: "different system architecture", autonomy_level: "different action boundary", quality_gate: "different finish level", expertise_level: "different experience", context_only: "no direct before-and-after human-time measure" },
    noEvidence: "No study in the register measures this work closely enough. Start with your own human-time estimate below, then replace it with observations from the pilot.",
    readerVerdicts: { usable: "COMPARABLE · CAN GUIDE THE STARTING ESTIMATE", partial: "USABLE WITH ADJUSTMENTS", context_only: "EXAMPLE ONLY · NOT USED IN THE CALCULATION" },
    readerUse: { usable: "The calculator may use this measure because the task and conditions are sufficiently similar.", partial: "The task is comparable enough to keep the range, but the differences below must be checked during your pilot.", context_only: "The figure remains visible for context, but it is not added to your estimated saving." },
    readerDetails: "See what was measured and what it does not prove",
    readerMeasured: "What the study actually measured",
    readerConditions: "When it is useful",
    readerLimits: "What you must not conclude",
    timeStep: "03 · Count the human time that remains",
    baseline: "Human minutes without AI",
    cases: "Cases per month",
    eligible: "Share of cases AI can actually handle",
    totalBaseline: "Total human hours per month for all cases",
    totalBaselineHelp: "Use the complete workload, including cases AI cannot handle. A share of cases is not automatically the same share of time.",
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
      heading: "Estimated human-time saving across the complete workload",
      planningEvidence: "starting estimate based on a similar study and your settings",
      planningLocal: "starting scenario to verify in your pilot",
      planningUnavailable: "enter at least one eligible case before calculating",
      baseline: "Human time currently spent on relevant cases",
      wholeBaseline: "Current human time for the complete workload",
      recurring: "Human time that would remain per case",
      recurringGain: "Time saved on each eligible case before setup",
      setupPerCase: "Setup minutes added to each case",
      withAi: "Total human time per eligible case, including setup",
      eligibleNet: "net saving on each eligible case",
      low: "Cautious estimate · complete workload",
      central: "Middle estimate · complete workload",
      high: "Most favourable estimate · complete workload",
      payback: "Time until the savings cover setup",
      perMonth: "human hours saved per month",
      localFloor: "your total for preparation, oversight, checking, corrections, and exceptions",
      localScenario: "Your starting scenario",
      noRange: "Only one editable scenario is shown because the selected study does not provide a reliable range for this calculation.",
      collapsedRange: "The cautious, middle, and favourable calculations currently lead to the same result, so one value is shown.",
    },
    modeEffect: "WHY THE RESULT CHANGES",
    modeEffectLead: "The work mode changes the setup effort and which studies are comparable. It does not add a fixed productivity bonus. Architecture and A0 to A4 authority are chosen separately.",
    modeEffectRecurring: "For each case, the current assumptions allow this much remaining human work:",
    modeEffectSource: "The comparable study implies this much remaining human work:",
    modeEffectConservative: "After applying your coverage settings, the human work retained is:",
    modeEffectNet: "Before counting setup, this represents",
    modeEffectNetSuffix: "less human time. The net result then adds",
    modeEffectSetupSuffix: "per case during the period you chose for spreading the setup effort.",
    modeEffectSetupUnavailable: "Setup per case and the net result remain unavailable until at least one case is eligible.",
    evidenceRange: "Human-time figures from the source · lower / central / upper",
    evidenceReference: "Study reference",
    evidenceBlocked: "These figures remain visible for information, but they are not added to your estimate.",
    calculationLabel: "See the exact calculation",
    calculationPlain: "The calculator removes any setup already included in study time, then keeps the larger remaining time: study or local work. Extra work is added separately, followed by local setup.",
    negative: "A negative value means the scenario consumes more human time than the current process.",
    invalidDenominator: "The eligible cases already account for more baseline time than the complete workload. Increase the complete-workload hours or correct the case assumptions before using a whole-workload percentage.",
    zeroEligible: "No net range is calculated at 0% eligibility because setup cannot be allocated to an eligible case.",
    boundary: "The main inputs define the middle case. Optional scenario margins adjust review, exceptions and setup explicitly. Each case keeps its adjusted human-work breakdown, plus any extra work and its share of setup. Treat the result as a starting estimate and replace it with observed time during the pilot.",
  },
  fr: {
    evalHelpTitle: "Comment tester cette estimation ?",
    evalQuestions: ["Réussit-il une fois ? Vérifiez le résultat final sur quelques cas représentatifs.", "Réussit-il régulièrement ? Rejouez des cas et comptez les échecs, les reprises et la revue humaine.", "Reste-t-il bon après un changement ? Rejouez les mêmes cas après modification du modèle, des consignes, des outils ou des données."],
    evalHelpNote: "Vous pouvez commencer avec des cas de démonstration signalés comme tels. Fixez un budget avant le test. En usage réel, désignez qui suit les alertes et actualise les tests.",
    scenarioTitle: "Explorer les scénarios prudent, central et favorable",
    scenarioToggle: "Utiliser trois scénarios de démonstration modifiables",
    scenarioHelp: "Les champs principaux décrivent le cas central. Ajoutez du travail pour le cas prudent et retirez-en pour le cas favorable. Les valeurs proposées sont des exemples, pas des résultats d’étude. Relecture et installation restent au minimum à zéro ; les exceptions restent entre 0 % et 100 %.",
    localChoice: "Démonstration locale choisie. L’étude reste visible, mais son pourcentage n’est pas utilisé.",
    basisLabel: "Sur quoi fonder le calcul ?",
    basisSource: "Une étude comparable, si disponible",
    basisLocal: "Mes propres hypothèses de démonstration",
    extraTitle: "Éviter les oublis et les doubles comptes",
    additional: "Minutes humaines supplémentaires non déjà comptées",
    sourceSetup: "Minutes de mise en place déjà comprises dans l’étude",
    coverageHelp: "Ajoutez uniquement le travail absent de l’étude et de votre décomposition. Si le temps de l’étude inclut l’installation, indiquez cette part par cas transposé : elle est retirée avant d’ajouter votre installation locale. Laissez zéro si elle est exclue ; vérifiez la source en cas de doute.",
    scenarioLabels: {"cautious_review_minutes":"Prudent : minutes de relecture supplémentaires par cas","favorable_review_minutes":"Favorable : minutes de relecture en moins par cas","cautious_exception_points":"Prudent : points de pourcentage d’exceptions en plus","favorable_exception_points":"Favorable : points de pourcentage d’exceptions en moins","cautious_setup_hours":"Prudent : heures d’installation supplémentaires","favorable_setup_hours":"Favorable : heures d’installation en moins"},
    rangeKinds: {"point_estimate":"Une moyenne estimée, pas une fourchette","treatment_span":"Écarts entre groupes expérimentaux","confidence_interval":"Intervalle statistique de la source, pas prévision locale","model_estimate":"Estimation produite par un modèle","internal_estimate":"Estimation interne, pas fourchette mesurée","none":"Aucune fourchette de temps humain admise"},
    period: "Quand le travail a été observé",
    modelTools: "Modèle et outils",
    coverage: "Ce que le chiffre comprend",
    taskStep: "01 · Définir une seule tâche",
    taskProfile: "Quel travail voulez-vous estimer ?",
    quality: "À quel point le résultat doit-il être terminé ?",
    expertise: "Qui réalise ce travail aujourd’hui ?",
    qualityOptions: { draft: "Brouillon à relire", reviewed: "Résultat relu", production: "Résultat prêt pour la production" },
    expertiseOptions: { developing: "Encore en apprentissage", mixed: "Expérience variée", experienced: "Expérimentée" },
    taskHelp: "Choisissez une tâche précise et répétée, par exemple rédiger un courriel ou examiner un dossier. Nous comparons d’abord le travail à faire, pas la taille de l’organisation.",
    evidenceStep: "02 · Comparer avec une étude réelle",
    evidenceHelp: "Nous cherchons une étude portant sur un travail proche du vôtre. Si elle est assez similaire, elle peut proposer une fourchette de départ. Les autres études restent des exemples, mais ne modifient pas le calcul.",
    evidenceGrade: "Méthode de l’étude",
    sample: "Échantillon",
    source: "Ouvrir l’étude ou la source d’origine",
    gradeHelpLabel: "Que signifient les lettres A à E ?",
    gradeHelpTitle: "Cette lettre décrit uniquement la source choisie. Elle n’a aucun lien avec les codes d’autonomie A0 à A4.",
    gradeScaleIntro: "A désigne ici la comparaison directe la plus solide. E désigne une estimation synthétique ou une hypothèse de planification. La source choisie est mise en évidence ci-dessous.",
    gradeNames: { A: "Comparaison observée entre travail avec et sans IA", B: "Mesure opérationnelle issue du travail réel", C: "Temps déclaré par les utilisateurs", D: "Cas publié ou test de capacité", E: "Estimation synthétique ou hypothèse de planification" },
    gradeCode: "niveau de preuve",
    statuses: { compatible: "Peut guider cette estimation", partial: "À utiliser avec prudence", context: "Exemple seulement", incompatible: "Trop différente" },
    reasons: { task_profile: "travail différent", work_mode: "partage du travail différent", architecture: "architecture différente", autonomy_level: "limite d’action différente", quality_gate: "niveau de finition différent", expertise_level: "expérience différente", context_only: "aucune mesure directe du temps humain avant et après" },
    noEvidence: "Aucune étude du registre ne mesure un travail suffisamment proche. Commencez avec votre propre estimation du temps humain ci-dessous, puis remplacez-la par les observations du pilote.",
    readerVerdicts: { usable: "COMPARABLE · PEUT GUIDER L’ESTIMATION", partial: "UTILISABLE AVEC AJUSTEMENTS", context_only: "EXEMPLE SEULEMENT · NON UTILISÉ DANS LE CALCUL" },
    readerUse: { usable: "Le calculateur peut utiliser cette mesure, car la tâche et ses conditions sont assez proches.", partial: "La tâche est assez comparable pour conserver la fourchette, mais les différences ci-dessous doivent être vérifiées pendant votre pilote.", context_only: "Le chiffre reste visible pour vous informer, mais il n’est pas ajouté au gain estimé." },
    readerDetails: "Voir ce qui a été mesuré et ce que cela ne prouve pas",
    readerMeasured: "Ce que l’étude a réellement mesuré",
    readerConditions: "Quand cette étude est utile",
    readerLimits: "Ce qu’il ne faut pas en conclure",
    timeStep: "03 · Compter le temps humain qui reste",
    baseline: "Minutes humaines sans IA",
    cases: "Cas par mois",
    eligible: "Part des cas que l’IA peut réellement traiter",
    totalBaseline: "Heures humaines totales par mois pour tous les cas",
    totalBaselineHelp: "Comptez toute la charge, y compris les cas que l’IA ne peut pas traiter. Une part de cas ne représente pas forcément la même part du temps.",
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
      heading: "Gain de temps humain estimé sur toute la charge",
      planningEvidence: "estimation de départ fondée sur une étude similaire et vos réglages",
      planningLocal: "scénario de départ à vérifier dans votre pilote",
      planningUnavailable: "saisissez au moins un cas éligible avant le calcul",
      baseline: "Temps humain actuel sur les cas concernés",
      wholeBaseline: "Temps humain actuel pour toute la charge",
      recurring: "Temps humain qui resterait par cas",
      recurringGain: "Temps économisé sur chaque cas éligible avant la mise en place",
      setupPerCase: "Minutes de mise en place ajoutées à chaque cas",
      withAi: "Temps humain total par cas éligible, mise en place comprise",
      eligibleNet: "gain net sur chaque cas éligible",
      low: "Estimation prudente · toute la charge",
      central: "Estimation centrale · toute la charge",
      high: "Estimation la plus favorable · toute la charge",
      payback: "Temps nécessaire pour que les gains couvrent la mise en place",
      perMonth: "heures humaines économisées par mois",
      localFloor: "votre total de préparation, supervision, vérification, corrections et exceptions",
      localScenario: "Votre scénario de départ",
      noRange: "Un seul scénario modifiable est affiché, car l’étude sélectionnée ne fournit pas de fourchette fiable pour ce calcul.",
      collapsedRange: "Les calculs prudent, central et favorable aboutissent actuellement au même résultat ; une seule valeur est donc affichée.",
    },
    modeEffect: "POURQUOI LE RÉSULTAT CHANGE",
    modeEffectLead: "Le mode de travail modifie l’effort de mise en place et les études comparables. Il n’ajoute aucun bonus de productivité fixe. L’architecture et l’autorité A0 à A4 sont choisies séparément.",
    modeEffectRecurring: "Pour chaque cas, les hypothèses actuelles prévoient ce temps humain restant :",
    modeEffectSource: "L’étude comparable suggère ce temps humain restant :",
    modeEffectConservative: "Après application de vos réglages de périmètre, le temps humain retenu est :",
    modeEffectNet: "Avant de compter la mise en place, cela représente",
    modeEffectNetSuffix: "de temps humain en moins. Le résultat net ajoute ensuite",
    modeEffectSetupSuffix: "par cas pendant la période choisie pour répartir la mise en place.",
    modeEffectSetupUnavailable: "La mise en place par cas et le résultat net restent indisponibles tant qu’aucun cas n’est éligible.",
    evidenceRange: "Temps humain dans la source · valeur basse / centrale / haute",
    evidenceReference: "Référence de l’étude",
    evidenceBlocked: "Ces chiffres restent visibles pour vous informer, mais ils ne sont pas ajoutés à votre estimation.",
    calculationLabel: "Voir le calcul exact",
    calculationPlain: "Le calcul retire l’installation déjà comprise dans l’étude, puis conserve le plus grand temps restant entre étude et travail local. Il ajoute séparément le travail supplémentaire puis l’installation locale.",
    negative: "Une valeur négative signifie que le scénario consomme plus de temps humain que le processus actuel.",
    invalidDenominator: "Les cas éligibles représentent déjà plus de temps initial que toute la charge saisie. Augmentez les heures de la charge complète ou corrigez les hypothèses avant d’utiliser un pourcentage global.",
    zeroEligible: "Aucune fourchette nette n’est calculée avec 0 % d’éligibilité, car la mise en place ne peut être répartie sur un cas éligible.",
    boundary: "Les champs principaux définissent le cas central. Les marges facultatives ajustent explicitement la revue, les exceptions et l’installation. Chaque scénario conserve sa décomposition ajustée du travail humain, les charges supplémentaires et sa part de mise en place. Considérez le résultat comme une estimation de départ, puis remplacez-le par le temps observé pendant le pilote.",
  },
} as const;

const formatPercent = (value: number, locale: Locale) => formatLocalizedNumber(value * 100, locale, { maximumFractionDigits: 1, signDisplay: value < 0 ? "always" : "auto" });
const formatNumber = (value: number, locale: Locale, digits = 1) => formatLocalizedNumber(value, locale, { maximumFractionDigits: digits });
export const formatRange = (values: number[], formatter: (value: number) => string) => {
  const formatted = values.map((value) => formatter(value));
  return new Set(formatted).size === 1 ? formatted[0] : formatted.join("–");
};

export function TaskTimeCalibrator({
  locale,
  integrationMode,
  architecture,
  autonomy,
  baselineMinutes,
  monthlyCases,
  eligibleShare,
  totalBaselineHumanHours,
  setupHours,
  scenario,
  onIntegrationModeChange,
  onBaselineMinutesChange,
  onMonthlyCasesChange,
  onEligibleShareChange,
  onTotalBaselineHumanHoursChange,
  onSetupHoursChange,
  onPlanningRangeChange,
  onScenarioChange,
}: {
  locale: Locale;
  integrationMode: IntegrationMode;
  architecture: "model" | "workflow" | "agent" | "agency";
  autonomy: number;
  baselineMinutes: number;
  monthlyCases: number;
  eligibleShare: number;
  totalBaselineHumanHours: number;
  setupHours: number;
  scenario: TaskTimeScenarioState;
  onIntegrationModeChange: (value: IntegrationMode) => void;
  onBaselineMinutesChange: (value: number) => void;
  onMonthlyCasesChange: (value: number) => void;
  onEligibleShareChange: (value: number) => void;
  onTotalBaselineHumanHoursChange: (value: number) => void;
  onSetupHoursChange: (value: number) => void;
  onPlanningRangeChange: (value: TaskTimePlanningRange) => void;
  onScenarioChange: (value: TaskTimeScenarioState) => void;
}) {
  const t = content[locale];
  const planningOptions = useMemo(() => normalizePlanningOptions(scenario.planningOptions), [scenario.planningOptions]);
  const updateOptions = (patch: PlanningOptions) => onScenarioChange({ ...scenario, planningOptions: { ...scenario.planningOptions, ...patch } });
  const {
    profileId,
    qualityGate,
    expertiseLevel,
    selectedEvidenceId,
    preparationMinutes,
    supervisionMinutes,
    verificationMinutes,
    correctionMinutes,
    exceptionRate,
    exceptionMinutes,
    amortizationMonths,
  } = scenario;
  const updateScenario = (patch: Partial<TaskTimeScenarioState>) => onScenarioChange({ ...scenario, ...patch });
  const selectedProfile = registry.task_profiles.find((profile) => profile.profile_id === profileId) ?? registry.task_profiles[0];
  const target = useMemo<EvidenceTarget>(() => ({
    task_profile_id: profileId,
    work_mode: integrationMode,
    architecture,
    autonomy_level: `A${autonomy}` as EvidenceTarget["autonomy_level"],
    quality_gate: qualityGate,
    expertise_level: expertiseLevel,
  }), [architecture, autonomy, expertiseLevel, integrationMode, profileId, qualityGate]);
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
    total_baseline_human_hours: totalBaselineHumanHours,
    preparation_minutes: preparationMinutes,
    supervision_minutes: supervisionMinutes,
    verification_minutes: verificationMinutes,
    correction_minutes: correctionMinutes,
    exception_rate: exceptionRate,
    exception_minutes: exceptionMinutes,
    setup_hours: setupHours,
    amortization_months: amortizationMonths,
  }), [amortizationMonths, baselineMinutes, correctionMinutes, eligibleShare, exceptionMinutes, exceptionRate, monthlyCases, preparationMinutes, setupHours, supervisionMinutes, totalBaselineHumanHours, verificationMinutes]);
  const evidenceTransfer = useMemo(() => buildEvidenceTransfer(selectedRecord, target, {
    baseline_human_minutes: baselineMinutes,
    monthly_cases: monthlyCases,
    eligible_share: eligibleShare,
    total_baseline_human_hours: totalBaselineHumanHours,
  }), [baselineMinutes, eligibleShare, monthlyCases, selectedRecord, target, totalBaselineHumanHours]);
  const netPlanningRange = useMemo(() => buildNetPlanningRange(evidenceTransfer, humanScenario, planningOptions), [evidenceTransfer, humanScenario, planningOptions]);
  const planningRange = useMemo(() => derivePlanningRange(evidenceTransfer, humanScenario, target, planningOptions) as TaskTimePlanningRange, [evidenceTransfer, humanScenario, target, planningOptions]);

  useEffect(() => onPlanningRangeChange(planningRange), [onPlanningRangeChange, planningRange]);

  const selectProfile = (nextProfileId: string) => {
    const profile = registry.task_profiles.find((item) => item.profile_id === nextProfileId) ?? registry.task_profiles[0];
    onScenarioChange({
      ...scenario,
      profileId: profile.profile_id,
      qualityGate: profile.quality_gates.includes("reviewed") ? "reviewed" : profile.quality_gates[0],
      expertiseLevel: profile.profile_id === "software_mature_repo" || profile.profile_id === "hard_automation_project" ? "experienced" : "mixed",
      selectedEvidenceId: "",
      planningOptions: { ...scenario.planningOptions, source_setup_minutes: 0 },
    });
  };
  const reasonText = (status: CompatibilityStatus, reasons: string[]) => {
    if (status === "context") return t.statuses.context;
    const translated = reasons.map((reason) => t.reasons[reason as keyof typeof t.reasons]).filter(Boolean);
    return translated.length ? `${t.statuses[status]}: ${translated.join(", ")}` : t.statuses[status];
  };
  const transferableRange = evidenceTransfer.ok ? evidenceTransfer.scenarios : null;
  const readerQuantitativeUse: "usable" | "partial" | "context_only" = evidenceTransfer.ok && planningOptions.use_source
    ? evidenceTransfer.compatibility.status === "partial" ? "partial" : "usable"
    : "context_only";
  const netScenarios = netPlanningRange.scenarios;
  const netCalculable = netPlanningRange.eligible_case_calculable;
  const wholeWorkloadCalculable = netPlanningRange.whole_workload_calculable;
  const planningBasis = !netCalculable
    ? t.results.planningUnavailable
    : netPlanningRange.source === "external_evidence"
      ? t.results.planningEvidence
      : t.results.planningLocal;
  const paybacks = [netScenarios.low.setup_payback_months, netScenarios.high.setup_payback_months].filter((value): value is number => value != null);
  const mixedPayback = paybacks.length === 1;
  const noPayback = locale === "en" ? "Not reached" : "Non atteint";
  const paybackRange = !netCalculable ? "n/a" : mixedPayback
    ? (locale === "en" ? "Not in every scenario" : "Pas dans tous les scénarios")
    : paybacks.length ? `${formatRange([Math.min(...paybacks), Math.max(...paybacks)], (value) => formatNumber(value, locale))} ${t.units.months}` : noPayback;
  const paybackDetails = [netScenarios.low, netScenarios.central, netScenarios.high].map((point, index) =>
    (locale === "en" ? ["Cautious", "Middle", "Favourable"] : ["Prudent", "Central", "Favorable"])[index] + ": " +
    (point.setup_payback_months == null ? noPayback : formatNumber(point.setup_payback_months, locale) + " " + t.units.months)
  ).join(" · ");
  const netRangeVaries = new Set([netScenarios.low.whole_workload_reduction_fraction, netScenarios.central.whole_workload_reduction_fraction, netScenarios.high.whole_workload_reduction_fraction].map((value) => value == null ? "n/a" : formatPercent(value, locale))).size > 1;
  const scenarioControls = useRef<HTMLDetailsElement>(null);
  const monthlySaved = netScenarios.central.human_hours_saved_per_month;
  const remainingHours = monthlySaved == null ? null : totalBaselineHumanHours - monthlySaved;
  const inputNumber = (value: string, minimum: number, maximum: number) => Math.min(maximum, Math.max(minimum, Number(value) || minimum));

  return (
    <>
      <div className="task-time-guide">
        <section className="task-time-definition" aria-labelledby="task-time-definition-title">
          <header><span>01</span><div><h3 id="task-time-definition-title">{t.taskStep}</h3><p>{t.taskHelp}</p></div></header>
          <div className="task-time-selects">
            <label><span>{t.taskProfile}</span><select onChange={(event) => selectProfile(event.target.value)} value={profileId}>{registry.task_profiles.map((profile) => <option key={profile.profile_id} value={profile.profile_id}>{profile.label[locale]}</option>)}</select></label>
            <label><span>{t.quality}</span><select onChange={(event) => updateScenario({ qualityGate: event.target.value as QualityGate })} value={qualityGate}>{selectedProfile.quality_gates.map((gate) => <option key={gate} value={gate}>{t.qualityOptions[gate]}</option>)}</select></label>
            <label><span>{t.expertise}</span><select onChange={(event) => updateScenario({ expertiseLevel: event.target.value as ExpertiseLevel })} value={expertiseLevel}>{(["developing", "mixed", "experienced"] as ExpertiseLevel[]).map((level) => <option key={level} value={level}>{t.expertiseOptions[level]}</option>)}</select></label>
          </div>
          <p className="task-profile-note"><strong>{selectedProfile.label[locale]}</strong>{selectedProfile.description[locale]} <span>{selectedProfile.output_unit[locale]}</span></p>
        </section>

        <section className="task-time-evidence" aria-labelledby="task-time-evidence-title">
          <header><span>02</span><div><h3 id="task-time-evidence-title">{t.evidenceStep}</h3><p>{t.evidenceHelp}</p></div></header>
          {selectedRecord && <details className="task-time-grade-help">
            <summary>{t.gradeHelpLabel}<span aria-hidden="true">?</span></summary>
            <div><strong>{t.gradeHelpTitle}</strong><p>{t.gradeScaleIntro}</p><ol>{(["A", "B", "C", "D", "E"] as const).map((grade) => <li data-selected={selectedRecord.measurement.evidence_grade === grade} key={grade}><span>{grade}</span><p>{t.gradeNames[grade]}</p></li>)}</ol></div>
          </details>}
          {evidenceOptions.length ? <fieldset><legend className="visually-hidden">{t.evidenceStep}</legend><div className="task-time-evidence-options">{evidenceOptions.map(({ record, compatibility }) => <label data-compatibility={compatibility.status} key={record.evidence_id}><input aria-label={record.title[locale]} checked={record.evidence_id === selectedRecord?.evidence_id} name="task-time-evidence" onChange={() => updateScenario({ selectedEvidenceId: record.evidence_id, planningOptions: { ...scenario.planningOptions, source_setup_minutes: 0 } })} type="radio" value={record.evidence_id} /><span><small>{reasonText(compatibility.status, compatibility.reasons)}</small><strong>{record.title[locale]}</strong><em>{t.evidenceGrade}: {t.gradeNames[record.measurement.evidence_grade]} ({t.gradeCode} {record.measurement.evidence_grade}){record.measurement.sample_size ? ` · ${t.sample} ${formatNumber(record.measurement.sample_size, locale, 0)}` : ""}</em></span></label>)}</div></fieldset> : <p className="task-time-no-evidence">{t.noEvidence}</p>}
          {selectedRecord && <article className="task-time-evidence-detail" data-compatibility={selectedCompatibility?.status}>
            <div className="task-time-evidence-plain"><span>{t.readerVerdicts[readerQuantitativeUse]}</span><strong>{selectedRecord.reader_summary[locale]}</strong><p>{planningOptions.use_source === false ? t.localChoice : t.readerUse[readerQuantitativeUse]}</p>{selectedCompatibility?.status === "partial" && <em>{reasonText("partial", selectedCompatibility.reasons)}</em>}</div>
            <a href={selectedRecord.sources[0].url} rel="noreferrer" target="_blank">{t.source} ↗</a>
            <details><summary>{t.readerDetails}<span aria-hidden="true">+</span></summary><dl><div><dt>{t.readerMeasured}</dt><dd>{selectedRecord.measurement.notes[locale]}</dd></div><div><dt>{t.readerConditions}</dt><dd>{selectedRecord.transfer.preconditions[locale]}</dd></div><div><dt>{t.readerLimits}</dt><dd>{selectedRecord.transfer.limits[locale]}</dd></div>{selectedRecord.measurement.context && <><div><dt>{t.evidenceRange}</dt><dd>{t.rangeKinds[selectedRecord.measurement.context.range_kind]}</dd></div><div><dt>{t.period}</dt><dd>{selectedRecord.measurement.context.observed_period[locale]}</dd></div><div><dt>{t.modelTools}</dt><dd>{selectedRecord.measurement.context.model_and_tools[locale]}</dd></div><div><dt>{t.coverage}</dt><dd>{selectedRecord.measurement.context.time_coverage[locale]}</dd></div></>}</dl></details>
          </article>}
        </section>
      </div>

      <div className="calibrator-shell task-time-calibrator-shell">
        <div className="calibrator-controls">
          <fieldset><legend>{t.timeStep}</legend><div className="calibrator-levels">{(["copilot", "agent", "agency"] as IntegrationMode[]).map((mode) => <button aria-pressed={integrationMode === mode} key={mode} onClick={() => onIntegrationModeChange(mode)} type="button"><strong>{workModeTaxonomy[locale][mode].label}</strong><span>{workModeTaxonomy[locale][mode].code}</span></button>)}</div></fieldset>
          <div className="calibrator-inputs task-time-core-inputs">
            <label><span>{t.baseline}</span><div><input aria-label={t.baseline} max="10080" min="1" onChange={(event) => onBaselineMinutesChange(inputNumber(event.target.value, 1, 10080))} step="1" type="number" value={baselineMinutes} /><small>{t.units.minutes}</small></div></label>
            <label><span>{t.cases}</span><div><input aria-label={t.cases} max="1000000" min="1" onChange={(event) => onMonthlyCasesChange(inputNumber(event.target.value, 1, 1000000))} step="1" type="number" value={monthlyCases} /><small>{t.units.cases}</small></div></label>
            <label><span>{t.eligible}</span><div><input aria-label={t.eligible} max="100" min="0" onChange={(event) => onEligibleShareChange(inputNumber(event.target.value, 0, 100))} step="1" type="number" value={eligibleShare} /><small>{t.units.percent}</small></div></label>
            <label><span>{t.totalBaseline}</span><div><input aria-describedby="total-baseline-help" aria-label={t.totalBaseline} max="1000000000" min="0.1" onChange={(event) => onTotalBaselineHumanHoursChange(inputNumber(event.target.value, 0.1, 1000000000))} step="0.1" type="number" value={totalBaselineHumanHours} /><small>{t.units.hours}</small></div><em id="total-baseline-help">{t.totalBaselineHelp}</em></label>
          </div>
          <details className="task-time-components"><summary>{t.components}<span>+</span></summary><p>{t.componentsHelp}</p><div className="calibrator-inputs">
            <label><span>{t.preparation}</span><div><input aria-label={t.preparation} max="10080" min="0" onChange={(event) => updateScenario({ preparationMinutes: inputNumber(event.target.value, 0, 10080) })} type="number" value={preparationMinutes} /><small>{t.units.minutes}</small></div></label>
            <label><span>{t.supervision}</span><div><input aria-label={t.supervision} max="10080" min="0" onChange={(event) => updateScenario({ supervisionMinutes: inputNumber(event.target.value, 0, 10080) })} type="number" value={supervisionMinutes} /><small>{t.units.minutes}</small></div></label>
            <label><span>{t.verification}</span><div><input aria-label={t.verification} max="10080" min="0" onChange={(event) => updateScenario({ verificationMinutes: inputNumber(event.target.value, 0, 10080) })} type="number" value={verificationMinutes} /><small>{t.units.minutes}</small></div></label>
            <label><span>{t.correction}</span><div><input aria-label={t.correction} max="10080" min="0" onChange={(event) => updateScenario({ correctionMinutes: inputNumber(event.target.value, 0, 10080) })} type="number" value={correctionMinutes} /><small>{t.units.minutes}</small></div></label>
            <label><span>{t.exceptionRate}</span><div><input aria-label={t.exceptionRate} max="100" min="0" onChange={(event) => updateScenario({ exceptionRate: inputNumber(event.target.value, 0, 100) })} type="number" value={exceptionRate} /><small>{t.units.percent}</small></div></label>
            <label><span>{t.exceptionMinutes}</span><div><input aria-label={t.exceptionMinutes} max="10080" min="0" onChange={(event) => updateScenario({ exceptionMinutes: inputNumber(event.target.value, 0, 10080) })} type="number" value={exceptionMinutes} /><small>{t.units.minutes}</small></div></label>
            <label><span>{t.setup}</span><div><input aria-label={t.setup} max="1000000" min="0" onChange={(event) => onSetupHoursChange(inputNumber(event.target.value, 0, 1000000))} type="number" value={setupHours} /><small>{t.units.hours}</small></div><em>{locale === "en" ? "Mode preset" : "Repère du mode"}: {setupPresets[integrationMode]} h</em></label>
            <label><span>{t.amortization}</span><div><input aria-label={t.amortization} max="120" min="1" onChange={(event) => updateScenario({ amortizationMonths: inputNumber(event.target.value, 1, 120) })} type="number" value={amortizationMonths} /><small>{t.units.months}</small></div></label>
          </div></details>
          <details className="task-time-components task-time-sensitivity" ref={scenarioControls}>
            <summary>{t.scenarioTitle}<span aria-hidden="true">+</span></summary>
            <p>{t.scenarioHelp}</p>
            <div className="task-time-selects"><label><span>{t.basisLabel}</span><select aria-label={t.basisLabel} value={planningOptions.use_source ? "source" : "local"} onChange={(event) => updateOptions({ use_source: event.target.value === "source" })}><option value="source">{t.basisSource}</option><option value="local">{t.basisLocal}</option></select></label></div>
            <label className="task-time-demo-toggle"><input type="checkbox" checked={planningOptions.sensitivity?.enabled ?? false} onChange={(event) => updateOptions({ sensitivity: { cautious_review_minutes: 10, favorable_review_minutes: 10, cautious_exception_points: 10, favorable_exception_points: 10, cautious_setup_hours: 8, favorable_setup_hours: 4, ...(scenario.planningOptions?.sensitivity ?? {}), enabled: event.target.checked } })} />{t.scenarioToggle}</label>
            {planningOptions.sensitivity?.enabled && <div className="calibrator-inputs">{Object.entries(t.scenarioLabels).map(([key, label]) => <label key={key}><span>{label}</span><div><input aria-label={label} type="number" min="0" max={key.includes("exception") ? 100 : key.includes("setup") ? 1000000 : 10080} value={(planningOptions.sensitivity?.[key as keyof NonNullable<PlanningOptions["sensitivity"]>] as number) ?? 0} onChange={(event) => updateOptions({ sensitivity: { ...planningOptions.sensitivity, [key]: inputNumber(event.target.value, 0, key.includes("exception") ? 100 : key.includes("setup") ? 1000000 : 10080) } })} /><small>{key.includes("exception") ? "points" : key.includes("setup") ? "h" : "min"}</small></div></label>)}</div>}
          </details>
          <details className="task-time-components">
            <summary>{t.extraTitle}<span aria-hidden="true">+</span></summary><p>{t.coverageHelp}</p>
            <div className="calibrator-inputs">
              <label><span>{t.additional}</span><div><input aria-label={t.additional} type="number" min="0" max="10080" value={planningOptions.additional_minutes ?? 0} onChange={(event) => updateOptions({ additional_minutes: inputNumber(event.target.value, 0, 10080) })} /><small>min</small></div></label>
              {evidenceTransfer.ok && planningOptions.use_source && <label><span>{t.sourceSetup}</span><div><input aria-label={t.sourceSetup} type="number" min="0" max="10080" value={planningOptions.source_setup_minutes ?? 0} onChange={(event) => updateOptions({ source_setup_minutes: inputNumber(event.target.value, 0, 10080) })} /><small>min</small></div></label>}
            </div>
          </details>
          <div className="task-time-mode-effect" data-mode={integrationMode}>
            <strong>{t.modeEffect}</strong>
            <p>{t.modeEffectLead} {t.modeEffectRecurring} <b>{formatNumber(netScenarios.central.local_operating_floor_minutes, locale)} min</b>. {netScenarios.central.source_implied_human_minutes == null ? null : <>{t.modeEffectSource} <b>{formatNumber(netScenarios.central.source_implied_human_minutes, locale)} min</b>. {t.modeEffectConservative} <b>{formatNumber(netScenarios.central.operating_human_minutes, locale)} min</b>. </>} {t.modeEffectNet} <b>{formatPercent(netScenarios.central.recurring_reduction_fraction, locale)}%</b> {netCalculable ? <>{t.modeEffectNetSuffix} <b>{formatNumber(netScenarios.central.amortized_setup_minutes_per_case ?? 0, locale)} min</b> {t.modeEffectSetupSuffix}</> : t.modeEffectSetupUnavailable}</p>
          </div>
        </div>

        <output className="calibrator-results" aria-live="polite">
          <div className="reader-workload-summary" data-metric="whole-summary">
            <strong>{locale === "en" ? "YOUR MONTH, IN HUMAN WORK HOURS" : "VOTRE MOIS, EN HEURES DE TRAVAIL HUMAIN"}</strong>
            {wholeWorkloadCalculable && monthlySaved != null && remainingHours != null ? <p>{locale === "en"
              ? `With the current assumptions, about ${formatNumber(Math.abs(monthlySaved), locale)} hours would be ${monthlySaved < 0 ? "added" : "saved"} per month against ${formatNumber(totalBaselineHumanHours, locale)} hours today. About ${formatNumber(remainingHours, locale)} hours of human work would remain, including the monthly share of setup.`
              : `Avec les hypothèses actuelles, environ ${formatNumber(Math.abs(monthlySaved), locale)} heures seraient ${monthlySaved < 0 ? "ajoutées" : "économisées"} par mois, pour ${formatNumber(totalBaselineHumanHours, locale)} heures aujourd’hui. Il resterait environ ${formatNumber(remainingHours, locale)} heures de travail humain, part mensuelle de mise en place comprise.`}</p>
              : <p>{locale === "en" ? "A monthly total cannot be estimated with these inputs. Check the eligible share and the total current workload below." : "Ces valeurs ne permettent pas d’estimer le total mensuel. Vérifiez la part éligible et la charge totale actuelle ci-dessous."}</p>}
            <small>{locale === "en" ? "Middle scenario, not an observed result. Initial demonstration values remain in use unless you replace them." : "Scénario central, pas un résultat observé. Les valeurs initiales de démonstration restent utilisées tant que vous ne les remplacez pas."}</small>
            <button className="reader-scenarios-link" type="button" onClick={() => { if (scenarioControls.current) { scenarioControls.current.open = true; scenarioControls.current.querySelector("summary")?.focus(); scenarioControls.current.scrollIntoView({ behavior: "smooth", block: "center" }); } }}>{locale === "en" ? "Explore three editable scenarios" : "Explorer trois scénarios modifiables"}</button>
          </div>
          <div className="calibrator-result-head" data-calculable={wholeWorkloadCalculable}><span>{t.results.heading}</span><strong>{wholeWorkloadCalculable ? `${formatPercent(netScenarios.central.whole_workload_reduction_fraction ?? 0, locale)}%` : "n/a"}</strong><small>{planningBasis}{planningOptions.sensitivity?.enabled ? (locale === "en" ? " · demonstration scenarios, not a confidence interval" : " · scénarios de démonstration, pas un intervalle de confiance") : ""}</small></div>
          <div className="calibrator-result-grid">
            <p><span>{t.results.wholeBaseline}</span><strong>{formatNumber(totalBaselineHumanHours, locale)} h</strong><small>{formatNumber(monthlyCases, locale)} {t.units.cases}</small></p>
            <p><span>{t.results.baseline}</span><strong>{formatNumber(humanScenario.baseline_eligible_human_hours, locale)} h</strong><small>{formatNumber(humanScenario.eligible_cases, locale)} {t.units.cases}</small></p>
          </div>
          <details className="reader-case-details"><summary>{locale === "en" ? "See time per case and setup costs" : "Voir le temps par cas et la mise en place"}</summary>
          <div className="calibrator-result-grid">
            <p data-metric="recurring-time"><span>{t.results.recurring}</span><strong>{formatNumber(netScenarios.central.operating_human_minutes, locale)} min</strong><small>{formatNumber(netScenarios.central.local_operating_floor_minutes, locale)} min {t.results.localFloor}</small></p>
            <p data-metric="recurring-gain"><span>{t.results.recurringGain}</span><strong>{formatPercent(netScenarios.central.recurring_reduction_fraction, locale)}%</strong><small>{netCalculable ? `${formatNumber(netScenarios.central.recurring_human_hours_saved_per_month, locale)} ${t.results.perMonth}` : t.results.planningUnavailable}</small></p>
            <p data-metric="setup"><span>{t.results.setupPerCase}</span><strong>{netCalculable ? `${formatNumber(netScenarios.central.amortized_setup_minutes_per_case ?? 0, locale)} min` : "n/a"}</strong><small>{formatNumber(setupHours, locale)} h / {formatNumber(amortizationMonths, locale)} {t.units.months}</small></p>
            <p data-metric="net-time"><span>{t.results.withAi}</span><strong>{netCalculable ? `${formatNumber(netScenarios.central.human_time_with_ai_minutes ?? 0, locale)} min` : "n/a"}</strong><small>{netCalculable ? `${formatPercent(netScenarios.central.reduction_fraction ?? 0, locale)}% ${t.results.eligibleNet}` : t.results.planningUnavailable}</small></p>
          </div></details>
          <div className="calibrator-result-grid">
            {netRangeVaries ? <>
              <p data-range="low"><span>{t.results.low}</span><strong>{wholeWorkloadCalculable ? `${formatPercent(netScenarios.low.whole_workload_reduction_fraction ?? 0, locale)}%` : "n/a"}</strong><small>{netCalculable ? `${formatNumber(netScenarios.low.human_hours_saved_per_month ?? 0, locale)} ${t.results.perMonth}` : t.results.planningUnavailable}</small></p>
              <p data-range="central"><span>{t.results.central}</span><strong>{wholeWorkloadCalculable ? `${formatPercent(netScenarios.central.whole_workload_reduction_fraction ?? 0, locale)}%` : "n/a"}</strong><small>{netCalculable ? `${formatNumber(netScenarios.central.human_hours_saved_per_month ?? 0, locale)} ${t.results.perMonth}` : t.results.planningUnavailable}</small></p>
              <p data-range="high"><span>{t.results.high}</span><strong>{wholeWorkloadCalculable ? `${formatPercent(netScenarios.high.whole_workload_reduction_fraction ?? 0, locale)}%` : "n/a"}</strong><small>{netCalculable ? `${formatNumber(netScenarios.high.human_hours_saved_per_month ?? 0, locale)} ${t.results.perMonth}` : t.results.planningUnavailable}</small></p>
            </> : <p className="task-time-local-scenario" data-range="local"><span>{t.results.localScenario}</span><strong>{wholeWorkloadCalculable ? `${formatPercent(netScenarios.central.whole_workload_reduction_fraction ?? 0, locale)}%` : "n/a"}</strong><small>{planningOptions.sensitivity?.enabled || !planningOptions.use_source ? (locale === "en" ? "Your settings currently give one result. Open the scenario controls to vary your assumptions." : "Vos réglages donnent actuellement un seul résultat. Ouvrez les scénarios pour faire varier vos hypothèses.") : transferableRange ? t.results.collapsedRange : t.results.noRange}</small></p>}
            <p data-metric="payback"><span>{t.results.payback}</span><strong>{paybackRange}</strong>{netCalculable && mixedPayback && <small>{paybackDetails}</small>}</p>
          </div>
          <div className="task-time-source-range" data-transferable={Boolean(transferableRange)}><span>{t.evidenceRange}</span>{transferableRange ? <strong>{formatRange([transferableRange.low.reduction_fraction, transferableRange.central.reduction_fraction, transferableRange.high.reduction_fraction], (value) => formatPercent(value, locale))}%</strong> : <p>{t.evidenceBlocked}</p>}<small>{!planningOptions.use_source && <>{t.localChoice} </>}{selectedRecord ? `${t.evidenceReference} : ${selectedRecord.evidence_id} · ${t.statuses[selectedCompatibility?.status ?? "incompatible"]}` : t.noEvidence}</small></div>
          {netCalculable ? <details className="calibrator-equation calibrator-equation-details"><summary>{t.calculationLabel}<span aria-hidden="true">+</span></summary><p>{t.calculationPlain}</p><ul>{describePlanningAssumptions(planningRange, locale).map((line) => <li key={line}>{line}</li>)}</ul><code>max({netScenarios.central.source_implied_human_minutes == null ? "0 min" : `${formatNumber(netScenarios.central.source_implied_human_minutes, locale)} − ${formatNumber(netScenarios.central.source_setup_removed_minutes, locale)} min`}, {formatNumber(netScenarios.central.local_operating_floor_minutes, locale)} min) + {formatNumber(netScenarios.central.additional_minutes, locale)} min + {formatNumber(netScenarios.central.amortized_setup_minutes_per_case ?? 0, locale)} min = <strong>{formatNumber(netScenarios.central.human_time_with_ai_minutes ?? 0, locale)} min</strong></code></details> : <p className="calibrator-equation"><strong>n/a</strong> {t.zeroEligible}</p>}
          {!humanScenario.workload_denominator_valid && <p className="task-time-negative"><strong>{t.invalidDenominator}</strong></p>}
          {netCalculable && (netScenarios.low.reduction_fraction ?? 0) < 0 && <p className="task-time-negative">{t.negative}</p>}
        </output>
      </div>
      <details className="task-time-eval-help"><summary>{t.evalHelpTitle}</summary><ol>{t.evalQuestions.map((question) => <li key={question}>{question}</li>)}</ol><p>{t.evalHelpNote}</p></details>
      <aside className="calibrator-note"><strong>{locale === "en" ? "HOW THE ESTIMATED SAVING IS CALCULATED" : "COMMENT LE GAIN DE TEMPS EST CALCULÉ"}</strong><p>{t.boundary}</p></aside>
    </>
  );
}

export function describePlanningAssumptions(range: TaskTimePlanningRange, locale: Locale): string[] {
  const options = normalizePlanningOptions(range.assumptions);
  const t = content[locale];
  const lines = [
    t.basisLabel + " " + (options.use_source ? t.basisSource : t.basisLocal),
    t.additional + ": " + (options.additional_minutes ?? 0) + " min",
    t.sourceSetup + ": " + (options.source_setup_minutes ?? 0) + " min" + (range.source === "local_hypothesis" ? (locale === "en" ? " (not applied: local scenario)" : " (non appliquées : scénario local)") : ""),
    t.scenarioToggle + ": " + (options.sensitivity?.enabled ? (locale === "en" ? "yes" : "oui") : (locale === "en" ? "no" : "non")),
  ];
  if (options.sensitivity?.enabled) {
    for (const [key, label] of Object.entries(t.scenarioLabels)) {
      lines.push(label + ": " + (options.sensitivity[key as keyof NonNullable<PlanningOptions["sensitivity"]>] ?? 0) + (key.includes("exception") ? " points" : key.includes("setup") ? " h" : " min"));
    }
    lines.push(t.scenarioHelp);
  }
  return lines;
}
