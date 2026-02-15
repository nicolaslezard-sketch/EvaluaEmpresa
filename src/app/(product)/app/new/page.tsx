import NewAssessmentWizard from "@/components/app/NewAssessmentWizard";
import type { EvaluationTier } from "@prisma/client";

export default function NewPage({
  searchParams,
}: {
  searchParams: { tier?: string };
}) {
  const tierParam = searchParams?.tier?.toUpperCase();
  const tier: EvaluationTier = tierParam === "EMPRESA" ? "EMPRESA" : "PYME";

  return <NewAssessmentWizard tier={tier} />;
}
