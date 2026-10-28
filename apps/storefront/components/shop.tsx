"use client";
import Link from "next/link";
import { CartLink } from "./cart-view";
import { useState } from "react";
import { useWishlist, toggleWishlist } from "../lib/wishlist";
import {
  Search,
  Heart,
  Menu,
  ArrowUpRight,
  ShoppingBag,
  MapPin,
} from "lucide-react";
import { Modal, Button, BrandBlock } from "@brendhouse/design-system";
export const sections = [
  ["kisi", "Kişi"],
  ["qadin", "Qadın"],
  ["usaq", "Uşaq"],
  ["diger", "Digər"],
];
export function ShopHeader() {
  return (
    <>
      <header className="shop-header">
        <div className="wrap shop-top">
          <Link href="/" className="wordmark">
            BREND HOUSE
          </Link>
          <nav className="desktop-nav" aria-label="Əsas menyu">
            {sections.map(([slug, label]) => (
              <Link key={slug} href={`/bolme/${slug}`}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="row header-actions">
            <CartLink />
            <Link href="/axtaris" aria-label="Axtarış">
              <Search size={21} />
            </Link>
            <Link href="/secilmisler" aria-label="Seçilmişlər">
              <Heart size={21} />
            </Link>
            <Modal
              title="Bölmələr"
              trigger={
                <Button variant="quiet" aria-label="Menyunu aç">
                  <Menu size={21} />
                </Button>
              }
            >
              <nav className="drawer-nav">
                {sections.map(([slug, label]) => (
                  <Link key={slug} href={`/bolme/${slug}`}>
                    {label}
                    <ArrowUpRight size={18} />
                  </Link>
                ))}
              </nav>
            </Modal>
          </div>
        </div>
      </header>
    </>
  );
}
export function ShopFooter() {
  return (
    <footer className="shop-footer">
      <div className="wrap footer-grid">
        <div>
          <Link className="wordmark" href="/">
            BREND HOUSE
          </Link>
          <p>
            Gözəl həyat,
            <br />
            gözəl geyimlə başlayır!
          </p>
        </div>
        <div>
          <h3>Kolleksiyalar</h3>
          {sections.map(([slug, label]) => (
            <Link key={slug} href={`/bolme/${slug}`}>
              {label}
            </Link>
          ))}
        </div>
        <div>
          <h3>Əlaqə</h3>
          <a href="tel:+994503044811">(050) 304 48 11</a>
          <a href="mailto:info@brendhouse.az">info@brendhouse.az</a>
          <a href="https://wa.me/994503044811">WhatsApp</a>
        </div>
        <div>
          <MapPin size={22} />
          <p>
            19 filial
            <br />
            2014-cü ildən sizinlə
          </p>
          <small>Nur Collection MMC</small>
        </div>
      </div>
      <div className="wrap footer-bottom">
        © {new Date().getFullYear()} Brend House
      </div>
    </footer>
  );
}
export function Money({ value }: { value: number }) {
  return <>{(value / 100).toFixed(2)} ₼</>;
}
export function Favorite({ id }: { id: string }) {
  const ids = useWishlist();
  const active = ids?.includes(id) ?? false;
  const [error, setError] = useState(false);
  return (
    <>
      <button
        className="favorite"
        aria-label={active ? "Seçilmişlərdən sil" : "Seçilmişlərə əlavə et"}
        aria-pressed={active}
        disabled={ids === null}
        onClick={() => setError(!toggleWishlist(id, ids ?? []))}
      >
        <Heart size={20} fill={active ? "currentColor" : "none"} />
      </button>
      {error && <p role="alert">Seçimi saxlamaq mümkün olmadı.</p>}
    </>
  );
}
export function CatalogUnavailable() {
  return (
    <div className="catalog-state" role="status">
      <ShoppingBag size={36} strokeWidth={1} />
      <h2>Məhsulları hazırda göstərə bilmirik</h2>
      <p>
        Bir qədər sonra yenidən cəhd edin. Seçiminizlə bağlı bizə yaza
        bilərsiniz.
      </p>
      <a className="button button-secondary" href="https://wa.me/994503044811">
        WhatsApp ilə əlaqə
      </a>
    </div>
  );
}
export function CatalogEmpty() {
  return (
    <div className="catalog-state">
      <Search size={36} strokeWidth={1} />
      <h2>Uyğun məhsul tapılmadı</h2>
      <p>Axtarışı dəyişin və ya digər bölmələrə baxın.</p>
      <Link href="/bolme/kisi" className="button button-secondary">
        Bölməyə bax →
      </Link>
    </div>
  );
}
export function ImageBlock() {
  return <BrandBlock />;
}
