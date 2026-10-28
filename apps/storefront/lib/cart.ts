"use client";
import { useMemo, useSyncExternalStore } from "react";
export type CartLine = {
  variantId: string;
  slug: string;
  title: string;
  color: string;
  size: string;
  price: number;
  oldPrice?: number;
  quantity: number;
  limit: number;
  developmentOnly: boolean;
};
const key = "bh-cart";
function snapshot() {
  try {
    return localStorage.getItem(key) ?? "[]";
  } catch {
    return "[]";
  }
}
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("bh-cart-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("bh-cart-change", callback);
  };
}
export function parseCart(raw: string): CartLine[] {
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.filter(
      (v): v is CartLine =>
        v &&
        typeof v.variantId === "string" &&
        typeof v.slug === "string" &&
        typeof v.title === "string" &&
        typeof v.color === "string" &&
        typeof v.size === "string" &&
        typeof v.developmentOnly === "boolean" &&
        Number.isSafeInteger(v.price) &&
        v.price >= 0 &&
        v.price <= 2147483647 &&
        Number.isInteger(v.quantity) &&
        v.quantity > 0 &&
        v.quantity <= 99 &&
        Number.isInteger(v.limit) &&
        v.limit > 0 &&
        v.quantity <= v.limit &&
        (v.oldPrice === undefined ||
          (Number.isSafeInteger(v.oldPrice) && v.oldPrice >= v.price)),
    );
  } catch {
    return [];
  }
}
export function useCart() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => null);
  return useMemo(() => (raw === null ? null : parseCart(raw)), [raw]);
}
export function saveCart(lines: CartLine[]) {
  localStorage.setItem(key, JSON.stringify(lines));
  window.dispatchEvent(new Event("bh-cart-change"));
}
export function addCart(line: CartLine) {
  const lines = parseCart(snapshot());
  const existing = lines.find((v) => v.variantId === line.variantId);
  if (existing) {
    existing.quantity = Math.min(existing.quantity + 1, line.limit, 99);
  } else lines.push(line);
  saveCart(lines);
}
