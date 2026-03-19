export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUserEntitlements } from "@/lib/access/getEntitlements";

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
      return "bg-zinc-100 text-zinc-700";
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

function evaluationStatusStyles(status: string) {
  switch (status) {
    case "FINALIZED":
      return "bg-emerald-100 text-emerald-700";
    case "DRAFT":
      return "bg-amber-100 text-amber-700";
    case "EXPIRED":
      return "bg-zinc-100 text-zinc-700";
    default:
      return "bg-zinc-100 text-zinc-700";
  }
}

function evaluationStatusLabel(status: string) {
  switch (status) {
    case "FINALIZED":
      return "Finalizada";
    case "DRAFT":
      return "En curso";
    case "EXPIRED":
      return "Expirada";
    default:
      return status;
  }
}

function getReviewStatus(latestDate?: Date | null) {
  if (!latestDate) {
    return {
      label: "Sin evaluaciones",
      className: "bg-zinc-100 text-zinc-700",
    };
  }

  const now = Date.now();
  const diffDays = Math.floor(
    (now - new Date(latestDate).getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays >= 120) {
    return {
      label: "Desactualizada",
      className: "bg-red-100 text-red-700",
    };
  }

  if (diffDays >= 60) {
    return {
      label: "Próxima revisión",
      className: "bg-amber-100 text-amber-700",
    };
  }

  return {
    label: "Actualizada",
    className: "bg-emerald-100 text-emerald-700",
  };
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
  params: Promise<{ companyId: string }>;
}) {
  const resolvedParams = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const companyId = resolvedParams.companyId;

  if (!companyId) {
    notFound();
  }

  const data = await getCompany(companyId, session.user.id);

  if (!data) {
    notFound();
  }

  const ent = await getUserEntitlements(session.user.id);

  const activeDraft =
    data.evaluations.find((ev) => ev.status === "DRAFT") ?? null;

  const latestFinalized =
    data.evaluations.find((ev) => ev.status === "FINALIZED") ?? null;

  const reviewStatus = getReviewStatus(latestFinalized?.createdAt);

  const hasBrokenFinalized =
    data.evaluations.some(
      (ev) => ev.status === "FINALIZED" && !ev.reportData,
    ) ?? false;

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">{data.name}</h1>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-zinc-600">
            <span>Criticidad de la relación: {data.criticality}</span>
            <span>•</span>
            <span>
              Última evaluación válida:{" "}
              {latestFinalized
                ? new Date(latestFinalized.createdAt).toLocaleDateString()
                : "—"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${reviewStatus.className}`}
          >
            {reviewStatus.label}
          </span>

          {latestFinalized?.executiveCategory && (
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${categoryStyles(
                latestFinalized.executiveCategory,
              )}`}
            >
              {latestFinalized.executiveCategory}
            </span>
          )}

          {latestFinalized && (
            <Link
              href={`/companies/${data.id}/evaluations/${latestFinalized.id}`}
              className="inline-flex rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
            >
              Ver última evaluación
            </Link>
          )}

          <Link
            href={`/companies/${data.id}/evaluations/new`}
            className="inline-flex rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Nueva evaluación
          </Link>
        </div>
      </div>

      {/* DRAFT IN PROGRESS */}
      {activeDraft && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-base font-medium text-amber-900">
                Hay una evaluación en curso
              </div>
              <div className="mt-1 text-sm text-amber-800">
                Tenés un borrador activo para esta empresa. Puedes continuar esa
                evaluación sin perder el estado actual de la última evaluación
                finalizada.
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/companies/${data.id}/evaluations/${activeDraft.id}`}
                className="inline-flex rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800"
              >
                Continuar evaluación
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* LEGACY / BROKEN FINALIZED */}
      {hasBrokenFinalized && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="text-base font-medium text-red-900">
            Hay una evaluación finalizada con datos incompletos
          </div>
          <div className="mt-1 text-sm text-red-800">
            Detectamos al menos una evaluación finalizada sin reporte completo.
            No afecta la continuidad del monitoreo, pero conviene revisarla o
            regenerarla.
          </div>
        </div>
      )}

      {/* SCORE PRINCIPAL */}
      {latestFinalized ? (
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <div className="text-sm text-zinc-700">Score actual</div>
              <div className="mt-2 text-5xl font-semibold text-zinc-900">
                {latestFinalized.overallScore !== null
                  ? latestFinalized.overallScore.toFixed(1)
                  : "—"}
              </div>

              {latestFinalized.deltaOverall !== null && (
                <div className="mt-3 text-sm text-zinc-600">
                  Δ {latestFinalized.deltaOverall.toFixed(1)}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="text-sm text-zinc-700">
                Criticidad de la relación
              </div>
              <div className="mt-2 text-base font-medium text-zinc-900">
                {data.criticality}
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="text-sm text-zinc-700">
                Última evaluación válida
              </div>
              <div className="mt-2 text-base font-medium text-zinc-900">
                {new Date(latestFinalized.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="mt-6 h-2 w-full rounded-full bg-zinc-100">
            <div
              className="h-2 rounded-full bg-zinc-900 transition-all"
              style={{
                width: `${
                  latestFinalized.overallScore !== null
                    ? Math.min(Math.max(latestFinalized.overallScore, 0), 100)
                    : 0
                }%`,
              }}
            />
          </div>
        </div>
      ) : activeDraft ? (
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <div className="text-lg font-medium text-zinc-900">
            Tienes una evaluación inicial en curso
          </div>
          <div className="mt-2 max-w-2xl text-sm text-zinc-600">
            Esta empresa todavía no tiene evaluaciones finalizadas. Continúa el
            borrador actual para generar el primer score oficial y activar el
            monitoreo continuo.
          </div>

          <div className="mt-6">
            <Link
              href={`/companies/${data.id}/evaluations/${activeDraft.id}`}
              className="inline-flex rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Continuar evaluación
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <div className="text-lg font-medium text-zinc-900">
            Todavía no hay evaluaciones
          </div>
          <div className="mt-2 max-w-2xl text-sm text-zinc-600">
            Esta empresa todavía no tiene una evaluación inicial cargada. Iniciá
            la primera evaluación para generar el score actual, guardar el
            histórico y comenzar el monitoreo continuo.
          </div>

          <div className="mt-6">
            <Link
              href={`/companies/${data.id}/evaluations/new`}
              className="inline-flex rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Iniciar primera evaluación
            </Link>
          </div>
        </div>
      )}

      {/* HISTÓRICO */}
      {data.evaluations.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-medium text-zinc-900">Historial</h2>

          <div className="space-y-3">
            {data.evaluations.map((ev) => {
              const isDraft = ev.status === "DRAFT";
              const isFinalized = ev.status === "FINALIZED";
              const hasBrokenReport = isFinalized && !ev.reportData;

              return (
                <div
                  key={ev.id}
                  className="flex items-center justify-between rounded-lg border bg-white p-4"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-sm text-zinc-600">
                      {new Date(ev.createdAt).toLocaleDateString()}
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${evaluationStatusStyles(
                        ev.status,
                      )}`}
                    >
                      {evaluationStatusLabel(ev.status)}
                    </span>

                    {ev.executiveCategory && (
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${categoryStyles(
                          ev.executiveCategory,
                        )}`}
                      >
                        {ev.executiveCategory}
                      </span>
                    )}

                    {hasBrokenReport && (
                      <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                        Reporte incompleto
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    {isFinalized ? (
                      <>
                        <div className="font-medium text-zinc-900">
                          {ev.overallScore !== null
                            ? ev.overallScore.toFixed(1)
                            : "—"}
                        </div>

                        {ev.deltaOverall !== null && (
                          <div className="text-xs text-zinc-600">
                            Δ {ev.deltaOverall.toFixed(1)}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-sm text-zinc-500">
                        Sin score final
                      </div>
                    )}

                    <Link
                      href={`/companies/${data.id}/evaluations/${ev.id}`}
                      className="inline-flex rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                    >
                      {isDraft ? "Continuar evaluación" : "Ver evaluación"}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ALERTAS */}
      <div>
        <h2 className="mb-4 text-lg font-medium text-zinc-900">Alertas</h2>

        {ent.canSeeAlerts ? (
          data.alerts.length > 0 ? (
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
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-600">
              No hay alertas activas para esta empresa.
            </div>
          )
        ) : (
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-600">
            Las alertas persistidas están disponibles en el plan Business.
            <a
              href="/billing"
              className="ml-2 font-medium text-zinc-900 underline"
            >
              Actualizar plan
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
