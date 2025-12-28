import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('0.0.0.0'),

  // Database
  DATABASE_URL: z.string().url(),
  DATABASE_POOL_SIZE: z.coerce.number().default(10),

  // Redis
  REDIS_URL: z.string().url(),
  REDIS_PASSWORD: z.string().optional(),

  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Anthropic
  ANTHROPIC_API_KEY: z.string().startsWith('sk-ant-'),
  ANTHROPIC_MODEL: z.string().default('claude-3-5-sonnet-20241022'),
  ANTHROPIC_MAX_TOKENS: z.coerce.number().default(1000),

  // Pinecone
  PINECONE_API_KEY: z.string(),
  PINECONE_ENVIRONMENT: z.string().default('us-east-1'),
  PINECONE_INDEX: z.string().default('volution-historical-contexts'),

  // Rate Limiting
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  // Encryption
  ENCRYPTION_KEY: z.string().length(32).optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = {
  nodeEnv: parsed.data.NODE_ENV,
  port: parsed.data.PORT,
  host: parsed.data.HOST,

  database: {
    url: parsed.data.DATABASE_URL,
    poolSize: parsed.data.DATABASE_POOL_SIZE,
  },

  redis: {
    url: parsed.data.REDIS_URL,
    password: parsed.data.REDIS_PASSWORD,
  },

  jwt: {
    secret: parsed.data.JWT_SECRET,
    expiresIn: parsed.data.JWT_EXPIRES_IN,
    refreshExpiresIn: parsed.data.JWT_REFRESH_EXPIRES_IN,
  },

  anthropic: {
    apiKey: parsed.data.ANTHROPIC_API_KEY,
    model: parsed.data.ANTHROPIC_MODEL,
    maxTokens: parsed.data.ANTHROPIC_MAX_TOKENS,
  },

  pinecone: {
    apiKey: parsed.data.PINECONE_API_KEY,
    environment: parsed.data.PINECONE_ENVIRONMENT,
    index: parsed.data.PINECONE_INDEX,
  },

  rateLimitMax: parsed.data.RATE_LIMIT_MAX,
  rateLimitWindowMs: parsed.data.RATE_LIMIT_WINDOW_MS,

  logLevel: parsed.data.LOG_LEVEL,
  encryptionKey: parsed.data.ENCRYPTION_KEY,
};

export type Config = typeof config;
