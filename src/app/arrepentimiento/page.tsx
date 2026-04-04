export const metadata = {
  title: "Botón de Arrepentimiento | EvaluaEmpresa",
  description:
    "Canal para solicitar la revocación de una contratación realizada a distancia en EvaluaEmpresa.",
};

export default function ArrepentimientoPage() {
  return (
    <main className="bg-white">
      <div className="mx-auto max-w-3xl px-6 py-16 md:px-8 md:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
            Legales
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900">
            Botón de Arrepentimiento
          </h1>
          <p className="mt-4 text-sm leading-7 text-zinc-600">
            Última actualización: 04/04/2026
          </p>
          <p className="mt-6 text-base leading-8 text-zinc-600">
            Si contrataste un servicio de EvaluaEmpresa por internet o por otros
            medios a distancia y actuás como consumidor, podés revocar la
            aceptación dentro del plazo legal aplicable.
          </p>
        </div>

        <div className="mt-12 rounded-3xl border border-zinc-200 bg-zinc-50 p-6 md:p-8">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
            Cómo solicitar la revocación
          </h2>
          <p className="mt-4 text-sm leading-7 text-zinc-700">
            Podés enviar tu solicitud por correo electrónico a{" "}
            <span className="font-medium text-zinc-900">
              contacto@evaluaempresa.com
            </span>
            .
          </p>

          <div className="mt-8">
            <h3 className="text-base font-semibold text-zinc-900">
              Datos que tenés que informar
            </h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-zinc-700">
              <li>Nombre y apellido</li>
              <li>Correo electrónico usado en la compra</li>
              <li>Producto o plan contratado</li>
              <li>Fecha de contratación</li>
              <li>Medio de pago utilizado</li>
              <li>Identificador de compra, si lo tenés</li>
              <li>
                Manifestación expresa de que querés revocar la contratación
              </li>
            </ul>
          </div>

          <div className="mt-8 space-y-4 text-sm leading-7 text-zinc-700">
            <p>
              No vamos a exigir registración previa ni trámites innecesarios
              para que puedas ejercer este derecho.
            </p>
            <p>
              Una vez recibida la solicitud, te enviaremos una constancia por el
              mismo medio.
            </p>
            <p>
              La revocación se tratará conforme la normativa de defensa del
              consumidor aplicable.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-sky-100 bg-sky-50 p-6">
          <p className="text-sm font-medium text-sky-900">
            Canal de arrepentimiento
          </p>
          <p className="mt-2 text-base font-semibold text-zinc-900">
            contacto@evaluaempresa.com
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Jurisdicción de referencia: Provincia de Buenos Aires, República
            Argentina.
          </p>
        </div>
      </div>
    </main>
  );
}
