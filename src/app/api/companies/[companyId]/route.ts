import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  COMPANY_DELETE_CONFIRM_TEXT,
  deleteCompany,
} from "@/lib/services/companies";

export async function GET(
  _request: NextRequest,
  context: {
    params: Promise<{
      companyId: string;
    }>;
  },
) {
  const { companyId } = await context.params;

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const company = await prisma.company.findUnique({
    where: { id: companyId },
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

  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  if (company.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(company);
}

export async function DELETE(
  req: NextRequest,
  context: {
    params: Promise<{
      companyId: string;
    }>;
  },
) {
  const { companyId } = await context.params;

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const confirmationText = String(body?.confirmationText ?? "").trim();

  if (confirmationText !== COMPANY_DELETE_CONFIRM_TEXT) {
    return NextResponse.json(
      {
        error: "INVALID_DELETE_CONFIRMATION",
        message: `Para eliminar la empresa tenés que escribir exactamente: ${COMPANY_DELETE_CONFIRM_TEXT}`,
      },
      { status: 400 },
    );
  }

  try {
    await deleteCompany({
      ownerId: session.user.id,
      companyId,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "COMPANY_NOT_FOUND") {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 },
    );
  }
}
