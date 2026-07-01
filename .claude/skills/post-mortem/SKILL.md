---
name: post-mortem
description: >
  Registra aprendizados de projetos concluídos no Memory Hub da Sety Studio.
  Gera resumo automático, salva o que funcionou, erros e soluções.
  Use quando o usuário disser "/post-mortem", "projeto concluído", "salvar aprendizados",
  "registrar projeto" ou ao fechar qualquer entrega de cliente.
---

# /post-mortem — Post Mortem de Projeto

Gera registro permanente dos aprendizados de um projeto concluído. Em 5 minutos.

## Workflow

### 1. Coletar informações

Perguntar em sequência (pode receber tudo de uma vez):

```
1. Cliente: [nome]
2. Tipo de projeto: [site / campanha / automação / outro]
3. Duração: [de quando a quando]
4. Resultado entregue: [o que foi feito]
5. Resultado do cliente: [o que ele obteve — números se possível]
6. O que funcionou muito bem?
7. O que deu errado ou gerou retrabalho?
8. Ferramentas usadas: [lista]
9. Tempo gasto real vs. estimado: [comparativo]
10. Você faria diferente alguma coisa? O quê?
```

Se o usuário já passar o contexto livre, extrair as respostas automaticamente sem fazer todas as perguntas.

### 2. Gerar arquivo de post-mortem

Salvar em `MEMORY/PROJETOS/<cliente>-<tipo>-<YYYY-MM>.md`:

```markdown
# Post-Mortem — [Cliente] — [Tipo] — [Mês/Ano]

## Resumo
[2-3 linhas: o que foi feito e qual resultado gerou]

## Dados
- Duração: [X semanas/dias]
- Receita: [R$ X]
- Tempo real gasto: [X horas]
- Margem estimada: [X%]

## O que funcionou
- [item 1]
- [item 2]
- [item 3]

## O que deu errado
- [problema] → [causa] → [como resolvemos]

## Ferramentas usadas
[lista]

## Lições para o próximo projeto similar
- [lição 1]
- [lição 2]

## Template gerado?
[ ] Sim — salvo em MEMORY/TEMPLATES/<nome>
[ ] Não aplicável
```

### 3. Atualizar perfil do cliente

Salvar / atualizar `MEMORY/CLIENTES/<cliente>.md` com:
- Histórico de projetos
- Preferências detectadas
- Forma de comunicação que funciona
- Próxima oportunidade de upsell identificada

### 4. Extrair playbook (se aplicável)

Se o projeto tiver um processo replicável, criar ou atualizar `MEMORY/PLAYBOOKS/<tipo>.md` com o passo a passo do que funcionou.

### 5. Confirmar com o usuário

Ao final, mostrar:
```
Post-mortem salvo: MEMORY/PROJETOS/<arquivo>.md
Cliente atualizado: MEMORY/CLIENTES/<cliente>.md
[Playbook criado/atualizado: MEMORY/PLAYBOOKS/<tipo>.md] (se aplicável)

Próximo projeto similar → vou consultar esses aprendizados primeiro.
```

## Regras

- Nunca inventar dados — apenas o que o usuário confirmou.
- Se não tiver número de resultado do cliente, registrar "não mensurado" e perguntar se quer acompanhar.
- Post-mortem deve ser breve e útil — máx 1 página.
