import { pool } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
  isActive: boolean;
  preferences: Record<string, unknown>;
}

export interface CreateUserInput {
  email: string;
  username: string;
  passwordHash: string;
}

export const userRepository = {
  async findById(id: string): Promise<User | null> {
    const result = await pool.query(
      `SELECT id, email, username, password_hash, created_at, updated_at,
              last_login_at, is_active, preferences
       FROM users WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) return null;

    return mapRowToUser(result.rows[0]);
  },

  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query(
      `SELECT id, email, username, password_hash, created_at, updated_at,
              last_login_at, is_active, preferences
       FROM users WHERE email = $1`,
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) return null;

    return mapRowToUser(result.rows[0]);
  },

  async findByUsername(username: string): Promise<User | null> {
    const result = await pool.query(
      `SELECT id, email, username, password_hash, created_at, updated_at,
              last_login_at, is_active, preferences
       FROM users WHERE username = $1`,
      [username.toLowerCase()]
    );

    if (result.rows.length === 0) return null;

    return mapRowToUser(result.rows[0]);
  },

  async create(input: CreateUserInput): Promise<User> {
    const id = uuidv4();
    const result = await pool.query(
      `INSERT INTO users (id, email, username, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, username, password_hash, created_at, updated_at,
                 last_login_at, is_active, preferences`,
      [id, input.email.toLowerCase(), input.username.toLowerCase(), input.passwordHash]
    );

    return mapRowToUser(result.rows[0]);
  },

  async updateLastLogin(id: string): Promise<void> {
    await pool.query(
      `UPDATE users SET last_login_at = NOW() WHERE id = $1`,
      [id]
    );
  },

  async updatePreferences(
    id: string,
    preferences: Record<string, unknown>
  ): Promise<void> {
    await pool.query(
      `UPDATE users SET preferences = $2 WHERE id = $1`,
      [id, JSON.stringify(preferences)]
    );
  },

  async deactivate(id: string): Promise<void> {
    await pool.query(`UPDATE users SET is_active = false WHERE id = $1`, [id]);
  },

  async emailExists(email: string): Promise<boolean> {
    const result = await pool.query(
      `SELECT 1 FROM users WHERE email = $1`,
      [email.toLowerCase()]
    );
    return result.rows.length > 0;
  },

  async usernameExists(username: string): Promise<boolean> {
    const result = await pool.query(
      `SELECT 1 FROM users WHERE username = $1`,
      [username.toLowerCase()]
    );
    return result.rows.length > 0;
  },
};

function mapRowToUser(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    email: row.email as string,
    username: row.username as string,
    passwordHash: row.password_hash as string,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
    lastLoginAt: row.last_login_at
      ? new Date(row.last_login_at as string)
      : null,
    isActive: row.is_active as boolean,
    preferences: (row.preferences as Record<string, unknown>) || {},
  };
}
