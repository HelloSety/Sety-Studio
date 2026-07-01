import { calculateScore } from './score'

const FSQ_API = 'https://api.foursquare.com/v3/places/search'

export interface SearchParams {
  categories: string[]
  ll: string
  radius: number
  limit?: number
}

export interface FoursquarePlace {
  fsq_id: string
  name: string
  categories: { name: string }[]
  location: {
    address?: string
    city?: string
    region?: string
    neighborhood?: string[]
  }
  geocodes?: { main?: { latitude: number; longitude: number } }
  tel?: string
  website?: string
  social_media?: { instagram?: string }
}

export async function searchPlaces(params: SearchParams, apiKey: string) {
  const url = new URL(FSQ_API)
  url.searchParams.set('ll', params.ll)
  url.searchParams.set('radius', String(Math.min(params.radius * 1000, 100000)))
  url.searchParams.set('limit', String(Math.min(params.limit ?? 50, 50)))
  if (params.categories.length > 0) {
    url.searchParams.set('categories', params.categories.join(','))
  }
  url.searchParams.set('fields', 'fsq_id,name,categories,location,geocodes,tel,website,social_media')

  const res = await fetch(url.toString(), {
    headers: { Authorization: apiKey, Accept: 'application/json' },
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Foursquare API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  const results = (data.results ?? []) as FoursquarePlace[]

  return results.map((p) => {
    const lead = {
      externalId: p.fsq_id,
      name: p.name,
      category: p.categories?.[0]?.name ?? 'Outros',
      city: p.location?.city ?? '',
      state: p.location?.region ?? '',
      neighborhood: p.location?.neighborhood?.[0] ?? null,
      address: p.location?.address ?? null,
      phone: p.tel ?? null,
      website: p.website ?? null,
      instagram: p.social_media?.instagram ?? null,
      lat: p.geocodes?.main?.latitude ?? null,
      lng: p.geocodes?.main?.longitude ?? null,
      source: 'foursquare',
      score: 0,
    }
    lead.score = calculateScore(lead)
    return lead
  })
}

export const FSQ_CATEGORY_MAP: Record<string, string> = {
  'Clínica Odontológica': '11065',
  'Clínica de Estética': '11055',
  'Energia Solar': '17069',
  'Advocacia': '11109',
  'Imobiliária': '17114',
  'Consórcios': '11134',
  'Clínica Médica': '11058',
  'Dermatologista': '11059',
  'Academia': '18008',
  'Nutricionista': '11061',
  'Restaurante': '13065',
  'Pizzaria': '13064',
  'Cafeteria': '13032',
  'Hamburgueria': '13037',
  'Construtora': '11131',
  'Agência Digital': '11100',
}
