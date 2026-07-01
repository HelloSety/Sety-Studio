import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendMessage, getConnectionStatus, interpolateMessage } from '@/lib/whatsapp'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  if (getConnectionStatus() !== 'connected') {
    return NextResponse.json({ error: 'WhatsApp não conectado' }, { status: 400 })
  }

  const campaign = await prisma.campaign.findUnique({
    where: { id: params.id },
    include: {
      campaignLeads: {
        where: { status: 'pending' },
        include: { lead: true },
        take: 50,
      },
    },
  })

  if (!campaign) return NextResponse.json({ error: 'Campanha não encontrada' }, { status: 404 })

  await prisma.campaign.update({ where: { id: params.id }, data: { status: 'RUNNING' } })

  let sent = 0

  for (const cl of campaign.campaignLeads) {
    const lead = cl.lead
    if (!lead.phone) continue

    try {
      const text = interpolateMessage(campaign.message, {
        nome: lead.name,
        cidade: lead.city,
        categoria: lead.category,
        bairro: lead.neighborhood ?? '',
        telefone: lead.phone ?? '',
      })

      await sendMessage(lead.phone, text)

      await prisma.campaignLead.update({
        where: { id: cl.id },
        data: { status: 'sent', sentAt: new Date() },
      })

      await prisma.campaign.update({
        where: { id: params.id },
        data: { sent: { increment: 1 } },
      })

      await prisma.lead.update({
        where: { id: lead.id },
        data: { status: 'CONTACTED' },
      })

      sent++

      const delay = campaign.varyDelay
        ? campaign.delay * 1000 + Math.random() * campaign.delay * 500
        : campaign.delay * 1000

      await new Promise((r) => setTimeout(r, delay))
    } catch (err) {
      console.error('Send error:', err)
      await prisma.campaignLead.update({
        where: { id: cl.id },
        data: { status: 'error' },
      })
    }
  }

  const pending = await prisma.campaignLead.count({
    where: { campaignId: params.id, status: 'pending' },
  })

  if (pending === 0) {
    await prisma.campaign.update({ where: { id: params.id }, data: { status: 'COMPLETED' } })
  }

  return NextResponse.json({ sent })
}
