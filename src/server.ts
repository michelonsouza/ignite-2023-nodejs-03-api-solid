import { app } from './app';
import { env } from './env';

app
  .listen({
    host: env.HOST,
    port: env.PORT,
  })
  .then(() =>
    console.info(
      `🚀  HTTP server is running on: http://${env.HOST}:${env.PORT}`,
    ),
  );
