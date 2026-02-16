import { redirect } from "next/navigation";

function parseTier(param?: string) {
  const t = (param ?? "").toLowerCase();
  if (t === "empresa") return "empresa";
  return "pyme";
}

export default function NewPage({
  searchParams,
}: {
  searchParams?: { tier?: string };
}) {
  const tier = parseTier(searchParams?.tier);

  // Mantiene compatibilidad con /app/new?tier=pyme|empresa
  redirect(`/app/new/${tier}`);
}
