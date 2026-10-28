import type { PrismaClient } from "@prisma/client";
export type ImportRow = {
  sourceId: string;
  code: string;
  slug: string;
  title: string;
  variants: { barcode: string; color: string; size: string; price: number }[];
};
export function validEan13(value: string) {
  if (typeof value !== "string" || !/^\d{13}$/.test(value)) return false;
  const sum = [...value.slice(0, 12)].reduce(
    (n, c, i) => n + Number(c) * (i % 2 ? 3 : 1),
    0,
  );
  return (10 - (sum % 10)) % 10 === Number(value[12]);
}
export function validateRow(value: unknown): value is ImportRow {
  if (!value || typeof value !== "object") return false;
  const r = value as ImportRow;
  return (
    typeof r.sourceId === "string" &&
    r.sourceId.length > 0 &&
    typeof r.code === "string" &&
    r.code.length > 0 &&
    typeof r.slug === "string" &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(r.slug) &&
    typeof r.title === "string" &&
    r.title.trim().length > 0 &&
    Array.isArray(r.variants) &&
    r.variants.length > 0 &&
    r.variants.every(
      (v) =>
        v &&
        validEan13(v.barcode) &&
        typeof v.color === "string" &&
        !!v.color &&
        typeof v.size === "string" &&
        !!v.size &&
        Number.isSafeInteger(v.price) &&
        v.price >= 0,
    ) &&
    new Set(r.variants.map((v) => v.barcode)).size === r.variants.length &&
    new Set(r.variants.map((v) => `${v.color}\u0000${v.size}`)).size ===
      r.variants.length
  );
}
/** Imports are quarantined as draft/unverified. They cannot retain prior approval. */
export async function importCatalog(
  db: PrismaClient,
  source: string,
  rows: unknown[],
  developmentOnly = false,
) {
  if (!source.trim()) throw new Error("Source is required");
  let accepted = 0;
  const errors: { row: number; reason: string }[] = [];
  for (const [index, row] of rows.entries()) {
    if (!validateRow(row)) {
      errors.push({
        row: index + 1,
        reason: "Invalid required fields, duplicate variant, price or EAN-13",
      });
      continue;
    }
    try {
      await db.$transaction(async (tx) => {
        const product = await tx.product.upsert({
          where: { source_sourceId: { source, sourceId: row.sourceId } },
          create: {
            source,
            sourceId: row.sourceId,
            code: row.code,
            slug: row.slug,
            developmentOnly,
          },
          update: {
            code: row.code,
            slug: row.slug,
            verification: "UNVERIFIED",
            publication: "DRAFT",
            verifiedBy: null,
            verifiedAt: null,
            developmentOnly,
          },
        });
        await tx.productTranslation.upsert({
          where: { productId_locale: { productId: product.id, locale: "az" } },
          create: { productId: product.id, locale: "az", title: row.title },
          update: { title: row.title },
        });
        for (const variant of row.variants) {
          await tx.variant.upsert({
            where: {
              productId_color_size: {
                productId: product.id,
                color: variant.color,
                size: variant.size,
              },
            },
            create: { productId: product.id, ...variant },
            update: variant,
          });
        }
        await tx.outboxEvent.create({
          data: {
            topic: "catalog.invalidate",
            aggregateId: product.id,
            payload: { productId: product.id },
          },
        });
      });
      accepted++;
    } catch {
      errors.push({
        row: index + 1,
        reason: "Database conflict; row rolled back",
      });
    }
  }
  return db.importRun.create({
    data: { source, accepted, rejected: errors.length, errors },
  });
}
export const publicProductWhere = {
  verification: "VERIFIED" as const,
  publication: "PUBLISHED" as const,
  developmentOnly: false,
};
