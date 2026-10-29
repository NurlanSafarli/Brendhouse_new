import { cp, mkdir, readFile, writeFile, rm, symlink } from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";
const root = process.cwd(),
  stage = path.join(root, ".pages-build"),
  output = path.join(root, "pages-dist");
const base = process.env.PAGES_BASE_PATH ?? "/Brendhouse_new";
if (!/^\/[A-Za-z0-9_.-]+$/.test(base))
  throw new Error("Expected a single repository base path");
// Only generated, gitignored build directories are replaced. Source stays intact.
await rm(stage, { recursive: true, force: true });
await rm(output, { recursive: true, force: true });
await mkdir(stage, { recursive: true });
for (const name of ["apps", "packages"])
  await cp(path.join(root, name), path.join(stage, name), {
    recursive: true,
    filter: (source) =>
      !["node_modules", ".next", ".env", ".env.local"].includes(
        path.basename(source),
      ),
  });
for (const name of ["package.json", "package-lock.json"])
  await cp(path.join(root, name), path.join(stage, name));
await symlink(
  path.join(root, "node_modules"),
  path.join(stage, "node_modules"),
  "dir",
);
const store = path.join(stage, "apps/storefront");
async function edit(relative, fn) {
  const p = path.join(store, relative);
  await writeFile(p, fn(await readFile(p, "utf8")));
}
await writeFile(
  path.join(store, "next.config.ts"),
  `export default {output:'export',trailingSlash:true,basePath:${JSON.stringify(base)},images:{unoptimized:true},transpilePackages:['@brendhouse/design-system','@brendhouse/contracts']};`,
);
await rm(path.join(store, "app/api"), { recursive: true, force: true });
await edit("lib/development-catalog.ts", (s) =>
  s.replace(
    'process.env.NODE_ENV === "development"',
    'process.env.NEXT_PUBLIC_PAGES_PREVIEW === "true"',
  ),
);
for (const f of ["preview-checkout.ts", "preview-identity.ts"])
  await edit(`lib/commerce/${f}`, (s) =>
    s.replaceAll(
      'process.env.NODE_ENV !== "development"',
      'process.env.NEXT_PUBLIC_PAGES_PREVIEW !== "true"',
    ),
  );
for (const f of ["app/robots.ts", "app/sitemap.ts"])
  await edit(f, (s) => `export const dynamic='force-static';\n${s}`);
let listing = await readFile(
  path.join(root, "scripts/pages/listing.tsx"),
  "utf8",
);
listing = listing
  .replace("../../apps/storefront/lib/", "../lib/")
  .replace("../../apps/storefront/components/shop", "./shop");
await writeFile(path.join(store, "components/listing.tsx"), listing);
await writeFile(
  path.join(store, "app/(shop)/bolme/[section]/page.tsx"),
  `import {Listing} from '../../../../components/listing';const names:Record<string,string>={kisi:'Kişi',qadin:'Qadın',usaq:'Uşaq',diger:'Digər'};export function generateStaticParams(){return Object.keys(names).map(section=>({section}));}export default async function Page({params}:{params:Promise<{section:string}>}){const {section}=await params;return <Listing title={names[section]} section={section}/>;}`,
);
await writeFile(
  path.join(store, "app/(shop)/axtaris/page.tsx"),
  `import {Listing} from '../../../components/listing';export default function Page(){return <Listing title="Axtarış"/>;}`,
);
await writeFile(
  path.join(store, "app/(shop)/mehsul-kateqoriyasi/[slug]/page.tsx"),
  `import {Listing} from '../../../../components/listing';const names:Record<string,string>={polo:'Polo',koynek:'Köynək',sweatshirt:'Sweatshirt',salvar:'Şalvar'};export function generateStaticParams(){return Object.keys(names).map(slug=>({slug}));}export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <Listing title={names[slug]} category={names[slug]}/>;}`,
);
await edit(
  "app/(shop)/product/[slug]/page.tsx",
  (s) =>
    `import {developmentCatalog} from '../../../../lib/development-catalog';\nexport function generateStaticParams(){return developmentCatalog.map(p=>({slug:p.slug}));}\n${s}`,
);
const env = {
  ...process.env,
  NEXT_PUBLIC_PAGES_PREVIEW: "true",
  ENABLE_UNVERIFIED_CATALOG: "true",
  SITE_INDEXABLE: "false",
  COMMERCE_API_URL: "",
  NEXT_TELEMETRY_DISABLED: "1",
};
execFileSync(
  process.execPath,
  [path.join(root, "node_modules/next/dist/bin/next"), "build", "--webpack"],
  { cwd: store, env, stdio: "inherit" },
);
await cp(path.join(store, "out"), output, { recursive: true });
const admin = path.join(stage, "apps/admin");
await writeFile(
  path.join(admin, "next.config.ts"),
  `export default {output:'export',trailingSlash:true,basePath:${JSON.stringify(base + "/admin")},images:{unoptimized:true},transpilePackages:['@brendhouse/design-system']};`,
);
await writeFile(
  path.join(admin, "app/page.tsx"),
  `import {AdminPreview} from './preview';export default function Page(){return <AdminPreview/>;}`,
);
execFileSync(
  process.execPath,
  [path.join(root, "node_modules/next/dist/bin/next"), "build", "--webpack"],
  { cwd: admin, env, stdio: "inherit" },
);
await cp(path.join(admin, "out"), path.join(output, "admin"), {
  recursive: true,
});
await writeFile(path.join(output, ".nojekyll"), "");
console.log(`Static frontend preview: ${output} (base path ${base})`);
