import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import config from './config.js';

const oAuth2Client = new google.auth.OAuth2(
  config.CLIENT_ID,
  config.CLIENT_SECRET,
  config.REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: config.REFRESH_TOKEN });

export async function POST(req: {
  method: string;
  body: { nome: string; email: string; mensagem: string; telemovel: number; };
}, res: {
  json: (arg0: { success: boolean; }) => void;
  status?: (arg0: number) => { (): object; new(): object; json: { (arg0: { error: string; }): void; new(): object; }; };
}) {
  if (req.method === "POST") {
    try {
      const { nome, email, mensagem, telemovel } = req.body;
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
      } as nodemailer.TransportOptions);

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

      const result = await transport.sendMail(mailOptions);

      console.log("Email sent...", result);

      res.json({ success: true });
      return transport.sendMail(mailOptions);

    } catch (error: any) {
      console.error("Erro ao enviar o e-mail:", error.message);
      if (res.status) {
        res.status(500).json({ error: "Erro interno ao enviar o e-mail." });
      }
    }
  } else {
    if (res && res.status) {
      res.status(405).json({ error: "Método não permitido" });
    }
  }
}


/* ----------------------------------- */


const oAuth2Client = new google.auth.OAuth2(
  config.CLIENT_ID,
  config.CLIENT_SECRET,
  config.REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: config.REFRESH_TOKEN });

export async function POST(req: { method: string; body: { nome: any; email: any; mensagem: any; telemovel: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): void; new(): any; }; }; json: (arg0: { success: boolean; }) => void; }) {
  /*  if (req.method === 'POST') { */
  try {
    const { nome, email, mensagem, telemovel } = req.body;
    const accessToken = await oAuth2Client.getAccessToken();

    // Construa o corpo da mensagem para enviar via Gmail API
    const message = `From: ${config.EMAILS[1]}\r\n
                       To: ${config.EMAILS.join(',')}\r\n
                       Subject: Comentario de um usuario de Micropigmentacao Angel\r\n\r\n
                       Nome: ${nome}\r\n
                       Email: ${email}\r\n
                       Telemóvel: ${telemovel}\r\n
                       Mensagem: ${mensagem}`;

    const response = await fetch('https://www.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: Buffer.from(message).toString('base64'),
      }),
    });

    if (!response.ok) {
      console.error('Erro ao enviar o e-mail:', response.statusText);
      res.status(500).json({ error: 'Erro interno ao enviar o e-mail.' });
    } else {
      console.log('E-mail enviado com sucesso!');
      res.json({ success: true });
    }
  } catch (error: any) {
    console.error('Erro ao enviar o e-mail:', error.message);
    res.status(500).json({ error: 'Erro interno ao enviar o e-mail.' });
  }
  /*   } else {
      if (res && res.status) {
        res.status(405).json({ error: 'Método não permitido' });
      }
    } */
}


/* ----------------------------------- */


import type { APIRoute } from 'astro';

