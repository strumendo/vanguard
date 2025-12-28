import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { z } from 'zod';
import { gameService } from '../../services/game.service.js';
import { turnProcessor } from '../../services/turn-processor.service.js';
import { eventService } from '../../services/event.service.js';
import { actionService } from '../../services/action.service.js';
import {
  isAppError,
  formatErrorResponse,
  ValidationError,
} from '../../utils/errors.js';
import { logger } from '../../utils/logger.js';
import type { CountryId, Difficulty, GameSystem } from '../../types/game.types.js';

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

  // GET /:gameId/actions - Get available actions
  app.get('/:gameId/actions', async (request, reply) => {
    try {
      const { gameId } = request.params as { gameId: string };
      const { category } = request.query as { category?: string };

      const actions = await actionService.getAvailableActions(
        gameId,
        request.user.userId,
        category as GameSystem | undefined
      );

      return reply.send({
        actions: actions.map((a) => ({
          id: a.id,
          type: a.type,
          category: a.category,
          name: a.name,
          description: a.description,
          cost: a.cost,
          cooldownTurns: a.cooldownTurns,
        })),
      });
    } catch (error) {
      if (isAppError(error)) {
        return reply.status(error.statusCode).send(formatErrorResponse(error));
      }
      logger.error('Get actions error:', error);
      return reply.status(500).send({
        error: { code: 'INTERNAL_ERROR', message: 'Failed to get actions' },
      });
    }
  });

  // POST /:gameId/action - Execute game action
  app.post('/:gameId/action', async (request, reply) => {
    try {
      const { gameId } = request.params as { gameId: string };
      const body = z.object({ actionId: z.string() }).safeParse(request.body);

      if (!body.success) {
        throw new ValidationError('Validation failed', body.error.issues);
      }

      const result = await actionService.executeAction(
        gameId,
        request.user.userId,
        body.data.actionId
      );

      // Get updated game state
      const game = await gameService.getGame(gameId, request.user.userId);

      return reply.send({
        result,
        state: game.state,
      });
    } catch (error) {
      if (isAppError(error)) {
        return reply.status(error.statusCode).send(formatErrorResponse(error));
      }
      logger.error('Execute action error:', error);
      return reply.status(500).send({
        error: { code: 'INTERNAL_ERROR', message: 'Failed to execute action' },
      });
    }
  });

  // POST /:gameId/advance - Advance to next turn
  app.post('/:gameId/advance', async (request, reply) => {
    try {
      const { gameId } = request.params as { gameId: string };

      const result = await turnProcessor.advanceTurn(
        gameId,
        request.user.userId
      );

      // Get updated game state
      const game = await gameService.getGame(gameId, request.user.userId);

      return reply.send({
        turn: result.turn,
        date: {
          month: result.month,
          year: result.year,
        },
        changes: result.changes,
        expiredEffects: result.expiredEffects,
        triggeredEvents: result.triggeredEvents,
        warnings: result.warnings,
        state: game.state,
      });
    } catch (error) {
      if (isAppError(error)) {
        return reply.status(error.statusCode).send(formatErrorResponse(error));
      }
      logger.error('Advance turn error:', error);
      return reply.status(500).send({
        error: { code: 'INTERNAL_ERROR', message: 'Failed to advance turn' },
      });
    }
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
    try {
      const { gameId } = request.params as { gameId: string };

      const events = await eventService.getPendingEvents(
        gameId,
        request.user.userId
      );

      return reply.send({ events });
    } catch (error) {
      if (isAppError(error)) {
        return reply.status(error.statusCode).send(formatErrorResponse(error));
      }
      logger.error('Get events error:', error);
      return reply.status(500).send({
        error: { code: 'INTERNAL_ERROR', message: 'Failed to get events' },
      });
    }
  });

  // POST /:gameId/events/:eventId/respond - Respond to event
  app.post('/:gameId/events/:eventId/respond', async (request, reply) => {
    try {
      const { gameId, eventId } = request.params as {
        gameId: string;
        eventId: string;
      };

      const body = z.object({ optionId: z.string() }).safeParse(request.body);
      if (!body.success) {
        throw new ValidationError('Validation failed', body.error.issues);
      }

      const result = await eventService.respondToEvent(
        gameId,
        request.user.userId,
        eventId,
        body.data.optionId
      );

      // Get updated game state
      const game = await gameService.getGame(gameId, request.user.userId);

      return reply.send({
        resolution: result,
        state: game.state,
      });
    } catch (error) {
      if (isAppError(error)) {
        return reply.status(error.statusCode).send(formatErrorResponse(error));
      }
      logger.error('Respond to event error:', error);
      return reply.status(500).send({
        error: { code: 'INTERNAL_ERROR', message: 'Failed to respond to event' },
      });
    }
  });

  // POST /:gameId/events/trigger - Manually trigger event evaluation (for testing)
  app.post('/:gameId/events/trigger', async (request, reply) => {
    try {
      const { gameId } = request.params as { gameId: string };

      // Verify ownership
      await gameService.getGame(gameId, request.user.userId);

      const triggeredEvents = await eventService.triggerEvents(gameId);

      return reply.send({
        triggeredEvents,
        count: triggeredEvents.length,
      });
    } catch (error) {
      if (isAppError(error)) {
        return reply.status(error.statusCode).send(formatErrorResponse(error));
      }
      logger.error('Trigger events error:', error);
      return reply.status(500).send({
        error: { code: 'INTERNAL_ERROR', message: 'Failed to trigger events' },
      });
    }
  });
}
