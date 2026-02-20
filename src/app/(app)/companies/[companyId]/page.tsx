export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

/* =========================
   HELPERS
========================= */

function categoryStyles(category: string) {
  switch (category) {
    case "SOLIDO":
      return "bg-emerald-100 text-emerald-700";
    case "ESTABLE":
      return "bg-blue-100 text-blue-700";
    case "VULNERABLE":
      return "bg-amber-100 text-amber-700";
    case "CRITICO":
      return "bg-red-100 text-red-700";
    default:
      return "bg-zinc-100 text-zinc-600";
  }
}

function alertStyles(severity: string) {
  switch (severity) {
    case "CRITICAL":
      return "bg-red-50 border-red-200 text-red-700";
    case "WARNING":
      return "bg-amber-50 border-amber-200 text-amber-700";
    default:
      return "bg-zinc-50 border-zinc-200 text-zinc-700";
  }
}

/* =========================
   DATA
========================= */

async function getCompany(id: string, userId: string) {
  const company = await prisma.company.findUnique({
    where: {
      id,
    },
    include: {
      evaluations: {
        orderBy: { createdAt: "desc" },
      },
      alerts: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!company || company.ownerId !== userId) {
    return null;
  }

  return company;
}

/* =========================
   PAGE
========================= */

export default async function CompanyPage({
  params,
}: {
  params: { id: string };
}) {
  console.log("PARAMS:", params);

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  if (!params?.id) notFound();

  const data = await getCompany(params.id, session.user.id);

  if (!data) notFound();

  const latest = data.evaluations[0];

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">{data.name}</h1>
          <div className="text-sm text-zinc-500">
            Criticidad: {data.criticality}
          </div>
        </div>

        {latest?.executiveCategory && (
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${categoryStyles(
              latest.executiveCategory,
            )}`}
          >
            {latest.executiveCategory}
          </span>
        )}
      </div>

      {/* SCORE PRINCIPAL */}
      {latest && (
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <div className="text-5xl font-semibold text-zinc-900">
            {latest.overallScore !== null
              ? latest.overallScore.toFixed(1)
              : "—"}
          </div>

          {latest.deltaOverall !== null && (
            <div className="mt-3 text-sm text-zinc-500">
              Δ {latest.deltaOverall.toFixed(1)}
            </div>
          )}

          <div className="mt-6 h-2 w-full rounded-full bg-zinc-100">
            <div
              className="h-2 rounded-full bg-zinc-900 transition-all"
              style={{
                width: `${
                  latest.overallScore !== null
                    ? Math.min(Math.max(latest.overallScore, 0), 100)
                    : 0
                }%`,
              }}
            />
          </div>
        </div>
      )}

      {/* HISTÓRICO */}
      {data.evaluations.length > 1 && (
        <div>
          <h2 className="mb-4 text-lg font-medium text-zinc-900">Historial</h2>

          <div className="space-y-3">
            {data.evaluations.map((ev) => (
              <div
                key={ev.id}
                className="flex items-center justify-between rounded-lg border bg-white p-4"
              >
                <div className="text-sm text-zinc-600">
                  {new Date(ev.createdAt).toLocaleDateString()}
                </div>

                <div className="flex items-center gap-4">
                  <div className="font-medium">
                    {ev.overallScore !== null
                      ? ev.overallScore.toFixed(1)
                      : "—"}
                  </div>

                  {ev.deltaOverall !== null && (
                    <div className="text-xs text-zinc-500">
                      Δ {ev.deltaOverall.toFixed(1)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ALERTAS */}
      {data.alerts && data.alerts.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-medium text-zinc-900">Alertas</h2>

          <div className="space-y-3">
            {data.alerts.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-lg border p-4 text-sm ${alertStyles(
                  alert.severity,
                )}`}
              >
                {alert.message}
              </div>
            ))}
            {!data.alerts && (
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-500">
                Las alertas están disponibles en el plan Business.
                <a href="/billing" className="ml-2 font-medium underline">
                  Actualizar plan
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
