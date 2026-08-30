import { test, expect } from "@playwright/test";

/**
 * Covers the storefront-correctness rules established across the
 * pre-launch refinement passes: no default size selection, cart
 * persistence, quick-view, coming-soon products, and grid structure.
 * Uses CAISN ECHO ZIP HOODIE (the one product with a confirmed price)
 * for any flow that needs an addable item.
 */

test.describe("size selection", () => {
  test("no size is pre-selected on load", async ({ page }) => {
    await page.goto("/product/echo-zip-hoodie");
    // Size buttons are the aria-pressed buttons whose visible text is a
    // size code — the color swatch is also aria-pressed (by design, a
    // color still defaults) but carries no text.
    const sizePressed = await page
      .locator('button[aria-pressed="true"]')
      .filter({ hasText: /^(XS|S|M|L|XL)$/ })
      .count();
    expect(sizePressed).toBe(0);
  });

  test("adding without a size shows a validation message, not a silent add", async ({ page }) => {
    await page.goto("/product/echo-zip-hoodie");
    await expect(page.locator("#size-required-error")).toBeHidden();
    await page.locator("#primary-add-to-cart button").click();
    await expect(page.locator("#size-required-error")).toBeVisible();
    await expect(page.getByRole("dialog", { name: /cart/i })).toBeHidden();
  });

  test("selecting a size enables adding to cart", async ({ page }) => {
    await page.goto("/product/echo-zip-hoodie");
    await page.getByRole("button", { name: "L", exact: true }).click();
    await page.locator("#primary-add-to-cart button").click();
    await expect(page.locator('[role="dialog"][aria-labelledby="cart-drawer-heading"]')).toBeVisible();
    await expect(page.locator("#cart-drawer-heading")).toContainText("CART (1)");
  });
});

test.describe("cart", () => {
  test("persists across a full page reload", async ({ page }) => {
    await page.goto("/product/echo-zip-hoodie");
    await page.getByRole("button", { name: "M", exact: true }).click();
    await page.locator("#primary-add-to-cart button").click();
    await expect(page.locator('[role="dialog"][aria-labelledby="cart-drawer-heading"]')).toBeVisible();

    await page.reload();
    await page.getByRole("button", { name: /Open cart/ }).click();
    const drawer = page.locator('[role="dialog"][aria-labelledby="cart-drawer-heading"]');
    await expect(page.locator("#cart-drawer-heading")).toContainText("CART (1)");
    await expect(drawer.getByText("CAISN ECHO ZIP HOODIE")).toBeVisible();
  });

  test("quantity controls and remove work", async ({ page }) => {
    await page.goto("/product/echo-zip-hoodie");
    await page.getByRole("button", { name: "S", exact: true }).click();
    await page.locator("#primary-add-to-cart button").click();
    const drawer = page.locator('[role="dialog"][aria-labelledby="cart-drawer-heading"]');
    await expect(drawer).toBeVisible();

    // The drawer heading counts distinct lines, not total quantity (the
    // Navbar badge does that) — so bumping quantity on the one line
    // correctly leaves "CART (1)" and instead updates the per-line count.
    const qtyDisplay = drawer.locator(".tnum.min-w-\\[1\\.5rem\\]");
    await expect(qtyDisplay).toHaveText("1");
    await drawer.getByRole("button", { name: /Increase quantity/ }).click();
    await expect(qtyDisplay).toHaveText("2");
    await expect(page.locator("#cart-drawer-heading")).toContainText("CART (1)");

    await drawer.getByText("REMOVE").click();
    await expect(drawer.getByText("Your cart is empty.")).toBeVisible();
  });

  test("drawer closes on Escape and returns focus", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Open cart/ }).click();
    await expect(page.locator('[role="dialog"][aria-labelledby="cart-drawer-heading"]')).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator('[role="dialog"][aria-labelledby="cart-drawer-heading"]')).toBeHidden();
  });
});

