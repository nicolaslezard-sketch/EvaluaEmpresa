import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function thirdPartyTypeLabel(type: string | null) {
  switch (type) {
    case "SUPPLIER":
      return "Proveedor";
    case "CONTRACTOR":
      return "Contratista";
    case "SUBCONTRACTOR":
      return "Subcontratista";
    case "OTHER":
      return "Otro tercero";
    default:
      return "Tercero";
  }
}

function criticalityLabel(level: string) {
  switch (level) {
    case "HIGH":
      return "Alta";
    case "LOW":
      return "Baja";
    default:
      return "Media";
  }
}

function categoryClass(category?: string | null) {
  switch (category) {
    case "SOLIDO":
      return "bg-emerald-100 text-emerald-700";
    case "ESTABLE":
      return "bg-blue-100 text-blue-700";
    case "VULNERABLE":
      return "bg-amber-100 text-amber-700";
    case "CRITICO":
      return "bg-red-100 text-red-700";
    default:
      return "bg-zinc-100 text-zinc-600";
  }
}

export default async function ThirdPartiesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const companies = await prisma.company.findMany({
    where: {
      ownerId: session.user.id,
      status: "ACTIVE",
    },
    include: {
      workSites: {
        where: { active: true },
        select: {
          workSite: {
            select: {
              id: true,
              name: true,
              status: true,
            },
          },
        },
      },
      evaluations: {
        where: { status: "FINALIZED" },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          overallScore: true,
          deltaOverall: true,
          executiveCategory: true,
          createdAt: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  const highCriticality = companies.filter(
    (company) => company.criticality === "HIGH",
  ).length;
  const assigned = companies.filter((company) => company.workSites.length > 0).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-sky-800">
            Control de terceros
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900">
            Proveedores y contratistas
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
            Centralizá los terceros que participan en tus obras y seguí su
            criticidad, evaluaciones y evolución.
          </p>
        </div>

        <Link href="/companies/new" className="btn btn-primary">
          Nuevo tercero
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-zinc-500">Terceros activos</div>
          <div className="mt-2 text-3xl font-semibold text-zinc-900">
            {companies.length}
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-zinc-500">Asignados a obras</div>
          <div className="mt-2 text-3xl font-semibold text-zinc-900">
            {assigned}
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-zinc-500">Criticidad alta</div>
          <div className="mt-2 text-3xl font-semibold text-zinc-900">
            {highCriticality}
          </div>
        </div>
      </div>

      {companies.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-zinc-900">
            Todavía no cargaste terceros
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-zinc-600">
            Cargá tu primer proveedor o contratista para asociarlo a una obra y
            empezar a construir su historial.
          </p>
          <Link href="/companies/new" className="btn btn-primary mt-6">
            Cargar primer tercero
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <div className="hidden grid-cols-[1.5fr_1fr_0.7fr_0.8fr_0.8fr] gap-4 border-b border-zinc-200 bg-zinc-50 px-6 py-3 text-xs font-medium uppercase tracking-wide text-zinc-500 md:grid">
            <div>Tercero</div>
            <div>Rubro</div>
            <div>Obras</div>
            <div>Criticidad</div>
            <div>Último score</div>
          </div>

          <div className="divide-y divide-zinc-100">
            {companies.map((company) => {
              const latest = company.evaluations[0] ?? null;

              return (
                <Link
                  key={company.id}
                  href={`/third-parties/${company.id}`}
                  className="block px-6 py-5 transition hover:bg-zinc-50"
                >
                  <div className="grid gap-4 md:grid-cols-[1.5fr_1fr_0.7fr_0.8fr_0.8fr] md:items-center">
                    <div>
                      <div className="font-medium text-zinc-900">{company.name}</div>
                      <div className="mt-1 text-sm text-zinc-500">
                        {thirdPartyTypeLabel(company.thirdPartyType)}
                        {company.taxId ? ` · ${company.taxId}` : ""}
                      </div>
                    </div>

                    <div className="text-sm text-zinc-700">
                      {company.trade || company.sector || "Sin rubro"}
                    </div>

                    <div className="text-sm text-zinc-700">
                      <span className="md:hidden text-zinc-500">Obras: </span>
                      {company.workSites.length}
                    </div>

                    <div className="text-sm font-medium text-zinc-700">
                      <span className="md:hidden text-zinc-500">Criticidad: </span>
                      {criticalityLabel(company.criticality)}
                    </div>

                    <div>
                      {latest?.overallScore !== null && latest?.overallScore !== undefined ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-zinc-900">
                            {latest.overallScore.toFixed(1)}
                          </span>
                          {latest.executiveCategory ? (
                            <span
                              className={`rounded-full px-2 py-1 text-[11px] font-medium ${categoryClass(
                                latest.executiveCategory,
                              )}`}
                            >
                              {latest.executiveCategory}
                            </span>
                          ) : null}
                          {latest.deltaOverall !== null ? (
                            <span
                              className={`text-xs font-medium ${
                                latest.deltaOverall < 0
                                  ? "text-red-600"
                                  : latest.deltaOverall > 0
                                    ? "text-emerald-600"
                                    : "text-zinc-500"
                              }`}
                            >
                              {latest.deltaOverall > 0 ? "+" : ""}
                              {latest.deltaOverall.toFixed(1)}
                            </span>
                          ) : null}
                        </div>
                      ) : (
                        <span className="text-sm text-zinc-400">Sin evaluación</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
