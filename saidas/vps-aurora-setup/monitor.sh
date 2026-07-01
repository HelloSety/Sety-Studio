#!/bin/bash
# ============================================================
# AURORA IA — Monitor de Sistema
# Relatório de uso de recursos e saúde dos containers
# ============================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

ENV_FILE="/opt/evolution/.env"
[[ -f "$ENV_FILE" ]] && source "$ENV_FILE"

REDIS_PASS="${REDIS_PASSWORD:-}"

clear
echo -e "${CYAN}${BOLD}"
cat << 'EOF'
╔══════════════════════════════════════════════════════════════╗
║              AURORA IA — Monitor de Sistema                  ║
╚══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"
echo "  $(date '+%d/%m/%Y %H:%M:%S')  |  Host: $(hostname)  |  IP: $(curl -s ifconfig.me 2>/dev/null || echo 'N/A')"
echo ""

# ── Recursos do Sistema ──────────────────────────────────────
echo -e "${BOLD}SISTEMA${NC}"
echo "──────────────────────────────────────────────────────────"

# CPU
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print 100 - $8}' | cut -d. -f1 2>/dev/null || echo "N/A")
# Load Average
LOAD=$(uptime | awk -F'load average:' '{print $2}' | xargs)
echo -e "  CPU         : ${CPU_USAGE}%  (load avg: $LOAD)"

# RAM
RAM_TOTAL=$(free -m | awk 'NR==2{print $2}')
RAM_USED=$(free -m | awk 'NR==2{print $3}')
RAM_PCT=$(free | awk 'NR==2{printf "%.0f", $3/$2*100}')
RAM_COLOR=$GREEN
[[ "$RAM_PCT" -gt 70 ]] && RAM_COLOR=$YELLOW
[[ "$RAM_PCT" -gt 85 ]] && RAM_COLOR=$RED
echo -e "  RAM         : ${RAM_COLOR}${RAM_USED}MB / ${RAM_TOTAL}MB (${RAM_PCT}%)${NC}"

# Swap
SWAP_USED=$(free -m | awk 'NR==3{print $3}')
SWAP_TOTAL=$(free -m | awk 'NR==3{print $2}')
echo "  Swap        : ${SWAP_USED}MB / ${SWAP_TOTAL}MB"

# Disco
echo "  Discos:"
df -h --output=target,size,used,avail,pcent | grep -E "^(/|/opt|/var)" | while read -r LINE; do
    PCT=$(echo "$LINE" | awk '{print $5}' | tr -d '%')
    DISK_COLOR=$GREEN
    [[ "$PCT" -gt 70 ]] && DISK_COLOR=$YELLOW
    [[ "$PCT" -gt 85 ]] && DISK_COLOR=$RED
    echo -e "    ${DISK_COLOR}$LINE${NC}"
done

# Uptime
UPTIME=$(uptime -p 2>/dev/null || uptime | awk -F'up ' '{print $2}' | cut -d, -f1)
echo "  Uptime      : $UPTIME"
echo ""

# ── Containers ──────────────────────────────────────────────
echo -e "${BOLD}CONTAINERS DOCKER${NC}"
echo "──────────────────────────────────────────────────────────"

CONTAINERS=("aurora_postgres" "aurora_redis" "aurora_evolution" "aurora_nginx")

for CONTAINER in "${CONTAINERS[@]}"; do
    if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
        STATUS=$(docker inspect --format='{{.State.Status}}' "$CONTAINER")
        HEALTH=$(docker inspect --format='{{if .State.Health}}{{.State.Health.Status}}{{else}}—{{end}}' "$CONTAINER")
        STARTED=$(docker inspect --format='{{.State.StartedAt}}' "$CONTAINER" | cut -c1-19 | tr 'T' ' ')

        # Stats de CPU/RAM do container
        STATS=$(docker stats "$CONTAINER" --no-stream --format "{{.CPUPerc}}|{{.MemUsage}}" 2>/dev/null || echo "N/A|N/A")
        CPU=$(echo "$STATS" | cut -d'|' -f1)
        MEM=$(echo "$STATS" | cut -d'|' -f2)

        COLOR=$GREEN
        [[ "$STATUS" != "running" ]] && COLOR=$RED
        [[ "$HEALTH" == "unhealthy" ]] && COLOR=$RED
        [[ "$HEALTH" == "starting" ]] && COLOR=$YELLOW

        printf "  ${COLOR}%-25s${NC} %-10s  health:%-12s  cpu:%-8s  mem:%s\n" \
            "$CONTAINER" "$STATUS" "$HEALTH" "$CPU" "$MEM"
    else
        echo -e "  ${RED}${CONTAINER}${NC}  —  não encontrado"
    fi
