import { test, expect } from "@playwright/test";

test.describe("Structure 01 catalog", () => {
  test("homepage presents the new collection", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("CAISN VAULT WASH ZIP").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "More products" })).toBeVisible();
    await expect(page.getByText("New products coming soon.")).toBeVisible();
  });

  test("shop lists all five Structure 01 pieces", async ({ page }) => {
    await page.goto("/shop");
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(5);
    await expect(page.getByText("CAISN VAULT WASH ZIP")).toBeVisible();
    await expect(page.getByText("CAISN ARC FLARED DENIM")).toBeVisible();
    await expect(page.getByText("05", { exact: true })).toBeVisible();
  });

  test("removed Archive 03 routes return not found", async ({ page }) => {
    const response = await page.goto("/product/caisn-archive-03-hoodie");
    expect(response?.status()).toBe(404);
  });

  test("new product routes render", async ({ page }) => {
    await page.goto("/product/caisn-vault-wash-zip");
    await expect(page.getByRole("heading", { name: "CAISN VAULT WASH ZIP" })).toBeVisible();
    await expect(page.getByText("COMPLETE THE LOOK")).toBeVisible();
  });

  test("search opens with the live catalog", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open search" }).click();
    await expect(page.getByRole("dialog", { name: "Search" })).toBeVisible();
  });

  test("cart opens empty", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Open cart/ }).click();
    const drawer = page.locator('[role="dialog"][aria-labelledby="cart-drawer-heading"]');
    await expect(drawer.getByText("Your cart is empty.")).toBeVisible();
  });

  test("has no horizontal overflow at key breakpoints", async ({ page }) => {
    for (const width of [390, 768, 1366, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("/");
      const sizes = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(sizes.scrollWidth).toBeLessThanOrEqual(sizes.clientWidth);
    }
  });
});
