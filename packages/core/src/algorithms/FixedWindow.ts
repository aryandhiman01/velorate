import type { RateLimitAlgorithm } from "../contracts/rate-limit-algorithm.js";

import { InvalidConfigurationError } from "../errors/InvalidConfigurationError.js";

import type { RateLimitContext } from "../types/rate-limit-context.js";
import type { RateLimitDecision } from "../types/rate-limit-decision.js";
import type { FixedWindowState } from "../types/fixed-window-state.js";

export class FixedWindow implements RateLimitAlgorithm {

    constructor(
        private readonly config: {
            limit: number;
            window: number;
        }
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

        const { state, now } = context;

        const currentState =
            state as FixedWindowState | null;

        if (!currentState) {

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

        if (now >= currentState.resetAt) {

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

        if (currentState.count >= this.config.limit) {

            return {

                allowed: false,

                remaining: 0,

                retryAfter:
                    currentState.resetAt - now,

                state: currentState

            };

        }

        return {

            allowed: true,

            remaining:
                this.config.limit
                - currentState.count
                - 1,

            retryAfter: 0,

            state: {

                ...currentState,

                count:
                    currentState.count + 1

            }

        };

    }

}