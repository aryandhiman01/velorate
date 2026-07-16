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

import {

    RATE_LIMIT_OPTIONS

} from "../src/constants.js";

describe("RateLimitGuard", () => {

    function createGuard() {

        const options = {

            store: new MemoryStore(),

            algorithm: new FixedWindow({

                limit: 5,

                window: 10_000

            })

        };

        const service = new RateLimitService(

            options

        );

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

    function createContext(): ExecutionContext {

        const request = {

            ip: "127.0.0.1",

            headers: {}

        };

        const response = {

            headers: {} as Record<string, string>,

            setHeader(

                key: string,

                value: string

            ) {

                this.headers[key] = value;

            },

            status() {

                return this;

            },

            json() {

                return this;

            }

        };

        return {

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

    }

    it(

        "should allow requests under limit",

        async () => {

            const guard =

                createGuard();

            const context =

                createContext();

            expect(

                await guard.canActivate(

                    context

                )

            ).toBe(true);

        }

    );

    it(

        "should block requests over limit",

        async () => {

            const guard =

                createGuard();

            const context =

                createContext();

            for (

                let i = 0;

                i < 5;

                i++

            ) {

                await guard.canActivate(

                    context

                );

            }

            expect(

                await guard.canActivate(

                    context

                )

            ).toBe(false);

        }

    );

});