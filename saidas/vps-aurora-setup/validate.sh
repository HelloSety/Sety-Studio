#!/bin/bash
# ============================================================
# AURORA IA — Script de Validação Completa
# Execute a qualquer momento para verificar o ambiente
# ============================================================
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

[[ $EUID -ne 0 ]] && echo -e "${YELLOW}Recomendado: sudo bash validate.sh${NC}"

ENV_FILE="/opt/evolution/.env"
[[ ! -f "$ENV_FILE" ]] && { echo -e "${RED}Arquivo .env não encontrado. Setup não executado?${NC}"; exit 1; }
source "$ENV_FILE"

PASS=0
FAIL=0
WARN_COUNT=0

ok()   { echo -e "  ${GREEN}[✓]${NC} $1"; PASS=$((PASS+1)); }
fail() { echo -e "  ${RED}[✗]${NC} $1"; FAIL=$((FAIL+1)); }
warn() { echo -e "  ${YELLOW}[!]${NC} $1"; WARN_COUNT=$((WARN_COUNT+1)); }
section() { echo -e "\n${CYAN}${BOLD}▸ $1${NC}"; }

echo ""
echo -e "${CYAN}${BOLD}╔══════════════════════════════════════════╗${NC}"
echo -e "${CYAN}${BOLD}║   AURORA IA — Validação do Ambiente      ║${NC}"
echo -e "${CYAN}${BOLD}╚══════════════════════════════════════════╝${NC}"

# ── Containers ──────────────────────────────────────────────
section "CONTAINERS DOCKER"

check_container() {
    local NAME="$1"
    if docker ps --format '{{.Names}}' | grep -q "^${NAME}$"; then
        STATUS=$(docker inspect --format='{{.State.Status}}' "$NAME")
        HEALTH=$(docker inspect --format='{{if .State.Health}}{{.State.Health.Status}}{{else}}no-healthcheck{{end}}' "$NAME")
        if [[ "$STATUS" == "running" && ("$HEALTH" == "healthy" || "$HEALTH" == "no-healthcheck") ]]; then
            ok "$NAME — running (health: $HEALTH)"
        else
            fail "$NAME — $STATUS (health: $HEALTH)"
        fi
    else
        fail "$NAME — não encontrado"
    fi
}

check_container aurora_postgres
check_container aurora_redis
check_container aurora_evolution
check_container aurora_nginx

# ── PostgreSQL ──────────────────────────────────────────────
section "POSTGRESQL"

if docker exec aurora_postgres pg_isready -U postgres -q 2>/dev/null; then
    ok "PostgreSQL aceita conexões"

    # Verificar bancos
    DBS=$(docker exec aurora_postgres psql -U postgres -t -c '\l' 2>/dev/null)

    if echo "$DBS" | grep -q "${EVOLUTION_DB_NAME}"; then
        ok "Banco '${EVOLUTION_DB_NAME}' existe"
    else
        fail "Banco '${EVOLUTION_DB_NAME}' NÃO encontrado"
    fi

    if echo "$DBS" | grep -q "${AURORA_DB_NAME}"; then
        ok "Banco '${AURORA_DB_NAME}' existe"
    else
        fail "Banco '${AURORA_DB_NAME}' NÃO encontrado"
    fi

    # Verificar conexão com credenciais da Evolution
    if docker exec aurora_postgres psql -U "${EVOLUTION_DB_USER}" -d "${EVOLUTION_DB_NAME}" -c '\q' 2>/dev/null; then
        ok "Usuário '${EVOLUTION_DB_USER}' autenticado com sucesso"
    else
        fail "Falha de autenticação para '${EVOLUTION_DB_USER}'"
    fi
else
    fail "PostgreSQL não responde"
fi

# ── Redis ────────────────────────────────────────────────────
section "REDIS"

REDIS_PONG=$(docker exec aurora_redis redis-cli -a "${REDIS_PASSWORD}" ping 2>/dev/null || echo "FAIL")
if [[ "$REDIS_PONG" == "PONG" ]]; then
    ok "Redis responde ao PING"
    # Verificar memória
    REDIS_MEM=$(docker exec aurora_redis redis-cli -a "${REDIS_PASSWORD}" info memory 2>/dev/null | grep used_memory_human | cut -d: -f2 | tr -d '\r ')
    ok "Memória em uso: $REDIS_MEM"
else
    fail "Redis não responde (senha incorreta ou serviço parado)"
fi

# ── Evolution API ────────────────────────────────────────────
section "EVOLUTION API"

EVOLUTION_URL="http://localhost:8080"

if curl -sf "${EVOLUTION_URL}/" -o /dev/null -w "%{http_code}" 2>/dev/null | grep -qE "200|401|403"; then
    ok "Evolution API respondendo em $EVOLUTION_URL"
else
    fail "Evolution API não acessível em $EVOLUTION_URL"
fi

# Testar autenticação
HTTP_CODE=$(curl -sf -o /dev/null -w "%{http_code}" \
    -H "apikey: ${EVOLUTION_API_KEY}" \
    "${EVOLUTION_URL}/instance/fetchInstances" 2>/dev/null || echo "000")

if [[ "$HTTP_CODE" == "200" ]]; then
    ok "Autenticação API funcionando (200)"

    # Contar instâncias
    INSTANCES=$(curl -sf \
        -H "apikey: ${EVOLUTION_API_KEY}" \
        "${EVOLUTION_URL}/instance/fetchInstances" 2>/dev/null | \
        python3 -c "import json,sys; data=json.load(sys.stdin); print(len(data) if isinstance(data, list) else 0)" 2>/dev/null || echo "?")
    ok "Instâncias WhatsApp ativas: $INSTANCES"
