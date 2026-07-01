import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1),
  message: z.string().min(1),
  segment: z.string().optional(),
  city: z.string().optional(),
  neighborhood: z.string().optional(),
  limit: z.number().default(0),
  delay: z.number().min(15).max(180).default(35),
  varyDelay: z.boolean().default(true),
})

export async function GET() {
  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { campaignLeads: true } } },
  })
  return NextResponse.json(campaigns)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const campaign = await prisma.campaign.create({ data: parsed.data })

  const where = {
    ...(parsed.data.segment ? { category: { contains: parsed.data.segment, mode: 'insensitive' as const } } : {}),
    ...(parsed.data.city ? { city: { contains: parsed.data.city, mode: 'insensitive' as const } } : {}),
    phone: { not: null },
  }

  const leads = await prisma.lead.findMany({
    where,
    take: parsed.data.limit > 0 ? parsed.data.limit : undefined,
    orderBy: { score: 'desc' },
  })

  if (leads.length > 0) {
    await prisma.campaignLead.createMany({
      data: leads.map((l) => ({ campaignId: campaign.id, leadId: l.id })),
      skipDuplicates: true,
    })
  }

  return NextResponse.json({ ...campaign, leadCount: leads.length })
}
