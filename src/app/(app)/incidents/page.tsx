import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { IncidentStatus } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import {
  getIncidents,
  updateIncidentStatus,
} from "@/lib/services/incidents";

function typeLabel(type: string) {
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

function statusLabel(status: string) {
  switch (status) {
    case "FOLLOW_UP":
      return "En seguimiento";
    case "RESOLVED":
      return "Resuelta";
    default:
      return "Abierta";
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
      return "bg-zinc-100 text-zinc-600";
    default:
      return "bg-amber-100 text-amber-700";
  }
}

function statusClass(status: string) {
  switch (status) {
    case "FOLLOW_UP":
      return "bg-blue-100 text-blue-700";
    case "RESOLVED":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-red-50 text-red-700";
  }
}

async function updateStatusAction(
  incidentId: string,
  status: IncidentStatus,
) {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  await updateIncidentStatus({
    ownerId: session.user.id,
    incidentId,
    status,
  });

  revalidatePath("/incidents");
}

export default async function IncidentsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const incidents = await getIncidents(session.user.id);
  const openIncidents = incidents.filter((incident) => incident.status !== "RESOLVED");
  const criticalOpen = openIncidents.filter(
    (incident) => incident.severity === "CRITICAL",
  );
  const resolved = incidents.filter((incident) => incident.status === "RESOLVED");

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-sky-800">
            Seguimiento operativo
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900">
            Incidencias
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
            Registrá demoras, problemas de calidad, documentación, seguridad e
            incumplimientos para que el historial del tercero no dependa de la memoria.
          </p>
        </div>

        <Link href="/incidents/new" className="btn btn-primary">
          Nueva incidencia
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-zinc-500">Abiertas / seguimiento</div>
          <div className="mt-2 text-3xl font-semibold text-zinc-900">
            {openIncidents.length}
          </div>
        </div>
        <div className="rounded-2xl border border-red-100 bg-red-50/50 p-5">
          <div className="text-sm text-red-700">Críticas abiertas</div>
          <div className="mt-2 text-3xl font-semibold text-red-900">
            {criticalOpen.length}
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-zinc-500">Resueltas</div>
          <div className="mt-2 text-3xl font-semibold text-zinc-900">
            {resolved.length}
          </div>
        </div>
      </div>

      {incidents.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-zinc-900">
            Todavía no registraste incidencias
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-zinc-600">
            Cuando un proveedor o contratista tenga una demora, incumplimiento o
            problema operativo, registralo acá para conservar el antecedente.
          </p>
          <Link href="/incidents/new" className="btn btn-primary mt-6">
            Registrar primera incidencia
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {incidents.map((incident) => (
            <article
              key={incident.id}
              className={`rounded-3xl border bg-white p-6 shadow-sm ${
                incident.status !== "RESOLVED" && incident.severity === "CRITICAL"
                  ? "border-red-200"
                  : "border-zinc-200"
              }`}
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${severityClass(
                        incident.severity,
                      )}`}
                    >
                      {severityLabel(incident.severity)}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(
                        incident.status,
                      )}`}
                    >
                      {statusLabel(incident.status)}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
                      {typeLabel(incident.type)}
                    </span>
                  </div>

                  <h2 className="mt-4 text-xl font-semibold text-zinc-900">
                    {incident.title}
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
                    {incident.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-500">
                    <Link
                      href={`/third-parties/${incident.company.id}`}
                      className="font-medium text-zinc-800 hover:underline"
                    >
                      {incident.company.name}
                    </Link>
                    {incident.workSite ? (
                      <Link
                        href={`/works/${incident.workSite.id}`}
                        className="hover:underline"
                      >
                        {incident.workSite.name}
                      </Link>
                    ) : (
                      <span>Sin obra asociada</span>
                    )}
                    <span>
                      {new Date(incident.occurredAt).toLocaleDateString("es-AR")}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 lg:max-w-[260px] lg:justify-end">
                  {incident.status !== "OPEN" ? (
                    <form action={updateStatusAction.bind(null, incident.id, "OPEN")}>
                      <button type="submit" className="btn btn-secondary">
                        Marcar abierta
                      </button>
                    </form>
                  ) : null}

                  {incident.status !== "FOLLOW_UP" ? (
                    <form
                      action={updateStatusAction.bind(
                        null,
                        incident.id,
                        "FOLLOW_UP",
                      )}
                    >
                      <button type="submit" className="btn btn-secondary">
                        Seguimiento
                      </button>
                    </form>
                  ) : null}

                  {incident.status !== "RESOLVED" ? (
                    <form
                      action={updateStatusAction.bind(
                        null,
                        incident.id,
                        "RESOLVED",
                      )}
                    >
                      <button type="submit" className="btn btn-primary">
                        Resolver
                      </button>
                    </form>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
