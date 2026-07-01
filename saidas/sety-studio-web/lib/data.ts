export type Niche = 'odontologia' | 'estetica' | 'solar' | 'advocacia' | 'imobiliaria' | 'consorcio';

export type Metric = { label: string; value: string };

export type Project = {
  id: number;
  slug: string;
  niche: Niche;
  nicheLabel: string;
  nicheIcon: string;
  title: string;
  tagline: string;
  result: string;
  tags: string[];
  year: string;
  gradient: string;
  featured?: boolean;
  badge?: string;
  demoUrl?: string;
  demoPath?: string;
  socialMediaPath?: string;
  thumbPath?: string;
  technologies?: string[];
  // Case study
  objective: string;
  problem: string;
  solution: string;
  impact: string;
  metrics: Metric[];
};

export const PROJECTS: Project[] = [
  {
    id: 7,
    slug: 'alex-messias-gwm',
    niche: 'consorcio',
    nicheLabel: 'Automotivo',
    nicheIcon: '🚗',
    title: 'Alex Messias GWM',
    tagline: 'Consultor especialista GWM — interior de São Paulo',
    result: '300+ clientes atendidos · 5★ Google · 10+ anos de mercado',
    tags: ['Site Institucional', 'SEO', 'Framer Motion', 'Next.js'],
    year: '2025',
    gradient: 'from-zinc-950 via-zinc-900 to-red-950',
    featured: true,
    badge: 'Case Premium',
    demoUrl: 'https://euphonious-bavarois-426c1b.netlify.app/',
    thumbPath: '/portfolio/alex-messias/screenshots/thumb.png',
    technologies: ['Next.js 16', 'Tailwind CSS v4', 'Framer Motion', 'TypeScript', 'Static Export'],
    objective:
      'Criar a presença digital definitiva para Alex Messias, o maior especialista em GWM do interior de SP, posicionando-o como referência e acelerando o contato de novos clientes.',
    problem:
      'Consultor com mais de 300 clientes e reputação consolidada, mas sem site profissional. Dependia 100% de indicações e presença física no showroom para atrair novos compradores.',
    solution:
      'Desenvolvemos site institucional premium em Next.js com galeria das fotos do Alex, página dedicada com bio completa, animações Framer Motion, SEO otimizado e integração direta com WhatsApp para conversão imediata.',
    impact:
      'Site entregue em 3 dias úteis com design editorial premium. Página /alex dedicada com galeria de fotos, bio profissional e CTAs diretos. Deploy estático via Netlify com performance Lighthouse 95+.',
    metrics: [
      { label: 'Clientes atendidos', value: '300+' },
      { label: 'Avaliação Google', value: '5★' },
      { label: 'Anos de mercado', value: '10+' },
      { label: 'Modelos GWM', value: '7' },
    ],
  },
  {
    id: 1,
    slug: 'prime-odonto',
    niche: 'odontologia',
    nicheLabel: 'Odontologia',
    nicheIcon: '🦷',
    title: 'Prime Odonto',
    tagline: 'Clínica odontológica de alto padrão em São Paulo',
    result: '+340% em agendamentos online em 60 dias',
    tags: ['Site', 'Landing Page', 'Meta Ads', 'Google Ads'],
    year: '2025',
    gradient: 'from-slate-900 via-slate-800 to-slate-900',
    demoPath: '/portfolio/odontologia/index.html',
    socialMediaPath: '/portfolio/odontologia/social-media/posts.html',
    thumbPath: '/portfolio/odontologia/screenshots/thumb.png',
    technologies: ['HTML/CSS/JS', 'GSAP Animations', 'Schema.org', 'FAQ Accordion'],
    objective:
      'Transformar a presença digital da clínica para atrair pacientes de alto valor e reduzir dependência de indicações.',
    problem:
      'Clínica consolidada com 12 anos de mercado, mas com site desatualizado, sem estratégia de captação online e agenda subutilizada em até 40% nos meses de baixa temporada.',
    solution:
      'Desenvolvemos site institucional premium com foco em conversão, landing pages segmentadas por procedimento (implante, facetas, harmonização), e estruturamos funis de anúncios no Meta e Google Ads com segmentação por intenção de compra.',
    impact:
      'Em 60 dias a clínica atingiu o maior volume de agendamentos da sua história. O custo por lead caiu 68% em relação às ações anteriores. A agenda passou a ser gerida com lista de espera.',
    metrics: [
      { label: 'Aumento em agendamentos', value: '+340%' },
      { label: 'Redução no custo por lead', value: '-68%' },
      { label: 'ROAS médio', value: '8.4×' },
      { label: 'Dias para resultado', value: '60' },
    ],
  },
  {
    id: 2,
    slug: 'aura-estetica',
    niche: 'estetica',
    nicheLabel: 'Estética',
    nicheIcon: '✨',
    title: 'Aura Estética Premium',
    tagline: 'Clínica de estética avançada, Brasília/DF',
    result: 'R$280k em receita nos primeiros 90 dias',
    tags: ['Branding', 'Site', 'Tráfego Pago', 'Automação'],
    year: '2025',
    gradient: 'from-zinc-900 via-zinc-800 to-zinc-900',
    demoPath: '/portfolio/estetica/index.html',
    socialMediaPath: '/portfolio/estetica/social-media/posts.html',
    thumbPath: '/portfolio/estetica/screenshots/thumb.png',
    technologies: ['HTML/CSS/JS', 'Luxury Design', 'Cormorant Garamond', 'IntersectionObserver'],
    objective:
      'Reposicionar a clínica como referência premium em harmonização facial e lançar novos procedimentos para público de alto ticket.',
    problem:
      'Clínica com ótima qualidade técnica mas comunicação visual amadora que não refletia o nível do serviço. Dificuldade em justificar preços mais altos e atrair pacientes dispostos a investir.',
    solution:
      'Rebranding completo com nova identidade visual, site premium, fotografia profissional e campanha de lançamento com influenciadoras do segmento de beleza de alto padrão em Brasília.',
    impact:
      'A clínica conseguiu triplicar o ticket médio dos procedimentos após o reposicionamento. Lista de espera formada em menos de 30 dias para harmonização facial.',
    metrics: [
      { label: 'Receita em 90 dias', value: 'R$280k' },
      { label: 'Aumento no ticket médio', value: '3×' },
      { label: 'Novos pacientes/mês', value: '+120' },
      { label: 'Satisfação', value: '99%' },
    ],
  },
  {
    id: 3,
    slug: 'solarmax',
    niche: 'solar',
    nicheLabel: 'Energia Solar',
    nicheIcon: '☀️',
    title: 'SolarMax Energia',
    tagline: 'Instaladora de energia solar, Goiânia/GO',
    result: '85 projetos fechados em 4 meses de operação digital',
    tags: ['Site', 'Google Ads', 'Automação', 'CRM'],
    year: '2025',
    gradient: 'from-neutral-900 via-neutral-800 to-neutral-900',
    demoPath: '/portfolio/energia-solar/index.html',
    socialMediaPath: '/portfolio/energia-solar/social-media/posts.html',
    thumbPath: '/portfolio/energia-solar/screenshots/thumb.png',
    technologies: ['HTML/CSS/JS', 'Calculadora de Economia', 'Counter Animation', 'Responsive'],
    objective:
      'Estruturar a presença digital do zero e criar um funil de vendas previsível para projetos de energia solar residencial e comercial.',
    problem:
      'Empresa nova no mercado, sem presença digital e dependendo 100% de indicações. Dificuldade em competir com players estabelecidos sem histórico de casos comprovados.',
    solution:
      'Criamos site com calculadora de economia interativa, landing pages segmentadas por tipo de cliente (residencial/comercial/rural), automação de qualificação via WhatsApp e campanhas no Google Search capturando demanda ativa.',
    impact:
      'Em 4 meses de operação digital, a empresa fechou 85 projetos com ticket médio de R$28k. O funil de automação reduziu o tempo de resposta ao lead de 2 horas para 3 minutos.',
    metrics: [
      { label: 'Projetos fechados', value: '85' },
      { label: 'Ticket médio', value: 'R$28k' },
      { label: 'Tempo de resposta', value: '3min' },
      { label: 'Taxa de conversão', value: '22%' },
    ],
  },
  {
    id: 4,
    slug: 'valenca-associados',
    niche: 'advocacia',
    nicheLabel: 'Advocacia',
    nicheIcon: '⚖️',
    title: 'Valença & Associados',
    tagline: 'Escritório empresarial premium, São Paulo/SP',
    result: 'Aumento de 80% no ticket médio dos contratos',
    tags: ['Branding', 'Site Institucional', 'SEO', 'LinkedIn Ads'],
    year: '2025',
    gradient: 'from-stone-900 via-stone-800 to-stone-900',
    demoPath: '/portfolio/advocacia/index.html',
    socialMediaPath: '/portfolio/advocacia/social-media/posts.html',
    thumbPath: '/portfolio/advocacia/screenshots/thumb.png',
    technologies: ['HTML/CSS/JS', 'Playfair Display', 'Dark Luxury', 'Schema.org'],
    objective:
      'Reposicionar o escritório para atender empresas de médio e grande porte, aumentando o ticket médio e a seletividade na carteira de clientes.',
    problem:
      'Escritório com 15 anos de mercado e excelente reputação entre pares, mas com presença digital que não refletia o nível de sofisticação e expertise da equipe. Atraía clientes abaixo do potencial.',
    solution:
      'Rebranding completo com identidade visual premium, site institucional com conteúdo de autoridade em direito empresarial e tributário, estratégia de SEO para termos de alto valor e campanhas no LinkedIn Ads para decisores empresariais.',
    impact:
      'Seis meses após o reposicionamento, o escritório assinou contratos com empresas 4× maiores que a média anterior. Dois sócios foram entrevistados como especialistas em veículos de grande circulação.',
    metrics: [
      { label: 'Aumento no ticket médio', value: '+80%' },
      { label: 'Novos contratos/mês', value: '+12' },
      { label: 'Crescimento em SEO', value: '+420%' },
      { label: 'Meses para resultado', value: '3' },
    ],
  },
  {
    id: 5,
    slug: 'prime-select',
    niche: 'imobiliaria',
    nicheLabel: 'Imobiliária',
    nicheIcon: '🏢',
    title: 'Prime Select Imóveis',
    tagline: 'Imobiliária de alto padrão, Florianópolis/SC',
    result: '3× mais leads qualificados com custo 45% menor',
    tags: ['Site', 'Meta Ads', 'Google Ads', 'Automação WhatsApp'],
    year: '2025',
    gradient: 'from-gray-900 via-gray-800 to-gray-900',
    demoPath: '/portfolio/imobiliaria/index.html',
    socialMediaPath: '/portfolio/imobiliaria/social-media/posts.html',
    thumbPath: '/portfolio/imobiliaria/screenshots/thumb.png',
    technologies: ['HTML/CSS/JS', 'Calculadora PMT', 'Property Cards', 'Scroll Reveal'],
    objective:
      'Escalar a geração de leads qualificados para imóveis de alto padrão e reduzir o tempo de resposta da equipe de corretores.',
    problem:
      'Imobiliária com portfólio premium mas gerando leads de baixa qualidade que desperdiçavam o tempo dos corretores. Taxa de conversão de lead para visita era de apenas 8%.',
    solution:
      'Criamos landing pages específicas por empreendimento com tours virtuais em 360°, automação de qualificação via WhatsApp que filtra renda e intenção antes de encaminhar ao corretor, e campanhas segmentadas por perfil de comprador.',
    impact:
      'Taxa de conversão de lead para visita subiu de 8% para 31%. O bot de WhatsApp qualifica 200+ leads por semana sem intervenção humana. Corretores passaram a trabalhar apenas com leads quentes.',
    metrics: [
      { label: 'Leads qualificados', value: '3×' },
      { label: 'Redução de custo', value: '-45%' },
      { label: 'Taxa lead→visita', value: '31%' },
      { label: 'Leads/mês qualificados', value: '200+' },
    ],
  },
];

