export function getReviewStatus(latestDate?: Date | null) {
  if (!latestDate) {
    return {
      label: "Sin evaluaciones",
      className: "bg-zinc-100 text-zinc-700",
      tone: "none" as const,
    };
  }

  const now = Date.now();
  const diffDays = Math.floor(
    (now - new Date(latestDate).getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays >= 46) {
    return {
      label: "Vencida",
      className: "bg-red-100 text-red-700",
      tone: "overdue" as const,
    };
  }

  if (diffDays >= 31) {
    return {
      label: "Revisar pronto",
      className: "bg-amber-100 text-amber-700",
      tone: "warning" as const,
    };
  }

  return {
    label: "Actualizada",
    className: "bg-emerald-100 text-emerald-700",
    tone: "ok" as const,
  };
}
