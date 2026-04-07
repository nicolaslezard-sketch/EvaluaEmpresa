import { getServerSession } from "next-auth/next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserEntitlements } from "@/lib/access/getEntitlements";
import { getSubscriptionPresentation } from "@/lib/billing/getSubscriptionPresentation";
import { AccountActions } from "@/components/app/AccountActions";
import {
  formatSubscriptionSource,
  formatSubscriptionStatus,
} from "@/lib/billing/subscriptionLabels";

function formatDate(date?: Date | null) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function initials(nameOrEmail?: string | null) {
  const base = (nameOrEmail ?? "U").trim();
  if (!base) return "U";
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return base.slice(0, 2).toUpperCase();
}

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const entitlements = await getUserEntitlements(session.user.id);

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
    select: {
      plan: true,
      status: true,
      source: true,
      isTrial: true,
      trialStartedAt: true,
      trialEndsAt: true,
      currentPeriodStart: true,
      currentPeriodEnd: true,
    },
  });

  const subscriptionPresentation = getSubscriptionPresentation({
    plan: entitlements.plan,
    subscription: subscription
      ? {
          status: subscription.status,
          isTrial: subscription.isTrial,
          trialEndsAt: subscription.trialEndsAt,
          currentPeriodEnd: subscription.currentPeriodEnd,
        }
      : null,
  });

  const now = new Date();

  const canManageSubscription =
    !!subscription &&
    subscription.status === "ACTIVE" &&
    subscription.isTrial === false &&
    (subscription.plan === "PRO" || subscription.plan === "BUSINESS");

  const canReactivateSubscription =
    !!subscription &&
    subscription.status === "CANCELLED" &&
    subscription.isTrial === false &&
    !!subscription.currentPeriodEnd &&
    subscription.currentPeriodEnd >= now &&
    (subscription.plan === "PRO" || subscription.plan === "BUSINESS");

  const reactivationPlan =
    subscription?.plan === "PRO" || subscription?.plan === "BUSINESS"
      ? subscription.plan
      : null;

  const canDeleteAccount =
    !subscription ||
    subscription.plan === "FREE" ||
    subscription.isTrial === true ||
    subscription.status === "EXPIRED" ||
    (subscription.status === "CANCELLED" &&
      (!subscription.currentPeriodEnd || subscription.currentPeriodEnd < now));

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-sky-700">
          Cuenta
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900">
          Gestión de cuenta
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
          Revisá tu perfil, el estado actual del plan y las acciones disponibles
          para administrar tu acceso.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">Perfil</h2>

            <div className="mt-6 flex items-center gap-4">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? session.user.email ?? "Usuario"}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="grid h-16 w-16 place-items-center rounded-full bg-zinc-900 text-lg font-semibold text-white">
                  {initials(session.user.name ?? session.user.email)}
                </div>
              )}

              <div>
                <p className="text-xl font-semibold text-zinc-900">
                  {session.user.name ?? "Usuario"}
                </p>
                <p className="mt-1 text-sm text-zinc-600">
                  {session.user.email ?? "Sin email"}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">
                  Plan y facturación
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Revisá el estado actual de tu acceso, el período vigente y el
                  proveedor asociado a tu suscripción.
                </p>
              </div>

              <Link href="/billing" className="btn btn-secondary">
                Ver facturación
              </Link>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-sky-100 bg-sky-50 p-5">
                <div className="text-xs font-medium uppercase tracking-[0.16em] text-sky-800">
                  Plan actual
                </div>
                <div className="mt-2 text-2xl font-semibold text-zinc-900">
                  {subscriptionPresentation.usagePlanLabel}
                </div>
                <div className="mt-2 text-sm text-zinc-600">
                  {subscriptionPresentation.planStatusLabel}
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                <div className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-600">
                  Estado de la suscripción
                </div>
                <dl className="mt-3 space-y-2 text-sm text-zinc-700">
                  <div className="flex items-center justify-between gap-4">
                    <dt>Proveedor</dt>
                    <dd className="font-medium text-zinc-900">
                      {formatSubscriptionSource(subscription?.source)}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <dt>Estado</dt>
                    <dd className="font-medium text-zinc-900">
                      {formatSubscriptionStatus(subscription?.status)}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <dt>Inicio del período</dt>
                    <dd className="font-medium text-zinc-900">
                      {formatDate(subscription?.currentPeriodStart)}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <dt>Fin del período</dt>
                    <dd className="font-medium text-zinc-900">
                      {formatDate(subscription?.currentPeriodEnd)}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <dt>Trial histórico</dt>
                    <dd className="text-right font-medium text-zinc-900">
                      {subscription?.trialStartedAt || subscription?.trialEndsAt
                        ? `${formatDate(subscription?.trialStartedAt)} → ${formatDate(subscription?.trialEndsAt)}`
                        : "—"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">
              Acciones de cuenta
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Desde acá podés administrar tu sesión, revisar tu estado actual y
              cancelar la renovación de tu suscripción cuando corresponda.
            </p>

            <div className="mt-6">
              <AccountActions
                canManageSubscription={canManageSubscription}
                canReactivateSubscription={canReactivateSubscription}
                canDeleteAccount={canDeleteAccount}
                reactivationPlan={reactivationPlan}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
