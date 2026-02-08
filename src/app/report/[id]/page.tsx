import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReportPage({ params }: PageProps) {
  const { id } = await params; // 🔥 CLAVE

  if (!id) {
    return <div>Reporte no encontrado</div>;
  }

  const report = await prisma.reportRequest.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      createdAt: true,
    },
  });

  if (!report) {
    return <div>Reporte inexistente</div>;
  }

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold">Informe de Riesgo Empresarial</h1>

      <p className="mt-4 text-gray-400">
        Estado actual: <b>{report.status}</b>
      </p>

      {report.status !== "PAID" && (
        <form action={`/api/mp/create-preference`} method="POST">
          <input type="hidden" name="reportId" value={report.id} />
          <button className="mt-6 rounded bg-blue-600 px-6 py-3">
            Pagar informe
          </button>
        </form>
      )}
    </div>
  );
}
