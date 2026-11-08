import { expect, test } from "@playwright/test";

test("opens the customer account from the demo login", async ({ page }) => {
  await page.goto("/en/login");
  await page.getByRole("button", { name: "Open customer demo" }).click();
  await expect(page).toHaveURL(/\/en\/account$/);
  await expect(page.getByRole("heading", { level: 1, name: "Account overview" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Orders" })).toBeVisible();
});

test("opens the single-store administrator workspace", async ({ page }) => {
  await page.goto("/en/login");
  await page.getByRole("button", { name: "Open admin demo" }).click();
  await expect(page).toHaveURL(/\/en\/admin$/);
  await expect(page.getByRole("heading", { level: 1, name: "Operations overview" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Customers" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Products" })).toBeVisible();
});

test("localizes admin content and paginates management tables", async ({ page }) => {
  await page.goto("/tr/admin/pricing");
  await expect(page.getByRole("heading", { level: 1, name: "Fiyatlandırma" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Mağaza fiyatları" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sezon kampanyası" })).toBeVisible();
  await expect(page.getByText("Normal satış fiyatı üzerinden herkese açık indirim").first()).toBeVisible();

  await page.goto("/tr/admin/cms");
  await expect(page.getByText("Ana sayfa endüstriyel bannerı", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Yayından kaldır" }).first()).toBeVisible();

  await page.goto("/tr/admin/products");
  const pagination = page.getByRole("navigation", { name: "Sayfalama" });
  await expect(pagination.getByText("24 kayıttan 1–5 arası")).toBeVisible();
  await pagination.getByRole("button", { name: "2. sayfaya git" }).click();
  await expect(pagination.getByText("24 kayıttan 6–10 arası")).toBeVisible();
  await expect(page.getByText("VC-CON-00006", { exact: true })).toBeVisible();
});

test("creates a regular customer account", async ({ page }) => {
  await page.goto("/en/register");
  await page.getByLabel("Full name").fill("Alex Morgan");
  await page.getByLabel("Email address").fill("alex@example.com");
  await page.getByLabel("Password", { exact: true }).fill("demo2026");
  await page.getByLabel("Repeat password").fill("demo2026");
  await page.getByRole("button", { name: "Create an account" }).click();
  await expect(page.getByRole("heading", { name: "Your account has been created" })).toBeVisible();
});

test("completes checkout and clears the cart", async ({ page }) => {
  await page.goto("/en/products/product-001");
  await page.getByRole("button", { name: /Add VC-MIC-00001/ }).click();
  await page.goto("/en/checkout");
  await page.getByLabel("Full name").fill("Alex Morgan");
  await page.getByLabel("Email address").fill("alex@example.com");
  await page.getByRole("textbox", { name: "Address", exact: true }).fill("ul. Przemysłowa 2");
  await page.getByLabel("Postal code").fill("00-001");
  await page.getByLabel("City").fill("Warszawa");
  await page.getByRole("button", { name: "Place order" }).click();
  await expect(page.getByRole("heading", { name: "Order confirmed" })).toBeVisible();
  await page.goto("/en/cart");
  await expect(page.getByRole("heading", { name: "Your cart is empty" })).toBeVisible();
});
