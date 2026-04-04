export const metadata = {
  title: "Política de Privacidad | EvaluaEmpresa",
  description: "Política de Privacidad de EvaluaEmpresa.",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
        {title}
      </h2>
      <div className="space-y-4 text-sm leading-7 text-zinc-700">
        {children}
      </div>
    </section>
  );
}

export default function PrivacidadPage() {
  return (
    <main className="bg-white">
      <div className="mx-auto max-w-4xl px-6 py-16 md:px-8 md:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
            Legales
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900">
            Política de Privacidad
          </h1>
          <p className="mt-4 text-sm leading-7 text-zinc-600">
            Última actualización: 04/04/2026
          </p>
          <p className="mt-6 text-base leading-8 text-zinc-600">
            Esta Política de Privacidad explica cómo EvaluaEmpresa recopila,
            utiliza, almacena y protege datos personales en relación con el uso
            de la Plataforma.
          </p>
        </div>

        <div className="mt-12 space-y-10">
          <Section title="1. Responsable del tratamiento">
            <p>Responsable: EvaluaEmpresa</p>
            <p>Domicilio de referencia: Provincia de Buenos Aires, Argentina</p>
            <p>
              Correo de privacidad:{" "}
              <span className="font-medium text-zinc-900">
                privacidad@evaluaempresa.com
              </span>
            </p>
          </Section>

          <Section title="2. Qué datos podemos recopilar">
            <p>
              Podemos tratar, según el uso de la Plataforma, las siguientes
              categorías de datos:
            </p>

            <div className="space-y-2">
              <h3 className="font-semibold text-zinc-900">
                a. Datos de cuenta y contacto
              </h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>nombre y apellido;</li>
                <li>correo electrónico;</li>
                <li>datos de acceso o autenticación;</li>
                <li>
                  datos básicos de identificación del usuario o representante.
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-zinc-900">
                b. Datos de facturación y contratación
              </h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>plan contratado;</li>
                <li>estado de suscripción o compra;</li>
                <li>identificadores de pago;</li>
                <li>
                  información comercial y administrativa vinculada al cobro.
                </li>
              </ul>
              <p>
                No almacenamos necesariamente datos completos de tarjetas si el
                procesamiento se realiza a través de proveedores externos de
                pago.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-zinc-900">
                c. Datos de uso y operación
              </h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>fecha y hora de acceso;</li>
                <li>logs técnicos;</li>
                <li>eventos de uso;</li>
                <li>información del dispositivo o navegador;</li>
                <li>
                  identificadores técnicos razonables para seguridad y
                  funcionamiento.
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-zinc-900">
                d. Datos cargados por el usuario en la Plataforma
              </h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>información sobre empresas o terceros evaluados;</li>
                <li>respuestas y observaciones de evaluación;</li>
                <li>reportes, hallazgos y resultados generados;</li>
                <li>
                  notas, justificaciones, evidencias breves y demás contenido
                  ingresado.
                </li>
              </ul>
            </div>
          </Section>

          <Section title="3. Finalidades del tratamiento">
            <p>Tratamos datos personales para:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>prestar y mantener la Plataforma;</li>
              <li>autenticar usuarios;</li>
              <li>habilitar funcionalidades según el plan contratado;</li>
              <li>procesar pagos, suscripciones y compras;</li>
              <li>generar resultados, reportes y exportaciones;</li>
              <li>dar soporte técnico y atención al usuario;</li>
              <li>prevenir fraude, abuso o incidentes de seguridad;</li>
              <li>
                cumplir obligaciones legales, regulatorias, contables o
                fiscales;
              </li>
              <li>
                mejorar la experiencia, la estabilidad y el funcionamiento del
                servicio.
              </li>
            </ul>
          </Section>

          <Section title="4. Base y criterio de tratamiento">
            <p>Tratamos datos en la medida necesaria para:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>ejecutar la relación contractual con el usuario;</li>
              <li>prestar las funciones de la Plataforma;</li>
              <li>cumplir obligaciones legales;</li>
              <li>
                proteger intereses legítimos vinculados a seguridad, soporte,
                prevención de abuso y operación razonable del servicio.
              </li>
            </ul>
            <p>
              Cuando corresponda, también podremos tratar datos en base al
              consentimiento del usuario.
            </p>
          </Section>

          <Section title="5. Proveedores y terceros">
            <p>
              Podemos compartir datos con proveedores que nos prestan servicios
              necesarios para operar la Plataforma, por ejemplo:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>hosting e infraestructura;</li>
              <li>autenticación;</li>
              <li>analítica técnica;</li>
              <li>almacenamiento;</li>
              <li>procesamiento de pagos;</li>
              <li>envío de correos o notificaciones;</li>
              <li>soporte técnico.</li>
            </ul>
            <p>
              Solo compartimos datos en la medida razonablemente necesaria para
              prestar el servicio, cumplir obligaciones o resguardar la
              seguridad de la Plataforma.
            </p>
          </Section>

          <Section title="6. Transferencias internacionales">
            <p>
              Algunos proveedores tecnológicos pueden operar infraestructura o
              procesar datos fuera de la República Argentina.
            </p>
            <p>
              Cuando ello ocurra, procuraremos adoptar medidas razonables para
              resguardar la confidencialidad y seguridad de los datos, de
              acuerdo con la normativa aplicable.
            </p>
          </Section>

          <Section title="7. Conservación de datos">
            <p>Conservamos los datos:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>mientras sean necesarios para prestar el servicio;</li>
              <li>mientras exista relación contractual o cuenta activa;</li>
              <li>
                por los plazos exigidos por normas legales, contables, fiscales
                o de defensa en juicio;
              </li>
              <li>
                o hasta que corresponda su supresión, anonimización o bloqueo,
                según el caso.
              </li>
            </ul>
          </Section>

          <Section title="8. Seguridad">
            <p>
              Aplicamos medidas técnicas y organizativas razonables para
              proteger los datos contra acceso no autorizado, pérdida,
              alteración, divulgación o destrucción indebida.
            </p>
            <p>
              Sin embargo, ningún sistema puede garantizar seguridad absoluta.
            </p>
          </Section>

          <Section title="9. Derechos de las personas titulares">
            <p>
              La persona titular de los datos puede ejercer, conforme la
              normativa aplicable, sus derechos de:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>acceso;</li>
              <li>rectificación;</li>
              <li>actualización;</li>
              <li>supresión.</li>
            </ul>
            <p>
              Para ejercer estos derechos, puede escribir a{" "}
              <span className="font-medium text-zinc-900">
                privacidad@evaluaempresa.com
              </span>
              .
            </p>
            <p>
              Podremos solicitar información razonable para verificar identidad
              antes de responder una solicitud.
            </p>
          </Section>

          <Section title="10. Autoridad de control">
            <p>
              La Agencia de Acceso a la Información Pública, en su carácter de
              órgano de control de la Ley 25.326, tiene la atribución de atender
              denuncias y reclamos vinculados al incumplimiento de las normas
              sobre protección de datos personales.
            </p>
          </Section>

          <Section title="11. Menores de edad">
            <p>
              La Plataforma no está dirigida a menores de edad sin intervención
              de sus representantes legales.
            </p>
          </Section>

          <Section title="12. Cambios a esta Política">
            <p>
              Podemos actualizar esta Política de Privacidad en cualquier
              momento.
            </p>
            <p>
              La versión vigente será la publicada en el sitio con su fecha de
              última actualización.
            </p>
          </Section>

          <Section title="13. Contacto">
            <p>
              Consultas sobre privacidad y protección de datos:{" "}
              <span className="font-medium text-zinc-900">
                privacidad@evaluaempresa.com
              </span>
            </p>
            <p>
              Contacto general:{" "}
              <span className="font-medium text-zinc-900">
                contacto@evaluaempresa.com
              </span>
            </p>
          </Section>
        </div>
      </div>
    </main>
  );
}
