import {

    describe,

    expect,

    it

} from "vitest";

import {

    ExecutionContext

} from "@nestjs/common";

import {

    FixedWindow,

    MemoryStore

} from "@velorate/core";

import {

    RateLimitGuard

} from "../src/guard.js";

import {

    RateLimitService

} from "../src/service.js";

describe("NestJS Headers", () => {

    function createGuard() {

        const service = new RateLimitService({

            store: new MemoryStore(),

            algorithm: new FixedWindow({

                limit: 5,

                window: 10_000

            })

        });

        const reflector = {

            getAllAndOverride() {

                return undefined;

            }

        };

        return new RateLimitGuard(

            reflector as any,

            service

        );

    }

    function createContext() {

        const request = {

            ip: "127.0.0.1",

            headers: {}

        };

        const headers: Record<string, string> = {};

        const response = {

            setHeader(

                key: string,

                value: string

            ) {

                headers[key] = value;

            },

            status() {

                return this;

            },

            json() {

                return this;

            }

        };

        const context = {

            switchToHttp() {

                return {

                    getRequest() {

                        return request;

                    },

                    getResponse() {

                        return response;

                    }

                };

            },

            getHandler() {

                return (() => {}) as any;

            },

            getClass() {

                return class {};

            }

        } as ExecutionContext;

        return {

            context,

            headers

        };

    }

    it(

        "should set rate limit headers",

        async () => {

            const guard =

                createGuard();

            const {

                context,

                headers

            } = createContext();

            await guard.canActivate(

                context

            );

            expect(

                headers[

                    "X-RateLimit-Limit"

                ]

            ).toBe("5");

            expect(

                headers[

                    "X-RateLimit-Remaining"

                ]

            ).toBeDefined();

            expect(

                headers[

                    "Retry-After"

                ]

            ).toBeDefined();

        }

    );

});