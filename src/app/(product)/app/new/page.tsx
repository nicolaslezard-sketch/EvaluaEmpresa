import NewAssessmentWizard from "@/components/app/NewAssessmentWizard";

type EvaluationTier = "PYME" | "EMPRESA";

export default function NewPage({
  searchParams,
}: {
  searchParams?: { tier?: string };
}) {
  const tierParam = searchParams?.tier?.toUpperCase();

  const tier: EvaluationTier = tierParam === "EMPRESA" ? "EMPRESA" : "PYME";

  return <NewAssessmentWizard tier={tier} />;
}
