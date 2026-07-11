import type { RateLimitAlgorithm } from "../contracts/rate-limit-algorithm.js";
import type { RateLimitStore } from "../contracts/rate-limit-store.js";
import type { RateLimitDecision } from "../types/rate-limit-decision.js";

export class RateLimiter {

    constructor(
        private readonly store: RateLimitStore,
        private readonly algorithm: RateLimitAlgorithm
    ) {}

    /**
     * Checks whether the request should be allowed.
     */
    async check(key: string): Promise<RateLimitDecision> {

        // Read current state
        const state = await this.store.get(key);

        // Execute algorithm
        const decision = this.algorithm.execute(state);

        // Persist updated state
        await this.store.set(key, decision.state);

        // Return decision
        return decision;
    }

    /**
     * Removes a single identifier.
     */
    async reset(key: string): Promise<void> {
        await this.store.delete(key);
    }

    /**
     * Clears the complete store.
     */
    async clear(): Promise<void> {
        await this.store.clear();
    }

}