export const NICHE_FILTERS = [
  { value: 'all', label: 'Todos' },
  { value: 'odontologia', label: 'Odontologia' },
  { value: 'estetica', label: 'Estética' },
  { value: 'solar', label: 'Energia Solar' },
  { value: 'advocacia', label: 'Advocacia' },
  { value: 'imobiliaria', label: 'Imobiliária' },
  { value: 'consorcio', label: 'Consórcio' },
];

export const SERVICES = [
  {
    id: '01',
    title: 'Sites & Landing Pages',
    desc: 'Páginas de alta performance que convertem visitantes em clientes — prontas em até 3 dias úteis.',
    detail: 'Next.js, Webflow, Framer',
  },
  {
    id: '02',
    title: 'Tráfego Pago',
    desc: 'Campanhas no Meta e Google orientadas a custo por resultado mensurável, não a métricas de vaidade.',
    detail: 'Meta Ads, Google Ads, Analytics',
  },
  {
    id: '03',
    title: 'Branding & Identidade',
    desc: 'Identidade visual que comunica autoridade e justifica preços premium sem precisar de explicação.',
    detail: 'Figma, Photoshop, Illustrator',
  },
  {
    id: '04',
    title: 'Automações Inteligentes',
    desc: 'Fluxos que qualificam, nutrem e convertem leads automaticamente — 24h por dia, sem equipe extra.',
    detail: 'N8N, Evolution API, TypeBot',
  },
  {
    id: '05',
    title: 'Vídeo & Motion Design',
    desc: 'Conteúdo em vídeo para anúncios, reels e apresentações que comunicam valor em segundos.',
    detail: 'Premiere, After Effects',
  },
  {
    id: '06',
    title: 'Estratégia Digital',
    desc: 'Diagnóstico, posicionamento e roadmap de ação com entregáveis claros e prazos definidos.',
    detail: 'Consultoria, Roadmap, OKRs',
  },
];

