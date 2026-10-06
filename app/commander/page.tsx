"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowRight, Clock3 } from "lucide-react";
import WarmPage from "@/components/WarmPage";

type Hold = { id: string; holdExpiresAt: string };
function toIsoDate(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
function makeSlots(start: number, end: number) { return Array.from({ length: (end - start) / 10 }, (_, index) => { const minute = start + index * 10; return `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`; }); }

export default function Commander() {
  const [minimum, setMinimum] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [hold, setHold] = useState<Hold | null>(null);
  const [unavailable, setUnavailable] = useState<string[]>([]);
  const [creation, setCreation] = useState("");
  const [special, setSpecial] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const min = new Date(); min.setHours(12, 0, 0, 0); min.setDate(min.getDate() + 4); setMinimum(toIsoDate(min));
    setCreation(new URLSearchParams(window.location.search).get("creation") ?? "");
  }, []);

  useEffect(() => {
    if (!date || special) { setUnavailable([]); return; }
    fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "availability", date }) })
      .then(response => response.json()).then(data => { setUnavailable(Array.isArray(data.unavailable) ? data.unavailable : []); setMessage(data.message ?? ""); }).catch(() => setUnavailable([]));
  }, [date, special]);

  useEffect(() => {
    if (!hold) return;
    const release = () => { void fetch("/api/orders", { method: "POST", keepalive: true, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "release", holdId: hold.id }) }); };
    window.addEventListener("pagehide", release);
    return () => window.removeEventListener("pagehide", release);
  }, [hold]);

  const weekday = useMemo(() => date ? new Date(`${date}T12:00:00`).getDay() : -1, [date]);
  const slots = weekday === 5 ? makeSlots(16 * 60, 19 * 60) : weekday === 6 ? makeSlots(9 * 60, 14 * 60) : [];

  async function chooseSlot(value: string) {
    if (hold) void fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "release", holdId: hold.id }) });
    setSlot(""); setHold(null); setBusy(true); setMessage("");
    const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "hold", date, time: value }) });
    const result = await response.json();
    if (!response.ok) { setMessage(result.error ?? "Ce créneau n’est plus disponible."); setUnavailable(current => [...current, value]); }
    else { setSlot(value); setHold(result); }
    setBusy(false);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const formElement = event.currentTarget; setBusy(true); setMessage("");
    const form = new FormData(formElement);
    const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "submit", kind: special ? "special" : "pickup", holdId: hold?.id, name: form.get("name"), email: form.get("email"), phone: form.get("phone"), products: form.get("products"), notes: form.get("notes") }) });
    const result = await response.json();
    if (response.ok) { setMessage(`Demande enregistrée. Référence : ${result.id.slice(0, 8).toUpperCase()}. ${result.message}`); setHold(null); setSlot(""); formElement.reset(); setCreation(""); }
    else setMessage(result.error ?? "L’envoi a échoué. Réessaie.");
    setBusy(false);
  }

  function changeDate(value: string) {
    if (hold) void fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "release", holdId: hold.id }) });
    setHold(null); setSlot(""); setDate(value); setMessage("");
  }

  return <WarmPage eyebrow="COMMANDE À EMPORTER" title="Une douceur" emphasis="pour bientôt." intro="Envoyez votre demande de commande et choisissez un horaire de retrait à La Plaine-sur-Mer. Prévoir au moins quatre jours à l’avance." image="/images/number-cake-choux.png" imageAlt="Number cake aux petits choux réalisé par Melp.atisse" cta="Choisir mon retrait">
    <span className="warm-eyebrow">VENDREDI · 16 H À 19 H &nbsp; / &nbsp; SAMEDI · 9 H À 14 H</span>
    <h2>Votre demande, <em>en quelques détails.</em></h2>
    <div className="warm-note">Un horaire sélectionné est retenu pendant dix minutes. Toute demande doit être confirmée par Mélissa avant d’être définitive. Le paiement en ligne n’est pas encore activé.</div>
    <form className="warm-form" onSubmit={submit}>
      <div className="warm-form-grid">
        <label>VOTRE NOM<input name="name" autoComplete="name" required/></label>
        <label>VOTRE E-MAIL<input type="email" name="email" autoComplete="email" required/></label>
        <label>VOTRE TÉLÉPHONE<input type="tel" name="phone" autoComplete="tel" required/></label>
        <label className="wide"><span className="warm-eyebrow">TYPE DE DEMANDE</span><select value={special ? "special" : "pickup"} onChange={event => { const next = event.target.value === "special"; if (next && hold) void fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "release", holdId: hold.id }) }); setHold(null); setSlot(""); setSpecial(next); }}><option value="pickup">Retrait habituel · vendredi ou samedi</option><option value="special">Demande particulière · autre jour, urgence ou création sur mesure</option></select></label>
        {!special && <>
          <label>DATE DE RETRAIT<input type="date" name="date" min={minimum} value={date} onChange={event => changeDate(event.target.value)} required/><small>Au moins quatre jours à l’avance.</small></label>
          <label className="wide">CRÉNEAU DE RETRAIT <span><Clock3 size={14}/></span><div className="slot-grid">{slots.length ? slots.map(value => {const blocked = unavailable.includes(value) || unavailable.includes("__ALL__"); return <button key={value} type="button" disabled={busy || blocked} aria-pressed={slot === value} className={slot === value ? "slot-selected" : ""} onClick={() => void chooseSlot(value)}>{value}{unavailable.includes(value) ? " · réservé" : ""}</button>;}) : <small>Sélectionnez un vendredi ou un samedi admissible.</small>}</div>{hold && <small>Créneau retenu jusqu’à {new Date(hold.holdExpiresAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}.</small>}</label>
        </>}
        <label className="wide">CRÉATIONS, FORMATS ET QUANTITÉS<textarea name="products" value={creation} onChange={event => setCreation(event.target.value)} placeholder="Ex. 1 number cake fruits rouges, 10 parts" rows={3} required/></label>
        <label className="wide">ALLERGÈNES, PERSONNALISATION OU PRÉCISIONS<textarea name="notes" rows={3} placeholder="Indiquez les allergies et votre demande particulière."/></label>
      </div>
      <button className="warm-button" type="submit" disabled={busy || !special && !hold}>{busy ? "Envoi en cours…" : "Envoyer ma demande"} <ArrowRight size={15}/></button>
      {message && <div className="warm-note" role="status">{message}</div>}
      <div className="warm-note">Une demande de retrait ne vaut pas confirmation de commande. Mélissa vous recontactera pour vérifier la capacité de production et convenir du paiement.</div>
    </form>
  </WarmPage>;
}
