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

describe("Koa Headers", () => {

    function createApp() {

        const app = new Koa();

        app.use(

            rateLimit({

                store: new MemoryStore(),

                algorithm: new FixedWindow({

                    limit: 5,

                    window: 10_000

                })

            })

        );

        app.use(async (ctx) => {

            ctx.body = {

                ok: true

            };

        });

        return app;

    }

    it("should include rate limit headers", async () => {

        const app = createApp();

        const response = await request(

            app.callback()

        ).get("/");

        expect(

            response.headers["x-ratelimit-limit"]

        ).toBe("5");

        expect(

            response.headers["x-ratelimit-remaining"]

        ).toBe("4");

        expect(

            response.headers["retry-after"]

        ).toBeDefined();

    });

});