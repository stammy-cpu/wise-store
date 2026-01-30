import rateLimit from "express-rate-limit";

// Rate limiter for visitor messages: 10 messages per minute
export const messageRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each visitor to 10 messages per minute
  message: "Too many messages sent. Please wait a moment before sending more.",
  standardHeaders: true,
  legacyHeaders: false,
  // Use visitor ID as the key (visitor ID is always provided in the request body)
  keyGenerator: (req) => {
    return req.body.visitorId || 'unknown';
  },
  skip: (req) => {
    // Skip rate limiting for admin messages
    return req.body.isFromAdmin === true;
  },
});
