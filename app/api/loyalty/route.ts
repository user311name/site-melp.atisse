import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { isAdminPassword } from "@/lib/site-content";
import { loyaltyStatus, readMembers, writeMembers } from "@/lib/loyalty";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get("code")?.trim().toUpperCase();
  if (!code || !/^[A-F0-9-]{16,36}$/.test(code)) return NextResponse.json({ error: "Code de carte invalide." }, { status: 400 });
  const member = (await readMembers()).find(entry => entry.code === code);
  if (!member) return NextResponse.json({ error: "Cette carte n’a pas été trouvée." }, { status: 404 });
  return NextResponse.json(loyaltyStatus(member), { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (!isAdminPassword(request.headers.get("x-melp-admin-password"))) return NextResponse.json({ error: "Accès administrateur refusé." }, { status: 401 });
  const body = await request.json().catch(() => null) as { action?: string; code?: string; name?: string; email?: string } | null;
  if (!body) return NextResponse.json({ error: "Demande invalide." }, { status: 400 });
  const members = await readMembers();

  if (body.action === "create") {
    if (!body.name?.trim()) return NextResponse.json({ error: "Le nom de la cliente est obligatoire." }, { status: 400 });
    const member = { code: randomUUID().replaceAll("-", "").slice(0, 16).toUpperCase(), name: body.name.trim().slice(0, 100), email: (body.email ?? "").trim().slice(0, 200), completedOrders: 0, redeemedRewards: 0 };
    members.push(member); await writeMembers(members);
    return NextResponse.json({ member, status: loyaltyStatus(member) });
  }

  const member = members.find(entry => entry.code === body.code?.trim().toUpperCase());
  if (!member) return NextResponse.json({ error: "Carte introuvable." }, { status: 404 });
  if (body.action === "stamp") member.completedOrders += 1;
  else if (body.action === "redeem" && loyaltyStatus(member).rewardsAvailable > 0) member.redeemedRewards += 1;
  else return NextResponse.json({ error: "Action impossible pour cette carte." }, { status: 400 });
  await writeMembers(members);
  return NextResponse.json({ member, status: loyaltyStatus(member) });
}

export async function PATCH(request: Request) {
  if (!isAdminPassword(request.headers.get("x-melp-admin-password"))) return NextResponse.json({ error: "Accès administrateur refusé." }, { status: 401 });
  return NextResponse.json(await readMembers(), { headers: { "Cache-Control": "no-store" } });
}
