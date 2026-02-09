export default function SuccessPage({
  searchParams,
}: {
  searchParams?: { reportId?: string; status?: string };
}) {
  if (searchParams?.status !== "approved" || !searchParams.reportId) {
    return <p>Estado del pago: {searchParams?.status}</p>;
  }

  return (
    <main className="mx-auto max-w-xl py-20 text-center">
      <h1 className="text-2xl font-semibold">✅ Pago aprobado</h1>

      <p className="mt-4">Tu informe está listo para generarse.</p>

      <a
        href={`/api/report/${searchParams.reportId}/pdf`}
        className="inline-block mt-6 rounded-lg bg-black px-6 py-3 text-white"
      >
        Descargar informe
      </a>
    </main>
  );
}
