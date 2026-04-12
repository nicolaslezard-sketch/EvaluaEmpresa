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
import { relationshipImportanceLabel } from "@/lib/ui/relationshipImportance";
import { getSubscriptionPresentation } from "@/lib/billing/getSubscriptionPresentation";

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

function stalePriorityDate(value: Date | string | null | undefined) {
  if (!value) return 0;
  return new Date(value).getTime();
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function daysBetween(from: Date, to: Date) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = to.getTime() - from.getTime();
  return Math.floor(diff / msPerDay);
}

function buildNextReviewInfo(latestCreatedAt?: Date | null) {
  if (!latestCreatedAt) {
    return {
      suggestedDateLabel: "Sin ciclo base",
      statusLabel: "Primera evaluación pendiente",
      toneClassName: "border-zinc-200 bg-zinc-50",
    };
  }

  const today = new Date();
  const suggestedDate = addDays(new Date(latestCreatedAt), 30);
  const suggestedDateLabel = suggestedDate.toLocaleDateString();
  const diffDays = daysBetween(today, suggestedDate);

  if (diffDays < 0) {
    return {
      suggestedDateLabel,
      statusLabel: `Atrasada por ${Math.abs(diffDays)} día${
        Math.abs(diffDays) === 1 ? "" : "s"
      }`,
      toneClassName: "border-amber-200 bg-amber-50",
    };
  }

  if (diffDays <= 7) {
    return {
      suggestedDateLabel,
      statusLabel: `Revisar en ${diffDays} día${diffDays === 1 ? "" : "s"}`,
      toneClassName: "border-blue-200 bg-blue-50",
    };
  }

  return {
    suggestedDateLabel,
    statusLabel: "Al día",
    toneClassName: "border-emerald-200 bg-emerald-50",
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const ent = await getUserEntitlements(session.user.id);

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
    select: {
      status: true,
      isTrial: true,
      trialEndsAt: true,
      currentPeriodEnd: true,
    },
  });

  const subscriptionPresentation = getSubscriptionPresentation({
    plan: ent.plan,
    subscription,
  });

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

  const worsenedCount = companySummaries.filter(
    (item) => item.worsenedChanges.length > 0,
  ).length;

  const alertsCount = companySummaries.filter(
    (item) => item.activeAlerts.length > 0,
  ).length;

  const needsActionNowCount = companySummaries.filter(
    (item) =>
      item.reviewStatus.tone === "overdue" ||
      item.worsenedChanges.length > 0 ||
      item.activeAlerts.length > 0,
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

  const dashboardCards = companySummaries.map((item) => {
    const nextReviewInfo = buildNextReviewInfo(item.latest?.createdAt);

    return {
      id: item.company.id,
      name: item.company.name,
      criticality: item.company.criticality,
      href: `/companies/${item.company.id}`,
      evaluationHref: item.latest
        ? `/companies/${item.company.id}/evaluations/${item.latest.id}`
        : null,
      newEvaluationHref: `/companies/${item.company.id}/evaluations/new`,
      reviewLabel: item.reviewStatus.label,
      reviewClassName: item.reviewStatus.className,
      reviewTone: item.reviewStatus.tone,
      executiveCategory: item.latest?.executiveCategory ?? null,
      overallScore: item.latest?.overallScore ?? null,
      scoreDelta: item.latest?.deltaOverall ?? null,
      updatedAtLabel: item.latest
        ? new Date(item.latest.createdAt).toLocaleDateString()
        : null,
      relevantCycleChangesCount: item.relevantCycleChanges.length,
      worsenedChangesCount: item.worsenedChanges.length,
      activeAlertsCount: item.activeAlerts.length,
      nextReviewDateLabel: nextReviewInfo.suggestedDateLabel,
      nextReviewStatusLabel: nextReviewInfo.statusLabel,
      nextReviewToneClassName: nextReviewInfo.toneClassName,
    };
  });

  if (companySummaries.length === 0) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-sky-800">
              Primer paso
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900">
              Empezá cargando tu primera empresa
            </h1>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              Registrá un proveedor, cliente o contraparte para crear tu primera
              evaluación y empezar a seguir su evolución entre ciclos.
            </p>
          </div>

          <div className="rounded-2xl border border-sky-100 bg-white px-5 py-4 shadow-sm">
            <div className="text-sm text-zinc-600">Uso del plan</div>
            <div className="mt-1 text-2xl font-semibold text-zinc-900">
              {activeCompanyCount}/{ent.maxCompanies}
            </div>
            <div className="mt-1 text-sm text-zinc-500">Empresas activas</div>
            <div className="mt-3 text-sm font-medium text-zinc-900">
              {subscriptionPresentation.usagePlanLabel}
            </div>
            {subscriptionPresentation.usagePlanSubLabel ? (
              <div className="mt-1 text-xs leading-5 text-zinc-500">
                {subscriptionPresentation.usagePlanSubLabel}
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
            <div className="text-sm font-medium text-sky-800">Paso 1</div>
            <div className="mt-3 text-lg font-semibold text-zinc-900">
              Cargá la empresa
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Registrá el tercero que querés evaluar y centralizá su seguimiento
              en un solo lugar.
            </p>
          </div>

          <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
            <div className="text-sm font-medium text-sky-800">Paso 2</div>
            <div className="mt-3 text-lg font-semibold text-zinc-900">
              Completá la evaluación
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Cargá la revisión estructurada por pilares para reflejar la
              situación actual de forma consistente.
            </p>
          </div>

          <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
            <div className="text-sm font-medium text-sky-800">Paso 3</div>
            <div className="mt-3 text-lg font-semibold text-zinc-900">
              Obtené el resultado
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Recibí score general, categoría ejecutiva, hallazgos, comparativa
              entre ciclos y salida ejecutiva clara.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl border border-sky-100 bg-linear-to-b from-white to-sky-50/50 p-8 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Todavía no cargaste ninguna empresa
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
              Cuando cargues la primera, vas a poder crear evaluaciones,
              comparar ciclos y ordenar el seguimiento de terceros con más
              claridad.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/companies/new" className="btn btn-primary">
                Nueva empresa
              </Link>

              <Link href="/informe-modelo" className="btn btn-secondary">
                Ver informe modelo
              </Link>
            </div>

            <p className="mt-4 text-sm text-zinc-500">
              Empezá con los datos básicos. Después vas a poder completar la
              evaluación y ver el resultado ejecutivo.
            </p>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-zinc-900">
              Qué vas a obtener
            </h3>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-sm font-medium text-zinc-900">
                  Score general y categoría ejecutiva
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Una lectura rápida del estado general del tercero.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-sm font-medium text-zinc-900">
                  Radar por 5 pilares y hallazgos
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Visibilidad por dimensión para detectar dónde se concentra la
                  exposición.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-sm font-medium text-zinc-900">
                  Comparativa entre ciclos y PDF ejecutivo
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Una salida clara para seguir cambios y respaldar decisiones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
              Monitoreo actual
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              Qué requiere atención, qué empeoró y qué quedó fuera de revisión
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-600">
              Priorizá rápido las empresas que necesitan revisión, muestran
              deterioro reciente o acumulan señales activas.
            </p>
          </div>
        </div>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-2xl border bg-white p-4 shadow-sm sm:p-5">
            <div className="text-sm text-zinc-600">Uso del plan</div>
            <div className="mt-2 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
              {activeCompanyCount}/{ent.maxCompanies}
            </div>
            <div className="mt-2 text-sm text-zinc-500">Empresas activas</div>

            <div className="mt-4">
              <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm font-medium text-sky-900">
                {subscriptionPresentation.usagePlanLabel}
              </span>
            </div>

            {subscriptionPresentation.usagePlanSubLabel ? (
              <div className="mt-2 text-xs leading-5 text-zinc-500">
                {subscriptionPresentation.usagePlanSubLabel}
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border bg-white p-4 shadow-sm sm:p-5">
              <div className="text-sm text-zinc-600">Empresas activas</div>
              <div className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                {activeCompanyCount}/{ent.maxCompanies}
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-4 shadow-sm sm:p-5">
              <div className="text-sm text-zinc-600">Actualizadas</div>
              <div className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                {updatedCount}
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-4 shadow-sm sm:p-5">
              <div className="text-sm text-zinc-600">Revisar pronto</div>
              <div className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                {reviewSoonCount}
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-4 shadow-sm sm:p-5">
              <div className="text-sm text-zinc-600">Vencidas</div>
              <div className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                {overdueCount}
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-medium text-zinc-900">
              Dónde poner foco ahora
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Prioridades operativas para no perder de vista deterioros,
              vencimientos y señales activas.
            </p>
          </div>

          <div className="text-sm text-zinc-500">
            Lectura rápida del ciclo actual
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
          {" "}
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <div className="text-sm text-zinc-600">Requieren acción ahora</div>
            <div className="mt-2 text-3xl font-semibold text-zinc-900">
              {needsActionNowCount}
            </div>
            <div className="mt-2 text-sm text-zinc-500">
              vencidas, con deterioro o alertas activas
            </div>
          </div>
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <div className="text-sm text-red-700">Empeoraron</div>
            <div className="mt-2 text-3xl font-semibold text-red-700">
              {worsenedCount}
            </div>
            <div className="mt-2 text-sm text-red-600">
              empresas con cambios negativos en el último ciclo
            </div>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="text-sm text-amber-700">Vencidas</div>
            <div className="mt-2 text-3xl font-semibold text-amber-700">
              {overdueCount}
            </div>
            <div className="mt-2 text-sm text-amber-600">
              fuera de la frecuencia mensual esperada
            </div>
          </div>
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
            <div className="text-sm text-orange-700">Con alertas</div>
            <div className="mt-2 text-3xl font-semibold text-orange-700">
              {alertsCount}
            </div>
            <div className="mt-2 text-sm text-orange-600">
              empresas con alertas activas persistidas
            </div>
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
                          {relationshipImportanceLabel(
                            company.criticality,
                          )}{" "}
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
                            Cambios negativos
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
                Estas empresas quedaron fuera de la frecuencia esperada o
                todavía no tienen una revisión vigente. Conviene priorizarlas
                antes de seguir ampliando cartera.
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
                          {relationshipImportanceLabel(
                            company.criticality,
                          )}{" "}
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
                            Cambios relevantes
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
