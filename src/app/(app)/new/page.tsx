import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function NewEntryPoint() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const companies = await prisma.company.findMany({
    where: { ownerId: session.user.id },
    select: { id: true },
  });

  // No tiene empresas → crear una
  if (companies.length === 0) {
    redirect("/companies/new");
  }

  // Tiene una sola → crear evaluación directo
  if (companies.length === 1) {
    redirect(`/app/companies/${companies[0].id}/evaluations/new`);
  }

  // Tiene varias → dashboard
  redirect("/dashboard");
}
