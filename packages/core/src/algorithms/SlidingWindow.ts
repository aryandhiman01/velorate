import type { RateLimitAlgorithm } from "../contracts/rate-limit-algorithm.js";
import type { RateLimitContext } from "../types/rate-limit-context.js";
import type { RateLimitDecision } from "../types/rate-limit-decision.js";

export class SlidingWindow implements RateLimitAlgorithm {

    execute(context: RateLimitContext): RateLimitDecision {
        throw new Error("Sliding Window Algorithm not implemented yet");
    }
}