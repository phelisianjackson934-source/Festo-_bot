const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: false }));

app.post('/whatsapp', (req, res) => {
  const msg = req.body.Body;
  res.type('text/xml').send(`<Response><Message>Mambo! Nimepokea: ${msg}. Festo Bot iko Live 🔥</Message></Response>`);
});

app.get('/', (req, res) => res.send('Festo Bot iko Live'));
app.listen(process.env.PORT || 3000);
