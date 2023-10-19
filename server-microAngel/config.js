import dotenv from 'dotenv'

dotenv.config()

const config = {
    MODEL: 'gpt-3.5-turbo',
    MAX_TOKENS: 500,
    TEMPERATURE: 0.5,
    OPENAI_API_KEY: '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',
    PORT: 3000,
};

export default config;