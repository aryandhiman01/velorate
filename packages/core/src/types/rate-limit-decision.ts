import type { RateLimitState } from "./rate-limit-state.js";

// Result returned after executing
export interface RateLimitDecision {
    allowed: boolean;   // Whether the request is allowed 

    remaining: number;  // Remaining requests in the current window

    retryAfter: number | null;   //Time until next request can be accepted

    state: RateLimitState;  // Updated state
}