import express from 'express';
import logger from 'morgan';

import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import openaiR from './openaiChat.js';
import cron from 'node-cron';
import config from './config.js';

const app = express();
const port = config.PORT
app.use(express.json());

const oAuth2Client = new google.auth.OAuth2(
    config.CLIENT_ID,
    config.CLIENT_SECRET,
    config.REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: config.REFRESH_TOKEN });

cron.schedule('0 12 * * 5', async () => {
    const nome = 'Experẽncia Semanal';
    const email = 'exemplo@email.com';
    const mensagem = 'Esta é uma experiência automática enviada toda sexta para verificar se o email funciona devidamente!';

    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: config.EMAILS[1],
                clientId: config.CLIENT_ID,
                clientSecret: config.CLIENT_SECRET,
                refreshToken: config.REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        const mailOptions = {
            from: config.EMAILS[1],
            to: config.EMAILS[1],
            subject: 'Experiência Automática',
            html: `<p><strong>Nome:</strong> ${nome}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Mensagem:</strong> ${mensagem}</p>`,
        };

        const result = await transport.sendMail(mailOptions);
        console.log('Email enviado automaticamente:', result);
    } catch (error) {
        console.error('Erro ao enviar o e-mail automaticamente:', error.message);
    }
})

app.post("/send-email", (req, res) => {
    const { nome, email, mensagem, telemovel } = req.body;

    oAuth2Client.getAccessToken()
        .then((accessToken) => {
            const transport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: config.EMAILS[1],
                    clientId: config.CLIENT_ID,
                    clientSecret: config.CLIENT_SECRET,
                    refreshToken: config.REFRESH_TOKEN,
                    accessToken: accessToken,
                },
            });

            console.log("Dados do envio email OAuth2: ", transport);

            const mailOptions = {
                from: config.EMAILS[1],
                to: config.EMAILS,
                subject: 'Comentario de um usuario de Micropigmentacao Angel',
                html: `<p><strong>Nome:</strong> ${nome}</p>
                 <p><strong>Email:</strong> ${email}</p>
                 <p><strong>Telemóvel:</strong> ${telemovel}</p>
                 <p><strong>Mensagem:</strong> ${mensagem}</p>`,
            };

            console.log("Dados do email do cliente enviado: ", mailOptions);

            return transport.sendMail(mailOptions);
        })
        .then((result) => {
            console.log('Email sent...', result);
            res.json({ success: true });    
        })
        .catch((error) => {
            console.error('Erro ao enviar o e-mail:', error.message);
            res.status(500).json({ error: 'Erro interno ao enviar o e-mail.' });
        });
});

app.post("/send-message", async (req, res) => {
    const message = req.body.message;
    console.log("User's message:", message);

    const response = await openaiR.getOpenAIResponse(message);
    console.log("ChatAI's message: ", response);

    res.json({ message: response });
});

app.disable('x-powered-by')
app.use(logger('dev'))
app.use(express.static('client-microAngel'));

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/client-microAngel/index.html');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor ouvindo na porta ${port}`);
});

