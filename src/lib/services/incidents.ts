import type {
  IncidentSeverity,
  IncidentStatus,
  IncidentType,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const INCIDENT_TITLE_MAX_LENGTH = 120;
export const INCIDENT_DESCRIPTION_MAX_LENGTH = 1200;

function compactWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export async function createIncident(params: {
  ownerId: string;
  companyId: string;
  workSiteId?: string | null;
  title: string;
  description: string;
  type: IncidentType;
  severity: IncidentSeverity;
  occurredAt?: Date | null;
}) {
  const title = compactWhitespace(params.title);
  const description = params.description.trim();

  if (!title) throw new Error("INVALID_INCIDENT_TITLE");
  if (title.length > INCIDENT_TITLE_MAX_LENGTH) {
    throw new Error("INCIDENT_TITLE_TOO_LONG");
  }
  if (!description) throw new Error("INVALID_INCIDENT_DESCRIPTION");
  if (description.length > INCIDENT_DESCRIPTION_MAX_LENGTH) {
    throw new Error("INCIDENT_DESCRIPTION_TOO_LONG");
  }

  const company = await prisma.company.findFirst({
    where: {
      id: params.companyId,
      ownerId: params.ownerId,
      status: "ACTIVE",
    },
    select: { id: true },
  });

  if (!company) throw new Error("COMPANY_NOT_FOUND");

  if (params.workSiteId) {
    const assignment = await prisma.workSiteCompany.findFirst({
      where: {
        workSiteId: params.workSiteId,
        companyId: params.companyId,
        active: true,
        workSite: {
          ownerId: params.ownerId,
        },
      },
      select: { id: true },
    });

    if (!assignment) throw new Error("WORK_SITE_COMPANY_NOT_FOUND");
  }

  return prisma.incident.create({
    data: {
      ownerId: params.ownerId,
      companyId: params.companyId,
      workSiteId: params.workSiteId || null,
      title,
      description,
      type: params.type,
      severity: params.severity,
      occurredAt: params.occurredAt ?? new Date(),
    },
  });
}

export async function getIncidents(ownerId: string) {
  return prisma.incident.findMany({
    where: { ownerId },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          trade: true,
          criticality: true,
        },
      },
      workSite: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: [{ occurredAt: "desc" }, { createdAt: "desc" }],
  });
}

export async function updateIncidentStatus(params: {
  ownerId: string;
  incidentId: string;
  status: IncidentStatus;
}) {
  const incident = await prisma.incident.findFirst({
    where: {
      id: params.incidentId,
      ownerId: params.ownerId,
    },
    select: { id: true },
  });

  if (!incident) throw new Error("INCIDENT_NOT_FOUND");

  return prisma.incident.update({
    where: { id: incident.id },
    data: {
      status: params.status,
      resolvedAt: params.status === "RESOLVED" ? new Date() : null,
    },
  });
}
