import type { RateLimitState } from "../types/rate-limit-state.js";

// A rate limiting algo
export interface RateLimitDecision {

    // Whether the request should be allowed
    allowed: boolean;

    // remaining requests
    remaining: number;

    // time in which the client can make another request
    retryAfter: number;

    //updated state after execution
    state: RateLimitState;
}

// Every rate limiting algorithm must implement this interface
export interface RateLimitAlgorithm {
    execute(state: RateLimitState | null): RateLimitDecision;
}