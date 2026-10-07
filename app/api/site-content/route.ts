import { NextResponse } from "next/server";
import { isAdminPassword, isAllowedContentImage, readSiteContent, writeSiteContent, type SiteContent } from "@/lib/site-content";
import { siteImageIds } from "@/lib/site-media";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try { return NextResponse.json(await readSiteContent(), { headers: { "Cache-Control": "no-store" } }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Lecture du contenu indisponible." }, { status: 503 }); }
}

export async function PUT(request: Request) {
  if (!isAdminPassword(request.headers.get("x-melp-admin-password"))) {
    return NextResponse.json({ error: "Accès administrateur refusé." }, { status: 401 });
  }

  try {
    const content = await request.json() as SiteContent;
    if (!content?.pages || Object.keys(content.pages).length > 20 || Object.values(content.pages).some(page => !page || typeof page !== "object" || !Array.isArray(page.sections) || page.sections.length > 30) || !content?.epicerie || !Array.isArray(content.epicerie.products) || content.epicerie.products.length > 100 || !content.patisserie || !Array.isArray(content.patisserie.products) || content.patisserie.products.length > 100 || !content.schedule || !Array.isArray(content.schedule.closedDates) || !content.siteMedia || typeof content.siteMedia !== "object" || Array.isArray(content.siteMedia) || Object.keys(content.siteMedia).length > siteImageIds.size) {
      return NextResponse.json({ error: "Le contenu envoyé n’est pas valide." }, { status: 400 });
    }
    for (const [source, image] of Object.entries(content.siteMedia)) {
      if (!siteImageIds.has(source) || typeof image !== "string" || image.length > 2000 || image && !isAllowedContentImage(image)) {
        return NextResponse.json({ error: "La bibliothèque contient une image invalide." }, { status: 400 });
      }
    }
    const isAllowedLink = (url: string) => !url || url.startsWith("https://") || url.startsWith("mailto:") || url.startsWith("#") || (url.startsWith("/") && !url.startsWith("//"));
    for (const page of Object.values(content.pages)) {
      if (![page.label, page.eyebrow, page.title, page.emphasis, page.intro, page.image, page.imageAlt, page.ctaLabel, page.ctaUrl].every(value => typeof value === "string" && value.length <= 2000) || (page.image && !isAllowedContentImage(page.image)) || !isAllowedLink(page.ctaUrl)) return NextResponse.json({ error: "Une rubrique contient un champ, un lien ou une photo invalide." }, { status: 400 });
      for (const section of page.sections) {
        if (![section.id, section.title, section.body, section.image, section.imageAlt, section.linkText, section.linkUrl].every(value => typeof value === "string" && value.length <= 2000) || (section.image && !isAllowedContentImage(section.image)) || !isAllowedLink(section.linkUrl)) return NextResponse.json({ error: "Une section contient un champ, un lien ou une photo invalide." }, { status: 400 });
      }
    }
    if (content.schedule.maxOrdersPerDay !== null && (!Number.isInteger(content.schedule.maxOrdersPerDay) || content.schedule.maxOrdersPerDay < 1 || content.schedule.maxOrdersPerDay > 100) || content.schedule.closedDates.some(date => typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date))) return NextResponse.json({ error: "Les réglages de calendrier sont invalides." }, { status: 400 });
    const textFields = [content.epicerie.eyebrow, content.epicerie.title, content.epicerie.emphasis, content.epicerie.intro, content.epicerie.heroImage, content.epicerie.heroImageAlt, content.epicerie.selectionEyebrow, content.epicerie.selectionTitle, content.epicerie.selectionEmphasis, content.epicerie.selectionIntro, content.epicerie.note];
    if (textFields.some(value => typeof value !== "string" || value.length > 2000)) {
      return NextResponse.json({ error: "Un des champs dépasse la longueur autorisée." }, { status: 400 });
    }
    for (const product of content.epicerie.products) {
      if (![product.id, product.name, product.description, product.composition, product.allergens, product.format, product.price, product.availability ?? "", product.image, product.imageAlt].every(value => typeof value === "string" && value.length <= 2000)) {
        return NextResponse.json({ error: "Une fiche produit contient un champ invalide." }, { status: 400 });
      }
      if (!isAllowedContentImage(product.image)) {
        return NextResponse.json({ error: "Les images doivent être ajoutées au site depuis l’administration." }, { status: 400 });
      }
    }
    for (const product of content.patisserie.products) {
      if (![product.category, product.name, product.eyebrow, product.description, product.image, product.price, product.conservation, product.weight].every(value => typeof value === "string" && value.length <= 2000) || ![product.ingredients, product.allergens, product.notes].every(values => Array.isArray(values) && values.every(value => typeof value === "string" && value.length <= 500))) {
        return NextResponse.json({ error: "Une fiche pâtisserie contient un champ invalide." }, { status: 400 });
      }
      if (!Number.isInteger(product.id) || product.image && !isAllowedContentImage(product.image)) {
        return NextResponse.json({ error: "La fiche contient un identifiant ou une photo invalide." }, { status: 400 });
      }
    }
    await writeSiteContent(content);
    return NextResponse.json({ saved: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Impossible d’enregistrer le contenu." }, { status: 503 });
  }
}
