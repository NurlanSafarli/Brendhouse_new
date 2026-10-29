"use client";
import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { useCart, saveCart, type CartLine } from "../lib/cart";
import { cartTotals } from "@brendhouse/contracts";
import { confirmedPolicy } from "../lib/policy";
import { Money, ImageBlock } from "./shop";
export function OrderSummary({ lines }: { lines: CartLine[] }) {
  const t = cartTotals(
    lines,
    confirmedPolicy.bakuDeliveryQepik,
    confirmedPolicy.freeDeliveryQepik,
  );
  return (
    <div className="order-summary">
      <h2>Sifarişin xülasəsi</h2>
      <dl>
        <div>
          <dt>Məhsullar</dt>
          <dd>
            <Money value={t.products} />
          </dd>
        </div>
        <div>
          <dt>Endirim</dt>
          <dd>
            −<Money value={t.discount} />
          </dd>
        </div>
        <div>
          <dt>Çatdırılma (Bakı)</dt>
          <dd>
            <Money value={t.shipping} />
          </dd>
        </div>
        <div className="summary-total">
          <dt>Cəmi</dt>
          <dd>
            <Money value={t.total} />
          </dd>
        </div>
      </dl>
      <p className="muted">
        Qiymət və stok sifariş təsdiqindən əvvəl yenidən yoxlanılmalıdır.
      </p>
    </div>
  );
}
export function CartLink() {
  const lines = useCart();
  return (
    <Link
      href="/sebet"
      aria-label={`Səbətim (${lines?.reduce((n, l) => n + l.quantity, 0) ?? 0})`}
    >
      <ShoppingBag size={21} />
      <span className="cart-count">
        {lines?.reduce((n, l) => n + l.quantity, 0) ?? 0}
      </span>
    </Link>
  );
}
export function CartView() {
  const lines = useCart();
  const [error, setError] = useState("");
  if (lines === null) return <p role="status">Yüklənir…</p>;
  if (!lines.length)
    return (
      <div className="catalog-state">
        <ShoppingBag size={36} />
        <h1>Səbətiniz boşdur</h1>
        <Link href="/bolme/qadin" className="button button-primary">
          Məhsullara bax →
        </Link>
      </div>
    );
  const t = cartTotals(
    lines,
    confirmedPolicy.bakuDeliveryQepik,
    confirmedPolicy.freeDeliveryQepik,
  );
  const update = (id: string, quantity: number) => {
    try {
      saveCart(
        lines.flatMap((l) =>
          l.variantId !== id
            ? [l]
            : quantity === 0
              ? []
              : [{ ...l, quantity: Math.min(quantity, l.limit, 99) }],
        ),
      );
      setError("");
    } catch {
      setError("Səbəti saxlamaq mümkün olmadı.");
    }
  };
  return (
    <>
      <h1>Səbətim ({lines.reduce((n, l) => n + l.quantity, 0)})</h1>
      <div className="commerce-layout">
        <section>
          <div className="delivery-progress">
            <p>
              {t.remaining > 0 ? (
                <>
                  Pulsuz çatdırılmaya <Money value={t.remaining} /> qalıb
                </>
              ) : (
                "Bakı üzrə çatdırılma pulsuzdur"
              )}
            </p>
            <progress
              max={confirmedPolicy.freeDeliveryQepik}
              value={Math.min(t.subtotal, confirmedPolicy.freeDeliveryQepik)}
            />
          </div>
          {lines.map((line) => (
            <article className="cart-line" key={line.variantId}>
              <div className="cart-image">
                <ImageBlock />
              </div>
              <div>
                <Link href={`/product/${line.slug}`}>{line.title}</Link>
                <p className="muted">
                  {line.color} · {line.size}
                  {line.developmentOnly ? " · Təsdiqlənməyib" : ""}
                </p>
                <strong>
                  <Money value={line.price} />
                </strong>
                <div className="stepper">
                  <button
                    aria-label="Miqdarı azalt"
                    disabled={line.quantity <= 1}
                    onClick={() => update(line.variantId, line.quantity - 1)}
                  >
                    <Minus size={16} />
                  </button>
                  <output aria-live="polite">{line.quantity}</output>
                  <button
                    aria-label="Miqdarı artır"
                    disabled={line.quantity >= Math.min(line.limit, 99)}
                    onClick={() => update(line.variantId, line.quantity + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <button
                className="remove-line"
                aria-label={`${line.title} məhsulunu sil`}
                onClick={() => update(line.variantId, 0)}
              >
                <Trash2 size={18} />
              </button>
            </article>
          ))}
          {error && <p role="alert">{error}</p>}
        </section>
        <aside>
          <OrderSummary lines={lines} />
          <p className="muted">
            Sifarişi qapıda yoxlaya bilərsən · {confirmedPolicy.returnDays} gün
            qaytarma
          </p>
          <Link
            className="button button-primary purchase-button"
            href="/checkout"
          >
            Qeydiyyatsız sifariş et →
          </Link>
          <Link href="/bonus-karti" className="optional-bonus">
            Bonus kartı ilə davam et (istəyə bağlı)
          </Link>
        </aside>
      </div>
    </>
  );
}
