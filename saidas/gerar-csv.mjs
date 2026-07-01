import { writeFileSync } from 'fs'

const VENDOR = 'Manto dos Craques'
const SIZES = ['P', 'M', 'G', 'GG', 'XGG']

const products = [
  // COPA DO MUNDO 2026 - SELECOES
  { h:'camisa-brasil-home-2026', t:'Camisa Brasil Home 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,brasil', p:'149.90', cp:'199.90' },
  { h:'camisa-brasil-away-2026', t:'Camisa Brasil Away 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,brasil', p:'149.90', cp:'199.90' },
  { h:'camisa-brasil-third-2026', t:'Camisa Brasil Third 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,brasil', p:'149.90', cp:'199.90' },
  { h:'camisa-argentina-home-2026', t:'Camisa Argentina Home 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,argentina', p:'149.90', cp:'199.90' },
  { h:'camisa-argentina-away-2026', t:'Camisa Argentina Away 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,argentina', p:'149.90', cp:'199.90' },
  { h:'camisa-franca-home-2026', t:'Camisa Franca Home 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,franca,europa', p:'149.90', cp:'199.90' },
  { h:'camisa-franca-away-2026', t:'Camisa Franca Away 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,franca,europa', p:'149.90', cp:'199.90' },
  { h:'camisa-alemanha-home-2026', t:'Camisa Alemanha Home 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,alemanha,europa', p:'149.90', cp:'199.90' },
  { h:'camisa-alemanha-away-2026', t:'Camisa Alemanha Away 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,alemanha,europa', p:'149.90', cp:'199.90' },
  { h:'camisa-espanha-home-2026', t:'Camisa Espanha Home 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,espanha,europa', p:'149.90', cp:'199.90' },
  { h:'camisa-espanha-away-2026', t:'Camisa Espanha Away 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,espanha,europa', p:'149.90', cp:'199.90' },
  { h:'camisa-portugal-home-2026', t:'Camisa Portugal Home 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,portugal,europa', p:'149.90', cp:'199.90' },
  { h:'camisa-portugal-away-2026', t:'Camisa Portugal Away 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,portugal,europa', p:'149.90', cp:'199.90' },
  { h:'camisa-inglaterra-home-2026', t:'Camisa Inglaterra Home 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,inglaterra,europa', p:'149.90', cp:'199.90' },
  { h:'camisa-inglaterra-away-2026', t:'Camisa Inglaterra Away 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,inglaterra,europa', p:'149.90', cp:'199.90' },
  { h:'camisa-italia-home-2026', t:'Camisa Italia Home 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,italia,europa', p:'149.90', cp:'199.90' },
  { h:'camisa-holanda-home-2026', t:'Camisa Holanda Home 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,holanda,europa', p:'149.90', cp:'199.90' },
  { h:'camisa-belgica-home-2026', t:'Camisa Belgica Home 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,belgica,europa', p:'149.90', cp:'199.90' },
  { h:'camisa-croacia-home-2026', t:'Camisa Croatia Home 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,croacia,europa', p:'149.90', cp:'199.90' },
  { h:'camisa-uruguai-home-2026', t:'Camisa Uruguai Home 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,uruguai,america-do-sul', p:'149.90', cp:'199.90' },
  { h:'camisa-colombia-home-2026', t:'Camisa Colombia Home 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,colombia,america-do-sul', p:'149.90', cp:'199.90' },
  { h:'camisa-mexico-home-2026', t:'Camisa Mexico Home 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,mexico', p:'149.90', cp:'199.90' },
  { h:'camisa-eua-home-2026', t:'Camisa EUA Home 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,eua', p:'149.90', cp:'199.90' },
  { h:'camisa-canada-home-2026', t:'Camisa Canada Home 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,canada', p:'149.90', cp:'199.90' },
  { h:'camisa-japao-home-2026', t:'Camisa Japao Home 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,japao,asia', p:'149.90', cp:'199.90' },
  { h:'camisa-marrocos-home-2026', t:'Camisa Marrocos Home 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,marrocos,africa', p:'149.90', cp:'199.90' },
  { h:'camisa-senegal-home-2026', t:'Camisa Senegal Home 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,senegal,africa', p:'149.90', cp:'199.90' },
  { h:'camisa-nigeria-home-2026', t:'Camisa Nigeria Home 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,nigeria,africa', p:'149.90', cp:'199.90' },
  { h:'camisa-venezuela-home-2026', t:'Camisa Venezuela Home 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,venezuela,america-do-sul', p:'149.90', cp:'199.90' },
  { h:'camisa-equador-home-2026', t:'Camisa Equador Home 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,equador,america-do-sul', p:'149.90', cp:'199.90' },
  { h:'camisa-chile-home-2026', t:'Camisa Chile Home 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,chile,america-do-sul', p:'149.90', cp:'199.90' },
  { h:'camisa-paraguai-home-2026', t:'Camisa Paraguai Home 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,paraguai,america-do-sul', p:'149.90', cp:'199.90' },
  { h:'camisa-suica-home-2026', t:'Camisa Suica Home 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,suica,europa', p:'149.90', cp:'199.90' },
  { h:'camisa-dinamarca-home-2026', t:'Camisa Dinamarca Home 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,dinamarca,europa', p:'149.90', cp:'199.90' },
  { h:'camisa-australia-home-2026', t:'Camisa Australia Home 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,australia', p:'149.90', cp:'199.90' },

  // CLUBES BRASILEIROS
  { h:'camisa-flamengo-home-2526', t:'Camisa Flamengo Home 2025/26', type:'Clubes Brasileiros', tags:'clubes-brasileiros,flamengo,rio-de-janeiro', p:'129.90', cp:'179.90' },
  { h:'camisa-flamengo-away-2526', t:'Camisa Flamengo Away 2025/26', type:'Clubes Brasileiros', tags:'clubes-brasileiros,flamengo,rio-de-janeiro', p:'129.90', cp:'179.90' },
  { h:'camisa-flamengo-third-2526', t:'Camisa Flamengo Third 2025/26', type:'Clubes Brasileiros', tags:'clubes-brasileiros,flamengo,rio-de-janeiro', p:'129.90', cp:'179.90' },
  { h:'camisa-corinthians-home-2526', t:'Camisa Corinthians Home 2025/26', type:'Clubes Brasileiros', tags:'clubes-brasileiros,corinthians,sao-paulo', p:'129.90', cp:'179.90' },
  { h:'camisa-corinthians-away-2526', t:'Camisa Corinthians Away 2025/26', type:'Clubes Brasileiros', tags:'clubes-brasileiros,corinthians,sao-paulo', p:'129.90', cp:'179.90' },
  { h:'camisa-palmeiras-home-2526', t:'Camisa Palmeiras Home 2025/26', type:'Clubes Brasileiros', tags:'clubes-brasileiros,palmeiras,sao-paulo', p:'129.90', cp:'179.90' },
  { h:'camisa-palmeiras-away-2526', t:'Camisa Palmeiras Away 2025/26', type:'Clubes Brasileiros', tags:'clubes-brasileiros,palmeiras,sao-paulo', p:'129.90', cp:'179.90' },
  { h:'camisa-sao-paulo-home-2526', t:'Camisa Sao Paulo Home 2025/26', type:'Clubes Brasileiros', tags:'clubes-brasileiros,sao-paulo,tricolor', p:'129.90', cp:'179.90' },
  { h:'camisa-sao-paulo-away-2526', t:'Camisa Sao Paulo Away 2025/26', type:'Clubes Brasileiros', tags:'clubes-brasileiros,sao-paulo,tricolor', p:'129.90', cp:'179.90' },
  { h:'camisa-botafogo-home-2526', t:'Camisa Botafogo Home 2025/26', type:'Clubes Brasileiros', tags:'clubes-brasileiros,botafogo,rio-de-janeiro', p:'129.90', cp:'179.90' },
  { h:'camisa-botafogo-away-2526', t:'Camisa Botafogo Away 2025/26', type:'Clubes Brasileiros', tags:'clubes-brasileiros,botafogo,rio-de-janeiro', p:'129.90', cp:'179.90' },
  { h:'camisa-vasco-home-2526', t:'Camisa Vasco da Gama Home 2025/26', type:'Clubes Brasileiros', tags:'clubes-brasileiros,vasco,rio-de-janeiro', p:'129.90', cp:'179.90' },
  { h:'camisa-vasco-away-2526', t:'Camisa Vasco da Gama Away 2025/26', type:'Clubes Brasileiros', tags:'clubes-brasileiros,vasco,rio-de-janeiro', p:'129.90', cp:'179.90' },
  { h:'camisa-gremio-home-2526', t:'Camisa Gremio Home 2025/26', type:'Clubes Brasileiros', tags:'clubes-brasileiros,gremio,rio-grande-do-sul', p:'129.90', cp:'179.90' },
  { h:'camisa-gremio-away-2526', t:'Camisa Gremio Away 2025/26', type:'Clubes Brasileiros', tags:'clubes-brasileiros,gremio,rio-grande-do-sul', p:'129.90', cp:'179.90' },
  { h:'camisa-internacional-home-2526', t:'Camisa Internacional Home 2025/26', type:'Clubes Brasileiros', tags:'clubes-brasileiros,internacional,rio-grande-do-sul', p:'129.90', cp:'179.90' },
  { h:'camisa-internacional-away-2526', t:'Camisa Internacional Away 2025/26', type:'Clubes Brasileiros', tags:'clubes-brasileiros,internacional,rio-grande-do-sul', p:'129.90', cp:'179.90' },
  { h:'camisa-atletico-mg-home-2526', t:'Camisa Atletico Mineiro Home 2025/26', type:'Clubes Brasileiros', tags:'clubes-brasileiros,atletico-mg,minas-gerais', p:'129.90', cp:'179.90' },
  { h:'camisa-atletico-mg-away-2526', t:'Camisa Atletico Mineiro Away 2025/26', type:'Clubes Brasileiros', tags:'clubes-brasileiros,atletico-mg,minas-gerais', p:'129.90', cp:'179.90' },
  { h:'camisa-cruzeiro-home-2526', t:'Camisa Cruzeiro Home 2025/26', type:'Clubes Brasileiros', tags:'clubes-brasileiros,cruzeiro,minas-gerais', p:'129.90', cp:'179.90' },
  { h:'camisa-fluminense-home-2526', t:'Camisa Fluminense Home 2025/26', type:'Clubes Brasileiros', tags:'clubes-brasileiros,fluminense,rio-de-janeiro', p:'129.90', cp:'179.90' },
  { h:'camisa-fluminense-away-2526', t:'Camisa Fluminense Away 2025/26', type:'Clubes Brasileiros', tags:'clubes-brasileiros,fluminense,rio-de-janeiro', p:'129.90', cp:'179.90' },
  { h:'camisa-santos-home-2526', t:'Camisa Santos Home 2025/26', type:'Clubes Brasileiros', tags:'clubes-brasileiros,santos,sao-paulo', p:'129.90', cp:'179.90' },
  { h:'camisa-fortaleza-home-2526', t:'Camisa Fortaleza Home 2025/26', type:'Clubes Brasileiros', tags:'clubes-brasileiros,fortaleza,ceara', p:'129.90', cp:'179.90' },
  { h:'camisa-bahia-home-2526', t:'Camisa Bahia Home 2025/26', type:'Clubes Brasileiros', tags:'clubes-brasileiros,bahia,nordeste', p:'129.90', cp:'179.90' },

  // CLUBES EUROPEUS
  { h:'camisa-real-madrid-home-2526', t:'Camisa Real Madrid Home 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,real-madrid,espanha,la-liga', p:'129.90', cp:'179.90' },
  { h:'camisa-real-madrid-away-2526', t:'Camisa Real Madrid Away 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,real-madrid,espanha,la-liga', p:'129.90', cp:'179.90' },
  { h:'camisa-barcelona-home-2526', t:'Camisa Barcelona Home 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,barcelona,espanha,la-liga', p:'129.90', cp:'179.90' },
  { h:'camisa-barcelona-away-2526', t:'Camisa Barcelona Away 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,barcelona,espanha,la-liga', p:'129.90', cp:'179.90' },
  { h:'camisa-psg-home-2526', t:'Camisa PSG Home 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,psg,franca,ligue-1', p:'129.90', cp:'179.90' },
  { h:'camisa-psg-away-2526', t:'Camisa PSG Away 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,psg,franca,ligue-1', p:'129.90', cp:'179.90' },
  { h:'camisa-manchester-city-home-2526', t:'Camisa Manchester City Home 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,manchester-city,inglaterra,premier-league', p:'129.90', cp:'179.90' },
  { h:'camisa-manchester-city-away-2526', t:'Camisa Manchester City Away 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,manchester-city,inglaterra,premier-league', p:'129.90', cp:'179.90' },
  { h:'camisa-liverpool-home-2526', t:'Camisa Liverpool Home 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,liverpool,inglaterra,premier-league', p:'129.90', cp:'179.90' },
  { h:'camisa-liverpool-away-2526', t:'Camisa Liverpool Away 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,liverpool,inglaterra,premier-league', p:'129.90', cp:'179.90' },
  { h:'camisa-arsenal-home-2526', t:'Camisa Arsenal Home 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,arsenal,inglaterra,premier-league', p:'129.90', cp:'179.90' },
  { h:'camisa-chelsea-home-2526', t:'Camisa Chelsea Home 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,chelsea,inglaterra,premier-league', p:'129.90', cp:'179.90' },
  { h:'camisa-manchester-united-home-2526', t:'Camisa Manchester United Home 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,manchester-united,inglaterra,premier-league', p:'129.90', cp:'179.90' },
  { h:'camisa-tottenham-home-2526', t:'Camisa Tottenham Home 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,tottenham,inglaterra,premier-league', p:'129.90', cp:'179.90' },
  { h:'camisa-bayern-home-2526', t:'Camisa Bayern Munich Home 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,bayern-munich,alemanha,bundesliga', p:'129.90', cp:'179.90' },
  { h:'camisa-bayern-away-2526', t:'Camisa Bayern Munich Away 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,bayern-munich,alemanha,bundesliga', p:'129.90', cp:'179.90' },
  { h:'camisa-borussia-dortmund-home-2526', t:'Camisa Borussia Dortmund Home 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,borussia-dortmund,alemanha,bundesliga', p:'129.90', cp:'179.90' },
  { h:'camisa-juventus-home-2526', t:'Camisa Juventus Home 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,juventus,italia,serie-a', p:'129.90', cp:'179.90' },
  { h:'camisa-ac-milan-home-2526', t:'Camisa AC Milan Home 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,ac-milan,italia,serie-a', p:'129.90', cp:'179.90' },
  { h:'camisa-inter-milan-home-2526', t:'Camisa Inter Milan Home 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,inter-milan,italia,serie-a', p:'129.90', cp:'179.90' },
  { h:'camisa-atletico-madrid-home-2526', t:'Camisa Atletico Madrid Home 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,atletico-madrid,espanha,la-liga', p:'129.90', cp:'179.90' },
  { h:'camisa-napoli-home-2526', t:'Camisa Napoli Home 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,napoli,italia,serie-a', p:'129.90', cp:'179.90' },
  { h:'camisa-ajax-home-2526', t:'Camisa Ajax Home 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,ajax,holanda', p:'129.90', cp:'179.90' },
  { h:'camisa-porto-home-2526', t:'Camisa Porto Home 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,porto,portugal', p:'129.90', cp:'179.90' },
  { h:'camisa-benfica-home-2526', t:'Camisa Benfica Home 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,benfica,portugal', p:'129.90', cp:'179.90' },

  // RETRO
  { h:'camisa-brasil-retro-1970', t:'Camisa Brasil Retro 1970 - Pele - Tricampeonato', type:'Retro', tags:'retro,brasil,copa-1970,classico', p:'89.90', cp:'129.90' },
  { h:'camisa-brasil-retro-1994', t:'Camisa Brasil Retro 1994 - Romario - Tetracampeonato', type:'Retro', tags:'retro,brasil,copa-1994,classico', p:'89.90', cp:'129.90' },
  { h:'camisa-brasil-retro-2002', t:'Camisa Brasil Retro 2002 - Ronaldo - Pentacampeonato', type:'Retro', tags:'retro,brasil,copa-2002,classico', p:'89.90', cp:'129.90' },
  { h:'camisa-argentina-retro-1986', t:'Camisa Argentina Retro 1986 - Maradona', type:'Retro', tags:'retro,argentina,copa-1986,classico,maradona', p:'89.90', cp:'129.90' },
  { h:'camisa-franca-retro-1998', t:'Camisa Franca Retro 1998 - Zidane - Copa em Casa', type:'Retro', tags:'retro,franca,copa-1998,classico,zidane', p:'89.90', cp:'129.90' },
  { h:'camisa-alemanha-retro-1990', t:'Camisa Alemanha Retro 1990 - Tricampeonato', type:'Retro', tags:'retro,alemanha,copa-1990,classico', p:'89.90', cp:'129.90' },
  { h:'camisa-italia-retro-1982', t:'Camisa Italia Retro 1982 - Paolo Rossi', type:'Retro', tags:'retro,italia,copa-1982,classico', p:'89.90', cp:'129.90' },
  { h:'camisa-holanda-retro-1988', t:'Camisa Holanda Retro 1988 - Van Basten - Euro', type:'Retro', tags:'retro,holanda,euro-1988,classico', p:'89.90', cp:'129.90' },
  { h:'camisa-flamengo-retro-1981', t:'Camisa Flamengo Retro 1981 - Zico - Libertadores', type:'Retro', tags:'retro,flamengo,libertadores-1981,classico,zico', p:'89.90', cp:'129.90' },
  { h:'camisa-corinthians-retro-2012', t:'Camisa Corinthians Retro 2012 - Libertadores', type:'Retro', tags:'retro,corinthians,libertadores-2012,classico', p:'89.90', cp:'129.90' },
  { h:'camisa-santos-retro-1962', t:'Camisa Santos Retro 1962 - Pele - Libertadores', type:'Retro', tags:'retro,santos,libertadores-1962,classico,pele', p:'89.90', cp:'129.90' },
  { h:'camisa-real-madrid-retro-2002', t:'Camisa Real Madrid Retro 2002 - Galacticos', type:'Retro', tags:'retro,real-madrid,champions-2002,classico,zidane', p:'89.90', cp:'129.90' },
  { h:'camisa-barcelona-retro-2009', t:'Camisa Barcelona Retro 2009 - Messi - Sextete', type:'Retro', tags:'retro,barcelona,champions-2009,classico,messi', p:'89.90', cp:'129.90' },
  { h:'camisa-psg-retro-2022', t:'Camisa PSG Retro 2022 - Messi Neymar Mbappe', type:'Retro', tags:'retro,psg,2022,classico,messi,neymar', p:'89.90', cp:'129.90' },
  { h:'camisa-milan-retro-2003', t:'Camisa AC Milan Retro 2003 - Champions League', type:'Retro', tags:'retro,ac-milan,champions-2003,classico,maldini', p:'89.90', cp:'129.90' },
  { h:'camisa-ajax-retro-1995', t:'Camisa Ajax Retro 1995 - Champions League', type:'Retro', tags:'retro,ajax,champions-1995,classico', p:'89.90', cp:'129.90' },
  { h:'camisa-brasil-retro-2006', t:'Camisa Brasil Retro 2006 - Ronaldinho', type:'Retro', tags:'retro,brasil,copa-2006,classico,ronaldinho', p:'89.90', cp:'129.90' },
  { h:'camisa-argentina-retro-1978', t:'Camisa Argentina Retro 1978 - Primeiro Titulo', type:'Retro', tags:'retro,argentina,copa-1978,classico', p:'89.90', cp:'129.90' },
  { h:'camisa-liverpool-retro-2005', t:'Camisa Liverpool Retro 2005 - Champions League Istanbul', type:'Retro', tags:'retro,liverpool,champions-2005,classico', p:'89.90', cp:'129.90' },
  { h:'camisa-manchester-united-retro-1999', t:'Camisa Manchester United Retro 1999 - Treble', type:'Retro', tags:'retro,manchester-united,champions-1999,classico', p:'89.90', cp:'129.90' },

  // MAIS CLUBES EUROPEUS
  { h:'camisa-sevilla-home-2526', t:'Camisa Sevilla Home 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,sevilla,espanha,la-liga', p:'129.90', cp:'179.90' },
  { h:'camisa-roma-home-2526', t:'Camisa Roma Home 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,roma,italia,serie-a', p:'129.90', cp:'179.90' },
  { h:'camisa-lyon-home-2526', t:'Camisa Lyon Home 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,lyon,franca,ligue-1', p:'129.90', cp:'179.90' },
  { h:'camisa-sporting-home-2526', t:'Camisa Sporting CP Home 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,sporting,portugal', p:'129.90', cp:'179.90' },
  { h:'camisa-celtic-home-2526', t:'Camisa Celtic Home 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,celtic,escocia', p:'129.90', cp:'179.90' },
  { h:'camisa-bayer-leverkusen-home-2526', t:'Camisa Bayer Leverkusen Home 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,bayer-leverkusen,alemanha,bundesliga', p:'129.90', cp:'179.90' },
  { h:'camisa-inter-miami-home-2526', t:'Camisa Inter Miami Home 2025/26 - Messi', type:'Clubes Europeus', tags:'clubes-europeus,inter-miami,eua,mls,messi', p:'129.90', cp:'179.90' },
  { h:'camisa-galatasaray-home-2526', t:'Camisa Galatasaray Home 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,galatasaray,turquia', p:'129.90', cp:'179.90' },
  { h:'camisa-real-betis-home-2526', t:'Camisa Real Betis Home 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,real-betis,espanha,la-liga', p:'129.90', cp:'179.90' },
  { h:'camisa-fiorentina-home-2526', t:'Camisa Fiorentina Home 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,fiorentina,italia,serie-a', p:'129.90', cp:'179.90' },

  // MAIS CLUBES BRASILEIROS
  { h:'camisa-athletico-pr-home-2526', t:'Camisa Athletico Paranaense Home 2025/26', type:'Clubes Brasileiros', tags:'clubes-brasileiros,athletico-pr,parana', p:'129.90', cp:'179.90' },
  { h:'camisa-sport-home-2526', t:'Camisa Sport Recife Home 2025/26', type:'Clubes Brasileiros', tags:'clubes-brasileiros,sport,pernambuco', p:'129.90', cp:'179.90' },
  { h:'camisa-ceara-home-2526', t:'Camisa Ceara Home 2025/26', type:'Clubes Brasileiros', tags:'clubes-brasileiros,ceara,nordeste', p:'129.90', cp:'179.90' },
  { h:'camisa-rbd-home-2526', t:'Camisa Red Bull Bragantino Home 2025/26', type:'Clubes Brasileiros', tags:'clubes-brasileiros,bragantino,sao-paulo', p:'129.90', cp:'179.90' },
  { h:'camisa-goias-home-2526', t:'Camisa Goias Home 2025/26', type:'Clubes Brasileiros', tags:'clubes-brasileiros,goias,centro-oeste', p:'129.90', cp:'179.90' },

  // MAIS SELECOES
  { h:'camisa-portugal-third-2026', t:'Camisa Portugal Third 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,portugal,europa', p:'149.90', cp:'199.90' },
  { h:'camisa-brasil-goleiro-2026', t:'Camisa Brasil Goleiro 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,brasil,goleiro', p:'149.90', cp:'199.90' },
  { h:'camisa-argentina-third-2026', t:'Camisa Argentina Third 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,argentina', p:'149.90', cp:'199.90' },
  { h:'camisa-coreia-home-2026', t:'Camisa Coreia do Sul Home 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,coreia,asia', p:'149.90', cp:'199.90' },
  { h:'camisa-polonia-home-2026', t:'Camisa Polonia Home 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,polonia,europa', p:'149.90', cp:'199.90' },

  // MAIS RETRO
  { h:'camisa-palmeiras-retro-1999', t:'Camisa Palmeiras Retro 1999 - Libertadores', type:'Retro', tags:'retro,palmeiras,libertadores-1999,classico', p:'89.90', cp:'129.90' },
  { h:'camisa-inter-retro-2006', t:'Camisa Internacional Retro 2006 - Mundial', type:'Retro', tags:'retro,internacional,mundial-2006,classico', p:'89.90', cp:'129.90' },
  { h:'camisa-brasil-retro-1998', t:'Camisa Brasil Retro 1998 - Ronaldo - Final', type:'Retro', tags:'retro,brasil,copa-1998,classico,ronaldo', p:'89.90', cp:'129.90' },
  { h:'camisa-gremio-retro-1983', t:'Camisa Gremio Retro 1983 - Libertadores', type:'Retro', tags:'retro,gremio,libertadores-1983,classico', p:'89.90', cp:'129.90' },
  { h:'camisa-cruzeiro-retro-2003', t:'Camisa Cruzeiro Retro 2003 - Libertadores', type:'Retro', tags:'retro,cruzeiro,libertadores-2003,classico', p:'89.90', cp:'129.90' },
  { h:'camisa-bayern-retro-2020', t:'Camisa Bayern Munich Retro 2020 - Sextete', type:'Retro', tags:'retro,bayern-munich,champions-2020,classico', p:'89.90', cp:'129.90' },
  { h:'camisa-chelsea-retro-2012', t:'Camisa Chelsea Retro 2012 - Champions League', type:'Retro', tags:'retro,chelsea,champions-2012,classico', p:'89.90', cp:'129.90' },
  { h:'camisa-atletico-mg-retro-2021', t:'Camisa Atletico Mineiro Retro 2021 - Libertadores', type:'Retro', tags:'retro,atletico-mg,libertadores-2021,classico', p:'89.90', cp:'129.90' },
  { h:'camisa-flamengo-retro-2022', t:'Camisa Flamengo Retro 2022 - Libertadores', type:'Retro', tags:'retro,flamengo,libertadores-2022,classico', p:'89.90', cp:'129.90' },
  { h:'camisa-botafogo-retro-2024', t:'Camisa Botafogo Retro 2024 - Libertadores', type:'Retro', tags:'retro,botafogo,libertadores-2024,classico', p:'89.90', cp:'129.90' },
  { h:'camisa-portugal-retro-2016', t:'Camisa Portugal Retro 2016 - Euro Campeao', type:'Retro', tags:'retro,portugal,euro-2016,classico,ronaldo', p:'89.90', cp:'129.90' },
  { h:'camisa-espanha-retro-2010', t:'Camisa Espanha Retro 2010 - Copa Campeao', type:'Retro', tags:'retro,espanha,copa-2010,classico,iniesta', p:'89.90', cp:'129.90' },
  { h:'camisa-italy-retro-2006', t:'Camisa Italia Retro 2006 - Copa Campeao', type:'Retro', tags:'retro,italia,copa-2006,classico,cannavaro', p:'89.90', cp:'129.90' },
  { h:'camisa-nigeria-retro-1994', t:'Camisa Nigeria Retro 1994 - Green Eagles', type:'Retro', tags:'retro,nigeria,copa-1994,classico', p:'89.90', cp:'129.90' },
  { h:'camisa-senegal-retro-2002', t:'Camisa Senegal Retro 2002 - Surpresa da Copa', type:'Retro', tags:'retro,senegal,copa-2002,classico', p:'89.90', cp:'129.90' },

  // COMPLETANDO 150
  { h:'camisa-flamengo-third-retro-2019', t:'Camisa Flamengo Third Retro 2019 - Libertadores', type:'Retro', tags:'retro,flamengo,libertadores-2019,classico', p:'89.90', cp:'129.90' },
  { h:'camisa-real-madrid-third-2526', t:'Camisa Real Madrid Third 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,real-madrid,espanha,la-liga', p:'129.90', cp:'179.90' },
  { h:'camisa-barcelona-third-2526', t:'Camisa Barcelona Third 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,barcelona,espanha,la-liga', p:'129.90', cp:'179.90' },
  { h:'camisa-franca-third-2026', t:'Camisa Franca Third 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,franca,europa', p:'149.90', cp:'199.90' },
  { h:'camisa-alemanha-third-2026', t:'Camisa Alemanha Third 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,alemanha,europa', p:'149.90', cp:'199.90' },
  { h:'camisa-corinthians-third-2526', t:'Camisa Corinthians Third 2025/26', type:'Clubes Brasileiros', tags:'clubes-brasileiros,corinthians,sao-paulo', p:'129.90', cp:'179.90' },
  { h:'camisa-palmeiras-third-2526', t:'Camisa Palmeiras Third 2025/26', type:'Clubes Brasileiros', tags:'clubes-brasileiros,palmeiras,sao-paulo', p:'129.90', cp:'179.90' },
  { h:'camisa-psg-third-2526', t:'Camisa PSG Third 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,psg,franca,ligue-1', p:'129.90', cp:'179.90' },
  { h:'camisa-liverpool-third-2526', t:'Camisa Liverpool Third 2025/26', type:'Clubes Europeus', tags:'clubes-europeus,liverpool,inglaterra,premier-league', p:'129.90', cp:'179.90' },
  { h:'camisa-espanha-away-2026', t:'Camisa Espanha Away 2026 | Copa do Mundo', type:'Selecoes Copa 2026', tags:'copa-2026,selecoes,espanha,europa', p:'149.90', cp:'199.90' },
]

