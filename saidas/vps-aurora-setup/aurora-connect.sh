#!/bin/bash
# ============================================================
# AURORA IA — Criar Instância WhatsApp + Gerar QR Code
# Execute após o setup.sh para conectar seu WhatsApp
# ============================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

ENV_FILE="/opt/evolution/.env"
[[ ! -f "$ENV_FILE" ]] && { echo -e "${RED}Arquivo .env não encontrado. Execute setup.sh primeiro.${NC}"; exit 1; }
source "$ENV_FILE"

BASE_URL="http://localhost:8080"

# Se tiver domínio configurado, usar HTTPS
[[ -n "${API_DOMAIN:-}" ]] && BASE_URL="https://${API_DOMAIN}"

echo ""
echo -e "${CYAN}${BOLD}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}${BOLD}║         AURORA IA — Conexão WhatsApp                     ║${NC}"
echo -e "${CYAN}${BOLD}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# ── Passo 1: Nome da instância ───────────────────────────────
read -p "$(echo -e "${BOLD}Nome da instância${NC} (ex: aurora-principal): ")" INSTANCE_NAME
INSTANCE_NAME=${INSTANCE_NAME:-aurora-principal}

# Sanitizar nome (apenas letras, números e hífen)
INSTANCE_NAME=$(echo "$INSTANCE_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g')

echo ""
echo -e "${BLUE}[→]${NC} Criando instância: ${BOLD}$INSTANCE_NAME${NC}"

# ── Passo 2: Criar instância ─────────────────────────────────
RESPONSE=$(curl -sf -X POST \
    "${BASE_URL}/instance/create" \
    -H "Content-Type: application/json" \
    -H "apikey: ${EVOLUTION_API_KEY}" \
    -d "{
        \"instanceName\": \"${INSTANCE_NAME}\",
        \"qrcode\": true,
        \"integration\": \"WHATSAPP-BAILEYS\"
    }" 2>&1)

if echo "$RESPONSE" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('instance', {}).get('instanceName',''))" 2>/dev/null | grep -q "$INSTANCE_NAME"; then
    echo -e "${GREEN}[✓]${NC} Instância '${INSTANCE_NAME}' criada com sucesso"
elif echo "$RESPONSE" | grep -qi "already\|existe\|existing"; then
    echo -e "${YELLOW}[!]${NC} Instância já existe — continuando..."
else
    echo -e "${YELLOW}[!]${NC} Resposta: $RESPONSE"
fi

# ── Passo 3: Conectar e gerar QR ─────────────────────────────
echo ""
echo -e "${BLUE}[→]${NC} Gerando QR Code..."

sleep 2

QR_RESPONSE=$(curl -sf \
    "${BASE_URL}/instance/connect/${INSTANCE_NAME}" \
    -H "apikey: ${EVOLUTION_API_KEY}" 2>/dev/null || echo "{}")

