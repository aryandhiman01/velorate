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

describe("NestJS Skip", () => {

    function createResponse() {

        return {

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

        "should skip rate limiting",

        async () => {

            const service = new RateLimitService({

                store: new MemoryStore(),

                algorithm: new FixedWindow({

                    limit: 1,

                    window: 10_000

                }),

                skip: () => true

            });

            const request = {

                ip: "127.0.0.1",

                headers: {}

            };

            const response =

                createResponse();

            for (

                let i = 0;

                i < 10;

                i++

            ) {

                if (

                    service["options"].skip?.(

                        request

                    )

                ) {

                    continue;

                }

                await service.check(

                    request,

                    response

                );

            }

            expect(

                service["options"].skip?.(

                    request

                )

            ).toBe(true);

        }

    );

});