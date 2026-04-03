import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import EvaluationEditor from "@/components/app/evaluation/EvaluationEditor";
import type { ReportData } from "@/lib/reports/buildReportData";
import type { EvaluationFormData } from "@/lib/types/evaluationForm";

export default async function EvaluationPage({
  params,
}: {
  params: Promise<{ companyId: string; evaluationId: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const { companyId, evaluationId } = await params;

  const evaluation = await prisma.evaluation.findUnique({
    where: { id: evaluationId },
    include: { company: true },
  });

  if (
    !evaluation ||
    evaluation.companyId !== companyId ||
    evaluation.company.ownerId !== session.user.id
  ) {
    notFound();
  }

  const previousFinalizedEvaluation = await prisma.evaluation.findFirst({
    where: {
      companyId,
      status: "FINALIZED",
      id: {
        not: evaluation.id,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      formData: true,
    },
  });

  const previousFormData =
    (previousFinalizedEvaluation?.formData as EvaluationFormData | null) ??
    null;

  return (
    <EvaluationEditor
      companyId={companyId}
      evaluationId={evaluation.id}
      companyName={evaluation.company.name}
      companyCriticality={evaluation.company.criticality}
      status={evaluation.status}
      formData={(evaluation.formData ?? {}) as EvaluationFormData}
      previousFormData={previousFormData}
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
      reportData={evaluation.reportData as ReportData | null}
    />
  );
}
