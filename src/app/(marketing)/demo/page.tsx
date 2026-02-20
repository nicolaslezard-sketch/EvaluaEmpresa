import Link from "next/link";

export default function DemoPage() {
  return (
    <div className="container-page py-20 max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        Ejemplo de informe
      </h1>

      <p className="mt-6 text-zinc-600">
        Vista ilustrativa del informe ejecutivo estructurado.
      </p>

      <div className="mt-10 card p-8">
        <p className="text-sm text-zinc-600">Score general: 72.4</p>
        <p className="mt-4 text-sm text-zinc-600">
          Categoría ejecutiva: Riesgo moderado.
        </p>
      </div>

      <div className="mt-10">
        <Link href="/login" className="btn btn-primary">
          Generar evaluación real
        </Link>
      </div>
    </div>
  );
}
