#!/bin/bash
# ============================================================
# AURORA IA — VPS Setup Script
# Ubuntu 22.04 | Docker | Evolution API v2 | PostgreSQL | Redis
# Sety Studio — github.com/setystudio
# ============================================================
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

log()   { echo -e "${GREEN}[✓]${NC} $1"; }
warn()  { echo -e "${YELLOW}[!]${NC} $1"; }
error() { echo -e "${RED}[✗]${NC} $1"; exit 1; }
info()  { echo -e "${BLUE}[→]${NC} $1"; }
step()  { echo -e "\n${CYAN}${BOLD}━━━ $1 ━━━${NC}\n"; }

# ============================================================
# PRÉ-VERIFICAÇÃO
# ============================================================

[[ $EUID -ne 0 ]] && error "Execute como root: sudo bash setup.sh"
[[ "$(lsb_release -rs 2>/dev/null)" != "22.04" ]] && warn "Testado no Ubuntu 22.04. Versão atual: $(lsb_release -rs)"

# ============================================================
# BANNER
# ============================================================
clear
echo -e "${BLUE}${BOLD}"
cat << 'EOF'
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║          AURORA IA — Configuração de Infraestrutura      ║
║          Evolution API v2 + PostgreSQL + Redis + Nginx   ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# ============================================================
# COLETA DE CONFIGURAÇÃO
# ============================================================
step "CONFIGURAÇÃO INICIAL"

read -p "$(echo -e "${BOLD}Domínio principal${NC} (ex: setydigital.com): ")" DOMAIN
[[ -z "$DOMAIN" ]] && error "Domínio é obrigatório"

read -p "$(echo -e "${BOLD}Subdomínio da Evolution API${NC} (ex: api → api.${DOMAIN}): ")" API_SUB
API_SUB=${API_SUB:-api}

read -p "$(echo -e "${BOLD}Subdomínio do CRM${NC} (ex: crm → crm.${DOMAIN}): ")" CRM_SUB
CRM_SUB=${CRM_SUB:-crm}

read -p "$(echo -e "${BOLD}Subdomínio do N8N${NC} (ex: n8n → n8n.${DOMAIN}): ")" N8N_SUB
N8N_SUB=${N8N_SUB:-n8n}

read -p "$(echo -e "${BOLD}Email para SSL Let's Encrypt${NC}: ")" SSL_EMAIL
[[ -z "$SSL_EMAIL" ]] && error "Email é obrigatório para SSL"

