import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: { leadId: string } }) {
  const conv = await prisma.conversation.findUnique({
    where: { leadId: params.leadId },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  })

  if (!conv) return NextResponse.json([])
  return NextResponse.json(conv.messages)
}
