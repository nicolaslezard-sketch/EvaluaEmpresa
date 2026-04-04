import Link from "next/link";

export default function LegalCheckoutNotice({
  className = "mt-3 max-w-2xl text-xs leading-5 text-zinc-500",
}: {
  className?: string;
}) {
  return (
    <p className={className}>
      Al continuar, aceptás los{" "}
      <Link
        href="/terminos"
        className="underline underline-offset-2 hover:text-zinc-700"
      >
        Términos y Condiciones
      </Link>{" "}
      y la{" "}
      <Link
        href="/privacidad"
        className="underline underline-offset-2 hover:text-zinc-700"
      >
        Política de Privacidad
      </Link>
      . Si la contratación se realiza a distancia, también podés consultar el{" "}
      <Link
        href="/arrepentimiento"
        className="underline underline-offset-2 hover:text-zinc-700"
      >
        Botón de Arrepentimiento
      </Link>
      .
    </p>
  );
}
