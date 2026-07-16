import { RateLimiterMemory } from "rate-limiter-flexible";

export const flexibleLimiter =
  new RateLimiterMemory({
    points: 100,
    duration: 60,
  });