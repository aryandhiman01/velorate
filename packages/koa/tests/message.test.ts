import Koa from "koa";
import request from "supertest";
import { describe, expect, it } from "vitest";

import {
    FixedWindow,
    MemoryStore
} from "@velorate/core";

import {
    rateLimit
} from "../src/index.js";

describe("Koa Message", () => {

    function createApp(customMessage?: string) {

        const app = new Koa();

        app.use(

            rateLimit({

                store: new MemoryStore(),

                algorithm: new FixedWindow({

                    limit: 1,

                    window: 10_000

                }),

                message: customMessage

            })

        );

        app.use(async (ctx) => {

            ctx.body = {

                ok: true

            };

        });

        return app;

    }

    it("should return custom message", async () => {

        const app = createApp(

            "Custom Rate Limit Message"

        );

        await request(app.callback()).get("/");

        const response = await request(app.callback()).get("/");

        expect(response.status).toBe(429);

        expect(response.body).toEqual({

            error: "Custom Rate Limit Message",

            retryAfter: expect.any(Number)

        });

    });

    it("should return default message", async () => {

        const app = createApp();

        await request(app.callback()).get("/");

        const response = await request(app.callback()).get("/");

        expect(response.status).toBe(429);

        expect(response.body).toEqual({

            error: "Too Many Requests",

            retryAfter: expect.any(Number)

        });

    });

});