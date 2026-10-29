export const siteOrigin = "https://brendhouse.az";
/** Explicit launch switch: previews and unfinished environments stay unindexed. */
export function indexingEnabled() {
  return (
    process.env.NODE_ENV === "production" &&
    process.env.SITE_INDEXABLE === "true"
  );
}
export function safeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
