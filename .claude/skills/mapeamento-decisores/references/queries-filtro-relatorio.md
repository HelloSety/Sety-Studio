# Queries por persona, critérios de filtro e template de relatório

---

## 1. Mapeamento perfil-alvo → filtros e queries

Use o perfil que o usuário deu no Passo 0 para escolher os filtros das camadas A/B e as variações de query. Sempre rode **variações** — uma query só tem recall baixo.

### C-level (CEO, COO, CTO, CFO, fundadores, sócios)
- **Camada A (seniority):** `["310","320","300"]` (CXO, Owner/Partner, VP) + função `["9"]` (Entrepreneurship)
- **Camada B (cargo):** `["CEO","Chief Executive","Founder","Fundador","Cofundador","COO","CTO","CFO","Presidente","Sócio","Diretor"]`
- **Camada C (SERP por nome):** `"<Nome>" CEO OR fundador "<Empresa>"` · `"<Nome>" "<Empresa>" linkedin`

### Diretoria comercial / gestão de vendas
- **Camada A:** `["220","300","310"]` (Director, VP, CXO) + função `["25","4"]` (Sales, Business Development)
- **Camada B:** `["Diretor Comercial","Diretor de Vendas","Head de Vendas","Head Comercial","VP Sales","VP de Vendas","CRO","Gerente Comercial","Gerente de Vendas","Sales Director"]`
- **Camada C (SERP):** `"<Empresa>" "diretor comercial" OR "head de vendas" site:linkedin.com`

### Gestão de marketing
- **Camada A:** `["220","300","310"]` + função `["15"]` (Marketing)
- **Camada B:** `["Diretor de Marketing","Head de Marketing","CMO","Gerente de Marketing","VP Marketing","Head of Growth"]`
- **Camada C (SERP):** `"<Empresa>" "diretor de marketing" OR CMO site:linkedin.com`

### Inovação e projetos
- **Camada A:** `["220","300","310"]` + função `["19","20"]` (Product, Program/Project Mgmt)
- **Camada B:** `["Diretor de Inovação","Head de Inovação","Head de Projetos","Diretor de Projetos","CPO","Head de Produto","PMO","Gerente de Projetos"]`
- **Camada C (SERP):** `"<Empresa>" "inovação" OR "head de projetos" site:linkedin.com`

### Cargo específico (usuário pediu algo fora das categorias acima)
Monte os filtros por analogia: traduza o cargo para o `functionId` mais próximo + uma lista de `currentJobTitles` com sinônimos PT/EN + uma query SERP `"<Empresa>" "<cargo>" site:linkedin.com`.

> Inclua sempre sinônimos PT **e** EN — muitas empresas usam títulos em inglês no LinkedIn mesmo sendo brasileiras.

---

## 2. Critérios de filtro (Passo 3) — aplique, não decida no feeling

Para cada candidato consolidado, marque:

**INCLUIR se todos forem verdade:**
- [ ] **Empresa atual confere** — o perfil tem a empresa-alvo como *current company* (elimina ex-funcionários e homônimos). Pelo `companyId`/`companyLinkedinUrl` do retorno do ator, ou pela menção explícita no SERP.
- [ ] **Cargo bate com o perfil-alvo** — seniority/título corresponde ao que o usuário pediu (não um nível abaixo do solicitado, salvo se for o champion natural).
- [ ] **É decisão, não execução** — descarta cargos de suporte/operacional que entraram por match parcial de palavra (ex.: "Suporte" que casou com "Diretor" numa query, analista que casou com "gerência").

**SINALIZAR (incluir com ressalva):**
- Sócio do QSA **sem cargo executivo** identificado → provável investidor; baixa prioridade, mas registre.
- Decisor que mora fora / em função de **conselho** (board) → decisor *estratégico*, não operacional para a venda. Marque ⚠️.

**DESCARTAR:**
- Ex-funcionário (empresa-alvo aparece só no passado).
- Homônimo de outra empresa.
- Match de palavra-chave sem cargo de decisão real.

**Classificação por papel no comitê de compra** (para cada incluído):
- **Econômico** — assina o cheque (C-level, sócio-administrador, diretor com orçamento).
- **Champion / técnico** — usa e defende internamente (gerente/head da área-dor).
- **Influenciador / conselho** — destrava ou aconselha (board, compras, TI).

Regra de cobertura: se possível, entregue **3–5 pessoas** cobrindo mais de um papel — single-threading (1 contato só) é frágil.

---

## 3. Template do relatório (curto)

Entregue na thread, enxuto. Adapte as seções de cargo ao perfil-alvo que foi pedido.

```markdown
## 📋 Decisores — <Nome Fantasia> (<Razão Social>)
**CNPJ** <cnpj> · **Sede** <cidade>/<uf> · **LinkedIn** /company/<slug> · **<N> sócios no QSA**

### 🎯 <Categoria do alvo — ex.: C-level / Diretoria Comercial>
| Decisor | Cargo | Local | LinkedIn | Confirmação |
|---|---|---|---|---|
| **Nome** | Cargo | Cidade | [/in/slug](url) | fonte(s) que confirmam |

### ⚠️ Ressalvas
- <quem é board/mora fora/investidor sem cargo — 1 linha cada>

### 🔍 Não encontrados / lacunas
- <ex.: "cargo X não tem perfil indexado no LinkedIn" — honestidade sobre cobertura>
```

Princípios do relatório:
- **Confirmação** = de onde veio a confiança (ex.: "Sócio-Adm. no CNPJ + busca por cargo"). Cruzamento de 2+ fontes = alta confiança.
- Use o **slug público** do LinkedIn quando tiver (vem do SERP ou do enriquecimento); a URL ofuscada `/in/ACwAA...` do ator de busca é fallback.
- Não despeje resumo/histórico de cada pessoa no relatório inicial. Isso fica guardado para quando o usuário pedir aprofundamento de alguém específico.
- Seja honesto sobre lacunas — dizer "o gerente de X não apareix em nenhuma fonte" é mais útil que omitir.
