#!/bin/bash
clear
echo ""
echo "  ════════════════════════════════════════════"
echo "    Sety Server — Servidor WhatsApp Local"
echo "  ════════════════════════════════════════════"
echo ""

# Verifica Node.js
if ! command -v node &> /dev/null; then
  echo "  [ERRO] Node.js não encontrado!"
  echo "  Instale em: https://nodejs.org (versão 18+)"
  exit 1
fi

# Instala dependências se necessário
if [ ! -d "node_modules" ]; then
  echo "  Instalando dependências (só na primeira vez)..."
  npm install --silent
fi

echo "  Iniciando Sety Server na porta 3007..."
echo ""
echo "  Acesse: http://localhost:3007"
echo "  Não feche este terminal enquanto estiver usando!"
echo ""

node server.js
