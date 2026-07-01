// Templates de mensagem do Sety Vision — foco em automação e captação, não em site

function buildMessage(lead) {
  const name = lead.name;

  // Prioridade 1: sem site — empresa ainda não tem estrutura digital básica
  if (!lead.website || lead.website.includes('facebook.com') || lead.website.includes('instagram.com')) {
    return `Oi, tudo bem?

Vi a *${name}* no Google e percebi que vocês ainda não têm um site e provavelmente recebem clientes só por indicação ou WhatsApp manual.

Sou o Seven, da Sety Studio. Instalamos o *Sety Vision* — um sistema que coloca sua empresa no digital, responde leads automaticamente pelo WhatsApp e organiza tudo no CRM. Em 15 dias no ar.

Posso te mostrar como funciona em 5 minutos?`;
  }

  // Prioridade 2: sem avaliações ou rating baixo — empresa existe mas é invisível
  if (!lead.rating || lead.reviews < 10 || lead.rating < 3.5) {
    return `Oi, tudo bem?

Vi a *${name}* no Google e percebi que vocês têm pouca visibilidade online — o que significa que clientes que pesquisam estão indo para o concorrente sem nem chegar até vocês.

Sou o Seven, da Sety Studio. Instalamos o *Sety Vision* — sistema que automatiza a captação, responde leads no WhatsApp e organiza o funil de vendas. Tudo integrado.

Posso te mostrar o que ele faria pela operação de vocês?`;
  }

  // Prioridade 3: empresa estabelecida, pode estar perdendo lead por processo manual
  return `Oi, tudo bem?

Vi a *${name}* no Google. Empresa estabelecida, boas avaliações — mas aposto que ainda perdem clientes por falta de follow-up ou atendimento demorado no WhatsApp.

Sou o Seven, da Sety Studio. Instalamos o *Sety Vision* — um sistema que automatiza a qualificação e o acompanhamento de leads, sem precisar contratar ninguém.

Faz sentido conversar 10 minutos sobre isso?`;
}

module.exports = { buildMessage };
