const config = {
    MODEL: 'gpt-3.5-turbo',
    MAX_TOKENS: 500,
    TEMPERATURE: 0.5,
    OPENAI_API_KEY:process.env.OPENAI_API_KEY,
    PORT: process.env.PORT,
};

export default config;
