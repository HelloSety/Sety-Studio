import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ScriptType } from '@prisma/client'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1),
  type: z.nativeEnum(ScriptType).default('TEXT'),
  content: z.string().min(1),
  mediaUrl: z.string().optional(),
})

export async function GET() {
  const scripts = await prisma.script.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(scripts)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  const script = await prisma.script.create({ data: parsed.data })
  return NextResponse.json(script)
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  await prisma.script.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
