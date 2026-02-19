import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createOrReuseDraft } from "@/lib/services/evaluations";
import { getUserEntitlements } from "@/lib/access/userAccess";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ent = await getUserEntitlements(session.user.id);

  if (!ent.canCreateEvaluation) {
    return NextResponse.json(
      { error: "Plan does not allow new evaluations" },
      { status: 403 },
    );
  }

  const body = await request.json();

  const draft = await createOrReuseDraft(body.companyId);

  return NextResponse.json(draft);
}