elif [[ "$HTTP_CODE" == "401" ]]; then
    fail "API Key inválida (401)"
else
    warn "Resposta inesperada: HTTP $HTTP_CODE"
fi

# ── Nginx ────────────────────────────────────────────────────
section "NGINX"

if docker exec aurora_nginx nginx -t 2>/dev/null; then
    ok "Configuração Nginx válida"
else
    fail "Erro na configuração do Nginx"
fi

# Verificar portas
if ss -tlnp 2>/dev/null | grep -q ':80 '; then
    ok "Porta 80 ouvindo"
else
    warn "Porta 80 não detectada"
fi

if ss -tlnp 2>/dev/null | grep -q ':443 '; then
    ok "Porta 443 ouvindo"
else
    warn "Porta 443 não detectada (SSL pode não estar configurado)"
fi

# ── SSL ──────────────────────────────────────────────────────
section "SSL / HTTPS"

if [[ -n "${API_DOMAIN:-}" ]]; then
    if curl -sf "https://${API_DOMAIN}/" -o /dev/null --max-time 10 2>/dev/null; then
        ok "HTTPS ${API_DOMAIN} funcionando"
        # Verificar validade do cert
        CERT_EXPIRY=$(echo | openssl s_client -servername "${API_DOMAIN}" -connect "${API_DOMAIN}:443" 2>/dev/null | \
            openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2 || echo "N/A")
        ok "Certificado expira: $CERT_EXPIRY"
    else
        warn "HTTPS não configurado ou DNS não resolvendo"
    fi
fi

# ── Firewall ─────────────────────────────────────────────────
section "SEGURANÇA"

if ufw status 2>/dev/null | grep -q "Status: active"; then
    ok "Firewall UFW ativo"
    UFW_RULES=$(ufw status | grep -c "ALLOW" || echo "0")
    ok "Regras UFW: $UFW_RULES"
else
    warn "UFW não está ativo"
fi

if systemctl is-active fail2ban &>/dev/null; then
    ok "Fail2Ban ativo"
    BANNED=$(fail2ban-client status sshd 2>/dev/null | grep "Currently banned" | awk '{print $NF}' || echo "0")
    ok "IPs banidos no SSH: $BANNED"
else
    warn "Fail2Ban não está ativo"
fi

# ── Backups ──────────────────────────────────────────────────
section "BACKUPS"

if crontab -l 2>/dev/null | grep -q "backup.sh"; then
    ok "Cron de backup configurado"
else
    warn "Cron de backup não encontrado"
fi

BACKUP_COUNT=$(find /opt/backups/postgres -name "*.sql.gz" 2>/dev/null | wc -l)
if [[ "$BACKUP_COUNT" -gt 0 ]]; then
    LATEST=$(find /opt/backups/postgres -name "*.sql.gz" -printf '%T@ %p\n' | sort -n | tail -1 | cut -d' ' -f2-)
    ok "$BACKUP_COUNT backup(s) encontrado(s) — Último: $(basename $LATEST)"
else
    warn "Nenhum backup encontrado ainda (execute /opt/postgres/scripts/backup.sh)"
fi

# ── Recursos ─────────────────────────────────────────────────
section "RECURSOS DO SISTEMA"

# RAM
RAM_TOTAL=$(free -m | awk 'NR==2{print $2}')
RAM_USED=$(free -m | awk 'NR==2{print $3}')
RAM_PCT=$(free | awk 'NR==2{printf "%.0f", $3/$2*100}')
if [[ "$RAM_PCT" -lt 80 ]]; then
    ok "RAM: ${RAM_USED}MB / ${RAM_TOTAL}MB (${RAM_PCT}%)"
else
    warn "RAM alta: ${RAM_USED}MB / ${RAM_TOTAL}MB (${RAM_PCT}%)"
fi

# Disco
DISK_PCT=$(df /opt -h | awk 'NR==2{gsub("%",""); print $5}')
DISK_AVAIL=$(df /opt -h | awk 'NR==2{print $4}')
if [[ "$DISK_PCT" -lt 80 ]]; then
    ok "Disco /opt: $DISK_PCT% usado (${DISK_AVAIL} disponível)"
else
    warn "Disco quase cheio: $DISK_PCT% usado"
fi

# ── Resultado Final ──────────────────────────────────────────
echo ""
echo -e "${CYAN}${BOLD}━━━ RESULTADO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  Passou  : ${GREEN}${BOLD}$PASS${NC}"
echo -e "  Falhou  : ${RED}${BOLD}$FAIL${NC}"
echo -e "  Alertas : ${YELLOW}${BOLD}$WARN_COUNT${NC}"
echo ""

if [[ $FAIL -eq 0 ]]; then
    echo -e "${GREEN}${BOLD}  Ambiente 100% operacional!${NC}"
elif [[ $FAIL -le 2 ]]; then
    echo -e "${YELLOW}${BOLD}  Ambiente parcialmente funcional. Corrija os erros acima.${NC}"
else
    echo -e "${RED}${BOLD}  Problemas críticos encontrados. Verifique os logs.${NC}"
    echo ""
    echo "  Comandos de diagnóstico:"
    echo "  docker logs aurora_evolution --tail=50"
    echo "  docker logs aurora_postgres --tail=50"
    echo "  docker logs aurora_nginx --tail=50"
fi

echo ""
