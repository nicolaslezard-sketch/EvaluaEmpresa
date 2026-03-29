export type CompanyActionCard = {
  title: string;
  description: string;
  tone: "neutral" | "ok" | "warning" | "danger";
};

export function getCompanyActionCard(params: {
  hasLatestFinalized: boolean;
  hasActiveDraft: boolean;
  reviewTone: "ok" | "warning" | "overdue" | "none";
  activeAlertsCount: number;
  worsenedChangesCount: number;
}): CompanyActionCard {
  if (!params.hasLatestFinalized && params.hasActiveDraft) {
    return {
      title: "Continuar evaluación en curso",
      description:
        "La empresa todavía no tiene una evaluación finalizada. Completar el borrador actual es la acción más importante para generar el primer score oficial y activar el monitoreo continuo.",
      tone: "warning",
    };
  }

  if (!params.hasLatestFinalized) {
    return {
      title: "Iniciar primera evaluación",
      description:
        "Todavía no existe un ciclo base para esta empresa. Conviene generar la primera evaluación para obtener score, categoría ejecutiva e historial.",
      tone: "neutral",
    };
  }

  if (params.reviewTone === "overdue") {
    return {
      title: "Nueva revisión mensual recomendada",
      description:
        "La última evaluación quedó fuera de la frecuencia esperada. Conviene abrir un nuevo ciclo ahora para mantener vigente el monitoreo y detectar cambios antes de que escalen.",
      tone: "warning",
    };
  }

  if (params.activeAlertsCount > 0) {
    return {
      title: "Revisar alertas activas",
      description:
        "Hay alertas persistidas en el último ciclo. La prioridad es validar si requieren seguimiento operativo inmediato.",
      tone: "danger",
    };
  }

  if (params.worsenedChangesCount > 0) {
    return {
      title: "Analizar deterioros del último ciclo",
      description:
        "Se detectaron campos que empeoraron respecto de la evaluación anterior. Conviene revisar el detalle del ciclo para entender impacto, contexto y próxima acción.",
      tone: "danger",
    };
  }

  return {
    title: "Monitoreo al día",
    description:
      "La empresa no presenta deterioros prioritarios ni alertas activas y su revisión sigue vigente. El siguiente paso es sostener la frecuencia mensual.",
    tone: "ok",
  };
}
