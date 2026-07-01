# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

# Sety Studio â€” Sety Vision

OperaÃ§Ã£o da Sety Studio. Aqui ficam clientes, propostas, conteÃºdo e entregas da agÃªncia.

**Estrutura de pastas:**
- `_memoria/` â€” quem Ã© a agÃªncia, como falamos, foco atual
- `identidade/` â€” marca da Sety Studio (aplicada em todas as peÃ§as)
- `clientes/` â€” uma subpasta por cliente, autossuficiente
- `briefings/` â€” briefings antes de virar cliente
- `propostas/` â€” propostas em andamento
- `marketing/` â€” conteÃºdo institucional da agÃªncia
- `saidas/` â€” documentos pontuais, anÃ¡lises
- `dados/` â€” arquivos a analisar (relatÃ³rios de cliente, exports)
- `scripts/` â€” utilitÃ¡rios Node.js (render, postar, gerar imagem)
- `templates/` â€” moldes de AGENTS.md por perfil + catÃ¡logos de skills e ferramentas

---

## Sobre a Sety Studio

AgÃªncia digital focada em negÃ³cios de alto valor. Ajuda empresas a vender mais pela internet criando sites, anÃºncios e automaÃ§Ãµes que transformam visitantes em clientes.

**Atende:** negÃ³cios de alto ticket (clÃ­nicas, advogados, imobiliÃ¡rias, consÃ³rcios, energia solar) que precisam de estrutura digital profissional para gerar clientes todo dia.

**ServiÃ§os principais:**
- Sites e landing pages (HTML/CSS/JS, Webflow, Framer)
- TrÃ¡fego pago (Meta Ads, Google Ads)
- Branding e identidade visual (Figma, Photoshop)
- EdiÃ§Ã£o de vÃ­deos e motion design (Premiere, After Effects)
- AutomaÃ§Ãµes de WhatsApp (N8N, Evolution API, TypeBot)

**Time:** Seven (estratÃ©gia, vendas, gestÃ£o) + parceiros especializados por projeto.

---

## Clientes ativos

- **EmpÃ³rio Norte BelÃ©m** â€” loja de camisas esportivas em BelÃ©m/PA. Site estÃ¡tico HTML com integraÃ§Ã£o CartPanda.

---

## Tom de voz

Direto, confiante, focado em resultado real. Frases curtas, sem rodeio, sem jargÃ£o de guru.

**Evitar:** "alavancar", "sinergia", promessas milagrosas, excesso de emojis, linguagem corporativa genÃ©rica, adjetivos sem evidÃªncia.

Ver `_memoria/preferencias.md` para calibraÃ§Ã£o completa.

---

## Contexto do negÃ³cio

No inÃ­cio de toda conversa, ler silenciosamente:
1. `_memoria/empresa.md`
2. `_memoria/preferencias.md`
3. `_memoria/estrategia.md`

Para qualquer tarefa visual (carrossel, post, proposta, landing page), ler `identidade/design-guide.md` antes de criar qualquer coisa.

---

## Abertura de sessÃ£o

No inÃ­cio de cada sessÃ£o, rodar `/abrir` â€” carrega o contexto e devolve um resumo de 5 linhas. Se nÃ£o for rodado, ler os trÃªs arquivos de memÃ³ria silenciosamente antes da primeira resposta relevante.

---

## Skills disponÃ­veis

Skills ficam em `.Codex/skills/` â€” cada uma tem um `SKILL.md` com instruÃ§Ãµes completas.

| Skill | O que faz |
|---|---|
| `/abrir` | Abre sessÃ£o carregando o contexto da agÃªncia |
| `/salvar` | Commit + push no GitHub |
| `/atualizar` | Varre o projeto e atualiza os arquivos de memÃ³ria |
| `/novo-projeto` | Cria pasta isolada para cliente ou iniciativa |
| `/mapear-rotinas` | Descobre o que se repete e transforma em skill |
| `/carrossel` | Cria carrossÃ©is 1080Ã—1350 com identidade da Sety Studio |
| `/publicar-tema` | Artigo de blog + carrossel + 3 legendas a partir de um tema |
| `/seo` | Fluxo completo de SEO em 8 passos |
| `/responder-avaliacoes` | Respostas humanizadas para reviews do Google |
| `/aprovar-post` | Publica blog + Instagram + Facebook em um comando |
| `/anuncio-google` | Monta campanha em CSV pronto para Google Ads Editor |
| `/relatorio-ads` | RelatÃ³rio semanal de Google + Meta com alertas |
| `/analisar-dados` | LÃª CSV/XLSX/PDF e gera resumo executivo |
| `/email-profissional` | Rascunha email a partir de contexto livre |

Antes de executar qualquer tarefa, verificar se existe skill relevante. Se nÃ£o existir mas a tarefa parecer repetÃ­vel, perguntar:
> "Isso pode virar uma skill pra prÃ³xima vez. Quer que eu crie?"

---

## Regras do sistema

- Cliente novo â†’ criar pasta `clientes/<Nome>/` com briefing, estratÃ©gia e subpastas conforme as entregas contratadas
- Proposta nova â†’ `propostas/<cliente>-<data>.html` antes de fechar
- Casos de sucesso ficam em `clientes/<Nome>/caso.md` (reuso em pitches)
- ConteÃºdo gerado â†’ `marketing/conteudo/<tipo>-<tema>-<YYYY-MM-DD>/`
- AnÃºncios Google (CSV) â†’ `marketing/ads/`
- AnÃ¡lises, emails, documentos â†’ `saidas/`
- Dados a analisar â†’ `dados/`
- Nunca salvar outputs direto na raiz

---

## Setup e dependÃªncias

**Playwright** (renderizar HTML em PNG para skills de conteÃºdo visual):
```bash
npm install playwright
npx playwright install chromium
```

**VariÃ¡veis de ambiente** â€” criar `.env` na raiz (nunca commitar):
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

IntegraÃ§Ãµes documentadas em `templates/ferramentas/catalogo.md`. Consultar antes de criar scripts novos.

---

## Aprender com correÃ§Ãµes

Quando o usuÃ¡rio corrigir algo ou der instruÃ§Ã£o permanente, perguntar:
> "Quer que eu salve isso pra nÃ£o precisar repetir?"

- Sobre o negÃ³cio â†’ `_memoria/empresa.md`
- Sobre preferÃªncias e estilo â†’ `_memoria/preferencias.md`
- Sobre prioridades â†’ `_memoria/estrategia.md`
- Regra de comportamento nessa pasta â†’ `AGENTS.md`

---

## Ferramentas conectadas

- [ ] Notion
- [ ] Gmail
- [ ] Google Calendar
- [ ] Canva
- [ ] Meta Ads
- [ ] Google Ads

*(Marcar conforme for instalando os MCPs)*
