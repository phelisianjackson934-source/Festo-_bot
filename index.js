const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

// Futa session ya zamani
if (fs.existsSync('./auth_info_baileys')) {
    fs.rmSync('./auth_info_baileys', { recursive: true, force: true });
    console.log('Session ya zamani imefutwa. Inatengeneza mpya...');
}

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    const sock = makeWASocket({
        auth: state,
        browser: ['Festo Nails Bot', 'Chrome', '120.0.0'] // Hii inazima Pairing Code
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('====== SCAN HII QR KWA WHATSAPP ======');
            qrcode.generate(qr, { small: true }); // Tunachapisha wenyewe
            console.log('======================================');
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Connection closed, reconnecting:', shouldReconnect);
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log('BOT IMEUNGANISHWA NA WHATSAPP! ✅');
        }
    });

    sock.ev.on('creds.update', saveCreds);
}

startBot();

const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Festo Nails Bot Live'));
app.listen(process.env.PORT || 10000);
