import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { readSiteContent } from "@/lib/site-content";

export type PickupOrder = {
  id: string; kind: "pickup" | "special"; status: "held" | "awaiting_confirmation" | "confirmed" | "completed" | "cancelled";
  createdAt: string; holdExpiresAt?: string; date?: string; time?: string; name: string; email: string; phone: string; products: string; notes: string; amount?: number; paymentStatus: "not_paid" | "paid" | "refunded";
};

const file = path.join(process.cwd(), "data", "orders.json");
const lock = path.join(process.cwd(), "data", "orders.lock");
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function exclusive<T>(work: () => Promise<T>): Promise<T> {
  await mkdir(path.dirname(file), { recursive: true });
  let acquired = false;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try { await mkdir(lock); acquired = true; break; } catch { await delay(50); }
  }
  if (!acquired) throw new Error("Le registre des commandes est occupé.");
  try { return await work(); } finally { await rm(lock, { recursive: true, force: true }); }
}

async function readUnlocked(): Promise<PickupOrder[]> {
  try {
    const orders = JSON.parse(await readFile(file, "utf8")) as PickupOrder[];
    return orders.filter(order => !order.holdExpiresAt || Date.parse(order.holdExpiresAt) > Date.now() || order.status !== "held");
  } catch { return []; }
}

async function writeUnlocked(orders: PickupOrder[]) {
  const temp = `${file}.tmp`;
  await writeFile(temp, JSON.stringify(orders, null, 2), "utf8");
  await rename(temp, file);
}

export async function listOrders() { return exclusive(readUnlocked); }

function validPickup(date: string, time: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return false;
  const parsedDate = new Date(`${date}T12:00:00.000Z`);
  if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date) return false;
  const day = new Date(`${date}T12:00:00Z`).getUTCDay();
  const [hours, minutes] = time.split(":").map(Number);
  if (hours > 23 || minutes > 59) return false;
  const minute = hours * 60 + minutes;
  return (day === 5 && minute >= 960 && minute < 1140 || day === 6 && minute >= 540 && minute < 840) && minutes % 10 === 0;
}

export async function createHold(date: string, time: string) {
  if (!validPickup(date, time)) throw new Error("Choisis un horaire de retrait valide, le vendredi ou le samedi.");
  const parisDate = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const minDate = new Date(`${parisDate}T12:00:00Z`);
  minDate.setUTCDate(minDate.getUTCDate() + 4);
  if (date < minDate.toISOString().slice(0, 10)) throw new Error("Le retrait doit être demandé au moins quatre jours à l’avance.");
  const schedule = (await readSiteContent()).schedule;
  if (schedule.closedDates.includes(date)) throw new Error("Aucun retrait n’est ouvert à cette date.");
  return exclusive(async () => {
    const orders = await readUnlocked();
    if (schedule.maxOrdersPerDay !== null) {
      const count = orders.filter(order => order.date === date && (order.status === "confirmed" || order.status === "awaiting_confirmation" || order.status === "held" && Date.parse(order.holdExpiresAt ?? "") > Date.now())).length;
      if (count >= schedule.maxOrdersPerDay) throw new Error("La capacité de production de cette date est atteinte.");
    }
    const occupied = orders.some(order => order.date === date && order.time === time && (order.status === "confirmed" || order.status === "awaiting_confirmation" || order.status === "held" && Date.parse(order.holdExpiresAt ?? "") > Date.now()));
    if (occupied) throw new Error("Ce créneau vient d’être retenu. Choisis-en un autre.");
    const now = new Date();
    const order: PickupOrder = { id: randomUUID(), kind: "pickup", status: "held", createdAt: now.toISOString(), holdExpiresAt: new Date(now.getTime() + 10 * 60_000).toISOString(), date, time, name: "", email: "", phone: "", products: "", notes: "", paymentStatus: "not_paid" };
    orders.push(order); await writeUnlocked(orders); return order;
  });
}

export async function submitOrder(input: { holdId?: string; kind: "pickup" | "special"; specialDate?: string; specialTime?: string; name: string; email: string; phone: string; products: string; notes: string }) {
  if (![input.name, input.email, input.phone, input.products].every(value => value.trim())) throw new Error("Complète les coordonnées et le détail de la commande.");
  const specialDate = input.specialDate?.trim() ?? "";
  const specialTime = input.specialTime?.trim() ?? "";
  if (input.kind === "special") {
    const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(specialDate) ? new Date(`${specialDate}T00:00:00.000Z`) : null;
    if (!parsedDate || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== specialDate) throw new Error("Indique une date souhaitée valide pour ta demande particulière.");
    const parisToday = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
    if (specialDate < parisToday) throw new Error("La date souhaitée ne peut pas être déjà passée.");
    if (specialTime && (!/^\d{2}:\d{2}$/.test(specialTime) || Number(specialTime.slice(0, 2)) > 23 || Number(specialTime.slice(3, 5)) > 59)) throw new Error("Indique une heure souhaitée valide.");
  }
  return exclusive(async () => {
    const orders = await readUnlocked();
    let order = input.kind === "pickup" ? orders.find(entry => entry.id === input.holdId && entry.status === "held" && Date.parse(entry.holdExpiresAt ?? "") > Date.now()) : undefined;
    if (input.kind === "pickup" && !order) throw new Error("Le créneau a expiré. Choisis à nouveau un horaire.");
    if (!order) { order = { id: randomUUID(), kind: "special", status: "awaiting_confirmation", createdAt: new Date().toISOString(), date: input.kind === "special" ? specialDate : undefined, time: input.kind === "special" && specialTime ? specialTime : undefined, name: "", email: "", phone: "", products: "", notes: "", paymentStatus: "not_paid" }; orders.push(order); }
    Object.assign(order, { status: "awaiting_confirmation" as const, holdExpiresAt: undefined, name: input.name.trim().slice(0, 120), email: input.email.trim().slice(0, 200), phone: input.phone.trim().slice(0, 50), products: input.products.trim().slice(0, 3000), notes: input.notes.trim().slice(0, 3000) });
    await writeUnlocked(orders); return order;
  });
}

export async function updateOrder(id: string, status: PickupOrder["status"]) {
  const schedule = (await readSiteContent()).schedule;
  return exclusive(async () => {
    const orders = await readUnlocked();
    const order = orders.find(entry => entry.id === id);
    if (!order || status === "held") return null;
    if (status === "confirmed" && order.date) {
      const active = orders.filter(entry => entry.id !== id && entry.date === order.date && (entry.status === "confirmed" || entry.status === "awaiting_confirmation" || entry.status === "held" && Date.parse(entry.holdExpiresAt ?? "") > Date.now()));
      if (schedule.maxOrdersPerDay !== null && active.length >= schedule.maxOrdersPerDay) throw new Error("La capacité de production est atteinte pour cette date. Vérifie les autres demandes avant de confirmer.");
      if (order.time && active.some(entry => entry.time === order.time)) throw new Error("Un autre retrait ou une demande en attente occupe déjà ce créneau.");
    }
    order.status = status; await writeUnlocked(orders); return order;
  });
}

export async function releaseHold(id: string) {
  return exclusive(async () => { const orders = await readUnlocked(); await writeUnlocked(orders.filter(order => !(order.id === id && order.status === "held"))); });
}
