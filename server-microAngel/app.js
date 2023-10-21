import express from 'express';
import logger from 'morgan';

import { createServer } from 'node:http'
import { Server } from 'socket.io';

import openaiR from './openaiChat.js';
import config from './config.js';

const app = express();
const server = createServer(app)
const io = new Server(server)
// Carregue as variáveis de ambiente do arquivo .env
const port = config.PORT || 5001;

io.on('connection', (socket) => {
    console.log('User was connected to the IA chat');

    socket.on('message', async (message) => {
        console.log("User's message:", message);

        const response = await openaiR.getOpenAIResponse(message);

        // Enviar a resposta para o cliente
        socket.emit('response', response);
        console.log("ChatAI's message:", response);
    });

    socket.on('disconnect', () => {
        console.log('User was disconnected from the IA chat');
    });
});

app.disable('x-powered-by')
app.use(logger('dev'))
app.use(express.static('client-microAngel'));

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/client-microAngel/index.html');
});

server.listen(port, '0.0.0.0',  () => {
    console.log(`Servidor ouvindo na porta ${port}`);
});



