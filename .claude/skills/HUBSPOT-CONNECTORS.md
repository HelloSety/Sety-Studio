# Configuracao de Conectores e Servidores MCP — HubSpot CRM

Este documento orienta a conexao das skills ao **MCP oficial do HubSpot** e resume as regras de operacao validadas em conta real.

## Servidor MCP do HubSpot (remoto)

O HubSpot expoe um servidor MCP oficial remoto em `mcp.hubspot.com`, com autenticacao **OAuth**. O Claude opera com as permissoes do usuario conectado (nao acessa Sensitive Data). Como alternativa, e possivel conectar via Composio — o MCP oficial e o caminho recomendado.

### Pre-requisitos
- Conta **HubSpot em plano pago** (Sales Hub Starter, Pro ou Enterprise).
- Plano **Claude Pro, Team ou Enterprise** (o conector personalizado nao roda no plano gratis).
- Ser **admin** do HubSpot na primeira conexao (o admin autoriza; depois os demais usuarios conectam).

### Configuracao no Claude Desktop
1. No HubSpot, crie o app de usuario com os escopos de leitura/escrita dos objetos de CRM desejados.
2. Em **Configuracoes -> Conectores -> Adicionar conector personalizado**, aponte para `mcp.hubspot.com` e autorize via OAuth.

## Ferramentas (tool surface) — modelo generico

Diferente de CRMs com tools granulares (RD/Pipedrive), o HubSpot expoe poucas ferramentas **genericas** que recebem o `objectType` como parametro:

- `get_user_details` — **preflight obrigatorio**: identidade, ownerId e disponibilidade read/write por objeto.
- `get_organization_details` — times, seats, e **ACCOUNT_INFORMATION** (moeda, timezone). Use para descobrir a moeda da conta.
- `query_crm_data` — leitura analitica via **HubSQL** (SELECT/WHERE/GROUP BY/agregacoes).
- `search_crm_objects` — busca de registros por `filterGroups` + associacoes + `total` (exige `chatInsights`).
- `get_crm_objects` — busca em lote por IDs.
- `search_properties` / `get_properties` — descoberta dinamica de properties (nomes internos, tipos, enums).
- `search_owners` — resolver `hubspot_owner_id` por nome/email.
- `manage_crm_objects` — **toda a escrita** (create/update + associations), com gate de confirmacao embutido.

## Regras criticas validadas em conta real (15/06/2026)

1. **Preflight**: sempre `get_user_details` antes de operar. Respeite a disponibilidade read/write por objeto.
2. **Escrita = `manage_crm_objects`** com `confirmationStatus: CONFIRMED` e prévia Antes/Depois. O proprio conector exige a confirmacao.
3. **Lote maximo de 10 objetos por chamada** de `manage_crm_objects` (acima disso: `VALIDATION_ERROR`). Pagine em lotes de <=10.
4. **Escrita em lote e parcial**: cada objeto retorna seu sucesso/erro; um item invalido nao derruba os demais.
5. **Properties read-only/calculadas falham com erro claro** (ex.: `hs_projected_amount`). O MCP NAO expoe `modificationMetadata` no `get_properties` — detecte read-only pelo erro ou por lista conhecida.
6. **Moeda**: a conta tem uma moeda propria (ex.: USD). Leia via `get_organization_details` (ACCOUNT_INFORMATION) e use `amount_in_home_currency`. NUNCA assuma BRL.
7. **Valor do deal (`amount`)**: e gravavel direto. Quando o deal tem **line items** (`hs_num_of_associated_line_items > 0`), o valor passa a ser derivado deles — evite sobrescrever `amount` (risco de divergir/rollup). O rollup do HubSpot e assincrono.
8. **Enums** (ex.: `dealstage`, `industry`, `dealtype`): use o `value` interno exato; confirme via `get_properties`.

## Conectores opcionais
- **Apify MCP** para o enriquecimento (Modulo lead-enrichment). Sem Apify, fallback com pesquisa web/dados colados, com confianca rebaixada.
- **Gmail** para rascunho de e-mail no executive-report.
