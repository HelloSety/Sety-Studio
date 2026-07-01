const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function query(sql, params = []) {
  const { rows } = await pool.query(sql, params);
  return rows;
}

async function getOrCreateLead(phone, pushName) {
  const rows = await query(
    `INSERT INTO leads (phone, name)
     VALUES ($1, $2)
     ON CONFLICT (phone) DO UPDATE
       SET last_contact = now(),
           name = COALESCE(leads.name, EXCLUDED.name)
     RETURNING *`,
    [phone, pushName || null]
  );
  return rows[0];
}

async function getHistory(phone, limit = 20) {
  return query(
    `SELECT role, content
     FROM conversations
     WHERE phone = $1
     ORDER BY created_at ASC
     LIMIT $2`,
    [phone, limit]
  );
}

async function saveMessages(leadId, phone, userText, assistantText) {
  await query(
    `INSERT INTO conversations (lead_id, phone, role, content)
     VALUES ($1, $2, 'user', $3), ($1, $2, 'assistant', $4)`,
    [leadId, phone, userText, assistantText]
  );
}

async function updateLead(phone, leadId, lucas) {
  const d = lucas.extracted_data || {};
  await query(
    `UPDATE leads SET
       score = $1,
       classification = $2,
       stage = $3,
       last_contact = now(),
       status = 'active',
       human_requested = $4,
       name            = COALESCE($5, name),
       nicho           = COALESCE($6, nicho),
       tipo_projeto    = COALESCE($7, tipo_projeto),
       situacao_atual  = COALESCE($8, situacao_atual),
       num_produtos    = COALESCE($9, num_produtos),
       urgencia        = COALESCE($10, urgencia),
       orcamento       = COALESCE($11, orcamento)
     WHERE phone = $12`,
    [
      lucas.score ?? 0,
      lucas.classification ?? 'COLD',
      lucas.stage ?? 'qualification',
      lucas.request_human ?? false,
      d.name    || null,
      d.nicho   || null,
      d.tipo_projeto   || null,
      d.situacao_atual || null,
      d.num_produtos   || null,
      d.urgencia       || null,
      d.orcamento      || null,
      phone,
    ]
  );
}

module.exports = { getOrCreateLead, getHistory, saveMessages, updateLead };
