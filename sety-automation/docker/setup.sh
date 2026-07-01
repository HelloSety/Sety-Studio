#!/bin/bash
# Sety Studio — Setup completo na VPS DigitalOcean
# Rodar como root: bash setup.sh

set -e

echo "=== Sety Studio — Setup VPS ==="

# 1. Atualizar sistema
apt-get update -y && apt-get upgrade -y

# 2. Instalar Docker
if ! command -v docker &> /dev/null; then
  echo "[1/5] Instalando Docker..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
else
  echo "[1/5] Docker ja instalado: $(docker --version)"
fi

# 3. Instalar Docker Compose plugin
if ! docker compose version &> /dev/null; then
  echo "[2/5] Instalando Docker Compose..."
  apt-get install -y docker-compose-plugin
else
  echo "[2/5] Docker Compose ja instalado: $(docker compose version)"
fi

# 4. Verificar .env.production
echo "[3/5] Verificando .env.production..."
if [ ! -f ".env.production" ]; then
  echo "ERRO: Arquivo .env.production nao encontrado."
  echo "Copie .env.production e preencha as variaveis antes de continuar."
  exit 1
fi

# Checar senhas padrão não trocadas
if grep -q "TROCAR_SENHA_SEGURA" .env.production; then
  echo "ERRO: Troque as senhas em .env.production antes de continuar."
  exit 1
fi

# 5. Subir serviços
echo "[4/5] Subindo containers..."
docker compose --env-file .env.production -f docker-compose.yml up -d --build

# 6. Aguardar Evolution API
echo "[5/5] Aguardando Evolution API iniciar..."
for i in $(seq 1 30); do
  if docker exec sety-evolution wget -q --spider http://localhost:8080/manager 2>/dev/null; then
    echo "Evolution API pronta!"
    break
  fi
  sleep 3
done

# 7. Criar instância WhatsApp
echo ""
echo "=== Criando instancia WhatsApp ==="
source .env.production

curl -s -X POST "http://localhost:8080/instance/create" \
  -H "apikey: $EVOLUTION_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"instanceName\": \"$EVOLUTION_INSTANCE\",
    \"integration\": \"WHATSAPP-BAILEYS\",
    \"qrcode\": true,
    \"reject_call\": false,
    \"groups_ignore\": false,
    \"always_online\": false,
    \"read_messages\": false,
    \"read_status\": false
  }" | python3 -m json.tool 2>/dev/null || true

echo ""
echo "==================================="
echo "SETUP CONCLUIDO!"
echo "==================================="
echo ""
echo "Proximos passos:"
echo "  1. Acesse o painel Nginx Proxy Manager: http://$(curl -s ifconfig.me):81"
echo "     Login inicial: admin@example.com / changeme"
echo ""
echo "  2. Configure os dominios no NPM:"
echo "     api.seudominio.com.br -> evolution:8080"
echo "     lucas.seudominio.com.br -> lucas:3000 (interno, nao expor)"
echo ""
echo "  3. Escaneie o QR Code para conectar o WhatsApp:"
echo "     GET https://api.seudominio.com.br/instance/connect/$EVOLUTION_INSTANCE"
echo "     Header: apikey: $EVOLUTION_API_KEY"
echo ""
echo "  4. Configure o webhook da instancia no Evolution:"
echo "     POST https://api.seudominio.com.br/webhook/set/$EVOLUTION_INSTANCE"
echo ""
echo "  5. Configure o Supabase (schema.sql) se ainda nao fez."
echo ""
