import NewAssessmentWizard from "@/components/app/NewAssessmentWizard";

type Intent = "PYME" | "EMPRESA";

function parseIntent(param?: string): Intent {
  const t = (param ?? "").toLowerCase();
  if (t === "empresa") return "EMPRESA";
  return "PYME";
}

/**
 * Canonical route for starting an evaluation.
 * URL does NOT define permissions; it only defines user intent (copy/UX).
 * Real access is decided by entitlements during report viewing/unlock.
 */
export default function NewEvaluationPage({
  searchParams,
}: {
  searchParams?: { intent?: string };
}) {
  const intent = parseIntent(searchParams?.intent);
  return <NewAssessmentWizard tier={intent} />;
}
