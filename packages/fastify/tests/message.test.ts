import Fastify from "fastify";
import { describe, expect, it } from "vitest";

import {
    FixedWindow,
    MemoryStore
} from "@velorate/core";

import {
    rateLimit
} from "../src/index.js";

describe("Fastify Message", () => {

    async function createApp() {

        const app = Fastify();

        await app.register(rateLimit, {

            store: new MemoryStore(),

            algorithm: new FixedWindow({

                limit: 1,

                window: 10_000

            }),

            message: "Custom Rate Limit Message"

        });

        app.get("/", async () => ({

            ok: true

        }));

        return app;

    }

    it("should return custom message", async () => {

        const app = await createApp();

        await app.inject({

            method: "GET",

            url: "/"

        });

        const response = await app.inject({

            method: "GET",

            url: "/"

        });

        expect(response.statusCode).toBe(429);

        expect(response.json()).toEqual({

            error: "Custom Rate Limit Message",

            retryAfter: expect.any(Number)

        });

    });

    it("should return default message if custom message is not provided", async () => {

        const app = Fastify();

        await app.register(rateLimit, {

            store: new MemoryStore(),

            algorithm: new FixedWindow({

                limit: 1,

                window: 10_000

            })

        });

        app.get("/", async () => ({

            ok: true

        }));

        await app.inject({

            method: "GET",

            url: "/"

        });

        const response = await app.inject({

            method: "GET",

            url: "/"

        });

        expect(response.statusCode).toBe(429);

        expect(response.json()).toEqual({

            error: "Too Many Requests",

            retryAfter: expect.any(Number)

        });

    });

});