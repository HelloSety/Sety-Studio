const express = require("express");
const cors    = require("cors");
const QRCode  = require("qrcode");
const http    = require("http");
const path    = require("path");
const fs      = require("fs");
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");

const PORT     = 3007;
const app      = express();
const server   = http.createServer(app);

app.use(cors({ origin: "*" }));
app.use(express.json());

// ── Estado global ──────────────────────────────────────────────────────────────
let qrB64     = null;
let status    = "connecting";  // connecting | qr | connected | disconnected
let myPhone   = null;
const msgs    = [];

// ── Config do agente ───────────────────────────────────────────────────────────
const CFG = path.join(__dirname, "agente.json");
let agente = {
  ativo: false,
  nome: "Assistente",
  saudacao: "Olá! Obrigado pelo contato. Em breve te respondo 👋",
  mensagens: [
    { gatilho: "oi",       resposta: "Olá! Como posso te ajudar hoje?" },
    { gatilho: "olá",      resposta: "Olá! Como posso te ajudar hoje?" },
    { gatilho: "ola",      resposta: "Olá! Como posso te ajudar hoje?" },
    { gatilho: "preço",    resposta: "Nossos planos começam em R$ 497/mês. Posso te mandar mais detalhes?" },
    { gatilho: "preco",    resposta: "Nossos planos começam em R$ 497/mês. Posso te mandar mais detalhes?" },
    { gatilho: "valor",    resposta: "Nossos planos começam em R$ 497/mês. Posso te mandar mais detalhes?" },
    { gatilho: "quanto",   resposta: "Nossos planos começam em R$ 497/mês. Posso te mandar mais detalhes?" },
    { gatilho: "horario",  resposta: "Atendemos de segunda a sexta, das 9h às 18h." },
    { gatilho: "horário",  resposta: "Atendemos de segunda a sexta, das 9h às 18h." },
    { gatilho: "obrigado", resposta: "De nada! Qualquer dúvida, é só chamar 😊" },
    { gatilho: "site",     resposta: "Nosso site é setystudio.com.br — lá tem tudo sobre os nossos serviços!" },
  ],
};
if (fs.existsSync(CFG)) { try { agente = JSON.parse(fs.readFileSync(CFG, "utf8")); } catch (_) {} }
const saveAgente = () => fs.writeFileSync(CFG, JSON.stringify(agente, null, 2), "utf8");

function botReply(text) {
  if (!agente.ativo) return null;
  const t = (text || "").toLowerCase();
  for (const r of agente.mensagens) {
    if (t.includes(r.gatilho.toLowerCase())) return r.resposta;
  }
  return agente.saudacao || null;
}

// ── WhatsApp client ────────────────────────────────────────────────────────────
const client = new Client({
  authStrategy: new LocalAuth({ dataPath: path.join(__dirname, "ww_session") }),
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
    ],
  },
});

client.on("qr", async (qr) => {
  console.log("QR code gerado — acesse http://localhost:" + PORT);
  status = "qr";
  qrB64  = await QRCode.toDataURL(qr, { width: 280, margin: 2, color: { dark: "#000", light: "#fff" } });
});

client.on("ready", () => {
  status  = "connected";
  qrB64   = null;
  myPhone = client.info?.wid?.user ?? "conectado";
  console.log("✅ WhatsApp conectado | número:", myPhone);
});

client.on("authenticated", () => {
  status = "connected";
  console.log("Autenticado com sucesso");
});

client.on("auth_failure", (msg) => {
  console.error("Falha de autenticação:", msg);
  status = "disconnected";
});

client.on("disconnected", (reason) => {
  console.log("Desconectado:", reason);
  status = "disconnected";
  qrB64  = null;
  // Tenta reconectar automaticamente
  setTimeout(() => client.initialize().catch(console.error), 5000);
});

