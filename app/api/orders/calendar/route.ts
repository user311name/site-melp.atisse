import { isAdminPassword } from "@/lib/site-content";
import { listOrders } from "@/lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toUtc(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);
  const localAsUtc = Date.UTC(year, month - 1, day, hours, minutes);
  const offsetText = new Intl.DateTimeFormat("en", { timeZone: "Europe/Paris", timeZoneName: "shortOffset" })
    .formatToParts(new Date(localAsUtc)).find(part => part.type === "timeZoneName")?.value ?? "GMT+1";
  const offset = offsetText.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  const offsetMinutes = offset ? (offset[1] === "+" ? 1 : -1) * (Number(offset[2]) * 60 + Number(offset[3] ?? 0)) : 60;
  return new Date(localAsUtc - offsetMinutes * 60_000).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function escapeIcs(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

export async function GET(request: Request) {
  if (!isAdminPassword(request.headers.get("x-melp-admin-password"))) {
    return Response.json({ error: "Accès administrateur refusé." }, { status: 401 });
  }

  const parisToday = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const orders = (await listOrders()).filter(order => order.status === "confirmed" && order.date && order.date >= parisToday);
  const now = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const events = orders.map(order => {
    const allDay = order.kind === "special" && !order.time;
    const start = allDay ? order.date!.replace(/-/g, "") : toUtc(order.date!, order.time!);
    const end = allDay
      ? new Date(Date.parse(`${order.date}T00:00:00.000Z`) + 24 * 60 * 60_000).toISOString().slice(0, 10).replace(/-/g, "")
      : new Date(Date.parse(`${start.slice(0, 4)}-${start.slice(4, 6)}-${start.slice(6, 8)}T${start.slice(9, 11)}:${start.slice(11, 13)}:00Z`) + 10 * 60_000).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
    const dates = allDay ? [`DTSTART;VALUE=DATE:${start}`, `DTEND;VALUE=DATE:${end}`] : [`DTSTART:${start}`, `DTEND:${end}`];
    const summary = order.kind === "special" ? "Demande particulière confirmée · Melp.atisse" : "Retrait confirmé · Melp.atisse";
    return ["BEGIN:VEVENT", `UID:${order.id}@melp.atisse`, `DTSTAMP:${now}`, ...dates, `SUMMARY:${summary}`, `DESCRIPTION:${escapeIcs(`Commande ${order.id.slice(0, 8).toUpperCase()}`)}`, "LOCATION:La Plaine-sur-Mer", "END:VEVENT"].join("\r\n");
  });
  const body = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Melp.atisse//Calendrier des retraits//FR", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", ...events, "END:VCALENDAR", ""].join("\r\n");
  return new Response(body, { headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": "attachment; filename=melp-atisse-retraits-confirmes.ics", "Cache-Control": "no-store, private" } });
}
