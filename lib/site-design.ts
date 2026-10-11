export const designTargets = [
  { id: "site-background", label: "Fond global des pages", selector: "body:not(:has(.admin-shell))", background: true, color: false, font: false },
  { id: "header-background", label: "Fond de l’en-tête", selector: ".site-header,.mobile-navigation", background: true, color: false, font: false },
  { id: "header-text", label: "Texte de l’en-tête", selector: ".site-header a,.site-header button,.mobile-navigation a", background: false, color: true, font: true },
  { id: "hero-background", label: "Bandeaux principaux", selector: ".home-hero,.warm-hero,.pas-hero,.events-hero,.contact-hero,.simple-hero,.reviews-hero", background: true, color: false, font: false },
  { id: "section-background", label: "Sections de contenu", selector: "main[class] > section:not(.warm-hero),main[class] .warm-content", background: true, color: false, font: false },
  { id: "card-background", label: "Cartes et encadrés", selector: "main[class] article,main[class] [class*='card'],main[class] .warm-form", background: true, color: false, font: false },
  { id: "main-title", label: "Grands titres (H1)", selector: "main[class] h1", background: false, color: true, font: true },
  { id: "section-title", label: "Titres de section (H2)", selector: "main[class] h2", background: false, color: true, font: true },
  { id: "card-title", label: "Titres de cartes (H3, H4)", selector: "main[class] h3,main[class] h4", background: false, color: true, font: true },
  { id: "paragraphs", label: "Paragraphes et listes", selector: "main[class] p,main[class] li", background: false, color: true, font: true },
  { id: "eyebrows", label: "Petits titres et accents", selector: "main[class] [class*='eyebrow'],main[class] [class*='kicker']", background: false, color: true, font: true },
  { id: "links", label: "Liens", selector: "main[class] a", background: false, color: true, font: true },
  { id: "buttons", label: "Boutons", selector: "main[class] button,main[class] [class*='button'],main[class] [class*='btn']", background: true, color: true, font: true },
  { id: "fields", label: "Champs de formulaire", selector: "main[class] input,main[class] textarea,main[class] select", background: true, color: true, font: true },
  { id: "footer-background", label: "Fond du pied de page", selector: ".site-footer,.contact-footer,.footer,.warm-footer,.home-footer", background: true, color: false, font: false },
  { id: "footer-text", label: "Texte du pied de page", selector: ".site-footer a,.site-footer p,.contact-footer a,.contact-footer p,.footer a,.footer p,.warm-footer a,.warm-footer span,.home-footer a,.home-footer span", background: false, color: true, font: true },
  { id: "custom", label: "Élément par classe CSS", selector: "", background: true, color: true, font: true },
] as const;

export type DesignTarget = (typeof designTargets)[number]["id"];

export function isSafeDesignSelector(value: string) {
  return value.length <= 200 && /^\.[a-z][a-z\d_-]*(?:(?:\s+|\s*[>+~]\s*)\.[a-z][a-z\d_-]*)*$/i.test(value);
}
