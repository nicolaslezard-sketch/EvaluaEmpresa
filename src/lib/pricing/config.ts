export type Region = "AR" | "INTL";
export type BillingPeriod = "monthly"; // (fase 1) sin trimestral/anual
export type CheckoutKind = "subscription" | "unlock";
export type Plan = "PRO" | "BUSINESS";
export type UnlockSku = "REPORT_ONETIME";

export const PRICING = {
  AR: {
    currency: "ARS",
    subscription: {
      PRO: {
        monthly: {
          amount: 95000,
          mp_preapproval_plan_id: process.env.MP_PRO_MONTHLY_PLAN_ID || "",
          lemon_price_id: "", // no aplica
        },
      },
      BUSINESS: {
        monthly: {
          amount: 210000,
          mp_preapproval_plan_id: process.env.MP_BUSINESS_MONTHLY_PLAN_ID || "",
          lemon_price_id: "",
        },
      },
    },
    unlock: {
      REPORT_ONETIME: {
        amount: 45000,
        mp_preference_sku: "mp_report_onetime",
        lemon_price_id: "",
      },
    },
  },
  INTL: {
    currency: "USD",
    subscription: {
      PRO: {
        monthly: {
          amount: 119,
          mp_preapproval_plan_id: "",
          lemon_price_id: process.env.LEMON_PRO_MONTHLY_PRICE_ID || "",
        },
      },
      BUSINESS: {
        monthly: {
          amount: 249,
          mp_preapproval_plan_id: "",
          lemon_price_id: process.env.LEMON_BUSINESS_MONTHLY_PRICE_ID || "",
        },
      },
    },
    unlock: {
      REPORT_ONETIME: {
        amount: 59,
        mp_preference_sku: "",
        lemon_price_id: process.env.LEMON_REPORT_ONETIME_PRICE_ID || "",
      },
    },
  },
} as const;

export function assertConfig(value: string, name: string) {
  if (!value) throw new Error(`Missing env: ${name}`);
}
