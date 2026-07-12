import type { RateLimitAlgorithm } from "../contracts/rate-limit-algorithm.js";

import { InvalidConfigurationError } from "../errors/InvalidConfigurationError.js";

import type { RateLimitContext } from "../types/rate-limit-context.js";
import type { RateLimitDecision } from "../types/rate-limit-decision.js";
import type { SlidingWindowState } from "../types/sliding-window-state.js";

export class SlidingWindow implements RateLimitAlgorithm {

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
            state as SlidingWindowState | null ??
            {
                currentCount: 0,
                previousCount: 0,
                windowStart: now
            };

        let {
            currentCount,
            previousCount,
            windowStart
        } = currentState;

        const elapsed =
            now - windowStart;

        if (elapsed >= this.config.window * 2) {

            // Completely inactive
            previousCount = 0;
            currentCount = 0;
            windowStart = now;

        }
        else if (elapsed >= this.config.window) {

            // Shift one window
            previousCount = currentCount;
            currentCount = 0;
            windowStart = now;

        }

        const weight =
            (this.config.window - (now - windowStart))
            / this.config.window;

        const estimatedCount =
            previousCount * weight
            + currentCount;

        if (estimatedCount >= this.config.limit) {

            return {

                allowed: false,

                remaining: 0,

                retryAfter:
                    windowStart
                    + this.config.window
                    - now,

                state: {

                    currentCount,

                    previousCount,

                    windowStart

                }

            };

        }

        currentCount++;

        return {

            allowed: true,

            remaining:
                Math.max(
                    0,
                    this.config.limit
                    - Math.ceil(estimatedCount)
                    - 1
                ),

            retryAfter: 0,

            state: {

                currentCount,

                previousCount,

                windowStart

            }

        };

    }

}