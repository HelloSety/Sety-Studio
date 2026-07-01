import { NextResponse } from 'next/server'
import { connectWhatsApp, getConnectionStatus } from '@/lib/whatsapp'

export async function POST() {
  if (getConnectionStatus() !== 'disconnected') {
    return NextResponse.json({ status: getConnectionStatus() })
  }
  connectWhatsApp().catch(console.error)
  return NextResponse.json({ status: 'connecting' })
}
