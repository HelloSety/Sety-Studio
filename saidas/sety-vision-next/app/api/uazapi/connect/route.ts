import { NextResponse } from "next/server";
import { getQRCode, isConfigured } from "@/lib/uazapi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!isConfigured()) {
    return NextResponse.json({ error: "uazapi não configurado" }, { status: 503 });
  }
  try {
    const data = await getQRCode();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
