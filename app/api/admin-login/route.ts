import { NextResponse } from "next/server";
import { isAdminPassword } from "@/lib/site-content";

export async function POST(request: Request) {
  const { password } = await request.json().catch(() => ({ password: null }));
  if (!isAdminPassword(typeof password === "string" ? password : null)) {
    return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true });
}
