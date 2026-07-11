# Atualização de preços — Site Básico, Loja Virtual Completa e Tráfego (2026-07-09)

## Decisão

Ditada por Seven em 2026-07-09: substituir os valores de site/loja da tabela à la carte (vigente desde 2026-07-03) por dois itens consolidados com condição comercial "de/por", e sempre separar investimento em anúncio de gestão de tráfego (nunca somar num único número).

## Tabela vigente (substitui a de 2026-07-03 nesses itens)

- 🌐 **Site Básico** (Landing Page ou Site Institucional) — de R$700 por R$500. Inclui: design moderno, responsivo (PC e celular), botão de WhatsApp, formulário de contato, SEO básico, entrega rápida.
- 🛒 **Loja Virtual Completa** (Shopify ou Nuvemshop) — de R$1.200 por R$800. Inclui: layout premium, checkout otimizado, integração com WhatsApp, Mercado Pago/Pix/Cartão, Pixel Meta Ads, Google Analytics, painel administrativo, SEO básico, responsivo.
- Cadastro de Produtos, Otimização da Loja (a partir de R$490) e SEO para Loja (a partir de R$490) **não mudaram**.
- 📈 **Gestão de Tráfego** — sempre em dois valores separados, nunca somados: 📢 Investimento em anúncios (pago direto pelo cliente na plataforma Meta/Google, decisão dele) + 👨‍💻 Gestão da Sety Vision (Gestão Meta Ads R$790/mês · Meta + Google Ads R$1.290/mês · Estrutura Completa sob orçamento).

## Regra de apresentação

- Sempre mostrar o "de/por" ao cotar Site Básico ou Loja Virtual Completa — nunca dizer que é promoção mensal/permanente. É uma condição comercial vigente pra novas contratações, que "pode encerrar conforme a disponibilidade da agenda".
- Formato de proposta pra serviço avulso/combinado (site, loja, tráfego): bloco por serviço (🛒 nome + 💰 valor + benefícios), e no fechamento separar 💳 Investimento Inicial (pagamento único: site/loja + anúncios + gestão, com total) de 🔄 Mensalidade (só os itens recorrentes — nunca repetir o valor do site/loja ali).

## Onde foi aplicado

- `saidas/aurora-ia-crm/src/lib/sdr-engine.ts` — seção SERVIÇOS AVULSOS + nova seção "FORMATO DE PROPOSTA PRA SERVIÇO AVULSO/COMBINADO" + "CONDIÇÃO PROMOCIONAL DO SITE/LOJA". Esse é o motor realmente ativo hoje (webhook confirmado em 2026-07-08, ver `MEMORY/DECISOES/2026-07-08-sdr-consultivo-catalogo-completo.md`).
- `saidas/uazapi-agent/system_prompt.txt` — mesma tabela replicada por consistência, mesmo não sendo o motor ativo no momento.
- Memória: `project_sety_studio_pacotes` (auto-memory do Claude Code).
