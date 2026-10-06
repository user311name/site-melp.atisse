import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export type LoyaltyMember = { code: string; name: string; email: string; completedOrders: number; redeemedRewards: number; creditedOrderIds?: string[] };
const file = path.join(process.cwd(), "data", "loyalty.json");

export async function readMembers(): Promise<LoyaltyMember[]> {
  try { return JSON.parse(await readFile(file, "utf8")) as LoyaltyMember[]; }
  catch { return []; }
}

export async function writeMembers(members: LoyaltyMember[]) {
  await mkdir(path.dirname(file), { recursive: true });
  const temporaryFile = `${file}.tmp`;
  await writeFile(temporaryFile, JSON.stringify(members, null, 2), "utf8");
  await rename(temporaryFile, file);
}

export function loyaltyStatus(member: LoyaltyMember) {
  const earned = Math.floor(member.completedOrders / 10);
  return { code: member.code, points: member.completedOrders % 10, rewardsAvailable: Math.max(0, earned - member.redeemedRewards), completedOrders: member.completedOrders };
}

export async function creditCompletedOrder(email: string, orderId: string) {
  if (!email) return false;
  const members = await readMembers();
  const member = members.find(item => item.email.toLowerCase() === email.toLowerCase());
  if (!member) return false;
  member.creditedOrderIds ??= [];
  if (member.creditedOrderIds.includes(orderId)) return false;
  member.creditedOrderIds.push(orderId);
  member.completedOrders += 1;
  await writeMembers(members);
  return true;
}
