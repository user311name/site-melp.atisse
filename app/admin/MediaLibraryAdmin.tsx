"use client";

import { ImagePlus, RotateCcw } from "lucide-react";
import { siteImageAssets } from "@/lib/site-media";

type Props = {
  overrides: Record<string, string>;
  onUpload: (source: string, file: File) => void;
  onReset: (source: string) => void;
};

export default function MediaLibraryAdmin({ overrides, onUpload, onReset }: Props) {
  return <section className="admin-panel admin-media-library">
    <div className="admin-media-heading"><div><h2>Toutes les photos du site</h2><p>Remplace ici les photos des zones fixes. Pour les photos d’en-tête et de sections, ouvre la rubrique correspondante ; pour les créations, utilise les fiches pâtisserie ou épicerie.</p></div><span>{siteImageAssets.length} emplacements</span></div>
    <div className="admin-media-grid">
      {siteImageAssets.map((asset) => {
        const replacement = overrides[asset.id];
        return <article className="admin-media-card" key={asset.id}>
          <img src={replacement || asset.src} alt={asset.label}/>
          <div className="admin-media-card-copy"><strong>{asset.label}</strong><small>{replacement ? "Photo personnalisée" : "Photo d’origine"}</small></div>
          <div className="admin-media-card-actions">
            <label className="admin-upload-button"><ImagePlus size={15}/> Remplacer<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (file) onUpload(asset.id, file); event.currentTarget.value = ""; }}/></label>
            {replacement && <button type="button" className="admin-media-reset" onClick={() => onReset(asset.id)} aria-label={`Rétablir ${asset.label}`}><RotateCcw size={14}/> Rétablir</button>}
          </div>
        </article>;
      })}
    </div>
    <p className="admin-media-note">Chaque emplacement est indépendant : remplacer une photo ne change aucune autre photo du site.</p>
  </section>;
}
