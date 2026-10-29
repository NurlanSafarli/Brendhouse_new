import type { MetadataRoute } from "next";
import { indexingEnabled, siteOrigin } from "../lib/seo";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!indexingEnabled()) return [];
  return [
    "/",
    "/haqqimizda",
    "/elaqe",
    "/faq",
    "/catdirilma-qaytarma",
    "/bonus-qaydalari",
  ].map((path) => ({ url: `${siteOrigin}${path}` }));
}
