import { NextResponse } from "next/server";

const BASE = process.env.EVOLUTION_API_URL!;
const KEY  = process.env.EVOLUTION_API_KEY!;
const INST = process.env.EVOLUTION_INSTANCE!;

export async function GET() {
  try {
    const res = await fetch(`${BASE}/instance/connect/${INST}`, {
      headers: { apikey: KEY },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ error: await res.text() }, { status: res.status });
    }

    const data = await res.json();
    // Evolution v2: { code: "XXXXXX", base64: "data:image/png;base64,..." }
    return NextResponse.json({
      base64: data?.base64 ?? null,
      code:   data?.code   ?? null,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
