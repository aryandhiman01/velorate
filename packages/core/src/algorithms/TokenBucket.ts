import type { RateLimitAlgorithm } from "../contracts/rate-limit-algorithm.js";

import { InvalidConfigurationError } from "../errors/InvalidConfigurationError.js";

import type { RateLimitContext } from "../types/rate-limit-context.js";
import type { RateLimitDecision } from "../types/rate-limit-decision.js";
import type { TokenBucketState } from "../types/token-bucket-state.js";

export class TokenBucket implements RateLimitAlgorithm {

    constructor(
        private readonly capacity: number,
        private readonly refillRate: number
    ) {

        if (capacity <= 0) {
            throw new InvalidConfigurationError(
                "Capacity must be greater than 0."
            );
        }

        if (refillRate <= 0) {
            throw new InvalidConfigurationError(
                "Refill rate must be greater than 0."
            );
        }

    }

    execute(
        context: RateLimitContext
    ): RateLimitDecision {

        const { state, now } = context;

        const currentState: TokenBucketState =
            (state as TokenBucketState) ?? {
                tokens: this.capacity,
                lastRefill: now
            };

        let {
            tokens,
            lastRefill
        } = currentState;

        // Time elapsed since last refill
        const elapsed = now - lastRefill;

        // Tokens to refill
        const refill =
            (elapsed / 1000) * this.refillRate;

        tokens = Math.min(
            this.capacity,
            tokens + refill
        );

        lastRefill = now;

        // Reject request
        if (tokens < 1) {

            return {

                allowed: false,

                remaining: 0,

                retryAfter:
                    Math.ceil(
                        (1 - tokens) / this.refillRate
                    ),

                state: {

                    tokens,

                    lastRefill

                }

            };

        }

        // Consume one token
        tokens--;

        return {

            allowed: true,

            remaining: Math.floor(tokens),

            retryAfter: 0,

            state: {

                tokens,

                lastRefill

            }

        };

    }

}