"use client";
import { useState } from "react";
import type { ProductDraft } from "../lib/catalog-drafts";
import {
  csvHeader,
  exportCatalogCsv,
  readCatalogCsv,
} from "../lib/catalog-transfer";
export function CatalogTransfer({
  products,
  canEdit,
  onSave,
}: {
  products: ProductDraft[];
  canEdit: boolean;
  onSave: (products: ProductDraft[]) => boolean;
}) {
  const [source, setSource] = useState("");
  const [preview, setPreview] = useState<ProductDraft[]>([]);
  const [error, setError] = useState("");
  function download(content: string, name: string) {
    const url = URL.createObjectURL(
      new Blob([content], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <section className="panel editor">
      <h2>Kataloq CSV-si</h2>
      <p className="muted">
        Yalnız kod, ad və qiymət (₼). Eyni kod yenilənir; variantlar, şəkillər
        və stok saxlanılır. Bütün nəticələr təsdiqlənməmiş lokal qaralamadır.
      </p>
      <div className="transfer-actions">
        <button
          className="secondary"
          onClick={() => download(csvHeader + "\r\n", "catalog-template.csv")}
        >
          Boş şablon
        </button>
        <button
          className="secondary"
          disabled={!products.length}
          onClick={() =>
            download(exportCatalogCsv(products), "unverified-catalog.csv")
          }
        >
          CSV ixrac et
        </button>
      </div>
      <label>
        CSV faylı
        <input
          type="file"
          accept=".csv,text/csv"
          disabled={!canEdit}
          onChange={async (e) => {
            setPreview([]);
            setError("");
            setSource("");
            const file = e.target.files?.[0];
            if (!file) return;
            try {
              if (file.size > 500_000)
                throw new Error("CSV faylı 500 KB həddini aşır.");
              setSource(await file.text());
            } catch (reason) {
              setError(
                reason instanceof Error ? reason.message : "Fayl oxunmadı.",
              );
            }
          }}
        />
      </label>
      <label>
        CSV məzmunu
        <textarea
          aria-label="CSV məzmunu"
          value={source}
          disabled={!canEdit}
          onChange={(e) => {
            setSource(e.target.value);
            setPreview([]);
            setError("");
          }}
          maxLength={500000}
        />
      </label>
      <button
        className="secondary"
        disabled={!canEdit || !source}
        onClick={() => {
          try {
            setPreview(readCatalogCsv(source, products));
            setError("");
          } catch (reason) {
            setPreview([]);
            setError((reason as Error).message);
          }
        }}
      >
        İdxalı yoxla
      </button>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      {!!preview.length && (
        <>
          <p>
            {preview.length} sətir yoxlanıldı.{" "}
            {
              preview.filter((p) => products.some((old) => old.code === p.code))
                .length
            }{" "}
            mövcud məhsul yenilənəcək.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Kod</th>
                  <th>Ad</th>
                  <th>Qiymət</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((p) => (
                  <tr key={p.code}>
                    <td>{p.code}</td>
                    <td>{p.title}</td>
                    <td>{(p.price / 100).toFixed(2)} ₼</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            className="primary"
            disabled={!canEdit}
            onClick={() => {
              if (!canEdit) return;
              // Revalidate against current state so a prior preview never overwrites newer variant edits.
              try {
                const updates = readCatalogCsv(source, products);
                if (
                  onSave([
                    ...products.filter(
                      (p) => !updates.some((u) => u.code === p.code),
                    ),
                    ...updates,
                  ])
                ) {
                  setSource("");
                  setPreview([]);
                }
              } catch (reason) {
                setError((reason as Error).message);
              }
            }}
          >
            Qaralamalara idxal et
          </button>
        </>
      )}
    </section>
  );
}
