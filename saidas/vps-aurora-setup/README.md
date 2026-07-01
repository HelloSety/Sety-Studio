# AURORA IA — VPS Setup

Infraestrutura completa: Evolution API v2 + PostgreSQL + Redis + Nginx + SSL

## Pré-requisitos

- VPS Ubuntu 22.04 (mínimo 2GB RAM, 20GB disco)
- DNS apontado para o IP da VPS antes de rodar (necessário para SSL)
- Acesso root via SSH

## Instalação em 3 comandos

```bash
# 1. Upload dos scripts para a VPS
scp -r ./vps-aurora-setup/ root@IP_DA_VPS:/root/

# 2. SSH na VPS
ssh root@IP_DA_VPS

# 3. Executar setup
cd /root/vps-aurora-setup && chmod +x *.sh && bash setup.sh
```

## O que o setup.sh instala

| Serviço | Container | Porta | Função |
|---------|-----------|-------|--------|
| PostgreSQL 15 | aurora_postgres | 5432 (interno) | Banco de dados |
| Redis 7 | aurora_redis | 6379 (interno) | Cache e filas |
| Evolution API v2 | aurora_evolution | 8080 | WhatsApp Gateway |
| Nginx | aurora_nginx | 80, 443 | Reverse proxy + SSL |

## Após a instalação

### 1. Criar instância e conectar WhatsApp

```bash
bash /root/vps-aurora-setup/aurora-connect.sh
```

Ou manualmente via API:

```bash
# Criar instância
curl -X POST https://api.SEU_DOMINIO.com/instance/create \
  -H "Content-Type: application/json" \
  -H "apikey: SUA_API_KEY" \
  -d '{"instanceName":"aurora-principal","qrcode":true,"integration":"WHATSAPP-BAILEYS"}'

# Gerar QR Code
curl https://api.SEU_DOMINIO.com/instance/connect/aurora-principal \
  -H "apikey: SUA_API_KEY"
```

### 2. Acessar o Manager Visual

```
https://api.SEU_DOMINIO.com/manager
```

### 3. Configurar webhook para Aurora IA

```bash
curl -X POST https://api.SEU_DOMINIO.com/webhook/set/aurora-principal \
  -H "Content-Type: application/json" \
  -H "apikey: SUA_API_KEY" \
  -d '{
    "url": "https://SEU-AURORA-IA.com/webhook/whatsapp",
    "webhook_by_events": true,
    "webhook_base64": true,
    "events": ["MESSAGES_UPSERT","CONNECTION_UPDATE","QRCODE_UPDATED","MESSAGES_DELETE"]
  }'
```

## Comandos de operação

```bash
# Verificar todos os containers
docker ps

# Logs em tempo real
docker logs aurora_evolution -f
docker logs aurora_nginx -f
docker logs aurora_postgres -f

# Reiniciar serviço específico
cd /opt/evolution && docker compose restart evolution

# Reiniciar tudo
cd /opt/evolution && docker compose restart

# Parar tudo
cd /opt/evolution && docker compose down

# Iniciar tudo
cd /opt/evolution && docker compose up -d

# Validação completa do ambiente
bash /root/vps-aurora-setup/validate.sh

# Monitor de sistema
bash /root/vps-aurora-setup/monitor.sh

# Atualizar para versão mais recente
bash /root/vps-aurora-setup/update.sh
```

## Backup e Restauração

```bash
# Backup manual
/opt/postgres/scripts/backup.sh

# Restaurar backup
/opt/postgres/scripts/restore.sh /opt/backups/postgres/full_YYYYMMDD_HHMMSS.sql.gz

# Listar backups disponíveis
ls -lh /opt/backups/postgres/
```

Backup automático: **todo dia às 03:00** (configurado via cron)

## Estrutura de diretórios

```
/opt/
├── evolution/
│   ├── docker-compose.yml    ← Todos os serviços
│   └── .env                  ← Credenciais (chmod 600)
├── postgres/
│   ├── scripts/
│   │   ├── 01_init.sql       ← Inicialização dos bancos
│   │   ├── backup.sh         ← Script de backup
│   │   └── restore.sh        ← Script de restauração
│   └── data/                 ← (volume Docker)
├── redis/
│   └── data/                 ← (volume Docker)
├── nginx/
│   ├── conf.d/               ← Configurações nginx
│   │   ├── main.conf         ← Headers e rate limiting
│   │   └── evolution.conf    ← Proxy + SSL
│   ├── certbot/
│   │   ├── conf/             ← Certificados SSL
│   │   └── www/              ← ACME challenge
│   └── logs/                 ← Logs nginx
└── backups/
    └── postgres/             ← Arquivos .sql.gz
```

## Variáveis de ambiente (Aurora IA)

As credenciais para integrar ao Aurora IA ficam em `/opt/evolution/.env`:

```
API_DOMAIN=api.seudominio.com
EVOLUTION_API_KEY=sua-api-key-32-chars
EVOLUTION_DB_USER=evolution
EVOLUTION_DB_NAME=evolution_db
AURORA_DB_USER=aurora
AURORA_DB_NAME=aurora_db
AURORA_DB_PASSWORD=gerado-automaticamente
REDIS_PASSWORD=sua-senha-redis
```

## Portas expostas

| Porta | Serviço | Acesso |
|-------|---------|--------|
| 22 | SSH | Externo |
| 80 | Nginx HTTP | Externo |
| 443 | Nginx HTTPS | Externo |
| 8080 | Evolution API | Externo (enquanto sem SSL) |
| 5432 | PostgreSQL | Apenas containers |
| 6379 | Redis | Apenas containers |

## Troubleshooting

### Evolution API não inicia

```bash
docker logs aurora_evolution --tail=100
docker compose -f /opt/evolution/docker-compose.yml restart evolution
```

### QR Code não aparece

```bash
# Verificar estado da instância
curl http://localhost:8080/instance/connectionState/aurora-principal \
  -H "apikey: SUA_API_KEY"

# Deletar e recriar instância
curl -X DELETE http://localhost:8080/instance/delete/aurora-principal \
  -H "apikey: SUA_API_KEY"
bash /root/vps-aurora-setup/aurora-connect.sh
```

### SSL não funciona

1. Verificar DNS: `dig api.seudominio.com` deve retornar o IP da VPS
2. Verificar porta 80 aberta: `ufw status`
3. Rodar certbot manualmente:

```bash
docker run --rm \
  -v /opt/nginx/certbot/conf:/etc/letsencrypt \
  -v /opt/nginx/certbot/www:/var/www/certbot \
  certbot/certbot certonly \
  --webroot --webroot-path=/var/www/certbot \
  --email SEU_EMAIL \
  --agree-tos --no-eff-email \
  -d api.seudominio.com
```

### PostgreSQL com problemas

```bash
docker exec -it aurora_postgres psql -U postgres
\l        # Listar bancos
\du       # Listar usuários
\q        # Sair
```
