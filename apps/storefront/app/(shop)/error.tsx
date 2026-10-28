"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="wrap catalog-state">
      <h1>Səhifəni yükləmək mümkün olmadı</h1>
      <p>Bir qədər sonra yenidən cəhd edin.</p>
      <button className="button button-primary" onClick={reset}>
        Yenidən cəhd et
      </button>
    </div>
  );
}
