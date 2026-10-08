import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { list, put } from "@vercel/blob";
import { pastryCatalog } from "@/lib/pastry-catalog";
import type { PastryProduct } from "@/lib/pastry-catalog";

export type GroceryProduct = {
  id: string;
  name: string;
  description: string;
  composition: string;
  allergens: string;
  format: string;
  price: string;
  availability?: string;
  image: string;
  imageAlt: string;
};

export type EditableSection = { id: string; title: string; body: string; image: string; imageAlt: string; linkText: string; linkUrl: string; category?: string; location?: string; date?: string };
export type EditablePage = { label: string; eyebrow: string; title: string; emphasis: string; intro: string; image: string; imageAlt: string; ctaLabel: string; ctaUrl: string; storyHeading: string; storyHistory: string; storyPractice: string; sections: EditableSection[] };

export type { PastryProduct } from "@/lib/pastry-catalog";

export type SiteContent = {
  siteMedia: Record<string, string>;
  pages: Record<string, EditablePage>;
  patisserie: { products: PastryProduct[] };
  schedule: {
    maxOrdersPerDay: number | null;
    closedDates: string[];
    openDates: string[];
    closedRanges: { start: string; end: string }[];
    closedWeekdays: number[];
    capacityOverrides: { date: string; maxOrders: number }[];
  };
  epicerie: {
    eyebrow: string;
    title: string;
    emphasis: string;
    intro: string;
    heroImage: string;
    heroImageAlt: string;
    selectionEyebrow: string;
    selectionTitle: string;
    selectionEmphasis: string;
    selectionIntro: string;
    note: string;
    products: GroceryProduct[];
  };
};

const emptyPage = (label: string): EditablePage => ({ label, eyebrow: "", title: "", emphasis: "", intro: "", image: "", imageAlt: "", ctaLabel: "", ctaUrl: "", storyHeading: "", storyHistory: "", storyPractice: "", sections: [] });

