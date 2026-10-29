import type { CheckoutPort } from "@brendhouse/contracts";
/** No database, network, OTP, payment, PII persistence or real order creation. */
export function previewCheckout(
  scenario: "success" | "declined" | "unavailable" = "success",
): CheckoutPort {
  return {
    async submit(request) {
      if (process.env.NODE_ENV !== "development")
        return { kind: "error", code: "UNAVAILABLE" };
      if (scenario === "declined")
        return { kind: "error", code: "PAYMENT_DECLINED" };
      if (scenario === "unavailable")
        return { kind: "error", code: "UNAVAILABLE" };
      return {
        kind: "preview",
        reference: `TEST-${request.idempotencyKey.slice(0, 8).toUpperCase()}`,
      };
    },
  };
}
