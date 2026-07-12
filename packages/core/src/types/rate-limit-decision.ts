import type { RateLimitState } from "./rate-limit-state.js";

export interface RateLimitDecision {

    allowed: boolean;

    remaining: number;

    retryAfter: number;

    state: RateLimitState;

}