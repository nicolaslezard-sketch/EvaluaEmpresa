"use client";

import { useState } from "react";

export function ReactivatePlanButton({
  plan,
  label,
  className,
}: {
  plan: "PRO" | "BUSINESS";
  label?: string;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="button"
      disabled={loading}
      onClick={async () => {
        try {
          setLoading(true);

          const res = await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              kind: "subscription",
              plan,
              period: "monthly",
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data?.error || "Checkout failed");
          }

          window.location.href = data.checkoutUrl;
        } catch (error) {
          alert(error instanceof Error ? error.message : "Checkout failed");
        } finally {
          setLoading(false);
        }
      }}
      className={
        className ??
        "btn btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70"
      }
    >
      {loading
        ? "Redirigiendo..."
        : (label ?? `Volver a activar ${plan === "PRO" ? "Pro" : "Business"}`)}
    </button>
  );
}
