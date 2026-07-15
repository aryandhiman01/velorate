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

describe("Koa Key Generator", () => {

    function createApp() {

        const app = new Koa();

        app.use(

            rateLimit({

                store: new MemoryStore(),

                algorithm: new FixedWindow({

                    limit: 1,

                    window: 10_000

                }),

                keyGenerator: (ctx) =>

                    ctx.get("x-user-id")

            })

        );

        app.use(async (ctx) => {

            ctx.body = {

                ok: true

            };

        });

        return app;

    }

    it("should use custom key", async () => {

        const app = createApp();

        const first = await request(

            app.callback()

        )

            .get("/")

            .set(

                "x-user-id",

                "aryan"

            );

        expect(first.status).toBe(200);

        const second = await request(

            app.callback()

        )

            .get("/")

            .set(

                "x-user-id",

                "aryan"

            );

        expect(second.status).toBe(429);

    });

    it("should allow different keys", async () => {

        const app = createApp();

        const first = await request(

            app.callback()

        )

            .get("/")

            .set(

                "x-user-id",

                "user-1"

            );

        const second = await request(

            app.callback()

        )

            .get("/")

            .set(

                "x-user-id",

                "user-2"

            );

        expect(first.status).toBe(200);

        expect(second.status).toBe(200);

    });

});