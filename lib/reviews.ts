import { mkdir, readdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { del, list, put } from "@vercel/blob";
import { isBlobStorageConfigured } from "@/lib/site-content";

export type ReviewCategory = "Pâtisserie" | "Traiteur" | "Atelier" | "Autre";

export type CustomerReview = {
  id: string;
  name: string;
  rating: number;
  text: string;
  category: ReviewCategory;
  createdAt: string;
};

const directory = path.join(process.cwd(), "data", "reviews");
const blobPrefix = "melp/reviews/";

function assertStorageAvailable() {
  if (process.env.VERCEL === "1" && !isBlobStorageConfigured()) {
    throw new Error("Le stockage des avis n’est pas relié au site en ligne.");
  }
}

function isReview(value: unknown): value is CustomerReview {
  if (!value || typeof value !== "object") return false;
  const review = value as Partial<CustomerReview>;
  return typeof review.id === "string" && /^[\da-f-]{36}$/i.test(review.id)
    && typeof review.name === "string" && review.name.length <= 50
    && Number.isInteger(review.rating) && Number(review.rating) >= 1 && Number(review.rating) <= 5
    && typeof review.text === "string" && review.text.length <= 1200
    && ["Pâtisserie", "Traiteur", "Atelier", "Autre"].includes(review.category ?? "")
    && typeof review.createdAt === "string" && !Number.isNaN(Date.parse(review.createdAt));
}

export async function listReviews(): Promise<CustomerReview[]> {
  assertStorageAvailable();
  if (isBlobStorageConfigured()) {
    const records: CustomerReview[] = [];
    let cursor: string | undefined;
    do {
      const page = await list({ prefix: blobPrefix, limit: 1000, ...(cursor ? { cursor } : {}) });
      const values = await Promise.all(page.blobs.map(async blob => {
        try {
          const response = await fetch(blob.url, { cache: "no-store" });
          if (!response.ok) return null;
          const value: unknown = await response.json();
          return isReview(value) ? value : null;
        } catch { return null; }
      }));
      records.push(...values.filter((value): value is CustomerReview => value !== null));
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    return records.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  await mkdir(directory, { recursive: true });
  const files = await readdir(directory).catch(() => []);
  const records = await Promise.all(files.filter(file => file.endsWith(".json")).map(async file => {
    try {
      const value: unknown = JSON.parse(await readFile(path.join(directory, file), "utf8"));
      return isReview(value) ? value : null;
    } catch { return null; }
  }));
  return records.filter((value): value is CustomerReview => value !== null).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addReview(input: Omit<CustomerReview, "id" | "createdAt">): Promise<CustomerReview> {
  assertStorageAvailable();
  const review: CustomerReview = { ...input, id: randomUUID(), createdAt: new Date().toISOString() };
  const body = JSON.stringify(review);
  if (isBlobStorageConfigured()) {
    await put(`${blobPrefix}${review.id}.json`, body, { access: "public", addRandomSuffix: false, contentType: "application/json", cacheControlMaxAge: 60 });
  } else {
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, `${review.id}.json`), body, "utf8");
  }
  return review;
}

export async function removeReview(id: string): Promise<boolean> {
  assertStorageAvailable();
  if (!/^[\da-f-]{36}$/i.test(id)) return false;
  if (isBlobStorageConfigured()) {
    const { blobs } = await list({ prefix: `${blobPrefix}${id}.json`, limit: 1 });
    const blob = blobs.find(item => item.pathname === `${blobPrefix}${id}.json`);
    if (!blob) return false;
    await del(blob.url);
    return true;
  }
  try { await unlink(path.join(directory, `${id}.json`)); return true; } catch { return false; }
}
