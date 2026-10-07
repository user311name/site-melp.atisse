"use client";

import { ImagePlus, Plus, Trash2 } from "lucide-react";
import type { PastryProduct } from "@/lib/pastry-catalog";

type Props = {
  products: PastryProduct[];
  onChange: (id: number, field: keyof PastryProduct, value: string) => void;
  onAdd: () => void;
  onRemove: (id: number) => void;
  onUpload: (id: number, file: File) => void;
};

export default function PastryAdmin({ products, onChange, onAdd, onRemove, onUpload }: Props) {
  return (
    <section className="admin-panel">
      <div className="admin-products-heading">
        <div><h2>Carte pâtisserie</h2><p>Ajoute et modifie les fiches publiées. Pour les listes de composition et d’allergènes, mets un élément par ligne.</p></div>
        <button className="admin-secondary" type="button" onClick={onAdd}><Plus size={16} /> Ajouter une pâtisserie</button>
      </div>
      {products.map(item => (
        <article className="admin-product" key={item.id}>
          <div className="admin-product-title"><span>{String(item.id).padStart(2, "0")}</span><h3>{item.name || "Nouvelle pâtisserie"}</h3><button type="button" className="admin-delete" onClick={() => onRemove(item.id)} aria-label={`Supprimer ${item.name || "cette pâtisserie"}`}><Trash2 size={16} /></button></div>
          <div className="admin-fields">
            <label>Nom<input value={item.name} onChange={event => onChange(item.id, "name", event.target.value)} /></label>
            <label>Catégorie<input value={item.category} onChange={event => onChange(item.id, "category", event.target.value)} /></label>
            <label>Tarif<input value={item.price} onChange={event => onChange(item.id, "price", event.target.value)} /></label>
            <label>Format et nombre de parts<input value={item.weight} onChange={event => onChange(item.id, "weight", event.target.value)} /></label>
            <label className="admin-wide">Description<textarea rows={2} value={item.description} onChange={event => onChange(item.id, "description", event.target.value)} /></label>
            <label>Composition<textarea rows={3} value={item.ingredients.join("\n")} onChange={event => onChange(item.id, "ingredients", event.target.value)} /></label>
            <label>Allergènes<textarea rows={3} value={item.allergens.join("\n")} onChange={event => onChange(item.id, "allergens", event.target.value)} /></label>
            <label>Disponibilité / stock<input value={item.availability ?? ""} placeholder="À renseigner" onChange={event => onChange(item.id, "availability", event.target.value)} /></label>
            <label>Conservation<input value={item.conservation} onChange={event => onChange(item.id, "conservation", event.target.value)} /></label>
            <div className="admin-upload">{item.image ? <img src={item.image} alt={item.name || "Aperçu de la pâtisserie"} /> : <div className="admin-upload-empty">Photo à ajouter</div>}<label className="admin-upload-button"><ImagePlus size={16} /> Choisir une photo<input type="file" accept="image/png,image/jpeg,image/webp" onChange={event => { const file = event.target.files?.[0]; if (file) onUpload(item.id, file); }} /></label></div>
          </div>
        </article>
      ))}
    </section>
  );
}
