import type { EvaluationTier } from "./schema";

/**
 * Límites de texto visibles en UI.
 * Deben estar alineados con los mínimos/máximos reales del schema por tier
 * para evitar fricción y falsos errores.
 */
export const TEXT_LIMITS: Record<
  EvaluationTier,
  {
    perfil: {
      descripcionNegocio: { min: number; max: number };
      topClientes: { min: number; max: number };
      proveedoresCriticos: { min: number; max: number };
      notaContable: { min: number; max: number };
    };
    finanzas: {
      evidenciaNumeros: { min: number; max: number };
    };
    comercial: {
      ofertaPrincipal: { min: number; max: number };
      propuestaValor: { min: number; max: number };
      competidores: { min: number; max: number };
      diferenciacion: { min: number; max: number };
    };
    riesgos: {
      notaCumplimiento: { min: number; max: number };
      detalleLitigios: { min: number; max: number };
      notaRegulatorio: { min: number; max: number };
    };
    estrategia: {
      objetivo12m: { min: number; max: number };
      planAccion: { min: number; max: number };
      inversiones6m: { min: number; max: number };
      riesgosDueno: { min: number; max: number };
      mitigaciones: { min: number; max: number };
    };
  }
> = {
  EMPRESA: {
    perfil: {
      descripcionNegocio: { min: 150, max: 1000 },
      topClientes: { min: 120, max: 2000 },
      proveedoresCriticos: { min: 120, max: 1000 },
      notaContable: { min: 80, max: 3000 },
    },
    finanzas: {
      evidenciaNumeros: { min: 200, max: 5000 },
    },
    comercial: {
      ofertaPrincipal: { min: 200, max: 4000 },
      propuestaValor: { min: 160, max: 2000 },
      competidores: { min: 120, max: 2000 },
      diferenciacion: { min: 180, max: 2500 },
    },
    riesgos: {
      notaCumplimiento: { min: 160, max: 4000 },
      detalleLitigios: { min: 200, max: 4000 },
      notaRegulatorio: { min: 120, max: 2500 },
    },
    estrategia: {
      objetivo12m: { min: 180, max: 2500 },
      planAccion: { min: 220, max: 3500 },
      inversiones6m: { min: 160, max: 3000 },
      riesgosDueno: { min: 200, max: 4000 },
      mitigaciones: { min: 180, max: 3500 },
    },
  },
  PYME: {
    perfil: {
      descripcionNegocio: { min: 80, max: 1000 },
      topClientes: { min: 60, max: 2000 },
      proveedoresCriticos: { min: 60, max: 1000 },
      notaContable: { min: 40, max: 3000 },
    },
    finanzas: {
      evidenciaNumeros: { min: 120, max: 5000 },
    },
    comercial: {
      ofertaPrincipal: { min: 120, max: 4000 },
      propuestaValor: { min: 100, max: 2000 },
      competidores: { min: 60, max: 2000 },
      diferenciacion: { min: 100, max: 2500 },
    },
    riesgos: {
      notaCumplimiento: { min: 80, max: 4000 },
      detalleLitigios: { min: 120, max: 4000 },
      notaRegulatorio: { min: 60, max: 2500 },
    },
    estrategia: {
      objetivo12m: { min: 100, max: 2500 },
      planAccion: { min: 120, max: 3500 },
      inversiones6m: { min: 80, max: 3000 },
      riesgosDueno: { min: 120, max: 4000 },
      mitigaciones: { min: 100, max: 3500 },
    },
  },
};

export function getTextLimits(tier: EvaluationTier) {
  return TEXT_LIMITS[tier];
}
