import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

function PlanBadge({ plan }: { plan: "free" | "pro" }) {
  if (plan === "pro") {
    return (
      <span className="inline-flex items-center rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white">
        PRO
      </span>
    );
  }

  return (
    <Link
      href="/app/upgrade"
      className="btn btn-secondary"
      title="Desbloquear seguimiento histórico y dashboard extendido"
    >
      Ver Plan PRO
    </Link>
  );
}

function Shell({
  children,
  plan,
}: {
  children: React.ReactNode;
  plan: "free" | "pro";
}) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="border-b border-zinc-200 bg-white">
        <div className="container-page flex h-16 items-center justify-between">
          <Link
            href="/app/dashboard"
            className="font-semibold tracking-tight text-zinc-900"
          >
            EvaluaEmpresa <span className="text-zinc-400">•</span>{" "}
            <span className="text-zinc-700">E-Score™</span>
          </Link>

          <div className="flex items-center gap-3">
            <PlanBadge plan={plan} />
            <Link href="/app/new" className="btn btn-primary">
              Nueva evaluación
            </Link>
          </div>
        </div>
      </div>

      <div className="container-page py-10">{children}</div>
    </div>
  );
}

export default async function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  return <Shell plan={session.user.plan}>{children}</Shell>;
}
