import { test, expect } from "@playwright/test";
test("optional phone preview never creates real identity and supports account tabs", async ({
  page,
}) => {
  await page.goto("/bonus-karti");
  await page.getByLabel("Telefon nömrəsi").fill("+994501234567");
  await page.getByRole("button", { name: "Davam et →", exact: true }).click();
  await expect(
    page.getByText("Axını yoxlamaq üçün 123456", { exact: false }),
  ).toBeVisible();
  await page.getByLabel("SMS kodu").fill("000000");
  await page.getByRole("button", { name: "Kodu yoxla" }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText(
    "Kod yanlışdır",
  );
  await page.getByLabel("SMS kodu").fill("123456");
  await page.getByRole("button", { name: "Kodu yoxla" }).click();
  await expect(
    page.getByText("Test axını tamamlandı.", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByText("TEST GÖRÜNÜŞÜ · AKTİV KART DEYİL"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Bildirişlər", exact: true }).click();
  await expect(page.getByRole("checkbox")).not.toBeChecked();
  await page.getByRole("button", { name: "Bonus kartı", exact: true }).click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: "test-results/bonus-mobile.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(
    await page.evaluate(() => localStorage.getItem("bh-account")),
  ).toBeNull();
});
