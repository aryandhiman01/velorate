import type { RateLimitContext } from "../types/rate-limit-context.js";
import type { RateLimitDecision } from "../types/rate-limit-decision.js";

export interface RateLimitAlgorithm {

    execute(
        context: RateLimitContext
    ): RateLimitDecision;

}