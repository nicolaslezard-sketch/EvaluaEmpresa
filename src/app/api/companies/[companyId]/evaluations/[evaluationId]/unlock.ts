import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: NextRequest,
  context: {
    params: Promise<{ evaluationId: string }>;
  },
) {
  const { evaluationId } = await context.params;

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const evaluation = await prisma.evaluation.findUnique({
    where: { id: evaluationId },
    include: { company: true },
  });

  if (!evaluation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (evaluation.company.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.evaluationUnlock.upsert({
    where: {
      userId_evaluationId: {
        userId: session.user.id,
        evaluationId,
      },
    },
    update: {},
    create: {
      userId: session.user.id,
      evaluationId,
    },
  });

  return NextResponse.json({ success: true });
}
