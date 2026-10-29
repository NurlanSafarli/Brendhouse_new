# Progress

## Phase 1 — in progress, blocked on Prisma engine network access

Built:
- Next.js/TypeScript/Tailwind workspace and shared shadcn-style Radix components.
- `/design-system`: tokens, self-hosted Manrope (Latin + extended glyphs), typography/spacing, buttons, inputs/errors, badges, announcement controls, product image blocks, mini cart, modal, accordion, size guide empty state and quantity controls.
- NestJS API health endpoint and generated OpenAPI document.
- Local PostgreSQL 17, Redis 7 and Meilisearch services.
- Draft catalog/inventory/policy/outbox/audit Prisma schema, publication constraint SQL, quarantined catalog import and guarded unverified seed scripts.

Verified:
- npm dependency installation complete, lockfile committed.
- Lint and frontend/API TypeScript checks passed.
- Frontend and API production builds passed.
- Five unit tests passed (money precision and import validation).
- Two Chromium tests passed at 390px and 1440px: no horizontal overflow, no browser errors, modal close/focus return, size tabs, unverified table exclusion, empty cart and announcement dismissal.
- Mobile and desktop screenshots visually reviewed.
- API health and OpenAPI requests, PostgreSQL SELECT 1, Redis PING, Meilisearch health and rendered design-system request passed.

Outstanding / blocked:
- Prisma download gets proxy 403 for binaries.prisma.sh. Allowlist addition saved in environment draft; runtime access is not yet applied. Checksum/TLS verification has not been bypassed.
- Prisma validation/client/migration generation, DB constraints, import repeatability and seed/publication integration tests are unrun.
- Complete commerce/identity/loyalty schema and worker/admin foundations after database tooling is available. Phase 1 is NOT complete; Phase 2 has not begun.
- Current frontend is a foundation/review page, not the finished storefront. Announcement scheduling/automatic rotation and real catalog-driven UI belong to later work. Size table correctly withholds unverified data.

Approved updates (not deviations): written specifications replace V3 requirements; neutral placeholders/text wordmark allowed; phases continue automatically after green gates; spent returned-order bonuses create debt offset by future earnings. Architecture and stack unchanged.

Next: apply saved Prisma network access, finish and validate Phase 1, then proceed automatically to catalog/search/PDP Phase 2. Provider identities, regional delivery pricing and numeric loyalty rules remain open for their dependent phases.

## Follow-up fixes
- Rechecked Prisma: checksum download still fails with proxy 403. Saved draft contains binaries.prisma.sh, but runtime custom allowed_hosts remains empty. User must apply/publish the saved environment network change; no duplicate draft was created.
- Import payloads now explicitly allowlist variant fields, preventing source JSON from injecting IDs or nested relation writes.
- Blank identifiers and prices above PostgreSQL Int range are rejected.
- Development provenance is preserved on re-import; drafted SQL additionally prevents clearing it under concurrent updates. SQL remains unexecuted pending Prisma/migrations.
- Lint and frontend/API type-check passed; 7 unit tests passed. Import DB integration/type verification still awaits the generated Prisma client. Phase 1 remains incomplete; Phase 2 has not started.

## Phase 2 — frontend started by explicit user instruction
The user authorized beginning Phase 2 while environment preparation continues. This supersedes waiting for Phase 1's green database gate for independent frontend work; it does not mark Phase 1 complete.

Implemented:
- Original warm-neutral homepage, sticky navigation, mobile menu, section tiles, contact footer and responsive branded image blocks.
- Section/category/search routes preserving legacy path shapes; URL-based query, size, color and sort controls.
- Public catalog contract rejects development/unverified/malformed products, attributes, prices and stock. Server-side adapter uses a configured NestJS API address and distinguishes outages from empty results; no fabricated fallback products.
- Product-detail component: readable title/code, variant-derived price, color/size selection, unavailable sizes, verified attribute cards, size modal and adjacent confirmed-policy trust block. Cart CTA intentionally remains disabled until Phase 3.
- Local guest wishlist persistence, cross-tab updates, empty state, loading/error/404 states.

Verified: lint, frontend/API type-check and production builds passed; 11 unit tests and 4 browser tests passed. Homepage/catalog screenshots reviewed at 390px. Tests cover route navigation, URL filters, unavailable product protection and horizontal overflow at 390px/1440px; existing modal tests also passed.

Not complete: live NestJS catalog endpoints/Prisma queries, Meilisearch indexing/autocomplete/synonyms/typo tolerance, real media, catalog-loaded PDP browser verification, verified category-specific size charts, stock/branch data, quick add, load-more scroll restoration, store/discount filters and remaining Phase 2 discovery features. Current category titles use generic copy until category API metadata is available. Wishlist currently links saved product slugs; enriched cards depend on catalog API. Public policies currently have one code source with confirmed values; admin PolicySet integration remains pending. No claim of full Phase 2 completion or production readiness.

Prisma recheck still returned proxy 403. Phase 1 migration and DB integration gates remain open. Next: complete shared DB/API/search prerequisites when runtime domain access is applied, then finish Phase 2 against verified catalog data. Phase 3 has not started.

## Phase 3 — cart and guest checkout frontend
Explicit user authorization: begin Phase 3 despite outstanding earlier integration gates; temporary unverified products may be displayed. Provider selected: Kapital Bank e-commerce.