const oAuth2Client = new google.auth.OAuth2(
  config.CLIENT_ID,
  config.CLIENT_SECRET,
  config.REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: config.REFRESH_TOKEN });

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = {
      nome: "aa",
      email: "aa",
      mensagem: "sadfa",
      telemovel: "sfdas",
    };

    console.log(body)
    if (!await request.json()) {
      throw new Error('Corpo da solicitação vazio.');
    }

    const { nome, email, mensagem, telemovel } = body;
    console.log(nome, email, mensagem, telemovel)
    console.log(oAuth2Client)

    console.log("config.CLIENT_ID: ", config.CLIENT_ID)

    const accessToken = await oAuth2Client.getAccessToken();
    console.log("wokda", accessToken)
    // Construa o corpo da mensagem para enviar via Gmail API
    const message = `From: ${config.EMAILS[1]}\r\n
                       To: ${config.EMAILS.join(',')}\r\n
                       Subject: Comentario de um usuario de Micropigmentacao Angel\r\n\r\n
                       Nome: ${nome}\r\n
                       Email: ${email}\r\n
                       Telemóvel: ${telemovel}\r\n
                       Mensagem: ${mensagem}`;

    console.log("saopmkfa", message)
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/{userId}/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: Buffer.from(message).toString('base64'),
      }),
    });
    console.log("safasf", response)

    // Verifique se a resposta foi bem-sucedida antes de tentar extrair os dados
    if (response.ok) {
      return new Response(JSON.stringify({
        success: true,
      }), {
        status: 200,
        statusText: "Ok",
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // Manipule a falha da solicitação para a API do Gmail
      console.error('Falha na solicitação para a API do Gmail:', response.statusText);
      return new Response(JSON.stringify({
        error: 'Falha na solicitação para a API do Gmail.',
      }), {
        status: response.status,
        statusText: response.statusText,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error: any) {
    // Lidar com erros apropriadamente
    console.error('Erro ao enviar o e-mail:', error.message);

    return new Response(JSON.stringify({
      error: 'Erro interno ao enviar o e-mail.',
    }), {
      status: 500,
      statusText: "Internal Server Error",
      headers: { "Content-Type": "application/json" },
    });
  }
}


/* ----------------------------------- */



interface FormData {
  nome: string;
  telemovel: string;
  email: string;
  mensagem: string;
}

// Verificar se estamos no ambiente do navegador antes de acessar o objeto document
if (typeof document !== 'undefined') {
  const form = document.querySelector('form') as HTMLFormElement;
  const buttonForm = form.querySelector('button') as HTMLButtonElement;

  if (buttonForm) {
    form.addEventListener('submit', handleSubmit);
  }

  function handleSubmit(event: Event) {
    event.preventDefault();

    const inputs = form.querySelectorAll('input, textarea');
    let itWorks = true;
    clearAlerts();

    const requiredFields = ['nome', 'telemovel', 'mensagem'];
    for (const field of requiredFields) {
      const value = (form.elements[field as keyof typeof form.elements] as HTMLInputElement)?.value;
      if (!value) {
        itWorks = false;
        displayAlert(`${field}Alert`);
      }
    }

    const telemovelInput = (form.elements as any)['telemovel'] as HTMLInputElement;

    if (telemovelInput) {
      const telemovel = telemovelInput.value;
      if (telemovel && !isValidPhoneNumber(telemovel)) {
        itWorks = false;
        displayAlert("formatTelemovel");
      }
    }

    const email: string = (form.elements as any)['email'].value;
    if (email && !isValidEmail(email)) {
      itWorks = false;
      displayAlert("formatEmail");
    }

    if (itWorks) {
      const data = Object.fromEntries(new FormData(form)) as object as FormData;
      console.log("askf", data)
      sendFormData(data);

      (inputs as NodeListOf<HTMLInputElement>).forEach((input) => {
        input.value = '';
      });
    }
  }
  async function sendFormData(data: FormData) {
    try {
      // Faça uma chamada para o endpoint /api/send-email usando fetch

      const response = await fetch("/api/send-email.json", {
        method: 'POST',
        body: data,
      });

      // Chame a função handleResponse com o status da resposta
      handleResponse(response.status);

    } catch (error) {
      console.error('Erro ao enviar o formulário:', error);
    }
  }

  function handleResponse(status: number) {
    const successColor = '#38d391';
    const errorColor = '#ff0050';
    buttonForm.style.backgroundColor = (status === 200) ? successColor : errorColor;
    buttonForm.style.transition = 'background-color 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
    displayAlert((status === 200) ? 'successAlert' : 'errorAlert');
    if (status !== 200) console.error('Erro na requisição:', status);
  }

  function displayAlert(alertId: string) {
    const alertElement = document.getElementById(alertId);

    if (alertElement) {
      alertElement.style.display = "block";
    } else {
      // Handle the case where the element is not found
      console.error(`Alert element with ID "${alertId}" not found.`);
    }
  }

  function clearAlerts() {
    const alerts = document.getElementsByClassName("customAlert") as HTMLCollectionOf<HTMLElement>;
    for (const alert of alerts) {
      alert.style.display = "none";
    }
  }

  function isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidPhoneNumber(telefone: string) {
    const numeroRegex = /^\d+$/;
    return numeroRegex.test(telefone);
  }

  if (buttonForm) {
    buttonForm.addEventListener("blur", () => {
      buttonForm.style.backgroundColor = '';
      buttonForm.style.transition = '';
    });
  }
}
