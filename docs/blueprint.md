# Brend House — Phase 0 audit and architecture

Status: provisional architecture; live-site and visual audit blocked. No implementation authorized until phase approval.

## Evidence and audit boundaries
The supplied brief is the source for the business facts below. The repository was empty at onboarding. A public HTTPS request to brendhouse.az returned proxy CONNECT 403; no live page was inspected. The V3 mockups and original logo were not attached. Consequently this is not a visual-conformance assessment or a verified legacy inventory. No live performance, accessibility, checkout, FAQ or search results are claimed.

Keep: Azerbaijani identity and slogan, existing section/type/category taxonomy, AZN prices, product codes and variant barcodes, branch stock model, established URL patterns, supplied contact details, and existing GTM identifier (activate tracking only with consent configuration).

Improve, based on the brief rather than independent observation: guest-first ordering; verified structured product information; product-adjacent trust terms; usable size guidance; transparent totals; accurate stock; optional OTP loyalty; meaningful reviews; accessible mobile navigation; centralized policy content. No legacy-store shopping handoffs.

Audit completion requires: homepage, section/category, search, PDP, cart, checkout, FAQ, delivery/returns and store pages; mobile/desktop screenshots; representative URL crawl and redirects; structured-data inspection; measured accessibility and performance checks. Obtain original V3 files and logo before claiming design fidelity. Obtain a sanctioned product/inventory export rather than treating scraped stock as authoritative.

## Architecture decision
Choose NestJS + Prisma rather than Medusa v2. The core risk is transactional omnichannel loyalty, branch inventory and POS interoperability. A modular NestJS application permits explicit transaction boundaries and one versioned API shared by web, existing mobile app and POS. Tradeoff: more commerce primitives must be built and tested than with Medusa; do not pretend catalog CRUD alone delivers commerce.

Use a monorepo: apps/storefront (Next.js App Router, TypeScript, Tailwind, shadcn/ui); apps/admin (separate authenticated application); apps/api (NestJS); apps/worker; packages/contracts, design-system and config; infrastructure; docs. Begin with a modular monolith, not distributed microservices. PostgreSQL is the source of truth; Redis handles bounded caches, rate limits and job dispatch; Meilisearch is a rebuildable catalog projection; S3-compatible storage hosts approved media. Use a transactional outbox for search, notifications and integrations, with idempotent consumers and dead-letter handling.

Public catalog SSR/ISR; personal/cart/order pages never share cached private data. Locale default az; ru/en routes and translated fields prepared but not advertised until translated. Preserve /product/{slug}/, /bolme/{section} and /mehsul-kateqoriyasi/{slug}/. ASCII slugs, az-aware casing and explicit search-folding normalization. Store money as integer qəpik; format 2790 as 27.90 ₼. Self-host licensed fonts with tested Azerbaijani glyphs and font-display swap.

## Data and invariants
Catalog: Product, ProductTranslation, Category, Collection, Media, AttributeVerification, SizeGuide, SizeGuideRevision, Variant (unique barcode; validate EAN-13 checksum), Branch, InventoryBalance and InventoryReservation. Variant uniqueness is product/color/size. Track data source, verifier and verification time. Development seeds and unverified products cannot be published; API/search/feed projections enforce this, not merely admin UI. Optional unverified attributes and charts are omitted.

Policies: versioned PolicySet contains approved delivery charges/areas, thresholds, return window, door inspection, accepted methods, guarantee and loyalty terms. Draft/approved/scheduled status. All customer touchpoints consume the same approved version; orders snapshot the version and monetary calculation. Conflicting brief defaults (including 5 ₼ delivery) remain pending confirmation. Hide unsupported claims and disable affected shipping/payment options rather than inventing terms.

Commerce: Cart, CartLine, Quote, Coupon, Promotion, Order, OrderLineSnapshot, PaymentAttempt, Shipment, Return, Refund and Consent. Guest ordering needs only specified delivery/contact/payment information; email optional. Pickup uses branch selection and conditional address requirements. Revalidate price, stock, delivery eligibility and promotions on submission. Atomic reservation with expiry prevents overselling. Payment states and order states are separate. Signed, replay-protected provider webhooks settle payment; browser return URLs never prove payment. Model partial cancellations/returns/refunds explicitly. Hosted card checkout keeps card data outside the application.

Identity: OtpChallenge, VerifiedCustomer, Session, Address and LoyaltyCard. Sending a code creates a challenge only; successful atomic single-use verification creates the customer/card. Store hashed codes, TTL, attempt caps and cooldowns; rate-limit phone/IP/device; neutral responses prevent enumeration. No password migration and no automatic account creation from a guest order. Existing physical-card linking requires verified ownership matching the POS record, not simply knowledge of a number. Guest tracking uses order number + normalized phone, rate limits and minimized disclosed information.

Loyalty: Wallet, immutable LedgerEntry, BonusLot, RedemptionHold, TierRule, CampaignRule, IdempotencyRecord and AuditEvent. Maintain available/pending/held accounting with SQL constraints and locked wallet rows. Calculate expiry per lot. Key operations by authenticated integration and idempotency key; reject key reuse with different payloads. Redeem = hold -> confirm or release; expiry, refunds and redemption compete under the same lock. Partial returns reverse proportionate earn, restore eligible redeemed amounts and preserve an auditable debt policy when earned bonuses were already spent. No arbitrary balance edits; reasoned compensating entries only. Reconciliation compares ledger totals to projections and POS settlement records. Welcome benefit uniqueness must be database-enforced per verified identity. Earning rates, tiers, caps and refund/debt rules require business approval.

