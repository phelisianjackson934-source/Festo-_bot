const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const express = require('express')
const pino = require('pino')
const qrcode = require('qrcode-terminal')

const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('FESTO NAILS BOT IKO LIVE ✅')
})

app.listen(port, () => {
  console.log(`Server running on ${port}`)
})

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' })
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update

    if(qr) {
      console.log('SCAN HII QR KWA WHATSAPP:')
      qrcode.generate(qr, { small: true })
    }

    if(connection === 'close') {
      const shouldReconnect = lastDisconnect.error?.output?.statusCode!== DisconnectReason.loggedOut
      console.log('Connection closed, reconnecting:', shouldReconnect)
      if(shouldReconnect) {
        connectToWhatsApp()
      }
    } else if(connection === 'open') {
      console.log('FESTO BOT: IMEUNGANISHWA ✅')
    }
  })

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if(!msg.key.fromMe && msg.message) {
      const from = msg.key.remoteJid
      const text = msg.message.conversation || msg.message.extendedTextMessage?.text || ''

      if(text.toLowerCase() === 'menu') {
        await sock.sendMessage(from, { text: `💅 *FESTO NAILS STUDIO* 💅\n\nKaribu mteja wetu!\n\n1️⃣ Bei za kucha\n2️⃣ Weka booking\n3️⃣ Saa za kazi\n4️⃣ Mahali tulipo\n\nJibu namba tu` })
      }
      else if(text === '1') {
        await sock.sendMessage(from, { text: `💰 *BEI ZETU*\n\nKuweka rangi: 15,000\nKuchora: 20,000-35,000\nGel: 25,000\n\nKaribu sana!` })
      }
      else if(text === '2') {
        await sock.sendMessage(from, { text: `📅 *BOOKING*\n\nTuma: Jina + Tarehe + Saa + Huduma\nMfano: Aisha, 26 Apr, Saa 8 mchana, Gel\n\nTutakujibu kukuhakikishia` })
      }
      else if(text === '3') {
        await sock.sendMessage(from, { text: `⏰ *SAA ZA KAZI*\n\nJumatatu - Jumamosi: 8:00 - 18:00\nJumapili: TUPO LIKEZO` })
      }
      else if(text === '4') {
        await sock.sendMessage(from, { text: `📍 *MAHALI*\n\nDar es Salaam, Tanzania\nPiga: 0687 702 991 kwa maelekezo` })
      }
    }
  })
}

connectToWhatsApp()
