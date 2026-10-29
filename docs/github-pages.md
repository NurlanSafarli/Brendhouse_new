# GitHub Pages frontend preview

GitHub Pages serves static files; it cannot run NestJS, databases, Next.js route handlers or bank callbacks. This deployment is a deliberately isolated frontend preview, not a production store.

`npm run build:pages` copies source into ignored `.pages-build`, builds static storefront/admin exports, and writes `pages-dist`. The build uses repository base paths, generated product/section routes and client-side catalog filters. It removes API routes only in the generated copy. Explicit preview adapters are enabled only in this generated Pages build; ordinary production builds retain their existing guards. No secret environment files are copied. All products remain UNVERIFIED/DRAFT, OTP is a test, checkout creates no real order, and admin editing is browser-local. No account credentials or sensitive information should be entered in the public preview.

Local verification: `npm run build:pages && npm run test:pages`. The test serves the output under `/Brendhouse_new/` and exercises storefront, refresh, query filtering, guest checkout, OTP and admin persistence using Chromium.

Workflow: `.github/workflows/pages.yml` builds on pushes to main and uploads/deploys the Pages artifact. Expected URLs after GitHub completes deployment:
- Storefront: https://nurlansafarli.github.io/Brendhouse_new/
- Admin preview: https://nurlansafarli.github.io/Brendhouse_new/admin/

If initial automatic Pages enablement is denied, repository owner must select Settings → Pages → Build and deployment → Source: GitHub Actions, then rerun the workflow. The workflow's enablement attempt cannot override repository/organization permissions or plan restrictions. Do not claim a live deployment until the Actions deployment job and the public URL succeed.
