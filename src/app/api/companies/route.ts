import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  COMPANY_DESCRIPTION_MAX_LENGTH,
  createCompany,
  getActiveCompanies,
} from "@/lib/services/companies";

function companyErrorResponse(error: unknown) {
  if (!(error instanceof Error)) {
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 },
    );
  }

  switch (error.message) {
    case "INVALID_COMPANY_NAME":
      return NextResponse.json(
        { error: "INVALID_COMPANY_NAME" },
        { status: 400 },
      );

    case "INVALID_RELATION_TYPE":
      return NextResponse.json(
        { error: "INVALID_RELATION_TYPE" },
        { status: 400 },
      );

    case "COMPANY_DESCRIPTION_TOO_LONG":
      return NextResponse.json(
        {
          error: "COMPANY_DESCRIPTION_TOO_LONG",
          maxLength: COMPANY_DESCRIPTION_MAX_LENGTH,
        },
        { status: 400 },
      );

    case "PLAN_LIMIT_COMPANIES":
      return NextResponse.json(
        { error: "PLAN_LIMIT_COMPANIES" },
        { status: 403 },
      );

    case "COMPANY_NAME_ALREADY_EXISTS":
      return NextResponse.json(
        { error: "COMPANY_NAME_ALREADY_EXISTS" },
        { status: 409 },
      );

    case "COMPANY_WRITE_CONFLICT":
      return NextResponse.json(
        { error: "COMPANY_WRITE_CONFLICT" },
        { status: 409 },
      );

    default:
      return NextResponse.json(
        { error: "INTERNAL_SERVER_ERROR" },
        { status: 500 },
      );
  }
}

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

  const body = await req.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    const company = await createCompany({
      ownerId: session.user.id,
      name: String(body.name ?? ""),
      relationType: String(body.relationType ?? ""),
      sector: body.sector == null ? null : String(body.sector),
      size: body.size == null ? null : String(body.size),
      criticality: body.criticality ?? "MEDIUM",
      description: body.description == null ? null : String(body.description),
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    return companyErrorResponse(error);
  }
}
