"use client";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "../lib/cart";
import { OrderSummary } from "./cart-view";
export function Checkout() {
  const lines = useCart();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (lines === null) return <p role="status">Yüklənir…</p>;
  if (!lines.length)
    return (
      <div className="catalog-state">
        <h1>Səbətiniz boşdur</h1>
        <Link href="/bolme/qadin">Məhsullara bax →</Link>
      </div>
    );
  return (
    <>
      <p className="eyebrow">Hesab yaratmadan alış-veriş</p>
      <h1>Sifarişi tamamla</h1>
      <div className="commerce-layout">
        <form
          className="checkout-form"
          onSubmit={async (e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            const phone = String(data.get("phone")).replace(/[\s()-]/g, "");
            if (!/^\+994\d{9}$/.test(phone)) {
              setError("Telefon nömrəsini +994 və 9 rəqəmlə daxil edin.");
              return;
            }
            setBusy(true);
            setError("");
            try {
              const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: data.get("name"),
                  phone,
                  address: data.get("address"),
                  delivery: "baku-courier",
                  payment: "cash-on-delivery",
                  lines: lines.map((l) => ({
                    variantId: l.variantId,
                    quantity: l.quantity,
                  })),
                }),
              });
              if (!response.ok) {
                setError(
                  "Sifariş qəbulu hazırda əlçatan deyil. Səbətiniz saxlanılıb; heç bir ödəniş tutulmayıb.",
                );
                return;
              }
              setError(
                "Sifariş təsdiqi alınmadı. Dəstək xidməti ilə əlaqə saxlayın.",
              );
            } catch {
              setError("Bağlantı alınmadı. Səbətiniz saxlanılıb.");
            } finally {
              setBusy(false);
            }
          }}
        >
          <section className="panel">
            <h2>1. Əlaqə məlumatları</h2>
            <label>
              Ad və soyad
              <input name="name" required autoComplete="name" maxLength={120} />
            </label>
            <label>
              Telefon nömrəsi
              <input
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="+994 50 123 45 67"
                maxLength={24}
              />
            </label>
          </section>
          <section className="panel">
            <h2>2. Çatdırılma</h2>
            <label>
              Ünvan (Bakı)
              <textarea
                name="address"
                required
                autoComplete="street-address"
                maxLength={500}
              />
            </label>
            <p className="muted">
              Digər bölgələrə çatdırılma üçün dəstək xidməti ilə əlaqə saxlayın.
            </p>
          </section>
          <section className="panel">
            <h2>3. Ödəniş</h2>
            <label className="radio-option">
              <input
                type="radio"
                name="payment"
                defaultChecked
                value="cash-on-delivery"
              />
              Qapıda nağd ödəniş
            </label>
            <label className="radio-option">
              <input type="radio" name="payment" disabled value="card" />
              Kartla ödəniş — hazırda əlçatan deyil
            </label>
          </section>
          {lines.some((l) => l.developmentOnly) && (
            <p className="unverified-note">
              Səbətdə təsdiqlənməmiş məhsullar var. Onlarla real sifariş
              yaradıla bilməz.
            </p>
          )}
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="button button-primary purchase-button"
            disabled={busy}
          >
            {busy ? "Yoxlanılır…" : "Sifarişi təsdiqlə →"}
          </button>
        </form>
        <aside>
          <OrderSummary lines={lines} />
          <p className="muted">Qeydiyyat və SMS kodu tələb olunmur.</p>
        </aside>
      </div>
    </>
  );
}
