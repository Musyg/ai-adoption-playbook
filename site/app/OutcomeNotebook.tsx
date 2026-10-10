"use client";

type Locale = "en" | "fr";
export function outcomeFieldDefinitions(locale: Locale) {
  const fr = locale === "fr";
  const pair = (id: string, en: string, frLabel: string, enHelp: string, frHelp: string, kind: "number" | "text" = "number") => ({ id, label: fr ? frLabel : en, help: fr ? frHelp : enHelp, kind });
  return [
    pair("outcomeBasis", "Basis and source", "Base et source", "Write demonstration or observed comparison, dates and source. Editing a demo does not make it observed.", "Précisez démonstration ou comparaison observée, dates et source. Modifier une démo ne la rend pas observée.", "text"),
    pair("outcomeElapsedBefore", "Elapsed minutes without AI", "Minutes écoulées sans IA", "From start to accepted result, including waits, for the same type of case.", "Du début au résultat accepté, attentes comprises, pour le même type de cas."),
    pair("outcomeElapsedAfter", "Elapsed minutes with AI", "Minutes écoulées avec IA", "Same clock and case definition. Do not add this duration to human work.", "Même horloge et même définition du cas. Ne pas ajouter cette durée au travail humain."),
    pair("outcomeCostUnit", "Cost unit", "Unité de coût", "For example CHF per accepted case. Use the same unit on both sides.", "Par exemple CHF par cas accepté. Utilisez la même unité des deux côtés.", "text"),
    pair("outcomeCostBefore", "Cost without AI", "Coût sans IA", "State which costs are included. Count a labour cost only once.", "Précisez les coûts inclus. Comptez un coût de travail une seule fois."),
    pair("outcomeCostAfter", "Cost with AI", "Coût avec IA", "Include comparable tools, operation and setup allocation. Freed hours are not cash savings by themselves.", "Incluez outils comparables, exploitation et installation amortie. Les heures libérées ne sont pas à elles seules une économie de trésorerie."),
    pair("outcomeQualityBefore", "Accepted cases without AI (%)", "Cas acceptés sans IA (%)", "Same review criteria and comparable sample.", "Mêmes critères de revue et échantillon comparable."),
    pair("outcomeQualityAfter", "Accepted cases with AI (%)", "Cas acceptés avec IA (%)", "Include failed cases, not just the best outputs.", "Incluez les échecs, pas seulement les meilleures sorties."),
  ];
}

export default function OutcomeNotebook({ locale, values, onChange }: { locale: Locale; values: Record<string, string>; onChange: (patch: Record<string, string>) => void }) {
  const fr = locale === "fr";
  const fields = outcomeFieldDefinitions(locale);
  const difference = (before: string, after: string, percent = false) => {
    if (!values[before]?.trim() || !values[after]?.trim()) return null;
    const a = Number(values[before]), b = Number(values[after]);
    if (!Number.isFinite(a) || !Number.isFinite(b) || a < 0 || b < 0 || (percent && (a > 100 || b > 100))) return null;
    return new Intl.NumberFormat(fr ? "fr-FR" : "en-US", { maximumFractionDigits: 2 }).format(b - a);
  };
  return <details className="outcome-notebook">
    <summary>{fr ? "Comparer aussi le délai, les coûts et la qualité (facultatif)" : "Also compare delay, costs and quality (optional)"}</summary>
    <p>{fr ? "Le temps humain reste dans le calibrateur, supervision comprise. Ici, relevez d’autres résultats sans les convertir automatiquement en heures ni les additionner entre eux. Les champs restent dans votre dossier." : "Human time stays in the calculator, including supervision. Record other outcomes here without automatically converting them into hours or adding them together. These fields stay in your dossier."}</p>
    <button type="button" onClick={() => onChange({ outcomeBasis: fr ? "Démonstration, pas une observation" : "Demonstration, not an observation", outcomeElapsedBefore: "20", outcomeElapsedAfter: "5", outcomeCostUnit: "CHF / " + (fr ? "cas accepté" : "accepted case"), outcomeCostBefore: "8", outcomeCostAfter: "3", outcomeQualityBefore: "90", outcomeQualityAfter: "94" })}>{fr ? "Charger un exemple de démonstration" : "Load a demonstration example"}</button>
    <div className="lifecycle-fields">{fields.map((item) => <label key={item.id}><span>{item.label}</span><input name={item.id} type={item.kind} min={item.kind === "number" ? 0 : undefined} max={item.id.includes("Quality") ? 100 : undefined} step={item.kind === "number" ? "any" : undefined} value={values[item.id] ?? ""} onChange={(event) => onChange({ [item.id]: event.target.value })} /><small>{item.help}</small></label>)}</div>
    <output><p>{fr ? "Différence avec IA moins sans IA :" : "Difference with AI minus without AI:"}</p>
      <ul><li>{fr ? "Délai" : "Elapsed time"} : {difference("outcomeElapsedBefore", "outcomeElapsedAfter") ?? (fr ? "à compléter" : "not entered")} min</li>
        <li>{fr ? "Coût" : "Cost"} : {values.outcomeCostUnit?.trim() ? difference("outcomeCostBefore", "outcomeCostAfter") ?? (fr ? "à compléter" : "not entered") : (fr ? "préciser l’unité" : "specify the unit")} {values.outcomeCostUnit}</li>
        <li>{fr ? "Qualité" : "Quality"} : {difference("outcomeQualityBefore", "outcomeQualityAfter", true) ?? (fr ? "à compléter" : "not entered")} {fr ? "points de pourcentage" : "percentage points"}</li></ul>
      <p>{fr ? "Une valeur négative signifie moins de délai ou de coût ; pour la qualité, une valeur positive signifie davantage de cas acceptés. La source reste à vérifier avant une décision." : "A negative value means less delay or cost; for quality, a positive value means more accepted cases. Check the source before making a decision."}</p>
    </output>
  </details>;
}
