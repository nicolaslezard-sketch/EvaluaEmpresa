import { redirect } from "next/navigation";

export default function LegacyNewTierPage({
  params,
}: {
  params: { tier: string };
}) {
  const t = (params.tier ?? "").toLowerCase();
  const intent = t === "empresa" ? "empresa" : t === "pyme" ? "pyme" : null;
  redirect(intent ? `/app/new?intent=${intent}` : "/new");
}
