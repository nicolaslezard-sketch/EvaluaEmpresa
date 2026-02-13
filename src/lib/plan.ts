export type UserPlan = "free" | "pro";

export function normalizePlan(plan: unknown): UserPlan {
  return plan === "pro" ? "pro" : "free";
}

export function isPro(plan: unknown): boolean {
  return normalizePlan(plan) === "pro";
}
