import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const configs = await prisma.config.findMany()
  const result: Record<string, string> = {}
  configs.forEach((c) => {
    result[c.key] = c.key.includes('key') || c.key.includes('token') ? '••••••••' : c.value
  })
  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const entries = Object.entries(body) as [string, string][]

  await Promise.all(
    entries.map(([key, value]) =>
      prisma.config.upsert({ where: { key }, create: { key, value }, update: { value } })
    )
  )

  return NextResponse.json({ ok: true })
}
