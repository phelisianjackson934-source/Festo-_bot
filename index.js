const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys')
const express = require('express')
const pino = require('pino')
const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => res.send('Festo Nails Bot Iko Live ✅'))
app.listen(PORT, () => console.log(`Server running on ${PORT}`))

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('session')
  
  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: true,
    browser: ['Festo Nails Bot', 'Chrome', '1.0.0']
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update
    if(connection === 'close') {
      const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut
      console.log('Connection closed, reconnecting:', shouldReconnect)
      if(shouldReconnect) startBot()
    } else if(connection === 'open') {
      console.log('FESTO BOT: IMEUNGANISHWA ✅')
    }
  })

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0]
    if (!m.message || m.key.fromMe) return
    
    const text = m.message.conversation || m.message.extendedTextMessage?.text || ''
    const sender = m.key.remoteJid
    const namba = '0687 702 991'
    
    const menu = `Karibu sana boss 👋\n\nAsante kwa kuichagua *Festo Nails Beauty* ✨\nTunakufanya uwe mrembo kuanzia vidole hadi miguuni.\n\n💅 *BEI ZETU:*\n1. Kubandika kucha + rangi - Tsh 10,000\n2. Kung'arisha miguu + scrub - Tsh 15,000\n3. Poly Gel - Tsh 15,000\n4. Builder Gel - Tsh 15,000\n5. Huduma za nyumbani - Kuanzia Tsh 75,000\n\n📅 *HUDUMA NYINGINE:*\n6. Kupanga miadi / Booking\n7. Kuona kazi zetu - Instagram\n8. Kuzungumza na muhudumu\n\nJibu namba ya huduma. Mfano: \`1\``

    if (['hi','mambo','hello','niaje','vipi','oy','boss'].includes(text.toLowerCase())) {
      return await sock.sendMessage(sender, { text: menu })
    }

    if (text === '1') {
      return await sock.sendMessage(sender, { text: `Chaguo zuri boss! 💅 *Tsh 10,000*\n\nUnapata: Kubandika + Kupaka rangi ya chaguo lako + Top coat ya kung'aa\n\n📍 Tupate wapi? Tupigie ${namba}\n📅 Kupanga miadi? Jibu \`6\`\n\nKaribu sana, tunakusubiri!` })
    }
    
    if (text === '2') {
      return await sock.sendMessage(sender, { text: `Poa sana! 🦶 *Tsh 15,000*\n\nHuduma: Kuosha + Kung'arisha + Scrub ya kuondoa ngozi ngumu + Massage + Kupaka rangi\n\nMiguu yako itang'aa kama ya mtoto 😊\n📅 Weka miadi sasa? Jibu \`