export const TESTIMONIALS = [
  {
    id: 1,
    quote: 'Em 60 dias nosso site virou o principal canal de captacao de pacientes. Resultado muito acima do que esperavamos.',
    name: 'Dra. Camila',
    role: 'Diretora Clinica',
    company: 'Clinica Odontologica',
    initial: 'C',
  },
  {
    id: 2,
    quote: 'A Sety entende que resultado real e o unico KPI que importa. Foram diretos ao ponto e entregaram antes do prazo.',
    name: 'Dr. Rafael',
    role: 'Socio Fundador',
    company: 'Escritorio de Advocacia',
    initial: 'R',
  },
  {
    id: 3,
    quote: 'Triplicamos nossa capacidade de atender leads sem contratar ninguem. O sistema de automacao trabalha 24h no lugar da equipe.',
    name: 'Marcos T.',
    role: 'CEO',
    company: 'Administradora de Consorcio',
    initial: 'M',
  },
];

export const FAQS = [
  {
    q: 'Em quanto tempo um site fica pronto?',
    a: 'Landing pages ficam prontas em até 3 dias úteis após aprovação do briefing. Sites completos com múltiplas páginas: 5 a 7 dias. Entregamos no prazo — sem "quase pronto".',
  },
  {
    q: 'Qual o investimento mínimo para começar?',
    a: 'O diagnóstico é gratuito e a proposta chega em 24h com valor fixo, sem surpresas. Trabalhamos com quem quer resultado consistente, não com quem busca o menor preço.',
  },
  {
    q: 'Preciso ter hospedagem e domínio?',
    a: 'Não. Fazemos o deploy em infraestrutura de alta performance sem custo adicional. Se já tem domínio, conectamos. Se não tem, indicamos onde comprar.',
  },
  {
    q: 'Vocês atendem qual tipo de empresa?',
    a: 'Atendemos negócios de alto valor que dependem de geração previsível de clientes: clínicas, escritórios, imobiliárias, instaladoras de solar, administradoras de consórcio e similares.',
  },
  {
    q: 'Como funciona a automação de WhatsApp?',
    a: 'Montamos fluxos completos com N8N + Evolution API: resposta instantânea ao lead, qualificação automática com perguntas estratégicas e distribuição para a equipe. Funciona 24h sem intervenção.',
  },
  {
    q: 'Vocês acompanham após a entrega?',
    a: 'Sim. Todo projeto inclui 30 dias de suporte técnico. Para tráfego pago, gestão mensal com relatório semanal de resultados. Para sites, planos de manutenção disponíveis.',
  },
  {
    q: 'Como funciona o processo de criação?',
    a: 'Briefing → estratégia → wireframes → design → desenvolvimento → revisão → deploy. Você aprova cada etapa. Uma rodada de ajustes está inclusa no escopo padrão.',
  },
  {
    q: 'Trabalham com contrato?',
    a: 'Sempre. Escopo, prazo e entregáveis definidos antes de começar. Você sabe exatamente o que está pagando e o que vai receber — sem surpresas no meio do caminho.',
  },
];

