import Stripe from "stripe";
import { query } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(request: Request) {
  const sig = request.headers.get("stripe-signature");
  const body = await request.text();

  if (!sig || !webhookSecret) {
    return Response.json(
      { message: "Missing signature or webhook secret" },
      { status: 400 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    return Response.json(
      { message: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle checkout.session.completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const listingId = session.metadata?.listingId;
    const userId = session.metadata?.userId;
    const amountTotal = session.amount_total || 0;

    try {
      await query(
        `INSERT INTO orders (buyer_id, listing_id, amount_cents, currency, status, provider, provider_reference, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [userId, listingId, amountTotal, "USD", "completed", "stripe", session.payment_intent]
      );
      console.log(`✓ Payment recorded for listing ${listingId}`);
    } catch (error) {
      console.error("Failed to save order:", error);
    }
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;
    console.log(`Refund processed: ${charge.id}`);
  }

  return Response.json({ received: true });
}
