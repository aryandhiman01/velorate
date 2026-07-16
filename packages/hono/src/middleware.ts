import type {

    Context,

    MiddlewareHandler

} from "hono";

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

): MiddlewareHandler {

    const limiter = new RateLimiter(

        options.store,

        options.algorithm

    );

    return async (

        c: Context,

        next

    ) => {

        if (

            options.skip?.(

                c

            )

        ) {

            return next();

        }

        const key =

            options.keyGenerator?.(

                c

            )

            ??

            c.req.header(

                "x-forwarded-for"

            )

            ??

            "anonymous";

        const decision =

            await limiter.check(

                key

            );

        setRateLimitHeaders(

            c,

            decision,

            (options.algorithm as any)

                .config

                ?.limit ?? 0

        );

        if (

            !decision.allowed

        ) {

            if (

                options.handler

            ) {

                return options.handler(

                    c

                );

            }

            return c.json(

                {

                    error:

                        options.message

                        ??

                        "Too Many Requests",

                    retryAfter:

                        decision.retryAfter

                },

                429

            );

        }

        await next();

    };

}