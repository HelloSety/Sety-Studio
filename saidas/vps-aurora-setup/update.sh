#!/bin/bash
# ============================================================
# AURORA IA — Atualização de Serviços
# Atualiza containers para versões mais recentes com zero downtime
# ============================================================
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'
BOLD='\033[1m'

[[ $EUID -ne 0 ]] && { echo -e "${RED}Execute como root: sudo bash update.sh${NC}"; exit 1; }

log()  { echo -e "${GREEN}[✓]${NC} $1"; }
info() { echo -e "${BLUE}[→]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }

echo ""
echo -e "${BOLD}AURORA IA — Atualização de Serviços${NC}"
echo ""

cd /opt/evolution

# Backup antes de atualizar
warn "Fazendo backup antes da atualização..."
/opt/postgres/scripts/backup.sh 2>/dev/null && log "Backup concluído" || warn "Backup falhou — continuando assim mesmo"

# Pull imagens mais recentes
info "Baixando imagens atualizadas..."
docker compose pull

# Reiniciar um de cada vez para minimizar downtime
SERVICES=("postgres" "redis" "evolution" "nginx")

for SERVICE in "${SERVICES[@]}"; do
    info "Atualizando $SERVICE..."
    docker compose up -d --no-deps "$SERVICE"
    sleep 10
done

log "Atualização concluída"

# Limpar imagens antigas
docker image prune -f --filter "until=24h" 2>/dev/null || true

echo ""
echo "Execute bash validate.sh para verificar o ambiente."
echo ""
