import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
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
  image: string;
  imageAlt: string;
};

export type { PastryProduct } from "@/lib/pastry-catalog";

export type SiteContent = {
  patisserie: { products: PastryProduct[] };
  schedule: { maxOrdersPerDay: number | null; closedDates: string[] };
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

export const defaultContent: SiteContent = {
  patisserie: { products: pastryCatalog },
  schedule: { maxOrdersPerDay: null, closedDates: [] },
  epicerie: {
    eyebrow: "ÉPICERIE GOURMANDE",
    title: "Les petites douceurs",
    emphasis: "à emporter.",
    intro: "Une sélection gourmande de créations artisanales à offrir ou à partager. Les disponibilités évoluent au fil des saisons et des fournées.",
    heroImage: "/images/number-cake-choux.png",
    heroImageAlt: "Number cake aux petits choux, une création Melp.atisse",
    selectionEyebrow: "LA SÉLECTION MELP.ATISSE",
    selectionTitle: "À offrir ou à",
    selectionEmphasis: "savourer.",
    selectionIntro: "Choisis une création pour découvrir sa composition, ses allergènes, ses formats et son tarif.",
    note: "Les compositions, allergènes, formats et tarifs marqués « à confirmer » seront renseignés par Mélissa depuis l’administration.",
    products: [
      { id: "chocolat-noisettes", name: "Chocolat & noisettes", description: "Une création chocolatée photographiée dans l’atelier de Mélissa.", composition: "Composition à compléter avec Mélissa.", allergens: "Allergènes à confirmer avec Mélissa.", format: "Formats et nombre de parts à confirmer.", price: "Tarif à confirmer", image: "/images/entremets-chocolat-noisettes.png", imageAlt: "Création chocolatée aux noisettes" },
      { id: "fruits-rouges", name: "Fruits rouges & fleurs", description: "Une pâtisserie fraîche et fleurie, à réserver selon la saison.", composition: "Composition à compléter avec Mélissa.", allergens: "Allergènes à confirmer avec Mélissa.", format: "Formats et nombre de parts à confirmer.", price: "Tarif à confirmer", image: "/images/carte-photo-2.png", imageAlt: "Gâteau décoré de fruits rouges et de fleurs" },
      { id: "gateau-fleuri", name: "Gâteau fleuri à partager", description: "Une création décorée à la main, à personnaliser pour votre occasion.", composition: "Composition à compléter avec Mélissa.", allergens: "Allergènes à confirmer avec Mélissa.", format: "Formats et nombre de parts à confirmer.", price: "Tarif à confirmer", image: "/images/carte-photo-1.png", imageAlt: "Gâteau fleuri décoré de crème pochée" },
    ],
  },
};

const dataFile = path.join(process.cwd(), "data", "site-content.json");

export async function readSiteContent(): Promise<SiteContent> {
  try {
    const saved = JSON.parse(await readFile(dataFile, "utf8")) as Partial<SiteContent>;
    return {
      ...defaultContent,
      ...saved,
      epicerie: { ...defaultContent.epicerie, ...saved.epicerie },
      patisserie: { products: saved.patisserie?.products ?? defaultContent.patisserie.products },
      schedule: saved.schedule ?? defaultContent.schedule,
    };
  } catch {
    return defaultContent;
  }
}

export async function writeSiteContent(content: SiteContent) {
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
