export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    default:
      return "Tercero";
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

function severityLabel(severity: string) {
  switch (severity) {
    case "CRITICAL":
      return "Crítica";
    case "MINOR":
      return "Menor";
    default:
      return "Relevante";
  }
}

function severityClass(severity: string) {
  switch (severity) {
    case "CRITICAL":
      return "bg-red-100 text-red-700";
    case "MINOR":
      return "bg-zinc-100 text-zinc-700";
    default:
      return "bg-amber-100 text-amber-700";
  }
}

function incidentTypeLabel(type: string) {
  switch (type) {
    case "DELAY":
      return "Demora";
    case "QUALITY":
      return "Calidad";
    case "DELIVERY":
      return "Entrega";
    case "DOCUMENTATION":
      return "Documentación";
    case "SAFETY":
      return "Seguridad";
    case "COMMUNICATION":
      return "Comunicación";
    case "CONTRACTUAL":
      return "Contractual";
    default:
      return "Otro";
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const ownerId = session.user.id;

  const [companies, activeWorks, recentIncidents] = await Promise.all([
    prisma.company.findMany({
      where: {
        ownerId,
        status: "ACTIVE",
      },
      include: {
        evaluations: {
          where: { status: "FINALIZED" },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        incidents: {
          where: { status: { not: "RESOLVED" } },
          orderBy: { occurredAt: "desc" },
        },
        workSites: {
          where: { active: true },
          include: {
            workSite: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.workSite.findMany({
      where: {
        ownerId,
        status: "ACTIVE",
      },
      include: {
        companies: {
          where: { active: true },
          select: { id: true },
        },
        incidents: {
          where: { status: { not: "RESOLVED" } },
          select: {
            id: true,
            severity: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.incident.findMany({
      where: { ownerId },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        workSite: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { occurredAt: "desc" },
      take: 6,
    }),
  ]);

  const openIncidents = companies.flatMap((company) => company.incidents);
  const criticalOpenIncidents = openIncidents.filter(
    (incident) => incident.severity === "CRITICAL",
  );

  const attentionCompanies = companies
    .map((company) => {
      const latest = company.evaluations[0] ?? null;
      const criticalIncidents = company.incidents.filter(
        (incident) => incident.severity === "CRITICAL",
      );
      const relevantIncidents = company.incidents.filter(
        (incident) => incident.severity === "RELEVANT",
      );

      const reasons: string[] = [];
      let priority = 0;

      if (criticalIncidents.length > 0) {
        reasons.push(
          `${criticalIncidents.length} incidencia${criticalIncidents.length === 1 ? "" : "s"} crítica${criticalIncidents.length === 1 ? "" : "s"}`,
        );
        priority += criticalIncidents.length * 5;
      }

      if (relevantIncidents.length > 0) {
        reasons.push(
          `${relevantIncidents.length} incidencia${relevantIncidents.length === 1 ? "" : "s"} relevante${relevantIncidents.length === 1 ? "" : "s"}`,
        );
        priority += relevantIncidents.length * 2;
      }

      const minorIncidents = company.incidents.length - criticalIncidents.length - relevantIncidents.length;
      if (minorIncidents > 0 && reasons.length === 0) {
        reasons.push(
          `${minorIncidents} incidencia${minorIncidents === 1 ? "" : "s"} abierta${minorIncidents === 1 ? "" : "s"}`,
        );
        priority += minorIncidents;
      }

      if (latest?.executiveCategory === "CRITICO") {
        reasons.push("evaluación en nivel crítico");
        priority += 5;
      } else if (latest?.executiveCategory === "VULNERABLE") {
        reasons.push("evaluación vulnerable");
        priority += 3;
      }

      if (latest?.deltaOverall !== null && latest?.deltaOverall !== undefined) {
        if (latest.deltaOverall <= -10) {
          reasons.push(`score cayó ${Math.abs(latest.deltaOverall).toFixed(1)} pts`);
          priority += 4;
        } else if (latest.deltaOverall < 0) {
          reasons.push(`score bajó ${Math.abs(latest.deltaOverall).toFixed(1)} pts`);
          priority += 1;
        }
      }

      return {
        company,
        latest,
        reasons,
        priority,
      };
    })
    .filter((item) => item.priority > 0)
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 6);

  const workOverview = [...activeWorks]
    .sort((a, b) => {
      const aCritical = a.incidents.filter(
        (incident) => incident.severity === "CRITICAL",
      ).length;
      const bCritical = b.incidents.filter(
        (incident) => incident.severity === "CRITICAL",
      ).length;

      if (aCritical !== bCritical) return bCritical - aCritical;
      if (a.incidents.length !== b.incidents.length) {
        return b.incidents.length - a.incidents.length;
      }
      return b.companies.length - a.companies.length;
    })
    .slice(0, 5);

  if (companies.length === 0 && activeWorks.length === 0) {
    return (
      <div className="space-y-8">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-sky-800">
            Control de terceros
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900">
            Configurá tu primera obra
          </h1>
          <p className="mt-4 text-base leading-7 text-zinc-600">
            EvaluaEmpresa organiza proveedores y contratistas por obra para que
            puedas registrar incidencias, mantener contexto y detectar qué
            terceros requieren atención.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
            <div className="text-sm font-medium text-sky-800">Paso 1</div>
            <h2 className="mt-3 text-lg font-semibold text-zinc-900">
              Creá una obra
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Cargá el proyecto, responsable y fechas principales.
            </p>
            <Link href="/works/new" className="btn btn-primary mt-6">
              Crear obra
            </Link>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-medium text-zinc-500">Paso 2</div>
            <h2 className="mt-3 text-lg font-semibold text-zinc-900">
              Cargá terceros
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Registrá proveedores, contratistas y subcontratistas.
            </p>
            <Link href="/companies/new" className="btn btn-secondary mt-6">
              Nuevo tercero
            </Link>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-medium text-zinc-500">Paso 3</div>
            <h2 className="mt-3 text-lg font-semibold text-zinc-900">
              Asociá y seguí
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Vinculalos a la obra y empezá a registrar incidencias reales.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-sky-800">
            Control de terceros
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900">
            Qué requiere atención hoy
          </h1>
          <p className="mt-3 text-base leading-7 text-zinc-600">
            Vista operativa de obras, proveedores, contratistas e incidencias
            para priorizar problemas antes de que impacten en la obra.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/incidents/new" className="btn btn-secondary">
            Nueva incidencia
          </Link>
          <Link href="/works/new" className="btn btn-primary">
            Nueva obra
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Link
          href="/works"
          className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-sky-200"
        >
          <div className="text-sm text-zinc-500">Obras activas</div>
          <div className="mt-2 text-3xl font-semibold text-zinc-900">
            {activeWorks.length}
          </div>
          <div className="mt-2 text-xs font-medium text-sky-800">Ver obras →</div>
        </Link>

        <Link
          href="/third-parties"
          className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-sky-200"
        >
          <div className="text-sm text-zinc-500">Terceros activos</div>
          <div className="mt-2 text-3xl font-semibold text-zinc-900">
            {companies.length}
          </div>
          <div className="mt-2 text-xs font-medium text-sky-800">Ver terceros →</div>
        </Link>

        <div
          className={`rounded-2xl border p-5 shadow-sm ${
            attentionCompanies.length > 0
              ? "border-amber-200 bg-amber-50"
              : "border-emerald-200 bg-emerald-50"
          }`}
        >
          <div className="text-sm text-zinc-600">Requieren atención</div>
          <div className="mt-2 text-3xl font-semibold text-zinc-900">
            {attentionCompanies.length}
          </div>
          <div className="mt-2 text-xs text-zinc-600">
            {attentionCompanies.length > 0 ? "Prioridad operativa" : "Sin señales prioritarias"}
          </div>
        </div>

        <Link
          href="/incidents"
          className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-sky-200"
        >
          <div className="text-sm text-zinc-500">Incidencias abiertas</div>
          <div className="mt-2 text-3xl font-semibold text-zinc-900">
            {openIncidents.length}
          </div>
          <div className="mt-2 text-xs font-medium text-sky-800">Gestionar →</div>
        </Link>

        <Link
          href="/incidents"
          className={`rounded-2xl border p-5 shadow-sm transition ${
            criticalOpenIncidents.length > 0
              ? "border-red-200 bg-red-50 hover:border-red-300"
              : "border-zinc-200 bg-white hover:border-sky-200"
          }`}
        >
          <div className="text-sm text-zinc-500">Incidencias críticas</div>
          <div className="mt-2 text-3xl font-semibold text-zinc-900">
            {criticalOpenIncidents.length}
          </div>
          <div className="mt-2 text-xs font-medium text-sky-800">Ver detalle →</div>
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">
                Requieren atención
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Terceros priorizados por incidencias, deterioro o nivel de evaluación.
              </p>
            </div>
            <Link href="/third-parties" className="btn btn-secondary">
              Ver todos
            </Link>
          </div>

          {attentionCompanies.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
              <div className="font-medium text-emerald-900">Sin señales prioritarias</div>
              <p className="mt-2 text-sm leading-6 text-emerald-800">
                No hay terceros con incidencias abiertas relevantes, evaluación
                vulnerable/crítica o deterioro destacado en el último ciclo.
              </p>
            </div>
          ) : (
            <div className="mt-6 divide-y divide-zinc-100">
              {attentionCompanies.map(({ company, latest, reasons }) => {
                const workNames = company.workSites
                  .filter((assignment) => assignment.workSite.status !== "FINISHED")
                  .map((assignment) => assignment.workSite.name)
                  .slice(0, 2);

                return (
                  <Link
                    key={company.id}
                    href={`/third-parties/${company.id}`}
                    className="block py-5 first:pt-0 last:pb-0"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-zinc-900">
                            {company.name}
                          </span>
                          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
                            {thirdPartyTypeLabel(company.thirdPartyType)}
                          </span>
                          {latest?.executiveCategory ? (
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-medium ${categoryClass(
                                latest.executiveCategory,
                              )}`}
                            >
                              {latest.executiveCategory}
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-2 text-sm text-zinc-500">
                          {workNames.length > 0
                            ? workNames.join(" · ")
                            : "Sin obra activa asociada"}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {reasons.slice(0, 3).map((reason) => (
                            <span
                              key={reason}
                              className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800"
                            >
                              {reason}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="shrink-0 text-left md:text-right">
                        <div className="text-xs uppercase tracking-wide text-zinc-400">
                          Score
                        </div>
                        <div className="mt-1 text-xl font-semibold text-zinc-900">
                          {latest?.overallScore !== null && latest?.overallScore !== undefined
                            ? latest.overallScore.toFixed(1)
                            : "—"}
                        </div>
                        {latest?.deltaOverall !== null && latest?.deltaOverall !== undefined ? (
                          <div
                            className={`mt-1 text-xs font-medium ${
                              latest.deltaOverall < 0
                                ? "text-red-600"
                                : latest.deltaOverall > 0
                                  ? "text-emerald-600"
                                  : "text-zinc-500"
                            }`}
                          >
                            {latest.deltaOverall > 0 ? "+" : ""}
                            {latest.deltaOverall.toFixed(1)} pts
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">
                Incidencias recientes
              </h2>
              <p className="mt-1 text-sm text-zinc-500">Últimos eventos registrados.</p>
            </div>
            <Link href="/incidents" className="text-sm font-medium text-sky-800 hover:underline">
              Ver todas
            </Link>
          </div>

          {recentIncidents.length === 0 ? (
            <div className="mt-5 rounded-2xl bg-zinc-50 p-5 text-sm text-zinc-600">
              Todavía no registraste incidencias.
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {recentIncidents.map((incident) => (
                <div key={incident.id} className="border-b border-zinc-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-1 text-[11px] font-medium ${severityClass(
                        incident.severity,
                      )}`}
                    >
                      {severityLabel(incident.severity)}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {incidentTypeLabel(incident.type)}
                    </span>
                  </div>
                  <Link
                    href={`/third-parties/${incident.company.id}`}
                    className="mt-2 block text-sm font-semibold text-zinc-900 hover:underline"
                  >
                    {incident.company.name}
                  </Link>
                  <div className="mt-1 line-clamp-2 text-sm text-zinc-600">
                    {incident.title}
                  </div>
                  <div className="mt-2 text-xs text-zinc-400">
                    {incident.workSite?.name ? `${incident.workSite.name} · ` : ""}
                    {new Date(incident.occurredAt).toLocaleDateString("es-AR")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900">Obras activas</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Vista rápida de carga de terceros e incidencias abiertas por obra.
            </p>
          </div>
          <Link href="/works" className="btn btn-secondary">
            Gestionar obras
          </Link>
        </div>

        {workOverview.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-600">
            No hay obras activas. Podés crear una nueva para empezar a organizar terceros.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {workOverview.map((work) => {
              const criticalCount = work.incidents.filter(
                (incident) => incident.severity === "CRITICAL",
              ).length;

              return (
                <Link
                  key={work.id}
                  href={`/works/${work.id}`}
                  className="rounded-2xl border border-zinc-200 p-5 transition hover:border-sky-200 hover:bg-zinc-50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold text-zinc-900">{work.name}</div>
                      <div className="mt-1 text-sm text-zinc-500">
                        {work.responsibleName || "Sin responsable definido"}
                      </div>
                    </div>
                    {criticalCount > 0 ? (
                      <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                        {criticalCount} crítica{criticalCount === 1 ? "" : "s"}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-zinc-50 p-3">
                      <div className="text-2xl font-semibold text-zinc-900">
                        {work.companies.length}
                      </div>
                      <div className="mt-1 text-xs text-zinc-500">terceros</div>
                    </div>
                    <div className="rounded-xl bg-zinc-50 p-3">
                      <div className="text-2xl font-semibold text-zinc-900">
                        {work.incidents.length}
                      </div>
                      <div className="mt-1 text-xs text-zinc-500">incidencias abiertas</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
