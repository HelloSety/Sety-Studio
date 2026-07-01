import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const [totalLeads, qualified, contacted, campaigns, conversations] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: 'QUALIFIED' } }),
    prisma.lead.count({ where: { status: 'CONTACTED' } }),
    prisma.campaign.count(),
    prisma.conversation.count(),
  ])

  const replied = await prisma.message.count({ where: { direction: 'IN' } })
  const sent = await prisma.message.count({ where: { direction: 'OUT' } })

  const replyRate = sent > 0 ? Math.round((replied / sent) * 100) : 0

  const daily = await prisma.$queryRaw<{ date: string; count: bigint }[]>`
    SELECT DATE("createdAt") as date, COUNT(*) as count
    FROM "Lead"
    WHERE "createdAt" > NOW() - INTERVAL '14 days'
    GROUP BY DATE("createdAt")
    ORDER BY date ASC
  `

  return NextResponse.json({
    totalLeads,
    qualified,
    contacted,
    campaigns,
    conversations,
    replyRate,
    daily: daily.map((d) => ({ date: d.date, count: Number(d.count) })),
  })
}
