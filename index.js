const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

// LAZIMISHA KUFUTA SESSION
if (fs.existsSync('./auth_info_baileys')) {
    fs.rmSync('./auth_info_baileys', { recursive: true, force: true });
}

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true, // MUHIMU: Lazimisha QR
        browser: ['NailsBot', 'Chrome', '1.0.0'] // MUHIMU: Epuka Pairing Code
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('====== SCAN HII QR KWA WHATSAPP ======');
            qrcode.generate(qr, { small: true });
            console.log('======================================');
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Connection closed, reconnecting:', shouldReconnect);
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log('BOT IMEUNGANISHWA NA WHATSAPP!');
        }
    });

    sock.ev.on('creds.update', saveCreds);
}

startBot();

const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('NailsBot Live'));
app.listen(process.env.PORT || 10000, () => console.log('Server running'));
