import { ArrowRight } from "lucide-react";
import WarmPage from "@/components/WarmPage";

export default function Ateliers() {
  return (
    <WarmPage
      eyebrow="ATELIERS DE PÂTISSERIE"
      title="On met la main"
      emphasis="à la pâte ?"
      intro="Des ateliers de pâtisserie pour enfants et adultes, chez vous, sur demande et sur devis."
      image="/images/number-cake-choux.png"
      imageAlt="Number cake aux petits choux, une création pâtissière Melp.atisse"
      cta=""
    >
      <span className="warm-eyebrow">UN MOMENT À VOTRE RYTHME</span>
      <h2>Apprendre, créer et <em>se régaler.</em></h2>
      <p>Chaque séance est adaptée au groupe et au thème choisi. Indiquez vos disponibilités et votre lieu dans la demande pour recevoir une proposition et un devis.</p>
      <div className="warm-cards atelier-cards">
        <article className="warm-card">
          <h3>Chez vous</h3>
          <p>Ateliers privés pour enfants et adultes, organisés sur demande après validation du lieu et des conditions d’accueil.</p>
        </article>
        <article className="warm-card">
          <h3>À Savenay</h3>
          <p>Les ateliers du premier samedi du mois se réservent sur le site de notre partenaire, C’est moi qui l’ai fait.</p>
          <a className="warm-cta" href="https://cmqlf.com/categorie/boutique-cest-moi-qui-lai-fait/ateliers-cuisine/" target="_blank" rel="noreferrer">Programme et réservations <ArrowRight size={15}/></a>
        </article>
      </div>
      <h2 style={{marginTop:70}}>Demande d’atelier</h2>
      <form className="warm-form" action="mailto:melp.atisse.contact@gmail.com" method="post" encType="text/plain">
        <div className="warm-form-grid">
          <label>VOTRE NOM<input name="Nom" autoComplete="name" required/></label>
          <label>VOTRE E-MAIL<input type="email" name="Email" autoComplete="email" required/></label>
          <label>DATE SOUHAITÉE<input type="date" name="Date souhaitée" required/></label>
          <label>ÂGE(S) DES PARTICIPANTS<input name="Âges" placeholder="Ex. enfants de 8 à 12 ans" required/></label>
          <label>NOMBRE DE PARTICIPANTS<input type="number" name="Participants" min="1" required/></label>
          <label>LIEU DE L’ATELIER<input name="Lieu" placeholder="Commune et adresse" required/></label>
          <label className="wide">THÈME ENVISAGÉ<textarea name="Thème" rows={4} placeholder="Vos envies, le niveau, les éventuelles allergies…" required/></label>
        </div>
        <button className="warm-button" type="submit">Préparer ma demande <ArrowRight size={15}/></button>
        <div className="warm-note">Votre demande s’ouvre dans votre messagerie et sera confirmée après échange avec Mélissa et validation du devis.</div>
      </form>
    </WarmPage>
  );
}
