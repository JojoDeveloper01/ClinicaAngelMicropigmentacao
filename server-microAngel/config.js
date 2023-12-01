import dotenv from 'dotenv';

dotenv.config();

const config = {
    MODEL: 'gpt-3.5-turbo',
    MAX_TOKENS: 500,
    TEMPERATURE: 0.5,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    PORT: process.env.PORT,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    REDIRECT_URI: process.env.REDIRECT_URI,
    REFRESH_TOKEN: process.env.REFRESH_TOKEN,
    EMAILS: JSON.parse(process.env.EMAILS)
};

export default config;