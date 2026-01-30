import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from '@shared/schema';
import { CONFIG } from './config';

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: CONFIG.database.url,
  ssl: CONFIG.database.ssl ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 30000,
});

// Create Drizzle instance
export const db = drizzle(pool, { schema });

// Test database connection
pool.on('connect', () => {
  console.log('[Database] Connected to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('[Database] Unexpected error on idle client', err);
  process.exit(-1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await pool.end();
  console.log('[Database] Pool has ended');
  process.exit(0);
});
