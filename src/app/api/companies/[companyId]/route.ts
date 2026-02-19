import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
      },
      alerts: true,
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
