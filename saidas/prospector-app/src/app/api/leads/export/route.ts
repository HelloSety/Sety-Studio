import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { LeadStatus } from '@prisma/client'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') as LeadStatus | null

  const leads = await prisma.lead.findMany({
    where: status ? { status } : {},
    orderBy: { score: 'desc' },
  })

  const headers = ['Nome', 'Categoria', 'Cidade', 'Estado', 'Bairro', 'Telefone', 'Site', 'Instagram', 'Email', 'Score', 'Status']
  const rows = leads.map((l) => [
    l.name, l.category, l.city, l.state ?? '', l.neighborhood ?? '',
    l.phone ?? '', l.website ?? '', l.instagram ?? '', l.email ?? '',
    l.score, l.status,
  ])

  const csv = [headers, ...rows]
    .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="leads-${Date.now()}.csv"`,
    },
  })
}
