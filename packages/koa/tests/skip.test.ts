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

describe("Koa Skip", () => {

    function createApp() {

        const app = new Koa();

        app.use(

            rateLimit({

                store: new MemoryStore(),

                algorithm: new FixedWindow({

                    limit: 1,

                    window: 10_000

                }),

                skip: () => true

            })

        );

        app.use(async (ctx) => {

            ctx.body = {

                ok: true

            };

        });

        return app;

    }

    it("should skip rate limiting", async () => {

        const app = createApp();

        for (let i = 0; i < 10; i++) {

            const response = await request(

                app.callback()

            ).get("/");

            expect(response.status).toBe(200);

        }

    });

});