import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "Respondemos las dudas más comunes sobre evaluación de proveedores, monitoreo de terceros, metodología, planes y uso de EvaluaEmpresa.",
  alternates: {
    canonical: "/faq",
  },
};

export default function FAQPage() {
  const faqs = [
    {
      q: "¿EvaluaEmpresa reemplaza el criterio del analista o del equipo?",
      a: "No. EvaluaEmpresa no reemplaza el criterio profesional. Lo ordena en una metodología estructurada para que cada evaluación sea más consistente, comparable y fácil de respaldar internamente.",
    },
    {
      q: "¿Para qué casos sirve mejor?",
      a: "Principalmente para evaluar y monitorear proveedores, clientes, contrapartes u otros terceros relevantes cuando necesitás una revisión más ordenada, comparable entre ciclos y con una salida ejecutiva clara.",
    },
    {
      q: "¿Qué necesito para usarlo?",
      a: "Necesitás cargar la empresa a evaluar y completar la evaluación con la información que tu equipo ya conoce o releva. Cuanto más consistente sea la carga, más útil será la lectura final.",
    },
    {
      q: "¿Qué obtengo al finalizar una evaluación?",
      a: "Obtenés score general, categoría ejecutiva, radar por 5 pilares, comparativa entre ciclos, hallazgos priorizados, acción sugerida y un PDF ejecutivo para compartir o descargar.",
    },
    {
      q: "¿Cuál es la diferencia entre evaluar y monitorear?",
      a: "Evaluar es obtener una lectura estructurada de un ciclo puntual. Monitorear implica sostener revisiones en el tiempo para comparar ciclos, detectar deterioros y seguir la evolución del tercero.",
    },
    {
      q: "¿Cada cuánto conviene reevaluar un tercero?",
      a: "Depende de la criticidad del caso. Cuanto más relevante sea el tercero para la operación, más valor tiene una frecuencia de revisión consistente que permita comparar cambios entre ciclos.",
    },
    {
      q: "¿Cómo funciona la prueba gratuita?",
      a: "La prueba gratuita te permite conocer el flujo de trabajo, cargar empresas y entender cómo se ve una evaluación estructurada antes de pasar a un plan pago.",
    },
    {
      q: "¿Qué diferencia hay entre Pro y Business?",
      a: "Pro está pensado para seguimiento completo de una cartera chica. Business suma más capacidad, más profundidad histórica y monitoreo más activo para un uso más intensivo.",
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿EvaluaEmpresa reemplaza el criterio del analista o del equipo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. EvaluaEmpresa no reemplaza el criterio profesional. Lo ordena en una metodología estructurada para que cada evaluación sea más consistente, comparable y fácil de respaldar internamente.",
        },
      },
      {
        "@type": "Question",
        name: "¿Para qué casos sirve mejor?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Principalmente para evaluar y monitorear proveedores, clientes, contrapartes u otros terceros relevantes cuando necesitás una revisión más ordenada, comparable entre ciclos y con una salida ejecutiva clara.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué necesito para usarlo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Necesitás cargar la empresa a evaluar y completar la evaluación con la información que tu equipo ya conoce o releva. Cuanto más consistente sea la carga, más útil será la lectura final.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué obtengo al finalizar una evaluación?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Obtenés score general, categoría ejecutiva, radar por 5 pilares, comparativa entre ciclos, hallazgos priorizados, acción sugerida y un PDF ejecutivo para compartir o descargar.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="container-page py-16">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
          Preguntas frecuentes
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600">
          Respuestas claras sobre evaluación de terceros, comparativa entre
          ciclos, planes y uso de EvaluaEmpresa.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {faqs.map((f) => (
            <div key={f.q} className="card p-6">
              <p className="text-sm font-semibold text-zinc-900">{f.q}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{f.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-zinc-200 bg-zinc-50 p-6">
          <p className="text-sm font-semibold text-zinc-900">
            También te puede interesar
          </p>

          <div className="mt-4 flex flex-col gap-2">
            <Link
              href="/evaluacion-de-proveedores"
              className="text-sm font-medium text-sky-800 hover:text-sky-900"
            >
              Ver solución de evaluación de proveedores →
            </Link>
            <Link
              href="/monitoreo-de-terceros"
              className="text-sm font-medium text-sky-800 hover:text-sky-900"
            >
              Ver solución de monitoreo de terceros →
            </Link>
            <Link
              href="/informe-modelo"
              className="text-sm font-medium text-sky-800 hover:text-sky-900"
            >
              Ver informe modelo →
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-sky-800 hover:text-sky-900"
            >
              Ver planes →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
