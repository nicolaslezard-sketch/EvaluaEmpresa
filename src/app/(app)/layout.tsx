import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUserEntitlements } from "@/lib/access/getEntitlements";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserMenu } from "@/components/app/UserMenu";

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

function formatDate(date?: Date | null) {
  if (!date) return null;

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function Shell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: {
    email?: string | null;
    name?: string | null;
    image?: string | null;
    planLabel?: string;
    planStatusLabel?: string;
  };
}) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="border-b border-zinc-200 bg-white">
        <div className="container-page flex h-16 items-center justify-between">
          {/* LOGO → HOME */}
          <Link href="/" className="font-semibold text-zinc-900">
            EvaluaEmpresa
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/companies/new" className="btn btn-primary">
              Nueva empresa
            </Link>
            <UserMenu
              email={user.email}
              name={user.name}
              image={user.image}
              planLabel={user.planLabel}
              planStatusLabel={user.planStatusLabel}
            />{" "}
          </div>
        </div>
      </div>

      <div className="container-page py-10">{children}</div>
    </div>
  );
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) redirect("/login");

  const entitlements = await getUserEntitlements(session.user.id);

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
    select: {
      isTrial: true,
      trialEndsAt: true,
    },
  });

  const isTrialActive =
    entitlements.plan === "PRO" &&
    subscription?.isTrial === true &&
    subscription?.trialEndsAt &&
    subscription.trialEndsAt >= new Date();

  const trialEndsAtLabel = formatDate(subscription?.trialEndsAt);

  const planStatusLabel =
    isTrialActive && trialEndsAtLabel
      ? `Trial activo hasta ${trialEndsAtLabel}`
      : entitlements.plan === "FREE"
        ? "Plan base activo"
        : "Suscripción activa";

  return (
    <Shell
      user={{
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        planLabel: planLabel(entitlements.plan),
        planStatusLabel,
      }}
    >
      {children}
    </Shell>
  );
}
