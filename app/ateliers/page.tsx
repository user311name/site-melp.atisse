import WarmPage from "@/components/WarmPage";
import ManagedPageSections from "@/components/ManagedPageSections";
import AtelierInquiryForm from "./AtelierInquiryForm";

export default function Ateliers() {
  return (
    <WarmPage
      eyebrow="ATELIERS DE PÂTISSERIE"
      title="On met la main"
      emphasis="à la pâte ?"
      intro="Des ateliers de pâtisserie pour enfants et adultes, chez vous, sur demande et sur devis."
      image="/images/number-cake-choux.png"
      imageAlt="Number cake aux petits choux, création Melp.atisse"
      cta=""
      includeManagedSections={false}
    >
      <span className="warm-eyebrow">UN MOMENT À VOTRE RYTHME</span>
      <h2>Apprendre, créer et <em>se régaler.</em></h2>
      <p>Chaque séance est adaptée au groupe et au thème choisi. Indiquez vos disponibilités et votre lieu dans la demande pour recevoir une proposition et un devis.</p>
      <ManagedPageSections pageKey="ateliers" />
      <h2 style={{marginTop:70}}>Demande d’atelier</h2>
      <AtelierInquiryForm />
    </WarmPage>
  );
}
