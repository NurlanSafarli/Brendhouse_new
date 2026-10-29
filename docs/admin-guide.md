# Admin guide — foundation

The admin application is not implemented yet (Phase 5). No public product management endpoint exists.

Catalog imports require source IDs, human-readable Azerbaijani titles, ASCII slugs, codes, color/size variants, integer qəpik prices and valid unique EAN-13 barcodes. Run `npm run import:catalog -- source-name file.json` only after the database migration has been completed. Rows are processed atomically; rejected rows produce a nonzero exit and a stored report. Re-imports use source/sourceId and product/color/size identities. Imports revoke prior publication and verification. Missing variants are not deleted automatically; inventory reconciliation belongs to the POS adapter.

Development seeding requires `ALLOW_UNVERIFIED_SEED=true` and is prohibited with NODE_ENV=production. All seeded products are marked developmentOnly, UNVERIFIED and DRAFT. Do not approve these records; real catalog data must come from an authoritative import. Publication constraints are drafted in prisma/constraints/catalog.sql and must be incorporated into the migration before deployment. They are not yet applied.

Production policies are not currently published. Confirmed policy direction is recorded in the blueprint; provider-dependent methods must stay disabled until integration verification. Do not copy preview-page text into a second policy configuration.

## Local variant and size-guide editors

In the admin frontend, open Məhsullar → the product's Redaktə et action. Edit the title/code/base price, add color × size variants, enter EAN-13 barcodes and per-variant prices, and add composition/material/fit/season/care/origin draft text. Barcode checksums, duplicate color-size pairs, cross-product barcode collisions and invalid prices prevent saving. Fields remain UNVERIFIED/DRAFT; this does not publish catalog data or change stock.

Ölçü cədvəlləri manages separate local drafts per section/category. Add size rows with chest/waist/hips in cm and the body-measurement disclaimer. At least one measurement is required per row. Duplicate sizes, reverse/nonpositive ranges and duplicate section/category guides are rejected. Open an existing guide to edit it. Nothing is automatically copied into the public size guide.

The same editor works in the GitHub Pages frontend preview. Browser-local drafts are not shared across devices and are not a substitute for database persistence. Existing older product drafts remain usable with no variants/attributes; missing guide collections initialize empty. Support/store role previews can inspect but cannot save these forms. Real server permissions remain deferred.

### CSV, media and inventory preview
- **İdxal / ixrac** accepts UTF-8 CSV with exact `code,title,price` headers (AZN decimal price), at most 500 rows / 500 KB. Download an empty template, upload or paste, validate, review, then import. Existing codes update title/price while preserving variants, attributes, media and stock drafts. Errors reject the entire batch. Export contains only these three fields and is not a full backup; spreadsheet formula prefixes are neutralized.
- **Məhsullar → Redaktə et → Məhsul şəkilləri** accepts JPEG/PNG/WebP up to 5 MB, at most six per product. Browser creates bounded 900px previews; enter descriptions, select the primary image or remove images, then save. Originals are not uploaded or retained. Local-storage quota failures leave saved records unchanged and report an error.
- **Stok** edits a nonnegative integer quantity per existing variant; an unset value means unknown, not zero. Only the admin view can save. No invented warehouses, reservations, branch availability or POS authority. This draft quantity never changes storefront availability.
- All changes remain local UNVERIFIED/DRAFT records. Clearing browser storage loses them. Role selection remains UI preview only; production requires authenticated server authorization, media storage and authoritative inventory adapters.

Run `npm run dev:admin` (port 3002). Verify an import, add a variant and image, save stock, reload, then inspect Dəyişikliklər. Run `npx playwright test --config playwright.admin.config.ts` for mobile/desktop persistence and role-view tests.
