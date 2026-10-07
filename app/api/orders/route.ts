import { NextResponse } from "next/server";
import { isAdminPassword, readSiteContent } from "@/lib/site-content";
import { createHold, listOrders, releaseHold, submitOrder } from "@/lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isAdminPassword(request.headers.get("x-melp-admin-password"))) return NextResponse.json({ error: "Accès administrateur refusé." }, { status: 401 });
  return NextResponse.json(await listOrders(), { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Demande invalide." }, { status: 400 });
  try {
    if (body.action === "availability" && typeof body.date === "string") {
      const orders = await listOrders();
      const schedule = (await readSiteContent()).schedule;
      const active = orders.filter(order => order.date === body.date && (order.status === "confirmed" || order.status === "awaiting_confirmation" || order.status === "held" && Date.parse(order.holdExpiresAt ?? "") > Date.now()));
      const closed = schedule.closedDates.includes(body.date);
      const full = schedule.maxOrdersPerDay !== null && active.length >= schedule.maxOrdersPerDay;
      return NextResponse.json({ unavailable: closed || full ? ["__ALL__"] : active.map(order => order.time), message: closed ? "Les retraits ne sont pas ouverts à cette date." : full ? "La capacité de production est atteinte à cette date." : "" });
    }
    if (body.action === "hold" && typeof body.date === "string" && typeof body.time === "string") return NextResponse.json(await createHold(body.date, body.time), { status: 201 });
    if (body.action === "release" && typeof body.holdId === "string") { await releaseHold(body.holdId); return NextResponse.json({ released: true }); }
    if (body.action === "submit" && (body.kind === "pickup" || body.kind === "special")) {
      const fullName = [body.firstName, body.lastName].map(value => typeof value === "string" ? value.trim() : "").filter(Boolean).join(" ") || String(body.name ?? "");
      const order = await submitOrder({ holdId: typeof body.holdId === "string" ? body.holdId : undefined, kind: body.kind, specialDate: typeof body.specialDate === "string" ? body.specialDate : "", specialTime: typeof body.specialTime === "string" ? body.specialTime : "", name: fullName, email: String(body.email ?? ""), phone: String(body.phone ?? ""), products: String(body.products ?? ""), notes: String(body.notes ?? "") });
      return NextResponse.json({ id: order.id, status: order.status, message: "Demande transmise. Mélissa doit confirmer la disponibilité avant que la commande soit définitive." }, { status: 201 });
    }
    return NextResponse.json({ error: "Action inconnue." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Opération impossible." }, { status: 409 });
  }
}
