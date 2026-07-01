# BRIEF: Live Artifact de Saude do CRM (Higiene de Funil) — HubSpot CRM

Cole este brief inteiro em uma conversa NOVA do Claude Cowork (com o HubSpot conectado).

## 1. Proposito
Mostrar, em uma tela, o quao confiavel esta o funil: um Health Score, os problemas que sujam o CRM e os negocios que precisam de atencao agora. Usado por gestor comercial, reabertura semanal.

Pergunta central: "O meu funil esta confiavel hoje, e onde ele esta furado?"

## 2. Fonte de dados
CRM: HubSpot (MCP oficial). Pipeline: [TROQUE PELO NOME DO SEU PIPELINE].
Preflight: `get_user_details` + `get_organization_details` (moeda). Descubra as etapas via `get_properties` (`dealstage`).

Ferramentas: `query_crm_data` (`WHERE hs_is_open_count = 1`) e `search_crm_objects` (para `NOT_HAS_PROPERTY` e `num_associated_contacts = 0`).

Campos por negocio aberto: `dealname`, `amount`, `dealstage`, `hubspot_owner_id`, `createdate`, `notes_last_updated`, `notes_next_activity_date`, `num_associated_contacts`.

A atividade e nativa: NAO cruze tarefas manualmente. `notes_next_activity_date` vazia = sem proximo passo (tarefa vencida nao conta como proxima atividade).

NOTAS DO CONECTOR (validadas):
- `callMcpTool`: leia `r.structuredContent ?? JSON.parse(r.content[0].text)`.
- `WHERE amount IS NULL` acha deals sem valor.
- Property vazia nao vem no objeto -> trate como "nao informado", nao como zero.

## 3. Health Score (0 a 100)
Comeca em 100 e subtrai penalidades por negocio; o score do funil e a media:
- sem proxima atividade (`notes_next_activity_date` vazia): -25
- inatividade > 14 dias (`notes_last_updated`): -15
- sem valor (`amount` vazio): -15
- sem contato (`num_associated_contacts = 0`): -10
- sem `closedate`: -5

## 4. O que mostrar
- Health Score (semaforo), os problemas que mais sujam o funil e os negocios que precisam de atencao agora.
- Somente leitura.
