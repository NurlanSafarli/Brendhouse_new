import { parsePrice, type ProductDraft } from "./catalog-drafts";

// Deliberately limited to basic catalog fields; variants/media are not overwritten.
export const csvHeader = "code,title,price";
export function readCatalogCsv(text: string, existing: ProductDraft[]) {
  if (text.length > 500_000) throw new Error("CSV faylı 500 KB həddini aşır.");
  const rows: string[][] = [];
  let row: string[] = [],
    cell = "",
    quoted = false,
    closed = false;
  const input = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (quoted) {
      if (char === '"' && input[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (char === '"') {
        quoted = false;
        closed = true;
      } else cell += char;
    } else if (char === "," || char === "\n") {
      row.push(cell);
      cell = "";
      closed = false;
      if (char === "\n") {
        rows.push(row);
        row = [];
      }
    } else if (char === '"' && !cell && !closed) quoted = true;
    else {
      if (closed || char === '"')
        throw new Error("CSV dırnaq formatı düzgün deyil.");
      cell += char;
    }
  }
  if (quoted) throw new Error("CSV-də bağlanmamış dırnaq var.");
  if (cell || row.length || closed) rows.push([...row, cell]);
  if (rows.shift()?.join(",") !== csvHeader)
    throw new Error("Başlıq code,title,price olmalıdır.");
  if (!rows.length || rows.length > 500)
    throw new Error("1–500 məhsul sətri daxil edin.");
  const seen = new Set<string>();
  return rows.map((values, index) => {
    const [rawCode, rawTitle, rawPrice] = values;
    const code = rawCode?.trim(),
      title = rawTitle?.trim();
    const price = parsePrice(rawPrice ?? "");
    if (
      values.length !== 3 ||
      !code ||
      code.length > 60 ||
      !title ||
      title.length > 160 ||
      price === null ||
      /^[=+@\-\t\r\n]/.test(code) ||
      /^[=+@\-\t\r\n]/.test(title)
    )
      throw new Error(`Sətir ${index + 2}: ad, kod və qiymət düzgün deyil.`);
    if (seen.has(code)) throw new Error(`Sətir ${index + 2}: təkrarlanan kod.`);
    seen.add(code);
    const old = existing.find((p) => p.code === code);
    return {
      ...old,
      id: old?.id ?? crypto.randomUUID(),
      code,
      title,
      price,
      verification: "UNVERIFIED",
      publication: "DRAFT",
    } satisfies ProductDraft;
  });
}
export function exportCatalogCsv(products: ProductDraft[]) {
  const escape = (value: string) =>
    `"${(/^[\s]*[=+@\-]/.test(value) ? "'" + value : value).replaceAll('"', '""')}"`;
  return (
    "\uFEFF" +
    csvHeader +
    "\r\n" +
    products
      .map((p) =>
        [escape(p.code), escape(p.title), (p.price / 100).toFixed(2)].join(","),
      )
      .join("\r\n")
  );
}
export function stockQuantity(value: string): number | null {
  return /^\d{1,7}$/.test(value) ? Number(value) : null;
}
