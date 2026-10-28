import Link from "next/link";
export default function NotFound() {
  return (
    <main className="wrap catalog-state">
      <p className="eyebrow">404 · Brend House</p>
      <h1>Axtardığınız səhifə tapılmadı</h1>
      <p>Yeni seçimlər üçün axtarışdan istifadə edin.</p>
      <Link href="/axtaris" className="button button-primary">
        Məhsul axtar →
      </Link>
    </main>
  );
}
