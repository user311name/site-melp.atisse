"use client";

import { useState } from "react";
import { CalendarDays, X } from "lucide-react";
import type { SiteContent } from "@/lib/site-content";

export default function ScheduleAdmin({ schedule, onCapacity, onClosedDates }: { schedule: SiteContent["schedule"]; onCapacity: (value: number | null) => void; onClosedDates: (value: string[]) => void }) {
  const [dateToClose, setDateToClose] = useState("");
  const closedDates = [...new Set(schedule.closedDates)].sort();
  function addDate() {
    if (!dateToClose || closedDates.includes(dateToClose)) return;
    onClosedDates([...closedDates, dateToClose].sort());
    setDateToClose("");
  }
  return <section className="admin-panel">
    <h2>Calendrier et capacité</h2>
    <p>Les retraits habituels sont ouverts le vendredi de 16 h à 19 h et le samedi de 9 h à 14 h. Chaque demande reste à confirmer par Mélissa. Les dates ci-dessous bloquent les réservations habituelles.</p>
    <div className="admin-fields">
      <label>Commandes maximum par jour<input type="number" min="1" max="100" value={schedule.maxOrdersPerDay ?? ""} onChange={event => onCapacity(event.target.value ? Number(event.target.value) : null)}/><small>Laisse vide sans plafond quotidien. La confirmation des demandes reste manuelle.</small></label>
      <div className="schedule-closed-date admin-wide">
        <label htmlFor="schedule-date-close">Ajouter une date indisponible</label>
        <div><input id="schedule-date-close" type="date" value={dateToClose} onChange={event => setDateToClose(event.target.value)}/><button type="button" className="admin-secondary" onClick={addDate} disabled={!dateToClose || closedDates.includes(dateToClose)}><CalendarDays size={15}/> Bloquer cette date</button></div>
        {closedDates.length ? <ul>{closedDates.map(date => <li key={date}><time dateTime={date}>{new Date(`${date}T12:00:00Z`).toLocaleDateString("fr-FR", { timeZone: "UTC", dateStyle: "long" })}</time><button type="button" className="schedule-reopen" onClick={() => onClosedDates(closedDates.filter(item => item !== date))} aria-label={`Rouvrir le ${date}`}><X size={15}/> Rouvrir</button></li>)}</ul> : <small>Aucune date indisponible enregistrée.</small>}
      </div>
    </div>
  </section>;
}
