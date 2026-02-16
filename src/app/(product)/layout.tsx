import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserMenu } from "@/components/app/UserMenu";

function Shell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { email?: string | null; name?: string | null; image?: string | null };
}) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="border-b border-zinc-200 bg-white">
        <div className="container-page flex h-16 items-center justify-between">
          <Link href="/app/dashboard" className="font-semibold text-zinc-900">
            EvaluaEmpresa
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/app/new/pyme" className="btn btn-primary">
              Nueva evaluación
            </Link>
            <UserMenu email={user.email} name={user.name} image={user.image} />
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

  return (
    <Shell
      user={{
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      }}
    >
      {children}
    </Shell>
  );
}