export const editablePages: Record<string, EditablePage> = {
  accueil: { ...emptyPage("Accueil"), eyebrow: "Pâtissière · Traiteur · Cheffe privée · Atelier", title: "De la gourmandise", emphasis: "à partager,", intro: "Des créations artisanales, de jolis moments autour d’une table et une attention portée à chaque détail.", image: "/images/number-cake-fruits-rouges.png", imageAlt: "Number cake décoré de fruits rouges et de fleurs, création Melp.atisse", ctaLabel: "Découvrir les créations", ctaUrl: "/patisserie", sections: [
    { id: "home-video-links", title: "Les créations en mouvement", body: "Les vidéos de pâtisserie et d’ateliers seront ajoutées ici dès que leurs liens seront disponibles.", image: "", imageAlt: "", linkText: "", linkUrl: "" },
  ] },
  patisserie: { ...emptyPage("Pâtisserie"), eyebrow: "PÂTISSERIE ARTISANALE", title: "La gourmandise", emphasis: "comme signature.", intro: "Des créations imaginées, façonnées et dressées à la main, directement depuis l’atelier MELP.ATISSE.", image: "/images/gateau-framboises-fleurs.png", imageAlt: "Pâtisserie artisanale Melp.atisse", ctaLabel: "Découvrir les créations", ctaUrl: "#creations" },
  epicerie: emptyPage("Épicerie gourmande"), ateliers: { ...emptyPage("Ateliers"), eyebrow: "ATELIERS DE PÂTISSERIE", title: "On met la main", emphasis: "à la pâte ?", intro: "Des ateliers de pâtisserie pour enfants et adultes, chez vous, sur demande et sur devis.", image: "", imageAlt: "", sections: [
    { id: "atelier-prive", title: "Chez vous", body: "Ateliers privés pour enfants et adultes, organisés sur demande et sur devis après validation du lieu et des conditions d’accueil.", image: "", imageAlt: "", linkText: "Demander un devis", linkUrl: "/contact?prestation=Atelier%20privé" },
    { id: "atelier-partenaire", title: "À Savenay avec C’est moi qui l’ai fait", body: "Consulte le site du partenaire pour le thème et les informations pratiques.", image: "", imageAlt: "", linkText: "Programme et réservation", linkUrl: "https://cmqlf.com/categorie/boutique-cest-moi-qui-lai-fait/ateliers-cuisine/", date: "Chaque premier samedi du mois", location: "Savenay" },
  ] },
  "cheffe-privee": { ...emptyPage("Traiteur & cheffe privée"), eyebrow: "TRAITEUR & CHEFFE PRIVÉE", title: "La cuisine", emphasis: "chez vous.", intro: "Une expérience culinaire sur mesure, directement chez vous.", sections: [
    { id: "experience-diner", title: "Dîner privé", body: "Un menu imaginé pour vous, chez vous, autour de vos envies.", image: "/images/traiteur-planche-festive.png", imageAlt: "Dîner privé préparé par Melp.atisse", linkText: "", linkUrl: "" },
    { id: "experience-brunch", title: "Brunch", body: "Une table généreuse et élégante pour partager un moment gourmand.", image: "/images/verrines-radis.png", imageAlt: "Brunch traiteur", linkText: "", linkUrl: "" },
    { id: "experience-reception", title: "Réception", body: "Cocktails, repas et menus sur mesure pour vos événements.", image: "/images/number-cake-fruits-rouges.png", imageAlt: "Réception gourmande", linkText: "", linkUrl: "" },
  ] },
  "cartes-cadeaux": { ...emptyPage("Cartes cadeaux"), eyebrow: "UNE ATTENTION À OFFRIR", title: "Un moment", emphasis: "à savourer.", intro: "Une carte cadeau pour offrir une création pâtissière ou un atelier gourmand à partager.", image: "/images/gateau-fraises.png", imageAlt: "Création pâtissière fleurie à offrir" },
  commander: { ...emptyPage("Commander"), eyebrow: "COMMANDE À EMPORTER", title: "Une douceur", emphasis: "pour bientôt.", intro: "Envoyez votre demande de commande et choisissez un horaire de retrait à La Plaine-sur-Mer. Prévoir au moins quatre jours à l’avance.", image: "/images/number-cake-choux.png", imageAlt: "Number cake aux petits choux réalisé par Melp.atisse" },
  collaborations: { ...emptyPage("Collaborations & points de vente"), eyebrow: "RENCONTRES GOURMANDES", title: "Melp.atisse", emphasis: "près de chez vous.", intro: "Les adresses partenaires et les lieux où retrouver les gourmandises Melp.atisse.", image: "/images/traiteur-planche-festive.png", imageAlt: "Création traiteur Melp.atisse pour une réception", sections: [
    { id: "lieu-garde-manger", title: "Le Garde Manger", body: "Produits proposés : à préciser avec Mélissa.", image: "", imageAlt: "", linkText: "", linkUrl: "", category: "point-de-vente", location: "Saint-Michel-Chef-Chef", date: "" },
    { id: "lieu-epicerie-1909", title: "Épicerie 1909", body: "Sachets d’épicerie gourmande.", image: "", imageAlt: "", linkText: "", linkUrl: "", category: "point-de-vente", location: "La Plaine-sur-Mer", date: "" },
    { id: "lieu-chamaillerie", title: "Chamaillerie et Cie", body: "Sachets de gourmandises.", image: "", imageAlt: "", linkText: "", linkUrl: "", category: "point-de-vente", location: "Sautron", date: "" },
    { id: "collab-les-piafs", title: "Les Piafs", body: "Desserts en collaboration.", image: "", imageAlt: "", linkText: "", linkUrl: "", category: "restaurant", location: "", date: "" },
    { id: "atelier-cmqlf", title: "C’est moi qui l’ai fait", body: "Thème et informations pratiques à consulter auprès du partenaire.", image: "", imageAlt: "", linkText: "Programme et réservation", linkUrl: "https://cmqlf.com/categorie/boutique-cest-moi-qui-lai-fait/ateliers-cuisine/", category: "atelier", location: "Savenay", date: "Chaque premier samedi du mois" },
  ] },
  evenements: { ...emptyPage("Événements"), eyebrow: "ÉVÉNEMENTS", title: "Les grands moments", emphasis: "méritent mieux.", intro: "Des expériences sur mesure pensées autour de votre histoire, avec élégance, précision et gourmandise.", image: "/images/traiteur-planche-festive.png", imageAlt: "Table traiteur Melp.atisse", sections: [
    { id: "evenement-mariage", title: "Mariage", body: "Une réception à votre image, de la première création au dernier détail.", image: "/images/number-cake-fruits-rouges.png", imageAlt: "Création pour un mariage", linkText: "", linkUrl: "" },
    { id: "evenement-anniversaire", title: "Anniversaire", body: "Une création unique et une table pensée pour votre moment.", image: "/images/number-cake-marin.png", imageAlt: "Gâteau d’anniversaire", linkText: "", linkUrl: "" },
    { id: "evenement-entreprise", title: "Entreprise", body: "Cocktails, repas et expériences culinaires professionnelles.", image: "/images/verrines-radis.png", imageAlt: "Cocktail traiteur", linkText: "", linkUrl: "" },
    { id: "evenement-reception", title: "Réception", body: "Une expérience entièrement personnalisée chez vous.", image: "/images/traiteur-planche-festive.png", imageAlt: "Table de réception", linkText: "", linkUrl: "" },
  ] },
  "a-propos": { ...emptyPage("Histoire & savoir-faire"), eyebrow: "MES VALEURS", title: "Ce qui me", emphasis: "guide.", intro: "Des valeurs simples et essentielles, qui donnent du sens à chaque création.", storyHeading: "La pâtisserie, avec intention.", storyHistory: "Mélissa Garnier est pâtissière, cheffe privée et traiteur à La Plaine-sur-Mer. Elle est formée au BTM Pâtissier-Chocolatier-Glacier-Confiseur-Traiteur.", storyPractice: "Avec Melp.atisse, elle imagine des pâtisseries fines sur commande, en travaillant les textures, les saveurs et le soin du décor. Chaque création prend forme au fil des échanges autour de l’occasion et des envies.", image: "/images/carte-photo-1.png", imageAlt: "Création pâtissière Melp.atisse", sections: [
    { id: "valeur-generosite", title: "Générosité", body: "Des créations faites pour être découvertes, dégustées et partagées.", image: "/images/gateau-framboises-fleurs.png", imageAlt: "Pâtisserie aux fruits rouges", linkText: "", linkUrl: "" },
    { id: "valeur-artisanat", title: "Artisanat", body: "Des gestes précis, une attention portée aux détails et des créations façonnées à la main.", image: "/images/number-cake-tropical.png", imageAlt: "Number cake artisanal", linkText: "", linkUrl: "" },
    { id: "valeur-creativite", title: "Créativité", body: "Des recettes libres, élégantes et imaginées autour de chaque projet.", image: "/images/number-cake-chocolat-fleurs.png", imageAlt: "Création pâtissière créative", linkText: "", linkUrl: "" },
    { id: "valeur-sincerite", title: "Sincérité", body: "De bons produits, une cuisine authentique et un travail fait avec passion.", image: "/images/traiteur-planche-festive.png", imageAlt: "Création traiteur", linkText: "", linkUrl: "" },
  ] },
  avis: { ...emptyPage("Avis clients"), eyebrow: "05 / AVIS", title: "Vos mots font", emphasis: "vivre Melp.", intro: "Les retours de celles et ceux qui ont goûté les créations de Mélissa.", image: "/images/carte-photo-1.png", imageAlt: "Création pâtissière Melp.atisse" },
  contact: { ...emptyPage("Contact"), eyebrow: "01 / CONTACT", title: "Une envie,", emphasis: "une table.", intro: "Pâtisserie, gâteau personnalisé, dîner privé ou événement : choisissez simplement ce qui vous ferait plaisir.", image: "/images/traiteur-planche-festive.png", imageAlt: "Création traiteur Melp.atisse", sections: [
    { id: "contact-patisserie", title: "Pâtisserie", body: "Desserts, mignardises & créations sucrées", image: "/images/gateau-framboises-fleurs.png", imageAlt: "Pâtisserie artisanale", linkText: "", linkUrl: "" },
    { id: "contact-gateau", title: "Gâteau personnalisé", body: "Anniversaire, mariage ou occasion spéciale", image: "/images/number-cake-marin.png", imageAlt: "Gâteau personnalisé", linkText: "", linkUrl: "" },
    { id: "contact-table", title: "Table sucrée", body: "Une table complète autour de vos envies", image: "/images/number-cake-fruits-rouges.png", imageAlt: "Table sucrée", linkText: "", linkUrl: "" },
    { id: "contact-diner", title: "Dîner privé", body: "Une expérience culinaire à domicile", image: "/images/carte-photo-2.png", imageAlt: "Dîner privé", linkText: "", linkUrl: "" },
    { id: "contact-evenement", title: "Événement", body: "Mariage, réception, entreprise...", image: "/images/traiteur-planche-festive.png", imageAlt: "Événement traiteur", linkText: "", linkUrl: "" },
    { id: "contact-atelier", title: "Atelier privé", body: "Une séance gourmande adaptée à votre groupe", image: "/images/number-cake-choux.png", imageAlt: "Atelier pâtisserie", linkText: "", linkUrl: "" },
    { id: "contact-epicerie", title: "Épicerie gourmande", body: "Des douceurs à offrir ou à partager", image: "/images/entremets-chocolat-noisettes.png", imageAlt: "Épicerie gourmande", linkText: "", linkUrl: "" },
    { id: "contact-cadeau", title: "Carte cadeau", body: "Offrir une création ou une expérience", image: "/images/gateau-fraises.png", imageAlt: "Carte cadeau", linkText: "", linkUrl: "" },
    { id: "contact-collab", title: "Collaboration professionnelle", body: "Imaginer un partenariat avec Mélissa", image: "/images/traiteur-planche-festive.png", imageAlt: "Collaboration professionnelle", linkText: "", linkUrl: "" },
    { id: "contact-special", title: "Demande particulière", body: "Une date ou un projet à étudier", image: "/images/number-cake-marin.png", imageAlt: "Demande particulière", linkText: "", linkUrl: "" },
  ] },
};

