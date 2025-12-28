import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';
import { checkDatabaseConnection, closeDatabaseConnection } from './config/database.js';
import { checkRedisConnection, closeRedisConnection } from './config/redis.js';
import { setupJWT } from './middleware/auth.middleware.js';
import { authRoutes } from './api/routes/auth.routes.js';
import { gameRoutes } from './api/routes/game.routes.js';
import { aiRoutes } from './api/routes/ai.routes.js';
import { isAppError, formatErrorResponse } from './utils/errors.js';

const app = Fastify({
  logger: true,
});

async function bootstrap() {
  // Check connections
  const dbConnected = await checkDatabaseConnection();
  const redisConnected = await checkRedisConnection();

  if (!dbConnected || !redisConnected) {
    logger.error('Failed to establish required connections');
    process.exit(1);
  }

  // Security plugins
  await app.register(helmet);
  await app.register(cors, {
    origin: config.nodeEnv === 'production' ? ['https://volution.game'] : true,
    credentials: true,
  });
  await app.register(rateLimit, {
    max: config.rateLimitMax,
    timeWindow: config.rateLimitWindowMs,
  });

  // JWT Authentication
  setupJWT(app);

  // Global error handler
  app.setErrorHandler((error, _request, reply) => {
    if (isAppError(error)) {
      return reply.status(error.statusCode).send(formatErrorResponse(error));
    }

    logger.error('Unhandled error:', error);
    return reply.status(500).send({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    });
  });

  // Routes
  await app.register(authRoutes, { prefix: '/api/v1/auth' });
  await app.register(gameRoutes, { prefix: '/api/v1/games' });
  await app.register(aiRoutes, { prefix: '/api/v1/ai' });

  // Health check
  app.get('/health', async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '0.1.0',
    };
  });

  // Start server
  try {
    await app.listen({ port: config.port, host: config.host });
    logger.info(`🚀 VOLUTION Backend running on ${config.host}:${config.port}`);
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
}

bootstrap();

// Graceful shutdown
const signals = ['SIGINT', 'SIGTERM'];
signals.forEach((signal) => {
  process.on(signal, async () => {
    logger.info(`Received ${signal}, shutting down gracefully...`);
    await app.close();
    await closeDatabaseConnection();
    await closeRedisConnection();
    process.exit(0);
  });
});
