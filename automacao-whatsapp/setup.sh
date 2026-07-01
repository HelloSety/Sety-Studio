#!/bin/bash
# Setup VPS — Automação WhatsApp Sety Studio
# Ubuntu 22.04 — rodar como root

set -e

echo "=== Atualizando sistema ==="
apt-get update && apt-get upgrade -y

echo "=== Instalando dependências ==="
apt-get install -y curl wget git unzip

echo "=== Instalando Docker ==="
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

echo "=== Instalando Docker Compose ==="
curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

echo "=== Clonando projeto ==="
mkdir -p /opt/sety-automacao
# Copie os arquivos desta pasta para /opt/sety-automacao/ na VPS

echo "=== Configurando firewall ==="
ufw allow 22/tcp    # SSH
ufw allow 8080/tcp  # Evolution API
ufw allow 5678/tcp  # N8N
ufw --force enable

echo ""
echo "✅ Setup concluído!"
echo ""
echo "Próximos passos:"
echo "1. Copiar arquivos para /opt/sety-automacao/"
echo "2. cp .env.example .env && nano .env  (preencher variáveis)"
echo "3. docker-compose up -d"
echo "4. Rodar scripts/configurar-evolution.sh"
echo "5. Importar workflows N8N (n8n/)"
echo "6. Importar flow Typebot (typebot/)"
