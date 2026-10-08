import { NextResponse } from "next/server";
import { isAdminPassword } from "@/lib/site-content";
import { getOrder, markOrderDecisionEmailSent, orderStorageReady, updateOrder, type PickupOrder } from "@/lib/orders";
import { isValidOrderEmail, orderEmailDeliveryReady, sendOrderDecisionEmail } from "@/lib/order-email";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isAdminPassword(request.headers.get("x-melp-admin-password"))) return NextResponse.json({ error: "Accès administrateur refusé." }, { status: 401 });
  if (!orderStorageReady()) return NextResponse.json({ error: "La base durable des commandes n’est pas configurée sur Vercel." }, { status: 503 });
  const body = await request.json().catch(() => null) as { id?: string; status?: PickupOrder["status"] } | null;
  if (!body?.id || !body.status || !["awaiting_confirmation", "confirmed", "completed", "cancelled"].includes(body.status)) return NextResponse.json({ error: "Mise à jour invalide." }, { status: 400 });
  const decision = body.status === "confirmed" || body.status === "cancelled" ? body.status : null;
  if (decision && !orderEmailDeliveryReady()) return NextResponse.json({ error: "Configure l’envoi automatique (RESEND_API_KEY et MELP_EMAIL_FROM) avant de répondre à une demande." }, { status: 503 });
  try {
    const existing = await getOrder(body.id);
    if (!existing) return NextResponse.json({ error: "Commande introuvable." }, { status: 404 });
    if (decision && existing.status !== decision && !isValidOrderEmail(existing.email)) return NextResponse.json({ error: "La commande n’a pas d’adresse e-mail client valide. Corrige-la avant de répondre." }, { status: 400 });
    let order = decision && existing.status === decision ? existing : await updateOrder(body.id, body.status);
    if (!order) return NextResponse.json({ error: "Commande introuvable." }, { status: 404 });
    if (!decision || decision === "confirmed" && order.confirmationEmailSentAt || decision === "cancelled" && order.refusalEmailSentAt) return NextResponse.json(order);
    try {
      const emailId = await sendOrderDecisionEmail(order, decision);
      order = await markOrderDecisionEmailSent(order.id, decision, emailId);
      if (!order) return NextResponse.json({ error: "L’e-mail est parti, mais la commande n’a pas pu être actualisée. Actualise la page avant de réessayer." }, { status: 503 });
      return NextResponse.json(order);
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : "L’e-mail n’a pas pu être envoyé.", order }, { status: 502 });
    }
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Mise à jour impossible." }, { status: 409 }); }
}
