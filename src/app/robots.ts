import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard/", "/account/", "/billing/", "/verify/"],
    },
    sitemap: "https://www.evaluaempresa.com/sitemap.xml",
  };
}
