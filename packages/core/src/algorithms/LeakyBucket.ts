import type { RateLimitAlgorithm } from "../contracts/rate-limit-algorithm.js";

import { InvalidConfigurationError } from "../errors/InvalidConfigurationError.js";

import type { RateLimitContext } from "../types/rate-limit-context.js";
import type { RateLimitDecision } from "../types/rate-limit-decision.js";
import type { LeakyBucketState } from "../types/leaky-bucket-state.js";

export class LeakyBucket implements RateLimitAlgorithm {

    constructor(
        private readonly capacity: number,
        private readonly leakRate: number
    ) {

        if (capacity <= 0) {
            throw new InvalidConfigurationError(
                "Capacity must be greater than 0."
            );
        }

        if (leakRate <= 0) {
            throw new InvalidConfigurationError(
                "Leak rate must be greater than 0."
            );
        }

    }

    execute(
        context: RateLimitContext
    ): RateLimitDecision {

        const { state, now } = context;

        const currentState: LeakyBucketState =
            (state as LeakyBucketState) ?? {
                queueSize: 0,
                lastLeak: now
            };

        let {
            queueSize,
            lastLeak
        } = currentState;

        // Time passed since last leak
        const elapsed = (now - lastLeak) / 1000;

        // Requests leaked
        const leaked = elapsed * this.leakRate;

        // Reduce queue
        queueSize = Math.max(
            0,
            queueSize - leaked
        );

        lastLeak = now;

        // Reject if bucket full
        if (queueSize >= this.capacity) {

            return {

                allowed: false,

                remaining: 0,

                retryAfter: Math.ceil(
                    (queueSize - this.capacity + 1)
                    / this.leakRate
                ),

                state: {

                    queueSize,

                    lastLeak

                }

            };

        }

        // Accept request
        queueSize++;

        return {

            allowed: true,

            remaining: Math.max(
                0,
                this.capacity - Math.ceil(queueSize)
            ),

            retryAfter: 0,

            state: {

                queueSize,

                lastLeak

            }

        };

    }

}