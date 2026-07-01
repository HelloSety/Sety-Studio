function cleanPhone(rawPhone) {
  if (!rawPhone) return null;
  const digits = rawPhone.replace(/\D/g, '');
  if (digits.length < 10) return null;
  if (digits.startsWith('55') && digits.length >= 12) return digits;
  if (digits.length === 11) return `55${digits}`;
  if (digits.length === 10) return `55${digits}`;
  return null;
}

function scorePlace(place) {
  const score = { total: 0, reasons: [] };

  // Sem telefone = não conseguimos contatar (descarta)
  const phone = cleanPhone(place.international_phone_number || place.formatted_phone_number);
  if (!phone) return null;

  // Negócio encerrado = descarta
  if (place.business_status === 'CLOSED_PERMANENTLY') return null;

  // ── Presença digital ──────────────────────────────────────────────────────────
  const site = place.website;
  if (!site) {
    score.total += 5;
    score.reasons.push('Sem site');
  } else if (site.includes('facebook.com') || site.includes('instagram.com')) {
    // "Site" é rede social — conta como sem site real
    score.total += 4;
    score.reasons.push('Site é rede social (sem site real)');
  } else {
    score.total += 1;
    score.reasons.push('Tem site (oportunidade de melhoria)');
  }

  // ── Avaliações Google ─────────────────────────────────────────────────────────
  const rating = place.rating;
  const reviews = place.user_ratings_total || 0;

  if (!rating || reviews === 0) {
    score.total += 4;
    score.reasons.push('Sem avaliações no Google');
  } else if (rating < 3.5) {
    score.total += 3;
    score.reasons.push(`Rating baixo (${rating} ⭐)`);
  } else if (rating < 4.2) {
    score.total += 2;
    score.reasons.push(`Rating mediano (${rating} ⭐)`);
  }

  if (reviews > 0 && reviews < 20) {
    score.total += 2;
    score.reasons.push(`Poucos reviews (${reviews})`);
  } else if (reviews >= 20 && reviews < 80) {
    score.total += 1;
    score.reasons.push(`Reviews moderados (${reviews})`);
  }

  return { ...score, phone };
}

function qualifyLeads(places) {
  const leads = [];

  for (const place of places) {
    const result = scorePlace(place);
    if (!result) continue;

    leads.push({
      score: result.total,
      reasons: result.reasons.join(' | '),
      name: place.name,
      phone: result.phone,
      phoneDisplay: place.formatted_phone_number || place.international_phone_number,
      website: place.website || '',
      rating: place.rating ?? '',
      reviews: place.user_ratings_total ?? 0,
      address: place.formatted_address || '',
      types: (place.types || []).slice(0, 3).join(', '),
      niche: place._niche || '',
      city: place._city || '',
      contacted: false,
    });
  }

  // Ordena por score decrescente
  return leads.sort((a, b) => b.score - a.score);
}

module.exports = { qualifyLeads, cleanPhone };
