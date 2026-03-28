import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserEntitlements } from "@/lib/access/getEntitlements";
import { getReviewStatus } from "@/lib/reviews/getReviewStatus";

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

function stalePriorityDate(value: Date | string | null | undefined) {
  if (!value) return 0;
  return new Date(value).getTime();
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ent = await getUserEntitlements(session.user.id);

  const companies = await prisma.company.findMany({
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
  });

  const companySummaries = companies.map((company) => {
    const latestFinalized = company.evaluations[0] ?? null;
    const reviewStatus = getReviewStatus(latestFinalized?.createdAt);
    const activeAlerts = ent.canSeeAlerts
      ? (latestFinalized?.alerts ?? [])
      : [];

    const parsedReportData = parseReportData(latestFinalized?.reportData);
    const relevantCycleChanges = parsedReportData?.relevantCycleChanges ?? [];
    const worsenedChanges = relevantCycleChanges.filter(
      (change) => change.kind === "WORSENED",
    );

    return {
      id: company.id,
      name: company.name,
      relationType: company.relationType,
      sector: company.sector,
      size: company.size,
      criticality: company.criticality,
      status: company.status,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
      latestFinalized,
      reviewStatus,
      activeAlerts,
      relevantCycleChanges,
      worsenedChanges,
    };
  });

  const counters = {
    updated: companySummaries.filter((item) => item.reviewStatus.tone === "ok")
      .length,
    reviewSoon: companySummaries.filter(
      (item) => item.reviewStatus.tone === "warning",
    ).length,
    overdue: companySummaries.filter(
      (item) => item.reviewStatus.tone === "overdue",
    ).length,
  };

  const worsenedCompanies = companySummaries
    .filter(
      (item) =>
        item.latestFinalized &&
        item.latestFinalized.deltaOverall !== null &&
        item.latestFinalized.deltaOverall < 0,
    )
    .sort((a, b) => {
      const deltaA = a.latestFinalized?.deltaOverall ?? 0;
      const deltaB = b.latestFinalized?.deltaOverall ?? 0;

      if (deltaA !== deltaB) {
        return deltaA - deltaB;
      }

      return b.worsenedChanges.length - a.worsenedChanges.length;
    })
    .slice(0, 5)
    .map((item) => ({
      id: item.id,
      name: item.name,
      criticality: item.criticality,
      latestFinalized: item.latestFinalized,
      activeAlerts: item.activeAlerts,
      worsenedChanges: item.worsenedChanges,
      worsenedChangesCount: item.worsenedChanges.length,
      relevantCycleChangesCount: item.relevantCycleChanges.length,
      reviewStatus: item.reviewStatus,
    }));

  const staleCompanies = companySummaries
    .filter((item) => item.reviewStatus.tone === "overdue")
    .sort((a, b) => {
      const aHasLatest = !!a.latestFinalized;
      const bHasLatest = !!b.latestFinalized;

      if (aHasLatest !== bHasLatest) {
        return aHasLatest ? 1 : -1;
      }

      return (
        stalePriorityDate(a.latestFinalized?.createdAt) -
        stalePriorityDate(b.latestFinalized?.createdAt)
      );
    })
    .slice(0, 5)
    .map((item) => ({
      id: item.id,
      name: item.name,
      criticality: item.criticality,
      latestFinalized: item.latestFinalized,
      activeAlerts: item.activeAlerts,
      reviewStatus: item.reviewStatus,
      relevantCycleChangesCount: item.relevantCycleChanges.length,
      worsenedChangesCount: item.worsenedChanges.length,
    }));

  return NextResponse.json({
    plan: ent.plan,
    trendDepth: ent.trendDepth,
    canCreateEvaluation: ent.canCreateEvaluation,
    canSeeAlerts: ent.canSeeAlerts,
    usage: {
      used: companies.length,
      limit: ent.maxCompanies,
    },
    counters,
    worsenedCompanies,
    staleCompanies,
    companies: companySummaries.map((item) => ({
      id: item.id,
      name: item.name,
      relationType: item.relationType,
      sector: item.sector,
      size: item.size,
      criticality: item.criticality,
      status: item.status,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      latestFinalized: item.latestFinalized,
      reviewStatus: item.reviewStatus,
      activeAlerts: item.activeAlerts,
      relevantCycleChangesCount: item.relevantCycleChanges.length,
      worsenedChangesCount: item.worsenedChanges.length,
    })),
  });
}
