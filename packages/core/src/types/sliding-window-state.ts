import type { RateLimitState } from "./rate-limit-state.js";

export interface SlidingWindowState extends RateLimitState {
    currentCount: number;
    previousCount: number;
    windowStart: number;
}