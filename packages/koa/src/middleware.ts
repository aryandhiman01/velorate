import type Koa from "koa";

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

): Koa.Middleware {

    const limiter = new RateLimiter(

        options.store,

        options.algorithm

    );

    return async (

        ctx,

        next

    ) => {

        if (

            options.skip?.(

                ctx

            )

        ) {

            return next();

        }

        const key =

            options.keyGenerator?.(

                ctx

            )

            ??

            ctx.ip

            ??

            "anonymous";

        const decision =

            await limiter.check(

                key

            );

        setRateLimitHeaders(

            ctx,

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

                    ctx

                );

            }

            ctx.status = 429;

            ctx.body = {

                error:

                    options.message

                    ??

                    "Too Many Requests",

                retryAfter:

                    decision.retryAfter

            };

            return;

        }

        await next();

    };

}