import { test, expect } from "@playwright/test";

test.describe("empty catalog baseline", () => {
  test("homepage presents the reset state", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /the next structure/i })).toBeVisible();
    await expect(page.getByText("Catalog cleared")).toBeVisible();
    await expect(page.locator('a[href^="/product/"]')).toHaveCount(0);
  });

  test("shop has no product cards and explains the rebuild", async ({ page }) => {
    await page.goto("/shop");
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(0);
    await expect(page.getByText("New products incoming.")).toBeVisible();
    await expect(page.getByText("00", { exact: true })).toBeVisible();
  });

  test("old product routes return not found", async ({ page }) => {
    const response = await page.goto("/product/old-product");
    expect(response?.status()).toBe(404);
  });

  test("search opens with an empty catalog", async ({ page }) => {
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
