import type { Redis } from "ioredis";

import type { RateLimitStore } from "../contracts/rate-limit-store.js";
import type { RateLimitState } from "../types/rate-limit-state.js";
import type { RedisStoreOptions } from "../types/redis-store-options.js";

export class RedisStore implements RateLimitStore {

    private readonly client: Redis;

    private readonly prefix: string;

    constructor(options: RedisStoreOptions) {

        this.client = options.client;
        this.prefix = options.prefix ?? "velorate";

    }

    private buildKey(key: string): string {

        return `${this.prefix}:${key}`;

    }

    async get(
        key: string
    ): Promise<RateLimitState | null> {

        const value = await this.client.get(
            this.buildKey(key)
        );

        if (!value) {
            return null;
        }

        return JSON.parse(value) as RateLimitState;

    }

    async set(
        key: string,
        value: RateLimitState
    ): Promise<void> {

        let ttl = 60;

        if (
            typeof value.resetAt === "number"
        ) {

            ttl = Math.max(
                1,
                Math.ceil(
                    (value.resetAt - Date.now()) / 1000
                )
            );

        }

        await this.client.set(

            this.buildKey(key),

            JSON.stringify(value),

            "EX",

            ttl

        );

    }

    async delete(
        key: string
    ): Promise<void> {

        await this.client.del(
            this.buildKey(key)
        );

    }

    async clear(): Promise<void> {

        let cursor = "0";

        do {

            const [nextCursor, keys] =
                await this.client.scan(
                    cursor,
                    "MATCH",
                    `${this.prefix}:*`,
                    "COUNT",
                    100
                );

            cursor = nextCursor;

            if (keys.length > 0) {

                await this.client.del(...keys);

            }

        } while (cursor !== "0");

    }

}