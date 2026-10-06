import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import WarmPage from "@/components/WarmPage";

export default function Collaborations() {
  return <WarmPage eyebrow="RENCONTRES GOURMANDES" title="Melp.atisse" emphasis="près de chez vous." intro="Les rendez-vous, collaborations et points de retrait autour de La Plaine-sur-Mer et du Pays de Retz." image="/images/traiteur-planche-festive.png" imageAlt="Création traiteur Melp.atisse pour une réception" cta="Où me retrouver ?">
    <span className="warm-eyebrow">OÙ ME RETROUVER</span>
    <h2>Des gourmandises à <em>partager.</em></h2>
    <p>Les dates de marchés et les prochains événements seront annoncés ici et sur Instagram dès qu’ils sont confirmés.</p>
    <div className="warm-cards">
      <article className="warm-card"><MapPin color="#8c2943"/><h3>Retrait à La Plaine-sur-Mer</h3><p>6 rue Léon Fourneau<br/>44770 La Plaine-sur-Mer</p><p>Vendredi · 16 h–19 h<br/>Samedi · 9 h–14 h<br/>Commande au moins 4 jours à l’avance.</p><a className="warm-cta" href="https://maps.google.com/?q=6+rue+L%C3%A9on+Fourneau+44770+La+Plaine-sur-Mer" target="_blank" rel="noreferrer">Voir l’adresse <ArrowRight size={15}/></a></article>
      <article className="warm-card"><MapPin color="#8c2943"/><h3>Ateliers à Savenay</h3><p>Les ateliers du premier samedi du mois sont proposés avec C’est moi qui l’ai fait. Programme et réservations sur leur site.</p><a className="warm-cta" href="https://cmqlf.com/categorie/boutique-cest-moi-qui-lai-fait/ateliers-cuisine/" target="_blank" rel="noreferrer">Programme partenaire <ArrowRight size={15}/></a></article>
      <article className="warm-card"><MapPin color="#8c2943"/><h3>Professionnels</h3><p>Vous souhaitez accueillir des créations Melp.atisse ou imaginer une collaboration ? Écrivez directement à Mélissa.</p><Link className="warm-cta" href="/contact?prestation=Collaboration%20professionnelle">Proposer une collaboration <ArrowRight size={15}/></Link></article>
    </div>
    <div className="warm-note">Aucun autre lieu partenaire ni date de marché n’est encore renseigné. Les informations seront ajoutées dès confirmation pour éviter de publier un rendez-vous erroné.</div>
  </WarmPage>;
}
