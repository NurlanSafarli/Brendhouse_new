import { test, expect } from "@playwright/test";
test("responsive components and accessible modal behavior", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/design-system");
  await page.evaluate(() => document.fonts.ready);
  await expect(
    page.getByRole("heading", {
      name: "Sadə görünür. Düşünülmüş hiss edilir.",
    }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Ölçü bələdçisi" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Qadın", exact: true }).click();
  await expect(
    dialog.getByRole("region", { name: "Qadın ölçüləri" }),
  ).toBeVisible();
  await expect(dialog.locator("table")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Ölçü bələdçisi" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Səbətim (0)" }).click();
  await expect(
    page.getByRole("heading", { name: "Səbətiniz boşdur" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Məlumatı bağla" }).click();
  await expect(
    page.getByRole("complementary", { name: "Məlumat" }),
  ).toHaveCount(0);
  await page.screenshot({
    path: `test-results/design-system-${info.project.name}.png`,
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
