import { test, expect } from "@playwright/test";

test.describe("Archive 03 catalog", () => {
  test("homepage presents the collection and future-product section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("CAISN ARCHIVE 03 HOODIE").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "More products" })).toBeVisible();
    await expect(page.getByText("New products coming soon.")).toBeVisible();
  });

  test("shop lists both Archive 03 pieces", async ({ page }) => {
    await page.goto("/shop");
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(2);
    await expect(page.getByText("CAISN ARCHIVE 03 HOODIE")).toBeVisible();
    await expect(page.getByText("CAISN ARCHIVE 03 WIDE JOGGER")).toBeVisible();
    await expect(page.getByText("02", { exact: true })).toBeVisible();
  });

  test("product pages include front and back photography", async ({ page }) => {
    await page.goto("/product/caisn-archive-03-hoodie");
    await expect(page.getByRole("heading", { name: "CAISN ARCHIVE 03 HOODIE" })).toBeVisible();
    await expect(page.getByRole("button", { name: /front/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /back/i })).toBeVisible();
    await expect(page.getByText("COMPLETE THE LOOK")).toBeVisible();
  });

  test("old product routes return not found", async ({ page }) => {
    const response = await page.goto("/product/old-product");
    expect(response?.status()).toBe(404);
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