const header = [
  'Handle','Title','Body (HTML)','Vendor','Type','Tags','Published',
  'Option1 Name','Option1 Value','Variant SKU',
  'Variant Grams','Variant Inventory Tracker','Variant Inventory Qty',
  'Variant Inventory Policy','Variant Fulfillment Service',
  'Variant Price','Variant Compare At Price',
  'Variant Requires Shipping','Variant Taxable',
  'Image Src','Image Position','Image Alt Text','Status'
].join(',')

const rows = [header]

for (const p of products) {
  const desc = `<p>Camisa oficial ${p.t}. Tecido dry-fit de alta performance, perfeito para usar no dia a dia ou torcer pelo seu time. Disponivel nos tamanhos P, M, G, GG e XGG.</p>`
  SIZES.forEach((size, i) => {
    const sku = `${p.h.toUpperCase()}-${size}`
    if (i === 0) {
      rows.push([
        p.h,
        `"${p.t}"`,
        `"${desc}"`,
        VENDOR,
        p.type,
        `"${p.tags}"`,
        'TRUE',
        'Tamanho',
        size,
        sku,
        '300',
        'shopify',
        '10',
        'deny',
        'manual',
        p.p,
        p.cp,
        'TRUE',
        'TRUE',
        '','','',
        'active'
      ].join(','))
    } else {
      rows.push([
        p.h,'','','','','','',
        '',size,sku,
        '300','shopify','10','deny','manual',
        p.p,p.cp,
        'TRUE','TRUE',
        '','','',
        'active'
      ].join(','))
    }
  })
}

writeFileSync('C:/Users/seven/MazyOS/saidas/produtos-manto-dos-craques.csv', rows.join('\n'), 'utf8')
console.log(`Gerado: ${products.length} produtos, ${rows.length - 1} linhas`)
