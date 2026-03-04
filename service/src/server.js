const app = require('./app');
const env = require('./config/env');
const logger = require('./logging/logger');
const { connectDb } = require('./config/db');

async function bootstrap() {
  await connectDb();

  app.listen(env.port, () => {
    logger.info('server started', {
      requestId: null,
      route: 'system',
      userId: null,
      metadata: {
        port: env.port,
        nodeEnv: env.nodeEnv,
      },
    });
  });
}

bootstrap().catch((err) => {
  logger.error('startup failed', {
    requestId: null,
    route: 'system',
    userId: null,
    metadata: {
      error: err.message,
    },
  });
  process.exit(1);
});
