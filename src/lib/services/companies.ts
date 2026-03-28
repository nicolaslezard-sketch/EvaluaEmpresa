import { prisma } from "@/lib/prisma";
import { getUserEntitlements } from "@/lib/access/getEntitlements";
import type { CriticalityLevel } from "@prisma/client";

export async function getActiveCompanyUsage(ownerId: string) {
  const ent = await getUserEntitlements(ownerId);

  const activeCount = await prisma.company.count({
    where: {
      ownerId,
      status: "ACTIVE",
    },
  });

  return {
    plan: ent.plan,
    used: activeCount,
    limit: ent.maxCompanies,
  };
}

export async function createCompany(params: {
  ownerId: string;
  name: string;
  relationType: string;
  sector?: string | null;
  size?: string | null;
  criticality?: CriticalityLevel;
  description?: string | null;
}) {
  const usage = await getActiveCompanyUsage(params.ownerId);

  if (usage.used >= usage.limit) {
    throw new Error("PLAN_LIMIT_COMPANIES");
  }

  return prisma.company.create({
    data: {
      ownerId: params.ownerId,
      name: params.name,
      relationType: params.relationType,
      sector: params.sector ?? null,
      size: params.size ?? null,
      criticality: params.criticality ?? "MEDIUM",
      description: params.description ?? null,
    },
  });
}

export async function getActiveCompanies(ownerId: string) {
  return prisma.company.findMany({
    where: {
      ownerId,
      status: "ACTIVE",
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
