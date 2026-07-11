import type { RateLimitAlgorithm } from "../contracts/rate-limit-algorithm.js";
import type { RateLimitConfig } from "../types/rate-limit-config.js";
import type { RateLimitDecision } from "../types/rate-limit-decision.js";
import type { RateLimitState } from "../types/rate-limit-state.js";

export class FixedWindow implements RateLimitAlgorithm {
    
    constructor(private readonly config: RateLimitConfig) {}

    execute(state: RateLimitState | null): RateLimitDecision {
        const now = Date.now();

        // First Request
        if(!state) {
            return {
                allowed: true,
                remaining: this.config.limit - 1,
                retryAfter: null,
                state: {
                    count: 1,
                    resetAt: now + this.config.window
                }
            };
        }

        // Reset if window expired
        if(now >= state.resetAt) {
            return {
                allowed: true,
                remaining: this.config.limit - 1,
                retryAfter: 0,
                state: {
                    count: 1,
                    resetAt: now + this.config.window
                }
            };
        }

        // Limit execeeded
        if(state.count >= this.config.limit) {
            return {
                allowed: false,
                remaining: 0,
                retryAfter: state.resetAt - now,
                state
            };
        }

        //Allow Request
        return {
            allowed: true,
            remaining: this.config.limit - state.count - 1,
            retryAfter: 0,
            state: {
                ...state,
                count: state.count + 1
            }
        };
    }
}