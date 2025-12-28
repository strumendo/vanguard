import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from '@fastify/jwt';
import { config } from '../config/env.js';
import { redis } from '../config/redis.js';
import { logger } from '../utils/logger.js';

export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  iat: number;
  exp: number;
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JWTPayload;
    user: JWTPayload;
  }
}

export function setupJWT(app: import('fastify').FastifyInstance) {
  app.register(jwt, {
    secret: config.jwtSecret,
    sign: {
      expiresIn: config.jwtExpiresIn,
    },
  });

  app.decorate(
    'authenticate',
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        const token = request.headers.authorization?.replace('Bearer ', '');

        if (!token) {
          return reply.status(401).send({
            error: 'Unauthorized',
            message: 'No token provided',
          });
        }

        // Check if token is blacklisted
        const isBlacklisted = await redis.exists(`blacklist:${token}`);
        if (isBlacklisted) {
          return reply.status(401).send({
            error: 'Unauthorized',
            message: 'Token has been revoked',
          });
        }

        await request.jwtVerify();
      } catch (err) {
        logger.warn('Authentication failed:', err);
        return reply.status(401).send({
          error: 'Unauthorized',
          message: 'Invalid or expired token',
        });
      }
    }
  );
}

export async function blacklistToken(
  token: string,
  expiresInSeconds: number
): Promise<void> {
  await redis.setex(`blacklist:${token}`, expiresInSeconds, '1');
}
