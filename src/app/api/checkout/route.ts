import { getProductBySlug } from "@/lib/commerce/data";
import { getStripe } from "@/lib/stripe";

type RequestedLine = {
  slug?: unknown;
  color?: unknown;
  size?: unknown;
  quantity?: unknown;
};

const MAX_LINE_QUANTITY = 10;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { lines?: unknown };
    if (!Array.isArray(body.lines) || body.lines.length === 0 || body.lines.length > 20) {
      return Response.json({ error: "Your cart is empty or invalid." }, { status: 400 });
    }

    const requestedLines = body.lines as RequestedLine[];
    const lineItems = await Promise.all(
      requestedLines.map(async (line) => {
        if (
          typeof line.slug !== "string" ||
          typeof line.color !== "string" ||
          typeof line.size !== "string" ||
          !Number.isInteger(line.quantity) ||
          (line.quantity as number) < 1 ||
          (line.quantity as number) > MAX_LINE_QUANTITY
        ) {
          throw new Error("INVALID_CART");
        }

        const product = await getProductBySlug(line.slug);
        const variant = product?.variants.find((item) => item.color === line.color && item.size === line.size);
        if (!product || !variant || product.price === null || product.comingSoon) {
          throw new Error("UNAVAILABLE_PRODUCT");
        }

        return {
          quantity: line.quantity as number,
          price_data: {
            currency: "eur",
            unit_amount: Math.round(product.price * 100),
            product_data: {
              name: product.name,
              description: `${variant.color} / ${variant.size}`,
              metadata: {
                product_id: product.id,
                product_slug: product.slug,
                color: variant.color,
                size: variant.size,
              },
            },
          },
        };
      })
    );

    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      billing_address_collection: "required",
      shipping_address_collection: { allowed_countries: ["NL", "BE", "DE"] },
      phone_number_collection: { enabled: true },
      allow_promotion_codes: true,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancelled`,
    });

    if (!session.url) throw new Error("CHECKOUT_URL_MISSING");
    return Response.json({ url: session.url });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return Response.json({ error: "Invalid checkout request." }, { status: 400 });
    }
    if (error instanceof Error && ["INVALID_CART", "UNAVAILABLE_PRODUCT"].includes(error.message)) {
      return Response.json({ error: "One or more cart items are unavailable." }, { status: 400 });
    }

    console.error("Unable to create Stripe Checkout Session", error);
    return Response.json({ error: "Checkout is temporarily unavailable. Please try again." }, { status: 503 });
  }
}
