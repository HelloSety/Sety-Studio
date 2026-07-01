@echo off
chcp 65001 >nul
title Sety Server — WhatsApp
cls

echo.
echo  ════════════════════════════════════════════
echo    Sety Server — Servidor WhatsApp Local
echo  ════════════════════════════════════════════
echo.

:: Verifica Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
  echo  [ERRO] Node.js nao encontrado!
  echo.
  echo  Instale em: https://nodejs.org  (versao 18 ou superior^)
  echo.
  pause
  exit /b 1
)

echo  Node.js encontrado.

:: Instala dependências se necessário
if not exist "node_modules" (
  echo.
  echo  Instalando dependencias (so na primeira vez^)...
  echo  Aguarde 1-2 minutos...
  echo.
  call npm install --silent
  if %errorlevel% neq 0 (
    echo.
    echo  [ERRO] Falha ao instalar dependencias.
    pause
    exit /b 1
  )
  echo  Dependencias instaladas com sucesso!
)

echo.
echo  Iniciando Sety Server na porta 3007...
echo.
echo  ════════════════════════════════════════════
echo.
echo  Abra o navegador em: http://localhost:3007
echo  Escaneie o QR Code para conectar WhatsApp
echo.
echo  NAO feche esta janela enquanto estiver usando!
echo.
echo  ════════════════════════════════════════════
echo.

node server.js

echo.
echo  Servidor encerrado. Pressione qualquer tecla para sair.
pause >nul
