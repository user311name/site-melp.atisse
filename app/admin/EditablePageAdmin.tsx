"use client";

import { ImagePlus, Plus, Trash2 } from "lucide-react";
import type { EditablePage, EditableSection } from "@/lib/site-content";

type Props = {
  pages: Record<string, EditablePage>;
  onPageChange: (key: string, field: keyof EditablePage, value: string) => void;
  onSectionChange: (key: string, id: string, field: keyof EditableSection, value: string) => void;
  onAddSection: (key: string) => void;
  onRemoveSection: (key: string, id: string) => void;
  onUpload: (target: string, file: File) => void;
};

const groups = [
  ["accueil", "patisserie", "epicerie", "ateliers"],
  ["cheffe-privee", "cartes-cadeaux", "commander", "evenements"],
  ["a-propos", "collaborations", "avis", "contact"],
];

export default function EditablePageAdmin({ pages, onPageChange, onSectionChange, onAddSection, onRemoveSection, onUpload }: Props) {
  return <section className="admin-page-manager">
    <div className="admin-products-heading"><div><span className="warm-eyebrow">CONTENUS DU SITE</span><h2>Pages et rubriques</h2><p>Ouvre une rubrique pour modifier son titre, son texte, sa photo ou ajouter des sections. Les modifications apparaissent sur le site après enregistrement.</p></div></div>
    {groups.map((group, groupIndex) => <div className="admin-page-group" key={groupIndex}>{group.map(key => {
      const page = pages[key];
      if (!page) return null;
      return <details className="admin-page-accordion" key={key}>
        <summary><span>{page.label}</span><small>{page.sections.length} section{page.sections.length > 1 ? "s" : ""} personnalisée{page.sections.length > 1 ? "s" : ""}</small></summary>
        <div className="admin-page-fields">
          <div className="admin-fields">
            <label>Petit titre<input value={page.eyebrow} onChange={event => onPageChange(key,"eyebrow",event.target.value)} placeholder="Ex. Pâtisserie artisanale"/></label>
            <label>Titre<input value={page.title} onChange={event => onPageChange(key,"title",event.target.value)} placeholder="Titre principal"/></label>
            <label>Suite du titre<input value={page.emphasis} onChange={event => onPageChange(key,"emphasis",event.target.value)} placeholder="Texte mis en avant"/></label>
            <label className="admin-wide">Texte de présentation<textarea rows={3} value={page.intro} onChange={event => onPageChange(key,"intro",event.target.value)} placeholder="Présente cette rubrique avec tes mots"/></label>
            {key === "a-propos" && <><label className="admin-wide">Titre du parcours<input value={page.storyHeading} onChange={event => onPageChange(key,"storyHeading",event.target.value)} placeholder="Titre de la présentation personnelle"/></label><label className="admin-wide">Histoire et parcours<textarea rows={4} value={page.storyHistory} onChange={event => onPageChange(key,"storyHistory",event.target.value)} placeholder="Parcours, formation et repères à partager"/></label><label className="admin-wide">Façon de travailler et de créer<textarea rows={4} value={page.storyPractice} onChange={event => onPageChange(key,"storyPractice",event.target.value)} placeholder="Méthode, vision et approche de la gourmandise"/></label></>}
            <label>Texte du bouton principal<input value={page.ctaLabel} onChange={event => onPageChange(key,"ctaLabel",event.target.value)} placeholder="Ex. Découvrir"/></label>
            <label>Lien du bouton principal<input value={page.ctaUrl} onChange={event => onPageChange(key,"ctaUrl",event.target.value)} placeholder="https://… ou /contact"/></label>
            <div className="admin-upload admin-wide">{page.image ? <img src={page.image} alt={page.imageAlt || "Aperçu de la photo de rubrique"}/> : <div className="admin-upload-empty">Photo à ajouter</div>}<label className="admin-upload-button"><ImagePlus size={16}/> Choisir la photo principale<input type="file" accept="image/png,image/jpeg,image/webp" onChange={event => { const file = event.target.files?.[0]; if (file) onUpload(`page:${key}:hero`,file); }}/></label><small>JPG, PNG ou WebP · 4 Mo maximum</small></div>
            <label className="admin-wide">Description de la photo<input value={page.imageAlt} onChange={event => onPageChange(key,"imageAlt",event.target.value)} placeholder="Décris la photo pour l’accessibilité"/></label>
          </div>
          <div className="admin-custom-sections-heading"><div><h3>Sections personnalisées</h3><p>Ajoute des blocs de texte, de photo ou des liens vidéo YouTube et Instagram à cette page.</p></div><button className="admin-secondary" type="button" onClick={() => onAddSection(key)}><Plus size={16}/> Ajouter une section</button></div>
          {page.sections.map((section,index) => <article className="admin-custom-section" key={section.id}><header><strong>Section {index + 1}</strong><button className="admin-delete" type="button" onClick={() => onRemoveSection(key,section.id)} aria-label="Supprimer cette section"><Trash2 size={16}/></button></header><div className="admin-fields">{key === "collaborations" && <label>Catégorie<select value={section.category || ""} onChange={event => onSectionChange(key,section.id,"category",event.target.value)}><option value="">Choisir une catégorie</option><option value="point-de-vente">Où acheter mes gourmandises</option><option value="restaurant">Restaurants & collaborations</option><option value="atelier">Partenaires ateliers</option></select></label>}{(key === "ateliers" || key === "collaborations") && <><label>Date / période<input value={section.date || ""} onChange={event => onSectionChange(key,section.id,"date",event.target.value)} placeholder="À renseigner / confirmer"/></label><label>Ville<input value={section.location || ""} onChange={event => onSectionChange(key,section.id,"location",event.target.value)} placeholder="Ville à renseigner"/></label></>}<label className="admin-wide">Titre<input value={section.title} onChange={event => onSectionChange(key,section.id,"title",event.target.value)} placeholder="Titre de la section"/></label><label className="admin-wide">Texte<textarea rows={4} value={section.body} onChange={event => onSectionChange(key,section.id,"body",event.target.value)} placeholder="Ton texte, avec tes mots"/></label><label>Texte du bouton<input value={section.linkText} onChange={event => onSectionChange(key,section.id,"linkText",event.target.value)} placeholder="Ex. En savoir plus"/></label><label>Lien du bouton<input value={section.linkUrl} onChange={event => onSectionChange(key,section.id,"linkUrl",event.target.value)} placeholder="https://… ou /contact"/></label><div className="admin-upload admin-wide">{section.image ? <img src={section.image} alt={section.imageAlt || "Aperçu de la photo"}/> : <div className="admin-upload-empty">Photo à ajouter</div>}<label className="admin-upload-button"><ImagePlus size={16}/> Choisir une photo<input type="file" accept="image/png,image/jpeg,image/webp" onChange={event => { const file = event.target.files?.[0]; if (file) onUpload(`section:${key}:${section.id}`,file); }}/></label><small>JPG, PNG ou WebP · 4 Mo maximum</small></div><label className="admin-wide">Description de la photo<input value={section.imageAlt} onChange={event => onSectionChange(key,section.id,"imageAlt",event.target.value)}/></label></div></article>)}
        </div>
      </details>;
    })}</div>)}
  </section>;
}
