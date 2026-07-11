import type { RateLimitDecision } from "../types/rate-limit-decision.js";
import type { RateLimitState } from "../types/rate-limit-state.js";

export interface RateLimitAlgorithm {

    execute(
        state: RateLimitState | null
    ): RateLimitDecision;

}