import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url, apiKey, instance } = await req.json();

    if (!url || !apiKey || !instance) {
      return NextResponse.json(
        { error: "url, apiKey e instance são obrigatórios" },
        { status: 400 }
      );
    }

    const base = url.replace(/\/$/, "");

    const res = await fetch(`${base}/instance/connectionState/${instance}`, {
      headers: { apikey: apiKey },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Servidor respondeu ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const state: string = data?.instance?.state ?? data?.state ?? "close";

    return NextResponse.json({ state });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: msg.includes("timed out") ? "Servidor não respondeu (timeout)" : msg },
      { status: 500 }
    );
  }
}
