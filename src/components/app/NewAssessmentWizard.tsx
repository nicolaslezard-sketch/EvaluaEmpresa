"use client";

import AssessmentWizard from "@/components/assessment/wizard/AssessmentWizard";

export type EvaluationTier = "PYME" | "EMPRESA";

export default function NewAssessmentWizard({
  tier,
}: {
  tier: EvaluationTier;
}) {
  return <AssessmentWizard key={tier} tier={tier} />;
}
