import { afterEach, it, expect, vi } from "vitest";
import { httpCheckout } from "./http-checkout";
import { previewCheckout } from "./preview-checkout";
import type { CheckoutRequest } from "@brendhouse/contracts";
const request: CheckoutRequest = {
  name: "Test",
  phone: "+994501234567",
  address: "Test",
  delivery: "baku-courier",
  payment: "cash-on-delivery",
  lines: [{ variantId: "dev-0-M", quantity: 1 }],
  idempotencyKey: "fixed-test-key",
};
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
it("preview performs no network calls and cannot execute in production", async () => {
  const fetch = vi.fn();
  vi.stubGlobal("fetch", fetch);
  vi.stubEnv("NODE_ENV", "development");
  expect((await previewCheckout().submit(request)).kind).toBe("preview");
  vi.stubEnv("NODE_ENV", "production");
  expect(await previewCheckout().submit(request)).toEqual({
    kind: "error",
    code: "UNAVAILABLE",
  });
  expect(fetch).not.toHaveBeenCalled();
});
it("HTTP port sends stable idempotency and rejects malformed success", async () => {
  const fetch = vi
    .fn()
    .mockResolvedValue(
      new Response(JSON.stringify({ kind: "accepted" }), { status: 200 }),
    );
  vi.stubGlobal("fetch", fetch);
  expect(await httpCheckout.submit(request)).toEqual({
    kind: "error",
    code: "INVALID_RESPONSE",
  });
  expect(fetch.mock.calls[0][1].headers["Idempotency-Key"]).toBe(
    "fixed-test-key",
  );
});
it("HTTP port handles service and network failures without claiming an order", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(new Response(null, { status: 503 })),
  );
  expect((await httpCheckout.submit(request)).kind).toBe("error");
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
  expect(await httpCheckout.submit(request)).toEqual({
    kind: "error",
    code: "NETWORK",
  });
});
