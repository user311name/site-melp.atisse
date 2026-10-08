"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";

export default function AtelierInquiryForm() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    setSending(true);
    setSent(false);
    setError("");
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "atelier",
          name: fields.get("name"),
          email: fields.get("email"),
          requestedDate: fields.get("date"),
          participants: fields.get("participants"),
          location: fields.get("location"),
          request: "Atelier de pâtisserie",
          details: `Âge(s) des participants : ${fields.get("ages")}\nThème et précisions : ${fields.get("theme")}`,
          website: fields.get("website"),
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.error || "Votre demande n’a pas pu être enregistrée. Réessayez.");
      form.reset();
      setSent(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Votre demande n’a pas pu être enregistrée. Réessayez.");
    } finally {
      setSending(false);
    }
  }

  return <form className="warm-form" onSubmit={submit}>
    <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1 }} />
    <div className="warm-form-grid">
      <label>VOTRE NOM<input name="name" autoComplete="name" required/></label>
      <label>VOTRE E-MAIL<input type="email" name="email" autoComplete="email" required/></label>
      <label>DATE SOUHAITÉE<input type="date" name="date" required/></label>
      <label>ÂGE(S) DES PARTICIPANTS<input name="ages" placeholder="Ex. enfants de 8 à 12 ans" required/></label>
      <label>NOMBRE DE PARTICIPANTS<input type="number" name="participants" min="1" required/></label>
      <label>LIEU DE L’ATELIER<input name="location" placeholder="Commune et adresse" required/></label>
      <label className="wide">THÈME ENVISAGÉ<textarea name="theme" rows={4} placeholder="Vos envies, le niveau, les éventuelles allergies…" required/></label>
    </div>
    <button className="warm-button" type="submit" disabled={sending}>{sending ? "Envoi en cours…" : sent ? "Demande envoyée" : "Envoyer ma demande"}{sent ? <Check size={15}/> : <ArrowRight size={15}/>}</button>
    <div className="warm-note" role={error ? "alert" : sent ? "status" : undefined}>{error || (sent ? "Votre demande a bien été transmise à Mélissa et apparaît dans le suivi de l’administration. Elle vous répondra après étude." : "Votre demande sera enregistrée dans l’administration et confirmée après échange avec Mélissa et validation du devis.")}</div>
  </form>;
}
