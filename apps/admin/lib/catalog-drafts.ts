export type VariantDraft = {
  id: string;
  color: string;
  size: string;
  barcode: string;
  price: number;
};
export type AttributeDraft = {
  composition: string;
  material: string;
  fit: string;
  season: string;
  care: string;
  origin: string;
};
export type ProductDraft = {
  id: string;
  title: string;
  code: string;
  price: number;
  verification: "UNVERIFIED";
  publication: "DRAFT";
  variants?: VariantDraft[];
  attributes?: AttributeDraft;
  media?: { id: string; src: string; alt: string }[];
  stockDraft?: Record<string, number>;
};
export type SizeRowDraft = {
  size: string;
  chest: string;
  waist: string;
  hips: string;
};
export type SizeGuideDraft = {
  id: string;
  category: string;
  section: "Kişi" | "Qadın" | "Uşaq";
  rows: SizeRowDraft[];
  disclaimer: string;
  verification: "UNVERIFIED";
  publication: "DRAFT";
};
export const emptyAttributes: AttributeDraft = {
  composition: "",
  material: "",
  fit: "",
  season: "",
  care: "",
  origin: "",
};
export const sizeDisclaimer =
  "Ölçülər təxmini bədən ölçüləridir, geyimin ölçüləri deyil. Brendə, modelə və fasona görə fərqlənə bilər.";
export function validBarcode(code: string) {
  if (!/^\d{13}$/.test(code)) return false;
  const sum = [...code.slice(0, 12)].reduce(
    (n, c, i) => n + Number(c) * (i % 2 ? 3 : 1),
    0,
  );
  return (10 - (sum % 10)) % 10 === Number(code[12]);
}
export function parsePrice(value: string): number | null {
  if (!/^\d{1,7}(\.\d{1,2})?$/.test(value)) return null;
  const [whole, fraction = ""] = value.split(".");
  const result = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(result) && result <= 2147483647 ? result : null;
}
export function validateVariants(
  variants: VariantDraft[],
  others: ProductDraft[],
): string | null {
  const codes = new Set(
    others.flatMap((p) => (p.variants ?? []).map((v) => v.barcode)),
  );
  const pairs = new Set<string>();
  for (const v of variants) {
    if (!v.color.trim() || !v.size.trim())
      return "Hər variant üçün rəng və ölçü daxil edin.";
    if (!validBarcode(v.barcode))
      return "EAN-13 barkodu və yoxlama rəqəmi düzgün deyil.";
    if (codes.has(v.barcode)) return "Barkod başqa variantda istifadə olunur.";
    codes.add(v.barcode);
    const pair = JSON.stringify([
      v.color.trim().toLocaleLowerCase("az"),
      v.size.trim().toLocaleLowerCase("az"),
    ]);
    if (pairs.has(pair)) return "Eyni rəng və ölçü bir dəfə əlavə edilə bilər.";
    pairs.add(pair);
    if (!Number.isSafeInteger(v.price) || v.price < 0 || v.price > 2147483647)
      return "Variant qiyməti düzgün deyil.";
  }
  return null;
}
function validRange(value: string) {
  if (!/^\d{1,3}(\.\d)?(-\d{1,3}(\.\d)?)?$/.test(value)) return false;
  const values = value.split("-").map(Number);
  return (
    values.every((v) => v > 0) &&
    (values.length === 1 || values[0] <= values[1])
  );
}
export function validateSizeGuide(guide: SizeGuideDraft): string | null {
  if (!guide.category.trim() || !guide.disclaimer.trim() || !guide.rows.length)
    return "Kateqoriya, izah və ən azı bir ölçü sətri daxil edin.";
  const sizes = new Set<string>();
  for (const row of guide.rows) {
    const size = row.size.trim().toLocaleUpperCase("az");
    if (!size || sizes.has(size))
      return "Ölçülər boş və ya təkrarlanan ola bilməz.";
    sizes.add(size);
    if (!row.chest && !row.waist && !row.hips)
      return "Ən azı bir bədən ölçüsü daxil edin.";
    if ([row.chest, row.waist, row.hips].some((v) => v && !validRange(v)))
      return "Ölçü müsbət ədəd və ya artan aralıq olmalıdır (sm).";
  }
  return null;
}
