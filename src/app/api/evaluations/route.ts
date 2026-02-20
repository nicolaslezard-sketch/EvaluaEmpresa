import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createOrReuseDraft } from "@/lib/services/evaluations";
import { getUserEntitlements } from "@/lib/access/userAccess";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const ent = await getUserEntitlements(userId);

  const body = await request.json();
  const { companyId } = body;

  if (!companyId) {
    return NextResponse.json(
      { error: "companyId is required" },
      { status: 400 },
    );
  }

  // 🔎 Validar que la empresa pertenezca al usuario
  const company = await prisma.company.findFirst({
    where: {
      id: companyId,
      ownerId: userId,
    },
  });

  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  // 🚫 Plan no permite crear evaluaciones
  if (!ent.canCreateEvaluation) {
    return NextResponse.json(
      { error: "Plan does not allow new evaluations" },
      { status: 403 },
    );
  }

  // 🚫 Límite FREE (evaluaciones FINALIZED)
  if (ent.maxFinalizedEvaluationsTotal !== null) {
    const finalizedCount = await prisma.evaluation.count({
      where: {
        company: {
          ownerId: userId,
        },
        status: "FINALIZED",
      },
    });

    if (finalizedCount >= ent.maxFinalizedEvaluationsTotal) {
      return NextResponse.json(
        {
          error: "LIMIT_REACHED",
          message:
            "Has alcanzado el límite de evaluaciones disponibles en tu plan.",
        },
        { status: 403 },
      );
    }
  }

  // ✅ Crear o reutilizar draft
  const draft = await createOrReuseDraft(companyId);

  return NextResponse.json(draft);
}
