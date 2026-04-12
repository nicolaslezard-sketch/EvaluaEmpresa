import type { Metadata } from "next";
import PricingPageClient from "./PricingPageClient";

export const metadata: Metadata = {
  title: "Planes y precios",
  description:
    "Conocé los planes de EvaluaEmpresa para evaluación y monitoreo de terceros. Prueba gratuita, Pro y Business.",
  alternates: {
    canonical: "/pricing",
  },
};

export default function PricingPage() {
  return <PricingPageClient />;
}
