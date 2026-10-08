export type SiteImageAsset = { id: string; label: string; src: string };

// Fixed image placements that were previously hard-coded in page templates.
export const siteImageAssets: SiteImageAsset[] = [
  { id: "home-hero", label: "Accueil — grande photo", src: "/images/number-cake-fruits-rouges.png" },
  { id: "home-pastries", label: "Accueil — carte pâtisseries", src: "/images/gateau-framboises-fleurs.png" },
  { id: "home-grocery", label: "Accueil — carte épicerie gourmande", src: "/images/entremets-chocolat-noisettes.png" },
  { id: "home-workshops", label: "Accueil — carte ateliers", src: "/images/number-cake-choux.png" },
  { id: "home-story", label: "Accueil — savoir-faire", src: "/images/number-cake-tropical.png" },
  { id: "pastry-custom", label: "Pâtisserie — création sur mesure", src: "/images/number-cake-tropical.png" },
  { id: "pastry-instagram-1", label: "Pâtisserie — galerie photo 1", src: "/images/number-cake-vanille-fleurs.png" },
  { id: "pastry-instagram-2", label: "Pâtisserie — galerie photo 2", src: "/images/gateau-framboises-fleurs.png" },
  { id: "pastry-instagram-3", label: "Pâtisserie — galerie photo 3", src: "/images/number-cake-choux.png" },
  { id: "pastry-instagram-4", label: "Pâtisserie — galerie photo 4", src: "/images/entremets-chocolat-noisettes.png" },
  { id: "contact-bottom-1", label: "Contact — photo gourmandise", src: "/images/number-cake-choux.png" },
  { id: "contact-bottom-2", label: "Contact — photo élégance", src: "/images/number-cake-tropical.png" },
  { id: "contact-bottom-3", label: "Contact — photo sur mesure", src: "/images/entremets-chocolat-noisettes.png" },
  { id: "event-showcase-1", label: "Événements — grande photo", src: "/images/traiteur-planche-festive.png" },
  { id: "event-showcase-2", label: "Événements — photo création", src: "/images/number-cake-tropical.png" },
  { id: "about-card-front", label: "À propos — carte de visite recto", src: "/images/melp-carte-recto.png" },
  { id: "about-card-back", label: "À propos — carte de visite verso", src: "/images/melp-carte-verso.png" },
];

export const siteImageIds = new Set(siteImageAssets.map((asset) => asset.id));
