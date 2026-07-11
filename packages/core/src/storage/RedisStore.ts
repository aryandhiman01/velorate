import type { Redis } from "ioredis";

import type { RateLimitStore } from "../contracts/rate-limit-store.js";
import type { RateLimitState } from "../types/rate-limit-state.js";

export class RedisStore implements RateLimitStore {

    constructor(
        private readonly client: Redis
    ) {}

    async get(
        key: string
    ): Promise<RateLimitState | null> {

        const value = await this.client.get(key);

        if (!value) {
            return null;
        }

        return JSON.parse(value) as RateLimitState;

    }

    async set(
        key: string,
        value: RateLimitState
    ): Promise<void> {

        const ttl = Math.max(
            1,
            Math.ceil((value.resetAt - Date.now()) / 1000)
        );

        await this.client.set(
            key,
            JSON.stringify(value),
            "EX",
            ttl
        );

    }

    async delete(
        key: string
    ): Promise<void> {

        await this.client.del(key);

    }

    async clear(): Promise<void> {

        await this.client.flushdb();

    }

}