import { test, expect } from "@playwright/test";
test("storefront navigation, filters and honest unavailable states", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(
    page.getByRole("heading", { name: "Öz tərzin. Öz hekayən." }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `test-results/home-${info.project.name}.png`,
    fullPage: true,
  });
  await page.getByRole("link", { name: "Kolleksiyalara bax" }).click();
  await expect(
    page.getByRole("heading", { name: "Qadın", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Məhsulları hazırda göstərə bilmirik" }),
  ).toBeVisible();
  await page
    .getByRole("searchbox", { name: "Axtarış", exact: true })
    .fill("köynək");
  await page.getByRole("button", { name: "Tətbiq et" }).click();
  await expect(page).toHaveURL(/q=k/);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `test-results/catalog-${info.project.name}.png`,
    fullPage: true,
  });
  await page.goto("/product/unverified-kisi-polo");
  await expect(
    page.getByRole("heading", { name: "Məhsulları hazırda göstərə bilmirik" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /Səbətə əlavə/ })).toHaveCount(
    0,
  );
  await page.goto("/secilmisler");
  await expect(
    page.getByRole("heading", { name: "Bəyəndiklərini bir yerdə saxla" }),
  ).toBeVisible();
  await page.goto("/bolme/invalid");
  await expect(
    page.getByRole("heading", { name: "Axtardığınız səhifə tapılmadı" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
