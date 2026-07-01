const axios = require('axios');

const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TG_CHAT = process.env.TELEGRAM_CHAT_ID;

async function sendTelegram(text) {
  if (!TG_TOKEN || !TG_CHAT) {
    console.log('[alert] Telegram não configurado. Mensagem:', text);
    return;
  }
  try {
    await axios.post(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      chat_id: TG_CHAT,
      text,
      parse_mode: 'HTML',
    });
  } catch (err) {
    console.error('[alert] Telegram erro:', err.response?.data || err.message);
  }
}

async function notifyHot(phone, lead, lucas) {
  const d = lucas.extracted_data || {};
  const msg = [
    `<b>LEAD HOT — Score ${lucas.score}/100</b>`,
    ``,
    `Telefone: https://wa.me/${phone}`,
    `Nicho: ${d.nicho || lead.nicho || 'N/A'}`,
    `Orcamento: ${d.orcamento || lead.orcamento || 'N/A'}`,
    `Urgencia: ${d.urgencia || lead.urgencia || 'N/A'}`,
    `Projeto: ${d.tipo_projeto || lead.tipo_projeto || 'N/A'}`,
  ].join('\n');

  await sendTelegram(msg);
}

async function notifyHuman(phone, lead, lucas) {
  const d = lucas.extracted_data || {};
  const msg = [
    `<b>TRANSFERENCIA HUMANA SOLICITADA</b>`,
    ``,
    `Telefone: https://wa.me/${phone}`,
    `Score: ${lucas.score}/100`,
    `Stage: ${lucas.stage}`,
    `Nicho: ${d.nicho || lead.nicho || 'N/A'}`,
    `Orcamento: ${d.orcamento || lead.orcamento || 'N/A'}`,
    ``,
    `Entre na conversa agora.`,
  ].join('\n');

  await sendTelegram(msg);
}

module.exports = { notifyHot, notifyHuman };
