# Preflight de conectores — HubSpot

1. Rodar `get_user_details` (USER_INFORMATION + TOOL_INFORMATION): confirmar identidade, `ownerId` e disponibilidade read/write por objeto.
2. Rodar `get_organization_details` (ACCOUNT_INFORMATION): descobrir a moeda e o timezone da conta (NUNCA assumir BRL).
3. Descobrir pipelines e etapas via `get_properties` nas properties `pipeline` e `dealstage`. Perguntar qual pipeline usar.
4. Se a skill depender de outro MCP (ex.: Apify), verificar antes de continuar.
5. Se faltar conector obrigatorio ou um objeto estiver indisponivel para escrita, parar e orientar.
