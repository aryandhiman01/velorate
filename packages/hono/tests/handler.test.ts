import { Hono } from "hono";
import { describe, expect, it } from "vitest";

import {
    FixedWindow,
    MemoryStore
} from "@velorate/core";

import {
    rateLimit
} from "../src/index.js";

describe("Hono Custom Handler", () => {

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

                handler: (c) => {

                    return c.json(

                        {

                            custom: true,

                            message: "Blocked by custom handler"

                        },

                        429

                    );

                }

            })

        );

        app.get("/", (c) => {

            return c.json({

                ok: true

            });

        });

        return app;

    }

    it("should execute custom handler", async () => {

        const app = createApp();

        await app.request("/");

        const response = await app.request("/");

        expect(response.status).toBe(429);

        expect(

            await response.json()

        ).toEqual({

            custom: true,

            message: "Blocked by custom handler"

        });

    });

    it("should not execute custom handler before limit", async () => {

        const app = createApp();

        const response = await app.request("/");

        expect(response.status).toBe(200);

        expect(

            await response.json()

        ).toEqual({

            ok: true

        });

    });

});