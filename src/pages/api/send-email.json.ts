import type { APIRoute } from 'astro';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import config from './config.js';
import { getIp } from './getIP.json.ts';

export const prerender = false; //server

let oAuth2Client: any = null;
let transporter: any = null;

const getOAuth2Client = () => {
  if (!oAuth2Client) {
    oAuth2Client = new google.auth.OAuth2(
      config.CLIENT_ID,
      config.CLIENT_SECRET,
      config.REDIRECT_URI
    );
    oAuth2Client.setCredentials({ refresh_token: config.REFRESH_TOKEN });
  }

  return oAuth2Client;
};

const getTransporter = async () => {
  if (!transporter) {
    const accessToken = await getOAuth2Client().getAccessToken();

    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: config.EMAILS[1],
        clientId: config.CLIENT_ID,
        clientSecret: config.CLIENT_SECRET,
        refreshToken: config.REFRESH_TOKEN,
        accessToken: accessToken,
      },
    } as nodemailer.TransportOptions);
  }

  return transporter;
};

const RATE_LIMIT_THRESHOLD = 10;
const rateLimitMap = new Map<string, number>();
const unlimitedIPs = new Set<string>([config.IP[1], config.IP[2], config.IP[3]]);

const checkRateLimit = (ip: string): boolean => {
  // Se o IP está na lista de IPs ilimitados, permita sem verificação
  if (unlimitedIPs.has(ip))
    return true;

  const currentCount = rateLimitMap.get(ip) || 0;

  if (currentCount >= RATE_LIMIT_THRESHOLD)
    return false; // IP atingiu o limite de taxa


  rateLimitMap.set(ip, currentCount + 1);
  return true;
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const ipResponse = await getIp();
    const ip = await ipResponse.text();

    // Check if the IP has exceeded the rate limit
    if (!checkRateLimit(ip)) {
      console.log(`Blocked request from IP ${ip} due to rate limit`);
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
        status: 429,
        statusText: 'Rate Limit Exceeded',
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log("\n\n-------------------------------");
    console.log("\nReceived POST request");

    const oAuth2Client = getOAuth2Client();
    console.log("\n\nOAuth2 Client: ", oAuth2Client);

    if (oAuth2Client.isTokenExpiring()) {
      oAuth2Client.setCredentials({ refresh_token: config.REFRESH_TOKEN });
    }
    await oAuth2Client.getAccessToken();
    const transporter = await getTransporter();

    let mailOptions

    const body = await request.json();
    console.log("\n\nRequest Body: ", body);

    //if there is any doubt about something
    if (body.type === 'doubt') {
      const { nome, email, mensagem, telemovel } = body;
      console.log("\n\nExtracted Data: ", { nome, email, mensagem, telemovel });

      mailOptions = {
        from: config.EMAILS[1],
        to: [config.EMAILS[0], config.EMAILS[1]],
        subject: 'Novo Comentário - Clínica Angel Micropigmentação',
        html: `
          <p><strong>Nome:</strong> ${nome}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Telemóvel:</strong> ${telemovel}</p>
          <p><strong>Mensagem:</strong> ${mensagem}</p>
          <br>
          <p>Clínica Micropigmentação Angel</p>`,
      }

    }
    //if it is a email verification
    else if (body.type === 'email_validation') {
      const { name, email, code } = body;
      console.log("\n\nExtracted Data: ", { name, email, code });

      mailOptions = {
        from: config.EMAILS[1],
        to: email,
        subject: 'Código de Verificação - Clínica Angel Micropigmentação',
        html: `
          <p>Olá ${name},</p>
          <p>A sua inscrição no Curso de Microblading da Clínica Angel Micropigmentação está quase completa!</p>
          <p>Por favor, confirme os seus dados utilizando o código seguinte:</p>
          <p><strong>Código: ${code}</strong></p>
          <p>Atenciosamente,</p>
          <p>Clínica Angel Micropigmentação</p>
      `,
      }
    }
    //if it is a course booking confirmation message
    else if (body.type === 'booking_confirmation') {
      const { name, contact, email, data } = body;
      console.log("\n\nExtracted Data: ", { name, contact, email, data });

      mailOptions = {
        from: config.EMAILS[1],
        to: email,
        subject: 'Confirmação do Curso - Clínica Angel Micropigmentação',
        html: `
          <p>Olá ${name},</p>
          <p>É com prazer que confirmamos a sua inscrição no Curso de Microblading!</p>
          <p><strong>Detalhes da inscrição:</strong></p>
          <p><strong>Data:</strong> ${data}</p>
          <p><strong>Professora:</strong> Angel Balcboni</p>
          <p><strong>Kit Incluído:</strong></p>
          <ul>
            <li>1 Tebori</li>
            <li>4 Agulhas</li>
            <li>4 Anéis</li>
            <li>1 Pele Sintética</li>
            <li>1 Bolsa</li>
            <li><strong>Almoço incluído no último dia</strong></li>
          </ul>
          <p><strong>Conteúdo do Curso:</strong></p>
          <ul>
            <li>Módulo 1: Introdução à Técnica, Manual para download, Indicações e dúvidas frequentes</li>
            <li>Módulo 2: A Pele e Estrutura do Rosto, Tipos de Sobrancelhas, Tipos de Olhos</li>
            <li>Módulo 3: Material - Tebori, Agulhas, Produtos, Pigmentos</li>
            <li>Módulo 4: Design de Sobrancelhas, Simetria Facial, Colometria, Higiene e Segurança</li>
            <li>Módulo 5: Pré Procedimento - Ficha de Anamnese, Termo de Consentimento</li>
            <li>Módulo 6: Pós Procedimento - Cuidados, Sequência do Procedimento</li>
            <li>Módulo 7: Prática - Técnicas Fio-a-Fio e Shadow em Pele Sintética e Modelos Reais</li>
          </ul>
          <p>Se tiver alguma dúvida ou precisar de mais informações, estamos à disposição.</p>
          <p><strong>Contato:</strong> 935 407 895</p>
          <p>Atenciosamente,</p>
          <p>Clínica Angel Micropigmentação</p>
        `,
      }

    }
    const result = await transporter.sendMail(mailOptions);
    console.log('\n\nEmail sent: ', result);

    console.log("\n\n-------------------------------");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      statusText: 'Ok',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('\n\nErro ao enviar o e-mail: ', error.message, error.stack);

    return new Response(JSON.stringify({ error: 'Erro interno ao enviar o e-mail' }), {
      status: 500,
      statusText: 'Internal Server Error',
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
