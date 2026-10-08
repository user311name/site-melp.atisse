import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { isAdminPassword } from "@/lib/site-content";
import { createOrReuseOrderCheckout, orderStorageReady } from "@/lib/orders";
import { getSiteUrl, getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isAdminPassword(request.headers.get("x-melp-admin-password"))) return NextResponse.json({ error: "Accès administrateur refusé." }, { status: 401 });
  if (!orderStorageReady()) return NextResponse.json({ error: "La base durable des commandes n’est pas configurée sur Vercel. Aucun paiement ne peut être demandé en sécurité." }, { status: 503 });
  const body = await request.json().catch(() => null) as { orderId?: unknown; amount?: unknown } | null;
  if (!body || typeof body.orderId !== "string" || typeof body.amount !== "number" || !Number.isFinite(body.amount)) return NextResponse.json({ error: "Indique une commande et un montant valides." }, { status: 400 });
  const amount = Math.round(body.amount * 100);
  if (amount < 50 || amount > 99_999_999) return NextResponse.json({ error: "Le montant doit être compris entre 0,50 € et 999 999,99 €." }, { status: 400 });

  try {
    const stripe = getStripe();
    const baseUrl = getSiteUrl(request);
    const result = await createOrReuseOrderCheckout(body.orderId, amount, async order => {
      if (order.stripeCheckoutSessionId) {
        const previous = await stripe.checkout.sessions.retrieve(order.stripeCheckoutSessionId);
        if (previous.payment_status === "paid") throw new Error("Un paiement est déjà effectué ou en cours de synchronisation.");
        if (previous.status === "open" && order.amount === amount && previous.url) return { sessionId: previous.id, checkoutUrl: previous.url, reused: true };
        if (previous.status === "open") await stripe.checkout.sessions.expire(previous.id);
      }
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        allowed_payment_method_types: ["card"],
        customer_email: order.email,
        client_reference_id: order.id,
        metadata: { orderId: order.id },
        payment_intent_data: { metadata: { orderId: order.id } },
        line_items: [{
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: amount,
            product_data: {
              name: "Commande Melp.atisse",
              description: [order.products, order.date ? `Retrait souhaité le ${order.date}${order.time ? ` à ${order.time}` : ""}` : "Commande confirmée par Mélissa"].filter(Boolean).join(" · ").slice(0, 500),
            },
          },
        }],
        success_url: `${baseUrl}/paiement/retour?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/commander?paiement=annule&reference=${encodeURIComponent(order.id.slice(0, 8).toUpperCase())}`,
        expires_at: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      }, { idempotencyKey: `melp-order-${order.id}-${amount}-${randomUUID()}` });
      if (!session.url) throw new Error("Stripe n’a pas renvoyé de lien de paiement.");
      return { sessionId: session.id, checkoutUrl: session.url };
    });
    return NextResponse.json({ checkoutUrl: result.order.stripeCheckoutUrl, reused: result.reused });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Impossible de créer le paiement." }, { status: 503 });
  }
}
