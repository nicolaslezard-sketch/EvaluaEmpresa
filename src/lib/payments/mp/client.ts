import { assertConfig } from "@/lib/pricing/config";

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || "";

export function mpHeaders() {
  assertConfig(MP_ACCESS_TOKEN, "MP_ACCESS_TOKEN");
  return {
    Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  };
}
