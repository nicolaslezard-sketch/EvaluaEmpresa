import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createCompany, getActiveCompanyUsage } from "@/lib/services/companies";

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

    redirect(`/companies/${company.id}/evaluations/new`);
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

function planLabel(plan: "FREE" | "PRO" | "BUSINESS") {
  switch (plan) {
    case "PRO":
      return "PRO";
    case "BUSINESS":
      return "BUSINESS";
    default:
      return "FREE";
  }
}

export default async function NewCompanyPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const usage = await getActiveCompanyUsage(session.user.id);
  const limitReached = usage.used >= usage.limit;

  return (
    <div className="max-w-2xl space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-sky-800">
            Primer paso
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900">
            Cargá tu primera empresa
          </h1>

          <p className="mt-4 text-base leading-7 text-zinc-600">
            Registrá un proveedor, cliente o contraparte para crear tu primera
            evaluación y empezar a seguir su evolución entre ciclos.
          </p>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-white px-5 py-4 shadow-sm">
          <div className="text-sm text-zinc-600">Uso del plan</div>
          <div className="mt-1 text-2xl font-semibold text-zinc-900">0/1</div>
          <div className="mt-1 text-sm text-zinc-500">
            Empresas activas · FREE
          </div>
        </div>
      </div>

      {limitReached ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
          Alcanzaste el límite de empresas activas de tu plan ({usage.used}/
          {usage.limit}). Para cargar una nueva empresa, necesitás actualizar el
          plan.
          <a href="/billing" className="ml-2 font-medium underline">
            Ver planes
          </a>
        </div>
      ) : null}

      <div className="rounded-3xl border border-sky-100 bg-sky-50/50 p-5">
        <p className="text-sm font-medium text-zinc-900">
          Completá los datos básicos de la empresa
        </p>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Después vas a poder cargar la evaluación, obtener el score general,
          ver la categoría ejecutiva y seguir cambios entre ciclos.
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
            className="mt-2 w-full rounded-lg border px-4 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-zinc-900"
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
            className="mt-2 w-full rounded-lg border px-4 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
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
            className="mt-2 w-full rounded-lg border px-4 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-zinc-900"
            placeholder="Ej: Construcción"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Tamaño de la empresa
          </label>
          <select
            name="size"
            className="mt-2 w-full rounded-lg border px-4 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
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
            className="mt-2 w-full rounded-lg border px-4 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-zinc-900"
            placeholder="Descripción general de la empresa..."
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={limitReached}
            className={`inline-flex rounded-lg px-5 py-2 text-sm font-medium ${
              limitReached
                ? "cursor-not-allowed bg-zinc-100 text-zinc-500"
                : "bg-zinc-900 text-white hover:bg-zinc-800"
            }`}
          >
            Crear empresa
          </button>
        </div>
      </form>
    </div>
  );
}
