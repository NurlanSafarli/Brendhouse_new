import { describe, expect, it } from "vitest";
import {
  exportCatalogCsv,
  readCatalogCsv,
  stockQuantity,
} from "./catalog-transfer";
describe("local catalog transfer", () => {
  it("parses quoted Azerbaijani fields and preserves existing variant and stock data", () => {
    const first = readCatalogCsv(
      'code,title,price\r\nA,"Köynək, ağ",12.35',
      [],
    );
    first[0].stockDraft = { variant: 4 };
    const second = readCatalogCsv(
      'code,title,price\nA,"Yeni ""ad""",14',
      first,
    );
    expect(second[0]).toMatchObject({
      id: first[0].id,
      title: 'Yeni "ad"',
      price: 1400,
      stockDraft: { variant: 4 },
      verification: "UNVERIFIED",
      publication: "DRAFT",
    });
    expect(readCatalogCsv(exportCatalogCsv(second), [])).toMatchObject([
      { code: "A", title: 'Yeni "ad"', price: 1400 },
    ]);
  });
  it("rejects invalid prices, malformed quoting, duplicate IDs and spreadsheet formulas", () => {
    for (const csv of [
      "A,Ad,1.001",
      'A,"Ad,1',
      'A,"Ad"x,1',
      "A,Ad,1\nA,Ad,2",
      "=X,Ad,1",
      "A,=cmd,1",
    ])
      expect(() => readCatalogCsv("code,title,price\n" + csv, [])).toThrow();
  });
  it("does not conflate unknown, negative or fractional stock with zero", () => {
    expect(stockQuantity("0")).toBe(0);
    expect(stockQuantity("12")).toBe(12);
    for (const value of ["", "-1", "1.5", "1e2", "10000000"])
      expect(stockQuantity(value)).toBeNull();
  });
});
