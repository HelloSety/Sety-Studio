import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { LeadStatus } from '@prisma/client'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') as LeadStatus | null
  const category = searchParams.get('category')
  const query = searchParams.get('q')
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '50')
  const skip = (page - 1) * limit

  const where = {
    ...(status ? { status } : {}),
    ...(category ? { category } : {}),
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: 'insensitive' as const } },
            { city: { contains: query, mode: 'insensitive' as const } },
            { phone: { contains: query } },
            { category: { contains: query, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  }

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({ where, skip, take: limit, orderBy: { score: 'desc' } }),
    prisma.lead.count({ where }),
  ])

  return NextResponse.json({ leads, total, page, pages: Math.ceil(total / limit) })
}

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const { id, status, notes } = body

  const lead = await prisma.lead.update({
    where: { id },
    data: { ...(status ? { status } : {}), ...(notes !== undefined ? { notes } : {}) },
  })

  return NextResponse.json(lead)
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  await prisma.lead.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
