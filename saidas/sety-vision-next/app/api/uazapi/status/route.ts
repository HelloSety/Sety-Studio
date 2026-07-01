import { NextResponse } from "next/server";
import { getStatus, getProfile, isConfigured } from "@/lib/uazapi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!isConfigured()) {
    return NextResponse.json({ status: "not_configured", profile: null }, { status: 200 });
  }
  try {
    const [statusRes, profileRes] = await Promise.allSettled([getStatus(), getProfile()]);
    return NextResponse.json({
      status: statusRes.status === "fulfilled" ? statusRes.value.status : "close",
      profile: profileRes.status === "fulfilled" ? profileRes.value : null,
    });
  } catch (err) {
    return NextResponse.json({ status: "close", profile: null, error: String(err) });
  }
}
