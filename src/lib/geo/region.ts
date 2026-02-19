import type { NextRequest } from "next/server";

export function detectRegion(req: NextRequest): "AR" | "INTL" {
  const c = (req.headers.get("x-vercel-ip-country") || "").toUpperCase();
  return c === "AR" ? "AR" : "INTL";
}
