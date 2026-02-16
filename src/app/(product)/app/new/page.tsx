import { redirect } from "next/navigation";

function parseIntent(param?: string) {
  const t = (param ?? "").toLowerCase();
  if (t === "empresa") return "empresa";
  if (t === "pyme") return "pyme";
  return null;
}

export default function LegacyNewPage({
  searchParams,
}: {
  searchParams?: { tier?: string };
}) {
  const intent = parseIntent(searchParams?.tier);
  redirect(
    intent ? `/app/evaluations/new?intent=${intent}` : "/app/evaluations/new",
  );
}
