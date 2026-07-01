---
name: call-prep
description: Prepare-se para reuniões de vendas de alta performance com mapeamento do comitê de compra, acordos de alinhamento inicial e roteiros de descoberta estruturada (dor, impacto e cronograma). Funciona de forma independente ou integrado ao Pipedrive, Gmail, tldv e Apify. Ative com "call prep [empresa]", "prep me for my call with [empresa]" ou "me prepara pra call com [empresa]".
---

# Preparação Estratégica de Reunião (Call Prep)

Prepare-se para qualquer chamada ou reunião comercial estratégica em poucos minutos. Esta habilidade consolida o contexto competitivo da conta e estrutura um roteiro tático voltado para avanço metodológico e conversão em vendas B2B complexas.

## Como Funciona

```
┌─────────────────────────────────────────────────────────────────┐
│              PREPARAÇÃO METODOLÓGICA DE REUNIÃO                 │
├─────────────────────────────────────────────────────────────────┤
│  STANDALONE (sempre funciona)                                    │
│  ✓ Dados informados: empresa, tipo de chamada e participantes    │
│  ✓ Pesquisa Web Comercial: notícias, captações, fusões e setor   │
│  ✓ Perfil da Conta: atividade, tamanho, concorrentes e tese      │
│  ✓ Entregável: briefing estruturado com roteiro e perguntas      │
├─────────────────────────────────────────────────────────────────┤
│  SUPERCHARGED (quando você conecta suas ferramentas)             │
│  + Pipedrive: histórico comercial, oportunidades e notas do deal │
│  + Gmail: análise de conversas recentes e dores compartilhadas  │
│  + tldv: transcrições de calls anteriores, objeções e contexto  │
│  + Apify: scrape de perfis LinkedIn dos participantes            │
│  + Google Calendar: importação automática do convite e horário   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Primeiros Passos

Ao executar esta habilidade, analisarei as informações disponíveis ou farei perguntas direcionadas:

**Dados Fundamentais:**
- Nome da Empresa ou Contato principal
- Tipo de Reunião (Descoberta, Demonstração de Proposta, Alinhamento Técnico, Negociação, etc.)

**Dados Recomendados:**
- Lista de Participantes (Nomes e cargos, se conhecidos)
- Histórico Prévio (E-mails, anotações ou contexto que você queira colar)

Se o Pipedrive ou Gmail estiver conectado, buscarei esses dados automaticamente.

---

## Conectores e Integrações

| Ferramenta | O Que Ela Adiciona ao Briefing |
|------------|-------------------------------|
| **Pipedrive** | Detalhes do deal, histórico de estágios e notas registradas. |
| **Gmail** | Linha do tempo de e-mails trocados, dúvidas e materiais enviados. |
| **tldv** | Transcrições de reuniões anteriores: dores citadas, objeções e concorrentes mencionados. Use `mcp__4b3988da-d861-4812-ab7a-545548418c91__search-meetings` com o nome da empresa. |
| **Apify** | Scrape de perfis LinkedIn dos participantes: trajetória, cargo atual e posts recentes. Use o actor `apify/linkedin-profile-scraper` ou similar. |
| **Google Calendar** | Importa dados do convite, horário e participantes automaticamente. |

> **Sem integrações ativas?** Funciona perfeitamente de forma manual. Informe os dados da reunião e cole o contexto que você possui.

---

## Fluxo Metodológico de Execução

### Passo 1: Consolidação de Contexto
```
1. Google Calendar → Identificar reunião, horário e participantes do convite.
2. Pipedrive → Puxar ficha da conta, estágio do deal e notas registradas.
3. Gmail → Verificar últimos e-mails trocados com o prospect.
4. tldv → Buscar transcrições de calls anteriores com a empresa
         (mcp__4b3988da-d861-4812-ab7a-545548418c91__search-meetings com nome da empresa).
3. Gmail (se disponível) → Buscar e-mails trocados com o contato/empresa para identificar
   dores mencionadas, materiais compartilhados e histórico de comunicação.
```

### Passo 2: Pesquisa de Perfis LinkedIn via Apify
```
Para cada participante confirmado:
- Usar Apify (actor: apify/linkedin-profile-scraper ou similar) para scrape do perfil.
- Extrair: cargo atual, trajetória, posts recentes, tempo de empresa.
- Montar mapeamento do comitê de compra com os dados coletados.
```

### Passo 3: Inteligência de Mercado (Web Search)
```
1. "[Nome da Empresa] notícias" nos últimos 30 dias.
2. Desafios comuns do setor no cenário atual.
3. Site e LinkedIn da empresa para contexto de porte e posicionamento.
```

### Passo 4: Engenharia do Roteiro Tático
```
1. Cruzar estágio no Pipedrive com a estrutura de reunião recomendada.
2. Formular perguntas de descoberta focadas em impacto financeiro.
3. Criar o Upfront Contract e respostas para objeções esperadas.
```

---

## Formato de Saída (Briefing Tático)

```markdown
# 🎯 Briefing Tático de Reunião: [Nome da Empresa]

