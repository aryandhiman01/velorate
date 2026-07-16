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

describe("NestJS Key Generator", () => {

    function createResponse() {

        return {

            headers: {} as Record<string, string>,

            setHeader() {},

            status() {

                return this;

            },

            json() {

                return this;

            }

        };

    }

    it(

        "should rate limit using custom key",

        async () => {

            const service = new RateLimitService({

                store: new MemoryStore(),

                algorithm: new FixedWindow({

                    limit: 2,

                    window: 10_000

                }),

                keyGenerator: (

                    request

                ) =>

                    String(

                        request.headers?.user

                    )

            });

            const request = {

                ip: "127.0.0.1",

                headers: {

                    user: "aryan"

                }

            };

            const response =

                createResponse();

            expect(

                (

                    await service.check(

                        request,

                        response

                    )

                ).allowed

            ).toBe(true);

            expect(

                (

                    await service.check(

                        request,

                        response

                    )

                ).allowed

            ).toBe(true);

            expect(

                (

                    await service.check(

                        request,

                        response

                    )

                ).allowed

            ).toBe(false);

        }

    );

    it(

        "should use different keys independently",

        async () => {

            const service = new RateLimitService({

                store: new MemoryStore(),

                algorithm: new FixedWindow({

                    limit: 2,

                    window: 10_000

                }),

                keyGenerator: (

                    request

                ) =>

                    String(

                        request.headers?.user

                    )

            });

            const response =

                createResponse();

            expect(

                (

                    await service.check(

                        {

                            ip: "127.0.0.1",

                            headers: {

                                user: "user1"

                            }

                        },

                        response

                    )

                ).allowed

            ).toBe(true);

            expect(

                (

                    await service.check(

                        {

                            ip: "127.0.0.1",

                            headers: {

                                user: "user2"

                            }

                        },

                        response

                    )

                ).allowed

            ).toBe(true);

        }

    );

});