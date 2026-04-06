import type { SubscriptionPlan, SubscriptionStatus } from "@prisma/client";

type SubscriptionPresentationInput = {
  plan: SubscriptionPlan;
  subscription?: {
    status: SubscriptionStatus;
    isTrial: boolean;
    trialEndsAt: Date | null;
    currentPeriodEnd: Date | null;
  } | null;
};

export type SubscriptionPresentation = {
  planLabel: string;
  planStatusLabel: string;
  usagePlanLabel: string;
  usagePlanSubLabel: string | null;
  isTrialActive: boolean;
  trialEndsAtLabel: string | null;
};

function formatDate(date?: Date | null) {
  if (!date) return null;

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function basePlanLabel(plan: SubscriptionPlan) {
  switch (plan) {
    case "PRO":
      return "Pro";
    case "BUSINESS":
      return "Business";
    case "FREE":
    default:
      return "Free";
  }
}

export function getSubscriptionPresentation({
  plan,
  subscription,
}: SubscriptionPresentationInput): SubscriptionPresentation {
  const now = new Date();

  const isTrialActive =
    plan === "PRO" &&
    subscription?.status === "ACTIVE" &&
    subscription?.isTrial === true &&
    !!subscription.trialEndsAt &&
    subscription.trialEndsAt >= now;

  const trialEndsAtLabel = formatDate(subscription?.trialEndsAt);

  if (isTrialActive) {
    return {
      planLabel: "Pro",
      planStatusLabel: trialEndsAtLabel
        ? `Trial activo hasta ${trialEndsAtLabel}`
        : "Trial activo",
      usagePlanLabel: "Pro · Trial",
      usagePlanSubLabel: trialEndsAtLabel
        ? `Activo hasta ${trialEndsAtLabel}`
        : null,
      isTrialActive: true,
      trialEndsAtLabel,
    };
  }

  if (plan === "FREE") {
    return {
      planLabel: "Free",
      planStatusLabel: "Plan base activo",
      usagePlanLabel: "Free",
      usagePlanSubLabel: null,
      isTrialActive: false,
      trialEndsAtLabel: null,
    };
  }

  return {
    planLabel: basePlanLabel(plan),
    planStatusLabel: "Suscripción activa",
    usagePlanLabel: basePlanLabel(plan),
    usagePlanSubLabel: null,
    isTrialActive: false,
    trialEndsAtLabel: null,
  };
}
