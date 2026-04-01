export type RelationshipImportanceValue =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | string
  | null
  | undefined;

export const RELATIONSHIP_IMPORTANCE_LABEL = "Importancia de la relación";

export const RELATIONSHIP_IMPORTANCE_HINT =
  "Indica cuánto impacta este tercero en tu operación si su situación cambia.";

export function relationshipImportanceLabel(
  value: RelationshipImportanceValue,
) {
  switch (value) {
    case "LOW":
      return "Baja";
    case "MEDIUM":
      return "Media";
    case "HIGH":
      return "Alta";
    default:
      return "No definida";
  }
}
