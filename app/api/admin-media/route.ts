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
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "Aucun fichier reçu. Choisis la photo puis confirme avec Ouvrir." }, { status: 400 });

    const extensions: Record<string, string> = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" };
    const extension = extensions[file.type];
    if (!extension) return NextResponse.json({ error: "Format non accepté. Utilise une image JPG, PNG ou WebP." }, { status: 415 });
    if (file.size > 4 * 1024 * 1024) return NextResponse.json({ error: "Cette photo dépasse 4 Mo. Réduis sa taille puis réessaie." }, { status: 413 });

    const filename = `${randomUUID()}${extension}`;
    if (isBlobStorageConfigured()) {
      const blob = await put(`melp/uploads/${filename}`, file, { access: "public", addRandomSuffix: false, contentType: file.type });
      return NextResponse.json({ image: blob.url });
    }
    if (process.env.VERCEL === "1") return NextResponse.json({ error: "Le stockage photo n’est pas autorisé pour ce déploiement. Vérifie la connexion Blob au projet Vercel, puis redéploie." }, { status: 503 });
    const directory = path.join(process.cwd(), "public", "uploads");
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ image: `/uploads/${filename}` });
  } catch (error) {
    console.error("Échec de l’enregistrement de la photo Melp.atisse", error);
    return NextResponse.json({ error: "Le serveur n’a pas pu enregistrer cette photo. La connexion au stockage Blob ou l’envoi a échoué." }, { status: 500 });
  }
}
