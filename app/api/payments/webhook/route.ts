import Stripe from "stripe";

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

    // TODO: Update database to mark purchase as complete
    // await db.orders.create({
    //   buyerId: userId,
    //   listingId: listingId,
    //   totalCents: session.amount_total,
    //   currency: "USD",
    //   status: "PAID",
    //   provider: "STRIPE",
    //   providerRef: session.payment_intent,
    // });

    console.log(`Payment successful for listing ${listingId}`);
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;
    console.log(`Refund processed: ${charge.id}`);
    // TODO: Handle refund logic
  }

  return Response.json({ received: true });
}
