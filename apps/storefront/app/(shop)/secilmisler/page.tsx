"use client";
import { useWishlist } from "../../../lib/wishlist";
import Link from "next/link";
import { Heart } from "lucide-react";
export default function Wishlist() {
  const ids = useWishlist();
  return (
    <div className="wrap catalog-page">
      <p className="eyebrow">Sənin seçimin</p>
      <h1>Seçilmişlər</h1>
      {ids === null ? (
        <p role="status">Yüklənir…</p>
      ) : ids.length ? (
        <ul className="wishlist-list">
          {ids.map((slug, index) => (
            <li key={slug}>
              <Link href={`/product/${slug}`}>
                Seçdiyiniz məhsula bax · {index + 1} →
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="catalog-state">
          <Heart size={36} strokeWidth={1} />
          <h2>Bəyəndiklərini bir yerdə saxla</h2>
          <p>
            Məhsulun yanındakı ürəyə toxunaraq onu buraya əlavə edə bilərsən.
          </p>
          <Link href="/bolme/qadin" className="button button-primary">
            Məhsullara bax →
          </Link>
        </div>
      )}
    </div>
  );
}
