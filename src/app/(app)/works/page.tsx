import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getWorkSites } from "@/lib/services/workSites";

function statusLabel(status: "PLANNED" | "ACTIVE" | "PAUSED" | "FINISHED") {
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

function statusClass(status: "PLANNED" | "ACTIVE" | "PAUSED" | "FINISHED") {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-100 text-emerald-700";
    case "PAUSED":
      return "bg-amber-100 text-amber-700";
    case "FINISHED":
      return "bg-zinc-100 text-zinc-600";
    default:
      return "bg-blue-100 text-blue-700";
  }
}

export default async function WorksPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const works = await getWorkSites(session.user.id);
  const activeWorks = works.filter((work) => work.status === "ACTIVE");
  const activeThirdParties = works.reduce(
    (total, work) => total + (work.status === "ACTIVE" ? work._count.companies : 0),
    0,
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-sky-800">
            Operación
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900">
            Obras
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
            Organizá proveedores y contratistas por obra para entender quién
            trabaja dónde y mantener el contexto operativo de cada tercero.
          </p>
        </div>

        <Link href="/works/new" className="btn btn-primary">
          Nueva obra
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-zinc-500">Obras activas</div>
          <div className="mt-2 text-3xl font-semibold text-zinc-900">
            {activeWorks.length}
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-zinc-500">Asignaciones activas</div>
          <div className="mt-2 text-3xl font-semibold text-zinc-900">
            {activeThirdParties}
          </div>
        </div>
      </div>

      {works.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-10 text-center">
          <h2 className="text-xl font-semibold text-zinc-900">
            Todavía no cargaste obras
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-600">
            Creá tu primera obra y después asociá los proveedores o contratistas
            que participan en ella.
          </p>
          <Link href="/works/new" className="btn btn-primary mt-6">
            Crear primera obra
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {works.map((work) => (
            <Link
              key={work.id}
              href={`/works/${work.id}`}
              className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-sky-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(
                      work.status,
                    )}`}
                  >
                    {statusLabel(work.status)}
                  </span>
                  <h2 className="mt-3 text-xl font-semibold text-zinc-900">
                    {work.name}
                  </h2>
                  {work.address ? (
                    <p className="mt-2 text-sm text-zinc-500">{work.address}</p>
                  ) : null}
                </div>
                <div className="rounded-2xl bg-zinc-50 px-4 py-3 text-right">
                  <div className="text-2xl font-semibold text-zinc-900">
                    {work._count.companies}
                  </div>
                  <div className="text-xs text-zinc-500">terceros activos</div>
                </div>
              </div>

              {work.responsibleName ? (
                <div className="mt-5 text-sm text-zinc-600">
                  Responsable:{" "}
                  <span className="font-medium text-zinc-900">
                    {work.responsibleName}
                  </span>
                </div>
              ) : null}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
