import { describe, it, expect } from "vitest";
import {
  validBarcode,
  parsePrice,
  validateVariants,
  validateSizeGuide,
  sizeDisclaimer,
  type SizeGuideDraft,
} from "./catalog-drafts";
const variant = {
  id: "v1",
  color: "Krem",
  size: "M",
  barcode: "2000000000015",
  price: 2790,
};
describe("admin catalog draft validation", () => {
  it("validates EAN-13 checksum and integer money without rounding extra decimals", () => {
    expect(validBarcode("2000000000015")).toBe(true);
    expect(validBarcode("2000000000016")).toBe(false);
    expect(parsePrice("27.90")).toBe(2790);
    expect(parsePrice("0.01")).toBe(1);
    for (const value of ["27.999", "-1", "1e3", "Infinity", ""])
      expect(parsePrice(value)).toBeNull();
  });
  it("rejects duplicate combinations and cross-product barcodes", () => {
    expect(validateVariants([variant], [])).toBeNull();
    expect(
      validateVariants(
        [
          variant,
          { ...variant, id: "v2", barcode: "2000000000022", color: "krem" },
        ],
        [],
      ),
    ).toContain("Eyni rəng");
    expect(
      validateVariants(
        [variant],
        [
          {
            id: "p2",
            title: "Test",
            code: "TEST",
            price: 100,
            variants: [variant],
            verification: "UNVERIFIED",
            publication: "DRAFT",
          },
        ],
      ),
    ).toContain("Barkod");
  });
  it("requires measurements, ascending ranges, unique sizes and disclaimer", () => {
    const guide: SizeGuideDraft = {
      id: "g",
      category: "Polo",
      section: "Kişi",
      disclaimer: sizeDisclaimer,
      rows: [{ size: "M", chest: "95-101", waist: "", hips: "" }],
      verification: "UNVERIFIED",
      publication: "DRAFT",
    };
    expect(validateSizeGuide(guide)).toBeNull();
    expect(
      validateSizeGuide({
        ...guide,
        rows: [{ ...guide.rows[0], chest: "101-95" }],
      }),
    ).toContain("artan aralıq");
    expect(
      validateSizeGuide({ ...guide, rows: [...guide.rows, ...guide.rows] }),
    ).toContain("təkrarlanan");
    expect(validateSizeGuide({ ...guide, disclaimer: "" })).not.toBeNull();
  });
});
