#!/bin/bash
# Configura instância Evolution API + conecta Typebot
# Rodar APÓS docker-compose up -d e após preencher .env

set -e
source ../.env

BASE="http://localhost:8080"
HEADERS=(-H "apikey: $EVOLUTION_API_KEY" -H "Content-Type: application/json")

echo "=== 1. Criando instância WhatsApp ==="
curl -s -X POST "$BASE/instance/create" \
  "${HEADERS[@]}" \
  -d "{
    \"instanceName\": \"$EVOLUTION_INSTANCE\",
    \"qrcode\": true,
    \"integration\": \"WHATSAPP-BAILEYS\"
  }" | python3 -m json.tool

echo ""
echo "=== 2. Aguardando 3 segundos ==="
sleep 3

echo "=== 3. Gerando QR Code ==="
echo "Acesse: http://$SERVER_IP:8080/instance/connect/$EVOLUTION_INSTANCE"
echo "Headers: apikey: $EVOLUTION_API_KEY"
echo ""
echo "Escaneie o QR Code com o WhatsApp Business"
echo "Pressione ENTER após escanear..."
read

echo "=== 4. Verificando conexão ==="
curl -s "$BASE/instance/connectionState/$EVOLUTION_INSTANCE" \
  "${HEADERS[@]}" | python3 -m json.tool

echo ""
echo "=== 5. Configurando integração Typebot ==="
curl -s -X POST "$BASE/typebot/set/$EVOLUTION_INSTANCE" \
  "${HEADERS[@]}" \
  -d "{
    \"enabled\": true,
    \"url\": \"$TYPEBOT_URL\",
    \"typebot\": \"$TYPEBOT_BOT_ID\",
    \"triggerType\": \"all\",
    \"triggerValue\": \"\",
    \"expire\": 20,
    \"keywordFinish\": \"#fim\",
    \"delayMessage\": 1200,
    \"unknownMessage\": \"Não entendi. Pode repetir?\",
    \"listeningFromMe\": false
  }" | python3 -m json.tool

echo ""
echo "=== 6. Configurando Webhook global → N8N ==="
curl -s -X POST "$BASE/webhook/set/$EVOLUTION_INSTANCE" \
  "${HEADERS[@]}" \
  -d "{
    \"url\": \"$N8N_WEBHOOK_URL/webhook/evolution\",
    \"webhook_by_events\": false,
    \"webhook_base64\": false,
    \"events\": [
      \"MESSAGES_UPSERT\",
      \"CONNECTION_UPDATE\"
    ]
  }" | python3 -m json.tool

echo ""
echo "✅ Evolution API configurada!"
echo "Instância: $EVOLUTION_INSTANCE"
echo "Typebot conectado: $TYPEBOT_BOT_ID"
