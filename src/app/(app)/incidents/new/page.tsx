import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import type { IncidentSeverity, IncidentType } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createIncident } from "@/lib/services/incidents";

const INCIDENT_TYPES: Array<{ value: IncidentType; label: string }> = [
  { value: "DELAY", label: "Demora" },
  { value: "QUALITY", label: "Calidad" },
  { value: "DELIVERY", label: "Entrega" },
  { value: "DOCUMENTATION", label: "Documentación" },
  { value: "SAFETY", label: "Seguridad" },
  { value: "COMMUNICATION", label: "Comunicación" },
  { value: "CONTRACTUAL", label: "Contractual" },
  { value: "OTHER", label: "Otro" },
];

const SEVERITIES: Array<{ value: IncidentSeverity; label: string }> = [
  { value: "MINOR", label: "Menor" },
  { value: "RELEVANT", label: "Relevante" },
  { value: "CRITICAL", label: "Crítica" },
];

async function createIncidentAction(companyId: string, formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const type = String(formData.get("type") ?? "") as IncidentType;
  const severity = String(formData.get("severity") ?? "") as IncidentSeverity;
  const occurredAtValue = String(formData.get("occurredAt") ?? "");

  const allowedTypes = INCIDENT_TYPES.map((item) => item.value);
  const allowedSeverities = SEVERITIES.map((item) => item.value);

  if (!allowedTypes.includes(type) || !allowedSeverities.includes(severity)) {
    return;
  }

  await createIncident({
    ownerId: session.user.id,
    companyId,
    workSiteId: String(formData.get("workSiteId") ?? "") || null,
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    type,
    severity,
    occurredAt: occurredAtValue
      ? new Date(`${occurredAtValue}T12:00:00`)
      : new Date(),
  });

  redirect("/incidents");
}

export default async function NewIncidentPage({
  searchParams,
}: {
  searchParams: Promise<{ companyId?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const { companyId } = await searchParams;

  if (!companyId) {
    const companies = await prisma.company.findMany({
      where: {
        ownerId: session.user.id,
        status: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
        trade: true,
        thirdPartyType: true,
      },
      orderBy: { name: "asc" },
    });

    return (
      <div className="space-y-8">
        <div>
          <Link
            href="/incidents"
            className="text-sm font-medium text-sky-800 hover:underline"
          >
            ← Volver a incidencias
          </Link>
          <p className="mt-5 text-xs font-medium uppercase tracking-[0.22em] text-sky-800">
            Nueva incidencia
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900">
            ¿Qué tercero tuvo el problema?
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
            Primero elegí el proveedor o contratista. Después vas a poder asociar
            la incidencia a una de sus obras.
          </p>
        </div>

        {companies.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-10 text-center">
            <h2 className="text-lg font-semibold text-zinc-900">
              Necesitás cargar un tercero primero
            </h2>
            <Link href="/companies/new" className="btn btn-primary mt-6">
              Nuevo tercero
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {companies.map((company) => (
              <Link
                key={company.id}
                href={`/incidents/new?companyId=${company.id}`}
                className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-sky-200 hover:shadow-md"
              >
                <div className="font-semibold text-zinc-900">{company.name}</div>
                <div className="mt-2 text-sm text-zinc-500">
                  {company.trade || "Sin rubro definido"}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  const company = await prisma.company.findFirst({
    where: {
      id: companyId,
      ownerId: session.user.id,
      status: "ACTIVE",
    },
    include: {
      workSites: {
        where: { active: true },
        include: {
          workSite: {
            select: {
              id: true,
              name: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!company) redirect("/incidents/new");

  const activeWorkSites = company.workSites.filter(
    (assignment) => assignment.workSite.status !== "FINISHED",
  );

  const today = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <Link
          href="/incidents/new"
          className="text-sm font-medium text-sky-800 hover:underline"
        >
          ← Cambiar tercero
        </Link>
        <p className="mt-5 text-xs font-medium uppercase tracking-[0.22em] text-sky-800">
          Nueva incidencia
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900">
          Registrar problema operativo
        </h1>
        <p className="mt-3 text-base leading-7 text-zinc-600">
          Tercero: <span className="font-medium text-zinc-900">{company.name}</span>
        </p>
      </div>

      <form
        action={createIncidentAction.bind(null, company.id)}
        className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Tipo de incidencia *
            </label>
            <select
              name="type"
              required
              defaultValue=""
              className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-900"
            >
              <option value="" disabled>
                Seleccionar
              </option>
              {INCIDENT_TYPES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Severidad *
            </label>
            <select
              name="severity"
              required
              defaultValue="RELEVANT"
              className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-900"
            >
              {SEVERITIES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Obra relacionada
          </label>
          <select
            name="workSiteId"
            defaultValue=""
            className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-900"
          >
            <option value="">Sin obra específica</option>
            {activeWorkSites.map((assignment) => (
              <option key={assignment.workSite.id} value={assignment.workSite.id}>
                {assignment.workSite.name}
              </option>
            ))}
          </select>
          {activeWorkSites.length === 0 ? (
            <p className="mt-2 text-xs text-zinc-500">
              Este tercero no está asociado actualmente a una obra activa.
            </p>
          ) : null}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Título *
          </label>
          <input
            name="title"
            required
            maxLength={120}
            className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-900"
            placeholder="Ej: Demora en entrega de hormigón"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Descripción *
          </label>
          <textarea
            name="description"
            required
            rows={6}
            maxLength={1200}
            className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-900"
            placeholder="Describí qué pasó, impacto y contexto relevante."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Fecha del hecho *
          </label>
          <input
            type="date"
            name="occurredAt"
            required
            defaultValue={today}
            className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-900 sm:max-w-xs"
          />
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button type="submit" className="btn btn-primary">
            Registrar incidencia
          </button>
          <Link href="/incidents" className="btn btn-secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
