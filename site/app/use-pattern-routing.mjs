export const usePatternIds = ["generation", "retrieval", "classification", "prediction", "conversation", "multimodal", "agentic"];

export function validAdditionalUsePatterns(primary, additional) {
  return usePatternIds.includes(primary) && Array.isArray(additional)
    && additional.every((id) => usePatternIds.includes(id) && id !== primary)
    && new Set(additional).size === additional.length;
}

export function activeUsePatterns(primary, additional = []) {
  return usePatternIds.filter((id) => id === primary || additional.includes(id));
}

export function matchesUsePatterns(control, primary, additional = []) {
  return !control.applicability.use_patterns
    || activeUsePatterns(primary, additional).some((id) => control.applicability.use_patterns.includes(id));
}
