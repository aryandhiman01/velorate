import type { RateLimitState } from "./rate-limit-state.js";

export interface TokenBucketState extends RateLimitState {
    tokens: number;
    lastRefill: number;
}