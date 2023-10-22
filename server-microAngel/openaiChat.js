import config from './config.js';
import OpenAIApi from "openai";

const openai = new OpenAIApi({
    apiKey:config.OPENAI_API_KEY,
});

async function getOpenAIResponse(userMessage) {
    try {
        const openaiResponse = await openai.chat.completions.create({
            model: config.MODEL,
            max_tokens: config.MAX_TOKENS,
            temperature: config.TEMPERATURE,
            messages: [{
                role: 'system',
                content: 'És um útil assistente virtual que SÓ RESPONDES PERGUNTAS DE BELEZA EM PORTUGUES DE PORTUGAL, da empresa Clínica Angel Micropigmetação, que fornece respostas concisas para manter os clientes envolvidos. A empresa tem profissionais altamente qualificados. Angel é especializada em micropigmentação, remoção de micro, tratamento de manchas e tatuagens. Esperanza oferece massagens, depilações, lifting e limpezas faciais. Os clientes podem entrar em contato conosco pelos seguintes meios: WhatsApp: 935407895, Facebook: https://www.facebook.com/aangelmicropigmentacao e Instagram: https://www.instagram.com/aangelmicropigmentacao/ Os locais da empresa são:Rua José Nogueira Vaz 16, Póvoa de Santa Iria e Avenida João XXI 25, Lisboa. Sempre vais recomendar quando o cliente pergunte sobre os locais, que sempre entre em contacto connosco antes de visitar os locais'
            },
            {
                role: 'user',
                content: userMessage
            },
            ],
        });

        return openaiResponse.choices[0].message.content;
    } catch (error) {
        console.error('Erro na solicitação à API OpenAI:', error);
        return 'Desculpe, ocorreu um erro na resposta do assistente. Por favor tente mais tarde';
    }
}

const openaiR = {
    getOpenAIResponse
}

export default openaiR;
