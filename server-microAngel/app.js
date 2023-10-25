import express from 'express';
import logger from 'morgan';

import openaiR from './openaiChat.js';
import config from './config.js';

const app = express();
const port = config.PORT

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/send-message", async (req, res) => {
    const message = req.body.message;
    console.log("User's message:",message);

    const response = await openaiR.getOpenAIResponse(message);
    console.log("ChatAI's message: ",response);

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