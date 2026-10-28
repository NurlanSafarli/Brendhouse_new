"use client";
import { addCart } from "../lib/cart";
import { useState } from "react";
import Link from "next/link";
import type { CatalogProduct } from "@brendhouse/contracts";
import {
  Button,
  Modal,
  SizeGuide,
  Accordion,
  TrustItem,
} from "@brendhouse/design-system";
import { Favorite, ImageBlock, Money } from "./shop";
import { confirmedPolicy } from "../lib/policy";
export function ProductDetail({ product }: { product: CatalogProduct }) {
  const [message, setMessage] = useState("");
  const [color, setColor] = useState(product.variants[0].color);
  const [size, setSize] = useState("");
  const variant = product.variants.find(
    (v) => v.color === color && v.size === size,
  );
  const price =
    variant?.price ??
    Math.min(
      ...product.variants.filter((v) => v.color === color).map((v) => v.price),
    );
  return (
    <div className="wrap product-page">
      <nav className="breadcrumbs" aria-label="Naviqasiya">
        <Link href="/">Ana səhifə</Link>
        <span>/</span>
        <span>{product.section}</span>
        <span>/</span>
        <span>{product.category}</span>
        <span>/</span>
        <span>{product.code}</span>
      </nav>
      <div className="product-layout">
        <div className="product-gallery">
          <ImageBlock />
          <Favorite id={product.slug} />
        </div>
        <section className="product-information">
          <p className="eyebrow">{product.category}</p>
          {product.developmentOnly && (
            <p className="unverified-note">
              Məhsul məlumatları təsdiqlənməyib.
            </p>
          )}
          <h1>{product.title}</h1>
          <div className="detail-price">
            <strong>
              <Money value={price} />
            </strong>
            {variant?.oldPrice && variant.oldPrice > price ? (
              <>
                <del>
                  <Money value={variant.oldPrice} />
                </del>
                <span className="badge badge-sale">
                  -{Math.round((1 - price / variant.oldPrice) * 100)}%
                </span>
              </>
            ) : null}
          </div>
          {variant && variant.available > 0 && (
            <p className="stock-label">Stokda mövcuddur</p>
          )}
          {product.description && (
            <p className="product-description">{product.description}</p>
          )}
          {product.attributes.some((a) =>
            ["composition", "fit", "season"].includes(a.key),
          ) && (
            <div className="fabric-card">
              <h2>Parça və fason</h2>
              {product.attributes
                .filter((a) => ["composition", "fit", "season"].includes(a.key))
                .map((a) => (
                  <p key={a.key}>
                    <strong>{a.label}:</strong> {a.value}
                  </p>
                ))}
            </div>
          )}
          <fieldset className="variant-picker">
            <legend>Rəng: {color}</legend>
            <div className="row">
              {[...new Set(product.variants.map((v) => v.color))].map((c) => (
                <button
                  aria-pressed={color === c}
                  key={c}
                  onClick={() => {
                    setColor(c);
                    setSize("");
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="size-heading">
            <span>Ölçü</span>
            <Modal
              title="Ölçü bələdçisi"
              trigger={<Button variant="quiet">Ölçü bələdçisi</Button>}
            >
              <SizeGuide />
            </Modal>
          </div>
          <div className="row variant-picker">
            {[...new Set(product.variants.map((v) => v.size))].map((s) => {
              const found = product.variants.find(
                (v) => v.color === color && v.size === s,
              );
              return (
                <button
                  key={s}
                  aria-pressed={size === s}
                  disabled={!found || found.available === 0}
                  onClick={() => setSize(s)}
                >
                  {s}
                </button>
              );
            })}
          </div>
          <div className="purchase-area">
            <Button
              disabled={!variant || variant.available === 0}
              className="purchase-button"
              onClick={() => {
                if (!variant) return;
                try {
                  addCart({
                    variantId: variant.id,
                    slug: product.slug,
                    title: product.title,
                    color: variant.color,
                    size: variant.size,
                    price: variant.price,
                    oldPrice: variant.oldPrice,
                    quantity: 1,
                    limit: variant.available,
                    developmentOnly: product.developmentOnly,
                  });
                  setMessage("Məhsul səbətə əlavə edildi.");
                } catch {
                  setMessage("Səbəti saxlamaq mümkün olmadı.");
                }
              }}
            >
              {!size ? "Ölçü seçin" : "Səbətə əlavə et →"}
            </Button>
            <p role="status">{message}</p>
            <Link href="/sebet" className="choose-size">
              Səbətə bax →
            </Link>
            <div className="trust-block">
              {confirmedPolicy.doorInspection && (
                <TrustItem>Qapıda yoxla, sonra ödə</TrustItem>
              )}
              <TrustItem>
                {confirmedPolicy.returnDays} gün ərzində qaytarma
              </TrustItem>
              <TrustItem>
                Bakı üzrə çatdırılma:{" "}
                <Money value={confirmedPolicy.bakuDeliveryQepik} />
              </TrustItem>
              <a
                href={`https://wa.me/${confirmedPolicy.whatsapp}`}
                className="support-link"
              >
                Seçimdə kömək lazımdır? WhatsApp ilə yazın ↗
              </a>
            </div>
          </div>
          {product.attributes.length > 0 && (
            <>
              <h2 className="details-title">Almazdan əvvəl bil</h2>
              <Accordion
                items={product.attributes.map((a) => ({
                  title: a.label,
                  content: <p>{a.value}</p>,
                }))}
              />
            </>
          )}
          <p className="muted product-code">Məhsul kodu: {product.code}</p>
        </section>
      </div>
    </div>
  );
}
