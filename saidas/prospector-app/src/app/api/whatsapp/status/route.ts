import { NextResponse } from 'next/server'
import { getConnectionStatus } from '@/lib/whatsapp'

export async function GET() {
  return NextResponse.json({ status: getConnectionStatus() })
}
