export type CatalogVariant = {
  id: string;
  color: string;
  size: string;
  price: number;
  oldPrice?: number;
  available: number;
};
export type CatalogProduct = {
  id: string;
  slug: string;
  code: string;
  title: string;
  section: string;
  category: string;
  description?: string;
  verification: "VERIFIED";
  publication: "PUBLISHED";
  developmentOnly: false;
  variants: CatalogVariant[];
  attributes: {
    key: string;
    label: string;
    value: string;
    verification: "VERIFIED";
  }[];
};
export type CatalogResult = {
  items: CatalogProduct[];
  total: number;
  nextPage: number | null;
};
export function foldAz(value: string) {
  return value
    .toLocaleLowerCase("az")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ə/g, "e")
    .replace(/ı/g, "i")
    .trim();
}
export function catalogQuery(
  input: Record<string, string | string[] | undefined>,
) {
  const value = (key: string) =>
    typeof input[key] === "string" ? (input[key] as string) : "";
  const params = new URLSearchParams();
  for (const key of ["q", "category", "size", "color", "branch"]) {
    const v = value(key).trim().slice(0, 100);
    if (v) params.set(key, v);
  }
  const sort = value("sort");
  if (["price-asc", "price-desc", "newest"].includes(sort))
    params.set("sort", sort);
  for (const key of ["min", "max"]) {
    const v = value(key);
    if (/^\d+$/.test(v) && Number(v) <= 2147483647)
      params.set(key, String(Number(v)));
  }
  const page = Number(value("page"));
  if (Number.isInteger(page) && page > 1 && page <= 1000)
    params.set("page", String(page));
  return params;
}
/** Reject unsafe or malformed API payloads at the public boundary. */
export function isPublicProduct(value: unknown): value is CatalogProduct {
  if (!value || typeof value !== "object") return false;
  const p = value as CatalogProduct;
  return (
    p.verification === "VERIFIED" &&
    p.publication === "PUBLISHED" &&
    p.developmentOnly === false &&
    ["id", "slug", "code", "title", "section", "category"].every(
      (k) => typeof (p as unknown as Record<string, unknown>)[k] === "string",
    ) &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug) &&
    Array.isArray(p.variants) &&
    p.variants.length > 0 &&
    p.variants.every(
      (v) =>
        v &&
        typeof v.id === "string" &&
        typeof v.color === "string" &&
        typeof v.size === "string" &&
        Number.isSafeInteger(v.price) &&
        v.price >= 0 &&
        Number.isSafeInteger(v.available) &&
        v.available >= 0 &&
        (v.oldPrice === undefined ||
          (Number.isSafeInteger(v.oldPrice) && v.oldPrice >= v.price)),
    ) &&
    Array.isArray(p.attributes) &&
    p.attributes.every(
      (a) =>
        a &&
        a.verification === "VERIFIED" &&
        typeof a.key === "string" &&
        typeof a.label === "string" &&
        typeof a.value === "string",
    ) &&
    (p.description === undefined || typeof p.description === "string")
  );
}
