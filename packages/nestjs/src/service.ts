import {

    Injectable,

    Inject

} from "@nestjs/common";

import {

    RateLimiter,

    type RateLimitDecision,

    type RateLimitAlgorithm

} from "@velorate/core";

import {

    RATE_LIMIT_OPTIONS

} from "./constants.js";

import type {

    HttpRequest,

    HttpResponse,

    RateLimitDecoratorOptions,

    RateLimitModuleOptions

} from "./interfaces.js";

@Injectable()
export class RateLimitService {

    private readonly limiter: RateLimiter;

    constructor(

        @Inject(RATE_LIMIT_OPTIONS)

        private readonly options: RateLimitModuleOptions

    ) {

        this.limiter = new RateLimiter(

            options.store,

            options.algorithm

        );

    }

    private createLimiter(

        override?: RateLimitDecoratorOptions

    ): RateLimiter {

        if (!override) {

            return this.limiter;

        }

        const Algorithm =

            this.options.algorithm.constructor as new (

                config: {

                    limit: number;

                    window: number;

                }

            ) => RateLimitAlgorithm;

        const config =

            (this.options.algorithm as any)

                .config;

        return new RateLimiter(

            this.options.store,

            new Algorithm({

                limit:

                    override.limit

                    ??

                    config.limit,

                window:

                    override.window

                    ??

                    config.window

            })

        );

    }

    async check(

        request: HttpRequest,

        response: HttpResponse,

        override?: RateLimitDecoratorOptions

    ): Promise<RateLimitDecision> {

        const limiter =

            this.createLimiter(

                override

            );

        const key =

            this.options.keyGenerator?.(

                request

            )

            ??

            request.ip

            ??

            request.headers?.[

                "x-forwarded-for"

            ]

            ??

            "anonymous";

        const decision =

            await limiter.check(

                String(key)

            );

        const config =

            override

            ??

            (this.options.algorithm as any)

                .config;

        response.setHeader(

            "X-RateLimit-Limit",

            String(

                config.limit

            )

        );

        response.setHeader(

            "X-RateLimit-Remaining",

            String(

                decision.remaining

            )

        );

        response.setHeader(

            "Retry-After",

            String(

                decision.retryAfter

            )

        );

        return decision;

    }

}