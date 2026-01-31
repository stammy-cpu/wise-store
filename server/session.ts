import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import pkg from 'pg';
const { Pool } = pkg;
import { CONFIG } from './config';

const PgStore = connectPgSimple(session);

// Create a separate pool for session storage
const sessionPool = new Pool({
  connectionString: CONFIG.database.url,
  ssl: CONFIG.database.ssl ? { rejectUnauthorized: false } : false,
});

export const sessionMiddleware = session({
  store: new PgStore({
    pool: sessionPool,
    tableName: 'session', // Will create this table automatically
    createTableIfMissing: true,
  }),
  secret: CONFIG.session.secret,
  resave: false,
  saveUninitialized: false,
  name: CONFIG.session.name,
  cookie: {
    secure: CONFIG.session.secure,
    httpOnly: CONFIG.session.httpOnly,
    sameSite: CONFIG.session.sameSite,
    maxAge: CONFIG.session.maxAge,
    domain: CONFIG.isProduction ? '.big-wise.com' : undefined,
  },
});

// Extend express-session types
declare module 'express-session' {
  interface SessionData {
    userId?: string;
    username?: string;
    isAdmin?: boolean;
  }
}
