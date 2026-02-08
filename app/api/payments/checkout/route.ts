import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(request: Request) {
  const body = await request.json();
  const { listingId, listingTitle, priceCents, userId } = body;

  if (!listingId || !priceCents || !userId) {
    return Response.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: listingTitle || "Content Pack",
              description: "Creator content subscription",
            },
            unit_amount: priceCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_API_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_API_URL}/listing/${listingId}`,
      metadata: {
        listingId,
        userId,
      },
    });

    return Response.json({ url: session.url, sessionId: session.id });
  } catch (error: any) {
    return Response.json(
      { message: error.message || "Checkout creation failed" },
      { status: 500 }
    );
  }
}
