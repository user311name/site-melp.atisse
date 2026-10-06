import { NextResponse } from "next/server";
import { isAdminPassword, readSiteContent, writeSiteContent, type SiteContent } from "@/lib/site-content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await readSiteContent(), { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: Request) {
  if (!isAdminPassword(request.headers.get("x-melp-admin-password"))) {
    return NextResponse.json({ error: "Accès administrateur refusé." }, { status: 401 });
  }

  try {
    const content = await request.json() as SiteContent;
    if (!content?.epicerie || !Array.isArray(content.epicerie.products) || content.epicerie.products.length > 100 || !content.patisserie || !Array.isArray(content.patisserie.products) || content.patisserie.products.length > 100 || !content.schedule || !Array.isArray(content.schedule.closedDates)) {
      return NextResponse.json({ error: "Le contenu envoyé n’est pas valide." }, { status: 400 });
    }
    if (content.schedule.maxOrdersPerDay !== null && (!Number.isInteger(content.schedule.maxOrdersPerDay) || content.schedule.maxOrdersPerDay < 1 || content.schedule.maxOrdersPerDay > 100) || content.schedule.closedDates.some(date => typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date))) return NextResponse.json({ error: "Les réglages de calendrier sont invalides." }, { status: 400 });
    const textFields = [content.epicerie.eyebrow, content.epicerie.title, content.epicerie.emphasis, content.epicerie.intro, content.epicerie.heroImage, content.epicerie.heroImageAlt, content.epicerie.selectionEyebrow, content.epicerie.selectionTitle, content.epicerie.selectionEmphasis, content.epicerie.selectionIntro, content.epicerie.note];
    if (textFields.some(value => typeof value !== "string" || value.length > 2000)) {
      return NextResponse.json({ error: "Un des champs dépasse la longueur autorisée." }, { status: 400 });
    }
    for (const product of content.epicerie.products) {
      if (![product.id, product.name, product.description, product.composition, product.allergens, product.format, product.price, product.image, product.imageAlt].every(value => typeof value === "string" && value.length <= 2000)) {
        return NextResponse.json({ error: "Une fiche produit contient un champ invalide." }, { status: 400 });
      }
      if (!product.image.startsWith("/images/") && !product.image.startsWith("/uploads/")) {
        return NextResponse.json({ error: "Les images doivent être ajoutées au site depuis l’administration." }, { status: 400 });
      }
    }
    for (const product of content.patisserie.products) {
      if (![product.category, product.name, product.eyebrow, product.description, product.image, product.price, product.conservation, product.weight].every(value => typeof value === "string" && value.length <= 2000) || ![product.ingredients, product.allergens, product.notes].every(values => Array.isArray(values) && values.every(value => typeof value === "string" && value.length <= 500))) {
        return NextResponse.json({ error: "Une fiche pâtisserie contient un champ invalide." }, { status: 400 });
      }
      if (!Number.isInteger(product.id) || (!product.image.startsWith("/images/") && !product.image.startsWith("/uploads/"))) {
        return NextResponse.json({ error: "La fiche contient un identifiant ou une photo invalide." }, { status: 400 });
      }
    }
    await writeSiteContent(content);
    return NextResponse.json({ saved: true });
  } catch {
    return NextResponse.json({ error: "Impossible d’enregistrer le contenu." }, { status: 400 });
  }
}
