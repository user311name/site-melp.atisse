import Link from "next/link";
import { ArrowRight, MapPin, ShoppingBag, Utensils, Sparkles } from "lucide-react";
import WarmPage from "@/components/WarmPage";

const places = [
  { name: "Le Garde Manger", location: "Saint-Michel-Chef-Chef", description: "Adresse partenaire à retrouver près de chez vous.", icon: ShoppingBag },
  { name: "Épicerie 1909", location: "La Plaine-sur-Mer", description: "Sachets d’épicerie gourmande Melp.atisse.", icon: ShoppingBag },
  { name: "Chamaillerie et cie", location: "Sautron", description: "Sachets de gourmandises Melp.atisse.", icon: ShoppingBag },
];

export default function Collaborations() {
  return <WarmPage eyebrow="RENCONTRES GOURMANDES" title="Melp.atisse" emphasis="près de chez vous." intro="Les adresses partenaires et les lieux où retrouver les gourmandises Melp.atisse." image="/images/traiteur-planche-festive.png" imageAlt="Création traiteur Melp.atisse pour une réception" cta="Découvrir les adresses">
    <span className="warm-eyebrow">OÙ RETROUVER MELP.ATISSE</span>
    <h2>Des gourmandises à <em>partager.</em></h2>
    <div className="collab-group">
      <div className="collab-group-heading"><ShoppingBag size={21}/><div><h3>Points de vente</h3><p>Les adresses où retrouver les créations et sachets gourmands.</p></div></div>
      <div className="warm-cards collab-cards">{places.map(({name,location,description,icon:Icon})=><article className="warm-card" key={name}><Icon color="#951b46"/><h3>{name}</h3><p className="collab-location"><MapPin size={15}/>{location}</p><p>{description}</p><span className="collab-pending">Lien et détails à confirmer</span></article>)}</div>
    </div>
    <div className="collab-group">
      <div className="collab-group-heading"><Utensils size={21}/><div><h3>Restaurant partenaire</h3><p>Les collaborations professionnelles autour des desserts.</p></div></div>
      <div className="warm-cards collab-cards"><article className="warm-card"><Utensils color="#951b46"/><h3>Les Piafs</h3><p>Desserts réalisés en collaboration avec Mélissa.</p><span className="collab-pending">Adresse et lien à confirmer</span></article></div>
    </div>
    <div className="collab-group">
      <div className="collab-group-heading"><Sparkles size={21}/><div><h3>Partenaire des ateliers</h3><p>Un rendez-vous gourmand chaque premier samedi du mois à Savenay.</p></div></div>
      <div className="warm-cards collab-cards"><article className="warm-card"><MapPin color="#951b46"/><h3>C’est moi qui l’ai fait</h3><p>Thèmes et réservations des ateliers sur le site partenaire.</p><a className="warm-cta" href="https://cmqlf.com/categorie/boutique-cest-moi-qui-lai-fait/ateliers-cuisine/" target="_blank" rel="noreferrer">Voir le programme et réserver <ArrowRight size={15}/></a></article></div>
    </div>
    <div className="warm-note">Les adresses et catégories sont intégrées. Les liens des points de vente, leurs produits précis et les informations complémentaires seront ajoutés après confirmation.</div>
    <p className="collab-contact">Vous souhaitez proposer une collaboration ? <Link href="/contact?prestation=Collaboration%20professionnelle">Écrire à Mélissa <ArrowRight size={15}/></Link></p>
  </WarmPage>;
}