## API and integrations
/api/v1/catalog, /search, /carts, /checkout, /orders/track, /auth/otp, /me, /loyalty and privileged /admin namespaces. POS endpoints: scoped card lookup, earn, redemption holds/confirm/release, reverse and signed webhooks. OpenAPI generated from validated DTOs; documented idempotency and error contracts. Scope tokens per branch/client; rotate credentials, audit operations and protect phone lookup from enumeration. Sandbox is isolated from production balances. Provider adapters for SMS, payment, courier and POS remain disabled until configured and verified; no simulated successful production payment or OTP.

## UX contract
Warm cream, specified brown/sale/green tokens, 8px corners, original unchanged logo, visible focus, reduced-motion support and AA contrast including small muted text. Missing logo is a design dependency, not permission to fabricate a replacement.

PDP order: breadcrumb/code, readable title and prices; verified material/fit card; swatches/sizes and size-guide modal; add-to-cart with adjacent approved trust statements and WhatsApp; verified details accordion; branch availability and genuine reviews; relevant recommendations. Hide zero ratings. Modal supports focus trapping, escape, labelled tabs and focus return. No size measurements without verification; supplied men's sample stays development-only.

Cart: editable lines, explicit products/discount/bonus/delivery/total, threshold progress only for approved eligible delivery rules, primary “Qeydiyyatsız sifariş et →”, optional OTP card path. Checkout remains usable without account/card/OTP. Consent is granular and unchecked. Trust bar rotation must be pausable and reduced-motion aware. Hide integrations/content with no real data, including unapproved UGC, rather than filling production with sample visuals. Empty states use natural Azerbaijani.

## Migration and operations
Import to staging with source IDs, provenance, validation reports, deduplication and repeatable upserts. Quarantine missing/invalid barcodes and unverified attributes. Resolve inventory authority and conflict rules with POS owner. Migration includes media rights, category mappings and authorized order-history retention; no passwords. Crawl/export old URLs to create exact redirect coverage and test loops, chains, collisions and missing targets. Reconcile counts, totals and stock before cutover; freeze/delta import and rollback plan required. Do not claim a complete redirect map until legacy inventory is obtained.

Docker local services, CI type/lint/unit/integration/build/e2e gates, separate staging/production secrets and data, automated PostgreSQL backups with restore drills, object versioning, Sentry redaction and uptime checks. Restrictive CSP, HTTPS/HSTS, secure session cookies, CSRF protection, input validation, scoped RBAC and audit trails. Add Turnstile progressively with accessible failure handling. Legal copy and data retention require business/legal review. External production services need configured domains and credentials; never put secret values in source.

## Phases and acceptance gates
0. Complete evidence-based audit, approve architecture and record pending decisions. Stop for approval.
1. Foundation, tokens, schema/migrations, unverified seed data, import pipeline and .env.example. Verify DB constraints, import repeatability and publication exclusion. Stop for approval.
2. Catalog/search/PDP, verified size guide/trust, URL filters, wishlist and discovery. Test AZ search/code/barcode, stock selection, accessibility and SSR output. Compare against supplied V3. Stop for approval.
3. Cart, guest checkout, shipping, hosted payment and returns groundwork. Test totals/promos, stock contention, duplicate submissions, signed payment callbacks and guest/POD flows against approved rules. Stop for approval.
4. OTP, bonus card and POS API. Test lockout/replay, no pre-verification account, single welcome grant, concurrent redemption, expiry and partial-return reversal. POS sandbox contract tests. Stop for approval.
5. Admin roles, content/policies, catalog/inventory/orders, loyalty console, dashboards and audit. Test authorization boundaries and approval publishing. Stop for approval.
6. Migration/redirects, SEO/feeds, analytics consent, notifications, security, QA and launch. Playwright full journeys; Lighthouse CI plus measured mid-range Android/4G checks toward LCP <2.5s, INP <200ms, CLS <0.1. Restore and rollback rehearsal; operational signoff. Stop for approval before launch.

Each implementation phase updates README, OpenAPI, admin guide, assumptions and launch checklist. Wallet passes are later scope as requested. All other requested storefront/admin features remain in the backlog for the relevant phase; external integrations are not considered complete from mock adapters alone.

## Open decisions and blockers
Business questions sent: delivery/returns/payment-at-door rules; loyalty rates/caps/stacking/validity/tiers/claims; existing payment/SMS/courier/POS providers and legacy loyalty migration. Other launch decisions: high-value order threshold, pickup reservation rules, installments, gateway wallet support, notification consent/retention, legal policies and integration credentials. These do not block architecture drafting but block affected production behavior.

Need V3 mockups and original logo, live-site network access, source exports and POS/app API contracts. Network domain additions were saved as a draft; saving is not runtime application or publication. No application implementation has begun.

## User clarification received
The user answered “yes” to the listed delivery rules: treat Bakı 5 ₼, free delivery from 60 ₼, 14-day returns, inspection before payment and cash/card at the door as approved policy direction. Regional pricing remains unspecified because no rate was proposed. Provider terminal capability still needs validation.
The user answered “all” to loyalty: approve the requested feature direction and explicit proposed durations (30-day welcome validity/guest claim window; 12-month expiry), but do not invent X/Y earn/redemption percentages or A/B tier thresholds. These numeric values remain open; sale stacking was not a concrete yes/no proposal and still needs an explicit rule.
The user answered “yes” to the provider/migration question: specific provider names and migration source remain unidentified. Do not infer a gateway or POS system from this answer. Earlier pending-policy statements are superseded only by the explicit confirmations above.

## Approved implementation updates
- Continue automatically after green phase gates; stop for concrete missing decisions or external blockers.
- Written sections 2 and 6 replace all V3/mockup dependencies. Design original UI; use temporary plain text wordmark and neutral brand image blocks until assets are imported.
- Returned purchases whose bonuses were spent create wallet debt, offset by future earnings. Do not reduce refunds by that spent bonus amount.
