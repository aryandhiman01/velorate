import type { RateLimitAlgorithm } from "../contracts/rate-limit-algorithm.js";
import type { RateLimitStore } from "../contracts/rate-limit-store.js";

import type { RateLimitConfig } from "../types/rate-limit-config.js";
import type { RateLimitContext } from "../types/rate-limit-context.js";
import type { RateLimitDecision } from "../types/rate-limit-decision.js";

export class RateLimiter {

    constructor(
        private readonly store: RateLimitStore,
        private readonly algorithm: RateLimitAlgorithm,
        private readonly config: RateLimitConfig
    ) {}

    /**
     * Checks whether the request should be allowed.
     */
    async check(
        key: string
    ): Promise<RateLimitDecision> {

        // Read state
        const state = await this.store.get(key);

        // Build context
        const context: RateLimitContext = {
            state,
            config: this.config,
            now: Date.now()
        };

        // Execute algorithm
        const decision = this.algorithm.execute(context);

        // Persist state
        await this.store.set(key, decision.state);

        return decision;

    }

    /**
     * Removes one identifier.
     */
    async reset(
        key: string
    ): Promise<void> {

        await this.store.delete(key);

    }

    /**
     * Clears the store.
     */
    async clear(): Promise<void> {

        await this.store.clear();

    }

}