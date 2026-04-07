import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const now = new Date();

  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    select: {
      plan: true,
      status: true,
      isTrial: true,
      currentPeriodEnd: true,
    },
  });

  const hasPaidAccessStillActive =
    !!subscription &&
    subscription.isTrial === false &&
    subscription.plan !== "FREE" &&
    (subscription.status === "ACTIVE" ||
      (subscription.status === "CANCELLED" &&
        !!subscription.currentPeriodEnd &&
        subscription.currentPeriodEnd >= now));

  if (hasPaidAccessStillActive) {
    return NextResponse.json(
      {
        error: "ACTIVE_PAID_SUBSCRIPTION",
        message:
          "No podés eliminar la cuenta mientras tengas una suscripción paga activa o con acceso vigente. Primero cancelá el plan y esperá al fin del período.",
      },
      { status: 400 },
    );
  }

  const companyIds = await prisma.company.findMany({
    where: { ownerId: userId },
    select: { id: true },
  });

  const ids = companyIds.map((company) => company.id);

  await prisma.$transaction(async (tx) => {
    if (ids.length > 0) {
      await tx.evaluation.deleteMany({
        where: {
          companyId: {
            in: ids,
          },
        },
      });

      await tx.company.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
    }

    await tx.oneTimeEvaluationAccess.deleteMany({
      where: { userId },
    });

    await tx.subscription.deleteMany({
      where: { userId },
    });

    await tx.account.deleteMany({
      where: { userId },
    });

    await tx.session.deleteMany({
      where: { userId },
    });

    await tx.user.delete({
      where: { id: userId },
    });
  });

  return NextResponse.json({ ok: true });
}
