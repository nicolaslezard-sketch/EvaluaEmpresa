import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.email || typeof body.email !== "string") {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    const report = await prisma.reportRequest.create({
      data: {
        email: body.email.trim(),
        formData: body,
        // status usa default
      },
    });

    return NextResponse.json({ id: report.id });
  } catch (error) {
    console.error("Error creando reporte:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
