import type { RateLimitAlgorithm } from "../contracts/rate-limit-algorithm.js";
import type { RateLimitConfig } from "../types/rate-limit-config.js";
import type { RateLimitDecision } from "../types/rate-limit-decision.js";
import type { RateLimitState } from "../types/rate-limit-state.js";

export class FixedWindow implements RateLimitAlgorithm {

    constructor(
        private readonly config: RateLimitConfig
    ) {

        if (config.limit <= 0) {
            throw new Error("Rate limit must be greater than 0.");
        }

        if (config.window <= 0) {
            throw new Error("Window duration must be greater than 0.");
        }

    }

    execute(
        state: RateLimitState | null
    ): RateLimitDecision {

        const now = Date.now();

        // First request
        if (!state) {

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

        // Window expired
        if (now >= state.resetAt) {

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

        // Limit exceeded
        if (state.count >= this.config.limit) {

            return {
                allowed: false,
                remaining: 0,
                retryAfter: state.resetAt - now,
                state
            };

        }

        // Allow request
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