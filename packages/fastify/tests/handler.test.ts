import Fastify from "fastify";
import { describe, expect, it } from "vitest";

import {
    FixedWindow,
    MemoryStore
} from "@velorate/core";

import {
    rateLimit
} from "../src/index.js";

describe("Fastify Custom Handler", () => {

    async function createApp() {

        const app = Fastify();

        await app.register(rateLimit, {

            store: new MemoryStore(),

            algorithm: new FixedWindow({

                limit: 1,

                window: 10_000

            }),

            handler: async (_, reply) => {

                return reply
                    .status(429)
                    .send({

                        custom: true,

                        message: "Blocked by custom handler"

                    });

            }

        });

        app.get("/", async () => ({

            ok: true

        }));

        return app;

    }

    it("should execute custom handler", async () => {

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

            custom: true,

            message: "Blocked by custom handler"

        });

    });

    it("should not call custom handler before limit", async () => {

        const app = await createApp();

        const response = await app.inject({

            method: "GET",

            url: "/"

        });

        expect(response.statusCode).toBe(200);

    });

});