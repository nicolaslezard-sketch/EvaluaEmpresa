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

  const evaluations = await prisma.evaluation.findMany({
    where: {
      companyId,
      company: {
        ownerId: session.user.id,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(evaluations);
}
