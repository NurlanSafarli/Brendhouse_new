"use client";
import { useMemo, useSyncExternalStore } from "react";
const key = "bh-wishlist";
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("bh-wishlist-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("bh-wishlist-change", callback);
  };
}
function snapshot() {
  try {
    return localStorage.getItem(key) ?? "[]";
  } catch {
    return "[]";
  }
}
export function useWishlist() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => null);
  return useMemo(() => {
    if (raw === null) return null;
    try {
      const value: unknown = JSON.parse(raw);
      return Array.isArray(value)
        ? [
            ...new Set(
              value.filter(
                (x): x is string =>
                  typeof x === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(x),
              ),
            ),
          ]
        : [];
    } catch {
      return [];
    }
  }, [raw]);
}
export function toggleWishlist(id: string, ids: string[]) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(
        ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
      ),
    );
    window.dispatchEvent(new Event("bh-wishlist-change"));
    return true;
  } catch {
    return false;
  }
}
