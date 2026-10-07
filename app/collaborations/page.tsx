import Link from "next/link";
import { ArrowRight } from "lucide-react";
import WarmPage from "@/components/WarmPage";

export default function Collaborations() {
  return <WarmPage eyebrow="RENCONTRES GOURMANDES" title="Melp.atisse" emphasis="près de chez vous." intro="Les adresses partenaires et les lieux où retrouver les gourmandises Melp.atisse." image="/images/traiteur-planche-festive.png" imageAlt="Création traiteur Melp.atisse pour une réception" cta="Découvrir les adresses">
    <span className="warm-eyebrow">OÙ RETROUVER MELP.ATISSE</span>
    <h2>Des gourmandises à <em>partager.</em></h2>
    <div className="warm-note">Les lieux sont présentés par catégorie. Les coordonnées et liens manquants pourront être ajoutés depuis l’administration dès qu’ils seront confirmés.</div>
    <p className="collab-contact">Vous souhaitez proposer une collaboration ? <Link href="/contact?prestation=Collaboration%20professionnelle">Écrire à Mélissa <ArrowRight size={15}/></Link></p>
  </WarmPage>;
}
