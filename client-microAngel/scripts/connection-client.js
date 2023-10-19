//Mensagens com IA cliente
import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

const messageInput = document.querySelector('.write-message');
const sendMessages = document.getElementById('sendMessage');
const chatConversation = document.querySelector('.chat-conversation');
const messagesM = []; // Inicialize uma matriz para armazenar mensagens

let isWaitingForResponse = false;

function directMessages() {
    if (isWaitingForResponse) {
        return; // Se já estiver esperando uma resposta, não permita o envio de mensagens adicionais.
    }

    const message = messageInput.value.trim();

    if (message !== '') { // Verifica se a mensagem não está vazia
        isWaitingForResponse = true;

        // Desabilite a entrada de mensagem e o botão de envio
        messageInput.disabled = true;
        sendMessages.disabled = true;

        messagesM.push(message); // Adicione a mensagem à matriz


        const messageUser = document.createElement('div');
        messageUser.classList.add('user-question');

        const innerHTML = `
      <div class="ctro-chat">
          <img src="assets/image/servicos/depilacaoFIoFio.avif" width="30" height="30">
          <p class="userName">User</p>
      </div>
      <p class="chat">${message}</p>
      <hr class="space-hr">
  `;

        messageUser.innerHTML = innerHTML;
        chatConversation.appendChild(messageUser);

        //Conetar com o server

        const socket = io(clinicamicropigmentacaoangel.railway.internal)

        socket.on('connect', () => {
            socket.emit('message', message); // Envie uma mensagem ao servidor
        });

        socket.on('response', (data) => {
            gptResponse(data); // Manipule a resposta do servidor
        });

        function gptResponse(message) {
            const messageBot = document.createElement('div');
            messageBot.classList.add('reply-gpt');

            const innerHTML = `
        <div class="ctro-chat">
            <img src="assets/image/servicos/micro-labial-freepik.jpeg" width="30" height="30">
            <p class="userName">Clinica GPT</p>
        </div>
        <p class="chat">${message}</p>
        <hr class="space-hr">
    `;
            messageBot.innerHTML = innerHTML;
            chatConversation.appendChild(messageBot);

            // Habilitar a entrada de mensagem e o botão de envio
            messageInput.disabled = false;
            sendMessages.disabled = false;
            isWaitingForResponse = false;
        }

        chatConversation.scrollTop = chatConversation.scrollHeight;
        messageInput.value = '';
    }
}

sendMessages.addEventListener('click', directMessages);

messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        directMessages();
    }
});

