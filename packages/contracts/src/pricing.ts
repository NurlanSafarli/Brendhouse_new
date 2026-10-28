export function cartTotals(
  lines: { price: number; oldPrice?: number; quantity: number }[],
  delivery: number,
  freeFrom: number,
) {
  if (
    !Number.isSafeInteger(delivery) ||
    delivery < 0 ||
    !Number.isSafeInteger(freeFrom) ||
    freeFrom < 0
  )
    throw new Error("Invalid delivery policy");
  let products = 0,
    subtotal = 0;
  for (const line of lines) {
    if (
      !Number.isSafeInteger(line.price) ||
      line.price < 0 ||
      !Number.isSafeInteger(line.quantity) ||
      line.quantity < 1 ||
      line.quantity > 99 ||
      (line.oldPrice !== undefined &&
        (!Number.isSafeInteger(line.oldPrice) || line.oldPrice < line.price))
    )
      throw new Error("Invalid cart line");
    products += (line.oldPrice ?? line.price) * line.quantity;
    subtotal += line.price * line.quantity;
  }
  const shipping = lines.length === 0 || subtotal >= freeFrom ? 0 : delivery;
  if (
    !Number.isSafeInteger(products) ||
    !Number.isSafeInteger(subtotal + shipping)
  )
    throw new Error("Cart amount overflow");
  return {
    products,
    discount: products - subtotal,
    subtotal,
    shipping,
    total: subtotal + shipping,
    remaining: Math.max(0, freeFrom - subtotal),
  };
}
