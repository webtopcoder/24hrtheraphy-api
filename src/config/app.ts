export default {
  port: process.env.HTTP_PORT || 9000,
  baseUrl: process.env.BASE_URL || 'http://localhost:9000',
  NODE_ENV: process.env.NODE_ENV || 'development'
};
