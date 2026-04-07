import type { SubscriptionSource, SubscriptionStatus } from "@prisma/client";

export function formatSubscriptionSource(
  source?: SubscriptionSource | null,
): string {
  switch (source) {
    case "MP":
      return "Mercado Pago";
    case "LEMON":
      return "Lemon Squeezy";
    case "TRIAL":
      return "Trial";
    case "MANUAL":
      return "Manual";
    default:
      return "—";
  }
}

export function formatSubscriptionStatus(
  status?: SubscriptionStatus | null,
): string {
  switch (status) {
    case "ACTIVE":
      return "Activa";
    case "PAUSED":
      return "En pausa";
    case "CANCELLED":
      return "Cancelada";
    case "EXPIRED":
      return "Expirada";
    default:
      return "—";
  }
}
