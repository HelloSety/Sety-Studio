import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
} from 'baileys'
import { Boom } from '@hapi/boom'
import path from 'path'
import { EventEmitter } from 'events'

export const waEvents = new EventEmitter()

let sock: ReturnType<typeof makeWASocket> | null = null
let connectionStatus: 'disconnected' | 'connecting' | 'connected' = 'disconnected'

export function getConnectionStatus() {
  return connectionStatus
}

export async function connectWhatsApp() {
  const authDir = path.join(process.cwd(), '.wa-auth')
  const { state, saveCreds } = await useMultiFileAuthState(authDir)
  const { version } = await fetchLatestBaileysVersion()

  sock = makeWASocket({
    version,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, console as any),
    },
    printQRInTerminal: false,
    browser: ['ProspectAI', 'Chrome', '1.0.0'],
  })

  connectionStatus = 'connecting'
  waEvents.emit('status', 'connecting')

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update

    if (qr) {
      waEvents.emit('qr', qr)
    }

    if (connection === 'close') {
      connectionStatus = 'disconnected'
      waEvents.emit('status', 'disconnected')
      const code = (lastDisconnect?.error as Boom)?.output?.statusCode
      if (code !== DisconnectReason.loggedOut) {
        setTimeout(connectWhatsApp, 3000)
      }
    }

    if (connection === 'open') {
      connectionStatus = 'connected'
      waEvents.emit('status', 'connected')
      waEvents.emit('number', sock?.user?.id?.split(':')[0])
    }
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return
    for (const msg of messages) {
      if (msg.key.fromMe) continue
      waEvents.emit('message', {
        from: msg.key.remoteJid,
        content: msg.message?.conversation ?? msg.message?.extendedTextMessage?.text ?? '',
        timestamp: msg.messageTimestamp,
      })
    }
  })
}

export async function sendMessage(jid: string, text: string) {
  if (!sock || connectionStatus !== 'connected') {
    throw new Error('WhatsApp não conectado')
  }
  const phone = jid.includes('@') ? jid : `${jid.replace(/\D/g, '')}@s.whatsapp.net`
  await sock.sendMessage(phone, { text })
}

export async function sendMediaMessage(
  jid: string,
  type: 'image' | 'video' | 'document',
  url: string,
  caption?: string
) {
  if (!sock || connectionStatus !== 'connected') {
    throw new Error('WhatsApp não conectado')
  }
  const phone = jid.includes('@') ? jid : `${jid.replace(/\D/g, '')}@s.whatsapp.net`
  await sock.sendMessage(phone, { [type]: { url }, caption } as any)
}

export function interpolateMessage(template: string, vars: Record<string, string>) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? '')
}
