import { prisma } from "@/lib/prisma";

/**
 * Verifica si el usuario tiene unlock para esa evaluación
 */
export async function hasEvaluationUnlock(
  userId: string,
  evaluationId: string,
): Promise<boolean> {
  const unlock = await prisma.oneTimeEvaluationAccess.findUnique({
    where: {
      userId_evaluationId: {
        userId,
        evaluationId,
      },
    },
    select: { id: true },
  });

  return !!unlock;
}
