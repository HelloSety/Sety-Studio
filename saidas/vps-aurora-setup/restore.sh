#!/bin/bash
# ============================================================
# AURORA IA — Restauração do PostgreSQL
# Uso: bash restore.sh /opt/backups/postgres/full_YYYYMMDD.sql.gz
# ============================================================
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'
BOLD='\033[1m'

ENV_FILE="/opt/evolution/.env"
[[ ! -f "$ENV_FILE" ]] && { echo -e "${RED}Arquivo .env não encontrado${NC}"; exit 1; }
source "$ENV_FILE"

BACKUP_FILE="${1:-}"

# Sem argumento: listar backups disponíveis
if [[ -z "$BACKUP_FILE" ]]; then
    echo ""
    echo -e "${BOLD}Backups disponíveis:${NC}"
    echo ""
    find /opt/backups/postgres -name "*.sql.gz" -printf "  %TY-%Tm-%Td %TH:%TM  %f\n" | sort -r
    echo ""
    echo "Uso: bash restore.sh /opt/backups/postgres/ARQUIVO.sql.gz"
    echo ""
    exit 0
fi

[[ ! -f "$BACKUP_FILE" ]] && {
    echo -e "${RED}Arquivo não encontrado: $BACKUP_FILE${NC}"
    exit 1
}

echo ""
echo -e "${RED}${BOLD}⚠  ATENÇÃO: Restauração irá substituir os dados atuais!${NC}"
echo ""
echo "  Arquivo  : $(basename $BACKUP_FILE)"
echo "  Tamanho  : $(du -sh $BACKUP_FILE | cut -f1)"
echo "  Data     : $(stat -c '%y' $BACKUP_FILE | cut -c1-19)"
echo ""
read -p "Confirmar restauração? Digite 'RESTAURAR' para continuar: " CONFIRM
[[ "$CONFIRM" != "RESTAURAR" ]] && { echo "Cancelado."; exit 0; }

echo ""
echo "Parando Evolution API para evitar conflitos..."
cd /opt/evolution && docker compose stop evolution

echo "Restaurando banco de dados..."
gunzip -c "$BACKUP_FILE" | docker exec -i aurora_postgres psql -U postgres

echo "Reiniciando Evolution API..."
docker compose up -d evolution

echo ""
echo -e "${GREEN}[✓]${NC} Restauração concluída!"
echo ""
echo "Execute bash validate.sh para verificar o ambiente."
echo ""
