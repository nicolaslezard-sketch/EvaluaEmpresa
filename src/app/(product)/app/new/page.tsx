import NewAssessmentWizard from "@/components/app/NewAssessmentWizard";
import { EvaluationTier } from "@prisma/client";
import { notFound } from "next/navigation";

export default function NewPage({
  searchParams,
}: {
  searchParams: { tier?: string };
}) {
  const tierParam = searchParams?.tier?.toUpperCase();

  if (tierParam !== "PYME" && tierParam !== "EMPRESA") {
    notFound();
  }

  const tier = tierParam as EvaluationTier;

  return <NewAssessmentWizard tier={tier} />;
}