test.describe("front/back gallery", () => {
  test("clicking the back thumbnail switches the hero image", async ({ page }) => {
    await page.goto("/product/echo-zip-hoodie");
    // The hero carries real alt text; thumbnails are aria-hidden with an
    // empty alt, so this excludes them rather than matching by DOM order
    // (which changed once thumbnails moved to a side rail).
    const hero = page.locator('main img:not([aria-hidden="true"])').first();
    const frontSrc = await hero.getAttribute("src");
    await page.getByRole("button", { name: /back/i }).click();
    await expect(hero).not.toHaveAttribute("src", frontSrc ?? "");
  });
});

test.describe("quick-view", () => {
  test("opens and closes on Escape, returning focus to the trigger", async ({ page }) => {
    await page.goto("/#collection");
    const card = page.getByRole("button", { name: "View CAISN ECHO ZIP HOODIE" });
    await card.click();
    await expect(page.locator('[role="dialog"][aria-labelledby="bento-overlay-heading"]')).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator('[role="dialog"][aria-labelledby="bento-overlay-heading"]')).toBeHidden();
  });
});

test.describe("coming-soon products", () => {
  test("FORMA JOGGER shows Coming Soon, not a fabricated price", async ({ page }) => {
    await page.goto("/product/forma-jogger");
    await expect(page.getByText("COMING SOON").first()).toBeVisible();
    await expect(page.getByText(/PRICE PENDING|DATA PENDING|PROTOTYPE/i)).toHaveCount(0);
    await expect(page.locator("#primary-add-to-cart button")).toBeDisabled();
  });

  test("the FORMA SET card links each garment to its own product page", async ({ page }) => {
    await page.goto("/#collection");
    const hrefs = await page.locator('a[href^="/product/forma-"]').evaluateAll((els) =>
      els.map((el) => el.getAttribute("href"))
    );
    expect(hrefs).toContain("/product/forma-jogger");
    expect(hrefs).toContain("/product/forma-zip-up");
  });
});

test.describe("grid structure", () => {
  test("shop page renders one card per product with no orphan layout", async ({ page }) => {
    await page.goto("/shop");
    const cards = page.locator("main a.group");
    await expect(cards).toHaveCount(3);
    // Product names render through displayName(), which swaps a
    // non-breaking hyphen (U+2011) for a literal "-" so "ZIP-UP" never
    // breaks mid-word — match loosely on the hyphen so this doesn't
    // depend on that internal detail.
    for (const name of [/CAISN ECHO ZIP HOODIE/, /CAISN FORMA JOGGER/, /CAISN FORMA ZIP.UP/]) {
      await expect(page.getByText(name)).toBeVisible();
    }
  });

  test("no horizontal overflow at key breakpoints", async ({ page }) => {
    for (const width of [390, 768, 1366, 1440, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("/");
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth, `overflow at ${width}px`).toBeLessThanOrEqual(clientWidth);
    }
  });
});

test.describe("responsive navigation", () => {
  test("primary nav links are present and functional on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.getByRole("link", { name: "SHOP" }).click();
    await expect(page).toHaveURL(/\/shop$/);
  });

  test("no disabled SEARCH control remains", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("SEARCH")).toHaveCount(0);
  });
});

test.describe("no customer-facing placeholder terms", () => {
  test("banned strings do not appear anywhere on the storefront", async ({ page }) => {
    const routes = ["/", "/shop", "/product/echo-zip-hoodie", "/product/forma-jogger", "/product/forma-zip-up"];
    const banned = [/PRICE PENDING/i, /DATA PENDING/i, /PROTOTYPE/i, /composition pending/i];
    for (const route of routes) {
      await page.goto(route);
      const body = await page.locator("body").innerText();
      for (const pattern of banned) {
        expect(body, `${pattern} found on ${route}`).not.toMatch(pattern);
      }
    }
  });
});