echo ""
read -s -p "$(echo -e "${BOLD}Senha do PostgreSQL${NC} (min 16 chars): ")" POSTGRES_PASSWORD
echo ""
[[ ${#POSTGRES_PASSWORD} -lt 16 ]] && error "Senha deve ter pelo menos 16 caracteres"

read -s -p "$(echo -e "${BOLD}API Key da Evolution API${NC} (min 32 chars): ")" EVOLUTION_API_KEY
echo ""
[[ ${#EVOLUTION_API_KEY} -lt 32 ]] && error "API Key deve ter pelo menos 32 caracteres"

read -s -p "$(echo -e "${BOLD}Senha do Redis${NC} (min 16 chars): ")" REDIS_PASSWORD
echo ""
[[ ${#REDIS_PASSWORD} -lt 16 ]] && error "Senha do Redis deve ter pelo menos 16 caracteres"

echo ""
read -p "$(echo -e "${BOLD}Configurar SSL agora?${NC} (requer DNS apontado para esta VPS) [y/N]: ")" SETUP_SSL
SETUP_SSL=${SETUP_SSL:-n}

# Derivar domínios completos
API_DOMAIN="${API_SUB}.${DOMAIN}"
CRM_DOMAIN="${CRM_SUB}.${DOMAIN}"
N8N_DOMAIN="${N8N_SUB}.${DOMAIN}"

# Senha aleatória para usuário Evolution no banco
EVOLUTION_DB_USER="evolution"
EVOLUTION_DB_NAME="evolution_db"

# Aurora IA database
AURORA_DB_USER="aurora"
AURORA_DB_NAME="aurora_db"
AURORA_DB_PASSWORD=$(openssl rand -hex 24)

echo ""
info "Configuração coletada:"
echo "  Domínio principal : $DOMAIN"
echo "  Evolution API     : https://$API_DOMAIN"
echo "  CRM               : https://$CRM_DOMAIN"
echo "  N8N               : https://$N8N_DOMAIN"
echo ""
read -p "Confirmar e iniciar instalação? [y/N]: " CONFIRM
[[ "${CONFIRM,,}" != "y" ]] && error "Instalação cancelada."

# ============================================================
# FASE 1: SISTEMA
# ============================================================
step "FASE 1: ATUALIZAÇÃO DO SISTEMA"

apt-get update -qq
apt-get upgrade -y -qq
apt-get install -y -qq \
    curl wget git nano htop unzip \
    ca-certificates gnupg lsb-release \
    ufw fail2ban \
    openssl \
    cron

log "Sistema atualizado"

# ============================================================
# FASE 2: DOCKER
# ============================================================
step "FASE 2: INSTALAÇÃO DO DOCKER"

if ! command -v docker &>/dev/null; then
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
        https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
        > /etc/apt/sources.list.d/docker.list
    apt-get update -qq
    apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    systemctl enable docker
    systemctl start docker
    log "Docker instalado"
else
    log "Docker já instalado: $(docker --version)"
fi

docker --version
docker compose version

# ============================================================
# FASE 3: ESTRUTURA DE DIRETÓRIOS
# ============================================================
step "FASE 3: ESTRUTURA DE DIRETÓRIOS"

mkdir -p /opt/evolution
mkdir -p /opt/postgres/{scripts,data}
mkdir -p /opt/redis/data
mkdir -p /opt/nginx/{conf.d,certbot/conf,certbot/www,logs}
mkdir -p /opt/backups/{postgres,redis,daily,weekly}

log "Diretórios criados"

# ============================================================
# FASE 4: ARQUIVO .ENV
# ============================================================
step "FASE 4: VARIÁVEIS DE AMBIENTE"

cat > /opt/evolution/.env << ENVFILE
# ============================================================
# AURORA IA — Variáveis de Ambiente
# Gerado em: $(date '+%Y-%m-%d %H:%M:%S')
# ============================================================

# DOMÍNIOS
DOMAIN=${DOMAIN}
API_DOMAIN=${API_DOMAIN}
CRM_DOMAIN=${CRM_DOMAIN}
N8N_DOMAIN=${N8N_DOMAIN}

# POSTGRESQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
POSTGRES_DB=postgres

# BANCO — Evolution API
EVOLUTION_DB_USER=${EVOLUTION_DB_USER}
EVOLUTION_DB_PASSWORD=${POSTGRES_PASSWORD}
EVOLUTION_DB_NAME=${EVOLUTION_DB_NAME}

# BANCO — Aurora IA
AURORA_DB_USER=${AURORA_DB_USER}
AURORA_DB_PASSWORD=${AURORA_DB_PASSWORD}
AURORA_DB_NAME=${AURORA_DB_NAME}

# REDIS
REDIS_PASSWORD=${REDIS_PASSWORD}

# EVOLUTION API
EVOLUTION_API_KEY=${EVOLUTION_API_KEY}
ENVFILE

chmod 600 /opt/evolution/.env
log ".env criado em /opt/evolution/.env"

# Exportar variáveis para uso nos heredocs abaixo
export DOMAIN API_DOMAIN CRM_DOMAIN N8N_DOMAIN
export POSTGRES_PASSWORD EVOLUTION_DB_USER EVOLUTION_DB_NAME AURORA_DB_USER AURORA_DB_NAME AURORA_DB_PASSWORD
export REDIS_PASSWORD EVOLUTION_API_KEY

# ============================================================
# FASE 5: DOCKER COMPOSE
# ============================================================
step "FASE 5: DOCKER COMPOSE"

cat > /opt/evolution/docker-compose.yml << 'COMPOSEFILE'
version: '3.9'

networks:
  aurora_net:
    driver: bridge
    name: aurora_net

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  evolution_instances:
    driver: local
  nginx_certs:
    driver: local

services:

  # ──────────────────────────────────────────
  # POSTGRESQL
  # ──────────────────────────────────────────
  postgres:
    image: postgres:15-alpine
    container_name: aurora_postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB:-postgres}
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - /opt/postgres/scripts:/docker-entrypoint-initdb.d:ro
    networks:
      - aurora_net
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-postgres}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  # ──────────────────────────────────────────
  # REDIS
  # ──────────────────────────────────────────
  redis:
    image: redis:7-alpine
    container_name: aurora_redis
    restart: unless-stopped
    command: >
      redis-server
      --requirepass ${REDIS_PASSWORD}
      --maxmemory 256mb
      --maxmemory-policy allkeys-lru
      --save 900 1
      --save 300 10
      --save 60 10000
      --appendonly yes
      --appendfsync everysec
    volumes:
      - redis_data:/data
    networks:
      - aurora_net
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  # ──────────────────────────────────────────
  # EVOLUTION API v2
  # ──────────────────────────────────────────
  evolution:
    image: atendai/evolution-api:latest
    container_name: aurora_evolution
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      # Servidor
      SERVER_URL: https://${API_DOMAIN}
      SERVER_PORT: "8080"
      CORS_ORIGIN: "*"
      CORS_METHODS: "GET,POST,PUT,DELETE"
      CORS_CREDENTIALS: "true"

      # Autenticação
      AUTHENTICATION_TYPE: apikey
      AUTHENTICATION_API_KEY: ${EVOLUTION_API_KEY}
      AUTHENTICATION_EXPOSE_IN_FETCH_INSTANCES: "true"

      # Banco de Dados
      DATABASE_ENABLED: "true"
      DATABASE_PROVIDER: postgresql
      DATABASE_CONNECTION_URI: "postgresql://${EVOLUTION_DB_USER}:${EVOLUTION_DB_PASSWORD}@postgres:5432/${EVOLUTION_DB_NAME}?schema=public"
      DATABASE_CONNECTION_CLIENT_NAME: evolution_client
      DATABASE_SAVE_DATA_INSTANCE: "true"
      DATABASE_SAVE_DATA_NEW_MESSAGE: "true"
      DATABASE_SAVE_MESSAGE_UPDATE: "true"
      DATABASE_SAVE_DATA_CONTACTS: "true"
      DATABASE_SAVE_DATA_CHATS: "true"
      DATABASE_SAVE_DATA_LABELS: "true"
      DATABASE_SAVE_DATA_HISTORIC: "true"

      # Redis
      CACHE_REDIS_ENABLED: "true"
      CACHE_REDIS_URI: "redis://:${REDIS_PASSWORD}@redis:6379"
      CACHE_REDIS_PREFIX_KEY: "evolution"
      CACHE_REDIS_SAVE_INSTANCES: "true"
      CACHE_LOCAL_ENABLED: "false"

      # QR Code
      QRCODE_LIMIT: "30"
      QRCODE_COLOR: "#00B5D8"

      # Instâncias
      DEL_INSTANCE: "false"
      DEL_TEMP_INSTANCES: "false"

      # Webhook Global (preencher depois com URL do Aurora)
      WEBHOOK_GLOBAL_URL: ""
      WEBHOOK_GLOBAL_ENABLED: "false"
      WEBHOOK_GLOBAL_WEBHOOK_BY_EVENTS: "false"

      # Storage (S3 desabilitado por padrão)
      S3_ENABLED: "false"

      # Logs
      LOG_LEVEL: "ERROR"
      LOG_COLOR: "true"
      LOG_BAILEYS: "error"

      # Timezone
      TZ: "America/Sao_Paulo"

    volumes:
      - evolution_instances:/evolution/instances
    ports:
      - "8080:8080"
    networks:
      - aurora_net
    healthcheck:
      test: ["CMD-SHELL", "curl -sf http://localhost:8080/ || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 60s
    logging:
      driver: "json-file"
      options:
        max-size: "50m"
        max-file: "5"

  # ──────────────────────────────────────────
  # NGINX (Reverse Proxy)
  # ──────────────────────────────────────────
  nginx:
    image: nginx:alpine
    container_name: aurora_nginx
    restart: unless-stopped
    depends_on:
      evolution:
        condition: service_healthy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /opt/nginx/conf.d:/etc/nginx/conf.d:ro
      - /opt/nginx/certbot/conf:/etc/letsencrypt:ro
      - /opt/nginx/certbot/www:/var/www/certbot:ro
      - /opt/nginx/logs:/var/log/nginx
    networks:
      - aurora_net
    healthcheck:
      test: ["CMD", "nginx", "-t"]
      interval: 30s
      timeout: 10s
      retries: 3
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
COMPOSEFILE

# Substituir variáveis no docker-compose.yml
sed -i \
    -e "s|\${API_DOMAIN}|${API_DOMAIN}|g" \
    -e "s|\${CRM_DOMAIN}|${CRM_DOMAIN}|g" \
    -e "s|\${N8N_DOMAIN}|${N8N_DOMAIN}|g" \
    -e "s|\${POSTGRES_PASSWORD}|${POSTGRES_PASSWORD}|g" \
    -e "s|\${EVOLUTION_DB_USER}|${EVOLUTION_DB_USER}|g" \
    -e "s|\${EVOLUTION_DB_PASSWORD}|${POSTGRES_PASSWORD}|g" \
    -e "s|\${EVOLUTION_DB_NAME}|${EVOLUTION_DB_NAME}|g" \
    -e "s|\${REDIS_PASSWORD}|${REDIS_PASSWORD}|g" \
    -e "s|\${EVOLUTION_API_KEY}|${EVOLUTION_API_KEY}|g" \
    /opt/evolution/docker-compose.yml

log "docker-compose.yml criado"

# ============================================================
# FASE 6: SCRIPT DE INICIALIZAÇÃO DO BANCO
# ============================================================
step "FASE 6: INICIALIZAÇÃO DO POSTGRESQL"

cat > /opt/postgres/scripts/01_init.sql << SQLFILE
-- ============================================================
-- AURORA IA — Inicialização do Banco de Dados
-- ============================================================

-- Usuário e banco da Evolution API
CREATE USER ${EVOLUTION_DB_USER} WITH PASSWORD '${POSTGRES_PASSWORD}';
CREATE DATABASE ${EVOLUTION_DB_NAME} OWNER ${EVOLUTION_DB_USER};
GRANT ALL PRIVILEGES ON DATABASE ${EVOLUTION_DB_NAME} TO ${EVOLUTION_DB_USER};

-- Usuário e banco do Aurora IA (reservado para integração)
CREATE USER ${AURORA_DB_USER} WITH PASSWORD '${AURORA_DB_PASSWORD}';
CREATE DATABASE ${AURORA_DB_NAME} OWNER ${AURORA_DB_USER};
GRANT ALL PRIVILEGES ON DATABASE ${AURORA_DB_NAME} TO ${AURORA_DB_USER};

-- Extensões úteis
\c ${EVOLUTION_DB_NAME}
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

\c ${AURORA_DB_NAME}
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

\echo 'Bancos de dados inicializados com sucesso'
SQLFILE

chmod 644 /opt/postgres/scripts/01_init.sql
log "Scripts SQL criados"

# ============================================================
# FASE 7: CONFIGURAÇÃO DO NGINX
# ============================================================
step "FASE 7: NGINX — CONFIGURAÇÃO HTTP"

# Config principal nginx
cat > /opt/nginx/conf.d/main.conf << 'NGINXMAIN'
# Configuração global de segurança
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Gzip
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=30r/s;
limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/m;
NGINXMAIN

# Config HTTP inicial (para ACME challenge + redirect)
cat > /opt/nginx/conf.d/evolution.conf << NGINXHTTP
# ── Evolution API ──────────────────────────────────────────

server {
    listen 80;
    listen [::]:80;
    server_name ${API_DOMAIN};

    # ACME Challenge (Let's Encrypt)
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://\$host\$request_uri;
    }
}

# ── CRM (placeholder) ──────────────────────────────────────

server {
    listen 80;
    listen [::]:80;
    server_name ${CRM_DOMAIN};

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://\$host\$request_uri;
    }
}

# ── N8N (placeholder) ──────────────────────────────────────

server {
    listen 80;
    listen [::]:80;
    server_name ${N8N_DOMAIN};

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://\$host\$request_uri;
    }
}
NGINXHTTP

log "Nginx HTTP configurado"

# ============================================================
# FASE 8: INICIAR SERVIÇOS
# ============================================================
step "FASE 8: INICIANDO SERVIÇOS"

cd /opt/evolution

info "Iniciando PostgreSQL e Redis..."
docker compose up -d postgres redis

info "Aguardando banco de dados (30s)..."
sleep 30

# Verificar saúde
POSTGRES_HEALTHY=false
for i in {1..10}; do
    if docker compose exec -T postgres pg_isready -U postgres &>/dev/null; then
        POSTGRES_HEALTHY=true
        break
    fi
    sleep 5
done

[[ "$POSTGRES_HEALTHY" == "false" ]] && error "PostgreSQL não iniciou corretamente"
log "PostgreSQL saudável"

REDIS_HEALTHY=false
for i in {1..10}; do
    if docker compose exec -T redis redis-cli -a "${REDIS_PASSWORD}" ping 2>/dev/null | grep -q PONG; then
        REDIS_HEALTHY=true
        break
    fi
    sleep 3
done

[[ "$REDIS_HEALTHY" == "false" ]] && error "Redis não iniciou corretamente"
log "Redis saudável"

info "Iniciando Evolution API..."
docker compose up -d evolution

info "Aguardando Evolution API (60s)..."
sleep 60

EVOLUTION_HEALTHY=false
for i in {1..12}; do
    if docker compose exec -T evolution curl -sf http://localhost:8080/ &>/dev/null; then
        EVOLUTION_HEALTHY=true
        break
    fi
    sleep 10
done

[[ "$EVOLUTION_HEALTHY" == "false" ]] && {
    warn "Evolution API pode estar iniciando. Verificando logs..."
    docker compose logs evolution --tail=20
}

log "Evolution API iniciada"

# ============================================================
# FASE 9: NGINX + SSL
# ============================================================
step "FASE 9: NGINX + SSL"

info "Iniciando Nginx (HTTP)..."
docker compose up -d nginx
sleep 5

if [[ "${SETUP_SSL,,}" == "y" ]]; then
    info "Obtendo certificados SSL..."

    docker run --rm \
        -v /opt/nginx/certbot/conf:/etc/letsencrypt \
        -v /opt/nginx/certbot/www:/var/www/certbot \
        certbot/certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email "${SSL_EMAIL}" \
        --agree-tos \
        --no-eff-email \
        -d "${API_DOMAIN}" \
        -d "${CRM_DOMAIN}" \
        -d "${N8N_DOMAIN}" \
        2>&1 || warn "SSL falhou — verifique se o DNS está apontado para esta VPS"

    # Adicionar config HTTPS para Evolution API
    cat >> /opt/nginx/conf.d/evolution.conf << NGINXHTTPS

# ── Evolution API HTTPS ─────────────────────────────────────

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${API_DOMAIN};

    ssl_certificate     /etc/letsencrypt/live/${API_DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${API_DOMAIN}/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 10m;

    # Headers de segurança
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Rate limiting na API
    limit_req zone=api burst=50 nodelay;

    location / {
        proxy_pass http://evolution:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 60s;
        proxy_send_timeout 300s;
        client_max_body_size 50M;
    }
}

# ── CRM HTTPS (placeholder) ────────────────────────────────

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${CRM_DOMAIN};

    ssl_certificate     /etc/letsencrypt/live/${API_DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${API_DOMAIN}/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;

    add_header Strict-Transport-Security "max-age=31536000" always;

    location / {
        return 200 '<html><body><h2>CRM Aurora IA — Em breve</h2></body></html>';
        add_header Content-Type text/html;
    }
}

# ── N8N HTTPS (placeholder) ────────────────────────────────

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${N8N_DOMAIN};

    ssl_certificate     /etc/letsencrypt/live/${API_DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${API_DOMAIN}/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;

    add_header Strict-Transport-Security "max-age=31536000" always;

    location / {
        return 200 '<html><body><h2>N8N Aurora IA — Em breve</h2></body></html>';
        add_header Content-Type text/html;
    }
}
NGINXHTTPS

    docker compose exec nginx nginx -s reload
    log "SSL configurado e Nginx recarregado"

    # Cron para renovação automática
    (crontab -l 2>/dev/null; echo "0 0,12 * * * docker run --rm -v /opt/nginx/certbot/conf:/etc/letsencrypt -v /opt/nginx/certbot/www:/var/www/certbot certbot/certbot renew --quiet && docker compose -f /opt/evolution/docker-compose.yml exec nginx nginx -s reload") | crontab -
    log "Auto-renovação SSL configurada (cron)"
else
    warn "SSL não configurado. Acesso disponível via HTTP por enquanto."
fi

# ============================================================
# FASE 10: SEGURANÇA
# ============================================================
step "FASE 10: FIREWALL E SEGURANÇA"

# UFW
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

log "Firewall UFW configurado"

# Fail2Ban
cat > /etc/fail2ban/jail.local << 'FAIL2BAN'
[DEFAULT]
bantime  = 3600
findtime = 600
maxretry = 5
backend  = systemd

[sshd]
enabled = true
port    = ssh
logpath = %(sshd_log)s

[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled  = true
port     = http,https
logpath  = /opt/nginx/logs/error.log
FAIL2BAN

systemctl enable fail2ban
systemctl restart fail2ban
log "Fail2Ban configurado"

# ============================================================
# FASE 11: SCRIPTS DE OPERAÇÃO
# ============================================================
step "FASE 11: SCRIPTS DE OPERAÇÃO"

# backup.sh
cat > /opt/postgres/scripts/backup.sh << 'BACKUPSCRIPT'
#!/bin/bash
# Backup automático PostgreSQL
set -euo pipefail

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups/postgres"
ENV_FILE="/opt/evolution/.env"

source "$ENV_FILE"

# Backup
docker exec aurora_postgres pg_dumpall -U postgres | gzip > "${BACKUP_DIR}/full_${TIMESTAMP}.sql.gz"

# Manter últimos 7 dias
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +7 -delete

echo "[$(date)] Backup concluído: full_${TIMESTAMP}.sql.gz"
BACKUPSCRIPT

chmod +x /opt/postgres/scripts/backup.sh
log "backup.sh criado"

# restore.sh
cat > /opt/postgres/scripts/restore.sh << 'RESTORESCRIPT'
#!/bin/bash
# Restauração do PostgreSQL
set -euo pipefail

BACKUP_FILE="$1"
ENV_FILE="/opt/evolution/.env"

[[ -z "$BACKUP_FILE" ]] && { echo "Uso: $0 /caminho/para/backup.sql.gz"; exit 1; }
[[ ! -f "$BACKUP_FILE" ]] && { echo "Arquivo não encontrado: $BACKUP_FILE"; exit 1; }

source "$ENV_FILE"

echo "ATENÇÃO: Isso vai restaurar o banco. Continuar? (y/N)"
read -r CONFIRM
[[ "${CONFIRM,,}" != "y" ]] && exit 0

echo "Restaurando $BACKUP_FILE..."
gunzip -c "$BACKUP_FILE" | docker exec -i aurora_postgres psql -U postgres

echo "Restauração concluída!"
RESTORESCRIPT

chmod +x /opt/postgres/scripts/restore.sh

# Cron backup diário 3h
(crontab -l 2>/dev/null; echo "0 3 * * * /opt/postgres/scripts/backup.sh >> /opt/backups/backup.log 2>&1") | crontab -
log "Cron de backup diário configurado (03:00)"

# monitor.sh
cp "$(dirname "$0")/monitor.sh" /opt/monitor.sh 2>/dev/null || true
chmod +x /opt/monitor.sh 2>/dev/null || true

# ============================================================
# FASE 12: VALIDAÇÃO
# ============================================================
step "FASE 12: VALIDAÇÃO DO AMBIENTE"

echo ""
ERRORS=0

check() {
    local NAME="$1"
    local CMD="$2"
    if eval "$CMD" &>/dev/null; then
        echo -e "  ${GREEN}[✓]${NC} $NAME"
    else
        echo -e "  ${RED}[✗]${NC} $NAME"
        ERRORS=$((ERRORS + 1))
    fi
}

check "PostgreSQL saudável"   "docker exec aurora_postgres pg_isready -U postgres"
check "Redis responde"        "docker exec aurora_redis redis-cli -a '${REDIS_PASSWORD}' ping | grep -q PONG"
check "Evolution API online"  "curl -sf http://localhost:8080/ -o /dev/null"
check "Nginx rodando"         "docker exec aurora_nginx nginx -t"
check "Banco evolution existe" "docker exec aurora_postgres psql -U postgres -lqt | grep -q ${EVOLUTION_DB_NAME}"
check "Banco aurora existe"   "docker exec aurora_postgres psql -U postgres -lqt | grep -q ${AURORA_DB_NAME}"

if [[ "$SETUP_SSL" == "y" ]]; then
    check "HTTPS Evolution"   "curl -sf https://${API_DOMAIN}/ -o /dev/null"
fi

echo ""
if [[ $ERRORS -eq 0 ]]; then
    echo -e "${GREEN}${BOLD}Todas as verificações passaram!${NC}"
else
    echo -e "${YELLOW}${BOLD}$ERRORS verificação(ões) falharam. Cheque os logs.${NC}"
fi

# ============================================================
# RESUMO FINAL
# ============================================================
step "RESUMO — ACESSO E CREDENCIAIS"

cat << SUMMARY

╔══════════════════════════════════════════════════════════════╗
║                 AURORA IA — INFRAESTRUTURA                   ║
╠══════════════════════════════════════════════════════════════╣

 URLS DE ACESSO
 ──────────────────────────────────────────────────────────────
  Evolution API  : https://${API_DOMAIN}
  Evolution (HTTP): http://$(curl -s ifconfig.me 2>/dev/null || echo "IP_DA_VPS"):8080
  CRM            : https://${CRM_DOMAIN}
  N8N            : https://${N8N_DOMAIN}

 EVOLUTION API
 ──────────────────────────────────────────────────────────────
  Endpoint       : https://${API_DOMAIN}
  API Key        : ${EVOLUTION_API_KEY}

  Para criar instância:
  POST https://${API_DOMAIN}/instance/create
  Headers: apikey: ${EVOLUTION_API_KEY}
  Body: {"instanceName":"minha-instancia","qrcode":true}

  Para ver QR Code:
  GET https://${API_DOMAIN}/instance/connect/minha-instancia

 BANCO DE DADOS
 ──────────────────────────────────────────────────────────────
  Host           : localhost:5432 (via Docker)
  Evolution URI  : postgresql://${EVOLUTION_DB_USER}:***@postgres:5432/${EVOLUTION_DB_NAME}
  Aurora URI     : postgresql://${AURORA_DB_USER}:***@postgres:5432/${AURORA_DB_NAME}

  ⚠  Senhas salvas em: /opt/evolution/.env

 REDIS
 ──────────────────────────────────────────────────────────────
  URI            : redis://:***@redis:6379
  Prefixo        : evolution

 DIRETÓRIOS
 ──────────────────────────────────────────────────────────────
  Compose        : /opt/evolution/docker-compose.yml
  Variáveis      : /opt/evolution/.env
  Nginx          : /opt/nginx/conf.d/
  Backups        : /opt/backups/postgres/
  Scripts        : /opt/postgres/scripts/

 COMANDOS ÚTEIS
 ──────────────────────────────────────────────────────────────
  Ver todos os containers : docker ps
  Ver logs Evolution      : docker logs aurora_evolution -f
  Ver logs Nginx          : docker logs aurora_nginx -f
  Reiniciar tudo          : cd /opt/evolution && docker compose restart
  Parar tudo              : cd /opt/evolution && docker compose down
  Backup manual           : /opt/postgres/scripts/backup.sh
  Restaurar backup        : /opt/postgres/scripts/restore.sh /caminho/backup.sql.gz
  Monitoramento           : /opt/monitor.sh

 AURORA IA — INTEGRAÇÃO
 ──────────────────────────────────────────────────────────────
  1. Crie uma instância WhatsApp via POST /instance/create
  2. Escaneie o QR Code via GET /instance/connect/{nome}
  3. Configure o webhook no Aurora IA:
     URL: https://${API_DOMAIN}/webhook/set/{nome}
  4. Banco Aurora disponível: ${AURORA_DB_NAME}
     Credenciais em /opt/evolution/.env

╚══════════════════════════════════════════════════════════════╝

SUMMARY

echo -e "${GREEN}${BOLD}Instalação concluída!${NC}"
echo ""
echo "Próximo passo: Acesse https://${API_DOMAIN} ou http://IP:8080"
echo "Crie uma instância e escaneie o QR Code para conectar seu WhatsApp."
echo ""
