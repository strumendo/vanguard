import bcrypt from 'bcrypt';
import { userRepository, User } from '../repositories/user.repository.js';
import { blacklistToken } from '../middleware/auth.middleware.js';
import {
  AuthenticationError,
  ConflictError,
  ValidationError,
} from '../utils/errors.js';
import { logger } from '../utils/logger.js';

const SALT_ROUNDS = 12;
const JWT_EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 7 days

export interface RegisterInput {
  email: string;
  username: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult {
  user: {
    id: string;
    email: string;
    username: string;
  };
  token: string;
}

export const authService = {
  async register(input: RegisterInput): Promise<AuthResult> {
    // Validate input
    if (input.password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters');
    }

    if (input.username.length < 3 || input.username.length > 32) {
      throw new ValidationError('Username must be between 3 and 32 characters');
    }

    // Check if email already exists
    if (await userRepository.emailExists(input.email)) {
      throw new ConflictError('Email already registered');
    }

    // Check if username already exists
    if (await userRepository.usernameExists(input.username)) {
      throw new ConflictError('Username already taken');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    // Create user
    const user = await userRepository.create({
      email: input.email,
      username: input.username,
      passwordHash,
    });

    logger.info(`New user registered: ${user.id}`);

    // Generate token (this will be done by the route handler using Fastify JWT)
    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      token: '', // Will be filled by route handler
    };
  },

  async login(input: LoginInput): Promise<AuthResult> {
    // Find user by email
    const user = await userRepository.findByEmail(input.email);

    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    if (!user.isActive) {
      throw new AuthenticationError('Account is deactivated');
    }

    // Verify password
    const isValid = await bcrypt.compare(input.password, user.passwordHash);

    if (!isValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Update last login
    await userRepository.updateLastLogin(user.id);

    logger.info(`User logged in: ${user.id}`);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      token: '', // Will be filled by route handler
    };
  },

  async logout(token: string): Promise<void> {
    // Add token to blacklist
    await blacklistToken(token, JWT_EXPIRY_SECONDS);
    logger.info('Token blacklisted');
  },

  async getUser(userId: string): Promise<User | null> {
    return userRepository.findById(userId);
  },

  async updatePreferences(
    userId: string,
    preferences: Record<string, unknown>
  ): Promise<void> {
    await userRepository.updatePreferences(userId, preferences);
  },

  async deactivateAccount(userId: string): Promise<void> {
    await userRepository.deactivate(userId);
    logger.info(`Account deactivated: ${userId}`);
  },

  async validatePassword(password: string): string[] {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    if (password.length > 128) {
      errors.push('Password must be at most 128 characters');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    return errors;
  },
};
