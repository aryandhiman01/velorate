import type { FastifyReply } from "fastify";

import type { RateLimitDecision } from "@velorate/core";

export function setRateLimitHeaders(

    reply: FastifyReply,

    decision: RateLimitDecision,

    limit: number

): void {

    reply.header(

        "X-RateLimit-Limit",

        limit

    );

    reply.header(

        "X-RateLimit-Remaining",

        decision.remaining

    );

    reply.header(

        "Retry-After",

        decision.retryAfter ?? 0

    );

}