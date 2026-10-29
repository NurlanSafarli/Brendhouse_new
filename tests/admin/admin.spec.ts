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

test("CSV import, media and stock stay local and survive reload", async ({
  page,
}, info) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "İdxal / ixrac", exact: true })
    .click();
  await page
    .getByLabel("CSV məzmunu", { exact: true })
    .fill('code,title,price\nIMPORT-1,"Təsdiqlənməmiş, köynək",19.90');
  await page.getByRole("button", { name: "İdxalı yoxla" }).click();
  await page.getByRole("button", { name: "Qaralamalara idxal et" }).click();
  await page.getByRole("button", { name: "Məhsullar", exact: true }).click();
  await page.getByRole("button", { name: "IMPORT-1 redaktə et" }).click();
  await page.getByRole("button", { name: "Variant əlavə et" }).click();
  await page.getByLabel("Rəng 1", { exact: true }).fill("Təsdiqlənməmiş rəng");
  await page.getByLabel("Ölçü 1", { exact: true }).fill("Təsdiqlənməmiş ölçü");
  await page.getByLabel("EAN-13 1", { exact: true }).fill("4006381333931");
  await page.getByLabel("Variant qiyməti 1", { exact: true }).fill("19.90");
  await page
    .getByRole("button", { name: "Dəyişiklikləri saxla", exact: true })
    .click();
  const png = Buffer.from(
    await page.evaluate(() => {
      const canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = 32;
      const context = canvas.getContext("2d")!;
      context.fillStyle = "#A47A68";
      context.fillRect(0, 0, 32, 32);
      return canvas.toDataURL("image/png").split(",")[1];
    }),
    "base64",
  );
  await page.getByLabel("Şəkil əlavə et", { exact: true }).setInputFiles({
    name: "unverified.png",
    mimeType: "image/png",
    buffer: png,
  });
  await expect(
    page.getByRole("img", { name: "Təsdiqlənməmiş şəkil önizləməsi" }),
  ).toBeVisible();
  await page
    .getByLabel("Şəkil 1 təsviri", { exact: true })
    .fill("Təsdiqlənməmiş test şəkli");
  await page.getByRole("button", { name: "Şəkilləri saxla" }).click();
  await expect(
    page.getByText("Şəkil qaralaması saxlanıldı.", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Stok", exact: true }).click();
  await expect(
    page.getByText("Miqdar daxil edilməyib", { exact: true }),
  ).toBeVisible();
  await page.getByLabel(/IMPORT-1.*miqdar/).fill("-2");
  await page.getByRole("button", { name: "Stoku saxla" }).click();
  await expect(
    page.getByText("0–9999999 arası tam ədəd daxil edin."),
  ).toBeVisible();
  await page.getByLabel(/IMPORT-1.*miqdar/).fill("0");
  await page.getByRole("button", { name: "Stoku saxla" }).click();
  await page.reload();
  await page.getByRole("button", { name: "Stok", exact: true }).click();
  await expect(
    page.getByText("Təsdiqlənməmiş miqdar: 0", { exact: true }),
  ).toBeVisible();
  await page.getByLabel("Görünüş rolu").selectOption("content");
  await expect(
    page.getByRole("button", { name: "Stoku saxla" }),
  ).toBeDisabled();
  await page.screenshot({
    path: `/tmp/brendhouse-inventory-${info.project.name}.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "Məhsullar", exact: true }).click();
  await page.getByRole("button", { name: "IMPORT-1 redaktə et" }).click();
  await expect(
    page.getByRole("img", { name: "Təsdiqlənməmiş test şəkli" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `/tmp/brendhouse-media-${info.project.name}.png`,
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "İdxal / ixrac", exact: true })
    .click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "CSV ixrac et" }).click();
  expect((await downloadPromise).suggestedFilename()).toBe(
    "unverified-catalog.csv",
  );
});
