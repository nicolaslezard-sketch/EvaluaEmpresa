import { prisma } from "@/lib/prisma";

export async function hasOneTimeEvaluationAccess({
  userId,
  evaluationId,
}: {
  userId: string;
  evaluationId: string;
}): Promise<boolean> {
  const row = await prisma.oneTimeEvaluationAccess.findUnique({
    where: {
      userId_evaluationId: {
        userId,
        evaluationId,
      },
    },
    select: {
      id: true,
    },
  });

  return Boolean(row);
}

export async function grantOneTimeEvaluationAccess({
  userId,
  evaluationId,
}: {
  userId: string;
  evaluationId: string;
}) {
  return prisma.oneTimeEvaluationAccess.upsert({
    where: {
      userId_evaluationId: {
        userId,
        evaluationId,
      },
    },
    update: {},
    create: {
      userId,
      evaluationId,
    },
  });
}
