"use client";

import { useEffect, useState } from "react";
import { Gift, Plus, RotateCcw } from "lucide-react";

type Member = { code: string; name: string; email: string; completedOrders: number; redeemedRewards: number };
type Status = { code: string; points: number; rewardsAvailable: number; completedOrders: number };

export default function FidelityAdmin({ password }: { password: string }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");

  async function refresh() {
    const response = await fetch("/api/loyalty", { method: "PATCH", headers: { "x-melp-admin-password": password }, cache: "no-store" });
    if (response.ok) setMembers(await response.json());
  }
  useEffect(() => { void refresh(); }, []);

  async function action(data: Record<string, string>) {
    const response = await fetch("/api/loyalty", { method: "POST", headers: { "Content-Type": "application/json", "x-melp-admin-password": password }, body: JSON.stringify(data) });
    const result = await response.json();
    if (!response.ok) { setNotice(result.error ?? "Une erreur est survenue."); return; }
    if (data.action === "create") setNotice(`Carte créée : ${result.member.code} · à transmettre à la cliente.`);
    else setNotice("Carte mise à jour.");
    await refresh();
  }

  return <section className="admin-loyalty"><div className="admin-products-heading"><div><span className="warm-eyebrow">RÉCOMPENSER LA FIDÉLITÉ</span><h2>Cartes de fidélité</h2><p>Cette rubrique n’est pas proposée aux clients pour le moment ; aucune récompense n’est promise.</p></div></div><form className="admin-member-create" onSubmit={event => { event.preventDefault(); void action({ action: "create", name, email }); setName(""); setEmail(""); }}><input aria-label="Nom de la cliente" placeholder="Nom de la cliente" value={name} onChange={event => setName(event.target.value)} required/><input aria-label="E-mail de la cliente" type="email" placeholder="E-mail (facultatif)" value={email} onChange={event => setEmail(event.target.value)}/><button type="submit"><Plus size={15}/> Créer sa carte</button></form>{notice && <p className="admin-loyalty-notice" role="status">{notice}</p>}<div className="admin-member-list">{members.map(member => { const status: Status = { code: member.code, points: member.completedOrders % 10, completedOrders: member.completedOrders, rewardsAvailable: Math.max(0, Math.floor(member.completedOrders / 10) - member.redeemedRewards) }; return <article className="admin-member" key={member.code}><div><strong>{member.name}</strong><span>{member.email || "Pas d’e-mail"} · Code <code>{member.code}</code></span></div><div className="admin-member-count">{status.points}/10 points <small>· {status.rewardsAvailable} cadeau(x) disponible(s)</small></div><div className="admin-member-actions"><button type="button" onClick={() => void action({ action: "stamp", code: member.code })}><Plus size={14}/> Ajouter 1 retrait</button><button type="button" disabled={!status.rewardsAvailable} onClick={() => void action({ action: "redeem", code: member.code })}><Gift size={14}/> Utiliser un cadeau</button></div></article>; })}{members.length === 0 && <p className="admin-empty">Aucune carte créée pour le moment.</p>}</div><button className="admin-refresh" type="button" onClick={() => void refresh()}><RotateCcw size={14}/> Actualiser</button></section>;
}
