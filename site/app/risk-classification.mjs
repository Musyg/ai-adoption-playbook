/**
 * Conservative internal triage. This is an orientation, not a legal finding.
 * Every higher-impact characteristic wins over lower ones.
 */
export function deriveRiskLevel({ impact, dataSensitivity, externalInteraction, automatedDecision, autonomy }) {
  if (impact === "high" || automatedDecision === "yes") return 3;
  if (impact === "material"
    || dataSensitivity === "personal"
    || dataSensitivity === "sensitive"
    || externalInteraction === "yes") return 2;
  return autonomy === 0 ? 0 : 1;
}
