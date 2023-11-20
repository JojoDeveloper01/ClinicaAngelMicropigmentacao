import express from 'express';
import logger from 'morgan';

import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import openaiR from './openaiChat.js';
import config from './config.js';

const app = express();
const port = config.PORT
app.use(express.json());

const client_id = '1078000774257-dp4q2n6g6570egov81lpn6sl7epkh2r6.apps.googleusercontent.com'
const client_secret = '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'
const redirect_URI = 'https://developers.google.com/oauthplayground/'
const refresh_token = '1//04DfZnrMuknluCgYIARAAGAQSNwF-L9IrAZYgNOxXzMwDLmz61PBtFmsCbro6SAO7ju4Dn7R2qkHei1swS1eX65tqi8YICrO0pZM'

const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_URI
);

oAuth2Client.setCredentials({ refresh_token: refresh_token });

const emails = ['angelbalcboni@gmail.com', 'jidotidarson123@gmail.com'];

app.post("/send-email", async (req, res) => {
    const { nome, email, mensagem, telemovel } = req.body;

    if (!nome || !mensagem) {
        return res.status(400).json({ error: 'Por favor, preencha todos os campos "Nome" e "Mensagem".' });
    }

    if (!email && !telemovel) {
        return res.status(400).json({ error: 'Por favor, preencha ou o campo "email" ou o campo "telemovel".' });
    }

    async function sendMail() {
        try {
            const accessToken = await oAuth2Client.getAccessToken();

            const transport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: 'ivans.buzz00@gmail.com',
                    clientId: client_id, 
                    clientSecret: client_secret, 
                    refreshToken: refresh_token,
                    accessToken: accessToken,
                },
            });

            const mailOptions = {
                from: 'ivans.buzz00@gmail.com',
                to: [emails[0], emails[1]],  
                subject: 'Comentario de um usuario de Micropigmentacao Angel',
                html: `<p><strong>Nome:</strong> ${nome}</p>
                         <p><strong>Email:</strong> ${email}</p>
                         <p><strong>Telemóvel:</strong> ${telemovel}</p>
                         <p><strong>Mensagem:</strong> ${mensagem}</p>`,
            };

            const result = await transport.sendMail(mailOptions);
            return result;
        } catch (error) {
            return error;
        }
    }

    sendMail()
        .then((result) => console.log('Email sent...', result))
        .catch((error) => console.log(error.message));
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

