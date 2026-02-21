import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createCompany, getActiveCompanies } from "@/lib/services/companies";
import { getUserEntitlements } from "@/lib/access/getEntitlements";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const companies = await getActiveCompanies(session.user.id);
  return NextResponse.json(companies);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // 🔒 Entitlements
  const ent = await getUserEntitlements(userId);

  // 🔢 Contamos empresas del usuario
  const companiesCount = await prisma.company.count({
    where: {
      ownerId: userId,
    },
  });
  console.log("PLAN:", ent.plan);
  console.log("MAX COMPANIES:", ent.maxCompanies);
  console.log("CURRENT COUNT:", companiesCount);

  if (companiesCount >= ent.maxCompanies) {
    return NextResponse.json(
      { error: "PLAN_LIMIT_COMPANIES" },
      { status: 403 },
    );
  }

  const body = await req.json();

  if (!body?.name || !body?.relationType) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const company = await createCompany({
    ownerId: userId,
    name: body.name,
    relationType: body.relationType,
    sector: body.sector ?? null,
    size: body.size ?? null,
    criticality: body.criticality ?? "MEDIUM",
    description: body.description ?? null,
  });

  return NextResponse.json(company);
}
