import {

    CanActivate,

    ExecutionContext,

    Injectable

} from "@nestjs/common";

import {

    Reflector

} from "@nestjs/core";

import {

    RATE_LIMIT_METADATA

} from "./metadata.js";

import {

    RateLimitService

} from "./service.js";

import type {

    HttpRequest,

    HttpResponse,

    RateLimitDecoratorOptions

} from "./interfaces.js";

@Injectable()
export class RateLimitGuard

    implements CanActivate {

    constructor(

        private readonly reflector: Reflector,

        private readonly service: RateLimitService

    ) {}

    async canActivate(

        context: ExecutionContext

    ): Promise<boolean> {

        const request =

            context

                .switchToHttp()

                .getRequest<HttpRequest>();

        const response =

            context

                .switchToHttp()

                .getResponse<HttpResponse>();

        const override =

            this.reflector.getAllAndOverride<

                RateLimitDecoratorOptions

            >(

                RATE_LIMIT_METADATA,

                [

                    context.getHandler(),

                    context.getClass()

                ]

            );

        const decision =

            await this.service.check(

                request,

                response,

                override

            );

        if (

            decision.allowed

        ) {

            return true;

        }

        response

            .status(429)

            .json({

                error: "Too Many Requests",

                retryAfter:

                    decision.retryAfter

            });

        return false;

    }

}