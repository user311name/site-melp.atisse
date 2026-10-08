import { NextResponse } from "next/server";
import { addReview, listReviews, removeReview, type ReviewCategory } from "@/lib/reviews";
import { isAdminPassword } from "@/lib/site-content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const categories: ReviewCategory[] = ["Pâtisserie", "Traiteur", "Atelier", "Autre"];

export async function GET() {
  try {
    return NextResponse.json({ reviews: await listReviews() }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Les avis sont momentanément indisponibles." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Le formulaire n’est pas valide." }, { status: 400 });
  const name = typeof body.name === "string" ? body.name.replace(/[<>\u0000-\u001f]/g, "").trim().slice(0, 50) : "";
  const text = typeof body.text === "string" ? body.text.replace(/[<>\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim().slice(0, 1200) : "";
  const rating = Number(body.rating);
  const category = categories.includes(body.category) ? body.category as ReviewCategory : "Autre";
  if (typeof body.website === "string" && body.website.trim()) return NextResponse.json({ submitted: true, message: "Merci pour votre avis !" }, { status: 201 });
  if (name.length < 2 || text.length < 10 || !Number.isInteger(rating) || rating < 1 || rating > 5 || body.consent !== true) {
    return NextResponse.json({ error: "Indiquez votre prénom, une note, un avis d’au moins 10 caractères et acceptez sa publication." }, { status: 400 });
  }
  try {
    const review = await addReview({ name, text, rating, category });
    return NextResponse.json({ submitted: true, review, message: "Merci ! Votre avis est maintenant publié sur le site." }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Impossible d’enregistrer votre avis pour le moment." }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  if (!isAdminPassword(request.headers.get("x-melp-admin-password"))) return NextResponse.json({ error: "Accès administrateur refusé." }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id") ?? "";
  try {
    const deleted = await removeReview(id);
    return deleted ? NextResponse.json({ deleted: true }) : NextResponse.json({ error: "Cet avis n’existe pas." }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Impossible de supprimer cet avis." }, { status: 503 });
  }
}
