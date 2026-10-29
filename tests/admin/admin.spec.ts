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
  await expect(
    page.getByRole("cell", { name: "TEST-ONLY-1", exact: true }),
  ).toBeVisible();
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

test("variant and size guide editors validate then persist unverified drafts", async ({
  page,
}, info) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Məhsullar", exact: true }).click();
  await page.getByLabel("Məhsul adı", { exact: true }).fill("Polo qaralaması");
  await page.getByLabel("Daxili kod", { exact: true }).fill("DRAFT-POLO");
  await page.getByLabel("Qiymət (₼)", { exact: true }).fill("27.90");
  await page
    .getByRole("button", { name: "Qaralamanı saxla", exact: true })
    .click();
  await page.getByRole("button", { name: "DRAFT-POLO redaktə et" }).click();
  await page.getByRole("button", { name: "Variant əlavə et" }).click();
  await page.getByLabel("Rəng 1", { exact: true }).fill("Krem");
  await page.getByLabel("Ölçü 1", { exact: true }).fill("M");
  await page.getByLabel("EAN-13 1", { exact: true }).fill("2000000000016");
  await page.getByRole("button", { name: "Dəyişiklikləri saxla" }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText("EAN-13");
  await page.getByLabel("EAN-13 1", { exact: true }).fill("2000000000015");
  await page
    .getByLabel("Parça tərkibi", { exact: true })
    .fill("Yoxlanılmamış test məlumatı");
  await page.getByRole("button", { name: "Dəyişiklikləri saxla" }).click();
  await expect(
    page.getByText("Məhsul dəyişiklikləri lokal qaralamada saxlanıldı."),
  ).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Məhsullar", exact: true }).click();
  await page.getByRole("button", { name: "DRAFT-POLO redaktə et" }).click();
  await expect(page.getByLabel("EAN-13 1", { exact: true })).toHaveValue(
    "2000000000015",
  );
  await expect(page.getByLabel("Parça tərkibi", { exact: true })).toHaveValue(
    "Yoxlanılmamış test məlumatı",
  );
  await page
    .getByRole("button", { name: "Ölçü cədvəlləri", exact: true })
    .click();
  await page.getByLabel("Kateqoriya", { exact: true }).fill("Polo");
  await page.getByRole("button", { name: "Ölçü sətri əlavə et" }).click();
  await page.getByLabel("Ölçü 1", { exact: true }).fill("M");
  await page.getByLabel("Sinə (sm) 1", { exact: true }).fill("101-95");
  await page.getByRole("button", { name: "Cədvəl qaralamasını saxla" }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText(
    "artan aralıq",
  );
  await page.getByLabel("Sinə (sm) 1", { exact: true }).fill("95-101");
  await page.getByRole("button", { name: "Cədvəl qaralamasını saxla" }).click();
  await page.reload();
  await page
    .getByRole("button", { name: "Ölçü cədvəlləri", exact: true })
    .click();
  await page.getByRole("button", { name: "Cədvəli aç" }).click();
  await expect(page.getByLabel("Sinə (sm) 1", { exact: true })).toHaveValue(
    "95-101",
  );
  await page.getByLabel("Görünüş rolu").selectOption("support");
  await expect(
    page.getByRole("button", { name: "Cədvəl qaralamasını saxla" }),
  ).toBeDisabled();
  await expect(page.getByLabel("Kateqoriya", { exact: true })).toBeDisabled();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("bh-admin-preview")!),
  );
  expect(stored.products[0].verification).toBe("UNVERIFIED");
  expect(stored.guides[0].publication).toBe("DRAFT");
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: `/tmp/brendhouse-size-editor-${info.project.name}.png`,
    fullPage: true,
  });
});
