// getIP.ts
export const getIp = async () => {
  try {
    const response = await fetch('https://api.ipify.org');
    const ip = await response.text();

    console.log("\n\n-------------------------------");
    console.log("\n\nIP do utilizador: ", ip);

    return new Response(ip, {
      status: 200,
      statusText: 'OK',
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (error: any) {
    console.error('Erro ao obter o IP externo:', error.message, error.stack);

    return new Response(JSON.stringify({ error: 'Erro interno' }), {
      status: 500,
      statusText: 'Internal Server Error',
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
