import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createCompany } from "@/lib/services/companies";

/* =========================
   SERVER ACTION
========================= */

async function createCompanyAction(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const name = formData.get("name") as string;
  const relationType = formData.get("relationType") as string;
  const sector = formData.get("sector") as string | null;
  const size = formData.get("size") as string | null;
  const description = formData.get("description") as string | null;

  if (!name || !relationType) {
    throw new Error("Campos obligatorios faltantes.");
  }

  try {
    const company = await createCompany({
      ownerId: session.user.id,
      name,
      relationType,
      sector,
      size,
      description,
    });

    redirect(`/companies/${company.id}`);
  } catch (err) {
    if (err instanceof Error && err.message === "PLAN_LIMIT_COMPANIES") {
      redirect("/billing");
    }
    throw err;
  }
}

/* =========================
   PAGE
========================= */

export default async function NewCompanyPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Nueva empresa</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Registrá una empresa para comenzar a evaluarla bajo la metodología
          E-Score™.
        </p>
      </div>

      <form
        action={createCompanyAction}
        className="space-y-6 rounded-2xl border bg-white p-8 shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Nombre de la empresa *
          </label>
          <input
            name="name"
            required
            className="mt-2 w-full rounded-lg border px-4 py-2 text-sm outline-none focus:border-zinc-900"
            placeholder="Ej: Constructora Delta SA"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Tipo de relación *
          </label>
          <select
            name="relationType"
            required
            className="mt-2 w-full rounded-lg border px-4 py-2 text-sm outline-none focus:border-zinc-900"
          >
            <option value="">Seleccionar</option>
            <option value="CLIENTE">Cliente</option>
            <option value="PROVEEDOR">Proveedor</option>
            <option value="SOCIO">Socio</option>
            <option value="OBJETIVO_ADQUISICION">
              Objetivo de adquisición
            </option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Sector
          </label>
          <input
            name="sector"
            className="mt-2 w-full rounded-lg border px-4 py-2 text-sm outline-none focus:border-zinc-900"
            placeholder="Ej: Construcción"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Tamaño de la empresa
          </label>
          <select
            name="size"
            className="mt-2 w-full rounded-lg border px-4 py-2 text-sm outline-none focus:border-zinc-900"
          >
            <option value="">Seleccionar</option>
            <option value="micro">Micro</option>
            <option value="pyme">PyME</option>
            <option value="mediana">Mediana</option>
            <option value="grande">Grande</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Descripción
          </label>
          <textarea
            name="description"
            rows={4}
            className="mt-2 w-full rounded-lg border px-4 py-2 text-sm outline-none focus:border-zinc-900"
            placeholder="Descripción general de la empresa..."
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="inline-flex rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Crear empresa
          </button>
        </div>
      </form>
    </div>
  );
}
