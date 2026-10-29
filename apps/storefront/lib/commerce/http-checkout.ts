import type { CheckoutPort } from "@brendhouse/contracts";
/** UI never sends trusted prices or handles card data. Replace the server endpoint
 * with NestJS only after quote/reservation/idempotency checks are implemented. */
export const httpCheckout: CheckoutPort = {
  async submit(request) {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": request.idempotencyKey,
        },
        body: JSON.stringify(request),
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) return { kind: "error", code: "UNAVAILABLE" };
      const payload: unknown = await response.json();
      if (
        payload &&
        typeof payload === "object" &&
        "kind" in payload &&
        payload.kind === "accepted" &&
        "orderNumber" in payload &&
        typeof payload.orderNumber === "string" &&
        /^[A-Za-z0-9-]{1,64}$/.test(payload.orderNumber)
      )
        return { kind: "accepted", orderNumber: payload.orderNumber };
      return { kind: "error", code: "INVALID_RESPONSE" };
    } catch {
      return { kind: "error", code: "NETWORK" };
    }
  },
};