Implemented: development-only fixture catalog (four clearly marked UNVERIFIED/DRAFT records); production public guard unchanged; variant add-to-cart; persistent guest cart/count, quantity limits/removal; integer-qəpik totals and explicit discounts/delivery/free threshold; guest name/phone/address and pay-on-delivery form; shared summary; safe 503 checkout boundary that creates no orders, logs no PII and takes no payments. Cards remain disabled. Fixtures require NODE_ENV=development AND ENABLE_UNVERIFIED_CATALOG=true. No fabricated composition, care or size-chart values added.

Validation: lint and frontend/API type-check pass; production frontend/API build passes; 14 unit tests pass; development Playwright journey passes (product selection, persisted cart, quantity update, guest form, safe unavailable response, mobile overflow). Mobile cart/checkout screenshots reviewed. Production browser regression result recorded below.

Still incomplete: server-authoritative quotes, stock reservation/revalidation, order schema/persistence/idempotency, promo engine, bonus integration, cart drawer, complete phone masking, delivery estimates, pickup/regional rules, Kapital Bank adapter/webhook/3DS flows, confirmation/invoice/notifications, refunds, full checkout e2e. No real order acceptance, no payment success and no complete Phase 3 claim. Client totals are display-only and must never be trusted by the future server. Backend work still requires the blocked Prisma prerequisite; bank documentation and sandbox credentials are also missing. Phase 4 has not begun.

### Phase 3 validation checkpoint
Production browser regression: all 4 tests passed, in addition to the development guest checkout journey (1 passed), 14 unit tests, lint, frontend/API type-check and production build. Temporary products remain unavailable in production.

Follow-up: Prisma validation again returned proxy 403 for binaries.prisma.sh. The subsequent escalated retry was aborted during approval and did not establish access. Runtime allowed_hosts was still empty. Do not claim migrations, persisted orders or Kapital Bank payments work. Required next actions: apply the already-saved network domain addition through environment settings and supply the selected bank's official merchant integration documentation and sandbox credentials securely. No payment credentials should be sent in chat.

## Scope update — frontend-only work authorized
User explicitly deferred real DB/payment integration. Earlier Prisma and bank prerequisites are deferred integration work, not blockers to frontend implementation. No further DB or credential retries are needed for frontend work.

Added typed CheckoutPort with separate HTTP and development preview adapters; preview completion, decline and unavailable scenarios; explicit no-real-order confirmation; stable request idempotency key; no PII persistence/network calls from the preview adapter. Added dev:preview, build:frontend and test:preview commands and docs/frontend-integration.md. Production retains a safe unavailable checkout endpoint. Existing architecture remains the future target. Remaining admin/account/loyalty/content and catalog features are not claimed complete.
Frontend-only checkpoint: lint, frontend/API type-check and frontend production build passed; 17 unit tests passed, including preview production exclusion, HTTP response validation and idempotency headers. The development browser journey passed all three checkout outcomes (unavailable, declined, explicit test completion) and cart clearing. Confirmation screen visually inspected. No real DB, payment or credentials were required.

## Phase 4 frontend checkpoint
Added optional phone/code preview, resend countdown, invalid/expired/locked code states, explicit test completion, bonus-card appearance and account sections (bonus, orders, addresses, wishlist, notification choices). No real identity/card/session or fabricated balances. Account data remains empty until backend integration. Entry is available from header and cart without interrupting guest checkout. Unit tests verify preview production exclusion, cooldown, replay, expiry and attempts; browser test covers invalid code, completion and account tabs. Real POS API, wallet ledger/redemption/tier features, linked physical cards and QR/Code128 remain deferred; no complete Phase 4 claim.

## Phase 5 frontend checkpoint
Created separate Next.js apps/admin. Dashboard with unavailable metrics; locally persisted product/content/policy drafts; role-view editing restrictions; local change history. Real RBAC/publication/audit are not simulated as server security. Production admin stays unavailable. 390px and 1440px browser tests verify draft persistence, unverified status, role-view restriction and history. Admin screenshots reviewed. Operational orders/customers/bonus views are empty states, not full modules. Advanced variant/media/size-chart/import/inventory/campaign/reporting interfaces remain unfinished.

## Phase 6 frontend checkpoint
Added About, Contact, FAQ and delivery/returns pages using supplied facts and centralized confirmed policies; metadataBase/OpenGraph; default noindex; launch-gated robots and static sitemap; explicit fixture-product noindex. Production browser checks verify no preview account and no private/fixture sitemap URLs. No analytics, migration/redirect completeness, performance scores or launch readiness claimed.

Validation: dependency installation complete; lint, all application type-checks, 19 unit tests and both storefront/admin production builds passed. Browser suites: 6 production storefront checks, 2 development checkout/bonus journeys and 2 admin viewport checks passed. Frontend additions preserve the requested stack. Real services remain deferred, not blockers for further frontend work.

## GitHub Pages publication preparation
User explicitly requested push and GitHub Pages deployment. Added an isolated static-preview build (storefront plus admin), base-path-safe static routes, client-side catalog filtering and GitHub Actions deployment workflow. Normal runtime architecture/production guards remain unchanged; generated Pages output deliberately enables only frontend simulations. Static smoke test passed: product/cart/guest preview, OTP, admin local drafts, hard refresh, URL filters and no browser JS errors. GitHub API and public Pages URL requests currently return environment-proxy Forbidden, including escalated retries, so remote configuration/deployment verification is unavailable from this session.
