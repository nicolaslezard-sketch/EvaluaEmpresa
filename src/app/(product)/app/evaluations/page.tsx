import { redirect } from "next/navigation";

export default function EvaluationsIndex() {
  // For now, dashboard is the single place that lists evaluations.
  // This route exists as a stable URL for future expansion.
  redirect("/app/dashboard");
}
