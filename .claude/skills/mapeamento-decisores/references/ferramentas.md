# Ferramentas — atores Apify, BrasilAPI e IDs de filtro

Leia este arquivo antes de chamar qualquer ator. Os atores são acessados via **conector Apify (MCP)** — `mcp__Apify__call-actor` com `actor` e `input`. Não precisa de token no `.env`.

---

## 1. SERP / busca web — `apify/google-search-scraper`

Usado na **ancoragem** (Passo 1) e na **camada C** (SERP por nome de sócio). Pay-per-event (~US$ 0,0018–0,0045/página).

Campos de input relevantes:
- `queries` (string) — uma query por linha. Aceita operadores Google (`site:`, `OR`, aspas).
- `maxPagesPerQuery` (int) — use `1` (a primeira página basta para ancoragem e para achar perfis).
- `countryCode` — `"br"`.
- `languageCode` — `"pt-BR"`.
- `saveHtmlToKeyValueStore` — `false` (economiza tempo).

Exemplo (ancoragem):
```json
{
  "queries": "<Empresa> empresa linkedin\n<Empresa> site oficial\n<Empresa> CNPJ",
  "maxPagesPerQuery": 1,
  "countryCode": "br",
  "languageCode": "pt-BR",
  "saveHtmlToKeyValueStore": false
}
```

O que extrair do retorno: dos `organicResults`, pegue a URL `linkedin.com/company/...` (LinkedIn Company), o domínio do site oficial, o CNPJ (de Serasa/cnpj.biz/política de privacidade da empresa) e perfis pessoais que já apareçam (campo `personalInfo` traz `jobTitle`/`companyName` quando o resultado é uma pessoa — aproveite, é descoberta de graça).

---

## 2. Descoberta de pessoas no LinkedIn — `harvestapi/linkedin-profile-search`

Usado nas **camadas A e B** (Passo 2). Sem cookies. Na descoberta use sempre `profileScraperMode: "Short"` (barato).

Campos de input relevantes:
- `profileScraperMode` — `"Short"` na descoberta.
- `currentCompanies` (array) — **URLs completas** do LinkedIn da empresa. Ex.: `["https://br.linkedin.com/company/orulobr"]`. É o filtro de empresa.
- `seniorityLevelIds` (array de strings) — filtro de seniority (camada A). Ver tabela abaixo.
- `currentJobTitles` (array) — filtro de cargo (camada B). Ex.: `["CEO","Founder","Diretor Comercial"]`.
- `functionIds` (array) — filtro de função/área. Ver tabela abaixo.
- `searchQuery` (string) — busca fuzzy livre (útil para confirmar um nome específico dentro da empresa).
- `maxItems` (int) — ~25 cobre bem a maioria das empresas.
- `takePages` (int) — `1` (cada página = 25 perfis).

### IDs de Seniority (`seniorityLevelIds`)
| ID | Nível |
|----|-------|
| 100 | In Training |
| 110 | Entry Level |
| 120 | Senior |
| 130 | Strategic |
| 200 | Entry Level Manager |
| 210 | Experienced Manager |
| 220 | Director |
| 300 | Vice President |
| 310 | CXO |
| 320 | Owner / Partner |

### IDs de Função (`functionIds`)
| ID | Função |
|----|--------|
| 4 | Business Development |
| 9 | Entrepreneurship |
| 10 | Finance |
| 13 | Information Technology |
| 15 | Marketing |
| 18 | Operations |
| 19 | Product Management |
| 20 | Program and Project Management |
| 25 | Sales |
| 26 | Customer Success and Support |

(Lista completa de funções 1–26 e mais filtros — locais, indústria, "mudou de emprego há 90 dias" — disponível no schema do ator via `mcp__Apify__fetch-actor-details`.)

> **Aviso de recall:** o filtro de seniority é conservador e pode devolver poucos perfis (no teste real trouxe só 3 numa empresa de ~70+). Por isso a camada B (cargo) e a camada C (CNPJ) existem. Nunca confie só na camada A.

---

## 3. Enriquecimento — `harvestapi/linkedin-profile-scraper`

Usado no **Passo 4**, só nos selecionados. Modo full (~US$ 0,004/perfil). Input: lista de URLs de perfil. Devolve experiência completa, formação, localização, URL pública limpa. (Há variante "+ email search" por ~US$ 0,01/perfil — use só se o usuário pedir contato.)

---

## 4. Quadro societário — BrasilAPI (camada C)

Endpoint gratuito, sem auth. Use via Bash:
```bash
curl -s "https://brasilapi.com.br/api/cnpj/v1/<CNPJ_SO_NUMEROS>" | python3 -m json.tool
```
(CNPJ só com dígitos, ex.: `13470518000130`.)

Campos úteis no retorno:
- `razao_social`, `nome_fantasia`, `porte`, `municipio`/`uf`, `cnae_fiscal_descricao`
- `qsa` (array) — quadro societário. Para cada sócio: `nome_socio`, `qualificacao_socio` (ex.: "Sócio-Administrador" vs. "Sócio"), `data_entrada_sociedade`, `faixa_etaria`.

Como usar na camada C: priorize os **`Sócio-Administrador`** (têm poder de gestão → decisores de fato) e os de **entrada mais antiga** (provável fundador). Para cada um, rode SERP `"<Nome>" "<Empresa>" linkedin` e `"<Nome>" CEO OR fundador "<Empresa>"` para achar o LinkedIn e confirmar o cargo. Sócios sem qualificação de administrador podem ser investidores sem cargo executivo — marque como tal, não descarte automaticamente, mas sinalize baixa prioridade.

Se a BrasilAPI estiver com rate limit, o mesmo dado aparece em cnpj.biz/Serasa via SERP (já vem nos resultados da ancoragem).
