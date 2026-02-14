"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import WizardLayout from "./WizardLayout";
import { useAssessmentForm } from "./useAssessmentForm";

import Step1Perfil from "./steps/Step1Perfil";
import Step2Finanzas from "./steps/Step2Finanzas";
import Step3Comercial from "./steps/Step3Comercial";
import Step4Riesgos from "./steps/Step4Riesgos";
import Step5Estrategia from "./steps/Step5Estrategia";

export default function AssessmentWizard() {
  const router = useRouter();
  const {
    steps,
    step,
    data,
    update,
    fieldErrors,
    validateAndGoNext,
    back,
    setFieldErrors,
  } = useAssessmentForm();

  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  async function submit() {
    setGlobalError(null);
    // validación final
    const ok = validateAndGoNext(); // si está en step 5, esto no avanza pero valida todo
    if (!ok) return;

    try {
      setSubmitting(true);

      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ assessment: data }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        setGlobalError(json?.error || "No se pudo generar el informe.");
        return;
      }

      // asumo que devuelve { id }
      const id = json?.id;
      if (id) {
        router.push(`/report/${id}`);
      } else {
        router.push("/app/dashboard");
      }
    } catch {
      setGlobalError("Error de red. Probá de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  const title = steps.find((s) => s.n === step)?.title ?? "Evaluación";

  return (
    <WizardLayout
      steps={steps}
      step={step}
      title={title}
      subtitle="Completá los datos con precisión. El informe es orientativo, pero el método es estricto."
      submitting={submitting}
      canBack={step > 1}
      onBack={() => {
        setFieldErrors({});
        back();
      }}
      onNext={() => {
        if (step < 5) validateAndGoNext();
        else submit();
      }}
      nextLabel={step < 5 ? "Continuar" : "Generar informe"}
      errors={fieldErrors}
    >
      {globalError ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {globalError}
        </div>
      ) : null}

      {step === 1 ? (
        <Step1Perfil data={data} update={update} errors={fieldErrors} />
      ) : null}
      {step === 2 ? (
        <Step2Finanzas data={data} update={update} errors={fieldErrors} />
      ) : null}
      {step === 3 ? (
        <Step3Comercial data={data} update={update} errors={fieldErrors} />
      ) : null}
      {step === 4 ? (
        <Step4Riesgos data={data} update={update} errors={fieldErrors} />
      ) : null}
      {step === 5 ? (
        <Step5Estrategia data={data} update={update} errors={fieldErrors} />
      ) : null}
    </WizardLayout>
  );
}
