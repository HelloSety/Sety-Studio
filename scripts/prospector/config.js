// Nichos de alto valor — empresas que pagam bem por estrutura digital
const NICHES = [
  { query: 'clínica dentária', label: 'Clínica Dentária' },
  { query: 'clínica médica', label: 'Clínica Médica' },
  { query: 'clínica estética', label: 'Clínica Estética' },
  { query: 'advogado escritório advocacia', label: 'Advocacia' },
  { query: 'imobiliária', label: 'Imobiliária' },
  { query: 'empresa energia solar', label: 'Energia Solar' },
  { query: 'administradora de consórcio', label: 'Consórcio' },
  { query: 'academia de ginástica', label: 'Academia' },
  { query: 'nutricionista clínica', label: 'Nutricionista' },
  { query: 'psicólogo psicologia', label: 'Psicologia' },
  { query: 'fisioterapia clínica', label: 'Fisioterapia' },
  { query: 'escola de idiomas', label: 'Escola Idiomas' },
];

// Cidades para prospecção — altere conforme seu mercado
const CITIES = [
  'Belém PA',
  'Ananindeua PA',
  'Castanhal PA',
  'Marabá PA',
  'Santarém PA',
];

// Quantas combinações niche+cidade rodar por dia (rotação automática)
const DAILY_COMBINATIONS = 5;

// Score mínimo para enviar WhatsApp
const MIN_SCORE_TO_CONTACT = 4;

// Máximo de mensagens por dia (evitar bloqueio no WhatsApp)
const MAX_DAILY_CONTACTS = 50;

// Delay entre mensagens em ms (8s = seguro para Evolution API)
const MESSAGE_DELAY_MS = 8000;

module.exports = {
  NICHES,
  CITIES,
  DAILY_COMBINATIONS,
  MIN_SCORE_TO_CONTACT,
  MAX_DAILY_CONTACTS,
  MESSAGE_DELAY_MS,
};
