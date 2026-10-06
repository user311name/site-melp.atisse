import WarmPage from "@/components/WarmPage";
import FidelityCard from "./FidelityCard";

export default function Fidelite() {
  return <WarmPage eyebrow="LA FIDÉLITÉ MELP.ATISSE" title="Chaque douceur" emphasis="compte." intro="Un petit merci pour les habituées : dix commandes retirées, une douceur offerte." image="/images/gateau-framboises-fleurs.png" imageAlt="Gâteau fleuri aux framboises, une création Melp.atisse" cta="Voir ma carte"><span className="warm-eyebrow">VOTRE CARTE GOURMANDE</span><h2>Dix commandes, une <em>douceur offerte.</em></h2><p>Demande ta carte à Mélissa, puis saisis ton code ici pour retrouver tes commandes validées et tes cadeaux disponibles.</p><FidelityCard/><div className="warm-note">Une commande est ajoutée après son retrait. Le cadeau est à choisir parmi les douceurs proposées par Mélissa, selon les disponibilités.</div></WarmPage>;
}
