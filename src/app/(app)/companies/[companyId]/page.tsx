export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUserEntitlements } from "@/lib/access/getEntitlements";
import { getReviewStatus } from "@/lib/reviews/getReviewStatus";

/* =========================
   TYPES
========================= */

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

type CompanyActionCard = {
  title: string;
  description: string;
  toneClassName: string;
  primaryAction: {
    href: string;
    label: string;
  };
  secondaryAction?: {
    href: string;
    label: string;
  } | null;
};
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

function cycleChangeKindStyles(kind: string) {
  switch (kind) {
    case "WORSENED":
      return "bg-red-100 text-red-700";
    case "PERSISTING_RISK":
      return "bg-amber-100 text-amber-700";
    case "IMPROVED":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-zinc-100 text-zinc-700";
  }
}

function cycleChangeKindLabel(kind: string) {
  switch (kind) {
    case "WORSENED":
      return "Empeoró";
    case "PERSISTING_RISK":
      return "Sigue débil";
    case "IMPROVED":
      return "Mejoró";
    default:
      return kind;
  }
}

function fieldLevelLabel(value: number | null | undefined) {
  switch (value) {
    case 20:
      return "Crítico";
    case 40:
      return "Débil";
    case 60:
      return "Observación";
    case 75:
      return "Estable";
    case 90:
      return "Muy favorable";
    default:
      return "—";
  }
}

function deltaTextClass(delta: number | null) {
  if (delta === null || delta === 0) return "text-zinc-500";
  return delta > 0 ? "text-emerald-600" : "text-red-600";
}

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

