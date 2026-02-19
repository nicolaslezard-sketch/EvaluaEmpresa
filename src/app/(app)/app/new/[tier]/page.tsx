import { redirect } from "next/navigation";

/**
 * LEGACY ROUTE (backward compatibility)
 * Old: /app/new/pyme | /app/new/empresa
 * New canonical: /app/evaluations/new?intent=pyme|empresa
 */
export default function LegacyNewTierPage({
  params,
}: {
  params: { tier: string };
}) {
  const t = (params.tier ?? "").toLowerCase();
  const intent = t === "empresa" ? "empresa" : t === "pyme" ? "pyme" : null;
  redirect(
    intent ? `/app/evaluations/new?intent=${intent}` : "/app/evaluations/new",
  );
}