# Verificar se já está conectado
STATUS=$(echo "$QR_RESPONSE" | python3 -c "
import json, sys
d = json.load(sys.stdin)
print(d.get('instance', {}).get('state', d.get('state', 'unknown')))
" 2>/dev/null || echo "unknown")

if [[ "$STATUS" == "open" ]]; then
    echo -e "${GREEN}[✓]${NC} WhatsApp já está conectado nesta instância!"
else
    # Tentar extrair QR Code
    QR_CODE=$(echo "$QR_RESPONSE" | python3 -c "
import json, sys
d = json.load(sys.stdin)
qr = d.get('qrcode', {})
if isinstance(qr, dict):
    print(qr.get('base64', '') or qr.get('code', ''))
else:
    print(d.get('base64', '') or d.get('code', ''))
" 2>/dev/null || echo "")

    if [[ -n "$QR_CODE" ]]; then
        echo -e "${GREEN}[✓]${NC} QR Code gerado!"
        echo ""
        echo "  O QR Code está disponível via:"
        echo ""
        echo -e "  ${BOLD}1. Interface Web (recomendado):${NC}"
        echo -e "     ${CYAN}${BASE_URL}/manager${NC}"
        echo ""
        echo -e "  ${BOLD}2. API REST:${NC}"
        echo -e "     ${CYAN}GET ${BASE_URL}/instance/connect/${INSTANCE_NAME}${NC}"
        echo -e "     Header: apikey: ${EVOLUTION_API_KEY}"
        echo ""
        echo -e "  ${BOLD}3. Imagem QR (salvar localmente):${NC}"

        # Salvar QR como HTML para visualização
        cat > /tmp/qrcode_${INSTANCE_NAME}.html << HTMLQR
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>QR Code — ${INSTANCE_NAME}</title>
<style>
body { background: #0f0f0f; display: flex; align-items: center; justify-content: center;
       height: 100vh; margin: 0; font-family: Arial, sans-serif; }
.box { background: white; padding: 40px; border-radius: 16px; text-align: center; }
h2 { color: #333; margin-top: 20px; }
p  { color: #666; font-size: 14px; }
</style>
</head>
<body>
<div class="box">
  <img src="data:image/png;base64,${QR_CODE}" width="300" height="300" alt="QR Code">
  <h2>Escaneie com o WhatsApp</h2>
  <p>Instância: ${INSTANCE_NAME}</p>
  <p>Gerado em: $(date '+%d/%m/%Y %H:%M:%S')</p>
</div>
</body>
</html>
HTMLQR
        echo "     Arquivo HTML salvo: /tmp/qrcode_${INSTANCE_NAME}.html"
    else
        echo -e "${YELLOW}[!]${NC} QR Code não retornado diretamente. Acesse a interface web:"
        echo ""
        echo -e "  ${CYAN}${BASE_URL}/manager${NC}"
    fi
fi

# ── Passo 4: Monitorar conexão ───────────────────────────────
echo ""
echo -e "${BLUE}[→]${NC} Monitorando conexão (aguardando você escanear o QR)..."
echo "  Pressione Ctrl+C para cancelar"
echo ""

for i in {1..24}; do
    sleep 5

    CONN_STATUS=$(curl -sf \
        "${BASE_URL}/instance/connectionState/${INSTANCE_NAME}" \
        -H "apikey: ${EVOLUTION_API_KEY}" 2>/dev/null | \
        python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('instance',{}).get('state','unknown'))" 2>/dev/null || echo "unknown")

    printf "\r  [%ds] Status: %-20s" "$((i*5))" "$CONN_STATUS"

    if [[ "$CONN_STATUS" == "open" ]]; then
        echo ""
        echo ""
        echo -e "${GREEN}${BOLD}[✓] WhatsApp conectado com sucesso!${NC}"
        echo ""
        break
    fi
done

# ── Resultado ────────────────────────────────────────────────
echo ""
FINAL_STATUS=$(curl -sf \
    "${BASE_URL}/instance/connectionState/${INSTANCE_NAME}" \
    -H "apikey: ${EVOLUTION_API_KEY}" 2>/dev/null | \
    python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('instance',{}).get('state','unknown'))" 2>/dev/null || echo "unknown")

if [[ "$FINAL_STATUS" == "open" ]]; then
    echo -e "${GREEN}${BOLD}Instância '${INSTANCE_NAME}' conectada ao WhatsApp!${NC}"
    echo ""
    echo "  Próximos passos — Integração com Aurora IA:"
    echo ""
    echo "  1. Configure o webhook no Evolution API:"
    echo -e "     ${CYAN}POST ${BASE_URL}/webhook/set/${INSTANCE_NAME}${NC}"
    echo "     Body:"
    echo '     {'
    echo '       "url": "https://SEU-AURORA-IA.com/webhook/whatsapp",'
    echo '       "webhook_by_events": true,'
    echo '       "webhook_base64": true,'
    echo '       "events": ["MESSAGES_UPSERT","CONNECTION_UPDATE","QRCODE_UPDATED"]'
    echo '     }'
    echo ""
    echo "  2. Teste o envio de mensagem:"
    echo -e "     ${CYAN}POST ${BASE_URL}/message/sendText/${INSTANCE_NAME}${NC}"
    echo '     Body: {"number":"5511999999999","text":"Teste Aurora IA"}'
    echo ""
else
    echo -e "${YELLOW}[!]${NC} Status atual: $FINAL_STATUS"
    echo ""
    echo "  Para tentar novamente:"
    echo -e "  ${CYAN}GET ${BASE_URL}/instance/connect/${INSTANCE_NAME}${NC}"
    echo -e "  Header: apikey: ${EVOLUTION_API_KEY}"
    echo ""
    echo "  Ou acesse o manager web: ${CYAN}${BASE_URL}/manager${NC}"
fi
echo ""
