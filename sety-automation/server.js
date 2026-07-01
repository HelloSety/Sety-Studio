require('dotenv').config();
const express = require('express');
const { handleWebhook } = require('./src/webhook');

const app = express();
app.use(express.json());

app.post('/webhook', handleWebhook);

app.get('/health', (_, res) =>
  res.json({ status: 'ok', agent: 'Aurora IA', ts: new Date().toISOString() })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Aurora IA ativa na porta ${PORT}`)
);
