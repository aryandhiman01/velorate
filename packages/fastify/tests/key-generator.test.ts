import Fastify from "fastify";
import { describe, expect, it } from "vitest";

import {
    FixedWindow,
    MemoryStore
} from "@velorate/core";

import {
    rateLimit
} from "../src/index.js";

describe("Fastify Key Generator", () => {

    async function createApp() {

        const app = Fastify();

        await app.register(rateLimit, {

            store: new MemoryStore(),

            algorithm: new FixedWindow({

                limit: 1,

                window: 10_000

            }),

            keyGenerator: (request) => {

                return request.headers["x-user-id"] as string;

            }

        });

        app.get("/", async () => ({

            ok: true

        }));

        return app;

    }

    it("should rate limit using custom key", async () => {

        const app = await createApp();

        const first = await app.inject({

            method: "GET",

            url: "/",

            headers: {

                "x-user-id": "aryan"

            }

        });

        expect(first.statusCode).toBe(200);

        const second = await app.inject({

            method: "GET",

            url: "/",

            headers: {

                "x-user-id": "aryan"

            }

        });

        expect(second.statusCode).toBe(429);

    });

    it("should use different keys independently", async () => {

        const app = await createApp();

        const first = await app.inject({

            method: "GET",

            url: "/",

            headers: {

                "x-user-id": "user-1"

            }

        });

        const second = await app.inject({

            method: "GET",

            url: "/",

            headers: {

                "x-user-id": "user-2"

            }

        });

        expect(first.statusCode).toBe(200);

        expect(second.statusCode).toBe(200);

    });

});