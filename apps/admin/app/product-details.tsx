"use client";
import { useState } from "react";
import {
  emptyAttributes,
  parsePrice,
  validateVariants,
  type ProductDraft,
  type VariantDraft,
} from "../lib/catalog-drafts";
export function ProductDetails({
  product,
  products,
  canEdit,
  onSave,
  onClose,
}: {
  product: ProductDraft;
  products: ProductDraft[];
  canEdit: boolean;
  onSave: (product: ProductDraft) => boolean;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(product.title);
  const [code, setCode] = useState(product.code);
  const [price, setPrice] = useState((product.price / 100).toFixed(2));
  const [variants, setVariants] = useState<VariantDraft[]>(
    product.variants ?? [],
  );
  const [attributes, setAttributes] = useState({
    ...emptyAttributes,
    ...product.attributes,
  });
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  function update(id: string, key: keyof VariantDraft, value: string) {
    setVariants((rows) =>
      rows.map((v) =>
        v.id === id
          ? { ...v, [key]: key === "price" ? (parsePrice(value) ?? -1) : value }
          : v,
      ),
    );
    setSaved(false);
  }
  return (
    <section className="panel detail-editor">
      <div className="editor-heading">
        <h2>Məhsulu redaktə et</h2>
        <button className="secondary" onClick={onClose}>
          Bağla
        </button>
      </div>
      <form
        className="editor"
        onSubmit={(e) => {
          e.preventDefault();
          if (!canEdit) return;
          const amount = parsePrice(price);
          if (
            !title.trim() ||
            !code.trim() ||
            amount === null ||
            products.some((p) => p.id !== product.id && p.code === code.trim())
          ) {
            setError("Ad, unikal kod və düzgün qiymət daxil edin.");
            return;
          }
          const problem = validateVariants(
            variants,
            products.filter((p) => p.id !== product.id),
          );
          if (problem) {
            setError(problem);
            return;
          }
          const success = onSave({
            ...product,
            title: title.trim(),
            code: code.trim(),
            price: amount,
            variants: variants.map((v) => ({
              ...v,
              color: v.color.trim(),
              size: v.size.trim(),
            })),
            attributes,
            verification: "UNVERIFIED",
            publication: "DRAFT",
          });
          if (success) {
            setSaved(true);
            setError("");
          } else setError("Dəyişikliklər saxlanılmadı.");
        }}
      >
        <fieldset disabled={!canEdit}>
          <div className="fields-grid">
            <label>
              Redaktə: məhsul adı
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={160}
              />
            </label>
            <label>
              Redaktə: kod
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                maxLength={60}
              />
            </label>
            <label>
              Redaktə: qiymət (₼)
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                inputMode="decimal"
                required
              />
            </label>
          </div>
          <h3>Rəng və ölçü variantları</h3>
          {variants.length === 0 && (
            <p className="muted">
              Variant əlavə edilməyib. Barkod və qiymət daxil etdikdən sonra
              qaralamanı saxlayın.
            </p>
          )}
          {variants.map((v, i) => (
            <div className="variant-editor" key={v.id}>
              <label>
                Rəng {i + 1}
                <input
                  value={v.color}
                  onChange={(e) => update(v.id, "color", e.target.value)}
                  required
                  maxLength={60}
                />
              </label>
              <label>
                Ölçü {i + 1}
                <input
                  value={v.size}
                  onChange={(e) => update(v.id, "size", e.target.value)}
                  required
                  maxLength={30}
                />
              </label>
              <label>
                EAN-13 {i + 1}
                <input
                  value={v.barcode}
                  inputMode="numeric"
                  maxLength={13}
                  onChange={(e) =>
                    update(v.id, "barcode", e.target.value.replace(/\D/g, ""))
                  }
                  required
                />
              </label>
              <label>
                Variant qiyməti {i + 1}
                <input
                  type="number"
                  min="0"
                  max="21474836.47"
                  step="0.01"
                  defaultValue={(v.price / 100).toFixed(2)}
                  onChange={(e) => update(v.id, "price", e.target.value)}
                  required
                />
              </label>
              <button
                className="secondary"
                type="button"
                aria-label={`Variant ${i + 1} sil`}
                onClick={() =>
                  setVariants((rows) => rows.filter((row) => row.id !== v.id))
                }
              >
                Sil
              </button>
            </div>
          ))}
          <button
            type="button"
            className="secondary"
            onClick={() =>
              setVariants((rows) => [
                ...rows,
                {
                  id: crypto.randomUUID(),
                  color: "",
                  size: "",
                  barcode: "",
                  price: parsePrice(price) ?? 0,
                },
              ])
            }
          >
            Variant əlavə et
          </button>
          <h3>Strukturlaşdırılmış məlumatlar</h3>
          <p className="muted">
            Daxil edilən bütün məlumatlar təsdiqlənməmiş qalır. Boş sahələr
            ictimai kataloqda göstərilməməlidir.
          </p>
          <div className="fields-grid">
            {(
              [
                ["composition", "Parça tərkibi"],
                ["material", "Material və toxunuş"],
                ["fit", "Fason"],
                ["season", "Mövsüm"],
                ["care", "Qulluq təlimatı"],
                ["origin", "Mənşə ölkəsi"],
              ] as const
            ).map(([key, label]) => (
              <label key={key}>
                {label}
                <textarea
                  aria-label={label}
                  value={attributes[key]}
                  onChange={(e) =>
                    setAttributes({ ...attributes, [key]: e.target.value })
                  }
                  maxLength={2000}
                />
              </label>
            ))}
          </div>
        </fieldset>
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        {saved && (
          <p role="status" className="save-notice">
            Məhsul dəyişiklikləri lokal qaralamada saxlanıldı.
          </p>
        )}
        <button className="primary" disabled={!canEdit}>
          Dəyişiklikləri saxla
        </button>
      </form>
    </section>
  );
}
