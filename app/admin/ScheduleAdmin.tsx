"use client";

import type { SiteContent } from "@/lib/site-content";

export default function ScheduleAdmin({ schedule, onCapacity, onClosedDates }: { schedule: SiteContent["schedule"]; onCapacity: (value: number | null) => void; onClosedDates: (value: string[]) => void }) {
  return <section className="admin-panel"><h2>Calendrier et capacité</h2><p>Les dates fermées et le plafond quotidien sont appliqués à la réservation. Laissez le plafond vide si vous préférez valider chaque demande manuellement.</p><div className="admin-fields"><label>Commandes maximum par jour<input type="number" min="1" max="100" value={schedule.maxOrdersPerDay ?? ""} onChange={event => onCapacity(event.target.value ? Number(event.target.value) : null)}/></label><label className="admin-wide">Dates sans retrait (une date par ligne, format AAAA-MM-JJ)<textarea rows={5} value={schedule.closedDates.join("\n")} onChange={event => onClosedDates(event.target.value.split("\n").map(value => value.trim()).filter(Boolean))}/></label></div></section>;
}
