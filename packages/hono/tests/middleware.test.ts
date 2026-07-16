import { Hono } from "hono";
import { describe, expect, it } from "vitest";

import {
    FixedWindow,
    MemoryStore
} from "@velorate/core";

import {
    rateLimit
} from "../src/index.js";

describe("Hono Middleware", () => {

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

    it("should allow requests under limit", async () => {

        const app = createApp();

        const response = await app.request("/");

        expect(response.status).toBe(200);

    });

    it("should block requests after limit", async () => {

        const app = createApp();

        for (let i = 0; i < 5; i++) {

            await app.request("/");

        }

        const response = await app.request("/");

        expect(response.status).toBe(429);

    });

});