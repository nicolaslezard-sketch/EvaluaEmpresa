import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUserEntitlements } from "@/lib/access/getEntitlements";
import { prisma } from "@/lib/prisma";
import { UserMenu } from "@/components/app/UserMenu";

type MainHeaderProps = {
  mode: "marketing" | "app";
};

const marketingNavItems = [
  { href: "/#metodologia", label: "Metodología" },
  { href: "/informe-modelo", label: "Informe modelo" },
  { href: "/pricing", label: "Planes" },
  { href: "/#faq", label: "FAQ" },
];

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

export async function MainHeader({ mode }: MainHeaderProps) {
  const session = await getServerSession(authOptions);

  let userMenuProps:
    | {
        email?: string | null;
        name?: string | null;
        image?: string | null;
        planLabel?: string;
        planStatusLabel?: string;
      }
    | undefined;

  if (session?.user?.id) {
    const entitlements = await getUserEntitlements(session.user.id);

    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
      select: {
        status: true,
        isTrial: true,
        trialEndsAt: true,
        currentPeriodEnd: true,
      },
    });

    const isTrialActive =
      entitlements.plan === "PRO" &&
      subscription?.status === "ACTIVE" &&
      subscription?.isTrial === true &&
      !!subscription?.trialEndsAt &&
      subscription.trialEndsAt >= new Date();

    const trialEndsAtLabel = formatDate(subscription?.trialEndsAt);

    const planStatusLabel =
      isTrialActive && trialEndsAtLabel
        ? `Trial activo hasta ${trialEndsAtLabel}`
        : entitlements.plan === "FREE"
          ? "Plan base activo"
          : "Suscripción activa";

    userMenuProps = {
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
      planLabel: isTrialActive ? "Pro" : planLabel(entitlements.plan),
      planStatusLabel,
    };
  }

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3">
          {mode === "marketing" ? (
            <>
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-zinc-900 text-sm font-semibold text-white">
                EE
              </div>
              <div>
                <p className="text-sm font-semibold leading-none text-zinc-900">
                  EvaluaEmpresa
                </p>
                <p className="mt-1 text-[11px] leading-none text-zinc-500">
                  Evaluación estructurada de terceros
                </p>
              </div>
            </>
          ) : (
            <span className="font-semibold text-zinc-900">EvaluaEmpresa</span>
          )}
        </Link>

        {mode === "marketing" ? (
          <nav className="hidden items-center gap-8 lg:flex">
            {marketingNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-zinc-600 transition hover:text-zinc-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        ) : (
          <div />
        )}

        {session?.user?.id && userMenuProps ? (
          <div className="flex items-center gap-3">
            {mode === "marketing" ? (
              <Link href="/dashboard" className="btn btn-secondary">
                Monitoreo
              </Link>
            ) : null}

            <Link href="/companies/new" className="btn btn-primary">
              Nueva empresa
            </Link>

            <UserMenu {...userMenuProps} />
          </div>
        ) : mode === "marketing" ? (
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-zinc-600 transition hover:text-zinc-900 sm:inline-flex"
            >
              Ingresar
            </Link>

            <Link href="/login" className="btn btn-primary">
              Probar ahora
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn btn-primary">
              Ingresar
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