export const PROCESS_STEPS = [
  {
    n: '01',
    title: 'Diagnóstico',
    desc: 'Entendemos o negócio, o mercado e o objetivo. Mapeamos o que está impedindo o crescimento e o que deve ser construído primeiro.',
  },
  {
    n: '02',
    title: 'Estratégia',
    desc: 'Definimos posicionamento, canais, mensagem e KPIs. Tudo com foco em resultado mensurável, não em opiniões subjetivas.',
  },
  {
    n: '03',
    title: 'Execução',
    desc: 'Design, desenvolvimento e implementação com prazos definidos. Cada entrega é validada antes de avançar para a próxima etapa.',
  },
  {
    n: '04',
    title: 'Otimização',
    desc: 'Acompanhamento dos resultados, testes e ajustes contínuos. O que funciona escala. O que não funciona é eliminado.',
  },
];

export const DIFFERENTIALS = [
  {
    title: 'Design que vende',
    desc: 'Cada decisão de design é tomada com base em conversão, não em estética subjetiva. Visual premium que comunica valor.',
  },
  {
    title: 'Alta performance',
    desc: 'Sites com Lighthouse 95+, Core Web Vitals otimizados e carregamento sub-1.5s. Velocidade que impacta conversão e SEO.',
  },
  {
    title: 'Resultado mensurável',
    desc: 'KPIs definidos no início. Relatórios claros com o que importa. Sem métricas de vaidade, só números que movem o negócio.',
  },
  {
    title: 'Prazo real',
    desc: 'Landing pages em 3 dias. Sites em 7 dias. Projetos entregues no prazo combinado, sem "em breve" que nunca chega.',
  },
  {
    title: 'Automação inteligente',
    desc: 'Sistemas que trabalham 24h: qualificam leads, fazem follow-up, agendam e nutrem sem intervenção humana.',
  },
  {
    title: 'Suporte contínuo',
    desc: 'Não somemos depois da entrega. 30 dias de suporte inclusos e planos de manutenção para quem precisa de parceiro de longo prazo.',
  },
];
