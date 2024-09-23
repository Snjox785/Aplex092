const express = require('express');
const cron = require('node-cron');
const axios = require('axios');

const app = express();
app.use(express.json());

let totalAmount = 0;
const dailyAmount = 4.50;
const webhookURL = 'https://discord.com/api/webhooks/1287715877784911995/HKX3ROOxcVH1PdDlUD_o2MlZcTKVQkiv3UZwseW4wYuR2cN-pj9VLGX9Dfp_ebVTazV0';

// Endpoint voor het versturen van dagelijkse webhook
app.post('/noBroodje', (req, res) => {
    totalAmount += dailyAmount;
    axios.post(webhookURL, { content: "Romain heeft vandaag geen broodje gegeten. Soldo +€4.50" })
        .then(() => res.sendStatus(200))
        .catch(err => {
            console.error(err);
            res.sendStatus(500);
        });
});

// Cron-job die elke maand het totaal verstuurt en reset
cron.schedule('0 0 1 * *', () => {
    const message = `Romain moet €${totalAmount.toFixed(2)} geld krijgen deze maand.`;
    axios.post(webhookURL, { content: message })
        .then(() => {
            totalAmount = 0; // Reset het totaalbedrag
        })
        .catch(err => console.error(err));
});

app.listen(3000, () => {
    console.log('Server draait op poort 3000');
});
