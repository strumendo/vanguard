import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { z } from 'zod';
import { gameService } from '../../services/game.service.js';
import {
  isAppError,
  formatErrorResponse,
  ValidationError,
} from '../../utils/errors.js';
import { logger } from '../../utils/logger.js';
import type { CountryId, Difficulty } from '../../types/game.types.js';

// Validation schemas
const createGameSchema = z.object({
  countryId: z.enum([
    'brazil',
    'usa',
    'china',
    'russia',
    'india',
    'south_africa',
  ]),
  difficulty: z.enum(['easy', 'normal', 'hard', 'ironman']).default('normal'),
});

const gameActionSchema = z.object({
  actionType: z.string(),
  actionData: z.record(z.unknown()),
});

export async function gameRoutes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  // All routes require authentication
  app.addHook('preHandler', app.authenticate);

  // GET /countries - Get available countries for game creation
  app.get('/countries', async (_request, reply) => {
    try {
      const countries = gameService.getAvailableCountries();
      return reply.send({ countries });
    } catch (error) {
      logger.error('Get countries error:', error);
      return reply.status(500).send({
        error: { code: 'INTERNAL_ERROR', message: 'Failed to get countries' },
      });
    }
  });

  // GET / - List all user's games
  app.get('/', async (request, reply) => {
    try {
      const games = await gameService.getUserGames(request.user.userId);
      return reply.send({ games });
    } catch (error) {
      if (isAppError(error)) {
        return reply.status(error.statusCode).send(formatErrorResponse(error));
      }
      logger.error('Get games error:', error);
      return reply.status(500).send({
        error: { code: 'INTERNAL_ERROR', message: 'Failed to get games' },
      });
    }
  });

  // POST / - Create new game
  app.post('/', async (request, reply) => {
    try {
      const body = createGameSchema.safeParse(request.body);
      if (!body.success) {
        throw new ValidationError('Validation failed', body.error.issues);
      }

      const game = await gameService.createGame({
        userId: request.user.userId,
        countryId: body.data.countryId as CountryId,
        difficulty: body.data.difficulty as Difficulty,
      });

      logger.info(`Game created: ${game.id}`);

      return reply.status(201).send({
        game: {
          id: game.id,
          countryId: game.countryId,
          difficulty: game.difficulty,
          currentTurn: game.currentTurn,
          currentMonth: game.currentMonth,
          currentYear: game.currentYear,
          state: game.state,
        },
      });
    } catch (error) {
      if (isAppError(error)) {
        return reply.status(error.statusCode).send(formatErrorResponse(error));
      }
      logger.error('Create game error:', error);
      return reply.status(500).send({
        error: { code: 'INTERNAL_ERROR', message: 'Failed to create game' },
      });
    }
  });

  // GET /:gameId - Get game state
  app.get('/:gameId', async (request, reply) => {
    try {
      const { gameId } = request.params as { gameId: string };

      const game = await gameService.getGame(gameId, request.user.userId);

      return reply.send({
        game: {
          id: game.id,
          countryId: game.countryId,
          difficulty: game.difficulty,
          currentTurn: game.currentTurn,
          currentMonth: game.currentMonth,
          currentYear: game.currentYear,
          isActive: game.isActive,
          createdAt: game.createdAt,
          lastPlayedAt: game.lastPlayedAt,
          state: game.state,
        },
      });
    } catch (error) {
      if (isAppError(error)) {
        return reply.status(error.statusCode).send(formatErrorResponse(error));
      }
      logger.error('Get game error:', error);
      return reply.status(500).send({
        error: { code: 'INTERNAL_ERROR', message: 'Failed to get game' },
      });
    }
  });

  // POST /:gameId/action - Execute game action
  app.post('/:gameId/action', async (request, reply) => {
    const { gameId } = request.params as { gameId: string };
    const body = gameActionSchema.safeParse(request.body);
    if (!body.success) {
      return reply.status(400).send({
        error: 'Validation failed',
        details: body.error.issues,
      });
    }

    // TODO: Implement action execution in TurnProcessor
    return reply.status(501).send({
      error: 'Not implemented',
      message: 'Action execution coming in Phase 1.2',
      gameId,
      action: body.data.actionType,
    });
  });

  // POST /:gameId/advance - Advance to next turn
  app.post('/:gameId/advance', async (request, reply) => {
    const { gameId } = request.params as { gameId: string };

    // TODO: Implement turn advancement in TurnProcessor
    return reply.status(501).send({
      error: 'Not implemented',
      message: 'Turn advancement coming in Phase 1.2',
      gameId,
    });
  });

  // DELETE /:gameId - Delete game
  app.delete('/:gameId', async (request, reply) => {
    try {
      const { gameId } = request.params as { gameId: string };

      await gameService.deleteGame(gameId, request.user.userId);

      return reply.send({ message: 'Game deleted' });
    } catch (error) {
      if (isAppError(error)) {
        return reply.status(error.statusCode).send(formatErrorResponse(error));
      }
      logger.error('Delete game error:', error);
      return reply.status(500).send({
        error: { code: 'INTERNAL_ERROR', message: 'Failed to delete game' },
      });
    }
  });

  // GET /:gameId/events - Get pending events
  app.get('/:gameId/events', async (request, reply) => {
    const { gameId } = request.params as { gameId: string };

    // TODO: Implement event listing
    return reply.status(501).send({
      error: 'Not implemented',
      message: 'Event listing coming in Phase 1.3',
      gameId,
    });
  });

  // POST /:gameId/events/:eventId/respond - Respond to event
  app.post('/:gameId/events/:eventId/respond', async (request, reply) => {
    const { gameId, eventId } = request.params as {
      gameId: string;
      eventId: string;
    };

    // TODO: Implement event response
    return reply.status(501).send({
      error: 'Not implemented',
      message: 'Event response coming in Phase 1.3',
      gameId,
      eventId,
    });
  });
}
