import type { RateLimitState } from "./rate-limit-state.js";

export interface FixedWindowState extends RateLimitState {
    count: number;
    resetAt: number;
}