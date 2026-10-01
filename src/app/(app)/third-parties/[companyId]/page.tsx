import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { notFound, redirect } from "next/navigation";
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

function criticalityClass(level: string) {
  switch (level) {
    case "HIGH":
      return "bg-red-100 text-red-700";
    case "LOW":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-amber-100 text-amber-700";
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

function workSiteStatusLabel(status: string) {
  switch (status) {
    case "PLANNED":
      return "Planificada";
    case "PAUSED":
      return "Pausada";
    case "FINISHED":
      return "Finalizada";
    default:
      return "Activa";
  }
}

export default async function ThirdPartyDetailPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const { companyId } = await params;

  const company = await prisma.company.findFirst({
    where: {
      id: companyId,
      ownerId: session.user.id,
    },
    include: {
      workSites: {
        where: { active: true },
        include: {
          workSite: true,
        },
        orderBy: { createdAt: "desc" },
      },
      evaluations: {
        orderBy: { createdAt: "desc" },
        take: 12,
        include: {
          alerts: {
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });

  if (!company) notFound();

  const latestFinalized =
    company.evaluations.find((evaluation) => evaluation.status === "FINALIZED") ??
    null;
  const activeDraft =
    company.evaluations.find((evaluation) => evaluation.status === "DRAFT") ?? null;
  const activeWorks = company.workSites.filter(
    (assignment) => assignment.workSite.status !== "FINISHED",
  );
  const alerts = latestFinalized?.alerts ?? [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link
            href="/third-parties"
            className="text-sm font-medium text-sky-800 hover:underline"
          >
            ← Volver a terceros
          </Link>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
              {thirdPartyTypeLabel(company.thirdPartyType)}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${criticalityClass(
                company.criticality,
              )}`}
            >
              Criticidad {criticalityLabel(company.criticality).toLowerCase()}
            </span>
            {latestFinalized?.executiveCategory ? (
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${categoryClass(
                  latestFinalized.executiveCategory,
                )}`}
              >
                {latestFinalized.executiveCategory}
              </span>
            ) : null}
          </div>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900">
            {company.name}
          </h1>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-600">
            <span>{company.trade || company.sector || "Sin rubro definido"}</span>
            {company.taxId ? <span>CUIT / ID: {company.taxId}</span> : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {activeDraft ? (
            <Link
              href={`/companies/${company.id}/evaluations/${activeDraft.id}`}
              className="btn btn-secondary"
            >
              Continuar evaluación
            </Link>
          ) : null}
          <Link
            href={`/companies/${company.id}/evaluations/new`}
            className="btn btn-primary"
          >
            {latestFinalized ? "Nueva evaluación" : "Primera evaluación"}
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-zinc-500">Score actual</div>
          <div className="mt-2 text-3xl font-semibold text-zinc-900">
            {latestFinalized?.overallScore !== null &&
            latestFinalized?.overallScore !== undefined
              ? latestFinalized.overallScore.toFixed(1)
              : "—"}
          </div>
          {latestFinalized?.deltaOverall !== null &&
          latestFinalized?.deltaOverall !== undefined ? (
            <div
              className={`mt-2 text-sm font-medium ${
                latestFinalized.deltaOverall < 0
                  ? "text-red-600"
                  : latestFinalized.deltaOverall > 0
                    ? "text-emerald-600"
                    : "text-zinc-500"
              }`}
            >
              {latestFinalized.deltaOverall > 0 ? "+" : ""}
              {latestFinalized.deltaOverall.toFixed(1)} vs. ciclo anterior
            </div>
          ) : (
            <div className="mt-2 text-sm text-zinc-500">Sin comparación disponible</div>
          )}
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-zinc-500">Obras activas</div>
          <div className="mt-2 text-3xl font-semibold text-zinc-900">
            {activeWorks.length}
          </div>
          <div className="mt-2 text-sm text-zinc-500">
            {company.workSites.length} asociación{company.workSites.length === 1 ? "" : "es"} total
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-zinc-500">Alertas del último ciclo</div>
          <div className="mt-2 text-3xl font-semibold text-zinc-900">
            {alerts.length}
          </div>
          <div className="mt-2 text-sm text-zinc-500">
            {alerts.length > 0 ? "Requiere revisión" : "Sin alertas registradas"}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-zinc-500">Última evaluación</div>
          <div className="mt-2 text-lg font-semibold text-zinc-900">
            {latestFinalized
              ? new Date(latestFinalized.createdAt).toLocaleDateString("es-AR")
              : "Sin evaluación"}
          </div>
          {latestFinalized ? (
            <Link
              href={`/companies/${company.id}/evaluations/${latestFinalized.id}`}
              className="mt-2 inline-block text-sm font-medium text-sky-800 hover:underline"
            >
              Ver detalle
            </Link>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">
                Obras relacionadas
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Dónde participa actualmente este tercero y qué rol cumple.
              </p>
            </div>
            <Link href="/works" className="btn btn-secondary">
              Ver obras
            </Link>
          </div>

          {company.workSites.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-600">
              Este tercero todavía no está asociado a ninguna obra. Podés
              vincularlo desde el detalle de una obra.
            </div>
          ) : (
            <div className="mt-6 divide-y divide-zinc-100">
              {company.workSites.map((assignment) => (
                <Link
                  key={assignment.id}
                  href={`/works/${assignment.workSite.id}`}
                  className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="font-medium text-zinc-900">
                      {assignment.workSite.name}
                    </div>
                    <div className="mt-1 text-sm text-zinc-500">
                      {assignment.trade || assignment.role || company.trade || "Sin rol definido"}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-zinc-600">
                    {workSiteStatusLabel(assignment.workSite.status)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900">Datos del tercero</h2>
          <dl className="mt-5 space-y-4 text-sm">
            <div className="flex justify-between gap-4 border-b border-zinc-100 pb-3">
              <dt className="text-zinc-500">Tipo</dt>
              <dd className="text-right font-medium text-zinc-900">
                {thirdPartyTypeLabel(company.thirdPartyType)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-zinc-100 pb-3">
              <dt className="text-zinc-500">Rubro</dt>
              <dd className="text-right font-medium text-zinc-900">
                {company.trade || company.sector || "Sin definir"}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-zinc-100 pb-3">
              <dt className="text-zinc-500">Criticidad</dt>
              <dd className="text-right font-medium text-zinc-900">
                {criticalityLabel(company.criticality)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">CUIT / ID</dt>
              <dd className="text-right font-medium text-zinc-900">
                {company.taxId || "Sin definir"}
              </dd>
            </div>
          </dl>

          {company.description ? (
            <div className="mt-6 rounded-2xl bg-zinc-50 p-4 text-sm leading-6 text-zinc-600">
              {company.description}
            </div>
          ) : null}
        </section>
      </div>

      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900">
              Historial de evaluaciones
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Seguimiento de score y categoría entre ciclos.
            </p>
          </div>
        </div>

        {company.evaluations.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-600">
            Todavía no hay evaluaciones para este tercero.
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {company.evaluations.slice(0, 6).map((evaluation) => (
              <Link
                key={evaluation.id}
                href={`/companies/${company.id}/evaluations/${evaluation.id}`}
                className="flex flex-col gap-3 rounded-2xl border border-zinc-200 p-4 transition hover:bg-zinc-50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-zinc-900">
                      {new Date(evaluation.createdAt).toLocaleDateString("es-AR")}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600">
                      {evaluation.status === "FINALIZED"
                        ? "Finalizada"
                        : evaluation.status === "DRAFT"
                          ? "En curso"
                          : "Expirada"}
                    </span>
                    {evaluation.executiveCategory ? (
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${categoryClass(
                          evaluation.executiveCategory,
                        )}`}
                      >
                        {evaluation.executiveCategory}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="text-sm font-semibold text-zinc-900">
                  {evaluation.overallScore !== null
                    ? `${evaluation.overallScore.toFixed(1)} / 100`
                    : "Sin score"}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
