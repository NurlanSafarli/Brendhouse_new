import Link from "next/link";
export default function Home() {
  return (
    <main className="wrap hero">
      <p className="wordmark">BREND HOUSE</p>
      <h1>Gözəl həyat, gözəl geyimlə başlayır!</h1>
      <Link href="/design-system">Dizayn sistemi →</Link>
    </main>
  );
}