done
echo ""

# ── Evolution API ────────────────────────────────────────────
echo -e "${BOLD}EVOLUTION API${NC}"
echo "──────────────────────────────────────────────────────────"

if [[ -n "${EVOLUTION_API_KEY:-}" ]]; then
    HTTP_STATUS=$(curl -sf -o /dev/null -w "%{http_code}" \
        -H "apikey: ${EVOLUTION_API_KEY}" \
        "http://localhost:8080/instance/fetchInstances" 2>/dev/null || echo "000")

    if [[ "$HTTP_STATUS" == "200" ]]; then
        INSTANCES_JSON=$(curl -sf \
            -H "apikey: ${EVOLUTION_API_KEY}" \
            "http://localhost:8080/instance/fetchInstances" 2>/dev/null || echo "[]")

        TOTAL=$(echo "$INSTANCES_JSON" | python3 -c "import json,sys; d=json.load(sys.stdin); print(len(d) if isinstance(d, list) else 0)" 2>/dev/null || echo "?")
        echo -e "  Status      : ${GREEN}Online${NC}"
        echo "  Instâncias  : $TOTAL"

        # Listar instâncias e status de conexão
        echo "$INSTANCES_JSON" | python3 -c "
import json, sys
data = json.load(sys.stdin)
if isinstance(data, list):
    for inst in data:
        name = inst.get('instance', {}).get('instanceName', '?')
        state = inst.get('instance', {}).get('connectionStatus', '?')
        color = '\033[0;32m' if state == 'open' else '\033[0;31m'
        reset = '\033[0m'
        print(f'    {color}{name:<25}{reset} {state}')
" 2>/dev/null || echo "  (Nenhuma instância)"
    else
        echo -e "  Status      : ${RED}Erro (HTTP $HTTP_STATUS)${NC}"
    fi
else
    echo "  API Key não configurada no .env"
fi
echo ""

# ── Redis ────────────────────────────────────────────────────
echo -e "${BOLD}REDIS${NC}"
echo "──────────────────────────────────────────────────────────"

if [[ -n "$REDIS_PASS" ]]; then
    REDIS_INFO=$(docker exec aurora_redis redis-cli -a "$REDIS_PASS" info 2>/dev/null || echo "")
    if [[ -n "$REDIS_INFO" ]]; then
        REDIS_KEYS=$(docker exec aurora_redis redis-cli -a "$REDIS_PASS" dbsize 2>/dev/null || echo "N/A")
        REDIS_MEM=$(echo "$REDIS_INFO" | grep used_memory_human | cut -d: -f2 | tr -d '\r ')
        REDIS_CONNS=$(echo "$REDIS_INFO" | grep connected_clients | cut -d: -f2 | tr -d '\r ')
        REDIS_HIT=$(echo "$REDIS_INFO" | grep keyspace_hits | cut -d: -f2 | tr -d '\r ')
        REDIS_MISS=$(echo "$REDIS_INFO" | grep keyspace_misses | cut -d: -f2 | tr -d '\r ')
        echo -e "  Status      : ${GREEN}Online${NC}"
        echo "  Chaves      : $REDIS_KEYS"
        echo "  Memória     : $REDIS_MEM"
        echo "  Conexões    : $REDIS_CONNS"
        echo "  Cache hits  : $REDIS_HIT  |  misses: $REDIS_MISS"
    else
        echo -e "  Status      : ${RED}Sem resposta${NC}"
    fi
fi
echo ""

# ── PostgreSQL ──────────────────────────────────────────────
echo -e "${BOLD}POSTGRESQL${NC}"
echo "──────────────────────────────────────────────────────────"

