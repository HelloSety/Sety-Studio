const axios = require('axios');

const BASE_URL = process.env.EVOLUTION_API_URL;
const API_KEY = process.env.EVOLUTION_API_KEY;
const INSTANCE = process.env.EVOLUTION_INSTANCE;

async function sendText(phone, text) {
  try {
    await axios.post(
      `${BASE_URL}/message/sendText/${INSTANCE}`,
      { number: phone, text },
      { headers: { apikey: API_KEY, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[wpp] Erro ao enviar mensagem:', err.response?.data || err.message);
    throw err;
  }
}

module.exports = { sendText };
