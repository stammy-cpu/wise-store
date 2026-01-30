import rateLimit from 'express-rate-limit';
import { CONFIG } from '../config';

/**
 * Rate limiter for login endpoint
 * Limits login attempts to prevent brute force attacks
 */
export const loginRateLimiter = rateLimit({
  windowMs: CONFIG.rateLimit.windowMs,
  max: CONFIG.rateLimit.maxAttempts,
  message: {
    error: 'Too many login attempts, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip successful requests from counting
  skipSuccessfulRequests: true,
});

/**
 * General API rate limiter (more permissive)
 * Prevents API abuse across all endpoints
 */
export const apiRateLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 100, // 100 requests per minute
  message: {
    error: 'Too many requests, please slow down',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
