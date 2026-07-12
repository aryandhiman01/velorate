import type { RateLimitStore } from "../contracts/rate-limit-store.js";
import type { RateLimitState } from "../types/rate-limit-state.js";

export class MemoryStore implements RateLimitStore {

    private readonly storage =
        new Map<string, RateLimitState>();

    async get(
        key: string
    ): Promise<RateLimitState | null> {

        return this.storage.get(key) ?? null;

    }

    async set(
        key: string,
        value: RateLimitState
    ): Promise<void> {

        this.storage.set(key, value);

    }

    async delete(
        key: string
    ): Promise<void> {

        this.storage.delete(key);

    }

    async clear(): Promise<void> {

        this.storage.clear();

    }

}