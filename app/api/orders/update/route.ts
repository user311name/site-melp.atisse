import { NextResponse } from "next/server";
import { isAdminPassword } from "@/lib/site-content";
import { updateOrder, type PickupOrder } from "@/lib/orders";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isAdminPassword(request.headers.get("x-melp-admin-password"))) return NextResponse.json({ error: "Accès administrateur refusé." }, { status: 401 });
  const body = await request.json().catch(() => null) as { id?: string; status?: PickupOrder["status"] } | null;
  if (!body?.id || !body.status || !["awaiting_confirmation", "confirmed", "completed", "cancelled"].includes(body.status)) return NextResponse.json({ error: "Mise à jour invalide." }, { status: 400 });
  try {
    const order = await updateOrder(body.id, body.status);
    
    return order ? NextResponse.json(order) : NextResponse.json({ error: "Commande introuvable." }, { status: 404 });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Mise à jour impossible." }, { status: 409 }); }
}
