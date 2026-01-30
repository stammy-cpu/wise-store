import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

export const CONFIG = {
  // Admin credentials
  admin: {
    email: process.env.ADMIN_EMAIL || 'fatahstammy@gmail.com',
    password: process.env.ADMIN_PASSWORD || '@21Savage',
  },

  // Session configuration
  session: {
    secret: process.env.SESSION_SECRET || 'fallback-secret-change-in-production',
    maxAge: parseInt(process.env.SESSION_MAX_AGE || '86400000', 10), // 24 hours
    name: 'wise.sid',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' as const : 'lax' as const,
  },

  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxAttempts: parseInt(process.env.RATE_LIMIT_MAX_ATTEMPTS || '12', 10),
  },

  // Database configuration
  database: {
    url: process.env.DATABASE_URL!,
    ssl: true, // Always use SSL for Supabase
  },

  // Supabase configuration
  supabase: {
    url: process.env.SUPABASE_URL!,
    anonKey: process.env.SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  },

  // Environment
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',
};
