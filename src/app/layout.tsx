import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.evaluaempresa.com"),
  title: {
    default:
      "EvaluaEmpresa | Evaluación de proveedores y monitoreo de terceros",
    template: "%s | EvaluaEmpresa",
  },
  description:
    "Software para evaluar proveedores, clientes y contrapartes con una metodología estructurada, comparativa entre ciclos y salida ejecutiva clara.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "EvaluaEmpresa | Evaluación de proveedores y monitoreo de terceros",
    description:
      "Ordená la evaluación de terceros, compará ciclos y detectá deterioros antes de que se conviertan en un problema real.",
    url: "https://www.evaluaempresa.com",
    siteName: "EvaluaEmpresa",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EvaluaEmpresa | Evaluación de proveedores y monitoreo de terceros",
    description:
      "Evaluación estructurada de terceros con comparativa entre ciclos y salida ejecutiva clara.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-zinc-50 text-zinc-900 antialiased`}
      >
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
