import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { isAdminPassword, isBlobStorageConfigured } from "@/lib/site-content";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isAdminPassword(request.headers.get("x-melp-admin-password"))) {
    return NextResponse.json({ error: "Accès administrateur refusé." }, { status: 401 });
  }
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choisis une photo." }, { status: 400 });

  const extensions: Record<string, string> = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" };
  const extension = extensions[file.type];
  if (!extension) return NextResponse.json({ error: "Formats acceptés : JPG, PNG ou WebP." }, { status: 415 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "La photo ne doit pas dépasser 5 Mo." }, { status: 413 });

  const filename = `${randomUUID()}${extension}`;
  if (isBlobStorageConfigured()) {
    const blob = await put(`melp/uploads/${filename}`, file, { access: "public", addRandomSuffix: false, contentType: file.type });
    return NextResponse.json({ image: blob.url });
  }
  if (process.env.VERCEL === "1") return NextResponse.json({ error: "Reliez un stockage Vercel Blob au projet pour enregistrer des photos en ligne." }, { status: 503 });
  const directory = path.join(process.cwd(), "public", "uploads");
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ image: `/uploads/${filename}` });
}
