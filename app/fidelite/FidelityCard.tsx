"use client";

import { useState } from "react";
import { ArrowRight, Gift, Sparkles } from "lucide-react";

type CardData = { code: string; points: number; rewardsAvailable: number; completedOrders: number };

export default function FidelityCard() {
  const [code, setCode] = useState("");
  const [card, setCard] = useState<CardData | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function check(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setMessage(""); setCard(null);
    const response = await fetch(`/api/loyalty?code=${encodeURIComponent(code)}`, { cache: "no-store" });
    const result = await response.json();
    if (!response.ok) setMessage(result.error ?? "Carte introuvable.");
    else setCard(result);
    setLoading(false);
  }

  return <div className="fidelity-checker"><form className="fidelity-form" onSubmit={check}><label htmlFor="loyalty-code">Ton code de carte</label><div><input id="loyalty-code" value={code} onChange={event => setCode(event.target.value.toUpperCase())} placeholder="Ex. A1B2C3D4E5F60708" minLength={16} maxLength={36} required/><button type="submit" disabled={loading}>{loading ? "Vérification…" : <>Voir mes points <ArrowRight size={15}/></>}</button></div></form>{message && <p className="fidelity-error" role="status">{message}</p>}{card && <section className="fidelity-ticket" aria-live="polite"><div className="fidelity-ticket-top"><span>MELP<i>.ATISSE</i></span><span>CARTE GOURMANDE</span></div><h2>Les petites attentions<br/><em>se récompensent.</em></h2><p>Une douceur offerte à chaque série de dix commandes retirées.</p><div className="fidelity-stamps">{Array.from({ length: 10 }, (_, index) => <span key={index} className={index < card.points ? "is-stamped" : ""}>{index < card.points ? <Sparkles size={17}/> : String(index + 1).padStart(2, "0")}</span>)}</div><div className="fidelity-ticket-bottom"><strong>{card.points}/10 commandes validées</strong><span>Code · {card.code}</span></div>{card.rewardsAvailable > 0 && <div className="fidelity-reward"><Gift size={19}/>{card.rewardsAvailable === 1 ? "Une douceur t’attend !" : `${card.rewardsAvailable} douceurs t’attendent !`}</div>}</section>}</div>;
}
