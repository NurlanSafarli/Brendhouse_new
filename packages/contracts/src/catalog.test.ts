import { describe, it, expect } from "vitest";
import { catalogQuery, foldAz, isPublicProduct } from "./catalog";
describe("catalog public boundary", () => {
  it("folds Azerbaijani letters and dotted case consistently", () => {
    expect(foldAz("Ə İ ı Ş Ç Ğ Ö Ü")).toBe("e i i s c g o u");
  });
  it("normalizes filters and rejects unknown/invalid values", () => {
    expect(
      catalogQuery({
        q: "  köynək ",
        sort: "script",
        min: "0005",
        max: "-1",
        page: "2",
        unexpected: "x",
      }).toString(),
    ).toBe("q=k%C3%B6yn%C9%99k&min=5&page=2");
  });
  it("rejects unpublished, development and malformed records", () => {
    for (const input of [
      null,
      {},
      { verification: "UNVERIFIED" },
      {
        verification: "VERIFIED",
        publication: "PUBLISHED",
        developmentOnly: true,
      },
    ])
      expect(isPublicProduct(input)).toBe(false);
  });
  it("requires validated stock, price and verified attributes", () => {
    const product = {
      id: "test-only",
      slug: "test-only",
      code: "TEST",
      title: "Test fixture",
      section: "test",
      category: "test",
      verification: "VERIFIED",
      publication: "PUBLISHED",
      developmentOnly: false,
      variants: [
        { id: "test", color: "test", size: "test", price: 100, available: 1 },
      ],
      attributes: [],
    };
    expect(isPublicProduct(product)).toBe(true);
    expect(
      isPublicProduct({
        ...product,
        variants: [{ ...product.variants[0], available: -1 }],
      }),
    ).toBe(false);
    expect(
      isPublicProduct({
        ...product,
        attributes: [
          { key: "fit", value: "x", label: "Fit", verification: "UNVERIFIED" },
        ],
      }),
    ).toBe(false);
  });
});
