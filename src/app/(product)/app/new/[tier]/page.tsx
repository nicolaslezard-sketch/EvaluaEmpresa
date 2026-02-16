import { redirect } from "next/navigation";
import NewAssessmentWizard from "@/components/app/NewAssessmentWizard";

type Tier = "PYME" | "EMPRESA";

function parseTier(tier?: string): Tier | null {
  const t = (tier ?? "").toLowerCase();
  if (t === "pyme") return "PYME";
  if (t === "empresa") return "EMPRESA";
  return null;
}

export default function NewTierPage({ params }: { params: { tier: string } }) {
  const tier = parseTier(params.tier);

  // Si alguien entra a /app/new/cualquiercosa => lo mandamos a PYME
  if (!tier) redirect("/app/new/pyme");

  return <NewAssessmentWizard tier={tier} />;
}
