import type { MetadataRoute } from "next";
import { absolutePublicUrl } from "@/seo/config";

export default function robots(): MetadataRoute.Robots {
  const sitemap = absolutePublicUrl("/sitemap.xml");
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/admin/", "/admin-access-denied", "/buscar", "/go/"] }],
    ...(sitemap ? { sitemap } : {}),
  };
}