client.on("message", async (msg) => {
  if (msg.fromMe) return;
  const body = msg.body || "";
  const from = msg.from.replace("@c.us", "").replace("@g.us", " (grupo)");

  msgs.unshift({ id: msg.id.id, jid: msg.from, from, text: body, ts: Date.now(), dir: "in" });
  if (msgs.length > 200) msgs.pop();
  console.log("[" + from + "] " + body);

  const reply = botReply(body);
  if (reply) {
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));
    try {
      await msg.reply(reply);
      msgs.unshift({ id: "out-" + Date.now(), jid: msg.from, from: "bot", text: reply, ts: Date.now(), dir: "out" });
      console.log("[bot →" + from + "] " + reply);
    } catch (e) { console.error("Erro ao responder:", e.message); }
  }
});

// ── API ────────────────────────────────────────────────────────────────────────
app.get("/api/status",   (_, r) => r.json({ status, phone: myPhone, uptime: Math.floor(process.uptime()) }));
app.get("/api/qr",       (_, r) => r.json({ status, qr: qrB64 }));
app.get("/api/messages", (_, r) => r.json(msgs.slice(0, 50)));
app.get("/api/agente",   (_, r) => r.json(agente));

app.post("/api/send", async (req, res) => {
  const { to, message } = req.body;
  if (!to || !message)        return res.status(400).json({ error: "Informe to e message" });
  if (status !== "connected") return res.status(503).json({ error: "WhatsApp não conectado" });
  const chatId = to.replace(/\D/g, "") + "@c.us";
  try {
    await client.sendMessage(chatId, message);
    msgs.unshift({ id: "m-" + Date.now(), jid: chatId, from: "eu", text: message, ts: Date.now(), dir: "out" });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/agente", (req, res) => {
  agente = { ...agente, ...req.body };
  saveAgente();
  res.json({ ok: true, agente });
});

app.post("/api/disconnect", async (_, res) => {
  try { await client.logout(); } catch (_) {}
  status = "disconnected"; qrB64 = null; myPhone = null;
  const sess = path.join(__dirname, "ww_session");
  if (fs.existsSync(sess)) fs.rmSync(sess, { recursive: true, force: true });
  res.json({ ok: true });
  setTimeout(() => client.initialize().catch(console.error), 2000);
});

app.post("/api/reconnect", async (_, res) => {
  res.json({ ok: true });
  const sess = path.join(__dirname, "ww_session");
  if (fs.existsSync(sess)) fs.rmSync(sess, { recursive: true, force: true });
  qrB64 = null; status = "connecting";
  try { await client.logout(); } catch (_) {}
  setTimeout(() => client.initialize().catch(console.error), 1000);
});

// ── Painel ─────────────────────────────────────────────────────────────────────
app.get("/", (_, r) => r.send(HTML));
app.get("/favicon.ico", (_, r) => r.status(204).end());

// ── Start ──────────────────────────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log("\n  Sety Server em http://localhost:" + PORT + "\n  Iniciando WhatsApp...\n");
  client.initialize().catch(console.error);
});

