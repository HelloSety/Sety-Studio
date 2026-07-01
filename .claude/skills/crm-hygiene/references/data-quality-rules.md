# Regras de qualidade de valor (CRM multi-usuário)

Quando várias pessoas preenchem o CRM, o erro humano gera valores fora do padrão. A skill valida FORMATO, não só presença.

## Padrões a sinalizar
- E-mail: precisa ter `local@dominio.tld`; sinalizar placeholders (`aaa@email.com`, `teste@`, `n/a`, repetição de caracteres).
- Documento fiscal (Tax ID / CNPJ / CPF): conferir comprimento e dígitos esperados; sinalizar valores incompletos. (Crítico para faturamento.)
- Texto placeholder: "xxx", "tbd", "a definir", "asdf", "-", nomes de 1 caractere.
- Número/telefone/valor em campo de texto livre que deveria ser estruturado.

## Como operar
1. Puxe os valores (`search_crm_objects`/`query_crm_data`) das properties relevantes (email, telefone, documento, nome).
2. Valide localmente por regex/heurística.
3. Liste os registros suspeitos com o valor atual e a recomendação (corrigir/limpar).
4. Correção só com prévia e aprovação (lote <=10).

> Observação do campo: detectar isso "na mão" é quase inviável em base grande — é exatamente onde a leitura por contexto agrega. Mas a correção é sempre supervisionada.
