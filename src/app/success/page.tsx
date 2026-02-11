import { useEffect } from "react";

export default function SuccessPage({
  searchParams,
}: {
  searchParams?: { reportId?: string; status?: string };
}) {
  const reportId = searchParams?.reportId;
  const approved = searchParams?.status === "approved";

  useEffect(() => {
    if (!approved || !reportId) return;

    // 🔥 Dispara la generación (una sola vez)
    fetch(`/api/report/${reportId}/generate`, {
      method: "POST",
      headers: {
        "x-internal-secret": process.env.NEXT_PUBLIC_INTERNAL_SECRET!,
      },
    }).catch(() => {
      // no rompemos UX
    });
  }, [approved, reportId]);

  if (!approved || !reportId) {
    return <p>Estado del pago: {searchParams?.status}</p>;
  }

  return (
    <main className="mx-auto max-w-xl py-20 text-center">
      <h1 className="text-2xl font-semibold">✅ Pago aprobado</h1>

      <p className="mt-4">
        Estamos generando tu informe. Esto puede demorar unos segundos.
      </p>

      <p className="mt-2 text-sm opacity-70">
        Cuando esté listo, podrás descargarlo desde tu email o recargando esta
        página.
      </p>
    </main>
  );
}
