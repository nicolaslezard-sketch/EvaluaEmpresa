import { prisma } from "@/lib/prisma";
import type { CriticalityLevel } from "@prisma/client";

export async function createCompany(params: {
  ownerId: string;
  name: string;
  relationType: string;
  sector?: string;
  size?: string;
  criticality?: CriticalityLevel;
  description?: string;
}) {
  return prisma.company.create({
    data: {
      ownerId: params.ownerId,
      name: params.name,
      relationType: params.relationType,
      sector: params.sector,
      size: params.size,
      criticality: params.criticality ?? "MEDIUM",
      description: params.description,
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
