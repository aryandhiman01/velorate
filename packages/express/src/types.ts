import type {
    RateLimitAlgorithm,
    RateLimitStore
} from "@velorate/core";

import type { Request } from "express";

export interface RateLimitOptions {

    algorithm: RateLimitAlgorithm;

    store: RateLimitStore;

    keyGenerator?: (req: Request) => string;

}