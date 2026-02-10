import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ReportPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  // 🔐 Login obligatorio
  if (!session?.user?.id) {
    redirect("/");
  }

  // 📄 Buscar reporte
  const report = await prisma.reportRequest.findUnique({
    where: { id: params.id },
  });

  // ❌ No existe o no es del user
  if (!report || report.userId !== session.user.id) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-20 text-white">
      <h1 className="text-3xl font-semibold">Informe de Riesgo Empresarial</h1>

      <p className="mt-2 text-sm text-zinc-400">
        Creado el {new Date(report.createdAt).toLocaleString()}
      </p>

      {/* ESTADOS */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-6">
        {report.status === "PAID" && (
          <Status text="Pago recibido. El informe se generará en breve." />
        )}

        {report.status === "GENERATING" && (
          <Status text="Estamos generando tu informe. Esto puede demorar unos minutos." />
        )}

        {report.status === "FAILED" && (
          <div className="space-y-4">
            <p className="text-red-400">
              ❌ Ocurrió un error al generar el informe.
            </p>

            {report.lastError && (
              <p className="text-xs text-zinc-500">{report.lastError}</p>
            )}

            {report.attempts < 3 ? (
              <form action={`/api/report/${report.id}/generate`} method="post">
                <button
                  type="submit"
                  className="
                    rounded-xl bg-white px-5 py-3
                    text-sm font-semibold text-black
                    hover:bg-zinc-200 transition
                  "
                >
                  Reintentar generación
                </button>
              </form>
            ) : (
              <p className="text-sm text-zinc-400">
                El informe falló varias veces. Contactanos para asistencia.
              </p>
            )}
          </div>
        )}

        {report.status === "DELIVERED" && (
          <div className="space-y-4">
            <p className="text-green-400">✅ Tu informe está listo.</p>

            <a
              href={`/api/report/download/${report.id}`}
              className="
                inline-flex items-center rounded-xl
                bg-white px-5 py-3
                text-sm font-semibold text-black
                hover:bg-zinc-200 transition
              "
            >
              Descargar PDF
            </a>
          </div>
        )}
      </div>
    </main>
  );
}

function Status({ text }: { text: string }) {
  return <p className="text-zinc-300">{text}</p>;
}
