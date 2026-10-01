import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import {
  createWorkSite,
  WORK_SITE_DESCRIPTION_MAX_LENGTH,
} from "@/lib/services/workSites";

async function createWorkSiteAction(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const parseDate = (value: FormDataEntryValue | null) => {
    const raw = String(value ?? "").trim();
    return raw ? new Date(`${raw}T12:00:00`) : null;
  };

  const work = await createWorkSite({
    ownerId: session.user.id,
    name: String(formData.get("name") ?? ""),
    address: String(formData.get("address") ?? ""),
    responsibleName: String(formData.get("responsibleName") ?? ""),
    startDate: parseDate(formData.get("startDate")),
    expectedEndDate: parseDate(formData.get("expectedEndDate")),
    description: String(formData.get("description") ?? ""),
  });

  redirect(`/works/${work.id}`);
}

export default async function NewWorkPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-sky-800">
          Nueva obra
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900">
          Cargá una obra
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-600">
          Usala como contexto operativo para asociar proveedores y contratistas.
        </p>
      </div>

      <form action={createWorkSiteAction} className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <label className="block text-sm font-medium text-zinc-700">Nombre de la obra *</label>
          <input
            name="name"
            required
            className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-900"
            placeholder="Ej: Edificio Palermo 1240"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">Dirección</label>
          <input
            name="address"
            className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-900"
            placeholder="Ej: Av. Córdoba 1240, CABA"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">Responsable</label>
          <input
            name="responsibleName"
            className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-900"
            placeholder="Ej: Juan Pérez"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-zinc-700">Inicio</label>
            <input
              name="startDate"
              type="date"
              className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">Fin estimado</label>
            <input
              name="expectedEndDate"
              type="date"
              className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">Descripción</label>
          <textarea
            name="description"
            rows={4}
            maxLength={WORK_SITE_DESCRIPTION_MAX_LENGTH}
            className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-900"
            placeholder="Contexto breve de la obra."
          />
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button type="submit" className="btn btn-primary">Crear obra</button>
          <a href="/works" className="btn btn-secondary">Cancelar</a>
        </div>
      </form>
    </div>
  );
}
