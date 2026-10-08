import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { markOrderPaid, orderStorageReady } from "@/lib/orders";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) return NextResponse.json({ error: "Le webhook Stripe n’est pas configuré." }, { status: 503 });
  if (!orderStorageReady()) return NextResponse.json({ error: "La base durable des commandes n’est pas configurée." }, { status: 503 });
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Signature Stripe manquante." }, { status: 400 });
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(await request.text(), signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Signature Stripe invalide." }, { status: 400 });
  }
  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (session.payment_status === "paid" && orderId && typeof session.amount_total === "number") {
      const saved = await markOrderPaid(orderId, session.id, session.amount_total);
      if (!saved) return NextResponse.json({ error: "Commande non trouvée ou montant/session différents." }, { status: 409 });
    }
  }
  return NextResponse.json({ received: true });
}
