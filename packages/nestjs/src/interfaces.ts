import type {

    RateLimitAlgorithm,

    RateLimitStore

} from "@velorate/core";

export interface RateLimitModuleOptions {

    algorithm: RateLimitAlgorithm;

    store: RateLimitStore;

}