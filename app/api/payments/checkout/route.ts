import Stripe from "stripe";
import * as jwt from "jsonwebtoken";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const JWT_SECRET = process.env.JWT_SECRET || "";

export async function POST(request: Request) {
  const body = await request.json();
  const { listingId, listingTitle, priceCents } = body;
  const authHeader = request.headers.get("authorization");

  if (!listingId || !priceCents) {
    return Response.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return Response.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  let userId;
  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    userId = decoded.id;
  } catch (error) {
    return Response.json(
      { message: "Invalid token" },
      { status: 401 }
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
      cancel_url: `${process.env.NEXT_PUBLIC_API_URL}/creator`,
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
