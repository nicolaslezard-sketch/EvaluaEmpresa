import { redirect } from "next/navigation";

/**
 * Canonical billing URL.
 * Legacy: /app/upgrade
 */
export default function BillingPage() {
  redirect("/app/upgrade");
}
