import type { RateLimitState } from "../types/rate-limit-state.js";

export interface RateLimitStore {

    get(
        key: string
    ): Promise<RateLimitState | null>;

    set(
        key: string,
        value: RateLimitState
    ): Promise<void>;

    delete(
        key: string
    ): Promise<void>;

    clear(): Promise<void>;

}