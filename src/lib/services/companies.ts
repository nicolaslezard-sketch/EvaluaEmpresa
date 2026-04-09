import { Prisma, type CriticalityLevel } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getUserEntitlements } from "@/lib/access/getEntitlements";

export const COMPANY_DESCRIPTION_MAX_LENGTH = 300;
export const COMPANY_DELETE_CONFIRM_TEXT = "eliminar";

export function compactWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function normalizeCompanyName(name: string) {
  return compactWhitespace(name).toLocaleLowerCase("es-AR");
}

export function sanitizeCompanyName(name: string) {
  return compactWhitespace(name);
}

export function sanitizeCompanyDescription(description?: string | null) {
  const value = (description ?? "").trim();
  return value.length > 0 ? value : null;
}

function isKnownPrismaError(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError;
}

function validateCreateCompanyInput(params: {
  name: string;
  relationType: string;
  sector?: string | null;
  size?: string | null;
  criticality?: CriticalityLevel;
  description?: string | null;
}) {
  const name = sanitizeCompanyName(params.name);
  const relationType = compactWhitespace(params.relationType ?? "");
  const sector = sanitizeCompanyDescription(params.sector ?? null);
  const size = sanitizeCompanyDescription(params.size ?? null);
  const description = sanitizeCompanyDescription(params.description ?? null);

  if (!name) {
    throw new Error("INVALID_COMPANY_NAME");
  }

  if (!relationType) {
    throw new Error("INVALID_RELATION_TYPE");
  }

  if (description && description.length > COMPANY_DESCRIPTION_MAX_LENGTH) {
    throw new Error("COMPANY_DESCRIPTION_TOO_LONG");
  }

  return {
    name,
    normalizedName: normalizeCompanyName(name),
    relationType,
    sector,
    size,
    criticality: params.criticality ?? "MEDIUM",
    description,
  };
}

function mapCompanyWriteError(error: unknown): never {
  if (isKnownPrismaError(error)) {
    if (error.code === "P2002") {
      throw new Error("COMPANY_NAME_ALREADY_EXISTS");
    }

    if (error.code === "P2034") {
      throw new Error("COMPANY_WRITE_CONFLICT");
    }
  }

  throw error;
}

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
  const ent = await getUserEntitlements(params.ownerId);
  const data = validateCreateCompanyInput(params);

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await prisma.$transaction(
        async (tx) => {
          const activeCount = await tx.company.count({
            where: {
              ownerId: params.ownerId,
              status: "ACTIVE",
            },
          });

          if (activeCount >= ent.maxCompanies) {
            throw new Error("PLAN_LIMIT_COMPANIES");
          }

          return tx.company.create({
            data: {
              ownerId: params.ownerId,
              name: data.name,
              normalizedName: data.normalizedName,
              relationType: data.relationType,
              sector: data.sector,
              size: data.size,
              criticality: data.criticality,
              description: data.description,
            },
          });
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      );
    } catch (error) {
      if (
        isKnownPrismaError(error) &&
        error.code === "P2034" &&
        attempt === 0
      ) {
        continue;
      }

      mapCompanyWriteError(error);
    }
  }

  throw new Error("COMPANY_WRITE_CONFLICT");
}

export async function deleteCompany(params: {
  ownerId: string;
  companyId: string;
}) {
  const company = await prisma.company.findFirst({
    where: {
      id: params.companyId,
      ownerId: params.ownerId,
    },
    select: {
      id: true,
    },
  });

  if (!company) {
    throw new Error("COMPANY_NOT_FOUND");
  }

  await prisma.company.delete({
    where: {
      id: company.id,
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
