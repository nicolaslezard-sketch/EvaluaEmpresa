export function formatDateAR(value: string | Date | null | undefined): string {
  if (!value) return "—";

  if (typeof value === "string") {
    const trimmed = value.trim();

    // ya viene en dd/mm/yyyy
    const arMatch = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (arMatch) {
      return trimmed;
    }

    // ISO o fecha parseable real
    const isoDate = new Date(trimmed);
    if (!Number.isNaN(isoDate.getTime())) {
      return new Intl.DateTimeFormat("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "UTC",
      }).format(isoDate);
    }

    return "—";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
