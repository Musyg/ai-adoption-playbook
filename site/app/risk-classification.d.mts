export type RiskInputs = {
  impact: "low" | "material" | "high";
  dataSensitivity: "none" | "personal" | "sensitive";
  externalInteraction: "no" | "yes";
  automatedDecision: "no" | "yes";
  autonomy: number;
};

export function deriveRiskLevel(inputs: RiskInputs): 0 | 1 | 2 | 3;
