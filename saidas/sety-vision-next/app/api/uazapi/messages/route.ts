import { NextRequest, NextResponse } from "next/server";
import { getMessages, getAllConversations } from "@/app/api/uazapi/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const number = searchParams.get("number");

  if (number) {
    const msgs = getMessages(number);
    return NextResponse.json({ messages: msgs });
  }

  const conversations = getAllConversations();
  return NextResponse.json({ conversations });
}
