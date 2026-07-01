interface LeadData {
  phone?: string | null
  website?: string | null
  instagram?: string | null
  email?: string | null
  address?: string | null
  lat?: number | null
}

export function calculateScore(lead: LeadData): number {
  let score = 0
  if (lead.phone) score += 35
  if (lead.website) score += 25
  if (lead.instagram) score += 20
  if (lead.email) score += 10
  if (lead.address) score += 5
  if (lead.lat) score += 5
  return score
}
