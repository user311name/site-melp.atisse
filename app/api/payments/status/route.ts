import { NextResponse } from "next/server";
import { markOrderPaid, orderStorageReady } from "@/lib/orders";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!orderStorageReady()) return NextResponse.json({ error: "Le suivi du paiement n’est pas configuré." }, { status: 503 });
  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId || !sessionId.startsWith("cs_")) return NextResponse.json({ error: "Session de paiement invalide." }, { status: 400 });
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    const orderId = session.metadata?.orderId;
    if (!orderId) return NextResponse.json({ error: "Commande associée introuvable." }, { status: 404 });
    if (session.payment_status === "paid" && typeof session.amount_total === "number") await markOrderPaid(orderId, session.id, session.amount_total);
    return NextResponse.json({ paymentStatus: session.payment_status, sessionStatus: session.status }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Impossible de vérifier le paiement." }, { status: 503 });
  }
}
