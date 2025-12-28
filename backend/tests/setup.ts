// Test setup file
// This runs before all tests

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.JWT_SECRET = 'test-jwt-secret-for-testing-only';
process.env.ANTHROPIC_API_KEY = 'test-api-key';
process.env.PORT = '3001';
process.env.HOST = '127.0.0.1';

// Increase timeout for async operations
jest.setTimeout(10000);

// Global test utilities
beforeAll(() => {
  // Any global setup
});

afterAll(() => {
  // Any global cleanup
});
