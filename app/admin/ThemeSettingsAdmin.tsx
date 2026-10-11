"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { SiteDesign } from "@/lib/site-content";
import { designTargets, type DesignTarget } from "@/lib/site-design";

type Props = { design: SiteDesign; onChange: (design: SiteDesign) => void; onPreview: () => void };

const fallbackFontChoices = [
  "Cormorant Garamond", "Lora", "DM Sans", "Baloo 2", "Dancing Script", "Playfair Display", "Montserrat", "Roboto", "Open Sans", "Poppins", "Merriweather", "Source Sans 3", "Nunito", "Raleway", "Oswald", "PT Sans", "Ubuntu", "Josefin Sans", "Libre Baskerville", "Roboto Slab", "Bebas Neue", "Cinzel", "Great Vibes", "Pacifico", "Caveat", "Outfit", "Manrope", "Inter", "Sora", "Archivo", "Fraunces", "DM Serif Display", "Work Sans", "Figtree", "Quicksand", "Barlow", "Karla", "Rubik", "Spectral", "Cormorant Infant", "Prata", "Bodoni Moda", "Playfair", "Alegreya", "Cardo", "Tinos", "Arimo", "Lobster", "Sacramento", "Shadows Into Light",
] as const;

type FontEntry = { family: string; category: string; popularity: number };
const fontCategories = ["Toutes", "Serif", "Sans Serif", "Display", "Handwriting", "Monospace"];
const safeFontName = (font: string) => /^[\p{L}\p{N} .'-]{1,80}$/u.test(font);
const googleFontsUrl = (families: string[]) => `https://fonts.googleapis.com/css2?${[...new Set(families.filter(safeFontName))].map(font => `family=${encodeURIComponent(font).replace(/%20/g, "+")}`).join("&")}&display=swap`;

function FontPicker({ id, value, onChange, fonts, loading, unavailable, open, onOpenChange, placeholder = "Rechercher ou saisir une police" }: { id: string; value: string; onChange: (value: string) => void; fonts: FontEntry[]; loading: boolean; unavailable: boolean; open: boolean; onOpenChange: (open: boolean) => void; placeholder?: string }) {
  const pickerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Toutes");
  const [limit, setLimit] = useState(12);
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return fonts.filter(font => (category === "Toutes" || font.category.toLowerCase() === category.toLowerCase()) && (!needle || font.family.toLocaleLowerCase().includes(needle)));
  }, [fonts, query, category]);
  useEffect(() => {
    if (!open) return;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (event.target instanceof Node && !pickerRef.current?.contains(event.target)) onOpenChange(false);
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, [open, onOpenChange]);
  useEffect(() => {
    const selector = `link[data-melp-font-picker-preview="${id}"]`;
    let link = document.querySelector<HTMLLinkElement>(selector);
    if (!open) { link?.remove(); return; }
    if (!link) {
      link = document.createElement("link");
      link.rel = "stylesheet";
      link.dataset.melpFontPickerPreview = id;
      document.head.appendChild(link);
    }
    link.href = googleFontsUrl([value, ...filtered.slice(0, limit).map(font => font.family)]);
    return () => { link?.remove(); };
  }, [id, value, filtered, limit, open]);
  return <div className="admin-font-picker" ref={pickerRef} data-font-picker={id}>
    <div className="admin-font-picker-entry"><input aria-label="Police choisie" value={value} onChange={event => onChange(event.target.value)} onFocus={() => onOpenChange(true)} onClick={() => onOpenChange(true)} placeholder={placeholder} maxLength={80} autoComplete="off"/><button type="button" aria-label="Parcourir les polices" aria-expanded={open} onClick={() => onOpenChange(!open)}>⌄</button></div>
    {open && <div className="admin-font-picker-popover">
      <div className="admin-font-current"><span>Police actuellement choisie</span><strong>{value || "Aucune — saisir ou choisir une police"}</strong></div>
      <p className="admin-font-instructions">Choisis une police dans la liste ou saisis son nom dans le champ au-dessus.</p>
      <input className="admin-font-search" aria-label="Rechercher une police" value={query} onChange={event => { setQuery(event.target.value); setLimit(60); }} placeholder={loading ? "Chargement du catalogue…" : "Rechercher parmi les polices…"} autoFocus/>
      <div className="admin-font-categories" aria-label="Filtrer par style">{fontCategories.map(item => <button key={item} type="button" className={category === item ? "is-active" : ""} onClick={() => { setCategory(item); setLimit(60); }}>{item}</button>)}</div>
      {unavailable && <p className="admin-font-status">Catalogue indisponible. Tu peux toujours saisir le nom d’une police dans le champ.</p>}
      <div className="admin-font-list" role="listbox" aria-label="Polices disponibles">
        {filtered.slice(0, limit).map(font => <button type="button" role="option" aria-selected={value === font.family} key={font.family} onClick={() => { onChange(font.family); onOpenChange(false); setQuery(""); }}><span className="admin-font-option-sample" style={{ fontFamily: `"${font.family.replace(/["\\]/g, "")}", Georgia, serif` }}>{font.family} — Aa Bb 123</span><small>{font.category}</small></button>)}
        {!loading && filtered.length === 0 && <p className="admin-font-status">Aucune police trouvée. Le nom saisi dans le champ sera conservé.</p>}
        {filtered.length > limit && <button type="button" className="admin-font-more" onClick={() => setLimit(count => count + 12)}>Afficher 12 polices de plus ({filtered.length - limit} restantes)</button>}
        {loading && <p className="admin-font-status">Chargement des polices Google Fonts…</p>}
      </div>
      <p className="admin-font-count">{fonts.length ? `${filtered.length.toLocaleString("fr-FR")} polices trouvées · ${Math.min(limit, filtered.length)} visibles` : "Le nom personnalisé est accepté"} · cliquer à l’extérieur ferme la liste</p>
      <button type="button" className="admin-font-close" onClick={() => onOpenChange(false)}>Fermer</button>
    </div>}
  </div>;
}

