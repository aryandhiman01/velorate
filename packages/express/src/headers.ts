import type { Response } from "express";

import type { RateLimitDecision } from "@velorate/core";

export function setRateLimitHeaders(
    res: Response,
    decision: RateLimitDecision,
    limit: number
): void {

    const reset = Math.ceil(
        (decision.retryAfter ?? 0) / 1000
    );

    // Legacy headers
    res.setHeader(
        "X-RateLimit-Limit",
        limit
    );

    res.setHeader(
        "X-RateLimit-Remaining",
        decision.remaining
    );

    res.setHeader(
        "X-RateLimit-Reset",
        reset
    );

    // Standard headers
    res.setHeader(
        "RateLimit-Limit",
        limit
    );

    res.setHeader(
        "RateLimit-Remaining",
        decision.remaining
    );

    res.setHeader(
        "RateLimit-Reset",
        reset
    );

    res.setHeader(
        "Retry-After",
        reset
    );

}