import { Hono } from "hono";
import { describe, expect, it } from "vitest";

import {
    FixedWindow,
    MemoryStore
} from "@velorate/core";

import {
    rateLimit
} from "../src/index.js";

describe("Hono Key Generator", () => {

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

                keyGenerator: (c) =>

                    c.req.header("x-user-id") ?? "anonymous"

            })

        );

        app.get("/", (c) => {

            return c.json({

                ok: true

            });

        });

        return app;

    }

    it("should use custom key", async () => {

        const app = createApp();

        const first = await app.request("/", {

            headers: {

                "x-user-id": "aryan"

            }

        });

        expect(first.status).toBe(200);

        const second = await app.request("/", {

            headers: {

                "x-user-id": "aryan"

            }

        });

        expect(second.status).toBe(429);

    });

    it("should treat different keys independently", async () => {

        const app = createApp();

        const first = await app.request("/", {

            headers: {

                "x-user-id": "user-1"

            }

        });

        const second = await app.request("/", {

            headers: {

                "x-user-id": "user-2"

            }

        });

        expect(first.status).toBe(200);

        expect(second.status).toBe(200);

    });

});