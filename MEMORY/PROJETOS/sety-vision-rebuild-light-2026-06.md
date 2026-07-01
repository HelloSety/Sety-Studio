# Sety Vision — Rebuild Light Mode Enterprise-SaaS (2026-06)

**Status:** concluído e em produção — https://sety-vision-next.vercel.app

## O que foi feito

Reconstrução completa da landing page do Sety Vision (`saidas/sety-vision-next`), saindo de um visual dark-mode genérico para um design 100% light mode nível Enterprise-SaaS (referência de acabamento: Mobbin/Stripe/Linear/Vercel — sem copiar marca, texto ou identidade deles).

- Paleta nova fixa: bg/cards `#FFFFFF`, border `#ECECEC`, texto `#111111`, secundário `#6B7280`, primário `#7C3AED`, hover `#6D28D9`.
- Navbar reconstruída como pílula flutuante centralizada com glass-blur (nunca fica branco sólido) — Command Bar inferior mantida como estava (pedido explícito do usuário).
- Hero com tipografia 72px desktop.
- Criado `LogoMarquee.tsx` — carrossel infinito de logos estilo Mobbin (cinza → cor no hover via troca de URL do CDN Simple Icons, não CSS filter puro).
- Sistema de tokens reutilizável em `globals.css`: `.section-pad`, `.card-base`, `.btn-primary`, `.btn-secondary`, `.glass-panel`.
- Todos os componentes da landing (HowItWorks, WhatsAppDemo, Comparativo, Testimonials, Pricing, FAQ, CTA, Footer) convertidos um a um para o novo design system.
- 10 componentes mortos removidos (Stack, Metrics, Pain, Features, etc.) após auditoria de imports reais via Grep — não bastava grep por nome de string pois colidiam com palavras genéricas usadas em outros arquivos do dashboard.
- Build (`next build`) limpo, zero erros TS. Deploy `vercel --prod` com sucesso.

## Decisões/judgment calls relevantes

- O mockup de telefone do WhatsApp em `WhatsAppDemo.tsx` manteve o skin escuro nativo do WhatsApp (header verde `#1a5c4c`, fundo de chat escuro) — tratado como "tela de produto simulada e contida", não como "seção dark" da página. Não foi validado explicitamente pelo usuário; revisitar se ele comentar sobre algo escuro restante.

## Pendência conhecida

- `WA_LINK` (placeholder `559XXXXXXXXX`) ainda não foi trocado pelo número real do WhatsApp em `Hero.tsx`, `Navbar.tsx`, `Pricing.tsx`, `CTA.tsx`.

Ver também [[project_sety_vision]] e [[project_sety_vision_strategy]].
