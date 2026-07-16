import rateLimit from "express-rate-limit";

export const expressLimiter = rateLimit({
  windowMs: 60_000,
  limit: 100,
});