const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

// FUTA FOLDER YA ZAMANI KILA UKIWASHA
if (fs.existsSync('./auth_info_baileys')) {
    fs.rmSync('./auth_info_baileys', { recursive: true, force: true });
    console.log('Session ya zamani imefutwa. Inatengeneza mpya...');
}

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false // Tunachapisha wenyewe
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('SCAN HII QR KWA WHATSAPP:');
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode!== DisconnectReason.loggedOut;
            console.log('Connection closed, reconnecting:', shouldReconnect);
            if (shouldReconnect) {
                startBot();
            }
        } else if (connection === 'open') {
            console.log('BOT IMEUNGANISHWA NA WHATSAPP!');
        }
    });

    sock.ev.on('creds.update', saveCreds);

    // Test command
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.key.fromMe && msg.message?.conversation === 'ping') {
            await sock.sendMessage(msg.key.remoteJid, { text: 'Pong! NailsBot iko Live 💅' });
        }
    });
}

startBot();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;
app.get('/', (req, res) => res.send('NailsBot iko Live'));
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
