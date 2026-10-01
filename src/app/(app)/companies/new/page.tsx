import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  getActiveCompanyUsage,
  createCompany,
  COMPANY_DESCRIPTION_MAX_LENGTH,
} from "@/lib/services/companies";
import { getUserEntitlements } from "@/lib/access/getEntitlements";
import { prisma } from "@/lib/prisma";
import { getSubscriptionPresentation } from "@/lib/billing/getSubscriptionPresentation";
import {
  CreateCompanyForm,
  type CreateCompanyFormState,
} from "@/components/app/CreateCompanyForm";
import type { ThirdPartyType } from "@prisma/client";

async function createCompanyAction(
  _prevState: CreateCompanyFormState,
  formData: FormData,
): Promise<CreateCompanyFormState> {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const name = String(formData.get("name") ?? "");
  const thirdPartyType = String(
    formData.get("thirdPartyType") ?? "",
  ) as ThirdPartyType;
  const trade = String(formData.get("trade") ?? "");
  const taxId = String(formData.get("taxId") ?? "");
  const description = String(formData.get("description") ?? "");

  if (
    !["SUPPLIER", "CONTRACTOR", "SUBCONTRACTOR", "OTHER"].includes(
      thirdPartyType,
    )
  ) {
    return {
      formError: null,
      fieldErrors: {
        thirdPartyType: "Seleccioná un tipo de tercero.",
      },
    };
  }

  let companyId: string;

  try {
    const company = await createCompany({
      ownerId: session.user.id,
      name,
      thirdPartyType,
      trade,
      taxId,
      description,
    });

    companyId = company.id;
  } catch (err) {
    if (!(err instanceof Error)) {
      return {
        formError: "Ocurrió un error inesperado al crear el tercero.",
        fieldErrors: {},
      };
    }

    switch (err.message) {
      case "INVALID_COMPANY_NAME":
        return {
          formError: null,
          fieldErrors: {
            name: "Ingresá un nombre válido.",
          },
        };

      case "INVALID_RELATION_TYPE":
        return {
          formError: null,
          fieldErrors: {
            thirdPartyType: "Seleccioná un tipo de tercero.",
          },
        };

      case "COMPANY_DESCRIPTION_TOO_LONG":
        return {
          formError: null,
          fieldErrors: {
            description: `La descripción no puede superar ${COMPANY_DESCRIPTION_MAX_LENGTH} caracteres.`,
          },
        };

      case "PLAN_LIMIT_COMPANIES":
        return {
          formError:
            "Alcanzaste el límite de terceros activos de tu plan. Para crear uno nuevo, necesitás actualizarlo o liberar un tercero.",
          fieldErrors: {},
        };

      case "COMPANY_NAME_ALREADY_EXISTS":
        return {
          formError:
            "Ya tenés un tercero con ese nombre. Revisá mayúsculas, minúsculas y espacios: para el sistema ya existe.",
          fieldErrors: {
            name: "Ese nombre ya está en uso dentro de tu cuenta.",
          },
        };

      case "COMPANY_WRITE_CONFLICT":
        return {
          formError:
            "Se detectó un conflicto al crear el tercero. Probá nuevamente.",
          fieldErrors: {},
        };

      default:
        return {
          formError: "No se pudo crear el tercero.",
          fieldErrors: {},
        };
    }
  }

  redirect(`/third-parties/${companyId}`);
}

export default async function NewCompanyPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const ent = await getUserEntitlements(session.user.id);
  const usage = await getActiveCompanyUsage(session.user.id);

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
    select: {
      status: true,
      isTrial: true,
      trialEndsAt: true,
      currentPeriodEnd: true,
    },
  });

  const subscriptionPresentation = getSubscriptionPresentation({
    plan: ent.plan,
    subscription,
  });

  const limitReached = usage.used >= usage.limit;

  return (
    <div className="max-w-2xl space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-sky-800">
            Proveedores y contratistas
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900">
            Cargá un tercero
          </h1>

          <p className="mt-4 text-base leading-7 text-zinc-600">
            Registrá un proveedor, contratista o subcontratista para asociarlo a
            obras y seguir su desempeño.
          </p>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-white px-5 py-4 shadow-sm">
          <div className="text-sm text-zinc-600">Uso del plan</div>
          <div className="mt-1 text-2xl font-semibold text-zinc-900">
            {usage.used}/{ent.maxCompanies}
          </div>
          <div className="mt-1 text-sm text-zinc-500">Terceros activos</div>
          <div className="mt-3 text-sm font-medium text-zinc-900">
            {subscriptionPresentation.usagePlanLabel}
          </div>
          {subscriptionPresentation.usagePlanSubLabel ? (
            <div className="mt-1 text-xs leading-5 text-zinc-500">
              {subscriptionPresentation.usagePlanSubLabel}
            </div>
          ) : null}
        </div>
      </div>

      {limitReached ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
          Alcanzaste el límite de terceros activos de tu plan ({usage.used}/
          {usage.limit}). Para cargar uno nuevo, necesitás actualizar el plan.
          <a href="/billing" className="ml-2 font-medium underline">
            Ver planes
          </a>
        </div>
      ) : null}

      <div className="rounded-3xl border border-sky-100 bg-sky-50/50 p-5">
        <p className="text-sm font-medium text-zinc-900">
          Completá los datos básicos del tercero
        </p>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Después vas a poder asociarlo a una o más obras y mantener sus
          evaluaciones e histórico.
        </p>
      </div>

      <CreateCompanyForm
        action={createCompanyAction}
        descriptionMaxLength={COMPANY_DESCRIPTION_MAX_LENGTH}
        disabled={limitReached}
      />
    </div>
  );
}
