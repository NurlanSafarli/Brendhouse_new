import { describe, it, expect } from "vitest";
import { validEan13, validateRow, variantData } from "./catalog";
const row = {
  sourceId: "1",
  code: "X",
  slug: "kisi-polo",
  title: "Kişi polo köynəyi",
  variants: [
    { barcode: "2000000000015", color: "Krem", size: "M", price: 2790 },
  ],
};
describe("import boundary", () => {
  it("checks barcode checksums", () => {
    expect(validEan13("2000000000015")).toBe(true);
    expect(validEan13("2000000000016")).toBe(false);
    expect(validEan13("123")).toBe(false);
  });
  it("accepts normalized source data", () =>
    expect(validateRow(row)).toBe(true));
  it("quarantines malformed fields and duplicate variants", () => {
    expect(
      validateRow({ ...row, variants: [...row.variants, ...row.variants] }),
    ).toBe(false);
    expect(validateRow({ ...row, slug: "Kişi polo" })).toBe(false);
    expect(
      validateRow({ ...row, variants: [{ ...row.variants[0], price: 27.9 }] }),
    ).toBe(false);
    expect(validateRow(null)).toBe(false);
  });
});

it("rejects blank identities and PostgreSQL integer overflow", () => {
  expect(validateRow({ ...row, sourceId: "   " })).toBe(false);
  expect(
    validateRow({
      ...row,
      variants: [{ ...row.variants[0], price: 2147483648 }],
    }),
  ).toBe(false);
});
it("drops imported database identifiers and nested relation operations", () => {
  const external = {
    ...row.variants[0],
    productId: "other-product",
    id: "other-variant",
    balances: { deleteMany: {} },
  };
  expect(variantData(external)).toEqual(row.variants[0]);
});
