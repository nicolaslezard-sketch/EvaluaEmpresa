import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createCompany, getActiveCompanyUsage } from "@/lib/services/companies";
import { getUserEntitlements } from "@/lib/access/getEntitlements";
import { prisma } from "@/lib/prisma";

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

function planLabel(plan: "FREE" | "PRO" | "BUSINESS") {
  switch (plan) {
    case "PRO":
      return "Pro";
    case "BUSINESS":
      return "Business";
    default:
      return "Free";
  }
}

function formatTrialDate(date?: Date | null) {
  if (!date) return null;

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

/* =========================
   PAGE
========================= */

export default async function NewCompanyPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const ent = await getUserEntitlements(session.user.id);
  const usage = await getActiveCompanyUsage(session.user.id);

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
    select: {
      isTrial: true,
      trialEndsAt: true,
    },
  });

  const isTrialActive =
    ent.plan === "PRO" &&
    subscription?.isTrial === true &&
    subscription?.trialEndsAt &&
    subscription.trialEndsAt >= new Date();

  const trialEndsAtLabel = formatTrialDate(subscription?.trialEndsAt);
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
          <div className="mt-1 text-2xl font-semibold text-zinc-900">
            {usage.used}/{ent.maxCompanies}
          </div>
          <div className="mt-1 text-sm text-zinc-500">Empresas activas</div>
          <div className="mt-3 text-sm font-medium text-zinc-900">
            {planLabel(ent.plan)}
            {isTrialActive ? " · Trial" : ""}
          </div>
          {isTrialActive && trialEndsAtLabel ? (
            <div className="mt-1 text-xs leading-5 text-zinc-500">
              Activo hasta {trialEndsAtLabel}
            </div>
          ) : null}
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
            placeholder="Ej: Construcción, logística, software..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Tamaño
          </label>
          <select
            name="size"
            className="mt-2 w-full rounded-lg border px-4 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
          >
            <option value="">Seleccionar</option>
            <option value="MICRO">Micro</option>
            <option value="PEQUENA">Pequeña</option>
            <option value="MEDIANA">Mediana</option>
            <option value="GRANDE">Grande</option>
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
            placeholder="Contexto breve para identificar mejor a la empresa."
          />
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button type="submit" className="btn btn-primary">
            Crear empresa
          </button>
          <a href="/dashboard" className="btn btn-secondary">
            Volver
          </a>
        </div>
      </form>
    </div>
  );
}
