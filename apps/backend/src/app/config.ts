export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  env: process.env.NODE_ENV || 'development',
  database: {
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10),
    name: process.env.DB_NAME,
  },
  openai: {
    key: process.env.OPENAI_KEY,
    baseUrl: process.env.OPENAI_BASE_URL,
  },
});
