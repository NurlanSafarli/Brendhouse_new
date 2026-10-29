"use client";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { developmentCatalog } from "../../apps/storefront/lib/development-catalog";
import { foldAz } from "@brendhouse/contracts";
import {
  Favorite,
  ImageBlock,
  Money,
  CatalogEmpty,
} from "../../apps/storefront/components/shop";
function Results({
  title,
  section,
  category,
}: {
  title: string;
  section?: string;
  category?: string;
}) {
  const query = useSearchParams();
  const q = query.get("q") ?? "";
  let products = developmentCatalog.filter(
    (p) =>
      (!section || p.section === section) &&
      (!category || foldAz(p.category) === foldAz(category)) &&
      foldAz(`${p.title} ${p.code}`).includes(foldAz(q)) &&
      (!query.get("size") ||
        p.variants.some((v) => v.size === query.get("size"))) &&
      (!query.get("color") ||
        p.variants.some(
          (v) => foldAz(v.color) === foldAz(query.get("color")!),
        )),
  );
  if (query.get("sort") === "price-asc")
    products = products.toSorted(
      (a, b) => a.variants[0].price - b.variants[0].price,
    );
  if (query.get("sort") === "price-desc")
    products = products.toSorted(
      (a, b) => b.variants[0].price - a.variants[0].price,
    );
  return (
    <div className="wrap catalog-page">
      <h1>{title}</h1>
      <p className="unverified-note">
        Frontend baxışı · Məhsullar təsdiqlənməyib · Real sifariş və ödəniş
        yoxdur
      </p>
      <form className="filter-form" method="get">
        <label>
          Axtarış
          <input
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Məhsul adı və ya kodu"
          />
        </label>
        <label>
          Ölçü
          <input name="size" defaultValue={query.get("size") ?? ""} />
        </label>
        <label>
          Rəng
          <input name="color" defaultValue={query.get("color") ?? ""} />
        </label>
        <label>
          Sıralama
          <select name="sort" defaultValue={query.get("sort") ?? "newest"}>
            <option value="newest">Ən yenilər</option>
            <option value="price-asc">Qiymət: aşağıdan yuxarı</option>
            <option value="price-desc">Qiymət: yuxarıdan aşağı</option>
          </select>
        </label>
        <button className="button button-primary">Tətbiq et</button>
      </form>
      {products.length ? (
        <div className="catalog-grid">
          {products.map((p) => (
            <article key={p.id}>
              <div className="card-image">
                <Link href={`/product/${p.slug}/`} aria-label={p.title}>
                  <ImageBlock />
                </Link>
                <Favorite id={p.slug} />
              </div>
              <p className="category-label">{p.category} · Təsdiqlənməyib</p>
              <Link className="product-title" href={`/product/${p.slug}/`}>
                {p.title}
              </Link>
              <strong>
                <Money value={p.variants[0].price} />
              </strong>
            </article>
          ))}
        </div>
      ) : (
        <CatalogEmpty />
      )}
    </div>
  );
}
export function Listing(props: {
  title: string;
  section?: string;
  category?: string;
}) {
  return (
    <Suspense fallback={<p>Yüklənir…</p>}>
      <Results {...props} />
    </Suspense>
  );
}
