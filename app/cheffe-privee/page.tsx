"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ChefHat, Mail } from "lucide-react";
import Header from "@/components/Header";
import "./page.css";

const CHEFFE_IMAGE = "data:image/jpeg;base64,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";

const experiences = [
  { number: "01", title: "Dîner privé", text: "Un menu imaginé pour vous, chez vous, autour de vos envies.", image: "/images/traiteur-planche-festive.png" },
  { number: "02", title: "Brunch", text: "Une table généreuse et élégante pour partager un moment gourmand.", image: "/images/verrines-radis.png" },
  { number: "03", title: "Réception", text: "Cocktails, repas et menus sur mesure pour vos événements.", image: "/images/number-cake-fruits-rouges.png" },
];

const steps = [
  { number: "01", title: "Échanger", text: "Vos envies, vos invités et votre occasion." },
  { number: "02", title: "Imaginer", text: "Un menu pensé spécialement pour votre moment." },
  { number: "03", title: "Cuisiner", text: "Je prépare, dresse et vous laissez profiter." },
];

function TiltCard({ children }: { children: React.ReactNode }) {
  const [transform, setTransform] = useState("perspective(1100px) rotateX(0) rotateY(0) translateY(0)");
  return (
    <div className="tilt-card" style={{ transform }} onMouseMove={(e) => {
      const r = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      setTransform(`perspective(1100px) rotateX(${-y * 4}deg) rotateY(${x * 5}deg) translateY(-5px)`);
    }} onMouseLeave={() => setTransform("perspective(1100px) rotateX(0) rotateY(0) translateY(0)")}>
      {children}
    </div>
  );
}

export default function CheffePrivee() {
  return (
    <main className="chef-page">
      <Header />

      <section className="simple-hero">
        <div className="hero-glow" />
        <div className="hero-copy">
          <span className="eyebrow"><ChefHat size={14} /> TRAITEUR & CHEFFE PRIVÉE</span>
          <h1>La cuisine<br /><em>chez vous.</em></h1>
          <p>Une expérience culinaire sur mesure, directement chez vous.</p>
          <Link href="/contact" className="main-button">Imaginer mon expérience <ArrowRight size={15} /></Link>
        </div>
        <div className="hero-photo">
          <img src={CHEFFE_IMAGE} alt="La cheffe MELP.ATISSE en cuisine" />
          <span>01 / EN CUISINE</span>
          <div className="hero-badge">M<small>MELP.ATISSE</small></div>
        </div>
        <div className="hero-bottom"><span>LA PLAINE-SUR-MER</span><span>CUISINE PRIVÉE</span></div>
      </section>

      <section className="experiences-section">
        <div className="section-intro"><span>02 / EXPÉRIENCES</span><h2>Une table<br /><em>pour chaque moment.</em></h2></div>
        <div className="experience-grid">
          {experiences.map((item) => (
            <TiltCard key={item.number}>
              <article className="experience-card">
                <div className="experience-image"><img src={item.image} alt={item.title} /><span>{item.number}</span><div className="card-arrow"><ArrowRight size={16} /></div></div>
                <div className="experience-copy"><small>{item.title}</small><h3>{item.title}</h3><p>{item.text}</p><Link href="/contact">Découvrir <ArrowRight size={13} /></Link></div>
              </article>
            </TiltCard>
          ))}
        </div>
      </section>

      <section className="chef-section">
        <div className="chef-image"><img src={CHEFFE_IMAGE} alt="La cheffe MELP.ATISSE" /><span>03</span></div>
        <div className="chef-content"><span>LE SAVOIR-FAIRE</span><h2>Une cuisine<br /><em>vivante.</em></h2><p className="lead">Je ne propose pas simplement un menu. Je crée une expérience autour de vous.</p><p>Produits de saison, préparation sur place et détails soignés.</p><Link href="/contact" className="outline-button">Construire mon menu <ArrowRight size={15} /></Link></div>
      </section>

      <section className="process-section">
        <div className="section-intro center"><span>04 / LE DÉROULÉ</span><h2>Simple.<br /><em>Sur mesure.</em></h2></div>
        <div className="process-grid">
          {steps.map((step) => <TiltCard key={step.number}><article className="process-card"><div><span>{step.number}</span><ArrowRight size={16} /></div><h3>{step.title}</h3><p>{step.text}</p></article></TiltCard>)}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-orbit cta-orbit-one" />
        <div className="cta-orbit cta-orbit-two" />

        <div className="invitation-card">
          <div className="invitation-inner">
            <div className="invitation-top">
              <span>CUISINE PRIVÉE</span>
              <span>07</span>
            </div>

            <div className="invitation-content">
              <div className="invitation-brand">MELP<i>.ATISSE</i></div>
              <div className="seal">M</div>
              <span className="invitation-kicker">UNE TABLE · UNE HISTOIRE</span>
              <h2>Votre prochaine<br /><em>soirée commence ici.</em></h2>
              <p>Un moment pensé pour vous.</p>
              <Link href="/contact" className="cta-button">Demander un devis <ArrowRight size={15} /></Link>
            </div>

            <div className="invitation-bottom">
              <span>LA PLAINE-SUR-MER</span>
              <span>AVEC INTENTION</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer"><div className="footer-brand">MELP<i>.ATISSE</i><small>Pâtisserie artisanale & cuisine privée.</small></div><div className="footer-links"><Link href="/">Accueil</Link><Link href="/patisserie">Pâtisserie</Link><Link href="/cheffe-privee">Cheffe privée</Link><Link href="/contact">Contact</Link></div><small>© 2026 MELP.ATISSE · La Plaine-sur-Mer</small></footer>
    </main>
  );
}
