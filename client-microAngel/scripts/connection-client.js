const messageInput = document.querySelector('.write-message');
const sendMessages = document.getElementById('sendMessage');
const chatConversation = document.querySelector('.chat-conversation');
const messagesM = [];

let isWaitingForResponse = false;

function directMessages() {
    if (isWaitingForResponse) {
        return;
    }

    const message = messageInput.value.trim();

    if (message !== '') {
        isWaitingForResponse = true;

        messageInput.disabled = true;
        sendMessages.disabled = true;

        messagesM.push(message);


        const messageUser = document.createElement('div');
        messageUser.classList.add('user-question');

        const innerHTML = `
      <div class="ctro-chat">
          <img src="assets/image/servicos/depilacaoFIoFio.avif" width="30" height="30">
          <p class="userName">User</p>
      </div>
      <p class="chat">${message}</p>
      <hr class="space-hr">`;

        messageUser.innerHTML = innerHTML;
        chatConversation.appendChild(messageUser);

        const waitingMessage = document.createElement('span');
        waitingMessage.classList.add('waiting-response');

        const typing = `<div>
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>`;

        waitingMessage.innerHTML = typing;
        chatConversation.appendChild(waitingMessage);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/send-message", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onload = function () {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                console.log(response)
                gptResponse(response.message)

                chatConversation.removeChild(waitingMessage);
            }
        };

        const data = JSON.stringify({ message: message });
        xhr.send(data);


        function gptResponse(message) {
            const messageBot = document.createElement('div');
            messageBot.classList.add('reply-gpt');

            const innerHTML = `
        <div class="ctro-chat">
            <img src="assets/image/servicos/micro-labial-freepik.jpeg" width="30" height="30">
            <p class="userName">Clinica GPT</p>
        </div>
        <p class="chat">${message}</p>
        <hr class="space-hr">`;

            messageBot.innerHTML = innerHTML;
            chatConversation.appendChild(messageBot);

            messageInput.disabled = false;
            sendMessages.disabled = false;
            isWaitingForResponse = false;
            chatConversation.scrollTop = chatConversation.scrollHeight;
        }

        messageInput.value = '';
        chatConversation.scrollTop = chatConversation.scrollHeight;
    }
}

sendMessages.addEventListener('click', directMessages);

messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        directMessages();
    }
});

