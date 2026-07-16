import type { Context } from "hono";

import type {

    RateLimitAlgorithm,

    RateLimitStore

} from "@velorate/core";

export interface RateLimitOptions {

    algorithm: RateLimitAlgorithm;

    store: RateLimitStore;

    keyGenerator?: (

        c: Context

    ) => string;

    skip?: (

        c: Context

    ) => boolean;

    message?: string;

    handler?: (

        c: Context

    ) => Response | Promise<Response>;

}