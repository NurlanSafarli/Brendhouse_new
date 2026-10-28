/** Fail closed until stock reservation, idempotency, order persistence and the
 * selected Kapital Bank provider have been implemented and verified. No PII logged. */
export async function POST() {
  return Response.json(
    { code: "CHECKOUT_UNAVAILABLE" },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}
