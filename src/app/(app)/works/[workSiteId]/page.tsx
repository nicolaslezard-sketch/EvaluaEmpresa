import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { getActiveCompanies } from "@/lib/services/companies";
import {
  assignCompanyToWorkSite,
  getWorkSite,
} from "@/lib/services/workSites";

async function assignCompanyAction(workSiteId: string, formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const companyId = String(formData.get("companyId") ?? "");
  if (!companyId) return;

  await assignCompanyToWorkSite({
    ownerId: session.user.id,
    workSiteId,
    companyId,
    role: String(formData.get("role") ?? ""),
    trade: String(formData.get("trade") ?? ""),
  });

  revalidatePath(`/works/${workSiteId}`);
}

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

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ workSiteId: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const { workSiteId } = await params;
  const [work, companies] = await Promise.all([
    getWorkSite(session.user.id, workSiteId),
    getActiveCompanies(session.user.id),
  ]);

  if (!work) notFound();

  const assignedIds = new Set(work.companies.map((item) => item.companyId));
  const availableCompanies = companies.filter((company) => !assignedIds.has(company.id));

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link href="/works" className="text-sm font-medium text-sky-800 hover:underline">
            ← Volver a obras
          </Link>
          <div className="mt-5 text-sm font-medium text-sky-800">{statusLabel(work.status)}</div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-900">{work.name}</h1>
          {work.address ? <p className="mt-3 text-zinc-600">{work.address}</p> : null}
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
          <div className="text-sm text-zinc-500">Terceros activos</div>
          <div className="mt-1 text-3xl font-semibold text-zinc-900">{work.companies.length}</div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">Proveedores y contratistas</h2>
              <p className="mt-1 text-sm text-zinc-500">Terceros actualmente asociados a esta obra.</p>
            </div>
            <Link href="/companies/new" className="btn btn-secondary">Nuevo tercero</Link>
          </div>

          {work.companies.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-600">
              Todavía no hay terceros asociados a esta obra.
            </div>
          ) : (
            <div className="mt-6 divide-y divide-zinc-100">
              {work.companies.map((item) => (
                <Link
                  key={item.id}
                  href={`/companies/${item.company.id}`}
                  className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div>
                    <div className="font-medium text-zinc-900">{item.company.name}</div>
                    <div className="mt-1 text-sm text-zinc-500">
                      {item.trade || item.company.trade || item.role || "Sin rubro definido"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs uppercase tracking-wide text-zinc-400">Criticidad</div>
                    <div className="mt-1 text-sm font-medium text-zinc-700">{item.company.criticality}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-6">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">Asociar tercero existente</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Vinculá un proveedor o contratista ya cargado a esta obra.
            </p>

            {availableCompanies.length === 0 ? (
              <div className="mt-5 rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-600">
                No hay terceros disponibles para asociar.
              </div>
            ) : (
              <form action={assignCompanyAction.bind(null, work.id)} className="mt-5 space-y-4">
                <select
                  name="companyId"
                  required
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                >
                  <option value="">Seleccionar tercero</option>
                  {availableCompanies.map((company) => (
                    <option key={company.id} value={company.id}>{company.name}</option>
                  ))}
                </select>

                <input
                  name="role"
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                  placeholder="Rol, ej: Contratista principal"
                />

                <input
                  name="trade"
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-900"
                  placeholder="Rubro, ej: Hormigón"
                />

                <button type="submit" className="btn btn-primary w-full">Asociar a la obra</button>
              </form>
            )}
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6">
            <h2 className="text-sm font-semibold text-zinc-900">Datos de la obra</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500">Responsable</dt>
                <dd className="text-right font-medium text-zinc-800">{work.responsibleName || "Sin definir"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500">Inicio</dt>
                <dd className="text-right font-medium text-zinc-800">{work.startDate ? work.startDate.toLocaleDateString("es-AR") : "Sin definir"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500">Fin estimado</dt>
                <dd className="text-right font-medium text-zinc-800">{work.expectedEndDate ? work.expectedEndDate.toLocaleDateString("es-AR") : "Sin definir"}</dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </div>
  );
}
