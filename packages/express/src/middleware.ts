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

export function rateLimit(
    options: RateLimitOptions
): RequestHandler {

    const limiter = new RateLimiter(

        options.store,

        options.algorithm,


    );

    return async (

        req: Request,

        res: Response,

        next: NextFunction

    ) => {

        try {

            const key =

                options.keyGenerator?.(req)

                ??

                req.ip

                ??

                "anonymous";

            const decision = await limiter.check(key);

            res.setHeader(

                "X-RateLimit-Remaining",

                decision.remaining

            );

            res.setHeader(

                "Retry-After",

                decision.retryAfter ?? 0

            );

            if (!decision.allowed) {

                return res.status(429).json({

                    error: "Too Many Requests",

                    retryAfter: decision.retryAfter

                });

            }

            next();

        }

        catch (error) {

            next(error);

        }

    };

}