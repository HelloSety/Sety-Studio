import { NextRequest, NextResponse } from "next/server";
import { setRuntimeConfig, getRuntimeConfig, isConfigured } from "@/lib/uazapi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const c = getRuntimeConfig();
  return NextResponse.json({
    baseUrl:        c.baseUrl       || null,
    hasToken:       Boolean(c.instanceToken),
    hasAdminToken:  Boolean(c.adminToken),
    configured:     isConfigured(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { baseUrl, instanceToken, adminToken } = body as {
      baseUrl?: string;
      instanceToken?: string;
      adminToken?: string;
    };

    if (!baseUrl || !instanceToken) {
      return NextResponse.json(
        { error: "baseUrl e instanceToken são obrigatórios" },
        { status: 400 }
      );
    }

    setRuntimeConfig({ baseUrl, instanceToken, adminToken });

    return NextResponse.json({ ok: true, configured: isConfigured() });
  } catch {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }
}
