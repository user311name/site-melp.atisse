import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { Redis } from "@upstash/redis";

export type SiteInquiry = {
  id: string;
  kind: "contact" | "atelier";
  status: "new" | "accepted" | "declined";
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  request: string;
  requestedDate: string;
  participants: string;
  occasion: string;
  location: string;
  details: string;
  decisionEmailSentAt?: string;
  decisionEmailId?: string;
};

const file = path.join(process.cwd(), "data", "inquiries.json");
const lock = path.join(process.cwd(), "data", "inquiries.lock");
const key = "melp:inquiries:v1";
const lockKey = "melp:inquiries:lock:v1";
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const redisConfigured = () => Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
const redis = () => new Redis({ url: process.env.UPSTASH_REDIS_REST_URL!, token: process.env.UPSTASH_REDIS_REST_TOKEN! });
export const inquiryStorageReady = () => redisConfigured() || process.env.VERCEL !== "1";

async function exclusive<T>(work: () => Promise<T>): Promise<T> {
  if (!inquiryStorageReady()) throw new Error("Le registre des demandes n’est pas configuré en production.");
  if (redisConfigured()) {
    const client = redis();
    const token = randomUUID();
    let acquired = false;
    for (let attempt = 0; attempt < 80; attempt += 1) {
      if (await client.set(lockKey, token, { nx: true, ex: 30 }) === "OK") { acquired = true; break; }
      await delay(50);
    }
    if (!acquired) throw new Error("Le registre des demandes est occupé. Réessaie dans quelques secondes.");
    try { return await work(); }
    finally { await client.eval("if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end", [lockKey], [token]); }
  }
  await mkdir(path.dirname(file), { recursive: true });
  let acquired = false;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try { await mkdir(lock); acquired = true; break; } catch { await delay(50); }
  }
  if (!acquired) throw new Error("Le registre des demandes est occupé.");
  try { return await work(); } finally { await rm(lock, { recursive: true, force: true }); }
}

async function readUnlocked(): Promise<SiteInquiry[]> {
  if (redisConfigured()) return (await redis().get<SiteInquiry[]>(key)) ?? [];
  try {
    const inquiries = JSON.parse(await readFile(file, "utf8")) as SiteInquiry[];
    return Array.isArray(inquiries) ? inquiries : [];
  } catch { return []; }
}

async function writeUnlocked(inquiries: SiteInquiry[]) {
  if (redisConfigured()) { await redis().set(key, inquiries); return; }
  const temp = `${file}.tmp`;
  await writeFile(temp, JSON.stringify(inquiries, null, 2), "utf8");
  await rename(temp, file);
}

export async function listInquiries() {
  return exclusive(async () => (await readUnlocked()).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
}

export async function createInquiry(input: Omit<SiteInquiry, "id" | "status" | "createdAt" | "decisionEmailSentAt" | "decisionEmailId">) {
  return exclusive(async () => {
    const inquiries = await readUnlocked();
    const inquiry: SiteInquiry = { ...input, id: randomUUID(), status: "new", createdAt: new Date().toISOString() };
    inquiries.push(inquiry);
    await writeUnlocked(inquiries);
    return inquiry;
  });
}

export async function getInquiry(id: string) {
  return (await listInquiries()).find(inquiry => inquiry.id === id) ?? null;
}

export async function updateInquiry(id: string, status: "accepted" | "declined") {
  return exclusive(async () => {
    const inquiries = await readUnlocked();
    const inquiry = inquiries.find(item => item.id === id);
    if (!inquiry) return null;
    inquiry.status = status;
    delete inquiry.decisionEmailSentAt;
    delete inquiry.decisionEmailId;
    await writeUnlocked(inquiries);
    return inquiry;
  });
}

export async function markInquiryDecisionEmailSent(id: string, status: "accepted" | "declined", emailId: string) {
  return exclusive(async () => {
    const inquiries = await readUnlocked();
    const inquiry = inquiries.find(item => item.id === id);
    if (!inquiry || inquiry.status !== status) return null;
    Object.assign(inquiry, { decisionEmailSentAt: new Date().toISOString(), decisionEmailId: emailId });
    await writeUnlocked(inquiries);
    return inquiry;
  });
}
