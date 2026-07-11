import type { RateLimitConfig } from "./rate-limit-config.js";
import type { RateLimitState } from "./rate-limit-state.js";

export interface RateLimitContext {

    state: RateLimitState | null;

    config: RateLimitConfig;

    now: number;

}