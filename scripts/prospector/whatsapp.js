require('dotenv').config({ path: `${__dirname}/.env` });
const axios = require('axios');

const BASE_URL = process.env.EVOLUTION_API_URL;
const API_KEY = process.env.EVOLUTION_API_KEY;
const INSTANCE = process.env.EVOLUTION_INSTANCE;

function checkConfig() {
  if (!BASE_URL || !API_KEY || !INSTANCE) {
    throw new Error('Configure EVOLUTION_API_URL, EVOLUTION_API_KEY e EVOLUTION_INSTANCE no .env');
  }
}

async function sendText(phone, text) {
  checkConfig();
  await axios.post(
    `${BASE_URL}/message/sendText/${INSTANCE}`,
    { number: phone, text },
    { headers: { apikey: API_KEY, 'Content-Type': 'application/json' } }
  );
}

// Verifica se os números têm WhatsApp antes de enviar (economiza créditos)
async function filterWhatsAppNumbers(phones) {
  checkConfig();
  try {
    const { data } = await axios.post(
      `${BASE_URL}/chat/whatsappNumbers/${INSTANCE}`,
      { numbers: phones },
      { headers: { apikey: API_KEY, 'Content-Type': 'application/json' } }
    );
    const valid = (data || []).filter(r => r.exists).map(r => r.jid?.replace('@s.whatsapp.net', '') || r.number);
    return new Set(valid);
  } catch {
    // Endpoint pode não estar disponível em todas as versões da Evolution API
    // Nesse caso, tenta enviar para todos e trata o erro individualmente
    return new Set(phones);
  }
}

module.exports = { sendText, filterWhatsAppNumbers };
