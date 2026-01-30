import session from 'express-session';
import MemoryStore from 'memorystore';
import { CONFIG } from './config';

const MemoryStoreSession = MemoryStore(session);

export const sessionMiddleware = session({
  store: new MemoryStoreSession({
    checkPeriod: 86400000, // Prune expired entries every 24h
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
