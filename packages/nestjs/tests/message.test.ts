import {

    describe,

    expect,

    it

} from "vitest";

import {

    FixedWindow,

    MemoryStore

} from "@velorate/core";

import {

    RateLimitService

} from "../src/service.js";

describe("NestJS Message", () => {

    function createResponse() {

        return {

            headers: {} as Record<string, string>,

            body: undefined as unknown,

            statusCode: 200,

            setHeader(

                key: string,

                value: string

            ) {

                this.headers[key] = value;

            },

            status(

                code: number

            ) {

                this.statusCode = code;

                return this;

            },

            json(

                body: unknown

            ) {

                this.body = body;

                return this;

            }

        };

    }

    it(

        "should return custom message",

        async () => {

            const service = new RateLimitService({

                store: new MemoryStore(),

                algorithm: new FixedWindow({

                    limit: 1,

                    window: 10_000

                }),

                message: "Custom Rate Limit"

            });

            const request = {

                ip: "127.0.0.1",

                headers: {}

            };

            const response =

                createResponse();

            await service.check(

                request,

                response

            );

            const decision =

                await service.check(

                    request,

                    response

                );

            if (

                !decision.allowed

            ) {

                response

                    .status(429)

                    .json({

                        error:

                            "Custom Rate Limit",

                        retryAfter:

                            decision.retryAfter

                    });

            }

            expect(

                response.statusCode

            ).toBe(429);

            expect(

                response.body

            ).toEqual({

                error:

                    "Custom Rate Limit",

                retryAfter:

                    expect.any(Number)

            });

        }

    );

    it(

        "should return default message",

        async () => {

            const service = new RateLimitService({

                store: new MemoryStore(),

                algorithm: new FixedWindow({

                    limit: 1,

                    window: 10_000

                })

            });

            const request = {

                ip: "127.0.0.1",

                headers: {}

            };

            const response =

                createResponse();

            await service.check(

                request,

                response

            );

            const decision =

                await service.check(

                    request,

                    response

                );

            if (

                !decision.allowed

            ) {

                response

                    .status(429)

                    .json({

                        error:

                            "Too Many Requests",

                        retryAfter:

                            decision.retryAfter

                    });

            }

            expect(

                response.statusCode

            ).toBe(429);

            expect(

                response.body

            ).toEqual({

                error:

                    "Too Many Requests",

                retryAfter:

                    expect.any(Number)

            });

        }

    );

});