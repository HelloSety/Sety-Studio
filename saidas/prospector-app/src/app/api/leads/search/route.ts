import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { searchPlaces, FSQ_CATEGORY_MAP } from '@/lib/foursquare'
import { z } from 'zod'

const schema = z.object({
  categories: z.array(z.string()).min(1),
  locations: z.array(z.object({
    ll: z.string(),
    radius: z.number().min(1).max(300),
    name: z.string().optional(),
  })).min(1),
  limit: z.number().min(10).max(300).default(50),
  requirePhone: z.boolean().default(false),
  requireSite: z.boolean().default(false),
  requireInstagram: z.boolean().default(false),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const cfg = await prisma.config.findUnique({ where: { key: 'fsq_api_key' } })
  if (!cfg?.value) {
    return NextResponse.json({ error: 'Chave Foursquare não configurada' }, { status: 400 })
  }

  const { categories, locations, limit, requirePhone, requireSite, requireInstagram } = parsed.data
  const categoryIds = categories.map((c) => FSQ_CATEGORY_MAP[c] ?? '').filter(Boolean)

  let total = 0
  const created: string[] = []

  for (const loc of locations) {
    for (const cat of (categoryIds.length ? categoryIds : [''])) {
      try {
        const places = await searchPlaces(
          { categories: cat ? [cat] : [], ll: loc.ll, radius: loc.radius, limit },
          cfg.value
        )

        for (const place of places) {
          if (requirePhone && !place.phone) continue
          if (requireSite && !place.website) continue
          if (requireInstagram && !place.instagram) continue

          const existing = await prisma.lead.findUnique({ where: { externalId: place.externalId } })
          if (existing) continue

          const lead = await prisma.lead.create({ data: place })
          created.push(lead.id)
          total++
        }
      } catch (err) {
        console.error('Search error:', err)
      }
    }
  }

  return NextResponse.json({ total, ids: created })
}
