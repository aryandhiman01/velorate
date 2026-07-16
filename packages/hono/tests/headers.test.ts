import { Hono } from "hono";
import { describe, expect, it } from "vitest";

import {
    FixedWindow,
    MemoryStore
} from "@velorate/core";

import {
    rateLimit
} from "../src/index.js";

describe("Hono Headers", () => {

    function createApp() {

        const app = new Hono();

        app.use(

            "*",

            rateLimit({

                store: new MemoryStore(),

                algorithm: new FixedWindow({

                    limit: 5,

                    window: 10_000

                })

            })

        );

        app.get("/", (c) => {

            return c.json({

                ok: true

            });

        });

        return app;

    }

    it("should include rate limit headers", async () => {

        const app = createApp();

        const response = await app.request("/");

        expect(

            response.headers.get(

                "X-RateLimit-Limit"

            )

        ).toBe("5");

        expect(

            response.headers.get(

                "X-RateLimit-Remaining"

            )

        ).toBe("4");

        expect(

            response.headers.get(

                "Retry-After"

            )

        ).toBeDefined();

    });

});