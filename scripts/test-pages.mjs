import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
const root = path.resolve("pages-dist"),
  base = "/Brendhouse_new";
const types = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
  ".svg": "image/svg+xml",
  ".xml": "application/xml",
};
const server = createServer(async (req, res) => {
  try {
    let pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    if (!pathname.startsWith(base + "/")) {
      res.writeHead(404).end();
      return;
    }
    let file = path.resolve(root, pathname.slice(base.length + 1));
    if (!file.startsWith(root + path.sep) && file !== root) {
      res.writeHead(403).end();
      return;
    }
    if ((await stat(file)).isDirectory()) file = path.join(file, "index.html");
    const data = await readFile(file);
    res
      .writeHead(200, {
        "Content-Type": types[path.extname(file)] ?? "application/octet-stream",
      })
      .end(data);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(3010, "127.0.0.1", resolve));
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const origin = "http://127.0.0.1:3010" + base;
  await page.goto(origin + "/");
  await page.getByRole("link", { name: "Kolleksiyalara bax" }).click();
  await page
    .getByRole("link", { name: "Qadın köynəyi", exact: true })
    .first()
    .click();
  await page.getByRole("button", { name: "M", exact: true }).click();
  await page.getByRole("button", { name: "Səbətə əlavə et →" }).click();
  await page.getByRole("link", { name: "Səbətə bax →" }).click();
  await page.getByRole("link", { name: "Qeydiyyatsız sifariş et →" }).click();
  await page.getByLabel("Ad və soyad").fill("Pages Test");
  await page.getByLabel("Telefon nömrəsi").fill("+994501234567");
  await page.getByLabel("Ünvan (Bakı)").fill("Test ünvanı");
  await page.getByRole("button", { name: "Sifarişi təsdiqlə →" }).click();
  await page
    .getByRole("heading", { name: "Sifariş axını tamamlandı" })
    .waitFor();
  await page.goto(origin + "/bonus-karti/");
  await page.getByLabel("Telefon nömrəsi").fill("+994501234567");
  await page.getByRole("button", { name: "Davam et →", exact: true }).click();
  await page.getByLabel("SMS kodu").fill("123456");
  await page.getByRole("button", { name: "Kodu yoxla" }).click();
  await page.getByText("TEST GÖRÜNÜŞÜ · AKTİV KART DEYİL").waitFor();
  await page.goto(origin + "/admin/");
  await page.getByRole("button", { name: "Məhsullar", exact: true }).click();
  await page.getByLabel("Məhsul adı").fill("Pages test");
  await page.getByLabel("Daxili kod").fill("PAGES-TEST");
  await page.getByLabel("Qiymət (₼)").fill("10");
  await page
    .getByRole("button", { name: "Qaralamanı saxla", exact: true })
    .click();
  await page.getByRole("cell", { name: "PAGES-TEST", exact: true }).waitFor();
  await page.reload();
  await page.getByRole("button", { name: "Məhsullar", exact: true }).click();
  await page.getByRole("cell", { name: "PAGES-TEST", exact: true }).waitFor();
  assert.deepEqual(errors, []);
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.goto(origin + "/bolme/kisi/?q=polo");
  await page
    .getByRole("link", { name: "Klassik kişi polo köynəyi", exact: true })
    .first()
    .waitFor();
  assert.ok(
    (
      await page
        .locator("a")
        .evaluateAll((links) =>
          links.map((a) => a.getAttribute("href")).filter(Boolean),
        )
    ).every((href) => !href.startsWith("/") || href.startsWith(base + "/")),
  );
  await page.screenshot({
    path: "/tmp/brendhouse-pages-mobile.png",
    fullPage: true,
  });
  console.log(
    "Static Pages smoke passed: base path, product, cart, guest preview, OTP preview, admin drafts, refresh, query filters and no JS errors.",
  );
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
