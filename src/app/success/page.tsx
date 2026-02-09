import GenerateTrigger from "./GenerateTrigger";

export default function SuccessPage({
  searchParams,
}: {
  searchParams?: { reportId?: string; status?: string };
}) {
  if (searchParams?.status !== "approved" || !searchParams.reportId) {
    return <p>Estado del pago: {searchParams?.status}</p>;
  }

  return (
    <main className="mx-auto max-w-xl py-20">
      <h1 className="text-2xl font-semibold">✅ Pago aprobado</h1>

      <p className="mt-4">
        Estamos generando tu informe. Lo vas a recibir por email.
      </p>

      <GenerateTrigger reportId={searchParams.reportId} />
    </main>
  );
}
