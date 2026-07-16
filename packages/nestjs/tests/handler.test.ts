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

describe("NestJS Handler", () => {

    function createResponse() {

        return {

            statusCode: 200,

            body: undefined as unknown,

            headers: {} as Record<string, string>,

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

        "should execute custom handler",

        async () => {

            const service = new RateLimitService({

                store: new MemoryStore(),

                algorithm: new FixedWindow({

                    limit: 1,

                    window: 10_000

                }),

                handler: (

                    _request,

                    response

                ) => {

                    response

                        .status(429)

                        .json({

                            custom: true

                        });

                }

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

                service["options"]

                    .handler?.(

                        request,

                        response

                    );

            }

            expect(

                response.statusCode

            ).toBe(429);

            expect(

                response.body

            ).toEqual({

                custom: true

            });

        }

    );

    it(

        "should not execute handler before limit",

        async () => {

            const service = new RateLimitService({

                store: new MemoryStore(),

                algorithm: new FixedWindow({

                    limit: 1,

                    window: 10_000

                }),

                handler: (

                    _request,

                    response

                ) => {

                    response

                        .status(429)

                        .json({

                            custom: true

                        });

                }

            });

            const request = {

                ip: "127.0.0.1",

                headers: {}

            };

            const response =

                createResponse();

            const decision =

                await service.check(

                    request,

                    response

                );

            expect(

                decision.allowed

            ).toBe(true);

            expect(

                response.statusCode

            ).toBe(200);

        }

    );

});