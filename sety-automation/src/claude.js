const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = process.env.CLAUDE_MODEL || 'claude-haiku-4-5-20251001';

const BASE_PROMPT = fs.readFileSync(
  path.join(__dirname, 'prompts/sdr/lucas-system.md'),
  'utf-8'
);

const FALLBACK = {
  message: 'Oi! Tudo bem? Sou o Lucas da Sety Studio. Como posso te ajudar?',
  extracted_data: {},
  score: 0,
  classification: 'COLD',
  stage: 'qualification',
  send_portfolio: false,
  request_human: false,
};

function buildSystemPrompt(lead) {
  const leadContext = `
---

## DADOS JÁ CONHECIDOS DO LEAD

${JSON.stringify(
  {
    nome: lead.name,
    nicho: lead.nicho,
    tipo_projeto: lead.tipo_projeto,
    situacao_atual: lead.situacao_atual,
    num_produtos: lead.num_produtos,
    urgencia: lead.urgencia,
    orcamento: lead.orcamento,
    score_atual: lead.score,
    stage_atual: lead.stage,
  },
  null,
  2
)}

Use essas informações para não repetir perguntas já respondidas.
`;

  return BASE_PROMPT + leadContext;
}

async function askLucas(userText, history, lead) {
  const messages = [
    ...history.map((h) => ({ role: h.role, content: h.content })),
    { role: 'user', content: userText },
  ];

  let raw = '';
  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: buildSystemPrompt(lead),
      messages,
    });
    raw = response.content[0]?.text || '';
  } catch (err) {
    console.error('[claude] Erro na chamada API:', err.message);
    return FALLBACK;
  }

  try {
    const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(clean);
    return { ...FALLBACK, ...parsed };
  } catch {
    console.warn('[claude] JSON inválido, usando texto bruto como mensagem');
    return { ...FALLBACK, message: raw.slice(0, 1000) };
  }
}

module.exports = { askLucas };
