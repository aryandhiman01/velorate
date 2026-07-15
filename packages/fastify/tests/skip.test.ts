import fastify from "fastify";
import { describe, expect, it } from "vitest";

import { MemoryStore, FixedWindow } from "@velorate/core";
import { rateLimit } from "../src/index.js";

describe("Fastify skip", () => {
    async function createApp() {
        const app = fastify();
        
        await app.register(rateLimit, {
            store: new MemoryStore(),
            algorithm: new FixedWindow({
                limit: 5,
                window: 10000
            }),
            skip: () => true
        });

        app.get("/", async () => ({
            ok: true
        }));

        return app;
    }

    it("should skip rate limiting", async () => {
        const app = await createApp();
        
        for(let i = 0; i < 10; i++) {
            const response = await app.inject({
                method: "GET",
                url: "/"
            });
            expect(response.statusCode).toBe(200);
        }
    })
})