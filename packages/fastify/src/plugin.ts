import fp from "fastify-plugin";

import type {
    FastifyPluginCallback,
    FastifyReply,
    FastifyRequest
} from "fastify";

import {
    RateLimiter
} from "@velorate/core";

import type {
    RateLimitOptions
} from "./types.js";

import {
    setRateLimitHeaders
} from "./headers.js";

const plugin: FastifyPluginCallback<RateLimitOptions> = (

    fastify,

    options,

    done

) => {

    const limiter = new RateLimiter(

        options.store,

        options.algorithm

    );

    fastify.addHook(

        "preHandler",

        async (

            request: FastifyRequest,

            reply: FastifyReply

        ) => {

            if (

                options.skip?.(request)

            ) {

                return;

            }

            const key =

                options.keyGenerator?.(

                    request

                )

                ??

                request.ip

                ??

                "anonymous";

            const decision =

                await limiter.check(

                    key

                );

            setRateLimitHeaders(

                reply,

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

                        request,

                        reply

                    );

                }

                return reply
                    .status(429)
                    .send({

                        error:

                            options.message

                            ??

                            "Too Many Requests",

                        retryAfter:

                            decision.retryAfter

                    });

            }

        }

    );

    done();

};

export default fp(

    plugin,

    {

        name: "velorate"

    }

);