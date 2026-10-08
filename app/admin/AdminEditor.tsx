"use client";

import { useState } from "react";
import { ArrowLeft, ImagePlus, Plus, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import type { EditablePage, EditableSection, GroceryProduct, SiteContent } from "@/lib/site-content";
import { pastryCatalog, type PastryProduct } from "@/lib/pastry-catalog";
import EditablePageAdmin from "./EditablePageAdmin";
import PastryAdmin from "./PastryAdmin";
import OrderAdmin from "./OrderAdmin";
import ScheduleAdmin from "./ScheduleAdmin";
import MediaLibraryAdmin from "./MediaLibraryAdmin";
import ReviewsAdmin from "./ReviewsAdmin";

export default function AdminEditor() {
  const [password, setPassword] = useState("");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const response = await fetch("/api/admin-login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    if (!response.ok) { setMessage("Mot de passe incorrect ou accès administrateur non configuré."); setBusy(false); return; }
    const dataResponse = await fetch("/api/site-content", { cache: "no-store" });
    if (!dataResponse.ok) { const result = await dataResponse.json().catch(() => null); setMessage(result?.error ?? "Impossible de charger le contenu du site."); setBusy(false); return; }
    const loaded = await dataResponse.json() as SiteContent;
    setContent({ ...loaded, patisserie: loaded.patisserie ?? { products: pastryCatalog } }); setBusy(false);
  }

  function updatePage(field: keyof SiteContent["epicerie"], value: string) {
    setContent(current => {
      if (!current) return current;
      const siteMedia = { ...current.siteMedia };
      if (field === "heroImage") delete siteMedia["home-grocery"];
      return { ...current, epicerie: { ...current.epicerie, [field]: value }, siteMedia };
    });
  }

  function updateManagedPage(key: string, field: keyof EditablePage, value: string) {
    setContent(current => {
      if (!current) return current;
      const siteMedia = { ...current.siteMedia };
      const homePhotoByPage: Record<string, string> = { accueil: "home-hero", patisserie: "home-pastries", epicerie: "home-grocery", ateliers: "home-workshops", "a-propos": "home-story" };
      if (field === "image" && homePhotoByPage[key]) delete siteMedia[homePhotoByPage[key]];
      return { ...current, pages: { ...current.pages, [key]: { ...current.pages[key], [field]: value } }, siteMedia };
    });
  }

  function updateManagedSection(key: string, id: string, field: keyof EditableSection, value: string) {
    setContent(current => current ? { ...current, pages: { ...current.pages, [key]: { ...current.pages[key], sections: current.pages[key].sections.map(section => section.id === id ? { ...section, [field]: value } : section) } } } : current);
  }

  function addManagedSection(key: string) {
    const section: EditableSection = { id: crypto.randomUUID(), title: "Nouvelle section", body: "", image: "", imageAlt: "", linkText: "", linkUrl: "", category: "", location: "", date: "" };
    setContent(current => current ? { ...current, pages: { ...current.pages, [key]: { ...current.pages[key], sections: [...current.pages[key].sections, section] } } } : current);
  }

  function removeManagedSection(key: string, id: string) {
    setContent(current => current ? { ...current, pages: { ...current.pages, [key]: { ...current.pages[key], sections: current.pages[key].sections.filter(section => section.id !== id) } } } : current);
  }

  function updateProduct(id: string, field: keyof GroceryProduct, value: string) {
    setContent(current => current ? { ...current, epicerie: { ...current.epicerie, products: current.epicerie.products.map(item => item.id === id ? { ...item, [field]: value } : item) } } : current);
  }

  function updatePastry(id: number, field: keyof PastryProduct, value: string) {
    setContent(current => current ? { ...current, patisserie: { ...current.patisserie, products: current.patisserie.products.map(item => item.id === id ? { ...item, [field]: field === "ingredients" || field === "allergens" || field === "notes" ? value.split("\n").filter(Boolean) : value } : item) } } : current);
  }

  function addPastry() {
    setContent(current => {
      if (!current) return current;
      const id = Math.max(0, ...current.patisserie.products.map(item => item.id)) + 1;
      const product: PastryProduct = { id, category: "", name: "", eyebrow: "À renseigner", description: "", image: "", price: "", ingredients: [], allergens: [], notes: [], conservation: "", weight: "", availability: "" };
      return { ...current, patisserie: { ...current.patisserie, products: [...current.patisserie.products, product] } };
    });
  }

  function removePastry(id: number) {
    setContent(current => current ? { ...current, patisserie: { ...current.patisserie, products: current.patisserie.products.filter(item => item.id !== id) } } : current);
  }

  function updateCapacity(value: number | null) {
    setContent(current => current ? { ...current, schedule: { ...current.schedule, maxOrdersPerDay: value } } : current);
  }

  function updateClosedDates(value: string[]) {
    setContent(current => current ? { ...current, schedule: { ...current.schedule, closedDates: value } } : current);
  }

  function updateOpenDates(value: string[]) {
    setContent(current => current ? { ...current, schedule: { ...current.schedule, openDates: value } } : current);
  }

  function updateClosedRanges(value: SiteContent["schedule"]["closedRanges"]) {
    setContent(current => current ? { ...current, schedule: { ...current.schedule, closedRanges: value } } : current);
  }

  function updateClosedWeekdays(value: number[]) {
    setContent(current => current ? { ...current, schedule: { ...current.schedule, closedWeekdays: value } } : current);
  }

  function updateCapacityOverrides(value: SiteContent["schedule"]["capacityOverrides"]) {
    setContent(current => current ? { ...current, schedule: { ...current.schedule, capacityOverrides: value } } : current);
  }

  function updateMediaOverride(source: string, image: string) {
    setContent(current => {
      if (!current) return current;
      const siteMedia = { ...current.siteMedia };
      if (image) siteMedia[source] = image;
      else delete siteMedia[source];
      return { ...current, siteMedia };
    });
  }

  async function upload(id: string, file: File) {
    setUploading(true);
    setMessage("Envoi de la photo en cours…");
    try {
      const form = new FormData();
      form.set("file", file);
      const response = await fetch("/api/admin-media", { method: "POST", headers: { "x-melp-admin-password": password }, body: form });
      const result = await response.json().catch(() => null) as { image?: string; error?: string } | null;
      if (!response.ok) throw new Error(result?.error ?? `L’envoi a échoué (erreur ${response.status}).`);
      if (!result?.image) throw new Error("Le serveur n’a pas renvoyé la photo. Réessaie, puis vérifie la connexion au stockage si le problème continue.");
      if (id === "__hero__") updatePage("heroImage", result.image);
      else if (id.startsWith("pastry-")) updatePastry(Number(id.slice(7)), "image", result.image);
      else if (id.startsWith("page:")) { const [, key] = id.split(":"); updateManagedPage(key, "image", result.image); }
      else if (id.startsWith("section:")) { const [, key, sectionId] = id.split(":"); updateManagedSection(key, sectionId, "image", result.image); }
      else if (id.startsWith("media:")) updateMediaOverride(id.slice(6), result.image);
      else updateProduct(id, "image", result.image);
      setMessage("Photo chargée. Clique sur « Enregistrer » pour publier le changement.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "L’envoi de la photo a échoué. Réessaie.");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    if (!content) return;
    setBusy(true); setMessage("");
    const response = await fetch("/api/site-content", { method: "PUT", headers: { "Content-Type": "application/json", "x-melp-admin-password": password }, body: JSON.stringify(content) });
    const result = await response.json(); setMessage(response.ok ? "Modifications enregistrées. Les pages et fiches concernées sont mises à jour." : result.error ?? "Enregistrement impossible."); setBusy(false);
  }

  function addProduct() {
    const item: GroceryProduct = { id: crypto.randomUUID(), name: "", description: "", composition: "", allergens: "", format: "", price: "", availability: "", image: "", imageAlt: "" };
    setContent(current => current ? { ...current, epicerie: { ...current.epicerie, products: [...current.epicerie.products, item] } } : current);
  }

  function removeProduct(id: string) {
    setContent(current => current ? { ...current, epicerie: { ...current.epicerie, products: current.epicerie.products.filter(item => item.id !== id) } } : current);
  }

  if (!content) return <section className="admin-login"><Link href="/" className="admin-back"><ArrowLeft size={16}/> Retour au site</Link><div className="admin-login-card"><span className="warm-eyebrow">MELP.ATISSE · ESPACE PRIVÉ</span><h1>Administration</h1><p>Gère le contenu du site depuis ton téléphone : pages, textes, photos, produits, calendrier et demandes.</p><form onSubmit={login}><label>Mot de passe<input type="password" value={password} onChange={event => setPassword(event.target.value)} required autoComplete="current-password"/></label><button type="submit" disabled={busy}>Ouvrir l’administration</button></form>{message && <p role="status" className="admin-message">{message}</p>}</div></section>;

  return <div className="admin-editor"><header className="admin-topbar"><Link href="/" className="admin-back"><ArrowLeft size={16}/> Voir le site</Link><span>ADMINISTRATION · MELP.ATISSE</span><button type="button" onClick={save} disabled={busy || uploading}><Save size={16}/> Enregistrer</button></header><div className="admin-content"><div className="admin-heading"><span className="warm-eyebrow">CONTENU DU SITE</span><h1>Administration du site</h1><p>Modifie les textes, les photos et les informations produits. Enregistre pour publier les changements sur la page.</p>{message && <p className="admin-feedback" role="status" aria-live="polite">{message}</p>}</div><MediaLibraryAdmin overrides={content.siteMedia} onUpload={(source,file)=>void upload(`media:${source}`,file)} onReset={(source)=>updateMediaOverride(source, "")}/><EditablePageAdmin pages={content.pages} onPageChange={updateManagedPage} onSectionChange={updateManagedSection} onAddSection={addManagedSection} onRemoveSection={removeManagedSection} onUpload={(target,file)=>void upload(target,file)}/><section className="admin-panel"><h2>Présentation</h2><div className="admin-fields"><label>Petit titre<input value={content.epicerie.eyebrow} onChange={event => updatePage("eyebrow", event.target.value)}/></label><label>Titre<input value={content.epicerie.title} onChange={event => updatePage("title", event.target.value)}/></label><label>Fin du titre<input value={content.epicerie.emphasis} onChange={event => updatePage("emphasis", event.target.value)}/></label><label className="admin-wide">Texte d’introduction<textarea rows={3} value={content.epicerie.intro} onChange={event => updatePage("intro", event.target.value)}/></label><div className="admin-upload admin-wide">{content.epicerie.heroImage ? <img src={content.epicerie.heroImage} alt="Aperçu de la photo de bandeau"/> : <div className="admin-upload-empty">Photo à ajouter</div>}<label className="admin-upload-button"><ImagePlus size={16}/> Changer la photo du bandeau<input type="file" accept="image/png,image/jpeg,image/webp" onChange={event => { const file = event.target.files?.[0]; if (file) void upload("__hero__", file); }}/></label><small>JPG, PNG ou WebP · 5 Mo maximum</small></div><label className="admin-wide">Description de la photo<input value={content.epicerie.heroImageAlt} onChange={event => updatePage("heroImageAlt", event.target.value)}/></label></div></section><div className="admin-products-heading"><div><h2>Fiches gourmandes</h2><p>Composition, allergènes, formats et prix s’affichent quand un visiteur ouvre une carte.</p></div><button className="admin-secondary" type="button" onClick={addProduct}><Plus size={16}/> Ajouter une création</button></div>{content.epicerie.products.map((item, index) => <section className="admin-panel admin-product" key={item.id}><div className="admin-product-title"><span>0{index + 1}</span><h3>{item.name || "Nouvelle création"}</h3><button type="button" className="admin-delete" onClick={() => removeProduct(item.id)} aria-label={`Supprimer ${item.name}`}><Trash2 size={16}/></button></div><div className="admin-fields"><label>Nom<input value={item.name} onChange={event => updateProduct(item.id, "name", event.target.value)}/></label><label>Tarif<input value={item.price} onChange={event => updateProduct(item.id, "price", event.target.value)} placeholder="Ex. 32 €"/></label><label className="admin-wide">Description<textarea rows={2} value={item.description} onChange={event => updateProduct(item.id, "description", event.target.value)}/></label><label>Composition<textarea rows={3} value={item.composition} onChange={event => updateProduct(item.id, "composition", event.target.value)}/></label><label>Allergènes<textarea rows={3} value={item.allergens} onChange={event => updateProduct(item.id, "allergens", event.target.value)}/></label><label>Format<input value={item.format} onChange={event => updateProduct(item.id, "format", event.target.value)}/></label><label>Disponibilité / stock<input value={item.availability ?? ""} placeholder="À renseigner" onChange={event => updateProduct(item.id, "availability", event.target.value)}/></label><label>Texte alternatif de la photo<input value={item.imageAlt} onChange={event => updateProduct(item.id, "imageAlt", event.target.value)}/></label><div className="admin-upload">{item.image ? <img src={item.image} alt="Aperçu de la création"/> : <div className="admin-upload-empty">Photo à ajouter</div>}<label className="admin-upload-button"><ImagePlus size={16}/> Choisir une photo<input type="file" accept="image/png,image/jpeg,image/webp" onChange={event => { const file = event.target.files?.[0]; if (file) void upload(item.id, file); }}/></label><small>JPG, PNG ou WebP · 5 Mo maximum</small></div></div></section>)}<div className="admin-save-bottom"><button type="button" onClick={save} disabled={busy || uploading}><Save size={16}/> Enregistrer et publier</button>{message && <p role="status">{message}</p>}</div><PastryAdmin products={content.patisserie.products} onChange={updatePastry} onAdd={addPastry} onRemove={removePastry} onUpload={(id,file)=>void upload(`pastry-${id}`,file)}/><ScheduleAdmin schedule={content.schedule} onCapacity={updateCapacity} onClosedDates={updateClosedDates} onOpenDates={updateOpenDates} onClosedRanges={updateClosedRanges} onClosedWeekdays={updateClosedWeekdays} onCapacityOverrides={updateCapacityOverrides}/><OrderAdmin password={password}/><ReviewsAdmin password={password}/><p className="admin-footnote">Pour que les changements et photos restent disponibles sur le site en ligne, un stockage Vercel Blob doit être relié au projet.</p></div></div>;
}




