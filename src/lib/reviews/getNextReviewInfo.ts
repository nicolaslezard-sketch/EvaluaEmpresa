export type NextReviewInfo = {
  suggestedDate: Date | null;
  suggestedDateLabel: string;
  statusLabel: string;
  helperText: string;
  tone: "neutral" | "ok" | "soon" | "overdue";
};

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function startOfUtcDay(date: Date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function daysBetween(from: Date, to: Date) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = startOfUtcDay(to).getTime() - startOfUtcDay(from).getTime();
  return Math.floor(diff / msPerDay);
}

function formatDateAR(date: Date) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function getNextReviewInfo(
  latestCreatedAt?: Date | null,
): NextReviewInfo {
  if (!latestCreatedAt) {
    return {
      suggestedDate: null,
      suggestedDateLabel: "Sin ciclo base",
      statusLabel: "Primera evaluación pendiente",
      helperText:
        "Todavía no existe una evaluación finalizada para calcular una próxima revisión sugerida.",
      tone: "neutral",
    };
  }

  const today = new Date();
  const suggestedDate = addDays(new Date(latestCreatedAt), 30);
  const suggestedDateLabel = formatDateAR(suggestedDate);
  const diffDays = daysBetween(today, suggestedDate);

  if (diffDays < 0) {
    return {
      suggestedDate,
      suggestedDateLabel,
      statusLabel: `Atrasada por ${Math.abs(diffDays)} día${
        Math.abs(diffDays) === 1 ? "" : "s"
      }`,
      helperText:
        "La revisión sugerida ya venció. Conviene abrir un nuevo ciclo cuanto antes.",
      tone: "overdue",
    };
  }

  if (diffDays <= 7) {
    return {
      suggestedDate,
      suggestedDateLabel,
      statusLabel: `Revisar en ${diffDays} día${diffDays === 1 ? "" : "s"}`,
      helperText:
        "La próxima revisión está próxima. Conviene prepararla para sostener la frecuencia mensual.",
      tone: "soon",
    };
  }

  return {
    suggestedDate,
    suggestedDateLabel,
    statusLabel: "Al día",
    helperText: "La empresa sigue dentro de la frecuencia mensual esperada.",
    tone: "ok",
  };
}
