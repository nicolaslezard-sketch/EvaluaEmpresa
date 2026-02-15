import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { UserMenu } from "@/components/app/UserMenu";

function PlanBadge({ tier }: { tier: "FREE" | "PYME" | "EMPRESA" }) {
  if (tier === "EMPRESA") {
    return (
      <span className="inline-flex items-center rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white">
        EMPRESA
      </span>
    );
  }

  if (tier === "PYME") {
    return (
      <span className="inline-flex items-center rounded-full bg-zinc-700 px-3 py-1 text-xs font-semibold text-white">
        PYME
      </span>
    );
  }

  return (
    <Link href="/app/upgrade" className="btn btn-secondary">
      Ver Planes
    </Link>
  );
}

function Shell({
  children,
  tier,
  user,
}: {
  children: React.ReactNode;
  tier: "FREE" | "PYME" | "EMPRESA";
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
            <PlanBadge tier={tier} />
            <Link href="/app/new" className="btn btn-primary">
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

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
    select: { tier: true, status: true },
  });

  let tier: "FREE" | "PYME" | "EMPRESA" = "FREE";
  if (subscription?.status === "AUTHORIZED") tier = subscription.tier;

  return (
    <Shell
      tier={tier}
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
