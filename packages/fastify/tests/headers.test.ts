import fastify from "fastify";
import { describe, expect, it } from "vitest";

import { FixedWindow, MemoryStore } from "@velorate/core";
import { rateLimit } from "../src/index.js";

describe("Fastify Headers", () => {
    async function createApp() {
        const app = fastify();

        await app.register(rateLimit, {
            store: new MemoryStore(),

            algorithm: new FixedWindow({ 
                limit: 5,
                window: 10000
            })
        });

        app.get("/", async() => ({
            ok: true
        }));

        return app;
    }

     it("should include rate limit headers", async () => {

        const app = await createApp();

        const response = await app.inject({

            method: "GET",

            url: "/"

        });

        expect(response.headers["x-ratelimit-limit"]).toBe("5");

        expect(response.headers["x-ratelimit-remaining"]).toBe("4");

        expect(response.headers["retry-after"]).toBeDefined();

    });
});