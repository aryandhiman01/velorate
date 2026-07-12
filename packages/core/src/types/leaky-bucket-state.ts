import type { RateLimitState } from "./rate-limit-state.js";

export interface LeakyBucketState extends RateLimitState {

    queueSize: number;

    lastLeak: number;

}