export const defaultContent: SiteContent = {
  siteMedia: {},
  pages: editablePages,
  patisserie: { products: pastryCatalog },
  schedule: { maxOrdersPerDay: null, closedDates: [], openDates: [], closedRanges: [], closedWeekdays: [], capacityOverrides: [] },
  epicerie: {
    eyebrow: "ÉPICERIE GOURMANDE",
    title: "Les petites douceurs",
    emphasis: "à emporter.",
    intro: "Une sélection gourmande de créations artisanales à offrir ou à partager. Les disponibilités évoluent au fil des saisons et des fournées.",
    heroImage: "",
    heroImageAlt: "",
    selectionEyebrow: "LA SÉLECTION MELP.ATISSE",
    selectionTitle: "À offrir ou à",
    selectionEmphasis: "savourer.",
    selectionIntro: "La sélection et les informations produits seront ajoutées ici après validation par Mélissa.",
    note: "Les produits, photos, compositions, formats et tarifs restent à renseigner depuis l’administration.",
    products: [],
  },
};

const dataFile = path.join(process.cwd(), "data", "site-content.json");
const blobPath = "melp/site-content.json";
// Vercel exposes OIDC credentials to functions through request context/header at runtime,
// so VERCEL_OIDC_TOKEN may not exist in process.env even when a Blob store is connected.
export const isBlobStorageConfigured = () => Boolean(
  process.env.BLOB_READ_WRITE_TOKEN ||
  (process.env.BLOB_STORE_ID && (process.env.VERCEL === "1" || process.env.VERCEL_OIDC_TOKEN)),
);
export const isAllowedContentImage = (image: string) => image.startsWith("/images/") || image.startsWith("/uploads/") || image.startsWith("https://");

