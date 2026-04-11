export type Region = "AR" | "INTL";
export type BillingPeriod = "monthly"; // fase 1: sin trimestral/anual
export type CheckoutKind = "subscription" | "one_time";
export type Plan = "PRO" | "BUSINESS";
export type OneTimeSku = "EVALUACION_UNICA";

export const PRICING = {
  AR: {
    currency: "ARS",
    subscription: {
      PRO: {
        monthly: {
          amount: 24900,
          mp_preapproval_plan_id: process.env.MP_PRO_MONTHLY_PLAN_ID || "",
          mp_checkout_url: process.env.MP_PRO_MONTHLY_CHECKOUT_URL || "",
          lemon_price_id: "", // no aplica
        },
      },
      BUSINESS: {
        monthly: {
          amount: 54900,
          mp_preapproval_plan_id: process.env.MP_BUSINESS_MONTHLY_PLAN_ID || "",
          mp_checkout_url: process.env.MP_BUSINESS_MONTHLY_CHECKOUT_URL || "",
          lemon_price_id: "", // no aplica
        },
      },
    },
    oneTime: {
      EVALUACION_UNICA: {
        amount: 14900,
        mp_preference_sku: "mp_evaluacion_unica",
        lemon_price_id: "", // no aplica
      },
    },
  },
  INTL: {
    currency: "USD",
    subscription: {
      PRO: {
        monthly: {
          amount: 19,
          mp_preapproval_plan_id: "",
          mp_checkout_url: "",
          lemon_price_id: process.env.LEMON_PRO_MONTHLY_PRICE_ID || "",
        },
      },
      BUSINESS: {
        monthly: {
          amount: 49,
          mp_preapproval_plan_id: "",
          mp_checkout_url: "",
          lemon_price_id: process.env.LEMON_BUSINESS_MONTHLY_PRICE_ID || "",
        },
      },
    },
    oneTime: {
      EVALUACION_UNICA: {
        amount: 9.99,
        mp_preference_sku: "",
        lemon_price_id: process.env.LEMON_EVALUACION_UNICA_PRICE_ID || "",
      },
    },
  },
} as const;

export function assertConfig(value: string, name: string) {
  if (!value) throw new Error(`Missing env: ${name}`);
}
