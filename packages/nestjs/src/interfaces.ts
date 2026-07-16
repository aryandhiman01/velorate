import type {

    RateLimitAlgorithm,

    RateLimitStore

} from "@velorate/core";

export interface HttpRequest {

    ip?: string;

    headers?: Record<

        string,

        string | string[] | undefined

    >;

    [key: string]: unknown;

}

export interface HttpResponse {

    setHeader(

        name: string,

        value: string

    ): void;

    status(

        code: number

    ): HttpResponse;

    json(

        body: unknown

    ): void;

    [key: string]: unknown;

}

export interface RateLimitModuleOptions {

    algorithm: RateLimitAlgorithm;

    store: RateLimitStore;

    keyGenerator?: (

        request: HttpRequest

    ) => string;

    skip?: (

        request: HttpRequest

    ) => boolean;

    message?: string;

    handler?: (

        request: HttpRequest,

        response: HttpResponse

    ) => void;

}

export interface RateLimitDecoratorOptions {

    limit?: number;

    window?: number;

}