import Link from "next/link";
import { ArrowRight, CalendarDays, CakeSlice, Gift, MapPin, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import "./home.css";

const offers = [
  { title: "Pâtisseries", text: "Des créations de saison, façonnées à la main.", href: "/patisserie", icon: CakeSlice, image: "/images/gateau-framboises-fleurs.png" },
  { title: "Épicerie gourmande", text: "De petites douceurs à offrir ou à partager.", href: "/epicerie", icon: Gift, image: "/images/entremets-chocolat-noisettes.png" },
  { title: "Ateliers", text: "Un moment gourmand imaginé chez vous ou à Savenay.", href: "/ateliers", icon: Sparkles, image: "/images/number-cake-marin.png" },
];

export default function Home() {
  return <main className="melp-home">
    <Header />
    <section className="home-hero">
      <div className="home-hero-copy">
        <span className="home-kicker"><i /> Pâtissière · Traiteur · Cheffe privée</span>
        <h1>De la gourmandise<br />à <em>partager.</em></h1>
        <p>Des créations artisanales, de jolis moments autour d’une table et une attention portée à chaque détail.</p>
        <div className="home-actions"><Link className="home-button" href="/patisserie">Découvrir les créations <ArrowRight size={17}/></Link><Link className="home-text-link" href="/contact">Parler de votre projet <ArrowRight size={15}/></Link></div>
        <div className="home-pickup"><MapPin size={17}/><span>La Plaine-sur-Mer <b>·</b> Retrait vendredi et samedi</span></div>
      </div>
      <div className="home-hero-art"><img src="/images/number-cake-fruits-rouges.png" alt="Number cake décoré de fruits rouges et de fleurs, création Melp.atisse"/><div className="home-art-note"><span>FAIT AVEC CŒUR</span><strong>La petite touche<br/><em>qui change tout.</em></strong></div><span className="home-stamp">M<br/><small>ATELIER</small></span></div>
      <span className="home-sun" aria-hidden="true"/>
    </section>
    <div className="home-ribbon"><span>Fait maison</span><i>✳</i><span>De saison</span><i>✳</i><span>À partager</span><i>✳</i><span>Fait avec amour</span></div>
    <section className="home-offers" id="univers"><div className="home-section-heading"><div><span className="home-kicker">UN UNIVERS À DÉGUSTER</span><h2>Choisissez votre<br/><em>moment gourmand.</em></h2></div><p>Une pâtisserie à célébrer, une boîte à offrir ou un atelier à partager : chaque envie trouve sa place.</p></div>
      <div className="offer-grid">{offers.map(({title,text,href,icon:Icon,image},index)=><Link href={href} className={`offer-card offer-card-${index+1}`} key={title}><img src={image} alt=""/><div className="offer-card-shade"/><div className="offer-card-content"><span className="offer-icon"><Icon size={19}/></span><small>0{index+1} · MELP.ATISSE</small><h3>{title}</h3><p>{text}</p><b>Découvrir <ArrowRight size={15}/></b></div></Link>)}</div>
    </section>
    <section className="home-story"><div className="story-photo"><img src="/images/number-cake-tropical.png" alt="Number cake chocolaté au décor tropical, création Melp.atisse"/><span>La Plaine-sur-Mer · Pays de Retz</span></div><div className="story-copy"><span className="home-kicker">LE SAVOIR-FAIRE, TOUT SIMPLEMENT</span><h2>Des gestes précis,<br/>une âme <em>généreuse.</em></h2><p>Melp.atisse imagine des pâtisseries artisanales et des expériences gourmandes sur mesure. Des produits choisis avec soin, des idées qui prennent forme à l’atelier, et le plaisir de créer pour vos beaux moments.</p><Link className="home-text-link" href="/a-propos">Rencontrer Mélissa <ArrowRight size={15}/></Link><div className="story-signature">Mélissa <span>♡</span></div></div></section>
    <section className="home-services"><div><span className="home-kicker">POUR VOS JOLIS MOMENTS</span><h2>Du quotidien aux<br/><em>grandes occasions.</em></h2></div><div className="service-links"><Link href="/cheffe-privee"><span>01</span><div><strong>Traiteur & cheffe privée</strong><small>Une table imaginée chez vous, sur devis</small></div><ArrowRight size={18}/></Link><Link href="/ateliers"><span>02</span><div><strong>Ateliers pâtisserie</strong><small>Enfants et adultes · à domicile ou à Savenay</small></div><ArrowRight size={18}/></Link><Link href="/cartes-cadeaux"><span>03</span><div><strong>Cartes cadeaux</strong><small>Offrir un moment à savourer</small></div><ArrowRight size={18}/></Link><Link href="/collaborations"><span>04</span><div><strong>Collaborations & événements</strong><small>Rencontrer Melp.atisse près de chez vous</small></div><ArrowRight size={18}/></Link><Link href="/fidelite"><span>05</span><div><strong>Carte de fidélité</strong><small>10 commandes retirées · une douceur offerte</small></div><ArrowRight size={18}/></Link></div></section>
    <section className="home-pickup-band"><CalendarDays size={24}/><div><span>COMMANDES À EMPORTER</span><strong>On se retrouve à La Plaine-sur-Mer</strong><p>Vendredi 16 h–19 h · Samedi 9 h–14 h · Commande au moins 4 jours à l’avance</p></div><Link href="/commander">Préparer ma demande <ArrowRight size={15}/></Link></section>
    <footer className="home-footer"><Link href="/" className="home-wordmark">MELP<i>.ATISSE</i></Link><span>Pâtisserie artisanale · La Plaine-sur-Mer</span><div><Link href="/avis">Avis</Link><Link href="/contact">Contact</Link><a href="https://www.instagram.com/melp.atisse/" target="_blank" rel="noreferrer">Instagram</a></div><small>© 2026 Melp.atisse</small></footer>
  </main>;
}
