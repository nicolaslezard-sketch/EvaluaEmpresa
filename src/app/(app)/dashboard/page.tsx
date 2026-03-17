import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
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
      return "bg-zinc-100 text-zinc-600";
  }
}

function deltaStyles(delta: number) {
  if (delta > 0) return "text-emerald-600";
  if (delta < 0) return "text-red-600";
  return "text-zinc-500";
}

function reviewStatus(latestDate?: Date | null) {
  if (!latestDate) {
    return {
      label: "Sin evaluación",
      className: "bg-zinc-100 text-zinc-600",
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
   PAGE
========================= */

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  const ent = await getUserEntitlements(userId);

  const companies = await prisma.company.findMany({
    where: {
      ownerId: userId,
      status: "ACTIVE",
    },
    include: {
      evaluations: {
        where: { status: "FINALIZED" },
        orderBy: { createdAt: "desc" },
        take: ent.trendDepth > 0 ? ent.trendDepth : 1,
      },
      alerts: ent.canSeeAlerts
        ? {
            orderBy: { createdAt: "desc" },
            take: 3,
          }
        : false,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>

        <div className="text-sm text-zinc-500">
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
            {ent.plan}
          </span>
        </div>
      </div>

      {!ent.canCreateEvaluation && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          Tu plan actual no permite crear nuevas evaluaciones.
          <Link href="/billing" className="ml-2 font-medium underline">
            Actualizar plan
          </Link>
        </div>
      )}

      {companies.length === 0 && (
        <div className="rounded-xl border bg-white p-10 text-center text-sm text-zinc-500">
          <div>Aún no tienes empresas monitoreadas.</div>
          <Link
            href="/companies/new"
            className="mt-4 inline-flex rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Agregar empresa
          </Link>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {companies.map((company) => {
          const latest = company.evaluations[0];
          const status = reviewStatus(latest?.createdAt);

          return (
            <div
              key={company.id}
              className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-medium text-zinc-900">{company.name}</h2>
                  <div className="mt-1 text-xs text-zinc-500">
                    Criticidad: {company.criticality}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
                  >
                    {status.label}
                  </span>

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
              </div>

              {latest ? (
                <>
                  <div className="mt-6 flex items-end gap-3">
                    <div className="text-4xl font-semibold text-zinc-900">
                      {latest.overallScore?.toFixed(1) ?? "—"}
                    </div>

                    {latest.deltaOverall !== null && (
                      <div
                        className={`text-sm font-medium ${deltaStyles(
                          latest.deltaOverall,
                        )}`}
                      >
                        Δ {latest.deltaOverall.toFixed(1)}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 h-2 w-full rounded-full bg-zinc-100">
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

                  <div className="mt-3 text-xs text-zinc-500">
                    Última actualización:{" "}
                    {new Date(latest.createdAt).toLocaleDateString()}
                  </div>

                  {ent.canSeeAlerts &&
                    "alerts" in company &&
                    company.alerts.length > 0 && (
                      <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3 text-xs text-red-700">
                        {company.alerts.length} alerta
                        {company.alerts.length > 1 ? "s" : ""} activa
                        {company.alerts.length > 1 ? "s" : ""}
                      </div>
                    )}
                </>
              ) : (
                <div className="mt-6 text-sm text-zinc-500">
                  Sin evaluaciones finalizadas
                </div>
              )}

              <div className="mt-6">
                <Link
                  href={`/companies/${company.id}`}
                  className="inline-flex rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                >
                  Ver empresa
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
