# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

# Sety Studio — MazyOS

Operação da Sety Studio. Aqui ficam clientes, propostas, conteúdo e entregas da agência.

**Estrutura de pastas:**
- `_memoria/` — quem é a agência, como falamos, foco atual
- `identidade/` — marca da Sety Studio (aplicada em todas as peças)
- `clientes/` — uma subpasta por cliente, autossuficiente
- `briefings/` — briefings antes de virar cliente
- `propostas/` — propostas em andamento
- `marketing/` — conteúdo institucional da agência
- `saidas/` — documentos pontuais, análises
- `dados/` — arquivos a analisar (relatórios de cliente, exports)
- `scripts/` — utilitários Node.js (render, postar, gerar imagem)
- `templates/` — moldes de AGENTS.md por perfil + catálogos de skills e ferramentas

---

## Sobre a Sety Studio

Agência digital focada em negócios de alto valor. Ajuda empresas a vender mais pela internet criando sites, anúncios e automações que transformam visitantes em clientes.

**Atende:** negócios de alto ticket (clínicas, advogados, imobiliárias, consórcios, energia solar) que precisam de estrutura digital profissional para gerar clientes todo dia.

**Serviços principais:**
- Sites e landing pages (HTML/CSS/JS, Webflow, Framer)
- Tráfego pago (Meta Ads, Google Ads)
- Branding e identidade visual (Figma, Photoshop)
- Edição de vídeos e motion design (Premiere, After Effects)
- Automações de WhatsApp (N8N, Evolution API, TypeBot)

**Time:** Seven (estratégia, vendas, gestão) + parceiros especializados por projeto.

---

## Clientes ativos

- **Empório Norte Belém** — loja de camisas esportivas em Belém/PA. Site estático HTML com integração CartPanda.

---

## Tom de voz

Direto, confiante, focado em resultado real. Frases curtas, sem rodeio, sem jargão de guru.

**Evitar:** "alavancar", "sinergia", promessas milagrosas, excesso de emojis, linguagem corporativa genérica, adjetivos sem evidência.

Ver `_memoria/preferencias.md` para calibração completa.

---

## Contexto do negócio

No início de toda conversa, ler silenciosamente:
1. `_memoria/empresa.md`
2. `_memoria/preferencias.md`
3. `_memoria/estrategia.md`

Para qualquer tarefa visual (carrossel, post, proposta, landing page), ler `identidade/design-guide.md` antes de criar qualquer coisa.

---

## Abertura de sessão

No início de cada sessão, rodar `/abrir` — carrega o contexto e devolve um resumo de 5 linhas. Se não for rodado, ler os três arquivos de memória silenciosamente antes da primeira resposta relevante.

---

## Skills disponíveis

Skills ficam em `.Codex/skills/` — cada uma tem um `SKILL.md` com instruções completas.

| Skill | O que faz |
|---|---|
| `/abrir` | Abre sessão carregando o contexto da agência |
| `/salvar` | Commit + push no GitHub |
| `/atualizar` | Varre o projeto e atualiza os arquivos de memória |
| `/novo-projeto` | Cria pasta isolada para cliente ou iniciativa |
| `/mapear-rotinas` | Descobre o que se repete e transforma em skill |
| `/carrossel` | Cria carrosséis 1080×1350 com identidade da Sety Studio |
| `/publicar-tema` | Artigo de blog + carrossel + 3 legendas a partir de um tema |
| `/seo` | Fluxo completo de SEO em 8 passos |
| `/responder-avaliacoes` | Respostas humanizadas para reviews do Google |
| `/aprovar-post` | Publica blog + Instagram + Facebook em um comando |
| `/anuncio-google` | Monta campanha em CSV pronto para Google Ads Editor |
| `/relatorio-ads` | Relatório semanal de Google + Meta com alertas |
| `/analisar-dados` | Lê CSV/XLSX/PDF e gera resumo executivo |
| `/email-profissional` | Rascunha email a partir de contexto livre |

Antes de executar qualquer tarefa, verificar se existe skill relevante. Se não existir mas a tarefa parecer repetível, perguntar:
> "Isso pode virar uma skill pra próxima vez. Quer que eu crie?"

---

## Regras do sistema

- Cliente novo → criar pasta `clientes/<Nome>/` com briefing, estratégia e subpastas conforme as entregas contratadas
- Proposta nova → `propostas/<cliente>-<data>.html` antes de fechar
- Casos de sucesso ficam em `clientes/<Nome>/caso.md` (reuso em pitches)
- Conteúdo gerado → `marketing/conteudo/<tipo>-<tema>-<YYYY-MM-DD>/`
- Anúncios Google (CSV) → `marketing/ads/`
- Análises, emails, documentos → `saidas/`
- Dados a analisar → `dados/`
- Nunca salvar outputs direto na raiz

---

## Setup e dependências

**Playwright** (renderizar HTML em PNG para skills de conteúdo visual):
```bash
npm install playwright
npx playwright install chromium
```

**Variáveis de ambiente** — criar `.env` na raiz (nunca commitar):
```
OPENAI_API_KEY=
GEMINI_API_KEY=
META_PAGE_ACCESS_TOKEN=
META_PAGE_ID=
META_IG_USER_ID=
CLOUDFLARE_API_TOKEN=
CLOUDFLARE_ACCOUNT_ID=
POSTFORME_API_KEY=
```

**MCPs:**
```bash
Codex mcp list
Codex mcp add notion -- npx -y @notionhq/notion-mcp-server
Codex mcp remove <nome>
```

Integrações documentadas em `templates/ferramentas/catalogo.md`. Consultar antes de criar scripts novos.

---

## Aprender com correções

Quando o usuário corrigir algo ou der instrução permanente, perguntar:
> "Quer que eu salve isso pra não precisar repetir?"

- Sobre o negócio → `_memoria/empresa.md`
- Sobre preferências e estilo → `_memoria/preferencias.md`
- Sobre prioridades → `_memoria/estrategia.md`
- Regra de comportamento nessa pasta → `AGENTS.md`

---

## Ferramentas conectadas

- [ ] Notion
- [ ] Gmail
- [ ] Google Calendar
- [ ] Canva
- [ ] Meta Ads
- [ ] Google Ads

*(Marcar conforme for instalando os MCPs)*
