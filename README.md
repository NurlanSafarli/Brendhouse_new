# Brend House

Phase 1 implementation in progress. Architecture: [blueprint](docs/blueprint.md). Latest user instructions supersede the blueprint's old phase-approval and V3 requirements: continue on green phase gates; design from the written specification.

Node 24, npm 11. From repository root: `npm ci`, `npm run dev`. Review `/design-system` on the running storefront. The root route is only the Phase 1 shell, not the final storefront.

Checks: `npm run lint`, `npm run typecheck`, `npm run build`, `npm test`.

The design-system page is excluded from indexing. It illustrates reusable components without publishing fabricated products, measurements or prices. Product and size data must be verified before publication. See PROGRESS.md for current scope and remaining work.
