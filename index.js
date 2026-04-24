sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    if(qr && !sock.authState.creds.registered) {
        console.log("====== TUMIA HII PAIRING CODE ======");
        const code = await sock.requestPairingCode("255687702991");
        console.log("CODE YAKO: ", code);
        console.log("====================================");
    }
    
    if(connection === 'close') {
        // ... code zingine
    } else if(connection === 'open') {
        console.log('BOT IMEUNGANISHWA NA WHATSAPP! ✅');
    }
});
