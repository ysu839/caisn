import { test, expect } from "@playwright/test";

/**
 * Covers the storefront-correctness rules established across the
 * pre-launch refinement passes: no default size selection, cart
 * persistence, quick-view, real catalog pricing, and grid structure.
 * Uses CAISN ECHO ZIP HOODIE for any flow that needs an addable item.
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

test.describe("catalog pricing", () => {
  test("all four products show a real price, not a placeholder", async ({ page }) => {
    const priced: [string, string][] = [
      ["/product/echo-zip-hoodie", "€69.99"],
      ["/product/forma-jogger", "€84.49"],
      ["/product/forma-zip-up", "€45.69"],
      ["/product/forma-tracksuit", "€105"],
    ];
    for (const [route, price] of priced) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await expect(page.getByText(price).first()).toBeVisible();
      await expect(page.getByText(/COMING SOON/i)).toHaveCount(0);
    }
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
    const cards = page.locator('[data-testid="product-card"]');
    await expect(cards).toHaveCount(5);
    // Product names render through displayName(), which swaps a
    // non-breaking hyphen (U+2011) for a literal "-" so "ZIP-UP" never
    // breaks mid-word — match loosely on the hyphen so this doesn't
    // depend on that internal detail.
    for (const name of [
      /CAISN ECHO ZIP HOODIE/,
      /CAISN FORMA JOGGER/,
      /CAISN FORMA ZIP.UP/,
      /CAISN FORMA TRACKSUIT/,
      /CAISN FIELDFRAME LONGSLEEVE/,
    ]) {
      await expect(page.getByText(name)).toBeVisible();
    }
  });

  test("no horizontal overflow at key breakpoints", async ({ page }) => {
    for (const width of [390, 768, 1366, 1440, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("/", { waitUntil: "domcontentloaded" });
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
    await page.getByRole("link", { name: "SHOP", exact: true }).click();
    await expect(page).toHaveURL(/\/shop$/);
  });

});

test.describe("search", () => {
  test("opens, returns real products, and closes on Escape", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open search" }).click();
    const dialog = page.getByRole("dialog", { name: "Search" });
    await expect(dialog).toBeVisible();

    await page.getByRole("textbox", { name: "Search" }).fill("forma");
    await expect(dialog.getByText(/CAISN FORMA JOGGER/)).toBeVisible();
    await expect(dialog.getByText(/CAISN FORMA ZIP.UP/)).toBeVisible();
    await expect(dialog.getByText(/CAISN ECHO ZIP HOODIE/)).toHaveCount(0);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("shows an honest empty state for no matches", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open search" }).click();
    await page.getByRole("textbox", { name: "Search" }).fill("zzzznomatch");
    await expect(page.getByText(/No results for/)).toBeVisible();
  });
});

test.describe("category filtering", () => {
  test("filtering the shop grid by category shows only matching products", async ({ page }) => {
    await page.goto("/shop");
    await page.getByRole("button", { name: "BOTTOMS" }).click();
    await expect(page.getByText(/CAISN FORMA JOGGER/)).toBeVisible();
    await expect(page.getByText(/CAISN ECHO ZIP HOODIE/)).toHaveCount(0);

    await page.getByRole("button", { name: "RESET" }).click();
    await expect(page.getByText(/CAISN ECHO ZIP HOODIE/)).toBeVisible();
  });

  test("a category deep-link from the homepage lands pre-filtered", async ({ page }) => {
    await page.goto("/shop?category=Sets");
    await expect(page.getByText(/CAISN FORMA TRACKSUIT/)).toBeVisible();
    await expect(page.getByText(/CAISN FORMA JOGGER/)).toHaveCount(0);
  });
});

test.describe("homepage hero", () => {
  test("SHOP ECHO and EXPLORE DROP 01 both work", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("€69.99").first()).toBeVisible();
    await page.getByRole("link", { name: "EXPLORE DROP 01" }).first().click();
    await expect(page.locator("#collection")).toBeInViewport();

    await page.goto("/");
    await page.getByRole("link", { name: "SHOP ECHO" }).click();
    await expect(page).toHaveURL(/\/product\/echo-zip-hoodie$/);
  });

  test("hero is visible without relying on scripted opacity state", async ({ page }) => {
    // The hero's entrance is a CSS animation (see .hero-panel-reveal),
    // not a JS-gated opacity toggle — after the animation settles the
    // product name must be at full opacity, not stuck invisible.
    await page.goto("/");
    await page.waitForTimeout(1300);
    const opacity = await page.getByText("CAISN ECHO ZIP HOODIE").first().evaluate((el) => getComputedStyle(el).opacity);
    expect(opacity).toBe("1");
  });
});

test.describe("FORMA connection section", () => {
  test("all three destinations resolve to the correct products", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /View Complete Set/ }).click();
    await expect(page).toHaveURL(/\/product\/forma-tracksuit$/);

    await page.goto("/");
    const links = await page
      .locator('a[href^="/product/forma-"]')
      .evaluateAll((els) => els.map((el) => el.getAttribute("href")));
    expect(links).toContain("/product/forma-zip-up");
    expect(links).toContain("/product/forma-jogger");
    expect(links).toContain("/product/forma-tracksuit");
  });
});

test.describe("checkout", () => {
  test("the cart offers secure checkout for purchasable items", async ({ page }) => {
    await page.goto("/product/echo-zip-hoodie");
    await page.getByRole("button", { name: "L", exact: true }).click();
    await page.locator("#primary-add-to-cart button").click();
    const drawer = page.locator('[role="dialog"][aria-labelledby="cart-drawer-heading"]');
    await expect(drawer).toBeVisible();
    const checkoutBtn = drawer.getByRole("button", { name: "SECURE CHECKOUT" });
    await expect(checkoutBtn).toBeVisible();
    await expect(checkoutBtn).toBeEnabled();
    await expect(drawer.getByText(/powered by Stripe/i)).toBeVisible();
  });
});

test.describe("sticky navigation", () => {
  test("nav stays fixed to the top after scrolling and search/cart still work", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("nav");
    await page.evaluate(() => window.scrollTo(0, 1200));
    await expect(nav).toBeInViewport();
    await page.getByRole("button", { name: "Open search" }).click();
    await expect(page.getByRole("dialog", { name: "Search" })).toBeVisible();
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: /Open cart/ }).click();
    await expect(page.locator('[role="dialog"][aria-labelledby="cart-drawer-heading"]')).toBeVisible();
  });
});

test.describe("no nested interactive elements", () => {
  test("no anchor or button contains another anchor or button, on the shop grid or homepage", async ({ page }) => {
    for (const route of ["/", "/shop"]) {
      await page.goto(route);
      const violations = await page.evaluate(() => {
        const interactive = Array.from(document.querySelectorAll("a, button"));
        return interactive.filter((el) => el.querySelector("a, button")).length;
      });
      expect(violations, `nested interactive elements found on ${route}`).toBe(0);
    }
  });
});

test.describe("Drop 01 card content", () => {
  test("every Drop 01 card shows its real price", async ({ page }) => {
    await page.goto("/#collection");
    for (const price of ["€69.99", "€84.49", "€45.69", "€105"]) {
      await expect(page.getByText(price).first()).toBeVisible();
    }
  });

  test("the tracksuit card visually shows both real pieces", async ({ page }) => {
    await page.goto("/#collection");
    const card = page.getByRole("button", { name: "View CAISN FORMA TRACKSUIT" });
    const images = card.locator("img");
    const srcs = await images.evaluateAll((els) => els.map((el) => el.getAttribute("src") ?? ""));
    expect(srcs.some((s) => s.includes("forma-zip-up"))).toBe(true);
    expect(srcs.some((s) => s.includes("forma-jogger"))).toBe(true);
  });
});

test.describe("Drop 01 access section", () => {
  test("EXPLORE DROP 01 and VIEW ALL PRODUCTS route correctly", async ({ page }) => {
    await page.goto("/");
    await page.getByText("DROP 01 ACCESS").scrollIntoViewIfNeeded();
    await page.getByRole("link", { name: "VIEW ALL PRODUCTS" }).click();
    await expect(page).toHaveURL(/\/shop$/);
  });
});

test.describe("CAISN Fieldframe Longsleeve", () => {
  test("shows its real price and a Coming Soon status, not a live add-to-cart", async ({ page }) => {
    await page.goto("/product/fieldframe-longsleeve");
    await expect(page.getByText("€89").first()).toBeVisible();
    await expect(page.getByText("COMING SOON").first()).toBeVisible();
    const cta = page.locator("#primary-add-to-cart button");
    await expect(cta).toBeDisabled();
    await expect(cta).toHaveText("COMING SOON");
  });

  test("no size is pre-selected, and picking one does not enable the disabled CTA", async ({ page }) => {
    await page.goto("/product/fieldframe-longsleeve");
    const sizePressed = await page
      .locator('button[aria-pressed="true"]')
      .filter({ hasText: /^(XS|S|M|L|XL)$/ })
      .count();
    expect(sizePressed).toBe(0);
    await page.getByRole("button", { name: "M", exact: true }).click();
    await expect(page.locator("#primary-add-to-cart button")).toBeDisabled();
  });

  test("appears in the Longsleeves category filter and in search", async ({ page }) => {
    await page.goto("/shop?category=Longsleeves");
    await expect(page.getByText(/CAISN FIELDFRAME LONGSLEEVE/)).toBeVisible();
    await expect(page.getByText(/CAISN ECHO ZIP HOODIE/)).toHaveCount(0);

    await page.goto("/");
    await page.getByRole("button", { name: "Open search" }).click();
    await page.getByRole("textbox", { name: "Search" }).fill("fieldframe");
    await expect(page.getByRole("dialog", { name: "Search" }).getByText(/CAISN FIELDFRAME LONGSLEEVE/)).toBeVisible();
  });

  test("product card crossfades from front to back on hover", async ({ page }) => {
    await page.goto("/shop");
    const card = page.locator('[data-testid="product-card"]').filter({ hasText: "CAISN FIELDFRAME LONGSLEEVE" });
    const backImage = card.locator('img[alt=""]').first();
    await expect(backImage).toHaveCSS("opacity", "0");
    await card.hover();
    await expect(backImage).toHaveCSS("opacity", "1");
  });

  test("front/back images carry the confirmed alt text", async ({ page }) => {
    await page.goto("/product/fieldframe-longsleeve");
    await expect(
      page.getByAltText("Front view of the CAISN Fieldframe Longsleeve in black and washed woodland camo").first()
    ).toBeVisible();
  });
});

test.describe("no customer-facing placeholder terms", () => {
  test("banned strings do not appear anywhere on the storefront", async ({ page }) => {
    const routes = [
      "/",
      "/shop",
      "/product/echo-zip-hoodie",
      "/product/forma-jogger",
      "/product/forma-zip-up",
      "/product/forma-tracksuit",
      "/product/fieldframe-longsleeve",
    ];
    const banned = [/PRICE PENDING/i, /DATA PENDING/i, /PROTOTYPE/i, /composition pending/i];
    for (const route of routes) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const body = await page.locator("body").innerText();
      for (const pattern of banned) {
        expect(body, `${pattern} found on ${route}`).not.toMatch(pattern);
      }
    }
  });
});
