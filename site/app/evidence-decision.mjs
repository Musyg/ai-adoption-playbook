/**
 * Apply the evidence-gate hierarchy. Safety is decisive; missing evidence is
 * censored rather than treated as success or failure.
 *
 * @param {{ samplePass: boolean, valuePass: boolean, qualityPass: boolean, safetyPass: boolean, tracePass: boolean }} gates
 * @returns {"continue" | "rework" | "unknown" | "stop"}
 */
export function decideEvidence(gates) {
  if (!gates.safetyPass) return "stop";
  if (!gates.samplePass || !gates.tracePass) return "unknown";
  if (!gates.valuePass || !gates.qualityPass) return "rework";
  return "continue";
}