export async function readSiteContent(): Promise<SiteContent> {
  try {
    let raw: string;
    if (isBlobStorageConfigured()) {
      const { blobs } = await list({ prefix: blobPath, limit: 1 });
      const blob = blobs.find(item => item.pathname === blobPath);
      if (!blob) return defaultContent;
      const response = await fetch(blob.url, { cache: "no-store" });
      if (!response.ok) throw new Error("Impossible de lire le contenu enregistré.");
      raw = await response.text();
    } else {
      raw = await readFile(dataFile, "utf8");
    }
    const saved = JSON.parse(raw) as Partial<SiteContent>;
    return {
      ...defaultContent,
      ...saved,
      siteMedia: saved.siteMedia && typeof saved.siteMedia === "object" ? saved.siteMedia : {},
      pages: Object.fromEntries(Object.entries(editablePages).map(([key, page]) => {
        const savedPage = saved.pages?.[key];
      const mergedPage = savedPage ? { ...page, ...savedPage, sections: Array.isArray(savedPage.sections) ? savedPage.sections : page.sections } : page;
  if (key === "accueil" && mergedPage.eyebrow === "Pâtissière · Cheffe privée · Traiteur · Ateliers") {
        mergedPage.eyebrow = "Pâtissière · Traiteur · Cheffe privée · Atelier";
      }
      return [key, mergedPage];
      })),
      epicerie: { ...defaultContent.epicerie, ...saved.epicerie },
      patisserie: { products: saved.patisserie?.products ?? defaultContent.patisserie.products },
      schedule: {
        ...defaultContent.schedule,
        ...saved.schedule,
        closedDates: Array.isArray(saved.schedule?.closedDates) ? saved.schedule.closedDates : [],
        openDates: Array.isArray(saved.schedule?.openDates) ? saved.schedule.openDates : [],
        closedRanges: Array.isArray(saved.schedule?.closedRanges) ? saved.schedule.closedRanges : [],
        closedWeekdays: Array.isArray(saved.schedule?.closedWeekdays) ? saved.schedule.closedWeekdays : [],
        capacityOverrides: Array.isArray(saved.schedule?.capacityOverrides) ? saved.schedule.capacityOverrides : [],
      },
    };
  } catch (error) {
    if (isBlobStorageConfigured()) throw error;
    return defaultContent;
  }
}

export async function writeSiteContent(content: SiteContent) {
  if (isBlobStorageConfigured()) {
    await put(blobPath, JSON.stringify(content, null, 2), { access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json", cacheControlMaxAge: 60 });
    return;
  }
  if (process.env.VERCEL === "1") throw new Error("Reliez un stockage Vercel Blob au projet pour enregistrer les modifications en ligne.");
  const directory = path.dirname(dataFile);
  await mkdir(directory, { recursive: true });
  const temporaryFile = `${dataFile}.tmp`;
  await writeFile(temporaryFile, JSON.stringify(content, null, 2), "utf8");
  await rename(temporaryFile, dataFile);
}

export function isAdminPassword(password: string | null) {
  const configured = process.env.MELP_ADMIN_PASSWORD;
  return Boolean(configured && password && password === configured);
}