const fontLabels: { key: keyof SiteDesign["fonts"]; label: string }[] = [
  { key: "title", label: "Grands titres (H1)" }, { key: "subtitle", label: "Sous-titres (H2)" },
  { key: "minorTitle", label: "Titres de cartes et petits titres (H3, H4)" }, { key: "body", label: "Paragraphes et textes" },
  { key: "accent", label: "Petits titres et mots mis en évidence" }, { key: "interface", label: "Navigation, boutons et libellés" },
];

const colorLabels: { key: keyof SiteDesign["colors"]; label: string }[] = [
  { key: "background", label: "Fond global" }, { key: "section", label: "Sections" }, { key: "surface", label: "Cartes et encadrés" },
  { key: "heading", label: "Titres" }, { key: "text", label: "Textes principaux" }, { key: "muted", label: "Textes secondaires" },
  { key: "accent", label: "Accents et boutons" }, { key: "buttonText", label: "Texte des boutons" }, { key: "border", label: "Bordures" }, { key: "footer", label: "Pied de page" },
];

const createPlacement = (target: DesignTarget = "card-background") => ({ id: crypto.randomUUID(), target, selector: "", color: "", background: "", gradientStart: "#f8e2e4", gradientEnd: "#f2dfc9", gradientAngle: 135, useGradient: false, fontFamily: "" });
const placementOptions = designTargets.map(({ id, label }) => ({ id, label }));

function placementPreviewStyle(design: SiteDesign, target: DesignTarget): CSSProperties {
  const rule = [...design.placements].reverse().find(item => item.target === target);
  if (!rule) return {};
  return {
    ...(rule.color ? { color: rule.color } : {}),
    ...(rule.useGradient ? { background: `linear-gradient(${rule.gradientAngle}deg,${rule.gradientStart},${rule.gradientEnd})` } : rule.background ? { background: rule.background } : {}),
    ...(rule.fontFamily ? { fontFamily: `"${rule.fontFamily.replace(/["\\]/g, "")}", Georgia, serif` } : {}),
  };
}

function sampleStyle(base: CSSProperties, placement: CSSProperties): CSSProperties {
  return { ...base, ...placement };
}

