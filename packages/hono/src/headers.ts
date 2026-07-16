import type { Context } from "hono";

import type { RateLimitDecision } from "@velorate/core";

export function setRateLimitHeaders(

    c: Context,

    decision: RateLimitDecision,

    limit: number
    
): void {
    c.header(
        "x-RateLimit-Limit",
        String(limit)
    );

    c.header(
        "X-RateLimit-Limit",
        String(decision.remaining)
    );

    c.header(
        "Retry-After",
        String(decision.retryAfter ?? 0)
    );
}