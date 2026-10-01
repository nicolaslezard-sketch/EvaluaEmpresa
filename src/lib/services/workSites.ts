import { prisma } from "@/lib/prisma";

export const WORK_SITE_DESCRIPTION_MAX_LENGTH = 500;

function compactWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function nullableText(value?: string | null) {
  const normalized = compactWhitespace(value ?? "");
  return normalized.length > 0 ? normalized : null;
}

export async function createWorkSite(params: {
  ownerId: string;
  name: string;
  address?: string | null;
  responsibleName?: string | null;
  startDate?: Date | null;
  expectedEndDate?: Date | null;
  description?: string | null;
}) {
  const name = compactWhitespace(params.name);
  const description = nullableText(params.description);

  if (!name) throw new Error("INVALID_WORK_SITE_NAME");
  if (description && description.length > WORK_SITE_DESCRIPTION_MAX_LENGTH) {
    throw new Error("WORK_SITE_DESCRIPTION_TOO_LONG");
  }

  return prisma.workSite.create({
    data: {
      ownerId: params.ownerId,
      name,
      address: nullableText(params.address),
      responsibleName: nullableText(params.responsibleName),
      startDate: params.startDate ?? null,
      expectedEndDate: params.expectedEndDate ?? null,
      description,
    },
  });
}

export async function getWorkSites(ownerId: string) {
  return prisma.workSite.findMany({
    where: { ownerId },
    include: {
      _count: {
        select: {
          companies: {
            where: { active: true },
          },
        },
      },
    },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });
}

export async function getWorkSite(ownerId: string, workSiteId: string) {
  return prisma.workSite.findFirst({
    where: {
      id: workSiteId,
      ownerId,
    },
    include: {
      companies: {
        where: { active: true },
        include: {
          company: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

export async function assignCompanyToWorkSite(params: {
  ownerId: string;
  workSiteId: string;
  companyId: string;
  role?: string | null;
  trade?: string | null;
}) {
  const [workSite, company] = await Promise.all([
    prisma.workSite.findFirst({
      where: { id: params.workSiteId, ownerId: params.ownerId },
      select: { id: true },
    }),
    prisma.company.findFirst({
      where: { id: params.companyId, ownerId: params.ownerId, status: "ACTIVE" },
      select: { id: true },
    }),
  ]);

  if (!workSite) throw new Error("WORK_SITE_NOT_FOUND");
  if (!company) throw new Error("COMPANY_NOT_FOUND");

  return prisma.workSiteCompany.upsert({
    where: {
      workSiteId_companyId: {
        workSiteId: params.workSiteId,
        companyId: params.companyId,
      },
    },
    update: {
      active: true,
      role: nullableText(params.role),
      trade: nullableText(params.trade),
      endedAt: null,
    },
    create: {
      workSiteId: params.workSiteId,
      companyId: params.companyId,
      role: nullableText(params.role),
      trade: nullableText(params.trade),
    },
  });
}

export async function removeCompanyFromWorkSite(params: {
  ownerId: string;
  workSiteId: string;
  companyId: string;
}) {
  const assignment = await prisma.workSiteCompany.findFirst({
    where: {
      workSiteId: params.workSiteId,
      companyId: params.companyId,
      workSite: {
        ownerId: params.ownerId,
      },
      company: {
        ownerId: params.ownerId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!assignment) throw new Error("WORK_SITE_COMPANY_NOT_FOUND");

  return prisma.workSiteCompany.update({
    where: { id: assignment.id },
    data: {
      active: false,
      endedAt: new Date(),
    },
  });
}
