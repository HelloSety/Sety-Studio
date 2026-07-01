# Regras de extracao de campos

- Extraia apenas o que esta explicito ou claramente implicado. Marque o nivel de confianca.
- Nunca registre dado incerto como fato — vai para `NOTE`, nao para property permanente.
- Mapeie para properties HubSpot existentes (descubra via `search_properties`):
  - Deal: `dealstage`, `amount` (cuidado line items), `closedate`, `hs_next_step`, custom fields.
  - Contato: `jobtitle`, `email`, `phone`.
  - Empresa: `industry`, `numberofemployees`, `description`, `domain`.
- Datas no formato `YYYY-MM-DD`.
