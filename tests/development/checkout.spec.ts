import { test, expect } from "@playwright/test";
test("unverified browsing, cart persistence and guest checkout fail closed", async ({
  page,
}) => {
  page.on("pageerror",error=>{throw error;});
  await page.goto("/bolme/kisi");
  await expect(page.getByText("Polo · Təsdiqlənməyib")).toBeVisible();
  await page
    .getByRole("link", { name: "Klassik kişi polo köynəyi", exact: true })
    .first()
    .click();
  await expect(
    page.getByText("Məhsul məlumatları təsdiqlənməyib."),
  ).toBeVisible();
  await page.getByRole("button", { name: "M", exact: true }).click();
  await page.getByRole("button", { name: "Səbətə əlavə et →" }).click();
  await expect(page.getByRole("status")).toHaveText(
    "Məhsul səbətə əlavə edildi.",
  );
  await page.getByRole("link", { name: "Səbətə bax →" }).click();
  await expect(
    page.getByRole("heading", { name: "Səbətim (1)" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Səbətim (1)" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Miqdarı artır" }).click();
  await expect(
    page.getByRole("heading", { name: "Səbətim (2)" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/cart-mobile.png",
    fullPage: true,
  });
  await page.getByRole("link", { name: "Qeydiyyatsız sifariş et →" }).click();
  await page.getByLabel("Ad və soyad").fill("Test istifadəçisi");
  await page.getByLabel("Telefon nömrəsi").fill("+994 50 123 45 67");
  await page.getByLabel("Ünvan (Bakı)").fill("Test ünvanı");
  await expect(page.locator("input[type=password]")).toHaveCount(0);
  await page.getByRole("button", { name: "Sifarişi təsdiqlə →" }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText(
    "Sifariş qəbulu hazırda əlçatan deyil",
  );
  await page.screenshot({
    path: "test-results/checkout-mobile.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
