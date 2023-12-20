import config from './config.js';
import OpenAIApi from "openai";

const openai = new OpenAIApi({
    apiKey: config.OPENAI_API_KEY,
});

const conversationHistory = [{
    role: 'system',
    content: 'És um assistente virtual útil que RESPONDE APENAS A PERGUNTAS DE BELEZA EM PORTUGUÊS DE PORTUGAL que gosta de pôr ocasionalmente alguns emojis para aumentar a confiança, representando a empresa Clínica Angel Micropigmentação. Fornecemos respostas concisas para manter os clientes envolvidos. Nossa empresa conta com profissionais altamente qualificados. A Clínica Angel é especializada em micropigmentação, remoção de micropigmentação, tratamento de manchas e tatuagens. A Hope oferece massagens, depilações, lifting e limpezas faciais. Os clientes podem entrar em contato conosco pelos seguintes meios: WhatsApp: 935 407 895, Facebook: https://www.facebook.com/aangelmicropigmentacao/ e Instagram: https://www.instagram.com/aangelmicropigmentacao/. Nossos locais são: Rua José Nogueira Vaz 16, Póvoa de Santa Iria, e Avenida João XXI 49B, Lisboa. Sempre recomendamos que os clientes entrem em contato conosco antes de visitar nossos locais.'
}];

async function getOpenAIResponse(userMessage) {
    try {
        conversationHistory.push({ role: 'user', content: userMessage });

        const openaiResponse = await openai.chat.completions.create({
            model: config.MODEL,
            max_tokens: config.MAX_TOKENS,
            temperature: config.TEMPERATURE,
            messages: conversationHistory,
        });

        conversationHistory.push({ role: 'assistant', content: openaiResponse.choices[0].message.content });

        let responseContent = openaiResponse.choices[0].message.content;

        const regexURLF = /https:\/\/www\.facebook\.com\/aangelmicropigmentacao\//;
        const URLface = regexURLF.test(responseContent);
        const regexURLI = /https:\/\/www\.instagram\.com\/aangelmicropigmentacao\//;
        const URLinst = regexURLI.test(responseContent);

        function replaceLinks(text) {
            const urlPattern = /(https?:\/\/[^\s]+)/g;
            return text.replace(urlPattern, (match) => {
                return `<a href="${match}" target="_blank" style="color:#5D5EF3;">${match}</a>`;
            });
        }

        if (URLface === true || URLinst === true) responseContent = replaceLinks(responseContent);

        function replaceNum(text) {
            const phoneNumberPattern = /\b\d{3} \d{3} \d{3}\b/g;
            return text.replace(phoneNumberPattern, (match) => {
                const whatsappLink = `https://api.whatsapp.com/send/?phone=351935407895&amp;text=Ola%21+Tenho+uma+duvida%21&amp;type=phone_number&amp;app_absent=0`;
                return `<a href="${whatsappLink}" target="_blank" style="color:#5D5EF3;">935407895</a>`;
            });
        }

        responseContent = responseContent.replace(/-/g, "<br>-");
        responseContent = replaceNum(responseContent);

        return responseContent;
    } catch (error) {
        console.error('Erro na solicitação à API OpenAI:', error);
        return 'Desculpe, ocorreu um erro na resposta do assistente. Por favor tente mais tarde';
    }
}

const openaiR = {
    getOpenAIResponse
}

export default openaiR;
