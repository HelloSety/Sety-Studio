# Mapeamento de campos (enrichment -> HubSpot)

| Dado coletado | Property HubSpot (COMPANY) |
| --- | --- |
| Site | `domain` / `website` |
| Segmento | `industry` (enum — use value exato) |
| Porte | `numberofemployees` |
| Faturamento | `annualrevenue` |
| Localizacao | `city`, `country` |
| Descricao | `description` |
| Telefone | `phone` |

Contato (CONTACT): `jobtitle`, `email`, `phone`. So preencha properties existentes (via `search_properties`).
