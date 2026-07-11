import type { RateLimitAlgorithm } from "../contracts/rate-limit-algorithm.js";

import { InvalidConfigurationError } from "../errors/InvalidConfigurationError.js";

import type { RateLimitConfig } from "../types/rate-limit-config.js";
import type { RateLimitContext } from "../types/rate-limit-context.js";
import type { RateLimitDecision } from "../types/rate-limit-decision.js";

export class FixedWindow implements RateLimitAlgorithm {

    constructor(
        private readonly config: RateLimitConfig
    ) {

        if (config.limit <= 0) {
            throw new InvalidConfigurationError(
                "Rate limit must be greater than 0."
            );
        }

        if (config.window <= 0) {
            throw new InvalidConfigurationError(
                "Window duration must be greater than 0."
            );
        }

    }

    execute(
        context: RateLimitContext
    ): RateLimitDecision {

        const { state, config, now } = context;

        // First request
        if (!state) {

            return {
                allowed: true,
                remaining: config.limit - 1,
                retryAfter: 0,
                state: {
                    count: 1,
                    resetAt: now + config.window
                }
            };

        }

        // Window expired
        if (now >= state.resetAt) {

            return {
                allowed: true,
                remaining: config.limit - 1,
                retryAfter: 0,
                state: {
                    count: 1,
                    resetAt: now + config.window
                }
            };

        }

        // Limit exceeded
        if (state.count >= config.limit) {

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

            remaining: config.limit - state.count - 1,

            retryAfter: 0,

            state: {

                ...state,

                count: state.count + 1

            }

        };

    }

}