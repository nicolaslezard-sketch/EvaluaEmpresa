import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createOrReuseDraftForUser } from "@/lib/services/evaluations";
import { getUserEntitlements } from "@/lib/access/getEntitlements";

export default async function NewEvaluationPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const { companyId } = await params;

  if (!companyId) {
    redirect("/dashboard");
  }

  const company = await prisma.company.findFirst({
    where: {
      id: companyId,
      ownerId: userId,
    },
    select: {
      id: true,
    },
  });

  if (!company) {
    redirect("/dashboard");
  }

  const ent = await getUserEntitlements(userId);

  if (!ent.canCreateEvaluation) {
    redirect("/billing");
  }

  if (ent.maxFinalizedEvaluationsTotal !== null) {
    const finalizedCount = await prisma.evaluation.count({
      where: {
        company: { ownerId: userId },
        status: "FINALIZED",
      },
    });

    if (finalizedCount >= ent.maxFinalizedEvaluationsTotal) {
      redirect("/billing");
    }
  }

  const draft = await createOrReuseDraftForUser(userId, companyId);

  redirect(`/companies/${companyId}/evaluations/${draft.id}`);
}
