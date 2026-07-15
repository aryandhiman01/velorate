import type {

    FastifyReply,

    FastifyRequest

} from "fastify";

import type {

    RateLimitAlgorithm,

    RateLimitStore

} from "@velorate/core";

export interface RateLimitOptions {

    algorithm: RateLimitAlgorithm;

    store: RateLimitStore;

    keyGenerator?: (

        request: FastifyRequest

    ) => string;

    skip?: (

        request: FastifyRequest

    ) => boolean;

    message?: string;

    handler?: (

        request: FastifyRequest,

        reply: FastifyReply

    ) => unknown;

}