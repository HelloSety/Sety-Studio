# Playbook: Entrega de Site (HTML/CSS/JS)

**Stack padrão:** HTML + CSS + JS puro  
**Checkout:** CartPanda  
**Deploy:** Vercel ou Netlify  
**Meta de entrega:** Landing page em 1 dia / Site completo em 3 dias

---

## Processo

1. Receber briefing do cliente (cores, logo, copy, referências)
2. Ler `identidade/design-guide.md` antes de criar qualquer visual
3. Montar estrutura base HTML/CSS/JS
4. Adaptar design (cores, logo, conteúdo)
5. Testar localmente
6. Deploy no Vercel ou Netlify (drag & drop ou Git)
7. Entregar link + senha do painel (se aplicável)

---

## Estrutura mínima de site e-commerce esportivo

```
index.html          — hero + benefícios + produtos + CTA
css/style.css       — reset + variáveis + layout + componentes
js/main.js          — interações (menu mobile, carousel, etc.)
imagens/            — logo, produtos, banners
```

---

## Geração de criativos (HTML → PNG)

Para posts e criativos visuais:
- Criar arquivo HTML com design do post
- Renderizar via Playwright → PNG
- Script: `scripts/gerar-posts.mjs` ou via Node + Playwright

**Setup Playwright:**
```bash
npm install playwright
npx playwright install chromium
```

---

## Checklist de entrega

- [ ] Site responsivo (mobile first)
- [ ] Botão WhatsApp fixo (wa.me link)
- [ ] Link do checkout CartPanda funcionando
- [ ] Imagens otimizadas (< 200KB cada)
- [ ] Meta tags básicas (title, description, og:image)
- [ ] Google Analytics ou Pixel Meta instalado
- [ ] Domínio personalizado apontado (se cliente tem)
- [ ] Testar em iOS Safari + Android Chrome

---

## Deploy Vercel (CLI)

```bash
npm i -g vercel
vercel
# Seguir as instruções — projeto detectado automaticamente
```

---

## Clientes que usaram esse processo

- Empório Norte Belém (camisas esportivas, CartPanda)
- Alex Messias (criativos HTML→PNG para posts)

---

## Tempo médio real

| Tipo | Tempo |
|---|---|
| Landing page simples (1 seção de produto) | 4-6h |
| Site completo (5-6 seções) | 1-2 dias |
| E-commerce com catálogo | 2-3 dias |
| Com criativos HTML renderizados | +2-4h |
