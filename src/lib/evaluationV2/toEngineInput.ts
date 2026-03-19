import type { EvaluationInput } from "@/lib/engine";
import type {
  EvaluationFormData,
  FieldAssessment,
} from "@/lib/types/evaluationForm";

function getRequiredValue(
  field: FieldAssessment | undefined,
  label: string,
): number {
  if (typeof field?.value !== "number" || !Number.isFinite(field.value)) {
    throw new Error(`Missing required field value: ${label}`);
  }

  return field.value;
}

export function toEngineInput(formData: EvaluationFormData): EvaluationInput {
  return {
    financial: {
      liquidity: getRequiredValue(
        formData.financial.liquidity,
        "financial.liquidity",
      ),
      debtLevel: getRequiredValue(
        formData.financial.debtLevel,
        "financial.debtLevel",
      ),
      revenueStability: getRequiredValue(
        formData.financial.revenueStability,
        "financial.revenueStability",
      ),
      externalDependency: getRequiredValue(
        formData.financial.externalDependency,
        "financial.externalDependency",
      ),
    },
    commercial: {
      clientConcentration: getRequiredValue(
        formData.commercial.clientConcentration,
        "commercial.clientConcentration",
      ),
      competitivePosition: getRequiredValue(
        formData.commercial.competitivePosition,
        "commercial.competitivePosition",
      ),
      sectorDependency: getRequiredValue(
        formData.commercial.sectorDependency,
        "commercial.sectorDependency",
      ),
      contractGeneration: getRequiredValue(
        formData.commercial.contractGeneration,
        "commercial.contractGeneration",
      ),
    },
    operational: {
      keyPersonDependency: getRequiredValue(
        formData.operational.keyPersonDependency,
        "operational.keyPersonDependency",
      ),
      structureFormalization: getRequiredValue(
        formData.operational.structureFormalization,
        "operational.structureFormalization",
      ),
      operationalRisk: getRequiredValue(
        formData.operational.operationalRisk,
        "operational.operationalRisk",
      ),
      adaptability: getRequiredValue(
        formData.operational.adaptability,
        "operational.adaptability",
      ),
    },
    legal: {
      compliance: getRequiredValue(
        formData.legal.compliance,
        "legal.compliance",
      ),
      litigation: getRequiredValue(
        formData.legal.litigation,
        "legal.litigation",
      ),
      contractFormalization: getRequiredValue(
        formData.legal.contractFormalization,
        "legal.contractFormalization",
      ),
      regulatoryRisk: getRequiredValue(
        formData.legal.regulatoryRisk,
        "legal.regulatoryRisk",
      ),
    },
    strategic: {
      strategicClarity: getRequiredValue(
        formData.strategic.strategicClarity,
        "strategic.strategicClarity",
      ),
      macroDependency: getRequiredValue(
        formData.strategic.macroDependency,
        "strategic.macroDependency",
      ),
      innovationLevel: getRequiredValue(
        formData.strategic.innovationLevel,
        "strategic.innovationLevel",
      ),
      resilience: getRequiredValue(
        formData.strategic.resilience,
        "strategic.resilience",
      ),
    },
  };
}
