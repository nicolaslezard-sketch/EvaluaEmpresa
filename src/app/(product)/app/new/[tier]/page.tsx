import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EvaluationTier } from "@prisma/client";

export default async function NewEvaluationPage({
  params,
}: {
  params: { tier: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/");
  }

  const tierParam = params.tier.toUpperCase();

  if (tierParam !== "PYME" && tierParam !== "EMPRESA") {
    redirect("/app/dashboard");
  }

  const tier = tierParam as EvaluationTier;

  // 🔥 BUSCAR draft SOLO de ese tier
  let draft = await prisma.reportRequest.findFirst({
    where: {
      userId: session.user.id,
      tier,
      status: "PENDING_PAYMENT",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Si no existe, crearlo
  if (!draft) {
    draft = await prisma.reportRequest.create({
      data: {
        userId: session.user.id,
        email: session.user.email ?? "",
        tier,
        formData: {},
      },
    });
  }

  redirect(`/app/analysis/${draft.id}`);
}
