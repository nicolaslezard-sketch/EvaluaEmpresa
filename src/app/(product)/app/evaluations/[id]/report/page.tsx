import { redirect } from "next/navigation";

/**
 * Canonical report URL.
 * Keeps older internal pages working by redirecting to the current renderer.
 */
export default function EvaluationReportPage({
  params,
}: {
  params: { id: string };
}) {
  redirect(`/app/analysis/${params.id}`);
}
