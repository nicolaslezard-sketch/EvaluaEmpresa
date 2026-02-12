import type { AssessmentV2 } from "./schema";

export type Inconsistency = {
  code: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  message: string;
  path?: string;
};

export type DerivedMetrics = {
  runwayMonths: number | null;
  debtRatio: number | null; // deudaTotal / facturacion12m (si facturacion12m>0)
  workingCapitalStress: "LOW" | "MEDIUM" | "HIGH"; // cobro vs pago
  dataCompleteness: number; // 0..1 aproximado
};

export function normalizeAssessmentV2(input: AssessmentV2) {
  const inconsistencies: Inconsistency[] = [];

  // Derivados simples (reproducibles)
  const runwayMonths =
    input.finanzas.costosFijosMensuales > 0
      ? round2(
          input.finanzas.cajaDisponible / input.finanzas.costosFijosMensuales,
        )
      : null;

  const debtRatio =
    input.finanzas.facturacion12m > 0
      ? round2(input.finanzas.deudaTotal / input.finanzas.facturacion12m)
      : null;

  const workingCapitalStress = calcWorkingCapitalStress(
    input.finanzas.cobroClientes,
    input.finanzas.pagoProveedores,
  );

  // Inconsistencias / red flags determinísticas (sin IA)
  // 1) Empleados > 0 y seguros incluye NINGUNO
  if (input.perfil.empleados > 0 && input.riesgos.seguros.includes("NINGUNO")) {
    inconsistencies.push({
      code: "NO_INSURANCE_WITH_EMPLOYEES",
      severity: "HIGH",
      message:
        "Empleados > 0 con seguros declarados como 'ninguno' (riesgo laboral y operativo).",
      path: "riesgos.seguros",
    });
  }

  // 2) B2B y contratos nunca
  if (
    input.comercial.tipoNegocio === "B2B" &&
    input.riesgos.contratosClientes === "NUNCA"
  ) {
    inconsistencies.push({
      code: "B2B_NO_CUSTOMER_CONTRACTS",
      severity: "HIGH",
      message:
        "Negocio B2B sin contratos con clientes (riesgo legal/comercial).",
      path: "riesgos.contratosClientes",
    });
  }

  // 3) Facturación > 0 y no emite factura
  if (
    input.finanzas.facturacion12m > 0 &&
    input.finanzas.emiteFactura === "NO"
  ) {
    inconsistencies.push({
      code: "REVENUE_NO_INVOICING",
      severity: "CRITICAL",
      message:
        "Facturación declarada con 'no emite factura' (alto riesgo fiscal y de trazabilidad).",
      path: "finanzas.emiteFactura",
    });
  }

  // 4) Sociedad formal y sin cuenta bancaria
  if (
    ["SA", "SRL", "SAS"].includes(input.perfil.formaLegal) &&
    input.perfil.cuentaBancariaEmpresa === "NO"
  ) {
    inconsistencies.push({
      code: "FORMAL_ENTITY_NO_BANK",
      severity: "HIGH",
      message:
        "Forma legal societaria sin cuenta bancaria empresaria (riesgo de informalidad financiera).",
      path: "perfil.cuentaBancariaEmpresa",
    });
  }

  // 5) Concentración alta
  if (input.finanzas.concentracionTopClientePct >= 70) {
    inconsistencies.push({
      code: "HIGH_REVENUE_CONCENTRATION",
      severity: "MEDIUM",
      message: "Concentración de ingresos elevada (≥70% en un cliente).",
      path: "finanzas.concentracionTopClientePct",
    });
  }

  // 6) Runway crítico
  if (runwayMonths !== null && runwayMonths < 1) {
    inconsistencies.push({
      code: "RUNWAY_UNDER_1M",
      severity: "HIGH",
      message: "Runway estimado menor a 1 mes (tensión de liquidez).",
      path: "finanzas.cajaDisponible",
    });
  }

  // 7) Presupuesto crecimiento alto con runway bajo
  if (
    runwayMonths !== null &&
    runwayMonths < 2 &&
    input.estrategia.presupuestoCrecimientoMensual >
      input.finanzas.costosFijosMensuales * 0.5
  ) {
    inconsistencies.push({
      code: "GROWTH_SPEND_WITH_LOW_RUNWAY",
      severity: "HIGH",
      message:
        "Presupuesto de crecimiento agresivo con runway bajo (incoherencia recursos vs plan).",
      path: "estrategia.presupuestoCrecimientoMensual",
    });
  }

  // Data completeness simple (aprox, para “confidence”)
  const completeness = estimateCompleteness(input);

  const metrics: DerivedMetrics = {
    runwayMonths,
    debtRatio,
    workingCapitalStress,
    dataCompleteness: completeness,
  };

  return { metrics, inconsistencies };
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function calcWorkingCapitalStress(
  cobro: AssessmentV2["finanzas"]["cobroClientes"],
  pago: AssessmentV2["finanzas"]["pagoProveedores"],
): "LOW" | "MEDIUM" | "HIGH" {
  const map = { "0_15": 1, "16_30": 2, "31_60": 3, "60_PLUS": 4 } as const;
  const c = map[cobro];
  const p = map[pago];

  // Si cobramos mucho más tarde que pagamos => estrés
  const diff = c - p;
  if (diff >= 2) return "HIGH";
  if (diff === 1) return "MEDIUM";
  return "LOW";
}

function estimateCompleteness(input: AssessmentV2) {
  // súper simple y reproducible: pondera textos “largos” y urls opcionales no cuentan
  const texts = [
    input.perfil.descripcionNegocio,
    input.perfil.topClientes,
    input.perfil.proveedoresCriticos,
    input.perfil.notaContable,
    input.finanzas.evidenciaNumeros,
    input.comercial.ofertaPrincipal,
    input.comercial.propuestaValor,
    input.comercial.competidores,
    input.comercial.diferenciacion,
    input.riesgos.notaCumplimiento,
    input.riesgos.notaRegulatorio,
    input.estrategia.objetivo12m,
    input.estrategia.planAccion,
    input.estrategia.inversiones6m,
    input.estrategia.riesgosDueno,
    input.estrategia.mitigaciones,
  ];

  const ok = texts.filter((t) => (t?.trim?.() ?? "").length >= 150).length;
  return Math.min(1, Math.max(0, ok / texts.length));
}
