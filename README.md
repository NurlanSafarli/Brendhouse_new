# Brend House

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
