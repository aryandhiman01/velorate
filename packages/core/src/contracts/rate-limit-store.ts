import type { RateLimitState } from "../types/rate-limit-state.js";

// Storage Contract
export interface RateLimitStore {

    // Returns the current state for an identifier
    get(key: string): Promise<RateLimitState | null>;

    //Stores or updates the state
    set(key: string, value: RateLimitState): Promise<void>;

    //Deletes a single identifier
    delete(key: string): Promise<void>;

    //Clears the entire store.
    clear(): Promise<void>;
}