function buildCompanyActionCard(params: {
  companyId: string;
  activeDraftId: string | null;
  latestFinalizedId: string | null;
  hasLatestFinalized: boolean;
  reviewTone: "ok" | "warning" | "overdue" | "none";
  activeAlertsCount: number;
  worsenedChangesCount: number;
}): CompanyActionCard {
  const companyHref = `/companies/${params.companyId}`;
  const newEvaluationHref = `/companies/${params.companyId}/evaluations/new`;
  const latestEvaluationHref = params.latestFinalizedId
    ? `/companies/${params.companyId}/evaluations/${params.latestFinalizedId}`
    : null;
  const activeDraftHref = params.activeDraftId
    ? `/companies/${params.companyId}/evaluations/${params.activeDraftId}`
    : null;

  if (!params.hasLatestFinalized && activeDraftHref) {
    return {
      title: "Continuar evaluación en curso",
      description:
        "La empresa todavía no tiene una evaluación finalizada. Completar el borrador actual es la acción más importante para generar el primer score oficial y activar el monitoreo continuo.",
      toneClassName: "border-amber-200 bg-amber-50",
      primaryAction: {
        href: activeDraftHref,
        label: "Continuar evaluación",
      },
      secondaryAction: {
        href: companyHref,
        label: "Ver empresa",
      },
    };
  }

  if (!params.hasLatestFinalized) {
    return {
      title: "Iniciar primera evaluación",
      description:
        "Todavía no existe un ciclo base para esta empresa. Conviene generar la primera evaluación para obtener score, categoría ejecutiva e historial.",
      toneClassName: "border-zinc-200 bg-zinc-50",
      primaryAction: {
        href: newEvaluationHref,
        label: "Primera evaluación",
      },
      secondaryAction: {
        href: companyHref,
        label: "Ver empresa",
      },
    };
  }

  if (params.reviewTone === "overdue") {
    return {
      title: "Nueva revisión mensual recomendada",
      description:
        "La última evaluación quedó fuera de la frecuencia esperada. Conviene abrir un nuevo ciclo ahora para mantener vigente el monitoreo y detectar cambios antes de que escalen.",
      toneClassName: "border-amber-200 bg-amber-50",
      primaryAction: {
        href: newEvaluationHref,
        label: "Nueva revisión",
      },
      secondaryAction: latestEvaluationHref
        ? {
            href: latestEvaluationHref,
            label: "Última evaluación",
          }
        : null,
    };
  }

  if (params.activeAlertsCount > 0) {
    return {
      title: "Revisar alertas activas",
      description:
        "Hay alertas persistidas en el último ciclo. La prioridad es revisar la empresa y validar si requieren seguimiento operativo inmediato.",
      toneClassName: "border-red-200 bg-red-50",
      primaryAction: {
        href: companyHref,
        label: "Revisar alertas",
      },
      secondaryAction: latestEvaluationHref
        ? {
            href: latestEvaluationHref,
            label: "Ver evaluación",
          }
        : null,
    };
  }

  if (params.worsenedChangesCount > 0) {
    return {
      title: "Analizar deterioros del último ciclo",
      description:
        "Se detectaron campos que empeoraron respecto de la evaluación anterior. Conviene revisar el detalle del ciclo para entender impacto, contexto y próxima acción.",
      toneClassName: "border-red-200 bg-red-50",
      primaryAction: {
        href: latestEvaluationHref ?? companyHref,
        label: "Ver cambios del ciclo",
      },
      secondaryAction: {
        href: newEvaluationHref,
        label: "Nueva revisión",
      },
    };
  }

  return {
    title: "Monitoreo al día",
    description:
      "La empresa no presenta deterioros prioritarios ni alertas activas y su revisión sigue vigente. El siguiente paso es sostener la frecuencia mensual.",
    toneClassName: "border-emerald-200 bg-emerald-50",
    primaryAction: {
      href: newEvaluationHref,
      label: "Nueva revisión",
    },
    secondaryAction: latestEvaluationHref
      ? {
          href: latestEvaluationHref,
          label: "Ver última evaluación",
        }
      : null,
  };
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
      helperText:
        "Todavía no existe una evaluación finalizada para calcular una próxima revisión sugerida.",
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
      helperText:
        "La revisión sugerida ya venció. Conviene abrir un nuevo ciclo cuanto antes.",
      toneClassName: "border-amber-200 bg-amber-50",
    };
  }

  if (diffDays <= 7) {
    return {
      suggestedDateLabel,
      statusLabel: `Revisar en ${diffDays} día${diffDays === 1 ? "" : "s"}`,
      helperText:
        "La próxima revisión está próxima. Conviene prepararla para sostener la frecuencia mensual.",
      toneClassName: "border-blue-200 bg-blue-50",
    };
  }

  return {
    suggestedDateLabel,
    statusLabel: "Al día",
    helperText: "La empresa sigue dentro de la frecuencia mensual esperada.",
    toneClassName: "border-emerald-200 bg-emerald-50",
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
        include: {
          alerts: {
            orderBy: { createdAt: "desc" },
          },
        },
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

  const activeAlerts = ent.canSeeAlerts ? (latestFinalized?.alerts ?? []) : [];
  const reviewStatus = getReviewStatus(latestFinalized?.createdAt);

  const hasBrokenFinalized =
    data.evaluations.some(
      (ev) => ev.status === "FINALIZED" && !ev.reportData,
    ) ?? false;

  const parsedReportData = parseReportData(latestFinalized?.reportData);
  const relevantCycleChanges = parsedReportData?.relevantCycleChanges ?? [];
  const worsenedChanges = relevantCycleChanges.filter(
    (change) => change.kind === "WORSENED",
  );

  const actionCard = buildCompanyActionCard({
    companyId: data.id,
    activeDraftId: activeDraft?.id ?? null,
    latestFinalizedId: latestFinalized?.id ?? null,
    hasLatestFinalized: !!latestFinalized,
    reviewTone: reviewStatus.tone,
    activeAlertsCount: activeAlerts.length,
    worsenedChangesCount: worsenedChanges.length,
  });

  const nextReviewInfo = buildNextReviewInfo(latestFinalized?.createdAt);

  return (
    <div className="space-y-10">
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

          {latestFinalized?.pdfKey ? (
            <Link
              href={`/api/evaluations/${latestFinalized.id}/pdf`}
              className="inline-flex rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
            >
              Descargar PDF
            </Link>
          ) : null}

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
            {latestFinalized ? "Nueva revisión mensual" : "Primera evaluación"}
          </Link>
        </div>
      </div>

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

      <div className={`rounded-2xl border p-6 ${actionCard.toneClassName}`}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-3xl">
            <div className="text-base font-semibold text-zinc-900">
              Acción recomendada
            </div>
            <div className="mt-2 text-xl font-medium text-zinc-900">
              {actionCard.title}
            </div>
            <div className="mt-2 text-sm text-zinc-700">
              {actionCard.description}
            </div>
          </div>

          <div
            className={`rounded-2xl border p-6 ${nextReviewInfo.toneClassName}`}
          >
            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <div className="text-sm text-zinc-600">
                  Próxima revisión sugerida
                </div>
                <div className="mt-2 text-2xl font-semibold text-zinc-900">
                  {nextReviewInfo.suggestedDateLabel}
                </div>
              </div>

              <div>
                <div className="text-sm text-zinc-600">Estado temporal</div>
                <div className="mt-2 text-lg font-medium text-zinc-900">
                  {nextReviewInfo.statusLabel}
                </div>
              </div>

              <div>
                <div className="text-sm text-zinc-600">Contexto</div>
                <div className="mt-2 text-sm text-zinc-700">
                  {nextReviewInfo.helperText}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={actionCard.primaryAction.href}
              className="inline-flex rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              {actionCard.primaryAction.label}
            </Link>

            {actionCard.secondaryAction ? (
              <Link
                href={actionCard.secondaryAction.href}
                className="inline-flex rounded-lg border border-zinc-300 bg-white px-5 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
              >
                {actionCard.secondaryAction.label}
              </Link>
            ) : null}
          </div>
        </div>
      </div>

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
                <div
                  className={`mt-3 text-sm font-medium ${deltaTextClass(
                    latestFinalized.deltaOverall,
                  )}`}
                >
                  Δ {latestFinalized.deltaOverall > 0 ? "+" : ""}
                  {latestFinalized.deltaOverall.toFixed(1)}
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

      {latestFinalized && relevantCycleChanges.length > 0 && (
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-medium text-zinc-900">
                Cambios relevantes del último ciclo
              </h2>
              <div className="mt-1 text-sm text-zinc-600">
                Resumen ejecutivo de variaciones y riesgos persistentes respecto
                de la evaluación anterior.
              </div>
            </div>

            <Link
              href={`/companies/${data.id}/evaluations/${latestFinalized.id}`}
              className="inline-flex rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
            >
              Ver detalle completo
            </Link>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {relevantCycleChanges.slice(0, 4).map((change) => (
              <div
                key={`${change.kind}-${change.pillar}-${change.fieldKey}`}
                className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-zinc-900">
                    {change.fieldLabel}
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${cycleChangeKindStyles(
                      change.kind,
                    )}`}
                  >
                    {cycleChangeKindLabel(change.kind)}
                  </span>

                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                    {change.pillarLabel}
                  </span>
                </div>

                <div className="mt-3 text-sm text-zinc-700">
                  {change.kind === "PERSISTING_RISK" ? (
                    <p>
                      Se mantiene en nivel{" "}
                      <span className="font-medium text-zinc-900">
                        {fieldLevelLabel(change.currentValue)}
                      </span>
                      .
                    </p>
                  ) : (
                    <p>
                      Pasó de{" "}
                      <span className="font-medium text-zinc-900">
                        {fieldLevelLabel(change.previousValue)}
                      </span>{" "}
                      a{" "}
                      <span className="font-medium text-zinc-900">
                        {fieldLevelLabel(change.currentValue)}
                      </span>
                      {typeof change.delta === "number" ? (
                        <>
                          {" "}
                          (Δ campo {change.delta > 0 ? "+" : ""}
                          {change.delta})
                        </>
                      ) : null}
                      .
                    </p>
                  )}

                  {change.rationale ? (
                    <p className="mt-2 line-clamp-3">
                      <span className="font-medium text-zinc-900">
                        Contexto:
                      </span>{" "}
                      {change.rationale}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.evaluations.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-medium text-zinc-900">Historial</h2>
              <div className="mt-1 text-sm text-zinc-600">
                Vista compacta de score, alertas, cambios relevantes y acceso a
                exportación.
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {data.evaluations.map((ev) => {
              const isDraft = ev.status === "DRAFT";
              const isFinalized = ev.status === "FINALIZED";
              const hasBrokenReport = isFinalized && !ev.reportData;

              const parsedEvReportData = parseReportData(ev.reportData);
              const evRelevantChanges =
                parsedEvReportData?.relevantCycleChanges ?? [];
              const evAlertsCount =
                ent.canSeeAlerts && isFinalized ? ev.alerts.length : 0;

              return (
                <div
                  key={ev.id}
                  className="rounded-2xl border bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
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

                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                          <div className="text-xs uppercase tracking-wide text-zinc-500">
                            Score
                          </div>
                          <div className="mt-1 text-lg font-semibold text-zinc-900">
                            {isFinalized && ev.overallScore !== null
                              ? ev.overallScore.toFixed(1)
                              : "—"}
                          </div>
                          {isFinalized && ev.deltaOverall !== null ? (
                            <div
                              className={`mt-1 text-xs font-medium ${deltaTextClass(
                                ev.deltaOverall,
                              )}`}
                            >
                              Δ {ev.deltaOverall > 0 ? "+" : ""}
                              {ev.deltaOverall.toFixed(1)}
                            </div>
                          ) : (
                            <div className="mt-1 text-xs text-zinc-500">
                              Sin delta
                            </div>
                          )}
                        </div>

                        <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                          <div className="text-xs uppercase tracking-wide text-zinc-500">
                            Alertas del ciclo
                          </div>
                          <div className="mt-1 text-lg font-semibold text-zinc-900">
                            {ent.canSeeAlerts && isFinalized
                              ? evAlertsCount
                              : "—"}
                          </div>
                          <div className="mt-1 text-xs text-zinc-500">
                            {ent.canSeeAlerts
                              ? isFinalized
                                ? "Persistidas en esa evaluación"
                                : "Solo disponible al finalizar"
                              : "Disponible en Business"}
                          </div>
                        </div>

                        <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                          <div className="text-xs uppercase tracking-wide text-zinc-500">
                            Cambios relevantes
                          </div>
                          <div className="mt-1 text-lg font-semibold text-zinc-900">
                            {isFinalized ? evRelevantChanges.length : "—"}
                          </div>
                          <div className="mt-1 text-xs text-zinc-500">
                            Empeoró / sigue débil / mejoró
                          </div>
                        </div>
                      </div>

                      {isFinalized && evRelevantChanges.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {evRelevantChanges.slice(0, 3).map((change) => (
                            <span
                              key={`${ev.id}-${change.kind}-${change.fieldKey}`}
                              className={`rounded-full px-2.5 py-1 text-xs font-medium ${cycleChangeKindStyles(
                                change.kind,
                              )}`}
                            >
                              {change.fieldLabel}:{" "}
                              {cycleChangeKindLabel(change.kind)}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {isFinalized && ev.pdfKey ? (
                        <Link
                          href={`/api/evaluations/${ev.id}/pdf`}
                          className="inline-flex rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                        >
                          PDF
                        </Link>
                      ) : null}

                      <Link
                        href={`/companies/${data.id}/evaluations/${ev.id}`}
                        className="inline-flex rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                      >
                        {isDraft ? "Continuar evaluación" : "Ver evaluación"}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-4 text-lg font-medium text-zinc-900">Alertas</h2>

        {ent.canSeeAlerts ? (
          activeAlerts.length > 0 ? (
            <div className="space-y-3">
              {activeAlerts.map((alert) => (
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
