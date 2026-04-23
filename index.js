const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    }
});

client.on('qr', qr => {
    console.log('FESTO BOT: SCAN QR HII');
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('FESTO BOT IKO LIVE SASA!');
});

client.initialize();

// Server ya Render isilale
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Festo Bot Running'));
app.listen(process.env.PORT || 10000, () => console.log('Server ready'));
