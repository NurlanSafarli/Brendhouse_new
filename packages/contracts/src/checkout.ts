export type CheckoutRequest = {
  name: string;
  phone: string;
  address: string;
  delivery: "baku-courier";
  payment: "cash-on-delivery" | "card";
  lines: { variantId: string; quantity: number }[];
  idempotencyKey: string;
};
export type CheckoutOutcome =
  | { kind: "preview"; reference: string }
  | { kind: "accepted"; orderNumber: string }
  | {
      kind: "error";
      code: "UNAVAILABLE" | "NETWORK" | "INVALID_RESPONSE" | "PAYMENT_DECLINED";
    };
export interface CheckoutPort {
  submit(request: CheckoutRequest): Promise<CheckoutOutcome>;
}
