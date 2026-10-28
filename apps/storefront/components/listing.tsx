import Link from "next/link";
import { catalogQuery } from "@brendhouse/contracts";
import { listProducts } from "../lib/catalog";
import {
  CatalogEmpty,
  CatalogUnavailable,
  Favorite,
  ImageBlock,
  Money,
} from "./shop";
export async function Listing({
  title,
  searchParams,
  section,
  category,
}: {
  title: string;
  searchParams: Record<string, string | string[] | undefined>;
  section?: string;
  category?: string;
}) {
  const query = catalogQuery(searchParams);
  if (section) query.set("section", section);
  if (category) query.set("category", category);
  const result = await listProducts(query);
  return (
    <div className="wrap catalog-page">
      <nav className="breadcrumbs" aria-label="Naviqasiya">
        <Link href="/">Ana səhifə</Link>
        <span>/</span>
        <span>{title}</span>
      </nav>
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">Öz tərzini tap</p>
          <h1>{title}</h1>
        </div>
        {result.status === "ready" && <p>{result.data.total} məhsul</p>}
      </div>
      <form className="filter-form" method="get">
        <label>
          Axtarış
          <input
            name="q"
            defaultValue={query.get("q") ?? ""}
            placeholder="Məhsul adı və ya kodu"
            type="search"
          />
        </label>
        <label>
          Ölçü
          <input
            name="size"
            defaultValue={query.get("size") ?? ""}
            placeholder="Ölçü"
          />
        </label>
        <label>
          Rəng
          <input
            name="color"
            defaultValue={query.get("color") ?? ""}
            placeholder="Rəng"
          />
        </label>
        <label>
          Sıralama
          <select name="sort" defaultValue={query.get("sort") ?? "newest"}>
            <option value="newest">Ən yenilər</option>
            <option value="price-asc">Qiymət: aşağıdan yuxarı</option>
            <option value="price-desc">Qiymət: yuxarıdan aşağı</option>
          </select>
        </label>
        <button className="button button-primary" type="submit">
          Tətbiq et
        </button>
      </form>
      {result.status !== "ready" ? (
        <CatalogUnavailable />
      ) : !result.data.items.length ? (
        <CatalogEmpty />
      ) : (
        <>
          <div className="catalog-grid">
            {result.data.items.map((product) => {
              const price = Math.min(...product.variants.map((v) => v.price));
              return (
                <article className="catalog-card" key={product.id}>
                  <div className="card-image">
                    <Link
                      href={`/product/${product.slug}`}
                      aria-label={product.title}
                    >
                      <ImageBlock />
                    </Link>
                    <Favorite id={product.slug} />
                  </div>
                  <p className="category-label">{product.category}</p>
                  <Link
                    className="product-title"
                    href={`/product/${product.slug}`}
                  >
                    {product.title}
                  </Link>
                  <p className="price">
                    <strong>
                      <Money value={price} />
                    </strong>
                  </p>
                  <Link
                    className="choose-size"
                    href={`/product/${product.slug}`}
                  >
                    Rəng və ölçü seç →
                  </Link>
                </article>
              );
            })}
          </div>
          {result.data.nextPage && (
            <Link
              className="button button-secondary"
              href={`?${new URLSearchParams({ ...Object.fromEntries(query), page: String(result.data.nextPage) })}`}
            >
              Daha çox göstər
            </Link>
          )}
        </>
      )}
    </div>
  );
}
