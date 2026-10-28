import {
  developmentCatalog,
  developmentCatalogEnabled,
} from "./development-catalog";
import { foldAz } from "@brendhouse/contracts";
import {
  isPublicProduct,
  type CatalogProduct,
  type CatalogResult,
} from "@brendhouse/contracts";
export type LoadResult<T> =
  | { status: "ready"; data: T }
  | { status: "unavailable" }
  | { status: "missing" };
async function request(path: string): Promise<LoadResult<unknown>> {
  const origin = process.env.COMMERCE_API_URL;
  if (!origin) return { status: "unavailable" };
  try {
    const response = await fetch(`${origin.replace(/\/$/, "")}/api/v1${path}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (response.status === 404) return { status: "missing" };
    if (!response.ok) return { status: "unavailable" };
    return { status: "ready", data: await response.json() };
  } catch {
    return { status: "unavailable" };
  }
}
export async function listProducts(
  query: URLSearchParams,
): Promise<LoadResult<CatalogResult>> {
  if (developmentCatalogEnabled()) {
    let items = developmentCatalog.filter(
      (p) =>
        (!query.get("section") || p.section === query.get("section")) &&
        (!query.get("q") ||
          foldAz(`${p.title} ${p.code}`).includes(foldAz(query.get("q")!))) &&
        (!query.get("size") ||
          p.variants.some((v) => v.size === query.get("size"))) &&
        (!query.get("color") ||
          p.variants.some(
            (v) => foldAz(v.color) === foldAz(query.get("color")!),
          )),
    );
    if (query.get("sort") === "price-asc")
      items = items.toSorted(
        (a, b) => a.variants[0].price - b.variants[0].price,
      );
    if (query.get("sort") === "price-desc")
      items = items.toSorted(
        (a, b) => b.variants[0].price - a.variants[0].price,
      );
    return {
      status: "ready",
      data: { items, total: items.length, nextPage: null },
    };
  }
  const result = await request(`/catalog?${query}`);
  if (result.status !== "ready") return result;
  const payload = result.data as CatalogResult;
  if (
    !payload ||
    !Array.isArray(payload.items) ||
    !payload.items.every(isPublicProduct) ||
    !Number.isSafeInteger(payload.total) ||
    payload.total < 0 ||
    !(
      payload.nextPage === null ||
      (Number.isSafeInteger(payload.nextPage) && payload.nextPage > 0)
    )
  )
    return { status: "unavailable" };
  return { status: "ready", data: payload };
}
export async function getProduct(
  slug: string,
): Promise<LoadResult<CatalogProduct>> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return { status: "missing" };
  if (developmentCatalogEnabled()) {
    const product = developmentCatalog.find((p) => p.slug === slug);
    return product ? { status: "ready", data: product } : { status: "missing" };
  }
  const result = await request(`/catalog/${encodeURIComponent(slug)}`);
  if (result.status !== "ready") return result;
  return isPublicProduct(result.data)
    ? { status: "ready", data: result.data }
    : { status: "unavailable" };
}
