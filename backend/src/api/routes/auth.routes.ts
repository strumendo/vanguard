import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { authService } from '../../services/auth.service.js';
import { isAppError, formatErrorResponse, ValidationError } from '../../utils/errors.js';
import { logger } from '../../utils/logger.js';

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  }),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function authRoutes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  // POST /register - Create new user account
  app.post('/register', async (request, reply) => {
    try {
      const body = registerSchema.safeParse(request.body);
      if (!body.success) {
        throw new ValidationError('Validation failed', body.error.issues);
      }

      const result = await authService.register(body.data);

      // Generate JWT token
      const token = app.jwt.sign({
        userId: result.user.id,
        email: result.user.email,
        username: result.user.username,
      });

      logger.info(`User registered: ${result.user.id}`);

      return reply.status(201).send({
        user: result.user,
        token,
      });
    } catch (error) {
      if (isAppError(error)) {
        return reply.status(error.statusCode).send(formatErrorResponse(error));
      }
      logger.error('Registration error:', error);
      return reply.status(500).send({
        error: { code: 'INTERNAL_ERROR', message: 'Registration failed' },
      });
    }
  });

  // POST /login - Authenticate user
  app.post('/login', async (request, reply) => {
    try {
      const body = loginSchema.safeParse(request.body);
      if (!body.success) {
        throw new ValidationError('Validation failed', body.error.issues);
      }

      const result = await authService.login(body.data);

      // Generate JWT token
      const token = app.jwt.sign({
        userId: result.user.id,
        email: result.user.email,
        username: result.user.username,
      });

      logger.info(`User logged in: ${result.user.id}`);

      return reply.send({
        user: result.user,
        token,
      });
    } catch (error) {
      if (isAppError(error)) {
        return reply.status(error.statusCode).send(formatErrorResponse(error));
      }
      logger.error('Login error:', error);
      return reply.status(500).send({
        error: { code: 'INTERNAL_ERROR', message: 'Login failed' },
      });
    }
  });

  // POST /logout - Invalidate session
  app.post('/logout', {
    preHandler: [app.authenticate],
  }, async (request, reply) => {
    try {
      const token = request.headers.authorization?.replace('Bearer ', '');
      if (token) {
        await authService.logout(token);
      }

      return reply.send({ message: 'Logged out successfully' });
    } catch (error) {
      logger.error('Logout error:', error);
      return reply.status(500).send({
        error: { code: 'INTERNAL_ERROR', message: 'Logout failed' },
      });
    }
  });

  // POST /refresh - Refresh JWT token
  app.post('/refresh', {
    preHandler: [app.authenticate],
  }, async (request, reply) => {
    try {
      const user = request.user;

      // Generate new token
      const token = app.jwt.sign({
        userId: user.userId,
        email: user.email,
        username: user.username,
      });

      return reply.send({ token });
    } catch (error) {
      logger.error('Token refresh error:', error);
      return reply.status(500).send({
        error: { code: 'INTERNAL_ERROR', message: 'Token refresh failed' },
      });
    }
  });

  // GET /me - Get current user info
  app.get('/me', {
    preHandler: [app.authenticate],
  }, async (request, reply) => {
    try {
      const user = await authService.getUser(request.user.userId);

      if (!user) {
        return reply.status(404).send({
          error: { code: 'NOT_FOUND', message: 'User not found' },
        });
      }

      return reply.send({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt,
          preferences: user.preferences,
        },
      });
    } catch (error) {
      logger.error('Get user error:', error);
      return reply.status(500).send({
        error: { code: 'INTERNAL_ERROR', message: 'Failed to get user info' },
      });
    }
  });

  // PATCH /me/preferences - Update user preferences
  app.patch('/me/preferences', {
    preHandler: [app.authenticate],
  }, async (request, reply) => {
    try {
      const preferences = request.body as Record<string, unknown>;

      await authService.updatePreferences(request.user.userId, preferences);

      return reply.send({ message: 'Preferences updated' });
    } catch (error) {
      logger.error('Update preferences error:', error);
      return reply.status(500).send({
        error: { code: 'INTERNAL_ERROR', message: 'Failed to update preferences' },
      });
    }
  });

  // DELETE /me - Deactivate account
  app.delete('/me', {
    preHandler: [app.authenticate],
  }, async (request, reply) => {
    try {
      await authService.deactivateAccount(request.user.userId);

      // Blacklist current token
      const token = request.headers.authorization?.replace('Bearer ', '');
      if (token) {
        await authService.logout(token);
      }

      return reply.send({ message: 'Account deactivated' });
    } catch (error) {
      logger.error('Deactivate account error:', error);
      return reply.status(500).send({
        error: { code: 'INTERNAL_ERROR', message: 'Failed to deactivate account' },
      });
    }
  });
}