// ── HTML do painel ─────────────────────────────────────────────────────────────
const HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Sety Server</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0a0f;color:#e5e7eb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
header{display:flex;align-items:center;gap:12px;padding:16px 24px;border-bottom:1px solid rgba(255,255,255,.07)}
.logo{width:34px;height:34px;background:#7C3AED;border-radius:9px;display:flex;align-items:center;justify-content:center;font-weight:900;color:#fff;font-size:15px}
h1{font-size:17px;font-weight:700}h1 span{color:#555;font-size:12px;font-weight:400;margin-left:8px}
#pill{margin-left:auto;display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:600}
.p-ok{background:rgba(34,197,94,.14);color:#22C55E}.p-qr{background:rgba(245,158,11,.14);color:#F59E0B}.p-c{background:rgba(107,114,128,.14);color:#9CA3AF}
.dot{width:6px;height:6px;border-radius:50%;background:currentColor}
main{max-width:900px;margin:0 auto;padding:24px 20px;display:grid;grid-template-columns:1fr 1fr;gap:16px}
.card{background:#111114;border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:20px}
.full{grid-column:1/-1}
.lbl{font-size:11px;color:#6B7280;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;font-weight:600}
.big{font-size:26px;font-weight:800;line-height:1;margin-bottom:4px}
.sub{font-size:12px;color:#6B7280}
.row{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap}
.btn{padding:8px 16px;border-radius:9px;border:none;font-size:12px;font-weight:600;cursor:pointer;transition:.18s}
.bg{background:#25D366;color:#fff}.bg:hover{background:#1fbd5a}
.bp{background:#7C3AED;color:#fff}.bp:hover{background:#8B5CF6}
.bw{background:rgba(255,255,255,.05);color:#9CA3AF;border:1px solid rgba(255,255,255,.07)}.bw:hover{color:#fff;background:rgba(255,255,255,.1)}
.br{background:rgba(239,68,68,.1);color:#F87171;border:1px solid rgba(239,68,68,.18)}.br:hover{background:rgba(239,68,68,.2)}
.qr-wrap{display:flex;gap:20px;align-items:flex-start}
#qr-img{width:210px;height:210px;border-radius:12px;padding:8px;background:#fff;display:none;flex-shrink:0}
#qr-ph{width:210px;height:210px;border-radius:12px;background:rgba(255,255,255,.03);border:1px dashed rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;color:#555;font-size:12px;flex-shrink:0}
.steps{font-size:12px;color:#9CA3AF;line-height:1.6}
.step{display:flex;gap:8px;margin-bottom:10px}
.sn{width:20px;height:20px;border-radius:50%;background:#25D366;color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
.hint{font-size:11px;color:#555;background:rgba(245,158,11,.06);border:1px solid rgba(245,158,11,.15);border-radius:8px;padding:8px 12px;margin-top:10px}
.ok-block{display:none}
.ok-inner{display:flex;align-items:center;gap:14px;margin-bottom:14px}
.ok-ico{width:44px;height:44px;border-radius:50%;background:rgba(34,197,94,.12);border:2px solid #22C55E;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.ok-info{font-size:15px;font-weight:700}
.ok-sub{font-size:12px;color:#555;margin-top:2px}
.ok-banner{padding:12px 14px;background:rgba(34,197,94,.06);border:1px solid rgba(34,197,94,.15);border-radius:10px;font-size:12px;color:#4ADE80}
input,textarea,select{background:#0C0C10;border:1px solid rgba(255,255,255,.08);border-radius:9px;padding:9px 13px;color:#e5e7eb;font-size:13px;outline:none;width:100%;transition:border .2s}
input:focus,textarea:focus{border-color:rgba(124,58,237,.5)}
textarea{resize:vertical;min-height:70px}
.f{margin-bottom:12px}
.f label{display:block;font-size:11px;color:#6B7280;text-transform:uppercase;letter-spacing:.4px;margin-bottom:5px;font-weight:600}
.tog{display:flex;align-items:center;gap:10px;cursor:pointer;margin-bottom:16px}
.tr{width:40px;height:22px;border-radius:99px;background:#333;transition:.2s;position:relative;flex-shrink:0}
.tr.on{background:#25D366}
.th{width:18px;height:18px;border-radius:50%;background:#fff;position:absolute;top:2px;left:2px;transition:.2s}
.tr.on .th{left:20px}
.msgs{max-height:220px;overflow-y:auto;display:flex;flex-direction:column;gap:6px}
.m{display:flex}.m-in .b{background:#18181B;border-radius:0 12px 12px 12px}
.m-out .b{background:rgba(124,58,237,.14);border-radius:12px 12px 0 12px;margin-left:auto}
.b{padding:7px 10px;max-width:85%;font-size:12px;color:#D1D5DB;line-height:1.4}
.mf{font-size:10px;color:#555;margin-bottom:2px}
.mt{font-size:9px;color:#444;margin-top:2px;text-align:right}
.rr{display:flex;gap:6px;margin-bottom:6px}
.rr input{flex:1}
.rr input:first-child{max-width:170px}
.xbtn{background:rgba(239,68,68,.1);border:none;color:#F87171;width:28px;height:28px;border-radius:7px;cursor:pointer;font-size:16px;flex-shrink:0}
.toast{position:fixed;bottom:18px;right:18px;background:#111114;border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:10px 16px;font-size:13px;display:none;z-index:999;box-shadow:0 20px 50px rgba(0,0,0,.5)}
.timer{font-size:11px;color:#6B7280;text-align:center;margin-top:6px}
@media(max-width:600px){main{grid-template-columns:1fr}.qr-wrap{flex-direction:column}}
</style>
</head>
<body>
<header>
  <div class="logo">S</div>
  <h1>Sety Server <span>WhatsApp Agent v2</span></h1>
  <div id="pill" class="p-c"><span class="dot"></span> <span id="pill-txt">Iniciando...</span></div>
</header>

<main>
  <div class="card">
    <div class="lbl">Conexão</div>
    <div class="big" id="st-v">—</div>
    <div class="sub" id="st-s">Aguardando...</div>
    <div class="row">
      <button class="btn bw" onclick="novoQR()">Novo QR</button>
      <button class="btn br" onclick="logout()">Deslogar</button>
    </div>
  </div>

  <div class="card">
    <div class="lbl">Servidor</div>
    <div class="big" id="up-v">0s</div>
    <div class="sub">localhost:3007 · ativo</div>
    <div class="row">
      <button class="btn bp" onclick="copyAPI()">Copiar URL da API</button>
    </div>
  </div>

  <!-- QR -->
  <div class="card full" id="qr-card">
    <div class="lbl">Conectar WhatsApp</div>
    <div class="qr-wrap">
      <div>
        <div id="qr-ph">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#25D366"/><path d="M12 4.5a7.5 7.5 0 00-6.33 11.5L4.5 19.5l3.6-1.15A7.5 7.5 0 1012 4.5zm0 13.5a6 6 0 01-3.05-.83l-.22-.13-2.28.73.74-2.22-.14-.23A6 6 0 1118 12a6 6 0 01-6 6z" fill="white"/></svg>
          <span id="qr-hint">Gerando QR...</span>
        </div>
        <img id="qr-img" alt="QR WhatsApp" />
        <div class="timer" id="qr-timer" style="display:none">Expira em <strong id="qr-count">60</strong>s</div>
      </div>
      <div class="steps">
        <div class="step"><div class="sn">1</div><div>Abra o <strong>WhatsApp</strong> no celular</div></div>
        <div class="step"><div class="sn">2</div><div><strong>Android:</strong> ⋮ Menu → Aparelhos Conectados → Conectar Aparelho<br><strong>iPhone:</strong> Ajustes → Aparelhos Conectados → Conectar</div></div>
        <div class="step"><div class="sn">3</div><div>Aponte a câmera para o <strong>QR code</strong> ao lado</div></div>
        <div class="step"><div class="sn">4</div><div>Aguarde aparecer <strong>"Conectado ✓"</strong> aqui</div></div>
        <div class="hint">⚠️ Não feche esta janela enquanto o sistema estiver em uso.</div>
      </div>
    </div>
  </div>

  <!-- Conectado -->
  <div class="card full ok-block" id="ok-card">
    <div class="lbl">WhatsApp Conectado</div>
    <div class="ok-inner">
      <div class="ok-ico">✓</div>
      <div>
        <div class="ok-info">Número: <span id="ok-phone" style="color:#4ADE80">—</span></div>
        <div class="ok-sub">Agente pronto — configure as respostas abaixo</div>
      </div>
    </div>
    <div class="ok-banner">🟢 Tudo funcionando. Mensagens recebidas aparecerão abaixo.</div>
  </div>

  <!-- Envio de teste -->
  <div class="card">
    <div class="lbl">Enviar mensagem de teste</div>
    <div class="f"><label>Número (DDD + número)</label><input id="s-to" placeholder="11999990000" /></div>
    <div class="f"><label>Mensagem</label><textarea id="s-msg">Olá! Teste do Sety Vision 🚀</textarea></div>
    <button class="btn bg" onclick="enviar()">Enviar</button>
  </div>

  <!-- Histórico -->
  <div class="card">
    <div class="lbl">Mensagens recebidas</div>
    <div class="msgs" id="msgs"></div>
  </div>

  <!-- Agente -->
  <div class="card full">
    <div class="lbl">Agente de respostas automáticas</div>
    <div class="tog" onclick="toggleAg()">
      <div class="tr" id="ag-tr"><div class="th"></div></div>
      <span id="ag-lbl" style="font-size:13px;font-weight:600">Agente desativado</span>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">
      <div class="f"><label>Nome do agente</label><input id="ag-nome" placeholder="Assistente" /></div>
      <div class="f"><label>Resposta padrão (quando não entende)</label><input id="ag-sau" placeholder="Olá! Como posso te ajudar?" /></div>
    </div>
    <div class="lbl" style="margin-bottom:8px">Gatilhos → Respostas</div>
    <div id="rules"></div>
    <div class="row">
      <button class="btn bw" onclick="addR()">+ Adicionar</button>
      <button class="btn bp" onclick="salvar()">Salvar agente</button>
    </div>
  </div>
</main>

<div class="toast" id="toast"></div>

<script>
let ag = {ativo:false,nome:"",saudacao:"",mensagens:[]};
let qrSec=60, qrTick=null, lastSt="";

function fmt(s){if(s<60)return s+"s";if(s<3600)return Math.floor(s/60)+"m"+(s%60).toString().padStart(2,"0")+"s";return Math.floor(s/3600)+"h"+Math.floor((s%3600)/60)+"m";}

function toast(m,ok){const t=document.getElementById("toast");t.textContent=m;t.style.display="block";t.style.borderColor=ok===true?"rgba(34,197,94,.3)":ok===false?"rgba(239,68,68,.3)":"rgba(255,255,255,.1)";setTimeout(()=>t.style.display="none",3200);}

async function poll(){
  try{
    const [st,qrR]=await Promise.all([fetch("/api/status").then(r=>r.json()),fetch("/api/qr").then(r=>r.json())]);
    document.getElementById("up-v").textContent=fmt(st.uptime);
    const pill=document.getElementById("pill"),ptxt=document.getElementById("pill-txt");
    const stv=document.getElementById("st-v"),sts=document.getElementById("st-s");
    const qCard=document.getElementById("qr-card"),oCard=document.getElementById("ok-card");

    if(st.status==="connected"){
      pill.className="p-ok";ptxt.textContent="Conectado";
      stv.textContent="Conectado ✓";sts.textContent="+"+st.phone;
      qCard.style.display="none";oCard.style.display="block";
      document.getElementById("ok-phone").textContent="+"+st.phone;
      if(qrTick){clearInterval(qrTick);qrTick=null;}
    }else if(st.status==="qr"){
      pill.className="p-qr";ptxt.textContent="Aguardando scan";
      stv.textContent="Escaneie o QR";sts.textContent="Abra o WhatsApp no celular";
      qCard.style.display="block";oCard.style.display="none";
      if(qrR.qr){
        document.getElementById("qr-ph").style.display="none";
        const img=document.getElementById("qr-img");img.src=qrR.qr;img.style.display="block";
        document.getElementById("qr-timer").style.display="block";
        if(!qrTick){qrSec=60;qrTick=setInterval(()=>{qrSec--;const el=document.getElementById("qr-count");if(el)el.textContent=qrSec;if(qrSec<=0){clearInterval(qrTick);qrTick=null;}},1000);}
      }
    }else{
      pill.className="p-c";ptxt.textContent="Iniciando...";
      stv.textContent="Iniciando";sts.textContent="Aguardando QR code...";
    }

    if(st.status!==lastSt){
      if(st.status==="connected"&&lastSt)toast("✅ WhatsApp conectado!",true);
      if(st.status==="disconnected"&&lastSt==="connected")toast("⚠️ Desconectado",false);
    }
    lastSt=st.status;

    const ms=await fetch("/api/messages").then(r=>r.json());
    const box=document.getElementById("msgs");
    if(ms.length)box.innerHTML=ms.slice(0,15).map(m=>\`<div class="m m-\${m.dir}"><div><div class="mf">\${m.from}</div><div class="b">\${m.text}</div><div class="mt">\${new Date(m.ts).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</div></div></div>\`).join("");
    else box.innerHTML='<div style="color:#555;font-size:12px">Nenhuma mensagem ainda...</div>';
  }catch(_){}
}

async function novoQR(){
  await fetch("/api/reconnect",{method:"POST"});
  document.getElementById("qr-img").style.display="none";
  document.getElementById("qr-ph").style.display="flex";
  document.getElementById("qr-timer").style.display="none";
  document.getElementById("qr-hint").textContent="Gerando novo QR...";
  toast("Gerando novo QR code...");
}

async function logout(){
  if(!confirm("Deslogar vai encerrar a sessão. Confirma?"))return;
  await fetch("/api/disconnect",{method:"POST"});
  toast("Sessão encerrada.");
}

async function enviar(){
  const to=document.getElementById("s-to").value.trim();
  const message=document.getElementById("s-msg").value.trim();
  if(!to||!message){toast("Preencha número e mensagem");return;}
  const r=await fetch("/api/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to,message})}).then(r=>r.json());
  if(r.ok)toast("✅ Enviado!",true);else toast("❌ "+r.error,false);
}

function copyAPI(){navigator.clipboard.writeText("http://localhost:3007");toast("URL copiada!",true);}

function toggleAg(){ag.ativo=!ag.ativo;renderAg();}

function renderAg(){
  const tr=document.getElementById("ag-tr"),lb=document.getElementById("ag-lbl");
  tr.className=ag.ativo?"tr on":"tr";
  lb.textContent=ag.ativo?"Agente ATIVADO — respondendo automaticamente":"Agente desativado — clique para ativar";
  document.getElementById("ag-nome").value=ag.nome||"";
  document.getElementById("ag-sau").value=ag.saudacao||"";
  renderRules();
}

function renderRules(){
  document.getElementById("rules").innerHTML=(ag.mensagens||[]).map((r,i)=>\`
    <div class="rr">
      <input placeholder="Gatilho (ex: preço)" value="\${r.gatilho}" onchange="ag.mensagens[\${i}].gatilho=this.value" />
      <input placeholder="Resposta automática" value="\${r.resposta}" onchange="ag.mensagens[\${i}].resposta=this.value" />
      <button class="xbtn" onclick="delR(\${i})">×</button>
    </div>
  \`).join("");
}

function addR(){ag.mensagens.push({gatilho:"",resposta:""});renderRules();}
function delR(i){ag.mensagens.splice(i,1);renderRules();}

async function salvar(){
  ag.nome=document.getElementById("ag-nome").value;
  ag.saudacao=document.getElementById("ag-sau").value;
  const r=await fetch("/api/agente",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(ag)}).then(r=>r.json());
  if(r.ok)toast("✅ Agente salvo!",true);
}

fetch("/api/agente").then(r=>r.json()).then(d=>{ag=d;renderAg();});
poll();
setInterval(poll,2500);
</script>
</body>
</html>`;
