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

describe("Koa Custom Handler", () => {

    function createApp() {

        const app = new Koa();

        app.use(

            rateLimit({

                store: new MemoryStore(),

                algorithm: new FixedWindow({

                    limit: 1,

                    window: 10_000

                }),

                handler: (ctx) => {

                    ctx.status = 429;

                    ctx.body = {

                        custom: true,

                        message: "Blocked by custom handler"

                    };

                }

            })

        );

        app.use(async (ctx) => {

            ctx.body = {

                ok: true

            };

        });

        return app;

    }

    it("should execute custom handler", async () => {

        const app = createApp();

        await request(app.callback()).get("/");

        const response = await request(app.callback()).get("/");

        expect(response.status).toBe(429);

        expect(response.body).toEqual({

            custom: true,

            message: "Blocked by custom handler"

        });

    });

    it("should not execute handler before limit", async () => {

        const app = createApp();

        const response = await request(app.callback()).get("/");

        expect(response.status).toBe(200);

        expect(response.body).toEqual({

            ok: true

        });

    });

});