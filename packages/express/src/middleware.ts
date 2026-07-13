import type {
    NextFunction,
    Request,
    RequestHandler,
    Response
} from "express";

import {
    RateLimiter
} from "@velorate/core";

import type {
    RateLimitOptions
} from "./types.js";

import {
    setRateLimitHeaders
} from "./headers.js";

export function rateLimit(
    options: RateLimitOptions
): RequestHandler {

    const limiter = new RateLimiter(
        options.store,
        options.algorithm
    );

    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        try {

            // Skip middleware
            if (
                options.skip?.(req)
            ) {

                return next();

            }

            // Resolve identifier
            const key =
                options.keyGenerator?.(req)
                ??
                req.ip
                ??
                "anonymous";

            // Execute rate limiter
            const decision =
                await limiter.check(key);

            // Set all RateLimit headers
            setRateLimitHeaders(

                res,

                decision,

                (options.algorithm as any).config.limit

            );

            // Request blocked
            if (!decision.allowed) {

                // Custom handler
                if (
                    options.handler
                ) {

                    return options.handler(
                        req,
                        res,
                        next
                    );

                }

                return res
                    .status(429)
                    .json({

                        error:
                            options.message
                            ??
                            "Too Many Requests",

                        retryAfter:
                            decision.retryAfter

                    });

            }

            // Continue request
            next();

        }

        catch (error) {

            next(error);

        }

    };

}