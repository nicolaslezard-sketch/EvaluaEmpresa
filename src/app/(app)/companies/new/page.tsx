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
      <form
        action={createCompanyAction}
        className="space-y-6 rounded-2xl border bg-white p-8 shadow-sm"
      >
        {/* ... resto igual ... */}
      </form>
    </div>
  );
}
