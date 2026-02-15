// src/lib/entitlements/resolveEntitlement.ts

import { prisma } from "@/lib/prisma";
import { EvaluationTier } from "@prisma/client";

type EntitlementResult = {
  canViewFull: boolean;
  canDownloadPdf: boolean;
  source: "FREE" | "REPORT_UNLOCK" | "SUBSCRIPTION";
};

export async function resolveEntitlement({
  userId,
  reportId,
  reportTier,
}: {
  userId: string | null | undefined;
  reportId: string;
  reportTier: EvaluationTier;
}): Promise<EntitlementResult> {
  if (!userId) {
    return {
      canViewFull: false,
      canDownloadPdf: false,
      source: "FREE",
    };
  }

  // 1️⃣ Verificar suscripción activa del tier correcto
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (
    subscription &&
    subscription.status === "AUTHORIZED" &&
    subscription.tier === reportTier
  ) {
    return {
      canViewFull: true,
      canDownloadPdf: true,
      source: "SUBSCRIPTION",
    };
  }

  // 2️⃣ Verificar unlock individual
  const unlock = await prisma.reportUnlock.findUnique({
    where: {
      userId_reportId: {
        userId,
        reportId,
      },
    },
  });

  if (unlock) {
    return {
      canViewFull: true,
      canDownloadPdf: true,
      source: "REPORT_UNLOCK",
    };
  }

  // 3️⃣ Default FREE
  return {
    canViewFull: false,
    canDownloadPdf: false,
    source: "FREE",
  };
}
