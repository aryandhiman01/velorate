import {

    Injectable,

    NestMiddleware

} from "@nestjs/common";

import type {

    NextFunction,

    Request,

    Response

} from "express";

import {

    RateLimiter

} from "@velorate/core";

import type {

    RateLimitModuleOptions

} from "./interfaces.js";

@Injectable()

export class RateLimitMiddleware

    implements NestMiddleware {

    private readonly limiter: RateLimiter;

    constructor(

        private readonly options: RateLimitModuleOptions

    ) {

        this.limiter = new RateLimiter(

            options.store,

            options.algorithm

        );

    }

    async use(

        req: Request,

        res: Response,

        next: NextFunction

    ) {

        const key =

            req.ip ??

            "anonymous";

        const decision =

            await this.limiter.check(

                key

            );

        res.setHeader(

            "X-RateLimit-Limit",

            String(

                (this.options.algorithm as any)

                    .config?.limit ?? 0

            )

        );

        res.setHeader(

            "X-RateLimit-Remaining",

            String(

                decision.remaining

            )

        );

        res.setHeader(

            "Retry-After",

            String(

                decision.retryAfter

            )

        );

        if (

            !decision.allowed

        ) {

            res.status(429).json({

                error: "Too Many Requests",

                retryAfter:

                    decision.retryAfter

            });

            return;

        }

        next();

    }

}