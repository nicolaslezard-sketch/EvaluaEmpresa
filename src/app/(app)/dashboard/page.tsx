export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserEntitlements } from "@/lib/access/getEntitlements";
import { getReviewStatus } from "@/lib/reviews/getReviewStatus";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";

type ReportCycleChange = {
  kind: "WORSENED" | "PERSISTING_RISK" | "IMPROVED";
  pillar: "financial" | "commercial" | "operational" | "legal" | "strategic";
  pillarLabel: string;
  fieldKey: string;
  fieldLabel: string;
  previousValue: number | null;
  currentValue: number;
  delta: number | null;
  currentSeverity:
    | "FAVORABLE"
    | "ESTABLE"
    | "OBSERVACION"
    | "DEBIL"
    | "CRITICO";
  rationale: string | null;
};

type ReportDataLike = {
  relevantCycleChanges?: ReportCycleChange[];
} | null;

function parseReportData(reportData: unknown): ReportDataLike {
  if (
    !reportData ||
    typeof reportData !== "object" ||
    Array.isArray(reportData)
  ) {
    return null;
  }

  return reportData as ReportDataLike;
}

function categoryStyles(category: string | null) {
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

function deltaStyles(delta: number | null) {
  if (delta === null || delta === 0) {
    return "text-zinc-500";
  }

  return delta > 0 ? "text-emerald-600" : "text-red-600";
}

function planLabel(plan: "FREE" | "PRO" | "BUSINESS") {
  switch (plan) {
    case "PRO":
      return "PRO";
    case "BUSINESS":
      return "BUSINESS";
    default:
      return "FREE";
  }
}

function stalePriorityDate(value: Date | string | null | undefined) {
  if (!value) return 0;
  return new Date(value).getTime();
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const ent = await getUserEntitlements(session.user.id);

  const [companies, activeCompanyCount] = await Promise.all([
    prisma.company.findMany({
      where: {
        ownerId: session.user.id,
        status: "ACTIVE",
      },
      include: {
        evaluations: {
          where: { status: "FINALIZED" },
          orderBy: { createdAt: "desc" },
          take: ent.trendDepth > 0 ? ent.trendDepth : 1,
          include: {
            alerts: ent.canSeeAlerts
              ? {
                  orderBy: { createdAt: "desc" },
                }
              : false,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.company.count({
      where: {
        ownerId: session.user.id,
        status: "ACTIVE",
      },
    }),
  ]);

  const companySummaries = companies.map((company) => {
    const latest = company.evaluations[0] ?? null;
    const reviewStatus = getReviewStatus(latest?.createdAt);
    const activeAlerts = ent.canSeeAlerts ? (latest?.alerts ?? []) : [];
    const parsedReportData = parseReportData(latest?.reportData);
    const relevantCycleChanges = parsedReportData?.relevantCycleChanges ?? [];
    const worsenedChanges = relevantCycleChanges.filter(
      (change) => change.kind === "WORSENED",
    );

    return {
      company,
      latest,
      reviewStatus,
      activeAlerts,
      relevantCycleChanges,
      worsenedChanges,
    };
  });

  const updatedCount = companySummaries.filter(
    (item) => item.reviewStatus.tone === "ok",
  ).length;

  const reviewSoonCount = companySummaries.filter(
    (item) => item.reviewStatus.tone === "warning",
  ).length;

  const overdueCount = companySummaries.filter(
    (item) => item.reviewStatus.tone === "overdue",
  ).length;

  const worsenedCompanies = companySummaries
    .filter(
      (item) =>
        item.latest &&
        item.latest.deltaOverall !== null &&
        item.latest.deltaOverall < 0,
    )
    .sort((a, b) => {
      const deltaA = a.latest?.deltaOverall ?? 0;
      const deltaB = b.latest?.deltaOverall ?? 0;

      if (deltaA !== deltaB) {
        return deltaA - deltaB;
      }

      return b.worsenedChanges.length - a.worsenedChanges.length;
    })
    .slice(0, 5);

  const staleCompanies = companySummaries
    .filter((item) => item.reviewStatus.tone === "overdue")
    .sort((a, b) => {
      const aHasLatest = !!a.latest;
      const bHasLatest = !!b.latest;

      if (aHasLatest !== bHasLatest) {
        return aHasLatest ? 1 : -1;
      }

      return (
        stalePriorityDate(a.latest?.createdAt) -
        stalePriorityDate(b.latest?.createdAt)
      );
    })
    .slice(0, 5);

  const dashboardCards = companySummaries.map((item) => ({
    id: item.company.id,
    name: item.company.name,
    criticality: item.company.criticality,
    href: `/companies/${item.company.id}`,
    reviewLabel: item.reviewStatus.label,
    reviewClassName: item.reviewStatus.className,
    reviewTone: item.reviewStatus.tone,
    executiveCategory: item.latest?.executiveCategory ?? null,
    overallScore: item.latest?.overallScore ?? null,
    deltaOverall: item.latest?.deltaOverall ?? null,
    updatedAtLabel: item.latest
      ? new Date(item.latest.createdAt).toLocaleDateString()
      : null,
    relevantCycleChangesCount: item.relevantCycleChanges.length,
    worsenedChangesCount: item.worsenedChanges.length,
    activeAlertsCount: item.activeAlerts.length,
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
            Dashboard
          </h1>
        </div>

        <div className="rounded-2xl border bg-white px-5 py-4 shadow-sm">
          <div className="text-sm text-zinc-600">Uso del plan</div>
          <div className="mt-1 text-2xl font-semibold text-zinc-900">
            {activeCompanyCount}/{ent.maxCompanies}
          </div>
          <div className="mt-1 text-sm text-zinc-500">
            Empresas activas · {planLabel(ent.plan)}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="text-sm text-zinc-600">Empresas activas</div>
          <div className="mt-2 text-3xl font-semibold text-zinc-900">
            {activeCompanyCount}/{ent.maxCompanies}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="text-sm text-zinc-600">Actualizadas</div>
          <div className="mt-2 text-3xl font-semibold text-zinc-900">
            {updatedCount}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="text-sm text-zinc-600">Revisar pronto</div>
          <div className="mt-2 text-3xl font-semibold text-zinc-900">
            {reviewSoonCount}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="text-sm text-zinc-600">Vencidas</div>
          <div className="mt-2 text-3xl font-semibold text-zinc-900">
            {overdueCount}
          </div>
        </div>
      </div>

      {worsenedCompanies.length > 0 ? (
        <div className="rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">
                Empresas que empeoraron en el último ciclo
              </h2>
              <p className="mt-1 text-sm text-zinc-600">
                Priorizá estas cuentas: bajaron su score total respecto de la
                evaluación anterior.
              </p>
            </div>

            <div className="text-sm text-zinc-500">
              Top {worsenedCompanies.length} con mayor deterioro
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            {worsenedCompanies.map(
              ({ company, latest, activeAlerts, worsenedChanges }) => (
                <div
                  key={company.id}
                  className="rounded-2xl border border-red-100 bg-red-50/40 p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-base font-semibold text-zinc-900">
                          {company.name}
                        </div>

                        {latest?.executiveCategory ? (
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${categoryStyles(
                              latest.executiveCategory,
                            )}`}
                          >
                            {latest.executiveCategory}
                          </span>
                        ) : null}

                        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                          {company.criticality}
                        </span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3">
                          <div className="text-xs uppercase tracking-wide text-zinc-500">
                            Score actual
                          </div>
                          <div className="mt-1 text-lg font-semibold text-zinc-900">
                            {latest?.overallScore !== null &&
                            latest?.overallScore !== undefined
                              ? latest.overallScore.toFixed(1)
                              : "—"}
                          </div>
                        </div>

                        <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3">
                          <div className="text-xs uppercase tracking-wide text-zinc-500">
                            Delta total
                          </div>
                          <div
                            className={`mt-1 text-lg font-semibold ${deltaStyles(
                              latest?.deltaOverall ?? null,
                            )}`}
                          >
                            Δ{" "}
                            {latest?.deltaOverall !== null &&
                            latest?.deltaOverall !== undefined
                              ? latest.deltaOverall > 0
                                ? `+${latest.deltaOverall.toFixed(1)}`
                                : latest.deltaOverall.toFixed(1)
                              : "—"}
                          </div>
                        </div>

                        <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3">
                          <div className="text-xs uppercase tracking-wide text-zinc-500">
                            Señales críticas
                          </div>
                          <div className="mt-1 text-lg font-semibold text-zinc-900">
                            {worsenedChanges.length}
                          </div>
                          <div className="mt-1 text-xs text-zinc-500">
                            campos que empeoraron
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {ent.canSeeAlerts ? (
                          <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700">
                            {activeAlerts.length} alerta
                            {activeAlerts.length === 1 ? "" : "s"} activa
                            {activeAlerts.length === 1 ? "" : "s"}
                          </span>
                        ) : null}

                        {worsenedChanges.slice(0, 3).map((change) => (
                          <span
                            key={`${company.id}-${change.fieldKey}-${change.kind}`}
                            className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700"
                          >
                            {change.fieldLabel}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {latest ? (
                        <Link
                          href={`/companies/${company.id}/evaluations/${latest.id}`}
                          className="inline-flex rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                        >
                          Ver evaluación
                        </Link>
                      ) : null}

                      <Link
                        href={`/companies/${company.id}`}
                        className="inline-flex rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                      >
                        Revisar empresa
                      </Link>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      ) : null}

      {staleCompanies.length > 0 ? (
        <div className="rounded-3xl border border-amber-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">
                Vencidas o sin revisión vigente
              </h2>
              <p className="mt-1 text-sm text-zinc-600">
                Estas empresas quedaron fuera de la frecuencia mensual esperada
                y conviene revisarlas primero.
              </p>
            </div>

            <div className="text-sm text-zinc-500">
              Top {staleCompanies.length} con seguimiento vencido
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            {staleCompanies.map(
              ({
                company,
                latest,
                reviewStatus,
                activeAlerts,
                relevantCycleChanges,
              }) => (
                <div
                  key={`stale-${company.id}`}
                  className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-base font-semibold text-zinc-900">
                          {company.name}
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${reviewStatus.className}`}
                        >
                          {reviewStatus.label}
                        </span>

                        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                          {company.criticality}
                        </span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3">
                          <div className="text-xs uppercase tracking-wide text-zinc-500">
                            Última evaluación
                          </div>
                          <div className="mt-1 text-lg font-semibold text-zinc-900">
                            {latest
                              ? new Date(latest.createdAt).toLocaleDateString()
                              : "Sin evaluación"}
                          </div>
                        </div>

                        <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3">
                          <div className="text-xs uppercase tracking-wide text-zinc-500">
                            Score actual
                          </div>
                          <div className="mt-1 text-lg font-semibold text-zinc-900">
                            {latest?.overallScore !== null &&
                            latest?.overallScore !== undefined
                              ? latest.overallScore.toFixed(1)
                              : "—"}
                          </div>
                        </div>

                        <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3">
                          <div className="text-xs uppercase tracking-wide text-zinc-500">
                            Señales del ciclo
                          </div>
                          <div className="mt-1 text-lg font-semibold text-zinc-900">
                            {latest ? relevantCycleChanges.length : 0}
                          </div>
                          <div className="mt-1 text-xs text-zinc-500">
                            cambios relevantes detectados
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {ent.canSeeAlerts ? (
                          <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700">
                            {activeAlerts.length} alerta
                            {activeAlerts.length === 1 ? "" : "s"} activa
                            {activeAlerts.length === 1 ? "" : "s"}
                          </span>
                        ) : null}

                        {latest?.executiveCategory ? (
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${categoryStyles(
                              latest.executiveCategory,
                            )}`}
                          >
                            {latest.executiveCategory}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href={`/companies/${company.id}/evaluations/new`}
                        className="inline-flex rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                      >
                        {latest ? "Nueva revisión" : "Primera evaluación"}
                      </Link>

                      <Link
                        href={`/companies/${company.id}`}
                        className="inline-flex rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                      >
                        Abrir empresa
                      </Link>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      ) : null}

      {companySummaries.length === 0 ? (
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <div className="text-lg font-medium text-zinc-900">
            Todavía no hay empresas activas
          </div>
          <div className="mt-2 max-w-2xl text-sm text-zinc-600">
            Crea tu primera empresa para comenzar el monitoreo continuo,
            registrar evaluaciones y ver alertas activas por ciclo.
          </div>

          <div className="mt-6">
            <Link
              href="/companies/new"
              className="inline-flex rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Nueva empresa
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-medium text-zinc-900">
              Empresas monitoreadas
            </h2>
            <div className="mt-1 text-sm text-zinc-600">
              Filtrá rápido por deterioro, vencimiento o alertas activas.
            </div>
          </div>

          <DashboardFilters
            companies={dashboardCards}
            canSeeAlerts={ent.canSeeAlerts}
          />
        </div>
      )}
    </div>
  );
}
