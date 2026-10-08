import { NextResponse } from "next/server";
import { isAdminPassword } from "@/lib/site-content";
import { createInquiry, getInquiry, inquiryStorageReady, listInquiries, markInquiryDecisionEmailSent, updateInquiry } from "@/lib/inquiries";
import { orderEmailDeliveryReady, sendInquiryDecisionEmail } from "@/lib/order-email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const clean = (value: unknown, limit: number) => typeof value === "string" ? value.trim().slice(0, limit) : "";
const validDate = (value: string) => {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
};
const validEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export async function GET(request: Request) {
  if (!isAdminPassword(request.headers.get("x-melp-admin-password"))) return NextResponse.json({ error: "Accès administrateur refusé." }, { status: 401 });
  if (!inquiryStorageReady()) return NextResponse.json({ error: "Le registre durable des demandes n’est pas configuré en production." }, { status: 503 });
  try { return NextResponse.json(await listInquiries(), { headers: { "Cache-Control": "no-store" } }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Lecture des demandes impossible." }, { status: 503 }); }
}

export async function POST(request: Request) {
  if (!inquiryStorageReady()) return NextResponse.json({ error: "Les demandes ne peuvent pas être enregistrées : le registre durable du site n’est pas configuré." }, { status: 503 });
  const origin = request.headers.get("origin");
  if (origin) {
    try { if (new URL(origin).host !== new URL(request.url).host) return NextResponse.json({ error: "Origine de la demande invalide." }, { status: 403 }); }
    catch { return NextResponse.json({ error: "Origine de la demande invalide." }, { status: 403 }); }
  }
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Le formulaire n’est pas valide." }, { status: 400 });
  if (typeof body.website === "string" && body.website.trim()) return NextResponse.json({ submitted: true, message: "Merci, votre demande a bien été transmise à Mélissa." }, { status: 201 });

  const kind = body.kind === "atelier" ? "atelier" : body.kind === "contact" ? "contact" : null;
  const name = clean(body.name, 120);
  const email = clean(body.email, 200).toLowerCase();
  const phone = clean(body.phone, 50);
  const requestLabel = clean(body.request, 120);
  const requestedDate = clean(body.requestedDate, 10);
  const participants = clean(body.participants, 120);
  const occasion = clean(body.occasion, 100);
  const location = clean(body.location, 240);
  const details = clean(body.details, 3000);
  if (!kind || !name || !validEmail(email) || !requestLabel || !requestedDate || !validDate(requestedDate) || !details || kind === "contact" && (!participants || !/^[1-9]\d{0,3}$/.test(participants)) || kind === "atelier" && (!participants || !location)) {
    return NextResponse.json({ error: "Complète les champs obligatoires avec des informations valides." }, { status: 400 });
  }
  try {
    await createInquiry({ kind, name, email, phone, request: requestLabel, requestedDate, participants, occasion, location, details });
    return NextResponse.json({ submitted: true, message: "Merci, votre demande a bien été transmise à Mélissa." }, { status: 201 });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Votre demande n’a pas pu être enregistrée." }, { status: 503 }); }
}

export async function PATCH(request: Request) {
  if (!isAdminPassword(request.headers.get("x-melp-admin-password"))) return NextResponse.json({ error: "Accès administrateur refusé." }, { status: 401 });
  if (!inquiryStorageReady()) return NextResponse.json({ error: "Le registre durable des demandes n’est pas configuré en production." }, { status: 503 });
  const body = await request.json().catch(() => null) as { id?: string; status?: "accepted" | "declined" } | null;
  if (!body?.id || !body.status || !["accepted", "declined"].includes(body.status)) return NextResponse.json({ error: "Réponse invalide." }, { status: 400 });
  if (!orderEmailDeliveryReady()) return NextResponse.json({ error: "Configure l’envoi d’e-mails avant de répondre à une demande." }, { status: 503 });
  try {
    const existing = await getInquiry(body.id);
    if (!existing) return NextResponse.json({ error: "Demande introuvable." }, { status: 404 });
    if (existing.status === body.status && existing.decisionEmailSentAt) return NextResponse.json(existing);
    const inquiry = existing.status === body.status ? existing : await updateInquiry(body.id, body.status);
    if (!inquiry) return NextResponse.json({ error: "Demande introuvable." }, { status: 404 });
    try {
      const emailId = await sendInquiryDecisionEmail(inquiry, body.status);
      const updated = await markInquiryDecisionEmailSent(inquiry.id, body.status, emailId);
      if (!updated) return NextResponse.json({ error: "L’e-mail est parti, mais la demande n’a pas pu être actualisée. Actualise la page avant de réessayer." }, { status: 503 });
      return NextResponse.json(updated);
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : "L’e-mail n’a pas pu être envoyé.", inquiry }, { status: 502 });
    }
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Mise à jour impossible." }, { status: 409 }); }
}