export default function ThemeSettingsAdmin({ design, onChange, onPreview }: Props) {
  const [openFontPickerId, setOpenFontPickerId] = useState<string | null>(null);
  const [fonts, setFonts] = useState<FontEntry[]>(fallbackFontChoices.map((family, index) => ({ family, category: "Suggestions", popularity: index })));
  const [loadingFonts, setLoadingFonts] = useState(true);
  const [fontCatalogUnavailable, setFontCatalogUnavailable] = useState(false);
  useEffect(() => {
    let active = true;
    fetch("/api/font-catalog").then(response => { if (!response.ok) throw new Error("catalog unavailable"); return response.json(); }).then(data => {
      if (active && Array.isArray(data.fonts) && data.fonts.length) setFonts(data.fonts);
    }).catch(() => { if (active) setFontCatalogUnavailable(true); }).finally(() => { if (active) setLoadingFonts(false); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    const families = [...Object.values(design.fonts), ...design.placements.map(rule => rule.fontFamily)].filter((font): font is string => typeof font === "string" && safeFontName(font));
    let link = document.querySelector<HTMLLinkElement>("link[data-melp-admin-selected-fonts]");
    if (!link) {
      link = document.createElement("link");
      link.rel = "stylesheet";
      link.dataset.melpAdminSelectedFonts = "";
      document.head.appendChild(link);
    }
    link.href = googleFontsUrl(families);
  }, [design.fonts, design.placements]);
  const updateFont = (key: keyof SiteDesign["fonts"], value: string) => onChange({ ...design, fonts: { ...design.fonts, [key]: value } });
  const updateColor = (key: keyof SiteDesign["colors"], value: string) => onChange({ ...design, colors: { ...design.colors, [key]: value } });
  const updatePlacement = (id: string, patch: Partial<SiteDesign["placements"][number]>) => onChange({ ...design, placements: design.placements.map(rule => rule.id === id ? { ...rule, ...patch } : rule) });
  const addPlacement = () => onChange({ ...design, placements: [...design.placements, createPlacement()] });
  const removePlacement = (id: string) => onChange({ ...design, placements: design.placements.filter(rule => rule.id !== id) });
  const movePlacement = (id: string, direction: -1 | 1) => {
    const index = design.placements.findIndex(rule => rule.id === id);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= design.placements.length) return;
    const placements = [...design.placements];
    [placements[index], placements[nextIndex]] = [placements[nextIndex], placements[index]];
    onChange({ ...design, placements });
  };

  return <section className="admin-panel admin-theme-settings">
    <div className="admin-theme-heading"><div><span className="warm-eyebrow">IDENTITÉ VISUELLE</span><h2>Personnaliser le site</h2><p>Règle l’ambiance générale, puis ajoute des styles indépendants pour des zones précises. Les réglages s’appliquent sur toutes les pages et tu peux les essayer avant de les publier.</p></div><button type="button" className="admin-secondary admin-theme-preview-button" onClick={onPreview}>Prévisualiser tout le site</button></div>
    <h3>Typographies générales</h3>
    <div className="admin-fields admin-theme-fonts">
      {fontLabels.map(({ key, label }) => <label key={key}>{label}<FontPicker id={`general-${key}`} open={openFontPickerId === `general-${key}`} onOpenChange={open => setOpenFontPickerId(open ? `general-${key}` : null)} value={design.fonts[key]} onChange={value => updateFont(key, value)} fonts={fonts} loading={loadingFonts} unavailable={fontCatalogUnavailable}/><span className="admin-font-sample" style={{ fontFamily: `"${design.fonts[key].replace(/["\\]/g, "")}", Georgia, serif` }}>Aperçu — La gourmandise à partager</span></label>)}
    </div>
    <h3 className="admin-theme-colors-title">Palette générale</h3>
    <div className="admin-theme-color-grid">
      {colorLabels.map(({ key, label }) => <label className="admin-theme-color" key={key}><span>{label}</span><input aria-label={label} type="color" value={design.colors[key]} onChange={event => updateColor(key, event.target.value)}/><code>{design.colors[key].toUpperCase()}</code></label>)}
    </div>
    <h3 className="admin-theme-colors-title">Placer une couleur, un dégradé ou une typographie</h3>
    <p className="admin-theme-help">Chaque règle s’applique uniquement à la zone choisie. Ajoute autant de règles que nécessaire. Pour un endroit particulier, choisis « Élément par classe CSS » et indique une classe comme <code>.nom-de-la-zone</code>. En cas de règles qui se recouvrent, la dernière règle de la liste l’emporte.</p>
    <div className="admin-theme-placement-preview" aria-label="Aperçu de styles">
      <span style={sampleStyle({ color: design.colors.accent, fontFamily: design.fonts.accent }, placementPreviewStyle(design, "eyebrows"))}>UN APERÇU EN DIRECT</span>
      <h2 style={sampleStyle({ color: design.colors.heading, fontFamily: design.fonts.subtitle }, placementPreviewStyle(design, "section-title"))}>Une jolie idée à partager</h2>
      <p style={sampleStyle({ color: design.colors.text, fontFamily: design.fonts.body }, placementPreviewStyle(design, "paragraphs"))}>Le texte s’adapte à la typographie et à la couleur choisies.</p>
      <article style={sampleStyle({ background: design.colors.surface }, placementPreviewStyle(design, "card-background"))}><h3 style={sampleStyle({ color: design.colors.heading, fontFamily: design.fonts.minorTitle }, placementPreviewStyle(design, "card-title"))}>Une carte</h3><button type="button" style={sampleStyle({ color: design.colors.buttonText, background: design.colors.accent, fontFamily: design.fonts.interface }, placementPreviewStyle(design, "buttons"))}>Un bouton</button></article>
    </div>
    <div className="admin-theme-rules">
      {design.placements.map((rule, index) => {
        const target = designTargets.find(item => item.id === rule.target) ?? designTargets[0];
        return <article className="admin-theme-rule" key={rule.id}>
          <header><strong>Personnalisation {index + 1}</strong><div className="admin-theme-rule-actions"><button type="button" className="admin-secondary" aria-label={`Monter la personnalisation ${index + 1}`} disabled={index === 0} onClick={() => movePlacement(rule.id, -1)}>Monter</button><button type="button" className="admin-secondary" aria-label={`Descendre la personnalisation ${index + 1}`} disabled={index === design.placements.length - 1} onClick={() => movePlacement(rule.id, 1)}>Descendre</button><button type="button" className="admin-delete" aria-label={`Supprimer la personnalisation ${index + 1}`} onClick={() => removePlacement(rule.id)}>Supprimer</button></div></header>
          <label>Zone à modifier<select value={rule.target} onChange={event => updatePlacement(rule.id, { target: event.target.value as DesignTarget, selector: "" })}>{placementOptions.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}</select></label>
          {rule.target === "custom" && <label>Classe(s) CSS de l’élément<input value={rule.selector} onChange={event => updatePlacement(rule.id, { selector: event.target.value })} placeholder="Ex. .ma-section .ma-carte"/><small>Une ou plusieurs classes commençant par un point. Tu peux les chaîner avec un espace ou le signe &gt;.</small></label>}
          <div className="admin-theme-rule-fields">
            {target.color && <label>Couleur du texte<input type="color" value={rule.color || "#482516"} onChange={event => updatePlacement(rule.id, { color: event.target.value })}/><button type="button" className="admin-secondary" onClick={() => updatePlacement(rule.id, { color: "" })}>Utiliser la couleur générale</button></label>}
            {target.background && <div className="admin-theme-background">
              <label className="admin-theme-toggle"><input type="checkbox" checked={rule.useGradient} onChange={event => updatePlacement(rule.id, { useGradient: event.target.checked })}/> Utiliser un dégradé</label>
              {rule.useGradient ? <>
                <label>Première couleur<input type="color" value={rule.gradientStart} onChange={event => updatePlacement(rule.id, { gradientStart: event.target.value })}/></label>
                <label>Seconde couleur<input type="color" value={rule.gradientEnd} onChange={event => updatePlacement(rule.id, { gradientEnd: event.target.value })}/></label>
                <label>Direction du dégradé<select value={rule.gradientAngle} onChange={event => updatePlacement(rule.id, { gradientAngle: Number(event.target.value) })}><option value={0}>Vers le haut</option><option value={45}>Diagonale haut droit</option><option value={90}>Vers la droite</option><option value={135}>Diagonale bas droit</option><option value={180}>Vers le bas</option><option value={270}>Vers la gauche</option></select></label>
                <div className="admin-theme-gradient-swatch" style={{ background: `linear-gradient(${rule.gradientAngle}deg,${rule.gradientStart},${rule.gradientEnd})` }}/>
              </> : <label>Couleur de fond<input type="color" value={rule.background || "#fffaf3"} onChange={event => updatePlacement(rule.id, { background: event.target.value })}/></label>}
            </div>}
            {target.font && <label>Typographie de cette zone<FontPicker id={`placement-${rule.id}`} open={openFontPickerId === `placement-${rule.id}`} onOpenChange={open => setOpenFontPickerId(open ? `placement-${rule.id}` : null)} value={rule.fontFamily} onChange={value => updatePlacement(rule.id, { fontFamily: value })} fonts={fonts} loading={loadingFonts} unavailable={fontCatalogUnavailable} placeholder="Rechercher ou saisir une police"/><button type="button" className="admin-secondary" onClick={() => updatePlacement(rule.id, { fontFamily: "" })}>Utiliser la typographie générale</button></label>}
          </div>
        </article>;
      })}
    </div>
    <button type="button" className="admin-secondary admin-theme-add-rule" onClick={addPlacement}>+ Ajouter une zone personnalisée</button>
  </section>;
}
