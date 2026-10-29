"use client";
import { useState } from "react";
import type { ProductDraft } from "../lib/catalog-drafts";
async function readImage(file: File): Promise<string> {
  if (
    !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
    file.size > 5_000_000
  )
    throw new Error("JPEG, PNG və ya WebP seçin (maksimum 5 MB).");
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 900 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Şəkil emalı mümkün olmadı.");
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const data = canvas.toDataURL("image/webp", 0.8);
    if (data.length > 400_000)
      throw new Error("Şəkil önizləməsi çox böyükdür. Daha kiçik fayl seçin.");
    return data;
  } finally {
    bitmap.close();
  }
}
export function ProductMedia({
  product,
  canEdit,
  onSave,
}: {
  product: ProductDraft;
  canEdit: boolean;
  onSave: (product: ProductDraft) => boolean;
}) {
  const [media, setMedia] = useState(product.media ?? []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  return (
    <section className="panel detail-editor editor">
      <h2>Məhsul şəkilləri</h2>
      <p className="muted">
        Yalnız bu brauzerdə saxlanılan, təsdiqlənməmiş önizləmələr. Maksimum 6
        şəkil; ilk şəkil əsasdır. Orijinal fayllar serverə yüklənmir.
      </p>
      <fieldset disabled={!canEdit || busy}>
        <label>
          Şəkil əlavə et
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={media.length >= 6}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file || !canEdit || media.length >= 6) return;
              setBusy(true);
              setError("");
              setSaved(false);
              try {
                const src = await readImage(file);
                setMedia((current) => [
                  ...current,
                  { id: crypto.randomUUID(), src, alt: "" },
                ]);
              } catch (reason) {
                setError(
                  reason instanceof Error ? reason.message : "Şəkil oxunmadı.",
                );
              } finally {
                setBusy(false);
              }
            }}
          />
        </label>
        {!media.length && <p className="empty">Şəkil əlavə edilməyib.</p>}
        <div className="media-grid">
          {media.map((item, index) => (
            <div className="media-item" key={item.id}>
              {/* User-provided local data URL; no remote image optimizer is involved. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.alt || "Təsdiqlənməmiş şəkil önizləməsi"}
              />
              <span>{index === 0 ? "Əsas şəkil" : `Şəkil ${index + 1}`}</span>
              <label>
                Şəkil təsviri
                <input
                  aria-label={`Şəkil ${index + 1} təsviri`}
                  value={item.alt}
                  maxLength={160}
                  onChange={(e) => {
                    setSaved(false);
                    setMedia(
                      media.map((m) =>
                        m.id === item.id ? { ...m, alt: e.target.value } : m,
                      ),
                    );
                  }}
                />
              </label>
              <button
                className="secondary"
                disabled={index === 0}
                onClick={() => {
                  setSaved(false);
                  setMedia([item, ...media.filter((m) => m.id !== item.id)]);
                }}
              >
                Əsas şəkil et
              </button>
              <button
                className="secondary"
                aria-label={`Şəkil ${index + 1} sil`}
                onClick={() => {
                  setSaved(false);
                  setMedia(media.filter((m) => m.id !== item.id));
                }}
              >
                Sil
              </button>
            </div>
          ))}
        </div>
        <button
          className="primary"
          onClick={() => {
            if (!canEdit) return;
            if (media.some((m) => !m.alt.trim())) {
              setError("Hər şəkil üçün təsvir daxil edin.");
              return;
            }
            if (
              onSave({
                ...product,
                media: media.map((m) => ({ ...m, alt: m.alt.trim() })),
              })
            ) {
              setSaved(true);
              setError("");
            } else
              setError(
                "Şəkillər saxlanılmadı. Brauzerin yaddaş həddini yoxlayın.",
              );
          }}
        >
          Şəkilləri saxla
        </button>
      </fieldset>
      {busy && <p role="status">Şəkil hazırlanır…</p>}
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      {saved && <p role="status">Şəkil qaralaması saxlanıldı.</p>}
    </section>
  );
}
