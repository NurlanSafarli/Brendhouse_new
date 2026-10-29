import type { MetadataRoute } from "next";
import { indexingEnabled, siteOrigin } from "../lib/seo";
export default function robots(): MetadataRoute.Robots {
  return indexingEnabled()
    ? {
        rules: {
          userAgent: "*",
          allow: "/",
          disallow: [
            "/api/",
            "/checkout",
            "/sebet",
            "/hesab",
            "/bonus-karti",
            "/secilmisler",
            "/design-system",
            "/axtaris",
          ],
        },
        sitemap: `${siteOrigin}/sitemap.xml`,
      }
    : { rules: { userAgent: "*", disallow: "/" } };
}
