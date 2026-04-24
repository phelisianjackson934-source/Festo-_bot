sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    if(qr && !sock.authState.creds.registered) {
        console.log("====== TUMIA PAIRING CODE ======");
        const code = await sock.requestPairingCode("255687702991");
        console.log("CODE YAKO: ", code);
        console.log("=================================");
        console.log("Nenda WhatsApp > Linked Devices > Link with phone number");
    }
