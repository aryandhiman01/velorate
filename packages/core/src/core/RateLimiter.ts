import type { RateLimitAlgorithm } from "../contracts/rate-limit-algorithm.js";
import type { RateLimitStore } from "../contracts/rate-limit-store.js";
import type { RateLimitDecision } from "../types/rate-limit-decision.js";

export class RateLimiter {
    constructor(
        private readonly store: RateLimitStore,
        private readonly algorithm: RateLimitAlgorithm
    ) {}

    // Check whether the request should be allowed
    async check(key: string): Promise<RateLimitDecision> {

        const state = await this.store.get(key);  // read current state

        const decision = this.algorithm.execute(state);   // execute algo

        await this.store.set(key, decision.state);   //persist updated state

        return decision;   // return result
    }

    // Removes a single identifier
    async reset(key: string): Promise<void> {
        await this.store.delete(key);
    }

    // Clears the complete store
    async clear(): Promise<void> {
        await this.store.clear();
    }
}