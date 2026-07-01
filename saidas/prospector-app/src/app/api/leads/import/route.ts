import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateScore } from '@/lib/score'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const text = await file.text()
  const lines = text.split('\n').filter(Boolean)
  const headers = lines[0].split(',').map((h) => h.replace(/"/g, '').trim().toLowerCase())

  let imported = 0
  let skipped = 0

  for (const line of lines.slice(1)) {
    const values = line.match(/(".*?"|[^,]+)(?=,|$)/g) ?? []
    const row: Record<string, string> = {}
    headers.forEach((h, i) => {
      row[h] = (values[i] ?? '').replace(/"/g, '').trim()
    })

    const name = row['nome'] ?? row['name']
    if (!name) { skipped++; continue }

    const lead = {
      name,
      category: row['categoria'] ?? row['category'] ?? 'Outros',
      city: row['cidade'] ?? row['city'] ?? '',
      state: row['estado'] ?? row['state'] ?? null,
      neighborhood: row['bairro'] ?? row['neighborhood'] ?? null,
      phone: row['telefone'] ?? row['phone'] ?? null,
      website: row['site'] ?? row['website'] ?? null,
      instagram: row['instagram'] ?? null,
      email: row['email'] ?? null,
      score: 0,
      source: 'import',
    }
    lead.score = calculateScore(lead)

    try {
      await prisma.lead.create({ data: lead })
      imported++
    } catch {
      skipped++
    }
  }

  return NextResponse.json({ imported, skipped })
}
