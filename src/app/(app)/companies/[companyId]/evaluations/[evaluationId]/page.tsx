import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import EvaluationEditor from "@/components/app/evaluation/EvaluationEditor";
import type { EvaluationFormData } from "@/lib/types/evaluationForm";

export default async function EvaluationPage({
  params,
}: {
  params: { id: string; evaluationId: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const evaluation = await prisma.evaluation.findUnique({
    where: { id: params.evaluationId },
    include: { company: true },
  });

  if (
    !evaluation ||
    evaluation.companyId !== params.id ||
    evaluation.company.ownerId !== session.user.id
  ) {
    notFound();
  }

  return (
    <EvaluationEditor
      companyId={params.id}
      evaluationId={evaluation.id}
      companyName={evaluation.company.name}
      companyCriticality={evaluation.company.criticality}
      status={evaluation.status}
      formData={(evaluation.formData ?? {}) as EvaluationFormData}
      overallScore={evaluation.overallScore}
      executiveCategory={evaluation.executiveCategory}
      deltas={{
        overall: evaluation.deltaOverall,
        financial: evaluation.deltaFinancial,
        commercial: evaluation.deltaCommercial,
        operational: evaluation.deltaOperational,
        legal: evaluation.deltaLegal,
        strategic: evaluation.deltaStrategic,
      }}
    />
  );
}
