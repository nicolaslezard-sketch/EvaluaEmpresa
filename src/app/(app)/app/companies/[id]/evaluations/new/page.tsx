import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewEvaluationPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/evaluations`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ companyId: params.id }),
    },
  );

  if (!res.ok) {
    // si plan no permite, mandalo al billing
    redirect("/app/billing");
  }

  const draft = await res.json();
  redirect(`/app/companies/${params.id}/evaluations/${draft.id}`);
}
