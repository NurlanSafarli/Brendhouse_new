# Brend House

**Current scope: frontend-only.** Run `npm run dev:preview` to review temporary products and complete the guest checkout simulation without a database, bank credentials or external services. Run `npm run build:frontend` for a frontend-only production build. Integration instructions: [frontend handoff](docs/frontend-integration.md). Older database/payment blocker notes below describe deferred backend work, not prerequisites for this preview.

Phase 1 implementation in progress. Architecture: [blueprint](docs/blueprint.md). Latest user instructions supersede the blueprint's old phase-approval and V3 requirements: continue on green phase gates; design from the written specification.

Node 24, npm 11. From repository root: `npm ci`, `npm run dev`. Review `/design-system` on the running storefront. The root route is only the Phase 1 shell, not the final storefront.

Checks: `npm run lint`, `npm run typecheck`, `npm run build`, `npm test`.

The design-system page is excluded from indexing. It illustrates reusable components without publishing fabricated products, measurements or prices. Product and size data must be verified before publication. See PROGRESS.md for current scope and remaining work.

## Services and API

Copy `.env.example` to `.env` and replace local development credentials. Run `docker compose --env-file .env -f infrastructure/compose.yml up -d`. PostgreSQL, Redis and Meilisearch bind only to loopback. The API runs with `npm run dev -w @brendhouse/api` (port 4000); health is `/api/v1/health`, OpenAPI UI `/api/docs`. Current health indicates process liveness, not commerce readiness. The saved OpenAPI document describes only implemented routes.

## Database status

The schema/import/seed are work in progress. Network policy currently blocks Prisma engines at `binaries.prisma.sh`. Migration generation, client generation and DB integration verification have **not** passed. Do not run seeds against production or consider `db:migrate` sufficient while no migration has been generated. After access is restored: validate/generate Prisma, generate a reviewed initial migration, incorporate `prisma/constraints/catalog.sql`, then apply and run import/publication integration tests. Commerce, identity and loyalty models still need completion before Phase 1 can pass.

## Browser review

`npm run test:browser` runs 390px and 1440px Chromium flows. This environment uses `/usr/bin/chromium`; set CHROMIUM_PATH for another installation. Browser tests launch the built storefront when needed. Screenshots are written to ignored `test-results/`. Unit tests run separately with `npm test`.

## Phase 2 frontend

Routes: `/`, `/bolme/kisi`, `/bolme/qadin`, `/bolme/usaq`, `/bolme/diger`, `/mehsul-kateqoriyasi/{slug}`, `/axtaris`, `/product/{slug}`, `/secilmisler` and `/design-system`.

The server-only `COMMERCE_API_URL` will point to the NestJS service once its catalog endpoints are implemented. Until then the UI displays a real service-unavailable state, never seed data. The adapter expects `/api/v1/catalog` and `/api/v1/catalog/{slug}` using the contract in `packages/contracts/src/catalog.ts`. This is a frontend contract, not a claim that those endpoints exist today. Product UI is built but live-data verification remains pending. Checkout and add-to-cart are Phase 3.

## Temporary products and Phase 3 review

Start the development storefront with temporary products:

```sh
ENABLE_UNVERIFIED_CATALOG=true npm run dev -w @brendhouse/storefront -- --port 3001
```

Open `/bolme/kisi`, select a product and size, add it to `/sebet`, then use `/checkout`. Temporary records are labelled unverified and cannot appear with NODE_ENV=production. The POST checkout endpoint deliberately returns 503 until real order processing is implemented. It does not persist orders or send data to Kapital Bank. The bank is selected, but no payment integration exists yet.

Development browser journey: `npx playwright test --config playwright.development.config.ts`. Production regression: `CI=1 npm run test:browser` after `npm run build`; stop any previously started storefront before rebuilding/testing to avoid stale assets.

## Bonus/account and admin previews

- `npm run dev:preview`: `/bonus-karti` (test SMS flow), `/hesab` (account UI), `/bonus-qaydalari`.
- `npm run dev:admin`: separate admin application on port 3002; edits are browser-local, unpublished drafts.
- `npx playwright test --config playwright.admin.config.ts`: admin mobile/desktop tests.
- `npm run build:frontend`: builds storefront and admin.
- New content: `/haqqimizda`, `/elaqe`, `/faq`, `/catdirilma-qaytarma`.

These are frontend checkpoints, not completed production phases. Advanced admin/loyalty/catalog functionality remains in PROGRESS.md. Keep SITE_INDEXABLE=false until a reviewed production launch.
