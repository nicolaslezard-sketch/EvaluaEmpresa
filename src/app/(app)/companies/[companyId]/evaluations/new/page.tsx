import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createOrReuseDraft } from "@/lib/services/evaluations";
import { getUserEntitlements } from "@/lib/access/userAccess";

export default async function NewEvaluationPage({
  params,
}: {
  params: { companyId: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  const { companyId } = params;

  const company = await prisma.company.findFirst({
    where: {
      id: companyId,
      ownerId: userId,
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

  const draft = await createOrReuseDraft(companyId);

  redirect(`/companies/${companyId}/evaluations/${draft.id}`);
}
