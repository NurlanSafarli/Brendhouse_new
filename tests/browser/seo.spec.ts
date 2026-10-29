import { test, expect } from "@playwright/test";
test("unfinished deployment stays unindexed and no private or fixture URLs enter sitemap", async ({
  page,
  request,
}) => {
  await page.goto("/haqqimizda");
  await expect(page).toHaveTitle("Haqqımızda | Brend House");
  await expect(page.locator("html")).toHaveAttribute("lang", "az");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Disallow: /");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).not.toContain("<loc>");
  await page.goto("/hesab");
  await expect(
    page.getByRole("link", { name: "Telefonla davam et →" }),
  ).toBeVisible();
  await expect(page.getByText("TEST GÖRÜNÜŞÜ · AKTİV KART DEYİL")).toHaveCount(
    0,
  );
  await page.goto("/faq");
  await page
    .getByRole("button", { name: "Sifariş üçün hesab lazımdır?" })
    .click();
  await expect(
    page.getByText(
      "Xeyr. Qeydiyyatsız checkout əsas seçimdir. Bonus kartı könüllüdür.",
    ),
  ).toBeVisible();
});
