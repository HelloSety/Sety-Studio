/* ============================================================
   NATALIA SILVEIRA — Theme JS
   ============================================================ */

const NS = {
  wpp: document.documentElement.dataset.wpp || '5511999999999',

  /* ── TRANSLATIONS ── */
  T: {
    pt:{
      nav_home:'CASA', nav_shop:'COMPRAR', nav_all:'Todos os Produtos',
      nav_sets:'Conjuntos', nav_dresses:'Vestidos', nav_pieces:'Peças Exclusivas',
      nav_about:'SOBRE', nav_policies:'POLÍTICAS', nav_search:'Pesquisar',
      hero_eyebrow:'ARTE EM MACRAMÊ DO BRASIL', hero_cta:'Ver Coleção',
      cat_sets:'CONJUNTOS', cat_dresses:'VESTIDOS', cat_pieces:'PEÇAS EXCLUSIVAS', cat_shop:'Comprar',
      filter_all:'TODOS', filter_sets:'CONJUNTOS', filter_dresses:'VESTIDOS', filter_pieces:'PEÇAS EXCLUSIVAS',
      sz_label:'TAMANHO', cl_label:'LINHA DE COR', cl_select:'Selecione uma cor',
      cl_premium:'PREMIUM', cl_gold:'LUREX DOURADO', cl_copper:'LUREX COBRE',
      qty_label:'QUANTIDADE',
      btn_cart:'ADICIONAR AO CARRINHO', btn_wpp:'COMPRAR PELO WHATSAPP',
      fse_title:'FEITO SOB ENCOMENDA',
      fse_body:'Cada peça é produzida exclusivamente sob medida. Prazo: até 20 dias corridos além do envio.',
      acc_details:'DETALHES DA PEÇA', acc_ship:'ENVIO E PRAZO',
      acc_care:'CUIDADOS COM A PEÇA', acc_return:'TROCAS E DEVOLUÇÕES',
      recs_title:'VOCÊ TAMBÉM VAI AMAR',
      consult:'Sob consulta', weight:'Peso:',
      nl_title:'CADASTRE-SE PARA EXCLUSIVIDADES',
      nl_sub:'Acesso antecipado a novos produtos e ofertas especiais',
      nl_ph:'Seu endereço de e-mail', nl_btn:'ASSINAR',
      nl_ok:'Obrigada! Você receberá nossas novidades em breve.',
      popup_offer:'GANHE 10% DE DESCONTO', popup_sub:'NO SEU PRIMEIRO PEDIDO',
      popup_desc:'Cadastre-se para acesso exclusivo ao universo Natalia Silveira',
      popup_ph:'Endereço de e-mail*', popup_btn:'Obter código de desconto', popup_skip:'Não, obrigada',
      ft_links:'LINKS', ft_info:'INFORMAÇÕES', ft_nl:'NEWSLETTER',
      ft_returns:'Trocas e Devoluções', ft_ship:'Frete e Envio',
      ft_brand:'Sobre a Marca', ft_founder:'Sobre a Fundadora',
      ft_copy:'© 2026 Natalia Silveira. Todos os direitos reservados.',
      story_ey:'Nossa História', s_cta:'SAIBA MAIS',
      craft_quote:'"Mergulhe na nossa arte artesanal excepcional — cada peça, uma obra única feita à mão."',
      ab_ey:'Sobre a Marca',
      fd_ey:'Sobre a Fundadora',
      pr_ey:'Produção', pr_cta:'Verificar Urgência',
      ii_ey:'Informações', td_ey:'Políticas', fr_ey:'Envio', fr_cta:'Calcular Frete',
      co_cta:'Personalizar Minha Peça',
    },
    en:{
      nav_home:'HOME', nav_shop:'SHOP', nav_all:'All Products',
      nav_sets:'Sets', nav_dresses:'Dresses', nav_pieces:'Exclusive Pieces',
      nav_about:'ABOUT', nav_policies:'POLICIES', nav_search:'Search',
      hero_eyebrow:'MACRAMÉ ART FROM BRAZIL', hero_cta:'Shop Collection',
      cat_sets:'SETS', cat_dresses:'DRESSES', cat_pieces:'EXCLUSIVE PIECES', cat_shop:'Shop',
      filter_all:'ALL', filter_sets:'SETS', filter_dresses:'DRESSES', filter_pieces:'EXCLUSIVE PIECES',
      sz_label:'SIZE', cl_label:'COLOR LINE', cl_select:'Select a color',
      cl_premium:'PREMIUM', cl_gold:'GOLD LUREX', cl_copper:'COPPER LUREX',
      qty_label:'QUANTITY',
      btn_cart:'ADD TO CART', btn_wpp:'BUY VIA WHATSAPP',
      fse_title:'MADE TO ORDER',
      fse_body:'Each piece is produced exclusively to measure. Production time: up to 20 calendar days, plus shipping.',
      acc_details:'PIECE DETAILS', acc_ship:'SHIPPING & TIMELINE',
      acc_care:'CARE INSTRUCTIONS', acc_return:'RETURNS & EXCHANGES',
      recs_title:'YOU MAY ALSO LOVE',
      consult:'On request', weight:'Weight:',
      nl_title:'SIGN UP FOR EXCLUSIVES',
      nl_sub:'Early access to new products and special offers',
      nl_ph:'Your email address', nl_btn:'SUBSCRIBE',
      nl_ok:'Thank you! You\'ll hear from us soon.',
      popup_offer:'GET 10% OFF', popup_sub:'YOUR FIRST ORDER',
      popup_desc:'Sign up for exclusive access to the Natalia Silveira world',
      popup_ph:'Email address*', popup_btn:'Get coupon code', popup_skip:'No, thanks',
      ft_links:'QUICK LINKS', ft_info:'INFORMATION', ft_nl:'NEWSLETTER',
      ft_returns:'Returns & Exchanges', ft_ship:'Shipping & Delivery',
      ft_brand:'About the Brand', ft_founder:'About the Founder',
      ft_copy:'© 2026 Natalia Silveira. All rights reserved.',
      story_ey:'Our Story', s_cta:'LEARN MORE',
      craft_quote:'"Immerse yourself in our exceptional craftsmanship — every piece, a unique work of art made by hand."',
      ab_ey:'About the Brand', fd_ey:'About the Founder',
      pr_ey:'Production', pr_cta:'Check Availability',
      ii_ey:'Information', td_ey:'Policies', fr_ey:'Shipping', fr_cta:'Calculate Shipping',
      co_cta:'Customize My Piece',
    },
    es:{
      nav_home:'INICIO', nav_shop:'TIENDA', nav_all:'Todos los Productos',
      nav_sets:'Conjuntos', nav_dresses:'Vestidos', nav_pieces:'Piezas Exclusivas',
      nav_about:'SOBRE NOSOTROS', nav_policies:'POLÍTICAS', nav_search:'Buscar',
      hero_eyebrow:'ARTE EN MACRAMÉ DE BRASIL', hero_cta:'Ver Colección',
      cat_sets:'CONJUNTOS', cat_dresses:'VESTIDOS', cat_pieces:'PIEZAS EXCLUSIVAS', cat_shop:'Comprar',
      filter_all:'TODOS', filter_sets:'CONJUNTOS', filter_dresses:'VESTIDOS', filter_pieces:'PIEZAS EXCLUSIVAS',
      sz_label:'TALLA', cl_label:'LÍNEA DE COLOR', cl_select:'Selecciona un color',
      cl_premium:'PREMIUM', cl_gold:'LUREX DORADO', cl_copper:'LUREX COBRE',
      qty_label:'CANTIDAD',
      btn_cart:'AÑADIR AL CARRITO', btn_wpp:'COMPRAR POR WHATSAPP',
      fse_title:'HECHO A PEDIDO',
      fse_body:'Cada pieza se produce exclusivamente a medida. Plazo: hasta 20 días corridos, más el envío.',
      acc_details:'DETALLES DE LA PIEZA', acc_ship:'ENVÍO Y PLAZO',
      acc_care:'CUIDADO DE LA PIEZA', acc_return:'CAMBIOS Y DEVOLUCIONES',
      recs_title:'TAMBIÉN TE VA A ENCANTAR',
      consult:'Consultar', weight:'Peso:',
      nl_title:'SUSCRÍBETE PARA EXCLUSIVOS',
      nl_sub:'Acceso anticipado a nuevos productos y ofertas especiales',
      nl_ph:'Tu dirección de e-mail', nl_btn:'SUSCRIBIRSE',
      nl_ok:'¡Gracias! Te contactaremos pronto.',
      popup_offer:'OBTÉN 10% DE DESCUENTO', popup_sub:'EN TU PRIMER PEDIDO',
      popup_desc:'Regístrate para acceso exclusivo al mundo Natalia Silveira',
      popup_ph:'Dirección de correo electrónico*', popup_btn:'Obtener código', popup_skip:'No, gracias',
      ft_links:'ENLACES', ft_info:'INFORMACIÓN', ft_nl:'BOLETÍN',
      ft_returns:'Cambios y Devoluciones', ft_ship:'Flete y Envío',
      ft_brand:'Sobre la Marca', ft_founder:'Sobre la Fundadora',
      ft_copy:'© 2026 Natalia Silveira. Todos los derechos reservados.',
      story_ey:'Nuestra Historia', s_cta:'SABER MÁS',
      craft_quote:'"Sumérgete en nuestra excepcional artesanía — cada pieza, una obra única hecha a mano."',
      ab_ey:'Sobre la Marca', fd_ey:'Sobre la Fundadora',
      pr_ey:'Producción', pr_cta:'Verificar Disponibilidad',
      ii_ey:'Información', td_ey:'Políticas', fr_ey:'Envío', fr_cta:'Calcular Envío',
      co_cta:'Personalizar Mi Pieza',
    }
  },

  lang: localStorage.getItem('ns_lang') || 'pt',

  t(k){ return (this.T[this.lang]||this.T.pt)[k] || this.T.pt[k] || k; },

  setLang(l){
    this.lang = l;
    localStorage.setItem('ns_lang', l);
    document.documentElement.lang = l === 'pt' ? 'pt-BR' : l;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if(key) el.textContent = this.t(key);
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      el.placeholder = this.t(el.dataset.i18nPh);
    });
    document.querySelectorAll('[data-sl]').forEach(a => {
      a.classList.toggle('active', a.dataset.sl === l);
    });
    const lbl = document.getElementById('langLbl');
    if(lbl) lbl.textContent = l.toUpperCase();
    const flagEl = document.getElementById('langFlag');
    if(flagEl) flagEl.textContent = { pt:'🇧🇷', en:'🇺🇸', es:'🇪🇸' }[l] || '🇧🇷';
    const floatCode = document.getElementById('langFloatCode');
    if(floatCode) floatCode.textContent = l.toUpperCase();
    const wrap = document.getElementById('langFloat');
    const floatImg = document.getElementById('langFloatFlagImg');
    if(floatImg && wrap) {
      const src = wrap.dataset['flag' + l.charAt(0).toUpperCase() + l.slice(1)];
      if(src) floatImg.src = src;
    }
  },

  /* ── COLORS ── */
  COLORS: {
    premium:[
      {n:'Branco',c:'#F2EEE8',b:true},{n:'Creme',c:'#E2D4B8'},{n:'Porcelana',c:'#C8B890'},{n:'Castanha',c:'#7A4830'},
      {n:'Valência',c:'#B84E20'},{n:'Terracota',c:'#A83A1A'},{n:'Cobre',c:'#A05018'},{n:'Chocolate',c:'#4A2010'},
      {n:'Brasa',c:'#B82808'},{n:'Verm. Círculo',c:'#B80C18'},{n:'Valentino',c:'#7A0C18'},{n:'Azul Petróleo',c:'#0A2838'},
      {n:'Militar',c:'#404C24'},{n:'Musgo',c:'#283018'},{n:'Pergaminho',c:'#A8A090',b:true},{n:'Alumínio',c:'#8A8A8A'},{n:'Preto',c:'#1A1210'},
    ],
    gold:[
      {n:'Marrom Lurex',c:'#5A3018'},{n:'Pingo de Ouro',c:'#C8A030'},{n:'Ouro Branco',c:'#E0D080',b:true},
      {n:'Pingo Ouro Claro',c:'#D4B830'},{n:'Bege Dourado',c:'#C0985A'},{n:'Champanhe',c:'#D8C080',b:true},
      {n:'Branco',c:'#EEEAC8',b:true},{n:'Prata',c:'#B0B8C0'},{n:'Verde Oliva',c:'#7A7848'},
      {n:'Cobre',c:'#A86030'},{n:'Rami Escuro',c:'#4A3020'},{n:'Cinza',c:'#707070'},
      {n:'Capim Dourado',c:'#C09810'},{n:'Branco L. Cobre',c:'#E8DCA8',b:true},{n:'Noite Estrelada',c:'#18182A'},
    ],
    copper:[
      {n:'Off-White',c:'#EEECE0',b:true},{n:'Champanhe',c:'#D8C090',b:true},{n:'Ramy',c:'#885A38'},
      {n:'Nude Perolado',c:'#C8A898'},{n:'Bege',c:'#C8BCA0',b:true},{n:'Marsala',c:'#882040'},
      {n:'Verde Musgo',c:'#384028'},{n:'Chocolate',c:'#422018'},{n:'Marrom',c:'#603020'},
      {n:'Cinza',c:'#808080'},{n:'Preto',c:'#181210'},
    ]
  },

  selectedColor: null,
  selectedColorName: null,
  selectedColorLine: null,

  buildColors(){
    ['premium','gold','copper'].forEach(line => {
      const wrap = document.getElementById('cp-' + line);
      if(!wrap) return;
      wrap.innerHTML = '';
      this.COLORS[line].forEach(c => {
        const dot = document.createElement('div');
        dot.className = 'color-swatch';
        dot.style.background = c.c;
        if(c.b) dot.style.boxShadow = '0 0 0 1px #ccc';
        dot.title = c.n;
        dot.addEventListener('click', () => {
          document.querySelectorAll('.color-swatch').forEach(x => x.classList.remove('active'));
          dot.classList.add('active');
          this.selectedColorName = c.n;
          this.selectedColorLine = line;
          const lbl = document.getElementById('colorSelected');
          if(lbl){ lbl.textContent = c.n; lbl.removeAttribute('data-i18n'); }
          this.updateWpp();
        });
        wrap.appendChild(dot);
      });
    });
  },

  updateWpp(){
    const btn = document.getElementById('btnWpp');
    if(!btn) return;
    const title = document.querySelector('.product-title')?.textContent || '';
    const priceEl = document.querySelector('.product-price');
    const price = priceEl ? priceEl.textContent : '—';
    const szBtn = document.querySelector('.size-btn.active');
    const sz = szBtn ? szBtn.dataset.sz : '(a definir)';
    const line = this.selectedColorLine || '(a definir)';
    const color = this.selectedColorName || '(a definir)';
    const qty = document.getElementById('qtyNum')?.value || 1;
    const msg = `Olá! Quero encomendar:\n\n*Peça:* ${title}\n*Preço:* ${price}\n*Tamanho:* ${sz}\n*Linha:* ${line}\n*Cor:* ${color}\n*Quantidade:* ${qty}\n\nPor favor, me envie mais informações!`;
    btn.href = `https://wa.me/${this.wpp}?text=${encodeURIComponent(msg)}`;
    const wppFloat = document.querySelector('.wpp-float');
    if(wppFloat) wppFloat.href = `https://wa.me/${this.wpp}`;
  },

  initGallery(){
    const mainImg = document.getElementById('galleryMain');
    if(!mainImg) return;
    document.querySelectorAll('.gallery-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        const src = thumb.dataset.src;
        mainImg.style.opacity = '0';
        setTimeout(() => { mainImg.src = src; mainImg.style.opacity = '1'; }, 180);
        document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });
  },

  initSizeButtons(){
    document.querySelectorAll('.size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if(btn.classList.contains('unavailable')) return;
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const varId = btn.dataset.variantId;
        const hiddenId = document.getElementById('variantId');
        if(hiddenId && varId) hiddenId.value = varId;
        this.updateWpp();
      });
    });
  },

  initColorTabs(){
    document.querySelectorAll('.color-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.color-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.querySelectorAll('.color-panel').forEach(p => p.classList.remove('active'));
        const panel = document.getElementById('cp-' + tab.dataset.cp);
        if(panel) panel.classList.add('active');
      });
    });
  },

  initQty(){
    const minus = document.getElementById('qtyMinus');
    const plus  = document.getElementById('qtyPlus');
    const num   = document.getElementById('qtyNum');
    if(!minus||!plus||!num) return;
    minus.addEventListener('click', () => { if(+num.value > 1){ num.value = +num.value - 1; this.updateWpp(); } });
    plus.addEventListener('click',  () => { if(+num.value < 10){ num.value = +num.value + 1; this.updateWpp(); } });
  },

  initAccordion(){
    document.querySelectorAll('.accordion-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        const body = btn.nextElementSibling;
        const open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', !open);
        body.style.maxHeight = open ? '0' : body.scrollHeight + 'px';
      });
    });
  },

  initMobileNav(){
    const ham   = document.getElementById('hamburger');
    const nav   = document.getElementById('mobileNav');
    const close = document.getElementById('mobileNavClose');
    if(ham && nav && close){
      ham.addEventListener('click',   () => nav.classList.add('open'));
      close.addEventListener('click', () => nav.classList.remove('open'));
    }
  },

  initLang(){
    document.querySelectorAll('[data-sl]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        this.setLang(a.dataset.sl);
        document.getElementById('langFloatMenu')?.classList.remove('open');
      });
    });
    const btn  = document.getElementById('langFloatBtn');
    const menu = document.getElementById('langFloatMenu');
    if(btn && menu){
      btn.addEventListener('click', e => {
        e.stopPropagation();
        menu.classList.toggle('open');
      });
      document.addEventListener('click', () => menu.classList.remove('open'));
    }
    this.setLang(this.lang);
  },

  initPopup(){
    const popup = document.getElementById('nsPopup');
    if(!popup) return;
    if(localStorage.getItem('ns_pop')) return;
    setTimeout(() => popup.classList.add('show'), 2500);
    document.getElementById('popupClose')?.addEventListener('click', () => this.closePopup());
    document.getElementById('popupSkip')?.addEventListener('click', () => this.closePopup());
    popup.addEventListener('click', e => { if(e.target === popup) this.closePopup(); });
    document.getElementById('popupForm')?.addEventListener('submit', e => { e.preventDefault(); this.closePopup(); });
  },
  closePopup(){
    const p = document.getElementById('nsPopup');
    if(p) p.classList.remove('show');
    localStorage.setItem('ns_pop', '1');
  },

  initNewsletter(){
    document.querySelectorAll('.newsletter-form').forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const ok = form.nextElementSibling;
        if(ok?.classList.contains('newsletter-success')){ ok.style.display = 'block'; }
        form.reset();
      });
    });
  },

  init(){
    this.initLang();
    this.initMobileNav();
    this.initPopup();
    this.initNewsletter();
    this.initAccordion();
    this.buildColors();
    this.initColorTabs();
    this.initSizeButtons();
    this.initGallery();
    this.initQty();
    this.updateWpp();
  }
};

document.addEventListener('DOMContentLoaded', () => NS.init());
