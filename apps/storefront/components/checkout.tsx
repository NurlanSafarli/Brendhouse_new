"use client";
import { useRef, useState } from "react";
import { httpCheckout } from "../lib/commerce/http-checkout";
import { previewCheckout } from "../lib/commerce/preview-checkout";
import type { CheckoutOutcome } from "@brendhouse/contracts";
import Link from "next/link";
import { useCart, saveCart } from "../lib/cart";
import { OrderSummary } from "./cart-view";
export function Checkout({ preview = false }: { preview?: boolean }) {
  const [scenario, setScenario] = useState<
    "success" | "declined" | "unavailable"
  >("success");
  const [outcome, setOutcome] = useState<CheckoutOutcome | null>(null);
  const requestKey = useRef<string | null>(null);
  const lines = useCart();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (outcome?.kind === "preview" || outcome?.kind === "accepted")
    return (
      <div className="catalog-state">
        <p className="eyebrow">
          {outcome.kind === "preview" ? "TEST AXINI" : "BREND HOUSE"}
        </p>
        <h1>
          {outcome.kind === "preview"
            ? "Sifariş axını tamamlandı"
            : "Sifarişiniz qəbul edildi"}
        </h1>
        <p>
          {outcome.kind === "preview"
            ? "Bu, frontend yoxlamasıdır. Real sifariş yaradılmayıb və ödəniş tutulmayıb."
            : `Sifariş nömrəsi: ${outcome.orderNumber}`}
        </p>
        {outcome.kind === "preview" && <p>{outcome.reference}</p>}
        <Link href="/bolme/qadin" className="button button-primary">
          Alış-verişə davam et →
        </Link>
      </div>
    );
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
              requestKey.current ??= crypto.randomUUID();
              const result = await (
                preview ? previewCheckout(scenario) : httpCheckout
              ).submit({
                name: String(data.get("name")).trim(),
                phone,
                address: String(data.get("address")).trim(),
                delivery: "baku-courier",
                payment:
                  data.get("payment") === "card" ? "card" : "cash-on-delivery",
                lines: lines.map((l) => ({
                  variantId: l.variantId,
                  quantity: l.quantity,
                })),
                idempotencyKey: requestKey.current,
              });
              if (result.kind === "error") {
                setError(
                  result.code === "PAYMENT_DECLINED"
                    ? "Test ödənişi qəbul edilmədi. Başqa ödəniş üsulu seçin."
                    : "Sifariş qəbulu hazırda əlçatan deyil. Səbətiniz saxlanılıb; heç bir ödəniş tutulmayıb.",
                );
                return;
              }
              setOutcome(result);
              try {
                saveCart([]);
              } catch {
                /* Completion still displays if local storage is unavailable. */
              }
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
              <input
                type="radio"
                name="payment"
                disabled={!preview}
                value="card"
              />
              {preview
                ? "Kartla ödəniş (test)"
                : "Kartla ödəniş — hazırda əlçatan deyil"}
            </label>
          </section>
          {preview && (
            <section className="panel">
              <h2>Frontend yoxlaması</h2>
              <p className="muted">
                Real sifariş, bank sorğusu və SMS göndərilmir.
              </p>
              <label>
                Test nəticəsi
                <select
                  value={scenario}
                  onChange={(e) =>
                    setScenario(e.target.value as typeof scenario)
                  }
                >
                  <option value="success">Tamamlanan axın</option>
                  <option value="declined">Ödəniş xətası</option>
                  <option value="unavailable">Xidmət əlçatan deyil</option>
                </select>
              </label>
            </section>
          )}
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
