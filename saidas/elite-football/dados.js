const STORE = {
  nome: 'ULTRAGOL',
  tagline: 'Veste quem é de verdade',
  whatsapp: '5511999999999',
  instagram: '@ultragol',
};

// Gera SVG de camisa com as cores do time
function jerseyImg(cor1, cor2 = '#fff', cor3 = cor1, badge = '') {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 360'>
    <defs>
      <linearGradient id='g${cor1.replace('#','')}' x1='0%' y1='0%' x2='100%' y2='100%'>
        <stop offset='0%' stop-color='${cor1}'/>
        <stop offset='100%' stop-color='${cor3}'/>
      </linearGradient>
    </defs>
    <path d='M100,35 L32,90 L62,108 L62,300 L238,300 L238,108 L268,90 L200,35 Q182,62 150,68 Q118,62 100,35Z' fill='url(#g${cor1.replace('#','')})' stroke='${cor2}' stroke-width='1.5'/>
    <path d='M100,35 Q118,62 150,68 Q182,62 200,35 Q178,82 150,88 Q122,82 100,35Z' fill='${cor2}'/>
    <path d='M100,35 L32,90 L62,108 L100,90Z' fill='${cor1}' opacity='0.85'/>
    <path d='M200,35 L268,90 L238,108 L200,90Z' fill='${cor1}' opacity='0.85'/>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

const J = {
  // Seleções principais
  brasil_verde: jerseyImg('#009C3B','#FEDF00','#006400'),
  brasil_amarelo: jerseyImg('#FEDF00','#009C3B','#F4C430'),
  brasil_azul: jerseyImg('#002776','#FEDF00','#001B5E'),
  argentina_azul: jerseyImg('#75AADB','#fff','#4B89C8'),
  argentina_branca: jerseyImg('#fff','#75AADB','#f0f0f0'),
  franca_azul: jerseyImg('#0033A0','#fff','#002080'),
  franca_branca: jerseyImg('#fff','#0033A0','#f5f5f5'),
  portugal_vermelha: jerseyImg('#A70000','#006600','#8B0000'),
  portugal_verde: jerseyImg('#006600','#A70000','#004400'),
  alemanha_branca: jerseyImg('#fff','#000','#f0f0f0'),
  alemanha_preta: jerseyImg('#1a1a1a','#fff','#000'),
  espanha_vermelha: jerseyImg('#AA151B','#F1BF00','#880000'),
  espanha_azul: jerseyImg('#0039A6','#AA151B','#002a7a'),
  inglaterra_branca: jerseyImg('#fff','#CC0001','#f5f5f5'),
  inglaterra_vermelha: jerseyImg('#CC0001','#fff','#990000'),
  italia_azul: jerseyImg('#003399','#fff','#002277'),
  holanda_laranja: jerseyImg('#FF6600','#fff','#DD4400'),
  belgica_vermelha: jerseyImg('#D10021','#FDDA24','#A50019'),
  colombia_amarela: jerseyImg('#FCD116','#003087','#DDB914'),
  uruguai_azul: jerseyImg('#5CB3FF','#fff','#3A9FFF'),
  senegal_branca: jerseyImg('#fff','#00853F','#f5f5f5'),
  marrocos_vermelha: jerseyImg('#C1272D','#006233','#9B1E23'),
  japao_azul: jerseyImg('#003F88','#fff','#002860'),
  mexico_verde: jerseyImg('#006847','#fff','#004D35'),
  eua_branca: jerseyImg('#fff','#BF0A30','#f5f5f5'),
  croacia_vermelha: jerseyImg('#FF2400','#fff','#CC1E00'),
  // Brasileirão
  flamengo_preta: jerseyImg('#000','#CC0000','#111'),
  flamengo_branca: jerseyImg('#fff','#CC0000','#f5f5f5'),
  palmeiras_verde: jerseyImg('#006437','#fff','#004D2A'),
  palmeiras_branca: jerseyImg('#fff','#006437','#f5f5f5'),
  saopaulo_branca: jerseyImg('#fff','#CC0000','#f5f5f5'),
  atleticomineiro_preta: jerseyImg('#111','#fff','#222'),
  vasco_preta: jerseyImg('#000','#fff','#111'),
  gremiocobre: jerseyImg('#0049A0','#000','#0038808'),
  botafogo_preta: jerseyImg('#111','#fff','#000'),
  santos_branca: jerseyImg('#fff','#000','#f0f0f0'),
  // Europeus
  realmadrid_branca: jerseyImg('#fff','#D4AF37','#f8f8f8'),
  realmadrid_roxa: jerseyImg('#7B2D8B','#fff','#5A1E6A'),
  barcelona_azul: jerseyImg('#004D98','#A50044','#003377'),
  barcelona_cinza: jerseyImg('#888','#004D98','#666'),
  manchester_vermelha: jerseyImg('#DA020E','#FFE500','#B0000C'),
  liverpool_vermelha: jerseyImg('#C8102E','#F6EB61','#A00020'),
  chelsea_azul: jerseyImg('#034694','#fff','#022F6A'),
  arsenal_vermelha: jerseyImg('#EF0107','#fff','#CC0000'),
  manchester_city_azul: jerseyImg('#6CABDD','#fff','#4A9ABB'),
  tottenham_branca: jerseyImg('#fff','#132257','#f5f5f5'),
  psg_azul: jerseyImg('#004170','#DA020E','#002D50'),
  juventus_branca: jerseyImg('#fff','#000','#f0f0f0'),
  inter_azul: jerseyImg('#0068A8','#000','#004D80'),
  milan_vermelha: jerseyImg('#FB090B','#000','#D10000'),
  borussia_amarela: jerseyImg('#FDE100','#000','#DFC000'),
  ajax_branca: jerseyImg('#fff','#D2122E','#f5f5f5'),
  // Retrô
  retro_verde: jerseyImg('#2E8B57','#DAA520','#1E6B37'),
  retro_azul: jerseyImg('#1560BD','#FFD700','#0A4A9E'),
  retro_amarela: jerseyImg('#FFD700','#000','#DEB700'),
};

const PRODUTOS = [
  // BRASIL
  { id:'brasil-home-2026', nome:'Camisa Brasil Home 2026 | Copa do Mundo', cat:'selecoes', sub:'brasil', preco:179.90, de:249.90, img:J.brasil_verde, imgs:[J.brasil_verde,J.brasil_amarelo], tags:['copa-2026','selecoes','lancamento'], badge:'LANÇAMENTO', parcelas:10 },
  { id:'brasil-away-2026', nome:'Camisa Brasil Away 2026 | Copa do Mundo', cat:'selecoes', sub:'brasil', preco:169.90, de:239.90, img:J.brasil_amarelo, imgs:[J.brasil_amarelo,J.brasil_verde], tags:['copa-2026','selecoes'], badge:'NOVO', parcelas:10 },
  { id:'brasil-third-2026', nome:'Camisa Brasil Third 2026 | Copa do Mundo', cat:'selecoes', sub:'brasil', preco:169.90, de:229.90, img:J.brasil_azul, imgs:[J.brasil_azul], tags:['copa-2026','selecoes'], badge:'NOVO', parcelas:10 },
  { id:'brasil-home-2022', nome:'Camisa Brasil Home 2022 | Qatar', cat:'retro', sub:'brasil', preco:149.90, de:199.90, img:J.brasil_verde, imgs:[J.brasil_verde], tags:['retro','selecoes','brasil'], badge:'RETRÔ', parcelas:9 },
  { id:'brasil-jogador-2026', nome:'Camisa Brasil Home 2026 | Versão Jogador', cat:'selecoes', sub:'brasil', preco:249.90, de:329.90, img:J.brasil_verde, imgs:[J.brasil_verde,J.brasil_amarelo], tags:['selecoes','jogador','lancamento'], badge:'JOGADOR', parcelas:12 },
  // ARGENTINA
  { id:'argentina-home-2026', nome:'Camisa Argentina Home 2026 | Copa do Mundo', cat:'selecoes', sub:'argentina', preco:169.90, de:229.90, img:J.argentina_azul, imgs:[J.argentina_azul,J.argentina_branca], tags:['copa-2026','selecoes'], badge:'NOVO', parcelas:10 },
  { id:'argentina-away-2026', nome:'Camisa Argentina Away 2026 | Copa do Mundo', cat:'selecoes', sub:'argentina', preco:159.90, de:219.90, img:J.argentina_branca, imgs:[J.argentina_branca,J.argentina_azul], tags:['copa-2026','selecoes'], badge:'NOVO', parcelas:9 },
  { id:'argentina-home-2022', nome:'Camisa Argentina Home 2022 | Tri Campeã', cat:'retro', sub:'argentina', preco:169.90, de:239.90, img:J.argentina_azul, imgs:[J.argentina_azul], tags:['retro','selecoes'], badge:'RETRÔ', parcelas:10 },
  // FRANCA
  { id:'franca-home-2026', nome:'Camisa França Home 2026 | Copa do Mundo', cat:'selecoes', sub:'franca', preco:169.90, de:229.90, img:J.franca_azul, imgs:[J.franca_azul,J.franca_branca], tags:['copa-2026','selecoes'], badge:'NOVO', parcelas:10 },
  { id:'franca-away-2026', nome:'Camisa França Away 2026 | Copa do Mundo', cat:'selecoes', sub:'franca', preco:159.90, de:219.90, img:J.franca_branca, imgs:[J.franca_branca,J.franca_azul], tags:['copa-2026','selecoes'], badge:'NOVO', parcelas:9 },
  // PORTUGAL
  { id:'portugal-home-2026', nome:'Camisa Portugal Home 2026 | Copa do Mundo', cat:'selecoes', sub:'portugal', preco:169.90, de:229.90, img:J.portugal_vermelha, imgs:[J.portugal_vermelha,J.portugal_verde], tags:['copa-2026','selecoes'], badge:'NOVO', parcelas:10 },
  { id:'portugal-away-2026', nome:'Camisa Portugal Away 2026 | Copa do Mundo', cat:'selecoes', sub:'portugal', preco:159.90, de:219.90, img:J.portugal_verde, imgs:[J.portugal_verde,J.portugal_vermelha], tags:['copa-2026','selecoes'], badge:'NOVO', parcelas:9 },
  // ALEMANHA
  { id:'alemanha-home-2026', nome:'Camisa Alemanha Home 2026 | Copa do Mundo', cat:'selecoes', sub:'alemanha', preco:159.90, de:219.90, img:J.alemanha_branca, imgs:[J.alemanha_branca,J.alemanha_preta], tags:['copa-2026','selecoes'], badge:'NOVO', parcelas:9 },
  { id:'alemanha-away-2026', nome:'Camisa Alemanha Away 2026 | Copa do Mundo', cat:'selecoes', sub:'alemanha', preco:159.90, de:219.90, img:J.alemanha_preta, imgs:[J.alemanha_preta,J.alemanha_branca], tags:['copa-2026','selecoes'], badge:'NOVO', parcelas:9 },
  // ESPANHA
  { id:'espanha-home-2026', nome:'Camisa Espanha Home 2026 | Copa do Mundo', cat:'selecoes', sub:'espanha', preco:159.90, de:219.90, img:J.espanha_vermelha, imgs:[J.espanha_vermelha,J.espanha_azul], tags:['copa-2026','selecoes'], badge:'NOVO', parcelas:9 },
  { id:'espanha-away-2026', nome:'Camisa Espanha Away 2026 | Copa do Mundo', cat:'selecoes', sub:'espanha', preco:159.90, de:219.90, img:J.espanha_azul, imgs:[J.espanha_azul,J.espanha_vermelha], tags:['copa-2026','selecoes'], badge:'NOVO', parcelas:9 },
  // INGLATERRA
  { id:'inglaterra-home-2026', nome:'Camisa Inglaterra Home 2026 | Copa do Mundo', cat:'selecoes', sub:'inglaterra', preco:159.90, de:219.90, img:J.inglaterra_branca, imgs:[J.inglaterra_branca,J.inglaterra_vermelha], tags:['copa-2026','selecoes'], badge:'NOVO', parcelas:9 },
  { id:'inglaterra-away-2026', nome:'Camisa Inglaterra Away 2026 | Copa do Mundo', cat:'selecoes', sub:'inglaterra', preco:159.90, de:219.90, img:J.inglaterra_vermelha, imgs:[J.inglaterra_vermelha,J.inglaterra_branca], tags:['copa-2026','selecoes'], badge:'NOVO', parcelas:9 },
  // ITÁLIA
  { id:'italia-home-2026', nome:'Camisa Itália Home 2026 | Copa do Mundo', cat:'selecoes', sub:'italia', preco:159.90, de:219.90, img:J.italia_azul, imgs:[J.italia_azul], tags:['copa-2026','selecoes'], badge:'NOVO', parcelas:9 },
  // COLOMBIA
  { id:'colombia-home-2026', nome:'Camisa Colômbia Home 2026 | Copa do Mundo', cat:'selecoes', sub:'colombia', preco:149.90, de:199.90, img:J.colombia_amarela, imgs:[J.colombia_amarela], tags:['copa-2026','selecoes'], badge:'NOVO', parcelas:9 },
  // URUGUAI
  { id:'uruguai-home-2026', nome:'Camisa Uruguai Home 2026 | Copa do Mundo', cat:'selecoes', sub:'uruguai', preco:149.90, de:199.90, img:J.uruguai_azul, imgs:[J.uruguai_azul], tags:['copa-2026','selecoes'], badge:'NOVO', parcelas:9 },
  // MARROCOS
  { id:'marrocos-home-2026', nome:'Camisa Marrocos Home 2026 | Copa do Mundo', cat:'selecoes', sub:'marrocos', preco:149.90, de:199.90, img:J.marrocos_vermelha, imgs:[J.marrocos_vermelha], tags:['copa-2026','selecoes'], badge:'NOVO', parcelas:9 },
  // CORINTHIANS - imagens reais
  { id:'corinthians-home-2627', nome:'Camisa Corinthians Home 2026/27 Nike Torcedor Masculina', cat:'brasileirao', sub:'corinthians', preco:179.90, de:259.90, img:'assets/produtos/corinthians-home/img-1.webp', imgs:['assets/produtos/corinthians-home/img-1.webp','assets/produtos/corinthians-home/img-2.webp','assets/produtos/corinthians-home/img-3.webp','assets/produtos/corinthians-home/img-4.webp'], tags:['brasileirao','lancamento'], badge:'LANÇAMENTO', parcelas:10 },
  { id:'corinthians-treino-2627', nome:'Camisa Corinthians Treino 2026/27 Nike Torcedor Masculina', cat:'brasileirao', sub:'corinthians', preco:149.90, de:199.90, img:'assets/produtos/corinthians-treino/img-1.webp', imgs:['assets/produtos/corinthians-treino/img-1.webp','assets/produtos/corinthians-treino/img-2.webp','assets/produtos/corinthians-treino/img-3.webp','assets/produtos/corinthians-treino/img-4.webp'], tags:['brasileirao','treino'], badge:'NOVO', parcelas:9 },
  // FLAMENGO
  { id:'flamengo-home-2526', nome:'Camisa Flamengo Home 2025/26 Adidas Torcedor Masculina', cat:'brasileirao', sub:'flamengo', preco:189.90, de:259.90, img:J.flamengo_preta, imgs:[J.flamengo_preta,J.flamengo_branca], tags:['brasileirao','lancamento'], badge:'LANÇAMENTO', parcelas:10 },
  { id:'flamengo-away-2526', nome:'Camisa Flamengo Away 2025/26 Adidas Torcedor Masculina', cat:'brasileirao', sub:'flamengo', preco:179.90, de:249.90, img:J.flamengo_branca, imgs:[J.flamengo_branca,J.flamengo_preta], tags:['brasileirao'], badge:'NOVO', parcelas:10 },
  { id:'flamengo-treino-2526', nome:'Camisa Flamengo Treino 2025/26 Adidas Torcedor Masculina', cat:'brasileirao', sub:'flamengo', preco:149.90, de:199.90, img:J.flamengo_preta, imgs:[J.flamengo_preta], tags:['brasileirao','treino'], badge:'NOVO', parcelas:9 },
  { id:'flamengo-regata-2526', nome:'Camisa Flamengo Regata 2025/26 Masculina', cat:'brasileirao', sub:'flamengo', preco:139.90, de:189.90, img:J.flamengo_preta, imgs:[J.flamengo_preta], tags:['brasileirao'], badge:'OFERTA', parcelas:8 },
  // PALMEIRAS
  { id:'palmeiras-home-2526', nome:'Camisa Palmeiras Home 2025/26 Puma Torcedor Masculina', cat:'brasileirao', sub:'palmeiras', preco:179.90, de:249.90, img:J.palmeiras_verde, imgs:[J.palmeiras_verde,J.palmeiras_branca], tags:['brasileirao','lancamento'], badge:'LANÇAMENTO', parcelas:10 },
  { id:'palmeiras-away-2526', nome:'Camisa Palmeiras Away 2025/26 Puma Torcedor Masculina', cat:'brasileirao', sub:'palmeiras', preco:169.90, de:229.90, img:J.palmeiras_branca, imgs:[J.palmeiras_branca,J.palmeiras_verde], tags:['brasileirao'], badge:'NOVO', parcelas:10 },
  // SÃO PAULO
  { id:'saopaulo-home-2526', nome:'Camisa São Paulo Home 2025/26 Under Armour Torcedor', cat:'brasileirao', sub:'saopaulo', preco:169.90, de:229.90, img:J.saopaulo_branca, imgs:[J.saopaulo_branca], tags:['brasileirao','lancamento'], badge:'LANÇAMENTO', parcelas:10 },
  { id:'saopaulo-away-2526', nome:'Camisa São Paulo Away 2025/26 Under Armour Torcedor', cat:'brasileirao', sub:'saopaulo', preco:159.90, de:219.90, img:J.saopaulo_branca, imgs:[J.saopaulo_branca], tags:['brasileirao'], badge:'NOVO', parcelas:9 },
  // ATLETICO-MG
  { id:'atleticomineiro-home-2526', nome:'Camisa Atlético-MG Home 2025/26 Le Coq Sportif', cat:'brasileirao', sub:'atleticomineiro', preco:169.90, de:229.90, img:J.atleticomineiro_preta, imgs:[J.atleticomineiro_preta], tags:['brasileirao','lancamento'], badge:'LANÇAMENTO', parcelas:10 },
  // VASCO
  { id:'vasco-home-2526', nome:'Camisa Vasco Home 2025/26 Kappa Torcedor', cat:'brasileirao', sub:'vasco', preco:149.90, de:199.90, img:J.vasco_preta, imgs:[J.vasco_preta], tags:['brasileirao'], badge:'NOVO', parcelas:9 },
  // GREMIO
  { id:'gremio-home-2526', nome:'Camisa Grêmio Home 2025/26 Umbro Torcedor', cat:'brasileirao', sub:'gremio', preco:149.90, de:199.90, img:J.gremiocobre, imgs:[J.gremiocobre], tags:['brasileirao'], badge:'NOVO', parcelas:9 },
  // BOTAFOGO
  { id:'botafogo-home-2526', nome:'Camisa Botafogo Home 2025/26 Reebok Torcedor', cat:'brasileirao', sub:'botafogo', preco:159.90, de:219.90, img:J.botafogo_preta, imgs:[J.botafogo_preta], tags:['brasileirao','lancamento'], badge:'LANÇAMENTO', parcelas:9 },
  // SANTOS
  { id:'santos-home-2526', nome:'Camisa Santos Home 2025/26 Umbro Torcedor', cat:'brasileirao', sub:'santos', preco:149.90, de:199.90, img:J.santos_branca, imgs:[J.santos_branca], tags:['brasileirao'], badge:'NOVO', parcelas:9 },
  // REAL MADRID
  { id:'realmadrid-home-2526', nome:'Camisa Real Madrid Home 2025/26 Adidas Torcedor', cat:'europeu', sub:'realmadrid', preco:189.90, de:259.90, img:J.realmadrid_branca, imgs:[J.realmadrid_branca,J.realmadrid_roxa], tags:['europeu','lancamento','champions'], badge:'LANÇAMENTO', parcelas:10 },
  { id:'realmadrid-away-2526', nome:'Camisa Real Madrid Away 2025/26 Adidas Torcedor', cat:'europeu', sub:'realmadrid', preco:179.90, de:249.90, img:J.realmadrid_roxa, imgs:[J.realmadrid_roxa,J.realmadrid_branca], tags:['europeu','champions'], badge:'NOVO', parcelas:10 },
  { id:'realmadrid-jogador-2526', nome:'Camisa Real Madrid Home 2025/26 Adidas | Versão Jogador', cat:'europeu', sub:'realmadrid', preco:259.90, de:349.90, img:J.realmadrid_branca, imgs:[J.realmadrid_branca], tags:['europeu','jogador','champions'], badge:'JOGADOR', parcelas:12 },
  // BARCELONA
  { id:'barcelona-home-2526', nome:'Camisa Barcelona Home 2025/26 Nike Torcedor', cat:'europeu', sub:'barcelona', preco:179.90, de:249.90, img:J.barcelona_azul, imgs:[J.barcelona_azul,J.barcelona_cinza], tags:['europeu','lancamento'], badge:'LANÇAMENTO', parcelas:10 },
  { id:'barcelona-away-2526', nome:'Camisa Barcelona Away 2025/26 Nike Torcedor', cat:'europeu', sub:'barcelona', preco:169.90, de:229.90, img:J.barcelona_cinza, imgs:[J.barcelona_cinza,J.barcelona_azul], tags:['europeu'], badge:'NOVO', parcelas:10 },
  // MANCHESTER UNITED
  { id:'manchester-home-2526', nome:'Camisa Manchester United Home 2025/26 Adidas', cat:'europeu', sub:'manchesterunited', preco:169.90, de:229.90, img:J.manchester_vermelha, imgs:[J.manchester_vermelha], tags:['europeu','lancamento'], badge:'LANÇAMENTO', parcelas:10 },
  { id:'manchester-away-2526', nome:'Camisa Manchester United Away 2025/26 Adidas', cat:'europeu', sub:'manchesterunited', preco:159.90, de:219.90, img:J.manchester_vermelha, imgs:[J.manchester_vermelha], tags:['europeu'], badge:'NOVO', parcelas:9 },
  // LIVERPOOL
  { id:'liverpool-home-2526', nome:'Camisa Liverpool Home 2025/26 Nike Torcedor', cat:'europeu', sub:'liverpool', preco:169.90, de:229.90, img:J.liverpool_vermelha, imgs:[J.liverpool_vermelha], tags:['europeu','lancamento'], badge:'LANÇAMENTO', parcelas:10 },
  { id:'liverpool-away-2526', nome:'Camisa Liverpool Away 2025/26 Nike Torcedor', cat:'europeu', sub:'liverpool', preco:159.90, de:219.90, img:J.liverpool_vermelha, imgs:[J.liverpool_vermelha], tags:['europeu'], badge:'NOVO', parcelas:9 },
  // CHELSEA
  { id:'chelsea-home-2526', nome:'Camisa Chelsea Home 2025/26 Nike Torcedor', cat:'europeu', sub:'chelsea', preco:159.90, de:219.90, img:J.chelsea_azul, imgs:[J.chelsea_azul], tags:['europeu'], badge:'NOVO', parcelas:9 },
  // ARSENAL
  { id:'arsenal-home-2526', nome:'Camisa Arsenal Home 2025/26 Adidas Torcedor', cat:'europeu', sub:'arsenal', preco:159.90, de:219.90, img:J.arsenal_vermelha, imgs:[J.arsenal_vermelha], tags:['europeu'], badge:'NOVO', parcelas:9 },
  // MANCHESTER CITY
  { id:'manchestercity-home-2526', nome:'Camisa Manchester City Home 2025/26 Puma Torcedor', cat:'europeu', sub:'manchestercity', preco:169.90, de:229.90, img:J.manchester_city_azul, imgs:[J.manchester_city_azul], tags:['europeu','lancamento'], badge:'LANÇAMENTO', parcelas:10 },
  // PSG
  { id:'psg-home-2526', nome:'Camisa PSG Home 2025/26 Nike Torcedor', cat:'europeu', sub:'psg', preco:179.90, de:249.90, img:J.psg_azul, imgs:[J.psg_azul], tags:['europeu','lancamento'], badge:'LANÇAMENTO', parcelas:10 },
  // JUVENTUS
  { id:'juventus-home-2526', nome:'Camisa Juventus Home 2025/26 Adidas Torcedor', cat:'europeu', sub:'juventus', preco:159.90, de:219.90, img:J.juventus_branca, imgs:[J.juventus_branca], tags:['europeu'], badge:'NOVO', parcelas:9 },
  // AJAX
  { id:'ajax-home-2526', nome:'Camisa Ajax Home 2025/26 Adidas Torcedor', cat:'europeu', sub:'ajax', preco:149.90, de:199.90, img:J.ajax_branca, imgs:[J.ajax_branca], tags:['europeu'], badge:'NOVO', parcelas:9 },
  // INTER MILÃO
  { id:'inter-home-2526', nome:'Camisa Inter de Milão Home 2025/26 Nike Torcedor', cat:'europeu', sub:'inter', preco:169.90, de:229.90, img:J.inter_azul, imgs:[J.inter_azul], tags:['europeu','champions'], badge:'NOVO', parcelas:10 },
  // AC MILAN
  { id:'milan-home-2526', nome:'Camisa AC Milan Home 2025/26 Puma Torcedor', cat:'europeu', sub:'milan', preco:169.90, de:229.90, img:J.milan_vermelha, imgs:[J.milan_vermelha], tags:['europeu'], badge:'NOVO', parcelas:10 },
  // BORUSSIA
  { id:'borussia-home-2526', nome:'Camisa Borussia Dortmund Home 2025/26 Puma Torcedor', cat:'europeu', sub:'borussia', preco:159.90, de:219.90, img:J.borussia_amarela, imgs:[J.borussia_amarela], tags:['europeu','champions'], badge:'NOVO', parcelas:9 },
  // RETRÔ
  { id:'brasil-retro-1970', nome:'Camisa Brasil Retrô 1970 | Copa Jules Rimet', cat:'retro', sub:'brasil', preco:169.90, de:229.90, img:J.brasil_amarelo, imgs:[J.brasil_amarelo,J.brasil_verde], tags:['retro','brasil'], badge:'RETRÔ', parcelas:10 },
  { id:'brasil-retro-1994', nome:'Camisa Brasil Retrô 1994 | Tetracampeão EUA', cat:'retro', sub:'brasil', preco:159.90, de:219.90, img:J.brasil_verde, imgs:[J.brasil_verde], tags:['retro','brasil'], badge:'RETRÔ', parcelas:9 },
  { id:'brasil-retro-2002', nome:'Camisa Brasil Retrô 2002 | Pentacampeão Japão', cat:'retro', sub:'brasil', preco:169.90, de:239.90, img:J.brasil_verde, imgs:[J.brasil_verde], tags:['retro','brasil'], badge:'RETRÔ', parcelas:10 },
  { id:'flamengo-retro-2019', nome:'Camisa Flamengo Retrô 2019 | Libertadores', cat:'retro', sub:'flamengo', preco:159.90, de:219.90, img:J.flamengo_preta, imgs:[J.flamengo_preta], tags:['retro','flamengo'], badge:'RETRÔ', parcelas:9 },
  { id:'argentina-retro-1986', nome:'Camisa Argentina Retrô 1986 | Maradona', cat:'retro', sub:'argentina', preco:179.90, de:249.90, img:J.argentina_azul, imgs:[J.argentina_azul], tags:['retro','argentina'], badge:'RETRÔ', parcelas:10 },
  { id:'realmadrid-retro-2002', nome:'Camisa Real Madrid Retrô 2002 | Galácticos', cat:'retro', sub:'realmadrid', preco:169.90, de:229.90, img:J.realmadrid_branca, imgs:[J.realmadrid_branca], tags:['retro','europeu'], badge:'RETRÔ', parcelas:10 },
  // INFANTIL
  { id:'brasil-infantil-2026', nome:'Camisa Brasil Home 2026 | Copa do Mundo Infantil', cat:'infantil', sub:'brasil', preco:129.90, de:179.90, img:J.brasil_verde, imgs:[J.brasil_verde], tags:['infantil','copa-2026','brasil'], badge:'INFANTIL', parcelas:8 },
  { id:'flamengo-infantil-2526', nome:'Camisa Flamengo Home 2025/26 | Conjunto Infantil', cat:'infantil', sub:'flamengo', preco:119.90, de:169.90, img:J.flamengo_preta, imgs:[J.flamengo_preta], tags:['infantil','brasileirao'], badge:'INFANTIL', parcelas:8 },
  { id:'argentina-infantil-2026', nome:'Camisa Argentina Home 2026 | Infantil', cat:'infantil', sub:'argentina', preco:119.90, de:159.90, img:J.argentina_azul, imgs:[J.argentina_azul], tags:['infantil','copa-2026'], badge:'INFANTIL', parcelas:7 },
  { id:'realmadrid-infantil-2526', nome:'Camisa Real Madrid Home 2025/26 | Kit Infantil', cat:'infantil', sub:'realmadrid', preco:129.90, de:179.90, img:J.realmadrid_branca, imgs:[J.realmadrid_branca], tags:['infantil','europeu'], badge:'INFANTIL', parcelas:8 },
  { id:'manchester-infantil-2526', nome:'Camisa Manchester United Home 2025/26 | Kit Infantil', cat:'infantil', sub:'manchesterunited', preco:119.90, de:159.90, img:J.manchester_vermelha, imgs:[J.manchester_vermelha], tags:['infantil','europeu'], badge:'INFANTIL', parcelas:7 },
  // FEMININO
  { id:'brasil-feminino-2026', nome:'Camisa Brasil Home 2026 | Copa do Mundo Feminina', cat:'feminino', sub:'brasil', preco:159.90, de:219.90, img:J.brasil_verde, imgs:[J.brasil_verde], tags:['feminino','copa-2026','brasil'], badge:'NOVO', parcelas:9 },
  { id:'flamengo-feminino-2526', nome:'Camisa Flamengo Home 2025/26 | Feminina', cat:'feminino', sub:'flamengo', preco:149.90, de:199.90, img:J.flamengo_preta, imgs:[J.flamengo_preta], tags:['feminino','brasileirao'], badge:'NOVO', parcelas:9 },
  // OUTLET
  { id:'outlet-brasil-2024', nome:'Camisa Brasil Home 2024 | Outlet -40%', cat:'outlet', sub:'brasil', preco:99.90, de:169.90, img:J.brasil_verde, imgs:[J.brasil_verde], tags:['outlet'], badge:'OUTLET', parcelas:6 },
  { id:'outlet-flamengo-2024', nome:'Camisa Flamengo Home 2024 | Outlet -30%', cat:'outlet', sub:'flamengo', preco:109.90, de:159.90, img:J.flamengo_preta, imgs:[J.flamengo_preta], tags:['outlet'], badge:'OUTLET', parcelas:6 },
  { id:'outlet-realmadrid-2024', nome:'Camisa Real Madrid Home 2024 | Outlet -35%', cat:'outlet', sub:'realmadrid', preco:119.90, de:189.90, img:J.realmadrid_branca, imgs:[J.realmadrid_branca], tags:['outlet'], badge:'OUTLET', parcelas:7 },
  { id:'outlet-argentina-2024', nome:'Camisa Argentina Home 2024 | Outlet -40%', cat:'outlet', sub:'argentina', preco:99.90, de:169.90, img:J.argentina_azul, imgs:[J.argentina_azul], tags:['outlet'], badge:'OUTLET', parcelas:6 },
  { id:'outlet-palmeiras-2024', nome:'Camisa Palmeiras Home 2024 | Outlet -30%', cat:'outlet', sub:'palmeiras', preco:109.90, de:159.90, img:J.palmeiras_verde, imgs:[J.palmeiras_verde], tags:['outlet'], badge:'OUTLET', parcelas:6 },
  { id:'outlet-psg-2024', nome:'Camisa PSG Home 2024 | Outlet -25%', cat:'outlet', sub:'psg', preco:119.90, de:159.90, img:J.psg_azul, imgs:[J.psg_azul], tags:['outlet'], badge:'OUTLET', parcelas:7 },
  // MAIS SELEÇÕES
  { id:'holanda-home-2026', nome:'Camisa Holanda Home 2026 | Copa do Mundo', cat:'selecoes', sub:'holanda', preco:159.90, de:219.90, img:J.holanda_laranja, imgs:[J.holanda_laranja], tags:['copa-2026','selecoes'], badge:'NOVO', parcelas:9 },
  { id:'belgica-home-2026', nome:'Camisa Bélgica Home 2026 | Copa do Mundo', cat:'selecoes', sub:'belgica', preco:149.90, de:199.90, img:J.belgica_vermelha, imgs:[J.belgica_vermelha], tags:['copa-2026','selecoes'], badge:'NOVO', parcelas:9 },
  { id:'croacia-home-2026', nome:'Camisa Croácia Home 2026 | Copa do Mundo', cat:'selecoes', sub:'croacia', preco:149.90, de:199.90, img:J.croacia_vermelha, imgs:[J.croacia_vermelha], tags:['copa-2026','selecoes'], badge:'NOVO', parcelas:9 },
  { id:'senegal-home-2026', nome:'Camisa Senegal Home 2026 | Copa do Mundo', cat:'selecoes', sub:'senegal', preco:149.90, de:199.90, img:J.senegal_branca, imgs:[J.senegal_branca], tags:['copa-2026','selecoes'], badge:'NOVO', parcelas:9 },
  { id:'mexico-home-2026', nome:'Camisa México Home 2026 | Copa do Mundo', cat:'selecoes', sub:'mexico', preco:149.90, de:199.90, img:J.mexico_verde, imgs:[J.mexico_verde], tags:['copa-2026','selecoes'], badge:'NOVO', parcelas:9 },
  { id:'eua-home-2026', nome:'Camisa EUA Home 2026 | Copa do Mundo | Sede', cat:'selecoes', sub:'eua', preco:149.90, de:199.90, img:J.eua_branca, imgs:[J.eua_branca], tags:['copa-2026','selecoes'], badge:'NOVO', parcelas:9 },
  { id:'japao-home-2026', nome:'Camisa Japão Home 2026 | Copa do Mundo', cat:'selecoes', sub:'japao', preco:149.90, de:199.90, img:J.japao_azul, imgs:[J.japao_azul], tags:['copa-2026','selecoes'], badge:'NOVO', parcelas:9 },
  // MAIS EUROPEU
  { id:'borussia-away-2526', nome:'Camisa Borussia Dortmund Away 2025/26 Puma', cat:'europeu', sub:'borussia', preco:149.90, de:199.90, img:J.borussia_amarela, imgs:[J.borussia_amarela], tags:['europeu'], badge:'NOVO', parcelas:9 },
  { id:'tottenham-home-2526', nome:'Camisa Tottenham Home 2025/26 Nike Torcedor', cat:'europeu', sub:'tottenham', preco:149.90, de:199.90, img:J.tottenham_branca, imgs:[J.tottenham_branca], tags:['europeu'], badge:'NOVO', parcelas:9 },
  { id:'milan-away-2526', nome:'Camisa AC Milan Away 2025/26 Puma Torcedor', cat:'europeu', sub:'milan', preco:159.90, de:219.90, img:J.milan_vermelha, imgs:[J.milan_vermelha], tags:['europeu'], badge:'NOVO', parcelas:9 },
];

const CATEGORIAS = [
  { id:'selecoes', label:'Seleções', emoji:'🌍', bandeiras:['🇧🇷','🇦🇷','🇫🇷','🇩🇪','🇪🇸','🇵🇹','🏴󠁧󠁢󠁥󠁮󠁧󠁿','🇮🇹'] },
  { id:'brasileirao', label:'Brasileirão', emoji:'🟢', bandeiras:[] },
  { id:'europeu', label:'Europeu', emoji:'⭐', bandeiras:[] },
  { id:'retro', label:'Retrô', emoji:'🏆', bandeiras:[] },
  { id:'infantil', label:'Infantil', emoji:'👦', bandeiras:[] },
  { id:'feminino', label:'Feminino', emoji:'👩', bandeiras:[] },
  { id:'outlet', label:'Outlet', emoji:'🔥', bandeiras:[] },
];

const SELECOES_NAV = [
  { slug:'brasil', label:'Brasil', flag:'🇧🇷' },
  { slug:'argentina', label:'Argentina', flag:'🇦🇷' },
  { slug:'franca', label:'França', flag:'🇫🇷' },
  { slug:'portugal', label:'Portugal', flag:'🇵🇹' },
  { slug:'alemanha', label:'Alemanha', flag:'🇩🇪' },
  { slug:'espanha', label:'Espanha', flag:'🇪🇸' },
  { slug:'inglaterra', label:'Inglaterra', flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { slug:'italia', label:'Itália', flag:'🇮🇹' },
  { slug:'holanda', label:'Holanda', flag:'🇳🇱' },
  { slug:'belgica', label:'Bélgica', flag:'🇧🇪' },
  { slug:'croacia', label:'Croácia', flag:'🇭🇷' },
  { slug:'colombia', label:'Colômbia', flag:'🇨🇴' },
  { slug:'uruguai', label:'Uruguai', flag:'🇺🇾' },
  { slug:'marrocos', label:'Marrocos', flag:'🇲🇦' },
  { slug:'japao', label:'Japão', flag:'🇯🇵' },
  { slug:'mexico', label:'México', flag:'🇲🇽' },
  { slug:'eua', label:'EUA', flag:'🇺🇸' },
  { slug:'senegal', label:'Senegal', flag:'🇸🇳' },
];

const AVALIAÇÕES = [
  { nome:'Lucas M.', nota:5, texto:'Chegou antes do prazo, qualidade incrível. A camisa do Brasil ficou melhor que eu esperava!', data:'15/06/2026' },
  { nome:'Ana Paula R.', nota:5, texto:'Comprei a camisa do Flamengo pro meu marido e ele amou. Tecido premium, caimento perfeito.', data:'18/06/2026' },
  { nome:'Rafael S.', nota:5, texto:'Terceira compra na ULTRAGOL. Sempre confiável. Recomendo muito!', data:'20/06/2026' },
  { nome:'Mariana C.', nota:5, texto:'A versão jogador do Real Madrid é simplesmente perfeita. Vale cada centavo.', data:'22/06/2026' },
  { nome:'Pedro H.', nota:4, texto:'Ótima camisa, entrega rápida. Embalagem muito bem feita.', data:'23/06/2026' },
];

function getProduto(id) { return PRODUTOS.find(p => p.id === id); }
function getProdutosCat(cat) { return PRODUTOS.filter(p => p.cat === cat); }
function getProdutosSub(sub) { return PRODUTOS.filter(p => p.sub === sub); }
function searchProdutos(q) { const ql = q.toLowerCase(); return PRODUTOS.filter(p => p.nome.toLowerCase().includes(ql) || p.tags.some(t => t.includes(ql))); }
function fmt(v) { return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); }
function pct(de, por) { return Math.round((1 - por/de)*100); }
