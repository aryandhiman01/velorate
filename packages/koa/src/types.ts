import type Koa from "koa";

import type {

    RateLimitAlgorithm,

    RateLimitStore

} from "@velorate/core";

export interface RateLimitOptions {

    algorithm: RateLimitAlgorithm;

    store: RateLimitStore;

    keyGenerator?: (

        ctx: Koa.Context

    ) => string;

    skip?: (

        ctx: Koa.Context

    ) => boolean;

    message?: string;

    handler?: (

        ctx: Koa.Context

    ) => Promise<void> | void;

}