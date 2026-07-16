import { Hono } from "hono";
import { describe, expect, it } from "vitest";

import {
    FixedWindow,
    MemoryStore
} from "@velorate/core";

import {
    rateLimit
} from "../src/index.js";

describe("Hono Message", () => {

    function createApp(customMessage?: string) {

        const app = new Hono();

        app.use(

            "*",

            rateLimit({

                store: new MemoryStore(),

                algorithm: new FixedWindow({

                    limit: 1,

                    window: 10_000

                }),

                message: customMessage

            })

        );

        app.get("/", (c) => {

            return c.json({

                ok: true

            });

        });

        return app;

    }

    it("should return custom message", async () => {

        const app = createApp(

            "Custom Rate Limit Message"

        );

        await app.request("/");

        const response = await app.request("/");

        expect(response.status).toBe(429);

        expect(

            await response.json()

        ).toEqual({

            error: "Custom Rate Limit Message",

            retryAfter: expect.any(Number)

        });

    });

    it("should return default message", async () => {

        const app = createApp();

        await app.request("/");

        const response = await app.request("/");

        expect(response.status).toBe(429);

        expect(

            await response.json()

        ).toEqual({

            error: "Too Many Requests",

            retryAfter: expect.any(Number)

        });

    });

});