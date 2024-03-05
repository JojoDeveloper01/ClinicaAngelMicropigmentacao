const config = {
    CLIENT_ID: import.meta.env.CLIENT_ID,
    CLIENT_SECRET: import.meta.env.CLIENT_SECRET,
    REDIRECT_URI: import.meta.env.REDIRECT_URI,
    REFRESH_TOKEN: import.meta.env.REFRESH_TOKEN,
    EMAILS: JSON.parse(import.meta.env.EMAILS)
};

export default config;