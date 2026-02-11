export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const emailFromBody =
      typeof body.email === "string" ? body.email.trim() : "";
    const email = emailFromBody || session.user.email || "";
    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    const report = await prisma.reportRequest.create({
      data: {
        userId: session.user.id,
        email,
        formData: body,
      },
    });

    return NextResponse.json({ id: report.id });
  } catch (error) {
    console.error("Error creando reporte:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
