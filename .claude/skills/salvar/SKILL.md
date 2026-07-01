---
name: salvar
description: >
  Salva o trabalho do Sety Vision no GitHub (commit + push). Na primeira vez configura o repositÃ³rio
  remoto. Use quando o usuÃ¡rio disser "salvar", "salva no github", "commit", "push", "/salvar"
  ou pedir backup do trabalho.
---

# /salvar â€” Salvar no GitHub

Skill de uma funÃ§Ã£o sÃ³: garantir que o trabalho do usuÃ¡rio estÃ¡ no GitHub. FÃ¡cil pra quem nunca usou git.

## Workflow

### Primeira vez (repositÃ³rio nÃ£o inicializado)

Detectar com `git rev-parse --is-inside-work-tree`. Se falhar:

1. Perguntar:
   > "Esse Ã© o primeiro syncar. VocÃª jÃ¡ tem um repositÃ³rio criado no GitHub pra esse workspace?
   > 1. Sim, me passa a URL (ex: https://github.com/usuario/nome.git)
   > 2. NÃ£o, vou criar agora â€” me dÃ¡ um nome pro repositÃ³rio (ex: meu-Sety Vision)"

2. **Se opÃ§Ã£o 1:** rodar `git init`, `git add .`, `git commit -m "Setup inicial do Sety Vision"`, `git branch -M main`, `git remote add origin <URL>`, `git push -u origin main`.

3. **Se opÃ§Ã£o 2:** verificar se o `gh` CLI estÃ¡ instalado (`gh --version`). 
   - Se sim: rodar `git init`, criar commit inicial, e `gh repo create <nome> --private --source=. --push`.
   - Se nÃ£o: instruir o usuÃ¡rio a instalar `gh` (https://cli.github.com/) ou criar o repo manualmente em github.com/new e voltar com a URL.

### Commits seguintes (jÃ¡ configurado)

1. Rodar `git status`. Se nÃ£o tiver mudanÃ§as, responder "TÃ¡ tudo sincronizado, sem mudanÃ§a nova" e parar.

2. Mostrar o `git status` curto pro usuÃ¡rio e perguntar:
   > "Vou comitar tudo isso. Quer descrever a mudanÃ§a em uma frase ou usa o resumo automÃ¡tico?"

3. Se o usuÃ¡rio fornecer mensagem, usar. Se nÃ£o, gerar uma mensagem baseada nos arquivos alterados (1 linha, formato: "Atualiza X" ou "Adiciona Y" ou "Cria proposta pra cliente Z").

4. `git add .` â†’ `git commit -m "<mensagem>"` â†’ `git push`.

5. Confirmar com link do repositÃ³rio (extrair de `git remote get-url origin`):
   > "Sincronizado. Ver no GitHub: <URL>"

## Regras

- Nunca usar `--force` sem o usuÃ¡rio pedir explicitamente
- Nunca rodar `git reset --hard` ou outras destrutivas sem confirmaÃ§Ã£o clara
- Se o push falhar por divergÃªncia (alguÃ©m comitou no remoto), avisar o usuÃ¡rio e oferecer `git pull --rebase` antes de tentar de novo
- Se o usuÃ¡rio ainda nÃ£o tiver `git` configurado (`user.name` / `user.email`), perguntar e configurar com `git config --global` na primeira vez
