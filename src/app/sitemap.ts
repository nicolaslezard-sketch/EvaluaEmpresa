import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.evaluaempresa.com";

  const routes = [
    "",
    "/pricing",
    "/metodologia",
    "/informe-modelo",
    "/faq",
    "/como-funciona",
    "/terminos",
    "/privacidad",
    "/arrepentimiento",
    "/evaluacion-de-proveedores",
    "/monitoreo-de-terceros",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
