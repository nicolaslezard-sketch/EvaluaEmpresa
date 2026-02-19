import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UnlockButton from "@/components/app/UnlockButton";

type PageProps = {
  params: {
    companyId: string;
    evaluationId: string;
  };
};

export default async function EvaluationPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    notFound();
  }

  const evaluation = await prisma.evaluation.findUnique({
    where: { id: params.evaluationId },
    include: { company: true },
  });

  if (
    !evaluation ||
    evaluation.companyId !== params.companyId ||
    evaluation.company.ownerId !== session.user.id
  ) {
    notFound();
  }

  const accessRes = await fetch(
    `${process.env.APP_URL}/api/companies/${params.companyId}/evaluations/${params.evaluationId}/access`,
    { cache: "no-store" },
  );

  const access = await accessRes.json();

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-semibold">
        Evaluación – {evaluation.company.name}
      </h1>

      <div className="p-6 border rounded-lg space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Score general</p>
          <p className="text-3xl font-bold">{evaluation.overallScore ?? "-"}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Categoría</p>
          <p className="font-medium">{evaluation.executiveCategory ?? "-"}</p>
        </div>
      </div>

      <div className="pt-4">
        {access.hasAccess && (
          <a
            href={`/api/companies/${params.companyId}/evaluations/${params.evaluationId}/pdf`}
            className="inline-flex items-center px-5 py-2 bg-black text-white rounded-md"
          >
            Descargar PDF
          </a>
        )}

        {!access.hasAccess && access.reason === "none" && (
          <UnlockButton
            companyId={params.companyId}
            evaluationId={params.evaluationId}
          />
        )}

        {!access.hasAccess && access.reason === "pending" && (
          <div className="text-amber-600 text-sm">Procesando pago...</div>
        )}
      </div>
    </div>
  );
}
