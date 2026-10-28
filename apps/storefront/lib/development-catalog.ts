import type { CatalogProduct } from "@brendhouse/contracts";
/** Explicitly authorized temporary records. Never eligible for production publication. */
export const developmentCatalog: CatalogProduct[] = [
  ["kisi", "Klassik kişi polo köynəyi", "Polo", "Krem", 2790],
  ["qadin", "Qadın köynəyi", "Köynək", "Ağ", 3490],
  ["usaq", "Uşaq sweatshirtü", "Sweatshirt", "Bej", 2290],
  ["qadin", "Qadın şalvarı", "Şalvar", "Qara", 3990],
].map(([section, title, category, color, price], index) => ({
  id: `dev-${index}`,
  slug: `unverified-product-${index}`,
  code: `UNVERIFIED-${index}`,
  title: String(title),
  section: String(section),
  category: String(category),
  verification: "UNVERIFIED",
  publication: "DRAFT",
  developmentOnly: true,
  attributes: [],
  variants: ["S", "M", "L"].map((size, i) => ({
    id: `dev-${index}-${size}`,
    size,
    color: String(color),
    price: Number(price),
    available: i === 2 ? 0 : 5,
  })),
}));
export function developmentCatalogEnabled() {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.ENABLE_UNVERIFIED_CATALOG === "true"
  );
}
