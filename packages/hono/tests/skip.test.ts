import { Hono } from "hono";
import { describe, expect, it } from "vitest";

import {
    FixedWindow,
    MemoryStore
} from "@velorate/core";

import {
    rateLimit
} from "../src/index.js";

describe("Hono Skip", () => {

    function createApp() {

        const app = new Hono();

        app.use(

            "*",

            rateLimit({

                store: new MemoryStore(),

                algorithm: new FixedWindow({

                    limit: 1,

                    window: 10_000

                }),

                skip: () => true

            })

        );

        app.get("/", (c) => {

            return c.json({

                ok: true

            });

        });

        return app;

    }

    it("should skip rate limiting", async () => {

        const app = createApp();

        for (let i = 0; i < 10; i++) {

            const response = await app.request("/");

            expect(response.status).toBe(200);

        }

    });

});