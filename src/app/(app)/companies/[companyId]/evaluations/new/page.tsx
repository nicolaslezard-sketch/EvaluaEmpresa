import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createOrReuseDraft } from "@/lib/services/evaluations";
import { getUserEntitlements } from "@/lib/access/userAccess";

export default async function NewEvaluationPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  // 🔐 Validar que la empresa pertenezca al usuario
  const company = await prisma.company.findFirst({
    where: {
      id: params.id,
      ownerId: userId,
    },
  });

  if (!company) {
    redirect("/dashboard");
  }

  // 📊 Validar plan
  const ent = await getUserEntitlements(userId);

  if (!ent.canCreateEvaluation) {
    redirect("/billing");
  }

  // 🚫 Límite FREE (FINALIZED)
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

  // ✅ Crear draft
  const draft = await createOrReuseDraft(params.id);

  redirect(`/app/companies/${params.id}/evaluations/${draft.id}`);
}
