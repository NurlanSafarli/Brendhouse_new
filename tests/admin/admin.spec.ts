import { test, expect } from "@playwright/test";
test("admin drafts persist locally without publishing and role preview limits editing", async ({
  page,
}, info) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Məhsullar", exact: true }).click();
  await page.getByLabel("Məhsul adı").fill("Təsdiqlənməmiş məhsul");
  await page.getByLabel("Daxili kod").fill("TEST-ONLY-1");
  await page.getByLabel("Qiymət (₼)").fill("27.90");
  await page
    .getByRole("button", { name: "Qaralamanı saxla", exact: true })
    .click();
  await expect(
    page.getByRole("cell", { name: "Təsdiqlənməmiş məhsul", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("cell", { name: "Təsdiqlənməyib", exact: true }),
  ).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Məhsullar", exact: true }).click();
  await expect(page.getByRole("cell", { name: "TEST-ONLY-1" })).toBeVisible();
  await page.getByLabel("Görünüş rolu").selectOption("support");
  await expect(
    page.getByRole("button", { name: "Qaralamanı saxla", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("button", { name: "Dəyişikliklər", exact: true })
    .click();
  await expect(page.getByText("Məhsul qaralaması yaradıldı")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "İcmal", exact: true }).click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: `test-results/admin-${info.project.name}.png`,
    fullPage: true,
  });
});
