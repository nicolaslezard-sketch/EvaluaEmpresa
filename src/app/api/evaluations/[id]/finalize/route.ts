import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { finalizeEvaluationForUser } from "@/lib/services/evaluations";

export async function POST(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const result = await finalizeEvaluationForUser(session.user.id, id);
    return NextResponse.json(result);
  } catch (error) {
    const message = (error as Error).message;

    if (message === "Evaluation not found") {
      return NextResponse.json({ error: message }, { status: 404 });
    }

    if (message === "Forbidden") {
      return NextResponse.json({ error: message }, { status: 403 });
    }

    if (
      message === "Invalid evaluation state" ||
      message === "Incomplete evaluation sections" ||
      message === "Evaluation already finalized"
    ) {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
