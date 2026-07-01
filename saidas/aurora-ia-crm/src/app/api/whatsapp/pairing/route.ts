import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.EVOLUTION_API_URL!;
const KEY  = process.env.EVOLUTION_API_KEY!;
const INST = process.env.EVOLUTION_INSTANCE!;

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber } = await req.json();

    if (!phoneNumber) {
      return NextResponse.json({ error: "phoneNumber obrigatório" }, { status: 400 });
    }

    // Remove tudo que não é dígito
    const clean = phoneNumber.replace(/\D/g, "");

    const res = await fetch(`${BASE}/instance/pairingCode/${INST}`, {
      method: "POST",
      headers: {
        apikey: KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber: clean }),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data?.message ?? "Erro ao gerar código" }, { status: res.status });
    }

    // Evolution v2 retorna { code: "ABCD-EFGH" } ou { pairingCode: "ABCD-EFGH" }
    const code = data?.code ?? data?.pairingCode ?? null;
    return NextResponse.json({ code });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
