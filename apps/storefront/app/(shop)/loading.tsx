export default function Loading() {
  return (
    <div
      className="wrap catalog-page"
      role="status"
      aria-label="Məhsullar yüklənir"
    >
      <div className="skeleton" style={{ height: 48 }} />
      <div className="catalog-grid">
        {[1, 2, 3, 4].map((i) => (
          <div className="brand-block" key={i} />
        ))}
      </div>
      <p>Yüklənir…</p>
    </div>
  );
}