if docker exec aurora_postgres pg_isready -U postgres -q 2>/dev/null; then
    echo -e "  Status      : ${GREEN}Online${NC}"
    CONNECTIONS=$(docker exec aurora_postgres psql -U postgres -t -c \
        "SELECT count(*) FROM pg_stat_activity WHERE state = 'active';" 2>/dev/null | xargs)
    echo "  Conexões    : $CONNECTIONS ativas"

    # Tamanho dos bancos
    docker exec aurora_postgres psql -U postgres -t -c \
        "SELECT datname, pg_size_pretty(pg_database_size(datname)) FROM pg_database WHERE datname NOT IN ('template0','template1','postgres');" \
        2>/dev/null | grep -v '^$' | while read -r LINE; do
        echo "  Banco       : $LINE"
    done
else
    echo -e "  Status      : ${RED}Offline${NC}"
fi
echo ""

# ── Logs Recentes ────────────────────────────────────────────
echo -e "${BOLD}LOGS RECENTES (últimas 5 linhas — apenas erros)${NC}"
echo "──────────────────────────────────────────────────────────"

for CONTAINER in aurora_evolution aurora_nginx; do
    ERRORS=$(docker logs "$CONTAINER" --tail=50 2>&1 | grep -iE "error|fatal|exception" | tail -3 || echo "")
    if [[ -n "$ERRORS" ]]; then
        echo -e "  ${YELLOW}$CONTAINER:${NC}"
        echo "$ERRORS" | while read -r LINE; do echo "    $LINE"; done
    fi
done

echo -e "  (sem erros críticos recentes)"
echo ""

# ── Backups ──────────────────────────────────────────────────
echo -e "${BOLD}BACKUPS${NC}"
echo "──────────────────────────────────────────────────────────"

BACKUP_DIR="/opt/backups/postgres"
if [[ -d "$BACKUP_DIR" ]]; then
    COUNT=$(find "$BACKUP_DIR" -name "*.sql.gz" | wc -l)
    if [[ "$COUNT" -gt 0 ]]; then
        LATEST=$(find "$BACKUP_DIR" -name "*.sql.gz" -printf '%T@ %p\n' | sort -n | tail -1 | cut -d' ' -f2-)
        SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
        echo -e "  Backups     : $COUNT arquivo(s) | Total: $SIZE"
        echo "  Último      : $(basename $LATEST) — $(stat -c '%y' $LATEST | cut -c1-19)"
    else
        echo -e "  ${YELLOW}Nenhum backup encontrado${NC}"
    fi
fi

# Próximo backup
NEXT_BACKUP=$(crontab -l 2>/dev/null | grep backup.sh | head -1)
[[ -n "$NEXT_BACKUP" ]] && echo "  Cron        : $NEXT_BACKUP"
echo ""

# ── Recomendações ────────────────────────────────────────────
echo -e "${BOLD}RECOMENDAÇÕES${NC}"
echo "──────────────────────────────────────────────────────────"

[[ "$RAM_PCT" -gt 80 ]] && echo -e "  ${YELLOW}⚠  RAM acima de 80% — considere upgrade ou otimização${NC}"
[[ "${DISK_PCT:-0}" -gt 80 ]] && echo -e "  ${YELLOW}⚠  Disco acima de 80% — limpe logs ou backups antigos${NC}"

# Backup recente?
if [[ -d "$BACKUP_DIR" ]]; then
    LAST_MOD=$(find "$BACKUP_DIR" -name "*.sql.gz" -printf '%T@\n' | sort -n | tail -1 | cut -d. -f1 || echo 0)
    NOW=$(date +%s)
    HOURS_AGO=$(( (NOW - LAST_MOD) / 3600 ))
    [[ "$HOURS_AGO" -gt 25 ]] && echo -e "  ${YELLOW}⚠  Último backup há ${HOURS_AGO}h — verifique o cron${NC}"
fi

echo -e "  ${GREEN}Execute /opt/postgres/scripts/backup.sh para backup manual${NC}"
echo -e "  ${GREEN}Execute bash validate.sh para validação completa${NC}"
echo ""
