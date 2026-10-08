"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import type { SiteContent } from "@/lib/site-content";

type Schedule = SiteContent["schedule"];
const weekdays = [
  { label: "Lundi", short: "Lun", value: 1 }, { label: "Mardi", short: "Mar", value: 2 },
  { label: "Mercredi", short: "Mer", value: 3 }, { label: "Jeudi", short: "Jeu", value: 4 },
  { label: "Vendredi", short: "Ven", value: 5 }, { label: "Samedi", short: "Sam", value: 6 },
  { label: "Dimanche", short: "Dim", value: 0 },
];

function dateKey(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
function displayDate(date: string) { return new Date(`${date}T12:00:00Z`).toLocaleDateString("fr-FR", { timeZone: "UTC", dateStyle: "long" }); }

export default function ScheduleAdmin({ schedule, onCapacity, onClosedDates, onOpenDates, onClosedRanges, onClosedWeekdays, onCapacityOverrides }: {
  schedule: Schedule;
  onCapacity: (value: number | null) => void;
  onClosedDates: (value: string[]) => void;
  onOpenDates: (value: string[]) => void;
  onClosedRanges: (value: Schedule["closedRanges"]) => void;
  onClosedWeekdays: (value: number[]) => void;
  onCapacityOverrides: (value: Schedule["capacityOverrides"]) => void;
}) {
  const today = dateKey(new Date());
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [capacityDraft, setCapacityDraft] = useState("");
  const closedDates = useMemo(() => [...new Set(schedule.closedDates)].sort(), [schedule.closedDates]);
  const capacityOverrides = useMemo(() => [...schedule.capacityOverrides].sort((a, b) => a.date.localeCompare(b.date)), [schedule.capacityOverrides]);
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const monthLabel = visibleMonth.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  const firstOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarCells = [...Array(firstOffset).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)];

  function isClosed(date: string) {
    if (schedule.openDates.includes(date)) return false;
    const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
    return schedule.closedDates.includes(date) || schedule.closedRanges.some(range => date >= range.start && date <= range.end) || schedule.closedWeekdays.includes(weekday) || schedule.capacityOverrides.some(item => item.date === date && item.maxOrders === 0);
  }

  function toggleDate(date: string) { setSelectedDates(current => current.includes(date) ? current.filter(item => item !== date) : [...current, date].sort()); }

  function blockSelected() {
    const selected = new Set(selectedDates);
    onClosedDates([...new Set([...closedDates, ...selectedDates])].sort());
    onOpenDates(schedule.openDates.filter(date => !selected.has(date)));
  }

  function reopenSelected() {
    const selected = new Set(selectedDates);
    onClosedDates(closedDates.filter(date => !selected.has(date)));
    onOpenDates([...new Set([...schedule.openDates, ...selectedDates])].sort());
    onCapacityOverrides(capacityOverrides.filter(item => !selected.has(item.date) || item.maxOrders > 0));
  }

  function addRange() {
    if (!rangeStart || !rangeEnd || rangeEnd < rangeStart) return;
    const ranges = [...schedule.closedRanges, { start: rangeStart, end: rangeEnd }].sort((a, b) => a.start.localeCompare(b.start));
    const merged: Schedule["closedRanges"] = [];
    for (const range of ranges) {
      const last = merged[merged.length - 1];
      if (last && range.start <= last.end) last.end = range.end > last.end ? range.end : last.end;
      else merged.push({ ...range });
    }
    onClosedRanges(merged);
    onOpenDates(schedule.openDates.filter(date => date < rangeStart || date > rangeEnd));
    setRangeStart(""); setRangeEnd("");
  }

  function applyCapacity() {
    if (!selectedDates.length || capacityDraft === "") return;
    const limit = Number(capacityDraft);
    if (!Number.isInteger(limit) || limit < 0 || limit > 100) return;
    const selected = new Set(selectedDates);
    onCapacityOverrides([...capacityOverrides.filter(item => !selected.has(item.date)), ...selectedDates.map(date => ({ date, maxOrders: limit }))].sort((a, b) => a.date.localeCompare(b.date)));
    const recurringOrRangedClosures = selectedDates.filter(date => schedule.closedDates.includes(date) || schedule.closedRanges.some(range => date >= range.start && date <= range.end) || schedule.closedWeekdays.includes(new Date(`${date}T12:00:00Z`).getUTCDay()));
    onOpenDates(limit > 0 ? [...new Set([...schedule.openDates, ...recurringOrRangedClosures])].sort() : schedule.openDates.filter(date => !selected.has(date)));
  }

  function clearCapacityForSelected() {
    const selected = new Set(selectedDates);
    onCapacityOverrides(capacityOverrides.filter(item => !selected.has(item.date)));
  }

  function toggleWeekday(value: number) {
    onClosedWeekdays(schedule.closedWeekdays.includes(value) ? schedule.closedWeekdays.filter(day => day !== value) : [...schedule.closedWeekdays, value]);
  }

  return <section className="admin-panel schedule-admin">
    <div className="schedule-admin-heading"><div><h2>Calendrier des commandes</h2><p>Bloquez une date, une période ou un jour récurrent. Les retraits habituels sont le vendredi de 16 h à 19 h et le samedi de 9 h à 14 h. Les demandes particulières restent des demandes à valider manuellement.</p></div><span>Enregistrez la page d’administration pour appliquer les changements.</span></div>

    <div className="admin-fields schedule-general-settings">
      <label>Commandes maximum par jour<input type="number" min="0" max="100" step="1" value={schedule.maxOrdersPerDay ?? ""} onChange={event => onCapacity(event.target.value === "" ? null : Number(event.target.value))}/><small>Cette limite s’applique chaque jour. Saisissez 0 pour bloquer tous les retraits habituels ; laissez vide pour ne pas définir de limite globale.</small></label>
    </div>

    <div className="schedule-calendar-panel">
      <div className="schedule-calendar-heading"><div><span className="warm-eyebrow">SÉLECTION MULTIPLE</span><h3>Bloquer ou régler des dates</h3><p>Cliquez sur plusieurs jours, puis choisissez une action.</p></div><div className="schedule-month-nav"><button type="button" onClick={() => setVisibleMonth(new Date(year, month - 1, 1))} aria-label="Mois précédent"><ChevronLeft size={17}/></button><strong>{monthLabel}</strong><button type="button" onClick={() => setVisibleMonth(new Date(year, month + 1, 1))} aria-label="Mois suivant"><ChevronRight size={17}/></button></div></div>
      <div className="schedule-calendar-grid" role="group" aria-label={`Calendrier ${monthLabel}`}>
        {weekdays.map(day => <span className="schedule-weekday" key={day.value}>{day.short}</span>)}
        {calendarCells.map((day, index) => {
          if (!day) return <span className="schedule-calendar-blank" key={`blank-${index}`}/>;
          const date = dateKey(new Date(year, month, day));
          const closed = isClosed(date);
          const selected = selectedDates.includes(date);
          const override = schedule.capacityOverrides.find(item => item.date === date);
          const past = date < today;
          const label = `${displayDate(date)}${closed ? ", bloquée" : ""}${override ? `, maximum ${override.maxOrders} commandes` : ""}`;
          return <button className={`schedule-day${closed ? " is-closed" : ""}${selected ? " is-selected" : ""}${past ? " is-past" : ""}`} type="button" key={date} disabled={past} aria-label={label} aria-pressed={selected} title={label} onClick={() => toggleDate(date)}><strong>{day}</strong>{closed && <i aria-hidden="true"/>}{override && <small>{override.maxOrders === 0 ? "Fermé" : `Max ${override.maxOrders}`}</small>}</button>;
        })}
      </div>
      <div className="schedule-selection-summary">{selectedDates.length ? <><strong>{selectedDates.length} date{selectedDates.length > 1 ? "s" : ""} choisie{selectedDates.length > 1 ? "s" : ""}</strong><button type="button" className="schedule-reopen" onClick={() => setSelectedDates([])}>Effacer la sélection</button></> : <span>Aucune date sélectionnée.</span>}</div>
      <div className="schedule-bulk-actions">
        <button type="button" className="admin-secondary" disabled={!selectedDates.length} onClick={blockSelected}>Bloquer les dates choisies</button>
        <button type="button" className="admin-secondary" disabled={!selectedDates.length} onClick={reopenSelected}>Rouvrir les dates choisies</button>
      </div>
      <div className="schedule-capacity-editor"><label>Maximum pour les dates choisies<input type="number" min="0" max="100" step="1" value={capacityDraft} onChange={event => setCapacityDraft(event.target.value)} placeholder="Ex. 3"/></label><button type="button" className="admin-secondary" disabled={!selectedDates.length || capacityDraft === ""} onClick={applyCapacity}>Appliquer la limite</button><button type="button" className="schedule-reopen" disabled={!selectedDates.length} onClick={clearCapacityForSelected}>Retirer la limite particulière</button><small>0 ferme le retrait pour ces dates. Une limite particulière remplace la limite générale.</small></div>
    </div>

    <div className="schedule-rules-grid">
      <div className="schedule-rule-card"><h3>Bloquer une période</h3><p>Choisissez le premier et le dernier jour ; toutes les dates comprises seront fermées.</p><div className="schedule-range-inputs"><label>Du<input type="date" min={today} value={rangeStart} onChange={event => setRangeStart(event.target.value)}/></label><label>Au<input type="date" min={rangeStart || today} value={rangeEnd} onChange={event => setRangeEnd(event.target.value)}/></label></div><button type="button" className="admin-secondary" disabled={!rangeStart || !rangeEnd || rangeEnd < rangeStart} onClick={addRange}><CalendarDays size={15}/> Bloquer la période</button>{schedule.closedRanges.length > 0 && <ul className="schedule-rule-list">{schedule.closedRanges.map(range => <li key={`${range.start}-${range.end}`}><span>Du {displayDate(range.start)} au {displayDate(range.end)}</span><button type="button" className="schedule-reopen" onClick={() => onClosedRanges(schedule.closedRanges.filter(item => item.start !== range.start || item.end !== range.end))} aria-label="Supprimer cette période"><X size={15}/> Supprimer</button></li>)}</ul>}</div>

      <div className="schedule-rule-card"><h3>Bloquer chaque semaine</h3><p>Ces jours seront bloqués chaque semaine, sans date de fin. Vous pourrez rouvrir une date précise dans le calendrier.</p><div className="schedule-weekday-options">{weekdays.map(day => <label key={day.value}><input type="checkbox" checked={schedule.closedWeekdays.includes(day.value)} onChange={() => toggleWeekday(day.value)}/><span>{day.label}</span></label>)}</div></div>
    </div>

    {(closedDates.length > 0 || schedule.openDates.length > 0 || capacityOverrides.length > 0) && <div className="schedule-exceptions"><h3>Exceptions et limites par date</h3>{closedDates.length > 0 && <ul className="schedule-rule-list">{closedDates.map(date => <li key={`closed-${date}`}><span>Bloqué le {displayDate(date)}</span><button type="button" className="schedule-reopen" onClick={() => onClosedDates(closedDates.filter(item => item !== date))} aria-label={`Supprimer le blocage du ${date}`}><X size={15}/> Supprimer</button></li>)}</ul>}{schedule.openDates.length > 0 && <ul className="schedule-rule-list">{schedule.openDates.map(date => <li key={`open-${date}`}><span>Réouvert exceptionnellement le {displayDate(date)}</span><button type="button" className="schedule-reopen" onClick={() => onOpenDates(schedule.openDates.filter(item => item !== date))} aria-label={`Rétablir les règles du ${date}`}><X size={15}/> Rétablir règle</button></li>)}</ul>}{capacityOverrides.length > 0 && <ul className="schedule-rule-list">{capacityOverrides.map(item => <li key={`cap-${item.date}`}><span>{displayDate(item.date)} · maximum {item.maxOrders} commande{item.maxOrders > 1 ? "s" : ""}</span><button type="button" className="schedule-reopen" onClick={() => onCapacityOverrides(capacityOverrides.filter(entry => entry.date !== item.date))} aria-label={`Retirer la limite du ${item.date}`}><X size={15}/> Retirer</button></li>)}</ul>}</div>}
  </section>;
}
