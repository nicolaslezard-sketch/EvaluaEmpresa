import { prisma } from "@/lib/prisma";
import { getUserEntitlements } from "@/lib/access/getEntitlements";
import type { CriticalityLevel } from "@prisma/client";

export async function createCompany(params: {
  ownerId: string;
  name: string;
  relationType: string;
  sector?: string | null;
  size?: string | null;
  criticality?: CriticalityLevel;
  description?: string | null;
}) {
  // 🔒 1. Entitlements
  const ent = await getUserEntitlements(params.ownerId);

  // 🔢 2. Conteo actual
  const companiesCount = await prisma.company.count({
    where: {
      ownerId: params.ownerId,
    },
  });

  // 🛑 3. Límite de plan
  if (companiesCount >= ent.maxCompanies) {
    throw new Error("PLAN_LIMIT_COMPANIES");
  }

  // 🏗 4. Crear empresa
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
