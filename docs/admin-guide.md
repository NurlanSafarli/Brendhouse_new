# Admin guide — foundation

The admin application is not implemented yet (Phase 5). No public product management endpoint exists.

Catalog imports require source IDs, human-readable Azerbaijani titles, ASCII slugs, codes, color/size variants, integer qəpik prices and valid unique EAN-13 barcodes. Run `npm run import:catalog -- source-name file.json` only after the database migration has been completed. Rows are processed atomically; rejected rows produce a nonzero exit and a stored report. Re-imports use source/sourceId and product/color/size identities. Imports revoke prior publication and verification. Missing variants are not deleted automatically; inventory reconciliation belongs to the POS adapter.

Development seeding requires `ALLOW_UNVERIFIED_SEED=true` and is prohibited with NODE_ENV=production. All seeded products are marked developmentOnly, UNVERIFIED and DRAFT. Do not approve these records; real catalog data must come from an authoritative import. Publication constraints are drafted in prisma/constraints/catalog.sql and must be incorporated into the migration before deployment. They are not yet applied.

Production policies are not currently published. Confirmed policy direction is recorded in the blueprint; provider-dependent methods must stay disabled until integration verification. Do not copy preview-page text into a second policy configuration.
