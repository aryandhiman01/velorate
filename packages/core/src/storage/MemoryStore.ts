import type { RateLimitState } from "../types/rate-limit-state.js";
import type { RateLimitStore } from "../contracts/rate-limit-store.js";


// In memory implementation of the RateLimitStore
export class MemoryStore implements RateLimitStore {

    // Internal Storage
    private readonly storage = new Map<string, RateLimitState>();

    async get(key: string): Promise<RateLimitState | null> {
        return this.storage.get(key) ?? null;
    }

    async set(key: string, value: RateLimitState): Promise<void> {
        this.storage.set(key, value);
    }

    async delete(key:string): Promise<void> {
        this.storage.delete(key);
    }

    async clear(): Promise<void> {
        this.storage.clear();
    }
}