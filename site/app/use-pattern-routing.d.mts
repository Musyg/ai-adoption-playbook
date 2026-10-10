export type UsePatternId = "generation" | "retrieval" | "classification" | "prediction" | "conversation" | "multimodal" | "agentic";
export const usePatternIds: UsePatternId[];
export function validAdditionalUsePatterns(primary: unknown, additional: unknown): boolean;
export function activeUsePatterns(primary: UsePatternId, additional?: UsePatternId[]): UsePatternId[];
export function matchesUsePatterns(control: { applicability: { use_patterns?: UsePatternId[] } }, primary: UsePatternId, additional?: UsePatternId[]): boolean;
