import { expect, test } from "@playwright/test";

test("redirects to the Polish electronics storefront", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/pl$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Komponenty");
  await expect(page.getByText("Darmowa dostawa od 500 PLN")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Popularne komponenty" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Mikrokontrolery/ })).toBeVisible();
});

test("searches the mock catalog by exact MPN", async ({ page }) => {
  await page.goto("/en");
  const search = page.getByRole("searchbox").first();
  await search.fill("STM32F407VGT6");
  await search.press("Enter");
  await expect(page).toHaveURL(/\/en\/catalog\?q=STM32F407VGT6/);
  await expect(page.getByText("STM32F407VGT6", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "ARM Cortex-M4 Microcontroller", exact: true }).first()).toBeVisible();
});

test("navigates from a category to a product and keeps an MOQ-valid cart line", async ({ page }) => {
  await page.goto("/en/catalog/microcontrollers");
  await expect(page.getByRole("heading", { level: 1, name: "Microcontrollers" })).toBeVisible();
  await page.getByRole("link", { name: "ARM Cortex-M4 Microcontroller", exact: true }).first().click();
  await expect(page).toHaveURL(/\/en\/products\/product-001$/);
  await page.getByRole("button", { name: /Add VC-MIC-00001/ }).click();
  await page.getByRole("link", { name: /Cart 1/ }).click();
  await expect(page).toHaveURL(/\/en\/cart$/);
  await expect(page.getByRole("article").getByText("VC-MIC-00001", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Shopping cart" })).toBeVisible();
  await expect(page.getByText("PLN 48.90", { exact: true }).first()).toBeVisible();
});

test("filters the catalog by category and manufacturer", async ({ page }) => {
  await page.goto("/en/catalog");
  await page.getByLabel("Categories").selectOption("sensors");
  await page.getByLabel("Manufacturers").selectOption("Bosch Sensortec");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(page).toHaveURL(/category=sensors/);
  await expect(page.getByText("BME280", { exact: true }).first()).toBeVisible();
  const sensorCard = page.getByRole("article").filter({ hasText: "BME280" }).first();
  await expect(sensorCard.getByText("Bosch Sensortec", { exact: true })).toBeVisible();
});
