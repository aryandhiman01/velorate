import type {
    RateLimitAlgorithm,
    RateLimitStore
} from "@velorate/core";

import type {
    NextFunction,
    Request,
    Response
} from "express";

export interface RateLimitOptions {

    /**
     * Rate limiting algorithm.
     */
    algorithm: RateLimitAlgorithm;

    /**
     * Storage implementation.
     */
    store: RateLimitStore;

    /**
     * Generates a unique identifier.
     * Default: req.ip
     */
    keyGenerator?: (
        req: Request
    ) => string;

    /**
     * Skip rate limiting.
     */
    skip?: (
        req: Request
    ) => boolean;

    /**
     * Custom error message.
     */
    message?: string;

    /**
     * Custom blocked handler.
     */
    handler?: (
        req: Request,
        res: Response,
        next: NextFunction
    ) => void;

}