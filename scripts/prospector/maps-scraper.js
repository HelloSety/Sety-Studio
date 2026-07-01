require('dotenv').config({ path: `${__dirname}/.env` });
const axios = require('axios');

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const BASE = 'https://maps.googleapis.com/maps/api/place';

// Tipos que indicam negócio local relevante (pré-filtro sem chamar Details)
const VALID_TYPES = new Set([
  'doctor', 'dentist', 'health', 'lawyer', 'real_estate_agency',
  'beauty_salon', 'spa', 'gym', 'physiotherapist', 'insurance_agency',
  'school', 'university', 'hair_care', 'point_of_interest', 'establishment',
]);

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function searchPlaces(query, city) {
  if (!API_KEY) throw new Error('GOOGLE_PLACES_API_KEY não definida no .env');

  const results = [];
  let pagetoken = null;

  for (let page = 0; page < 3; page++) {
    const params = new URLSearchParams({
      query: `${query} ${city}`,
      language: 'pt-BR',
      key: API_KEY,
    });
    if (pagetoken) params.set('pagetoken', pagetoken);

    const { data } = await axios.get(`${BASE}/textsearch/json?${params}`);

    if (data.status === 'REQUEST_DENIED') {
      throw new Error(`Google Places API: ${data.error_message}`);
    }
    if (data.status === 'ZERO_RESULTS') break;

    results.push(...(data.results || []));

    if (!data.next_page_token) break;
    pagetoken = data.next_page_token;

    // Google exige ~2s antes de aceitar o next_page_token
    await sleep(2500);
  }

  return results;
}

async function getDetails(placeId) {
  const fields = [
    'name',
    'formatted_phone_number',
    'international_phone_number',
    'website',
    'rating',
    'user_ratings_total',
    'formatted_address',
    'types',
    'business_status',
  ].join(',');

  const params = new URLSearchParams({ place_id: placeId, fields, language: 'pt-BR', key: API_KEY });
  const { data } = await axios.get(`${BASE}/details/json?${params}`);
  return data.result || null;
}

// Pré-filtro na resposta do Text Search antes de chamar Details (economiza chamadas API)
function preFilter(places) {
  return places.filter(p => {
    // Descarta negócios permanentemente fechados
    if (p.business_status === 'CLOSED_PERMANENTLY') return false;
    // Mantém apenas estabelecimentos com tipo reconhecido
    const types = p.types || [];
    return types.some(t => VALID_TYPES.has(t));
  });
}

module.exports = { searchPlaces, getDetails, preFilter };
