import DemoDashboard from "@/components/demo/DemoDashboard";
import Link from "next/link";

export default function DemoPage() {
  return (
    <div className="bg-zinc-50">
      <div className="container-page py-16">
        <div className="text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
            Demo del sistema
          </h1>
          <p className="mt-4 mx-auto max-w-2xl text-zinc-600">
            Vista previa ilustrativa del dashboard de evaluación empresarial.
            Datos ficticios con fines demostrativos.
          </p>
        </div>

        <div className="mt-12">
          <DemoDashboard />
        </div>

        <div className="mt-14 text-center">
          <Link href="/app/new" className="btn btn-primary px-6 py-3 text-base">
            Evaluar mi empresa
          </Link>
          <p className="mt-3 text-sm text-zinc-500">
            Obtené tu score y diagnóstico estructurado en minutos.
          </p>
        </div>
      </div>
    </div>
  );
}
