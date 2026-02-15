/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import type { FieldErrors } from "./ui";
import {
  getAssessmentBaseSchemaForTier,
  getAssessmentSchemaForTier,
  type EvaluationTier,
} from "@/lib/assessment/v2/schema";

type AssessmentV2 = z.infer<ReturnType<typeof getAssessmentSchemaForTier>>;

export const initialData: AssessmentV2 = {
  version: "v2",
  email: "",

  perfil: {
    razonSocial: "",
    nombreComercial: "",
    cuit: undefined,
    pais: "AR",
    provincia: "",
    ciudad: "",
    industria: "SERVICIOS",
    subRubro: "",
    formaLegal: "SAS",
    anioInicio: new Date().getFullYear(),
    empleados: 0,
    socios: 1,
    liderazgo: "DUENO_OPERADOR",
    dependenciaFundador: "ALTA",
    descripcionNegocio: "",
    topClientes: "",
    proveedoresCriticos: "",
    sitioWeb: undefined,
    linkedin: undefined,
    instagram: undefined,
    cuentaBancariaEmpresa: "SI",
    contabilidadFormal: "SI",
    notaContable: "",
  },

  finanzas: {
    moneda: "ARS",
    facturacion12m: 0,
    facturacionProm3m: 0,
    margenBrutoPct: 0,
    margenNetoPct: 0,
    costosFijosMensuales: 0,
    cajaDisponible: 0,
    deudaTotal: 0,
    deudaVencida: 0,
    impuestosAlDia: "SI",
    pagoProveedores: "0_15",
    cobroClientes: "0_15",
    concentracionTopClientePct: 0,
    clientesActivos90d: 0,
    emiteFactura: "SIEMPRE",
    evidenciaNumeros: "",
  },

  comercial: {
    tipoNegocio: "B2B",
    ofertaPrincipal: "",
    propuestaValor: "",
    modeloIngresos: "PROYECTO",
    ticketPromedio: 0,
    frecuenciaCompra: "MENSUAL",
    repeticionPct: 0,
    cicloVenta: "INMEDIATO",
    canalesTop3: ["REFERIDOS"],
    dependenciaCanal: "MEDIA",
    leads30d: 0,
    reuniones30d: 0,
    ventas30d: 0,
    competidores: "",
    diferenciacion: "",
  },

  riesgos: {
    procesosDocumentados: "PARCIAL",
    herramientasGestion: ["SHEETS"],
    depProveedorCritico: "MEDIA",
    depEmpleadoClave: "MEDIA",
    incidentes12m: ["NINGUNO"],
    seguros: ["ART"],
    contratosClientes: "A_VECES",
    contratosProveedores: "A_VECES",
    cumplimientoFiscalLaboral: "MEDIO",
    notaCumplimiento: "",
    marca: "NO",
    litigios: "NO",
    detalleLitigios: undefined,
    riesgoRegulatorio: "MEDIO",
    notaRegulatorio: "",
  },

  estrategia: {
    objetivo12m: "",
    planAccion: "",
    presupuestoCrecimientoMensual: 0,
    inversiones6m: "",
    riesgosDueno: "",
    mitigaciones: "",
    kpis: ["VENTAS"],
    frecuenciaSeguimiento: "MENSUAL",
    disponibilidadInfo: "MEDIA",
  },

  confirmaciones: {
    datosCorrectos: false,
    informeOrientativo: false,
  },
};

function issuePathToKey(path: readonly PropertyKey[]) {
  return path.map((p) => String(p)).join(".");
}

function zodErrorsToFieldErrors(issues: z.ZodIssue[]): FieldErrors {
  const out: FieldErrors = {};
  for (const it of issues) {
    const k = issuePathToKey(it.path);
    // quedate con el primer mensaje por campo
    if (!out[k]) out[k] = it.message;
  }
  return out;
}

export function useAssessmentForm(tier: EvaluationTier) {
  const STORAGE_KEY = `ee_v2_draft_${tier}`;

  const [step, setStep] = useState(1);
  const [data, setData] = useState<AssessmentV2>(initialData);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // draft load
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      setData(initialData);
      return;
    }

    try {
      const parsed = JSON.parse(saved);
      setData(parsed);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setData(initialData);
    }

    // reset visual states
    setFieldErrors({});
    setStep(1);
  }, [STORAGE_KEY]);

  // draft save
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, STORAGE_KEY]);

  const steps = useMemo(
    () => [
      { n: 1, title: "Perfil empresarial" },
      { n: 2, title: "Finanzas y solvencia" },
      { n: 3, title: "Modelo comercial" },
      { n: 4, title: "Riesgos operativos y legales" },
      { n: 5, title: "Estrategia y confirmación" },
    ],
    [],
  );

  function update(
    path: readonly [string] | readonly [string, string],
    value: unknown,
  ) {
    setData((prev) => {
      const copy = structuredClone(prev);

      if (path.length === 1) {
        const [k1] = path;
        return {
          ...copy,
          [k1]: value,
        } as AssessmentV2;
      }

      const [k1, k2] = path;

      return {
        ...copy,
        [k1]: {
          ...(copy[k1 as keyof AssessmentV2] as Record<string, unknown>),
          [k2]: value,
        },
      } as AssessmentV2;
    });
  }

  function clearErrorFor(fieldKey: string) {
    setFieldErrors((prev) => {
      if (!prev[fieldKey]) return prev;
      const next = { ...prev };
      delete next[fieldKey];
      return next;
    });
  }

  function scrollToFirstError(errors: FieldErrors) {
    const firstKey = Object.keys(errors)[0];
    if (!firstKey) return;

    const el = document.querySelector(`[data-field="${firstKey}"]`);
    if (el && "scrollIntoView" in el) {
      (el as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    // fallback: top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function validateAll(): { ok: true } | { ok: false; errors: FieldErrors } {
    const schema = getAssessmentSchemaForTier(tier);
    const res = schema.safeParse(data);

    if (res.success) return { ok: true };

    const errors = zodErrorsToFieldErrors(res.error.issues);
    return { ok: false, errors };
  }

  function validateAndGoNext() {
    const base = getAssessmentBaseSchemaForTier(tier);
    let result;

    switch (step) {
      case 1:
        result = base
          .pick({
            email: true,
            perfil: true,
          })
          .safeParse(data);
        break;

      case 2:
        result = base
          .pick({
            finanzas: true,
          })
          .safeParse(data);
        break;

      case 3:
        result = base
          .pick({
            comercial: true,
          })
          .safeParse(data);
        break;

      case 4:
        result = base
          .pick({
            riesgos: true,
          })
          .safeParse(data);
        break;

      case 5:
        result = base
          .pick({
            estrategia: true,
            confirmaciones: true,
          })
          .safeParse(data);
        break;

      default:
        result = base.safeParse(data);
    }

    if (result.success) {
      setFieldErrors({});
      setStep((s) => Math.min(s + 1, 5));
      return true;
    }

    const errors = zodErrorsToFieldErrors(result.error.issues);
    setFieldErrors(errors);
    scrollToFirstError(errors);
    return false;
  }

  function back() {
    setStep((s) => Math.max(s - 1, 1));
  }

  return {
    steps,
    step,
    setStep,
    data,
    setData,
    update,
    fieldErrors,
    setFieldErrors,
    clearErrorFor,
    validateAll,
    validateAndGoNext,
    back,
  };
}
