import { assertConfig } from "@/lib/pricing/config";

export const LEMON_API_KEY = process.env.LEMON_API_KEY || "";
export const LEMON_STORE_ID = process.env.LEMON_STORE_ID || "";

export function lemonHeaders() {
  assertConfig(LEMON_API_KEY, "LEMON_API_KEY");
  return {
    Authorization: `Bearer ${LEMON_API_KEY}`,
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
  };
}
