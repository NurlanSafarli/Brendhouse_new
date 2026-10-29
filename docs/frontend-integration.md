# Frontend-only workflow and integration handoff

The latest user instruction defers real DB, payment and external services. Their absence is not a blocker to frontend work. The chosen Next.js/NestJS/Prisma architecture is retained for future integration; no production order/payment functionality is claimed.

## Run without services

- `npm ci` installs the workspace dependencies.
- `npm run dev:preview` starts the frontend on port 3001 with explicitly unverified development products.
- Browse `/bolme/kisi`, choose a product/size, open `/sebet` and continue to `/checkout`.
- Checkout has development-only success, declined and unavailable scenarios. Successful simulation displays TEST and explicitly states no real order/payment occurred. Contact details stay in component memory and are not persisted or sent by the preview adapter.
- `npm run build:frontend` builds only the frontend. Production cannot activate preview products or preview checkout even if the fixture flag is set.
- `npm run test:preview` exercises the complete preview journey; `npm test` includes adapter/production-guard tests.

## Replace adapters, keep UI

`packages/contracts/src/checkout.ts` owns CheckoutRequest, CheckoutOutcome and CheckoutPort. `components/checkout.tsx` consumes that port rather than building provider requests itself. `lib/commerce/preview-checkout.ts` is development-only and isolated; `lib/commerce/http-checkout.ts` calls the same-origin `/api/checkout`. That route deliberately returns 503 until real processing is implemented. A future Next.js route can forward to authenticated NestJS endpoints without exposing credentials in client code.

The request includes only guest details, delivery/payment choice, variant IDs, quantities and a stable idempotency key. Client cart prices are for display only. The backend must compute authoritative quotes from database stock and policies, reserve stock atomically, enforce idempotency, persist the order and return an accepted order number only after successful persistence. Distinguish transient transport failures from declined payments and uncertain outcomes; do not duplicate orders on retries.

Kapital Bank e-commerce is the selected future provider. Hosted payment initiation, allowlisted redirect URLs, callback signatures/replay checks and payment status reconciliation require the bank's actual contract. They are deliberately not guessed or simulated as real bank operations. Add a typed payment-redirect outcome when integrating the documented hosted flow; do not collect card numbers in these forms.

Catalog uses `lib/catalog.ts`; connect COMMERCE_API_URL when NestJS endpoints exist. Public DTO guards continue to exclude development/unverified records. Verified media, size charts, admin PolicySet data, search, stock reservation and the remaining frontend screens are still work to complete. This handoff is not a claim that all blueprint features are implemented.

## Bonus and identity preview

`/bonus-karti` runs the development-only identity port. Enter a valid-format phone and the displayed test code 123456. It simulates resend cooldown, expiration, failed-attempt lockout and single use; it never sends SMS, stores the phone, creates a customer/card or authenticates a session. `/hesab` is an explicitly labelled development UI preview. Real balances, card numbers, QR/barcodes, tiers and ledger entries are intentionally absent. The production account route shows only the entry CTA. Future `IdentityPort` implementation must use server-enforced OTP security and real sessions; frontend restrictions are not authorization.

## Separate admin preview

`npm run dev:admin` starts `apps/admin` on port 3002. Product/content/policy drafts and a bounded local change history use the `bh-admin-preview` browser-storage key. Data stays on that browser; no catalog publication happens. Products remain UNVERIFIED/DRAFT. Role selection is a UI exercise, not RBAC. Production renders a closed service screen regardless of the preview flag. Real admin APIs must enforce authorization, verification workflow, audit immutability and approvals server-side. The current product editor is basic: variants, media, size charts, import/export, inventory and operational order/loyalty actions remain to be developed.

## SEO preparation

Metadata uses the intended brendhouse.az origin. SITE_INDEXABLE defaults off; robots disallows crawling and sitemap is empty until an explicit production launch switch. Approved static content routes are the initial sitemap scope. No fake product URLs, addresses, ratings or rich results are generated. Real product/image sitemaps, structured data, migration redirects, analytics/consent wiring, accessibility audit and performance measurement remain outstanding. Do not treat this frontend checkpoint as a launch approval.