**Tipo de Reunião:** [Descoberta / Demonstração / Negociação / Alinhamento]
**Cronograma:** [Data/Hora]
**Participantes:** [Nomes e Cargos]
**Objetivo Metodológico:** [Ex: Obter compromisso firme de agenda para Validação de Proposta]

---

## 🏢 Visão Geral da Conta

| Indicador | Informação |
|-----------|------------|
| **Empresa** | [Nome] |
| **Setor** | [Setor de Atuação] |
| **Porte** | [Funcionários / Faturamento estimado] |
| **Desafio Provável** | [Baseado no segmento ou na pesquisa] |
| **Status no Pipedrive** | [Estágio atual do deal] |
| **Último Contato** | [Data e resumo — Pipedrive ou Gmail] |

---

## 👥 Mapeamento do Comitê de Compra

### 1. [Nome] — [Cargo]
- **Perfil:** [Trajetória e tempo de empresa — via Apify/LinkedIn]
- **LinkedIn:** [URL]
- **Papel:** [Decisor Econômico / Campeão / Influenciador Técnico / Detrator Potencial]
- **Foco na Chamada:** [ROI, eficiência operacional, segurança, facilidade de uso, etc.]
- **Gancho de Rapport:** [Post recente ou marco de carreira]

[Repetir para cada participante]

---

## 📖 Contexto Histórico

**Interações (Pipedrive + Gmail + tldv):**
- [Fato relevante 1 — ex: Call de descoberta em 10/05, dor principal: follow-up manual]
- [Fato relevante 2 — ex: E-mail com dúvida sobre integração CRM em 15/05]
- [Compromissos pendentes ou entregáveis em aberto]

**Notícias e Movimentações:**
- **[Acontecimento recente]:** [Como conectar ao contexto da reunião]
- **[Tendência do setor]:** [Fator externo que pressiona o cliente a agir]

---

## 🧭 Roteiro Tático

### Etapa 1: Upfront Contract — Primeiros 3 minutos
> "Para garantir que aproveitemos nosso tempo: o objetivo é entender os desafios da [Empresa] em [Setor] e mostrar como nosso modelo ajuda. Se fizer sentido mútuo, agendamos um diagnóstico técnico na próxima semana. Se não fizer, encerramos sem problema. Faz sentido para vocês?"

### Etapa 2: Descoberta de Dores — 20 minutos
- [Tópico 1 baseado em dores identificadas em calls anteriores (tldv) ou do segmento]
- [Investigação do impacto financeiro do problema]

### Etapa 3: Value Mapping — 15 minutos
- Conectar desafios mapeados à solução da Playbook Lab.
- Usar caso de cliente similar como prova social.

### Etapa 4: Fechamento com Próximo Passo Firme — Últimos 7 minutos
- Propor o próximo passo acordado no Upfront Contract.
- Travar data e hora na agenda antes de encerrar.

---

## ❓ Perguntas de Descoberta

1. **Cenário Atual:** "[Como funciona hoje o processo de X na empresa?]"
2. **Dor Latente:** "[O que acontece quando esse processo falha ou atrasa?]"
3. **Impacto Financeiro:** "[Quanto isso representa em tempo perdido ou receita não capturada por mês?]"
4. **Evento Crítico:** "[O que acontece se esse problema continuar por mais 6 meses?]"
5. **Estrutura de Decisão:** "[Além de você, quem mais precisa estar alinhado para avançarmos?]"

---

## 🛡️ Objeções Prováveis

| Objeção | Resposta Recomendada |
|---------|---------------------|
| **Preço / Orçamento** | Ancoragem em ROI: custo do problema vs. custo da solução. Payback acelerado. |
| **Falta de Tempo / Braço Interno** | Modelo squad: a Playbook Lab executa, o cliente valida. Sem gestão interna. |
| **Já tem solução / Concorrente** | Diferenciação: ex-gestores comerciais + foco exclusivo em vendas B2B. |

---

## ➡️ Próxima Etapa pós-Reunião

Execute a skill **call-follow-up** para:
- Processar dores validadas e ações acordadas.
- Registrar atualização no Pipedrive.
- Rascunhar e-mail de acompanhamento.
```

---

## Dicas Metodológicas

1. **Upfront Contract funciona**: Alinhar o roteiro nos primeiros minutos assume o controle da reunião sem parecer forçado.
2. **Dor ≠ Desejo**: Dor tem impacto financeiro mensurável. Investigue o custo do problema antes de apresentar solução.
3. **Nunca saia sem próximo passo**: Data e hora travadas na agenda antes de encerrar a call. "Vamos nos falando" mata o pipeline.
4. **Adapte o discurso ao cargo**: Decisor econômico → ROI e velocidade. Influenciador técnico → integração e arquitetura.
