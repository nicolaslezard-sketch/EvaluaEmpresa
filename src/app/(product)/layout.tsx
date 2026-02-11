import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

function Shell({ children }: { children: React.ReactNode }) {
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

  return <Shell>{children}</Shell>;
}
