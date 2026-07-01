#!/bin/bash
# ============================================================
# AURORA IA — Backup do PostgreSQL
# Uso: bash backup.sh [--all | --db NOME_DO_BANCO]
# ============================================================
set -euo pipefail

ENV_FILE="/opt/evolution/.env"
[[ ! -f "$ENV_FILE" ]] && { echo "Arquivo .env não encontrado em $ENV_FILE"; exit 1; }
source "$ENV_FILE"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups/postgres"
mkdir -p "$BACKUP_DIR"

MODE="${1:---all}"
TARGET_DB="${2:-}"

log() { echo "[$(date '+%H:%M:%S')] $1"; }

case "$MODE" in
    --all)
        # Backup completo de todos os bancos
        FILE="${BACKUP_DIR}/full_${TIMESTAMP}.sql.gz"
        log "Iniciando backup completo → $FILE"
        docker exec aurora_postgres pg_dumpall -U postgres | gzip > "$FILE"
        SIZE=$(du -sh "$FILE" | cut -f1)
        log "Backup concluído: $FILE ($SIZE)"
        ;;

    --db)
        [[ -z "$TARGET_DB" ]] && { echo "Uso: backup.sh --db NOME_DO_BANCO"; exit 1; }
        FILE="${BACKUP_DIR}/${TARGET_DB}_${TIMESTAMP}.sql.gz"
        log "Iniciando backup do banco '$TARGET_DB' → $FILE"
        docker exec aurora_postgres pg_dump -U postgres "$TARGET_DB" | gzip > "$FILE"
        SIZE=$(du -sh "$FILE" | cut -f1)
        log "Backup concluído: $FILE ($SIZE)"
        ;;

    *)
        echo "Uso: backup.sh [--all | --db NOME_DO_BANCO]"
        exit 1
        ;;
esac

# Manter apenas últimos 7 dias
DELETED=$(find "$BACKUP_DIR" -name "*.sql.gz" -mtime +7 -print -delete | wc -l)
[[ "$DELETED" -gt 0 ]] && log "Backups antigos removidos: $DELETED arquivo(s)"

# Listar backups existentes
log "Backups disponíveis:"
find "$BACKUP_DIR" -name "*.sql.gz" -printf "  %TY-%Tm-%Td %TH:%TM  %f  (%s bytes)\n" | sort
