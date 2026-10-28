import { it, expect } from "vitest";
import { cartTotals } from "./pricing";
it("computes explicit discount and delivery in qəpik", () => {
  expect(
    cartTotals([{ price: 2790, oldPrice: 3000, quantity: 2 }], 500, 6000),
  ).toEqual({
    products: 6000,
    discount: 420,
    subtotal: 5580,
    shipping: 500,
    total: 6080,
    remaining: 420,
  });
});
it("applies free delivery to discounted subtotal at the threshold", () => {
  expect(cartTotals([{ price: 6000, quantity: 1 }], 500, 6000).shipping).toBe(
    0,
  );
  expect(
    cartTotals([{ price: 5999, oldPrice: 7000, quantity: 1 }], 500, 6000)
      .shipping,
  ).toBe(500);
  expect(cartTotals([], 500, 6000).total).toBe(0);
});
it("rejects fractional money and invalid quantities", () => {
  expect(() => cartTotals([{ price: 27.9, quantity: 1 }], 500, 6000)).toThrow();
  expect(() => cartTotals([{ price: 10, quantity: 0 }], 500, 6000)).toThrow();
});
