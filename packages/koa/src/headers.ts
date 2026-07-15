import type Koa from "koa";

import type {
    RateLimitDecision
} from "@velorate/core";

export function setRateLimitHeaders(

    ctx: Koa.Context,

    decision: RateLimitDecision,

    limit: number
    
): void {
    ctx.set(
        "X-RateLimit-Limit",
        String(limit)
    );

    ctx.set(
        "X-RateLimit-Remaining",
        String(decision.remaining)
    );

    ctx.set(
        "Retry-After",
        String(decision.retryAfter ?? 0)
    );
}