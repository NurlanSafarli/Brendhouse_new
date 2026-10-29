"use client";
import { useState } from "react";
import type { ProductDraft } from "../lib/catalog-drafts";
import { stockQuantity } from "../lib/catalog-transfer";
export function Inventory({
  products,
  canEdit,
  onSave,
}: {
  products: ProductDraft[];
  canEdit: boolean;
  onSave: (product: ProductDraft) => boolean;
}) {
  const [query, setQuery] = useState("");
  return (
    <section className="panel editor">
      <h2>Variant üzrə stok qaralaması</h2>
      <p className="muted">
        Daxil edilməmiş miqdar naməlumdur. Rəqəmlər təsdiqlənməyib; filial,
        rezerv və real stok sinxronizasiyası qoşulmayıb.
      </p>
      <label>
        Stokda axtar
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Kod, rəng, ölçü və ya barkod"
        />
      </label>
      {!products.some((p) => p.variants?.length) && (
        <p className="empty">Əvvəlcə məhsula variant əlavə edin.</p>
      )}
      {products.flatMap((p) =>
        (p.variants ?? [])
          .filter((v) =>
            `${p.title} ${p.code} ${v.color} ${v.size} ${v.barcode}`
              .toLocaleLowerCase("az")
              .includes(query.toLocaleLowerCase("az")),
          )
          .map((v) => (
            <StockRow
              key={`${v.id}:${p.stockDraft?.[v.id] ?? "unknown"}`}
              title={`${p.code} · ${v.color} · ${v.size}`}
              barcode={v.barcode}
              quantity={p.stockDraft?.[v.id]}
              canEdit={canEdit}
              save={(quantity) =>
                onSave({
                  ...p,
                  stockDraft: { ...p.stockDraft, [v.id]: quantity },
                })
              }
            />
          )),
      )}
    </section>
  );
}
function StockRow({
  title,
  barcode,
  quantity,
  canEdit,
  save,
}: {
  title: string;
  barcode: string;
  quantity?: number;
  canEdit: boolean;
  save: (quantity: number) => boolean;
}) {
  const [value, setValue] = useState(quantity?.toString() ?? "");
  const [error, setError] = useState("");
  return (
    <form
      className="stock-row"
      onSubmit={(e) => {
        e.preventDefault();
        if (!canEdit) return;
        const number = stockQuantity(value);
        if (number === null) {
          setError("0–9999999 arası tam ədəd daxil edin.");
          return;
        }
        if (save(number)) setError("");
      }}
    >
      <div>
        <h3>{title}</h3>
        <p>{barcode}</p>
        <small>
          {quantity === undefined
            ? "Miqdar daxil edilməyib"
            : `Təsdiqlənməmiş miqdar: ${quantity}`}
        </small>
      </div>
      <label>
        Miqdar
        <input
          aria-label={`${title} miqdar`}
          inputMode="numeric"
          value={value}
          disabled={!canEdit}
          onChange={(e) => setValue(e.target.value)}
        />
      </label>
      <button className="secondary" disabled={!canEdit}>
        Stoku saxla
      </button>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
    </form>
  );
}
