import { NextRequest, NextResponse } from 'next/server'
import { sendMessage } from '@/lib/whatsapp'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  leadId: z.string(),
  content: z.string().min(1),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const lead = await prisma.lead.findUnique({ where: { id: parsed.data.leadId } })
  if (!lead?.phone) return NextResponse.json({ error: 'Lead sem telefone' }, { status: 400 })

  await sendMessage(lead.phone, parsed.data.content)

  let conv = await prisma.conversation.findUnique({ where: { leadId: lead.id } })
  if (!conv) conv = await prisma.conversation.create({ data: { leadId: lead.id } })

  const msg = await prisma.message.create({
    data: {
      conversationId: conv.id,
      content: parsed.data.content,
      direction: 'OUT',
    },
  })

  return NextResponse.json(msg)
}
