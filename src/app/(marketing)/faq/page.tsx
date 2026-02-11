export default function FAQPage() {
  const faqs = [
    {
      q: "¿Esto reemplaza un informe crediticio (Veraz, bancos, etc.)?",
      a: "No. EvaluaEmpresa es una evaluación estructurada orientativa para decisiones comerciales. No es un informe crediticio oficial ni una verificación documental.",
    },
    {
      q: "¿Para qué casos sirve mejor?",
      a: "Principalmente para evaluar proveedores estratégicos y socios comerciales antes de firmar acuerdos o asignar operaciones críticas. También puede apoyar decisiones de inversión.",
    },
    {
      q: "¿Qué necesito para usarlo?",
      a: "Completar información estructurada de la empresa a evaluar. Cuanto más precisa sea, mejor será la calidad de la evaluación.",
    },
    {
      q: "¿Qué recibo exactamente?",
      a: "Un reporte web premium con E-Score™ general, scores por pilar, radar chart, factores críticos, escenarios y recomendaciones. Además, un PDF descargable.",
    },
  ];

  return (
    <div className="container-page py-16">
      <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
        FAQ
      </h1>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {faqs.map((f) => (
          <div key={f.q} className="card p-6">
            <p className="text-sm font-semibold text-zinc-900">{f.q}</p>
            <p className="mt-2 text-sm text-zinc-600">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
