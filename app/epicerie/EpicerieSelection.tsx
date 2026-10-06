"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import type { GroceryProduct } from "@/lib/site-content";

export default function EpicerieSelection({ products }: { products: GroceryProduct[] }) {
  const [active, setActive] = useState<GroceryProduct | null>(null);
  return <>
    <div className="grocery-grid">
      {products.map((item, index) => (
        <button className="grocery-card" key={item.id} type="button" onClick={() => setActive(item)} aria-label={`Voir la fiche ${item.name}`}>
          <div className="grocery-card-image"><img src={item.image} alt={item.imageAlt}/><span>0{index + 1} · CRÉATION MELP</span></div>
          <div className="grocery-card-copy"><span className="warm-eyebrow">À OFFRIR OU À PARTAGER</span><h3>{item.name}</h3><p>{item.description}</p><div className="grocery-card-bottom"><strong>{item.price}</strong><span className="grocery-open">Découvrir <ArrowRight size={15}/></span></div></div>
        </button>
      ))}
    </div>
    {active && <div className="grocery-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setActive(null); }}>
      <section className="grocery-modal" role="dialog" aria-modal="true" aria-labelledby="grocery-modal-title">
        <button className="grocery-modal-close" type="button" onClick={() => setActive(null)} aria-label="Fermer"><X size={20}/></button>
        <img className="grocery-modal-photo" src={active.image} alt={active.imageAlt}/>
        <div className="grocery-modal-content"><span className="warm-eyebrow">FICHE GOURMANDE</span><h2 id="grocery-modal-title">{active.name}</h2><p>{active.description}</p><dl><div><dt>Composition</dt><dd>{active.composition}</dd></div><div><dt>Allergènes</dt><dd>{active.allergens}</dd></div><div><dt>Formats</dt><dd>{active.format}</dd></div><div><dt>Tarif</dt><dd>{active.price}</dd></div></dl><p className="grocery-modal-note">Les informations et la disponibilité sont confirmées par Mélissa au moment de la demande.</p><Link className="warm-button" href={`/commander?creation=${encodeURIComponent(active.name)}`}>Demander cette création <ArrowRight size={15}/></Link></div>
      </section>
    </div>}
  </>;
}
