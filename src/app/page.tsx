import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20 text-zinc-900">
      {/* HERO */}
      <section className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight">
          Evaluá el riesgo antes de hacer negocios
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600">
          Generá un informe orientativo de riesgo empresarial antes de
          contratar, invertir o asociarte.
        </p>

        {/* ESPACIO IMAGEN HERO */}
        <div className="mt-10 rounded-xl border border-dashed p-12 text-zinc-400">
          [ESPACIO IMAGEN HERO — oficina / personas trabajando]
        </div>

        <div className="mt-10">
          <Link
            href="/evaluar"
            className="inline-flex items-center rounded-xl bg-black px-8 py-4 text-white hover:bg-zinc-800"
          >
            Generar reporte
          </Link>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="mt-32">
        <h2 className="text-2xl font-semibold">
          ¿Para qué sirve este informe?
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border p-6">
            <h3 className="font-medium">Reducir riesgos</h3>
            <p className="mt-2 text-sm text-zinc-600">
              Identificá señales de alerta antes de avanzar en una operación
              comercial.
            </p>
          </div>

          <div className="rounded-xl border p-6">
            <h3 className="font-medium">Detectar inconsistencias</h3>
            <p className="mt-2 text-sm text-zinc-600">
              Analizá el contexto, el tipo de operación y la experiencia previa
              para evitar sorpresas.
            </p>
          </div>

          <div className="rounded-xl border p-6">
            <h3 className="font-medium">Tomar mejores decisiones</h3>
            <p className="mt-2 text-sm text-zinc-600">
              Usá el informe como apoyo objetivo antes de comprometer tiempo o
              dinero.
            </p>
          </div>
        </div>

        {/* ESPACIO IMAGEN BENEFICIOS */}
        <div className="mt-10 rounded-xl border border-dashed p-12 text-zinc-400">
          [ESPACIO IMAGEN BENEFICIOS]
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="mt-32">
        <h2 className="text-2xl font-semibold">¿Cómo funciona?</h2>

        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          <li className="rounded-xl border p-6">
            <span className="text-sm text-zinc-500">Paso 1</span>
            <p className="mt-2 font-medium">Completás el formulario</p>
            <p className="mt-1 text-sm text-zinc-600">
              Ingresás los datos de la empresa y el contexto de la operación.
            </p>
          </li>

          <li className="rounded-xl border p-6">
            <span className="text-sm text-zinc-500">Paso 2</span>
            <p className="mt-2 font-medium">Procesamos la información</p>
            <p className="mt-1 text-sm text-zinc-600">
              El sistema analiza los datos ingresados de forma automática.
            </p>
          </li>

          <li className="rounded-xl border p-6">
            <span className="text-sm text-zinc-500">Paso 3</span>
            <p className="mt-2 font-medium">Recibís el informe</p>
            <p className="mt-1 text-sm text-zinc-600">
              Te enviamos un PDF profesional al email indicado.
            </p>
          </li>
        </ol>
      </section>

      {/* EJEMPLO DE INFORME */}
      <section className="mt-32">
        <h2 className="text-2xl font-semibold">Ejemplo de informe</h2>

        <div className="mt-8 rounded-xl border bg-zinc-50 p-6 text-sm text-zinc-700">
          <p className="font-medium">Resumen ejecutivo</p>
          <p className="mt-2">
            A partir de la información proporcionada, se identifican factores de
            riesgo moderado asociados al tipo de operación y a la ausencia de
            antecedentes previos verificables.
          </p>

          <p className="mt-4 font-medium">Señales de riesgo</p>
          <ul className="mt-2 list-disc pl-5">
            <li>Relación comercial sin historial previo</li>
            <li>Condiciones de pago poco claras</li>
            <li>Urgencia alta en la toma de decisión</li>
          </ul>
        </div>

        {/* ESPACIO IMAGEN EJEMPLO INFORME */}
        <div className="mt-10 rounded-xl border border-dashed p-12 text-zinc-400">
          [ESPACIO IMAGEN EJEMPLO INFORME]
        </div>
      </section>

      {/* PRECIO */}
      <section className="mt-32 text-center">
        <h2 className="text-2xl font-semibold">Precio</h2>

        <p className="mt-4 text-lg">
          Informe único desde <span className="font-semibold">$100 ARS</span>
        </p>

        <p className="mt-2 text-sm text-zinc-600">
          Una mala decisión comercial cuesta mucho más que este informe.
        </p>

        <div className="mt-8">
          <Link
            href="/evaluar"
            className="inline-flex items-center rounded-xl bg-black px-8 py-4 text-white hover:bg-zinc-800"
          >
            Generar reporte
          </Link>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="mt-24 border-t pt-8 text-sm text-zinc-500">
        Este informe es orientativo y no reemplaza asesoramiento profesional,
        legal, contable ni financiero.
      </section>
    </main>
  );
}
