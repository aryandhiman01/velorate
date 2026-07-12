import type { RateLimitAlgorithm } from "../contracts/rate-limit-algorithm.js";
import type { RateLimitStore } from "../contracts/rate-limit-store.js";

import type { RateLimitContext } from "../types/rate-limit-context.js";
import type { RateLimitDecision } from "../types/rate-limit-decision.js";

export class RateLimiter {

    constructor(
        private readonly store: RateLimitStore,
        private readonly algorithm: RateLimitAlgorithm
    ) {}

    async check(
        key: string
    ): Promise<RateLimitDecision> {

        const state = await this.store.get(key);

        const context: RateLimitContext = {

            state,

            config: (this.algorithm as any).config,

            now: Date.now()

        };

        const decision = this.algorithm.execute(context);

        await this.store.set(
            key,
            decision.state
        );

        return decision;

    }

    async reset(
        key: string
    ): Promise<void> {

        await this.store.delete(key);

    }

    async clear(): Promise<void> {

        await this.store.clear();

    }

}