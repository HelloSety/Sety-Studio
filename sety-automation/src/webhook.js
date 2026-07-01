const { getOrCreateLead, saveMessages, updateLead, getHistory } = require('./db');
const { askLucas } = require('./claude');
const { sendText } = require('./wpp');
const { notifyHot, notifyHuman } = require('./alerts');

async function handleWebhook(req, res) {
  // ACK imediato — Evolution API não espera resposta
  res.sendStatus(200);

  try {
    const body = req.body;

    // Ignorar eventos que não sejam mensagens recebidas
    if (body.event !== 'messages.upsert') return;

    const msg = body.data;
    if (!msg) return;
    if (msg.key?.fromMe) return;

    const text = (
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      ''
    ).trim();
    if (!text) return;

    const phone = (msg.key?.remoteJid || '').replace('@s.whatsapp.net', '');
    if (!phone) return;

    const pushName = msg.pushName || null;

    // 1. Buscar ou criar lead
    const lead = await getOrCreateLead(phone, pushName);

    // 2. Carregar histórico (últimas 20 mensagens)
    const history = await getHistory(phone, 20);

    // 3. Chamar Lucas (Claude API)
    const lucas = await askLucas(text, history, lead);

    // 4. Enviar resposta ao cliente
    await sendText(phone, lucas.message);

    // 5. Salvar conversa no Supabase
    await saveMessages(lead.id, phone, text, lucas.message);

    // 6. Atualizar dados do lead
    await updateLead(phone, lead.id, lucas);

    // 7. Alertas
    if (lucas.request_human) {
      await notifyHuman(phone, lead, lucas);
    } else if (lucas.score >= 71) {
      await notifyHot(phone, lead, lucas);
    }
  } catch (err) {
    console.error('[webhook] Erro:', err.message);
  }
}

module.exports = { handleWebhook };
