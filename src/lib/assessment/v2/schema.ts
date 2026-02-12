import { z } from "zod";

const trim = (v: unknown) => (typeof v === "string" ? v.trim() : v);

export const AssessmentV2Schema = z
  .object({
    version: z.literal("v2"),
    email: z.preprocess(trim, z.string().email("Email inválido")),

    perfil: z.object({
      razonSocial: z.preprocess(trim, z.string().min(3).max(120)),
      nombreComercial: z.preprocess(trim, z.string().min(2).max(120)),
      cuit: z
        .preprocess(
          trim,
          z.string().regex(/^\d{11}$/, "CUIT debe tener 11 dígitos"),
        )
        .optional()
        .or(z.literal("").transform(() => undefined)),
      pais: z.enum(["AR", "UY", "CL", "PY", "BO", "PE", "CO", "MX", "OTRO"]),
      provincia: z.preprocess(trim, z.string().min(2).max(80)),
      ciudad: z.preprocess(trim, z.string().min(2).max(80)),
      industria: z.enum([
        "COMERCIO",
        "SERVICIOS",
        "CONSTRUCCION",
        "LOGISTICA",
        "SALUD",
        "GASTRONOMIA",
        "AGRO",
        "TECNOLOGIA",
        "MANUFACTURA",
        "OTRO",
      ]),
      subRubro: z.preprocess(trim, z.string().min(2).max(80)),
      formaLegal: z.enum([
        "SA",
        "SRL",
        "SAS",
        "UNIPERSONAL",
        "COOPERATIVA",
        "OTRO",
      ]),
      anioInicio: z.number().int().min(1900).max(2100),
      empleados: z.number().int().min(0).max(50000),
      socios: z.number().int().min(1).max(50),
      liderazgo: z.enum(["DUENO_OPERADOR", "GERENCIA_PROFESIONAL", "MIXTO"]),
      dependenciaFundador: z.enum(["ALTA", "MEDIA", "BAJA"]),
      descripcionNegocio: z.preprocess(trim, z.string().min(250).max(5000)),
      topClientes: z.preprocess(trim, z.string().min(120).max(2000)),
      proveedoresCriticos: z.preprocess(trim, z.string().min(120).max(2000)),
      sitioWeb: z
        .preprocess(trim, z.string().url("URL inválida"))
        .optional()
        .or(z.literal("").transform(() => undefined)),
      linkedin: z
        .preprocess(trim, z.string().url("URL inválida"))
        .optional()
        .or(z.literal("").transform(() => undefined)),
      instagram: z
        .preprocess(trim, z.string().url("URL inválida"))
        .optional()
        .or(z.literal("").transform(() => undefined)),
      cuentaBancariaEmpresa: z.enum(["SI", "NO"]),
      contabilidadFormal: z.enum(["SI", "NO", "PARCIAL"]),
      notaContable: z.preprocess(trim, z.string().min(80).max(3000)),
    }),

    finanzas: z.object({
      moneda: z.enum(["ARS", "USD"]),
      facturacion12m: z.number().min(0),
      facturacionProm3m: z.number().min(0),
      margenBrutoPct: z.number().min(0).max(100),
      margenNetoPct: z.number().min(-50).max(50),
      costosFijosMensuales: z.number().min(0),
      cajaDisponible: z.number().min(0),
      deudaTotal: z.number().min(0),
      deudaVencida: z.number().min(0),
      impuestosAlDia: z.enum(["SI", "PARCIAL", "NO"]),
      pagoProveedores: z.enum(["0_15", "16_30", "31_60", "60_PLUS"]),
      cobroClientes: z.enum(["0_15", "16_30", "31_60", "60_PLUS"]),
      concentracionTopClientePct: z.number().min(0).max(100),
      clientesActivos90d: z.number().int().min(0),
      emiteFactura: z.enum(["SIEMPRE", "A_VECES", "NO"]),
      evidenciaNumeros: z.preprocess(trim, z.string().min(200).max(5000)),
    }),

    comercial: z.object({
      tipoNegocio: z.enum(["B2B", "B2C", "MIXTO"]),
      ofertaPrincipal: z.preprocess(trim, z.string().min(200).max(4000)),
      propuestaValor: z.preprocess(trim, z.string().min(160).max(2000)),
      modeloIngresos: z.enum([
        "SUSCRIPCION",
        "PROYECTO",
        "COMISION",
        "RETAIL",
        "LICENCIAS",
        "OTRO",
      ]),
      ticketPromedio: z.number().min(0),
      frecuenciaCompra: z.enum([
        "SEMANAL",
        "MENSUAL",
        "TRIMESTRAL",
        "ANUAL",
        "ESPORADICO",
      ]),
      repeticionPct: z.number().min(0).max(100),
      cicloVenta: z.enum(["INMEDIATO", "LT7", "D8_30", "D31_90", "GT90"]),
      canalesTop3: z
        .array(
          z.enum([
            "REFERIDOS",
            "ADS",
            "ORGANICO",
            "MARKETPLACE",
            "FUERZA_VENTAS",
            "ALIANZAS",
            "LOCAL_FISICO",
            "LICITACIONES",
            "OTRO",
          ]),
        )
        .min(1)
        .max(3),
      dependenciaCanal: z.enum(["ALTA", "MEDIA", "BAJA"]),
      leads30d: z.number().int().min(0),
      reuniones30d: z.number().int().min(0),
      ventas30d: z.number().int().min(0),
      competidores: z.preprocess(trim, z.string().min(120).max(2000)),
      diferenciacion: z.preprocess(trim, z.string().min(180).max(2500)),
    }),

    riesgos: z.object({
      procesosDocumentados: z.enum(["SI", "NO", "PARCIAL"]),
      herramientasGestion: z
        .array(z.enum(["ERP", "CRM", "SHEETS", "NINGUNA", "OTRO"]))
        .min(1),
      depProveedorCritico: z.enum(["ALTA", "MEDIA", "BAJA"]),
      depEmpleadoClave: z.enum(["ALTA", "MEDIA", "BAJA"]),
      incidentes12m: z
        .array(
          z.enum([
            "CORTE_OPERATIVO",
            "RECLAMOS_LEGALES",
            "INSPECCIONES",
            "MULTAS",
            "SEGURIDAD",
            "FRAUDE",
            "NINGUNO",
          ]),
        )
        .min(1),
      seguros: z
        .array(
          z.enum(["RC", "ART", "CAUCION", "INCENDIO", "TRANSPORTE", "NINGUNO"]),
        )
        .min(1),
      contratosClientes: z.enum(["SIEMPRE", "A_VECES", "NUNCA"]),
      contratosProveedores: z.enum(["SIEMPRE", "A_VECES", "NUNCA"]),
      cumplimientoFiscalLaboral: z.enum(["ALTO", "MEDIO", "BAJO"]),
      notaCumplimiento: z.preprocess(trim, z.string().min(160).max(4000)),
      marca: z.enum(["REGISTRADA", "EN_TRAMITE", "NO"]),
      litigios: z.enum(["SI", "NO"]),
      detalleLitigios: z
        .preprocess(trim, z.string().min(200).max(4000))
        .optional()
        .or(z.literal("").transform(() => undefined)),
      riesgoRegulatorio: z.enum(["ALTO", "MEDIO", "BAJO"]),
      notaRegulatorio: z.preprocess(trim, z.string().min(120).max(2500)),
    }),

    estrategia: z.object({
      objetivo12m: z.preprocess(trim, z.string().min(180).max(2500)),
      planAccion: z.preprocess(trim, z.string().min(220).max(3500)),
      presupuestoCrecimientoMensual: z.number().min(0),
      inversiones6m: z.preprocess(trim, z.string().min(160).max(3000)),
      riesgosDueno: z.preprocess(trim, z.string().min(200).max(4000)),
      mitigaciones: z.preprocess(trim, z.string().min(180).max(3500)),
      kpis: z
        .array(
          z.enum([
            "VENTAS",
            "MARGEN",
            "CAJA",
            "CAC",
            "CHURN",
            "NPS",
            "RECLAMOS",
            "ROTACION",
            "OTRO",
          ]),
        )
        .min(1),
      frecuenciaSeguimiento: z.enum([
        "SEMANAL",
        "MENSUAL",
        "TRIMESTRAL",
        "NUNCA",
      ]),
      disponibilidadInfo: z.enum(["ALTA", "MEDIA", "BAJA"]),
    }),

    confirmaciones: z.object({
      datosCorrectos: z
        .boolean()
        .refine((v) => v === true, "Debes confirmar datos correctos"),
      informeOrientativo: z
        .boolean()
        .refine((v) => v === true, "Debes aceptar el carácter orientativo"),
    }),
  })
  .superRefine((val, ctx) => {
    // Reglas de coherencia (bloqueantes o casi)
    if (val.finanzas.margenNetoPct > val.finanzas.margenBrutoPct) {
      ctx.addIssue({
        code: "custom",
        path: ["finanzas", "margenNetoPct"],
        message: "Margen neto no puede ser mayor al margen bruto",
      });
    }
    if (val.comercial.ventas30d > val.comercial.reuniones30d) {
      ctx.addIssue({
        code: "custom",
        path: ["comercial", "ventas30d"],
        message: "Ventas no pueden superar reuniones",
      });
    }
    if (val.comercial.reuniones30d > val.comercial.leads30d) {
      ctx.addIssue({
        code: "custom",
        path: ["comercial", "reuniones30d"],
        message: "Reuniones no pueden superar leads",
      });
    }
    if (val.finanzas.deudaVencida > val.finanzas.deudaTotal) {
      ctx.addIssue({
        code: "custom",
        path: ["finanzas", "deudaVencida"],
        message: "Deuda vencida no puede superar deuda total",
      });
    }
    if (val.riesgos.litigios === "SI" && !val.riesgos.detalleLitigios) {
      ctx.addIssue({
        code: "custom",
        path: ["riesgos", "detalleLitigios"],
        message: "Debes detallar litigios/contingencias",
      });
    }
  });

export type AssessmentV2 = z.infer<typeof AssessmentV2Schema>;
