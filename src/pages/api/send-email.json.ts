import type { APIRoute } from 'astro';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import config from './config.js';
import { getIp } from './getIP.json.ts';

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
const unlimitedIPs = new Set<string>(['85.138.202.37', 'ip2', 'ip3']);

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

    const body = await request.json();
    console.log("\n\nRequest Body: ", body);

    const { nome, email, mensagem, telemovel } = body;
    console.log("\n\nExtracted Data: ", { nome, email, mensagem, telemovel });

    const oAuth2Client = getOAuth2Client();
    console.log("\n\nOAuth2 Client: ", oAuth2Client);

    if (oAuth2Client.isTokenExpiring()) {
      console.log("\n\nRefreshing Access Token");
      oAuth2Client.setCredentials({ refresh_token: config.REFRESH_TOKEN });
    }

    const accessToken = await oAuth2Client.getAccessToken();
    console.log("\n\nAccess Token: ", accessToken);

    const transporter = await getTransporter();
    console.log("\n\nTransporter: ", transporter);

    const mailOptions = {
      from: config.EMAILS[1],
      to: config.EMAILS[1],
      subject: 'Comentario de um usuario de Micropigmentacao Angel',
      html: `<p><strong>Nome:</strong> ${nome}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Telemóvel:</strong> ${telemovel}</p>
             <p><strong>Mensagem:</strong> ${mensagem}</p>`,
    };
    console.log("\n\nMail Options: ", mailOptions);

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
