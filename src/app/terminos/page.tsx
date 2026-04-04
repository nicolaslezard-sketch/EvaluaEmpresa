export const metadata = {
  title: "Términos y Condiciones | EvaluaEmpresa",
  description: "Términos y Condiciones de uso de EvaluaEmpresa.",
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

export default function TerminosPage() {
  return (
    <main className="bg-white">
      <div className="mx-auto max-w-4xl px-6 py-16 md:px-8 md:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
            Legales
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900">
            Términos y Condiciones
          </h1>
          <p className="mt-4 text-sm leading-7 text-zinc-600">
            Última actualización: 04/04/2026
          </p>
          <p className="mt-6 text-base leading-8 text-zinc-600">
            Estos Términos y Condiciones regulan el acceso y uso de
            EvaluaEmpresa, con contacto en{" "}
            <span className="font-medium text-zinc-900">
              contacto@evaluaempresa.com
            </span>{" "}
            y jurisdicción en la Provincia de Buenos Aires, República Argentina.
          </p>
          <p className="mt-4 text-base leading-8 text-zinc-600">
            Al acceder, registrarte, contratar una suscripción o adquirir una
            evaluación única, aceptás estos Términos y Condiciones y la Política
            de Privacidad vigente.
          </p>
        </div>

        <div className="mt-12 space-y-10">
          <Section title="1. Objeto del servicio">
            <p>
              EvaluaEmpresa es una plataforma digital orientada a ordenar,
              documentar y comparar evaluaciones estructuradas de terceros,
              incluyendo proveedores, clientes, contrapartes u otras relaciones
              comerciales o estratégicas.
            </p>
            <p>La Plataforma permite, entre otras funciones:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>registrar empresas o terceros evaluados;</li>
              <li>completar evaluaciones estructuradas por pilares;</li>
              <li>
                visualizar resultados, categorías, comparativas y hallazgos;
              </li>
              <li>
                generar reportes y, según el plan o modalidad contratada,
                exportar informes en PDF.
              </li>
            </ul>
          </Section>

          <Section title="2. Alcance del servicio">
            <p>
              La Plataforma brinda una herramienta de organización, monitoreo y
              soporte para la toma de decisiones internas.
            </p>
            <p>EvaluaEmpresa no constituye:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>asesoramiento legal;</li>
              <li>asesoramiento contable o impositivo;</li>
              <li>auditoría externa;</li>
              <li>calificación crediticia oficial;</li>
              <li>
                garantía de solvencia, cumplimiento o continuidad de ningún
                tercero;
              </li>
              <li>
                recomendación profesional obligatoria de contratación,
                continuidad, rescisión o inversión.
              </li>
            </ul>
            <p>
              Las decisiones que el Usuario adopte en base a la información
              cargada o generada en la Plataforma son de su exclusiva
              responsabilidad.
            </p>
          </Section>

          <Section title="3. Usuarios y elegibilidad">
            <p>
              Podrán utilizar la Plataforma personas humanas mayores de edad y
              personas jurídicas, a través de representantes o usuarios
              autorizados.
            </p>
            <p>El Usuario declara que:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                cuenta con capacidad legal suficiente para aceptar estos
                Términos;
              </li>
              <li>utilizará la Plataforma con fines lícitos;</li>
              <li>
                cargará información bajo su responsabilidad y con base
                razonable;
              </li>
              <li>
                no utilizará la Plataforma para infringir derechos de terceros
                ni normativa aplicable.
              </li>
            </ul>
          </Section>

          <Section title="4. Cuenta de usuario">
            <p>
              Para acceder a determinadas funcionalidades puede requerirse
              registro e inicio de sesión.
            </p>
            <p>El Usuario es responsable de:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>mantener la confidencialidad de sus credenciales;</li>
              <li>toda actividad realizada desde su cuenta;</li>
              <li>
                informar de inmediato cualquier uso no autorizado o incidente de
                seguridad.
              </li>
            </ul>
            <p>
              EvaluaEmpresa podrá suspender o restringir accesos ante indicios
              de uso indebido, fraude, incumplimiento contractual o riesgo para
              la seguridad de la Plataforma.
            </p>
          </Section>

          <Section title="5. Planes, modalidades y acceso">
            <p>
              La Plataforma puede ofrecer distintas modalidades de acceso,
              incluyendo:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>plan Free;</li>
              <li>evaluación única;</li>
              <li>plan Pro;</li>
              <li>plan Business;</li>
              <li>
                u otras modalidades que se informen en la página de planes o
                facturación.
              </li>
            </ul>
            <p>Cada modalidad puede variar en:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>cantidad de empresas permitidas;</li>
              <li>profundidad histórica visible;</li>
              <li>acceso a reportes completos;</li>
              <li>exportación a PDF;</li>
              <li>alertas persistidas;</li>
              <li>
                y otras funciones o límites informados al momento de la
                contratación.
              </li>
            </ul>
            <p>
              El detalle comercial vigente será el publicado en la Plataforma al
              momento de contratar.
            </p>
          </Section>

          <Section title="6. Evaluación única">
            <p>
              La modalidad de evaluación única permite acceder al resultado
              completo de una evaluación puntual, bajo las condiciones
              comerciales informadas al momento de la compra.
            </p>
            <p>
              La evaluación única no implica suscripción mensual, salvo
              indicación expresa en contrario.
            </p>
            <p>
              El acceso, alcance y duración de disponibilidad del resultado
              podrán estar sujetos a las condiciones informadas en checkout,
              factura o pantalla de confirmación.
            </p>
          </Section>

          <Section title="7. Suscripciones">
            <p>
              Las suscripciones pueden facturarse de forma mensual u otra
              periodicidad informada al contratar.
            </p>
            <p>Salvo indicación expresa en contrario:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                la suscripción se renueva automáticamente por períodos
                sucesivos;
              </li>
              <li>
                el Usuario puede cancelarla para evitar renovaciones futuras;
              </li>
              <li>
                la cancelación no elimina de forma retroactiva cargos ya
                devengados.
              </li>
            </ul>
            <p>
              Las condiciones de precio, facturación, moneda, impuestos,
              renovación y acceso serán las informadas al momento de contratar.
            </p>
          </Section>

          <Section title="8. Cancelación de suscripciones">
            <p>
              El Usuario puede solicitar la baja o cancelación de su suscripción
              desde los medios habilitados por la Plataforma o a través del
              canal de contacto informado por EvaluaEmpresa.
            </p>
            <p>
              La cancelación impedirá renovaciones futuras, pero no genera
              automáticamente devolución de importes ya cobrados, salvo que
              corresponda legalmente o que se indique expresamente lo contrario.
            </p>
          </Section>

          <Section title="9. Derecho de arrepentimiento">
            <p>
              En contrataciones a distancia, el Usuario consumidor puede ejercer
              el derecho de arrepentimiento dentro del plazo legal aplicable,
              conforme la normativa vigente.
            </p>
            <p>
              La Plataforma pondrá a disposición un canal específico o botón de
              arrepentimiento cuando corresponda legalmente.
            </p>
            <p>
              El ejercicio de este derecho se regirá por la normativa de defensa
              del consumidor aplicable y por la información publicada en la
              sección correspondiente del sitio.
            </p>
          </Section>

          <Section title="10. Uso permitido">
            <p>El Usuario se compromete a no:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                acceder o intentar acceder a áreas restringidas sin
                autorización;
              </li>
              <li>
                interferir con el funcionamiento técnico de la Plataforma;
              </li>
              <li>
                copiar, revender, sublicenciar o explotar comercialmente la
                Plataforma sin autorización escrita;
              </li>
              <li>
                cargar contenido ilícito, engañoso, difamatorio, malicioso o que
                viole derechos de terceros;
              </li>
              <li>
                usar la Plataforma para ingeniería inversa, scraping indebido o
                extracción no autorizada de datos.
              </li>
            </ul>
          </Section>

          <Section title="11. Información cargada por el Usuario">
            <p>
              El Usuario es responsable por la exactitud, licitud, pertinencia y
              actualización de la información que cargue en la Plataforma.
            </p>
            <p>
              EvaluaEmpresa no garantiza que la información ingresada por el
              Usuario o terceros sea exacta, completa o actualizada.
            </p>
            <p>
              El Usuario reconoce que la calidad del resultado depende en parte
              de la calidad, consistencia y suficiencia de la información
              ingresada.
            </p>
          </Section>

          <Section title="12. Propiedad intelectual">
            <p>
              La Plataforma, su diseño, estructura, marca, software, bases,
              contenidos propios, documentación, metodología, textos, gráficos e
              interfaces son propiedad de EvaluaEmpresa o de sus licenciantes y
              se encuentran protegidos por la normativa aplicable.
            </p>
            <p>
              La contratación del servicio no implica cesión de derechos de
              propiedad intelectual.
            </p>
            <p>
              El Usuario recibe únicamente una licencia limitada, no exclusiva,
              revocable e intransferible para usar la Plataforma conforme estos
              Términos.
            </p>
          </Section>

          <Section title="13. Disponibilidad y cambios del servicio">
            <p>EvaluaEmpresa podrá:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>modificar, actualizar o mejorar funciones;</li>
              <li>cambiar límites, planes o características comerciales;</li>
              <li>realizar tareas de mantenimiento;</li>
              <li>
                suspender parcialmente el servicio por razones técnicas,
                operativas o de seguridad.
              </li>
            </ul>
            <p>
              EvaluaEmpresa no garantiza disponibilidad ininterrumpida ni
              ausencia total de errores.
            </p>
          </Section>

          <Section title="14. Limitación de responsabilidad">
            <p>
              En la máxima medida permitida por la ley, EvaluaEmpresa no será
              responsable por:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                decisiones comerciales, financieras, legales o contractuales
                adoptadas por el Usuario;
              </li>
              <li>
                pérdidas indirectas, lucro cesante, daño reputacional o pérdida
                de oportunidad;
              </li>
              <li>
                errores derivados de información incompleta, inexacta o
                desactualizada cargada por el Usuario;
              </li>
              <li>
                indisponibilidades temporales, interrupciones, fallas de
                terceros proveedores o eventos fuera de su control razonable.
              </li>
            </ul>
            <p>
              En ningún caso la responsabilidad total de EvaluaEmpresa, por
              cualquier concepto vinculado con la Plataforma, podrá exceder el
              monto efectivamente abonado por el Usuario en los 6 meses
              anteriores al hecho que origine el reclamo, salvo que la normativa
              aplicable disponga otra cosa.
            </p>
          </Section>

          <Section title="15. Privacidad y datos personales">
            <p>
              El tratamiento de datos personales se rige por la Política de
              Privacidad vigente, que forma parte integrante de estos Términos.
            </p>
          </Section>

          <Section title="16. Modificaciones">
            <p>
              EvaluaEmpresa podrá actualizar estos Términos y Condiciones en
              cualquier momento.
            </p>
            <p>
              La versión vigente será la publicada en el sitio con su fecha de
              última actualización.
            </p>
            <p>
              Cuando corresponda, el uso continuado de la Plataforma luego de
              publicados cambios implicará aceptación de la nueva versión.
            </p>
          </Section>

          <Section title="17. Ley aplicable y jurisdicción">
            <p>
              Estos Términos se regirán por las leyes de la República Argentina.
            </p>
            <p>
              Para usuarios consumidores, se respetará la jurisdicción y los
              derechos que resulten irrenunciables conforme la normativa
              aplicable.
            </p>
            <p>
              Para los demás supuestos, cualquier controversia será sometida a
              los tribunales ordinarios con competencia en la Provincia de
              Buenos Aires, República Argentina, salvo norma imperativa en
              contrario.
            </p>
          </Section>

          <Section title="18. Contacto">
            <p>
              Consultas legales y contractuales:{" "}
              <span className="font-medium text-zinc-900">
                contacto@evaluaempresa.com
              </span>
            </p>
            <p>
              Soporte general:{" "}
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
