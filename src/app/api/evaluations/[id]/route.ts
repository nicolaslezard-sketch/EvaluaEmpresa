import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  patchDraftForUser,
  discardDraftForUser,
} from "@/lib/services/evaluations";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  try {
    const updated = await patchDraftForUser(session.user.id, id, body);

    return NextResponse.json(updated);
  } catch (error) {
    const message = (error as Error).message;

    if (message === "Evaluation not found") {
      return NextResponse.json({ error: message }, { status: 404 });
    }

    if (message === "Forbidden") {
      return NextResponse.json({ error: message }, { status: 403 });
    }

    if (
      message === "Evaluation not editable" ||
      message === "Expired evaluation not editable"
    ) {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const result = await discardDraftForUser(session.user.id, id);
    return NextResponse.json(result);
  } catch (error) {
    const message = (error as Error).message;

    if (message === "Evaluation not found") {
      return NextResponse.json({ error: message }, { status: 404 });
    }

    if (message === "Forbidden") {
      return NextResponse.json({ error: message }, { status: 403 });
    }

    if (message === "Only draft evaluations can be discarded") {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
