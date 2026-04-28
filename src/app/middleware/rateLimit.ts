import rateLimit from "express-rate-limit";

// ─── 1. Global limiter ────────────────────────────────────────────────────────

// Applied to ALL routes as a baseline safety net.
// 200 requests per IP per 15 minutes.
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again after 15 minutes.",
  },
});

// ─── 2. Auth limiter ──────────────────────────────────────────────────────────
// Strict limit on login/register/forgot-password to prevent brute-force.
// 10 attempts per IP per 15 minutes.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skipSuccessfulRequests: true, // only count failed/errored requests
  message: {
    success: false,
    message:
      "Too many authentication attempts. Please try again after 15 minutes.",
  },
});

// ─── 3. API read limiter ──────────────────────────────────────────────────────
// Relaxed limit for public read endpoints (medicine list, categories).
// 300 requests per IP per 15 minutes.
export const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please slow down.",
  },
});

// ─── 4. Write/mutation limiter ────────────────────────────────────────────────
// For order creation, cart, reviews — prevents spam.
// 50 write requests per IP per 15 minutes.
export const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});
