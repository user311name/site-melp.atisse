import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type FontEntry = { family: string; category: string; popularity: number };
let cachedFonts: FontEntry[] | null = null;
let cachedAt = 0;

export async function GET() {
  if (cachedFonts && Date.now() - cachedAt < 12 * 60 * 60 * 1000) {
    return NextResponse.json({ fonts: cachedFonts }, { headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" } });
  }
  try {
    const response = await fetch("https://fonts.google.com/metadata/fonts", { next: { revalidate: 43200 } });
    if (!response.ok) throw new Error(`Google Fonts returned ${response.status}`);
    const raw = (await response.text()).replace(/^\)\]\}',?\s*/, "");
    const metadata = JSON.parse(raw) as { familyMetadataList?: Array<{ family?: string; category?: string; popularity?: number }> };
    const fonts = (metadata.familyMetadataList ?? []).flatMap(entry => {
      const family = entry.family?.trim();
      if (!family || family.length > 80 || !/^[\p{L}\p{N} .'-]+$/u.test(family)) return [];
      return [{ family, category: entry.category ?? "Other", popularity: entry.popularity ?? 99999 }];
    }).sort((a, b) => a.popularity - b.popularity || a.family.localeCompare(b.family));
    if (!fonts.length) throw new Error("Google Fonts catalog was empty");
    cachedFonts = fonts;
    cachedAt = Date.now();
    return NextResponse.json({ fonts }, { headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" } });
  } catch (error) {
    console.error("Unable to load Google Fonts catalog", error);
    if (cachedFonts) return NextResponse.json({ fonts: cachedFonts, stale: true });
    return NextResponse.json({ error: "Le catalogue de polices est momentanément indisponible." }, { status: 503 });
  }
}
