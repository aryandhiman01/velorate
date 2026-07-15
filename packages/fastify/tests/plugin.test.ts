import Fastify from "fastify";

import { describe, expect, it } from "vitest";

import {
    FixedWindow,
    MemoryStore
} from "@velorate/core";

import {
    rateLimit
} from "../src/index.js";

describe("Fastify Plugin", () => {

    async function createApp() {

        const app = Fastify();

        await app.register(rateLimit, {

            store: new MemoryStore(),

            algorithm: new FixedWindow({

                limit: 5,

                window: 10_000

            })

        });

        app.get("/", async () => {

            return {

                ok: true

            };

        });

        return app;

    }

    it("should allow requests under limit", async () => {

        const app = await createApp();

        const response = await app.inject({

            method: "GET",

            url: "/"

        });

        expect(response.statusCode).toBe(200);

    });

    it("should block requests after limit", async () => {

        const app = await createApp();

        for (let i = 0; i < 5; i++) {

            await app.inject({

                method: "GET",

                url: "/"

            });

        }

        const response = await app.inject({

            method: "GET",

            url: "/"

        });

        expect(response.statusCode).toBe(429);

    });

});