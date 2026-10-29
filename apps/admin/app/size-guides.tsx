"use client";
import { useState } from "react";
import {
  sizeDisclaimer,
  validateSizeGuide,
  type SizeGuideDraft,
} from "../lib/catalog-drafts";
function blank(): SizeGuideDraft {
  return {
    id: "",
    category: "",
    section: "Kişi",
    rows: [],
    disclaimer: sizeDisclaimer,
    verification: "UNVERIFIED",
    publication: "DRAFT",
  };
}
export function SizeGuides({
  guides,
  canEdit,
  onSave,
}: {
  guides: SizeGuideDraft[];
  canEdit: boolean;
  onSave: (guide: SizeGuideDraft) => boolean;
}) {
  const [draft, setDraft] = useState<SizeGuideDraft>(blank);
  const [error, setError] = useState("");
  return (
    <div className="editor-grid">
      <section className="panel">
        <h2>Ölçü cədvəlləri</h2>
        {guides.length ? (
          guides.map((guide) => (
            <article className="guide-list-item" key={guide.id}>
              <h3>
                {guide.section} · {guide.category}
              </h3>
              <p>{guide.rows.length} ölçü · Təsdiqlənməyib</p>
              <button
                className="secondary"
                onClick={() => {
                  setDraft(structuredClone(guide));
                  setError("");
                }}
              >
                Cədvəli aç
              </button>
            </article>
          ))
        ) : (
          <p className="empty">Ölçü cədvəli əlavə edilməyib.</p>
        )}
      </section>
      <form
        className="panel editor"
        onSubmit={(e) => {
          e.preventDefault();
          if (!canEdit) return;
          const problem = validateSizeGuide(draft);
          if (problem) {
            setError(problem);
            return;
          }
          if (
            guides.some(
              (g) =>
                g.id !== draft.id &&
                g.section === draft.section &&
                g.category.trim().toLocaleLowerCase("az") ===
                  draft.category.trim().toLocaleLowerCase("az"),
            )
          ) {
            setError(
              "Bu bölmə və kateqoriya üçün cədvəl artıq var. Mövcud cədvəli redaktə edin.",
            );
            return;
          }
          if (
            onSave({
              ...draft,
              id: draft.id || crypto.randomUUID(),
              category: draft.category.trim(),
              verification: "UNVERIFIED",
              publication: "DRAFT",
            })
          ) {
            setDraft(blank());
            setError("");
          } else setError("Cədvəli saxlamaq mümkün olmadı.");
        }}
      >
        <h2>{draft.id ? "Cədvəli redaktə et" : "Yeni ölçü cədvəli"}</h2>
        <fieldset disabled={!canEdit}>
          <label>
            Bölmə
            <select
              value={draft.section}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  section: e.target.value as SizeGuideDraft["section"],
                })
              }
            >
              <option>Kişi</option>
              <option>Qadın</option>
              <option>Uşaq</option>
            </select>
          </label>
          <label>
            Kateqoriya
            <input
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              required
              maxLength={100}
            />
          </label>
          {draft.rows.map((row, i) => (
            <div className="size-row-editor" key={i}>
              {(["size", "chest", "waist", "hips"] as const).map((key) => (
                <label key={key}>
                  {
                    {
                      size: "Ölçü",
                      chest: "Sinə (sm)",
                      waist: "Bel (sm)",
                      hips: "Omba (sm)",
                    }[key]
                  }{" "}
                  {i + 1}
                  <input
                    value={row[key]}
                    maxLength={30}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        rows: draft.rows.map((r, n) =>
                          n === i ? { ...r, [key]: e.target.value } : r,
                        ),
                      })
                    }
                  />
                </label>
              ))}
              <button
                type="button"
                className="secondary"
                aria-label={`Ölçü sətri ${i + 1} sil`}
                onClick={() =>
                  setDraft({
                    ...draft,
                    rows: draft.rows.filter((_, n) => n !== i),
                  })
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
              setDraft({
                ...draft,
                rows: [
                  ...draft.rows,
                  { size: "", chest: "", waist: "", hips: "" },
                ],
              })
            }
          >
            Ölçü sətri əlavə et
          </button>
          <label>
            Ölçü izahı
            <textarea
              value={draft.disclaimer}
              onChange={(e) =>
                setDraft({ ...draft, disclaimer: e.target.value })
              }
              required
              maxLength={2000}
            />
          </label>
        </fieldset>
        <p className="muted">
          Dəyərlər bədən ölçüləridir. Bu qaralama avtomatik dərc edilmir və
          təsdiqlənmiş ölçü cədvəli hesab olunmur.
        </p>
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <button className="primary" disabled={!canEdit}>
          Cədvəl qaralamasını saxla
        </button>
        <button
          type="button"
          className="secondary"
          onClick={() => {
            setDraft(blank());
            setError("");
          }}
        >
          Yeni cədvələ başla
        </button>
      </form>
    </div>
  );
}
